# YouTube Speed Controller

A small Chromium extension that adds a popup to your toolbar with:

- An **on/off** toggle
- A **speed slider** from `0.5x` to `2.0x` (default: `2.0x`)

When enabled, YouTube videos play at the chosen speed automatically. When disabled, playback returns to normal (`1.0x`). Settings sync across browsers through `chrome.storage.sync`.

## Install (unpacked, dev mode)

1. Open `chrome://extensions`
2. Toggle **Developer mode** on (top right)
3. Click **Load unpacked**
4. Select this folder

The icon will appear in your toolbar — click it to open the popup.

## Files

| File           | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `manifest.json`| MV3 manifest, declares popup + content script             |
| `popup.html`   | Toolbar popup UI                                          |
| `popup.js`     | Reads/writes settings, broadcasts to YouTube tabs         |
| `content.js`   | Applies `playbackRate` to YouTube videos, re-applies on SPA nav |
| `icon.png`     | Toolbar icon                                              |

## Notes

YouTube's player re-asserts `playbackRate` on `play`, `loadeddata`, and `ratechange` events, and swaps the video element on SPA navigation. The content script handles all of that with a `MutationObserver` plus per-video event listeners, so the chosen speed sticks across video changes and ads.

## Credit

Inspired by [dobval/youtube2x](https://github.com/dobval/youtube2x), ascript that hardcodes 2x playback on YouTube. This extension  UI and an adjustable slider.

## License

MIT
