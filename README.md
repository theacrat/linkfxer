# LinkFxer

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/npncanggblbfagfdlffipggblfildlji?style=flat-square&logo=googlechrome&logoColor=white&color=%234285F4)](https://chromewebstore.google.com/detail/linkfxer/npncanggblbfagfdlffipggblfildlji)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/linkfxer?style=flat-square&logo=firefoxbrowser&logoColor=white&color=%23FF7139)
](https://addons.mozilla.org/addon/linkfxer/)

LinkFxer is a browser extension that rewrites copied sharing URLs from:

- BiliBili -> BiliFix
- Bluesky -> FxBluesky
- DeviantArt -> fixdeviantart
- Facebook -> facebed
- FurAffinity -> xfuraffinity
- Instagram -> InstaFix
- Newgrounds -> FixNewgrounds
- Pixiv -> phixiv
- Reddit -> FixReddit
- Spotify -> fxspotify
- Threads -> FixThreads
- TikTok -> fxTikTok
- Tumblr -> fxtumblr
- Twitch -> fxtwitch
- Twitter / X -> FxTwitter
- YouTube -> Koutube

You can set the target domain for each service and optionally add custom source domains for alternate frontends or extra instance hosts.

## Local Setup

The [wxt](https://wxt.dev/) browser extension framework is used to handle building and browser functions.

### Installation

```sh
# Install dependencies
bun install --frozen-lockfile
```

### Development

This will create a dev server with HMR and fast reload.

```sh
# Chromium
bun run dev

# Firefox
bun run dev:firefox
```

### Building

This will build the extension to a folder in `.output`.

```sh
# Chromium
bun run build

# Firefox
bun run build:firefox
```

### Packaging

This will build and ZIP the extension to `.output`.

```sh
# Chromium
bun run zip

# Firefox
bun run zip:firefox
```

## Licence

LinkFxer

Copyright (C) 2026 thea

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

```
SPDX-License-Identifier: AGPL-3.0-or-later
```
