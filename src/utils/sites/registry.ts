// oxlint-disable import/max-dependencies
import { bilibiliRewriter } from "./bilibili";
import { blueskyRewriter } from "./bluesky";
import { deviantartRewriter } from "./deviantart";
import { facebookRewriter } from "./facebook";
import { furaffinityRewriter } from "./furaffinity";
import { instagramRewriter } from "./instagram";
import { newgroundsRewriter } from "./newgrounds";
import { pixivRewriter } from "./pixiv";
import { redditRewriter } from "./reddit";
import { spotifyRewriter } from "./spotify";
import { threadsRewriter } from "./threads";
import { tiktokRewriter } from "./tiktok";
import { tumblrRewriter } from "./tumblr";
import { twitchRewriter } from "./twitch";
import { twitterRewriter } from "./twitter";
import { youtubeRewriter } from "./youtube";

export const SITE_REWRITERS = [
	bilibiliRewriter,
	blueskyRewriter,
	deviantartRewriter,
	facebookRewriter,
	furaffinityRewriter,
	instagramRewriter,
	newgroundsRewriter,
	pixivRewriter,
	redditRewriter,
	spotifyRewriter,
	threadsRewriter,
	tiktokRewriter,
	tumblrRewriter,
	twitterRewriter,
	twitchRewriter,
	youtubeRewriter,
] as const;
