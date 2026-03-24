import type { SiteRewriter } from "./base";

export const instagramRewriter: SiteRewriter = {
	defaultDomain: "fxstagram.com",
	domains: ["instagram.com"],
	name: "Instagram",
	supportedPaths: [
		String.raw`^/p/[A-Za-z0-9_-]+/?$`,
		String.raw`^/[^/]+/p/[A-Za-z0-9_-]+/?$`,
		String.raw`^/reel/[A-Za-z0-9_-]+/?$`,
		String.raw`^/reels/[A-Za-z0-9_-]+/?$`,
		String.raw`^/[^/]+/reel/[A-Za-z0-9_-]+/?$`,
		String.raw`^/tv/[A-Za-z0-9_-]+/?$`,
		String.raw`^/share/[A-Za-z0-9_-]+/?$`,
		String.raw`^/share/p/[A-Za-z0-9_-]+/?$`,
		String.raw`^/share/reel/[A-Za-z0-9_-]+/?$`,
		String.raw`^/stories/[^/]+/\d+/?$`,
	],
	service: "instagram",
};
