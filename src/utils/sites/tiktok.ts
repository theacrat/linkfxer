import type { SiteRewriter } from "./base";

export const tiktokRewriter: SiteRewriter = {
	defaultDomain: "tnktok.com",
	domains: ["tiktok.com"],
	name: "TikTok",
	supportedPaths: [
		String.raw`^/@[^/]+/video/\d+/?$`,
		String.raw`^/t/[A-Za-z0-9]+/?$`,
		String.raw`^/embed/v\d+/?$`,
	],
	service: "tiktok",
};
