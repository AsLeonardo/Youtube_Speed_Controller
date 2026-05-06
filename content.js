(() => {
  const DEFAULTS = { enabled: true, speed: 2.0 };
  let state = { ...DEFAULTS };
  let tracked = new WeakSet();

  function applyTo(video) {
    if (!video) return;
    const target = state.enabled ? state.speed : 1.0;
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

  // Watch for video elements being added/removed (SPA nav, ads, etc.)
  const mo = new MutationObserver(() => {
    document.querySelectorAll('video').forEach(track);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Initial pass
  document.querySelectorAll('video').forEach(track);

  // Listen for popup updates
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'YT_SPEED_UPDATE') {
      state = { enabled: !!msg.enabled, speed: Number(msg.speed) || 1.0 };
      applyAll();
    }
  });

  // Also pick up changes via storage (covers tabs that were closed/reopened
  // and keeps multiple tabs in sync without needing a sendMessage round-trip)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.enabled) state.enabled = changes.enabled.newValue;
    if (changes.speed) state.speed = changes.speed.newValue;
    applyAll();
  });

  // Load initial state from storage
  chrome.storage.sync.get(DEFAULTS, (s) => {
    state = { ...DEFAULTS, ...s };
    applyAll();
  });
})();
