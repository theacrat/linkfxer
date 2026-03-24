import type { SiteRewriter } from "./base";

export const threadsRewriter: SiteRewriter = {
	defaultDomain: "fixthreads.seria.moe",
	domains: ["threads.com", "threads.net"],
	name: "Threads",
	supportedPaths: [String.raw`^/@[^/]+/post/[A-Za-z0-9]+/?$`],
	service: "threads",
};
