import type { SiteRewriter } from "./base";

export const spotifyRewriter: SiteRewriter = {
	defaultDomain: "fxspotify.com",
	domains: ["open.spotify.com"],
	name: "Spotify",
	supportedPaths: [String.raw`^/(?:track)/[A-Za-z0-9]+/?$`],
	service: "spotify",
};
