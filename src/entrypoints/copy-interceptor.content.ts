import { rewriteCopiedText } from "@/utils/rewrite";
import {
	getDomainSettings,
	STORAGE_KEY,
	type DomainSettings,
} from "@/utils/settings";

const SETTINGS_MESSAGE_TYPE = "linkfxer:settings-update";

function postSettingsToMainWorld(domainSettings: DomainSettings) {
	window.postMessage(
		{ type: SETTINGS_MESSAGE_TYPE, domainSettings },
		window.location.origin,
	);
}

export default defineContentScript({
	matches: ["<all_urls>"],
	runAt: "document_idle",

	async main() {
		let domainSettings: DomainSettings = await getDomainSettings();

		postSettingsToMainWorld(domainSettings);

		browser.storage.onChanged.addListener((changes, area) => {
			if (area !== "sync" || !changes[STORAGE_KEY]) {
				return;
			}

			void updateDomainSettings();
		});

		async function updateDomainSettings() {
			domainSettings = await getDomainSettings();
			postSettingsToMainWorld(domainSettings);
		}

		document.addEventListener("copy", (event) => {
			if (!event.clipboardData) {
				return;
			}

			const selection = window.getSelection();

			if (!selection) {
				return;
			}

			const selectedText = selection.toString();

			if (!selectedText) {
				return;
			}

			const rewritten = rewriteCopiedText(selectedText, domainSettings);

			if (rewritten !== selectedText) {
				event.clipboardData.setData("text/plain", rewritten);
				event.preventDefault();
			}
		});
	},
});
