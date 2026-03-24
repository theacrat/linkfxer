import type { SiteRewriter } from "./base";

export const deviantartRewriter: SiteRewriter = {
	defaultDomain: "fixdeviantart.com",
	domains: ["deviantart.com", "fav.me"],
	name: "DeviantArt",
	supportedPaths: [String.raw`^/[A-Za-z0-9]+/?$`, String.raw`^/[^/]+/art/[^/]+/?$`],
	service: "deviantart",
};
