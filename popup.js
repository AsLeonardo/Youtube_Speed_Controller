const DEFAULTS = {
  enabled: true,
  activeRange: 'low',                                     // defaults
  lowSpeed: 2.0,
  highSpeed: 2.0,
};

const enabledEl = document.getElementById('enabled');
const lowSpeedEl = document.getElementById('lowSpeed');
const highSpeedEl = document.getElementById('highSpeed');
const lowBlock = document.getElementById('lowBlock');
const highBlock = document.getElementById('highBlock');
const speedValueEl = document.getElementById('speedValue');
const controlsEl = document.getElementById('controls');

let state = { ...DEFAULTS };

function activeSpeed(s) {
  return s.activeRange === 'high' ? s.highSpeed : s.lowSpeed;
}

function render(s) {
  enabledEl.checked = s.enabled;
  lowSpeedEl.value = s.lowSpeed;
  highSpeedEl.value = s.highSpeed;
  speedValueEl.textContent = Number(activeSpeed(s)).toFixed(2);

  lowBlock.classList.toggle('inactive', s.activeRange !== 'low');
  highBlock.classList.toggle('inactive', s.activeRange !== 'high');

  controlsEl.classList.toggle('disabled', !s.enabled);
}

async function save(partial) {
  state = { ...state, ...partial };
  await chrome.storage.sync.set(state);
  render(state);
}

(async () => {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  state = { ...DEFAULTS, ...stored };
  render(state);
})();

enabledEl.addEventListener('change', () => save({ enabled: enabledEl.checked }));

                                                          // activates before the input starts tracking the drag
function wireActivation(block, rangeName) {
  block.addEventListener('pointerdown', () => {
    if (state.activeRange !== rangeName) {
      save({ activeRange: rangeName });
      }
  }, true);                                               // capture phase, before the range input handles it
}
wireActivation(lowBlock, 'low');
wireActivation(highBlock, 'high');

                                                          // update display without infinite write
function wireLive(input, key) {
  input.addEventListener('input', () => {
    state[key] = parseFloat(input.value);
    if (
      (key === 'lowSpeed' && state.activeRange === 'low') ||
      (key === 'highSpeed' && state.activeRange === 'high')
    ) {
      speedValueEl.textContent = Number(input.value).toFixed(2);
    }
  });
}
wireLive(lowSpeedEl, 'lowSpeed');
wireLive(highSpeedEl, 'highSpeed');

                                                          // commit when release
lowSpeedEl.addEventListener('change', () => {
  save({ lowSpeed: parseFloat(lowSpeedEl.value), activeRange: 'low' });
});
highSpeedEl.addEventListener('change', () => {
  save({ highSpeed: parseFloat(highSpeedEl.value), activeRange: 'high' });
});