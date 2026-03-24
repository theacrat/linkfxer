import type { SiteRewriter } from "./base";

export const facebookRewriter: SiteRewriter = {
	allowedSearchParams: ["fbid", "id", "multi_permalinks", "story_fbid", "v"],
	defaultDomain: "facebed.com",
	domains: ["facebook.com", "fb.watch"],
	name: "Facebook",
	supportedPaths: [
		String.raw`^/[^/]+/posts/[^/]+/?$`,
		String.raw`^/[^/]+/posts/[^/]+/[^/]+/?$`,
		String.raw`^/[^/]+/videos/[^/]+/?$`,
		String.raw`^/share(?:/[rv])?/[^/]+/?$`,
		String.raw`^/reel/\d+/?$`,
		String.raw`^/photo(?:\.php)?/?$`,
		String.raw`^/watch/?$`,
		String.raw`^/permalink\.php/?$`,
		String.raw`^/groups/\d+/?$`,
		String.raw`^/groups/\d+/posts/\d+/?$`,
		String.raw`^/groups/\d+/permalink/\d+/?$`,
	],
	service: "facebook",
};
