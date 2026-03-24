import type { SiteRewriter } from "./base";

export const redditRewriter: SiteRewriter = {
	defaultDomain: "rxddit.com",
	domains: ["reddit.com"],
	name: "Reddit",
	supportedPaths: [
		String.raw`^/r/[^/]+/?$`,
		String.raw`^/r/[^/]+/comments/[A-Za-z0-9]+/?$`,
		String.raw`^/r/[^/]+/comments/[A-Za-z0-9]+/[^/]+/?$`,
		String.raw`^/r/[^/]+/comments/[A-Za-z0-9]+/[^/]+/[A-Za-z0-9]+/?$`,
		String.raw`^/r/[^/]+/s/[A-Za-z0-9]+/?$`,
		String.raw`^/r/[^/]+/wiki/[^/]+/?$`,
		String.raw`^/[A-Za-z0-9]+/?$`,
		String.raw`^/u/[^/]+/?$`,
		String.raw`^/user/[^/]+/?$`,
	],
	service: "reddit",
};
