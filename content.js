(() => {
  const DEFAULTS = {
    enabled: true,
    activeRange: 'low',
    lowSpeed: 2.0,                                // Defaults
    highSpeed: 2.0,
  };
  let state = { ...DEFAULTS };
  let tracked = new WeakSet();

                                                  // Experimental
  function effectiveSpeed() {
    if (!state.enabled) return 1.0;
    return state.activeRange === 'high' ? state.highSpeed : state.lowSpeed;
  }

  function applyTo(video) {
    if (!video) return;
    const target = effectiveSpeed();
    if (Math.abs(video.playbackRate - target) > 0.001) {
      video.playbackRate = target;
    }
  }

  function applyAll() {
    document.querySelectorAll('video').forEach(applyTo);
  }

  function track(video) {
    if (tracked.has(video)) return;
    tracked.add(video);
                                                  // YouTube re-asserts playbackRate on play/loadeddata/ratechange, re-apply each time.
    const reapply = () => applyTo(video);
    video.addEventListener('loadeddata', reapply);
    video.addEventListener('play', reapply);
    video.addEventListener('playing', reapply);
    video.addEventListener('ratechange', reapply);
    applyTo(video);
  }

                                                  // Watch for video elements changing (SPA nav, ads, etc.)
  const mo = new MutationObserver(() => {
    document.querySelectorAll('video').forEach(track);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

                                                  // Initial pass
  document.querySelectorAll('video').forEach(track);

                                                  // Storage sync across popup and tabs
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.enabled) state.enabled = changes.enabled.newValue;
    if (changes.activeRange) state.activeRange = changes.activeRange.newValue;
    if (changes.lowSpeed) state.lowSpeed = changes.lowSpeed.newValue;
    if (changes.highSpeed) state.highSpeed = changes.highSpeed.newValue;
    applyAll();
  });

                                                  // Load initial state
  chrome.storage.sync.get(DEFAULTS, (s) => {
    state = { ...DEFAULTS, ...s };
    applyAll();
  });
})();