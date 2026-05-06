# YouTube Speed Controller

A Chromium extension that adds a popup to your toolbar with:

- An **on/off** toggle
- A **speed slider** from `0.5x` to `2.0x` (default: `2.0x`)

When enabled, YouTube videos play at the chosen speed automatically. When disabled, playback returns to normal (`1.0x`). Settings sync across browsers through `chrome.storage.sync`.

## Install (unpacked, dev mode)

1. Open `chrome://extensions`
2. Toggle **Developer mode** on (top right)
3. Click **Load unpacked**
4. Select this folder

The icon will appear in your toolbar, click it to open the popup.

## files

- `manifest.json` — MV3 manifest
- `popup.html` / `popup.js` — toolbar popup, reads/writes settings
- `content.js` — sets the playback rate, deals with YouTube's SPA nav
- `icon.png` — icon

## notes

YouTube resets `playbackRate` whenever it feels like it (on `play`, `loadeddata`, `ratechange`) and swaps out the `<video>` element entirely on SPA navigation. So the content script just re-applies the rate every time those events fire, and uses a `MutationObserver` to catch new video elements as they appear.

## Credit

Inspired by [dobval/youtube2x](https://github.com/dobval/youtube2x), script which hardcodes 2x playback on YouTube.
This extension aims to widen it, through an UI, a switch and an adjustable slider.

## License

MIT
