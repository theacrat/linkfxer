import { getCustomDomains, type DomainSettings } from "@/utils/settings";

type MatchUrl = (url: URL) => boolean;
type RewriteUrl = (url: URL, replacementHost: string) => string;

export type SiteRewriter = {
	allowedSearchParams?: readonly string[];
	defaultDomain: string;
	domains: readonly string[];
	matchUrl?: MatchUrl;
	name: string;
	supportedPaths: readonly string[];
	rewriteUrl?: RewriteUrl;
	service: string;
};

export function matchesSite(site: SiteRewriter, hostname: string) {
	return site.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function matchesHostname(hostname: string, domains: readonly string[]) {
	return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function matchesSupportedPath(site: SiteRewriter, pathname: string) {
	return site.supportedPaths.some((pattern) => new RegExp(pattern, "i").test(pathname));
}

function getSourceDomains(site: SiteRewriter, settings?: DomainSettings) {
	if (!settings) {
		return site.domains;
	}

	return [...site.domains, ...getCustomDomains(settings, site.service)];
}

function matchesSupportedUrl(site: SiteRewriter, url: URL, settings?: DomainSettings) {
	if (site.matchUrl) {
		return (
			site.matchUrl(url) ||
			(matchesHostname(url.hostname, getSourceDomains(site, settings)) &&
				matchesSupportedPath(site, url.pathname))
		);
	}

	return (
		matchesHostname(url.hostname, getSourceDomains(site, settings)) &&
		matchesSupportedPath(site, url.pathname)
	);
}

function stripQueryParams(url: URL, allowedParams: readonly string[] = []) {
	const allowed = new Set(allowedParams);
	const kept = new URLSearchParams();

	for (const [key, value] of url.searchParams) {
		if (allowed.has(key)) {
			kept.append(key, value);
		}
	}

	url.search = kept.toString();
}

export function rewriteSiteUrl(site: SiteRewriter, rawUrl: string, settings: DomainSettings) {
	try {
		const url = new URL(rawUrl);

		if (!matchesSupportedUrl(site, url, settings)) {
			return null;
		}

		stripQueryParams(url, site.allowedSearchParams);

		const replacementHost = settings[site.service].targetDomain;

		if (replacementHost) {
			if (site.rewriteUrl) {
				return site.rewriteUrl(url, replacementHost);
			}

			url.protocol = "https:";
			url.hostname = replacementHost;
		}

		return url.toString();
	} catch {
		return rawUrl;
	}
}

export function supportsSiteUrl(site: SiteRewriter, rawUrl: string) {
	try {
		const url = new URL(rawUrl);
		return matchesSupportedUrl(site, url);
	} catch {
		return false;
	}
}

export function supportsSiteUrlWithSettings(
	site: SiteRewriter,
	rawUrl: string,
	settings: DomainSettings,
) {
	try {
		const url = new URL(rawUrl);
		return matchesSupportedUrl(site, url, settings);
	} catch {
		return false;
	}
}

export function matchesSiteWithSettings(
	site: SiteRewriter,
	hostname: string,
	settings: DomainSettings,
) {
	return matchesHostname(hostname, getSourceDomains(site, settings));
}
