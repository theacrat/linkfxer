import { rewriteCopiedText } from "@/utils/rewrite";
import type { DomainSettings } from "@/utils/settings";

const SETTINGS_MESSAGE_TYPE = "linkfxer:settings-update";

type SettingsMessage = {
	domainSettings: DomainSettings;
	type: typeof SETTINGS_MESSAGE_TYPE;
};

function isSettingsMessage(data: unknown): data is SettingsMessage {
	if (!data || typeof data !== "object") {
		return false;
	}

	return Reflect.get(data, "type") === SETTINGS_MESSAGE_TYPE;
}

export default defineContentScript({
	matches: ["<all_urls>"],
	runAt: "document_start",
	world: "MAIN",

	main() {
		let domainSettings: DomainSettings | null = null;

		window.addEventListener("message", (event) => {
			if (event.source !== window || !isSettingsMessage(event.data)) {
				return;
			}

			({ domainSettings } = event.data);
		});

		const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);

		navigator.clipboard.writeText = async (text: string) => {
			if (domainSettings) {
				const rewritten = rewriteCopiedText(text, domainSettings);
				return originalWriteText(rewritten);
			}

			return originalWriteText(text);
		};
	},
});
