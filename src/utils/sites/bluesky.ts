import type { SiteRewriter } from "./base";

export const blueskyRewriter: SiteRewriter = {
	defaultDomain: "fxbsky.app",
	domains: ["bsky.app"],
	name: "Bluesky",
	supportedPaths: ["^/profile/[^/]+/post/[A-Za-z0-9]+/?$"],
	service: "bluesky",
};
