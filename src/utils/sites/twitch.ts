import type { SiteRewriter } from "./base";

export const twitchRewriter: SiteRewriter = {
	defaultDomain: "fxtwitch.seria.moe",
	domains: ["clips.twitch.tv", "twitch.tv"],
	name: "Twitch",
	supportedPaths: [
		String.raw`^/[^/]+/?$`,
		String.raw`^/videos/\d+/?$`,
		String.raw`^/[^/]+/clip/[^/]+/?$`,
	],
	service: "twitch",
};
