import type { SiteRewriter } from "./base";

export const newgroundsRewriter: SiteRewriter = {
	defaultDomain: "fixnewgrounds.com",
	domains: ["newgrounds.com"],
	name: "Newgrounds",
	supportedPaths: [String.raw`^/art/view/[^/]+/[^/]+/?$`],
	service: "newgrounds",
};
