import type { SiteRewriter } from "./base";

export const tumblrRewriter: SiteRewriter = {
	defaultDomain: "tpmblr.com",
	domains: ["tumblr.com"],
	name: "Tumblr",
	supportedPaths: [
		String.raw`^/[^/]+/post/\d+(?:/[^/]+)?/?$`,
		String.raw`^/blog/view/[^/]+/\d+/?$`,
	],
	service: "tumblr",
};
