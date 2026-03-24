import {
	findSiteRewriterForUrl,
	rewriteUrl,
	SUPPORTED_CONTEXT_MENU_PATTERNS,
} from "@/utils/rewrite";
import { getDomainSettings } from "@/utils/settings";

const CONTEXT_MENU_ID = "share-current-page-fixed";
const CONTEXT_MENU_TITLE = "Copy Fxed link";

async function createContextMenu() {
	await browser.contextMenus.removeAll();
	browser.contextMenus.create({
		contexts: ["link", "page"],
		documentUrlPatterns: SUPPORTED_CONTEXT_MENU_PATTERNS,
		id: CONTEXT_MENU_ID,
		targetUrlPatterns: SUPPORTED_CONTEXT_MENU_PATTERNS,
		title: CONTEXT_MENU_TITLE,
	});
}

async function copyTextInTab(tabId: number, text: string) {
	await browser.scripting.executeScript({
		args: [text],
		func: async (value: string) => {
			await navigator.clipboard.writeText(value);
		},
		target: { tabId },
	});
}

async function notifyUnsupportedPath(tabId: number) {
	await browser.scripting.executeScript({
		args: ["This URL is on a supported site, but its path is not supported."],
		func: (message: string) => {
			// oxlint-disable-next-line no-alert
			alert(message);
		},
		target: { tabId },
	});
}

function watchContextMenuClicks() {
	browser.contextMenus.onClicked.addListener((info, tab) => {
		if (info.menuItemId !== CONTEXT_MENU_ID || !tab?.id) {
			return;
		}

		const { id: tabId } = tab;
		const targetUrl = info.linkUrl ?? tab.url;

		if (!targetUrl) {
			return;
		}

		void (async () => {
			const settings = await getDomainSettings();

			if (!findSiteRewriterForUrl(targetUrl, settings)) {
				await notifyUnsupportedPath(tabId);
				return;
			}

			const fixedUrl = rewriteUrl(targetUrl, settings);
			await copyTextInTab(tabId, fixedUrl);
		})();
	});
}

export default defineBackground(() => {
	void browser.runtime.id;
	void createContextMenu();

	browser.runtime.onInstalled.addListener(() => {
		void createContextMenu();
	});

	watchContextMenuClicks();
});
