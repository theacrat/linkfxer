import type { SiteRewriter } from "./base";

export const bilibiliRewriter: SiteRewriter = {
	allowedSearchParams: ["p"],
	defaultDomain: "vxbilibili.com",
	domains: ["b23.tv", "bilibili.com"],
	name: "BiliBili",
	supportedPaths: [
		String.raw`^/[A-Za-z0-9]+/?$`,
		String.raw`^/video/(?:BV[0-9A-Za-z]+|av\d+)/?$`,
		String.raw`^/bangumi/play/(?:ep|ss)\d+/?$`,
		String.raw`^/opus/\d+/?$`,
		String.raw`^/read/cv\d+/?$`,
		String.raw`^/t/topic/\d+/?$`,
	],
	service: "bilibili",
};
