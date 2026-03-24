import type { SiteRewriter } from "./base";

export const twitterRewriter: SiteRewriter = {
	defaultDomain: "fxtwitter.com",
	domains: ["twitter.com", "x.com"],
	name: "Twitter / X",
	supportedPaths: [String.raw`^/[A-Za-z0-9_]+/status/\d+/?$`],
	service: "twitter",
};
