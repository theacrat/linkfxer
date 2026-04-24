import { getSiteSettings, type DomainSettings } from "./settings";
import {
	matchesSite,
	matchesSiteWithSettings,
	rewriteSiteUrl,
	supportsSiteUrl,
	supportsSiteUrlWithSettings,
	type SiteRewriter,
} from "./sites/base";
import { SITE_REWRITERS } from "./sites/registry";

export const SUPPORTED_CONTEXT_MENU_PATTERNS = SITE_REWRITERS.flatMap((site) =>
	site.domains.flatMap((domain) => [`*://${domain}/*`, `*://*.${domain}/*`]),
);

export function findSiteRewriter(
	hostname: string,
	settings?: DomainSettings,
): SiteRewriter | undefined {
	return SITE_REWRITERS.find((site) =>
		settings
			? matchesSiteWithSettings(site, hostname, settings)
			: matchesSite(site, hostname),
	);
}

export function findSiteRewriterForUrl(
	rawUrl: string,
	settings?: DomainSettings,
): SiteRewriter | undefined {
	return SITE_REWRITERS.find((site) =>
		settings
			? supportsSiteUrlWithSettings(site, rawUrl, settings)
			: supportsSiteUrl(site, rawUrl),
	);
}

export function rewriteUrl(rawUrl: string, settings: DomainSettings) {
	for (const site of SITE_REWRITERS) {
		const rewritten = rewriteSiteUrl(site, rawUrl, settings);

		if (rewritten !== null) {
			return rewritten;
		}
	}

	return rawUrl;
}

export function rewriteText(text: string, settings: DomainSettings) {
	return text.replaceAll(/https?:\/\/[^\s<>"']+/gi, (match) =>
		rewriteUrl(match, settings),
	);
}

function rewriteUrlForCopy(rawUrl: string, settings: DomainSettings) {
	for (const site of SITE_REWRITERS) {
		if (!getSiteSettings(settings, site.service).interceptCopy) {
			continue;
		}

		const rewritten = rewriteSiteUrl(site, rawUrl, settings);

		if (rewritten !== null) {
			return rewritten;
		}
	}

	return rawUrl;
}

export function rewriteCopiedText(text: string, settings: DomainSettings) {
	return text.replaceAll(/https?:\/\/[^\s<>"']+/gi, (match) =>
		rewriteUrlForCopy(match, settings),
	);
}
