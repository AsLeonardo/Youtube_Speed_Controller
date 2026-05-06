const DEFAULTS = { enabled: true, speed: 2.0 };

const enabledEl = document.getElementById('enabled');
const speedEl = document.getElementById('speed');
const speedValueEl = document.getElementById('speedValue');
const controlsEl = document.getElementById('controls');

function render({ enabled, speed }) {
  enabledEl.checked = enabled;
  speedEl.value = speed;
  speedEl.disabled = !enabled;
  speedValueEl.textContent = Number(speed).toFixed(2);
  controlsEl.classList.toggle('disabled', !enabled);
}

async function broadcast(state) {
  const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, { type: 'YT_SPEED_UPDATE', ...state })
      .catch(() => { /*tab may not contain script ready yet, storage caches it*/ });
  }
}

async function save(partial) {
  const current = await chrome.storage.sync.get(DEFAULTS);
  const next = { ...current, ...partial };
  await chrome.storage.sync.set(next);
  render(next);
  broadcast(next);
}

(async () => {
  const state = await chrome.storage.sync.get(DEFAULTS);
  render(state);
})();

enabledEl.addEventListener('change', () => save({ enabled: enabledEl.checked }));

speedEl.addEventListener('input', () => {
  // update display without infinite write
  speedValueEl.textContent = Number(speedEl.value).toFixed(2);
});
speedEl.addEventListener('change', () => save({ speed: parseFloat(speedEl.value) }));
