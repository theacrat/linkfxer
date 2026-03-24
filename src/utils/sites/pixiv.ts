import type { SiteRewriter } from "./base";

export const pixivRewriter: SiteRewriter = {
	defaultDomain: "phixiv.net",
	domains: ["pixiv.net"],
	name: "Pixiv",
	supportedPaths: [String.raw`^/(?:[a-z]{2}/)?artworks/\d+/?$`],
	service: "pixiv",
};
