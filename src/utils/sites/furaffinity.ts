import type { SiteRewriter } from "./base";

export const furaffinityRewriter: SiteRewriter = {
	defaultDomain: "xfuraffinity.net",
	domains: ["furaffinity.net"],
	name: "FurAffinity",
	supportedPaths: [String.raw`^/(?:view|full)/\d+/?$`],
	service: "furaffinity",
};
