import type { SiteRewriter } from "./base";

export const youtubeRewriter: SiteRewriter = {
	allowedSearchParams: ["v"],
	defaultDomain: "www.koutube.com",
	domains: ["youtu.be", "youtube.com"],
	name: "YouTube",
	supportedPaths: [
		String.raw`^/[^/]+/?$`,
		String.raw`^/watch/?$`,
		String.raw`^/shorts/[^/]+/?$`,
		String.raw`^/live/[^/]+/?$`,
		String.raw`^/clip/[^/]+/?$`,
	],
	service: "youtube",
};
