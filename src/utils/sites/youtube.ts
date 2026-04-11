import type { SiteRewriter } from "./base";

const SHORTLINK_HOST = "youtu.be";

function isShortLink(url: URL) {
	return url.hostname === SHORTLINK_HOST;
}

export const youtubeRewriter: SiteRewriter = {
	allowedSearchParams: ["v", "t"],
	defaultDomain: "www.koutube.com",
	domains: [SHORTLINK_HOST, "youtube.com"],
	matchUrl: (url) => isShortLink(url) && url.pathname.length > 1,
	name: "YouTube",
	rewriteUrl: (url, replacementHost) => {
		if (isShortLink(url)) {
			const videoId = url.pathname.slice(1).replace(/\/$/, "");
			url.searchParams.append("v", videoId);

			return `https://${replacementHost}/watch${url.search}`;
		}

		url.protocol = "https:";
		url.hostname = replacementHost;
		return url.toString();
	},
	supportedPaths: [
		String.raw`^/[^/]+/?$`,
		String.raw`^/watch/?$`,
		String.raw`^/shorts/[^/]+/?$`,
		String.raw`^/live/[^/]+/?$`,
		String.raw`^/clip/[^/]+/?$`,
	],
	service: "youtube",
};
