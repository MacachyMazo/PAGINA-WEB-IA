/* Short synthesized cues, unlocked by a user gesture; no audio tracking or downloads. */
(function studioSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  let context, muted = false, lastCue = '', lastAt = 0;
  try { muted = localStorage.getItem('eda-sfx-muted') === '1'; } catch (_) {}
  const button = document.createElement('button');
  button.id = 'studio-sfx-toggle'; button.type = 'button';
  button.title = 'Activar o silenciar efectos (M)';
  document.querySelector('.hud-actions')?.appendChild(button);
  function label() {
    button.textContent = muted ? '♪ Silenciado' : '♪ Sonido';
    button.setAttribute('aria-pressed', String(!muted));
    button.setAttribute('aria-label', muted ? 'Activar efectos sonoros' : 'Silenciar efectos sonoros');
    if (!Audio) { button.disabled = true; button.textContent = 'Sonido no disponible'; }
  }
  function unlock() {
    if (!Audio || muted) return;
    try { context ||= new Audio(); if (context.state === 'suspended') context.resume().catch(() => {}); } catch (_) {}
  }
  const cues = {
    open: [[440, 880, .14], [880, 1180, .12, .07]],
    close: [[590, 270, .12]],
    select: [[650, 900, .065]],
    click: [[410, 520, .045]],
    confirm: [[520, 780, .10], [780, 1040, .12, .08]],
    notice: [[240, 210, .10], [210, 180, .08, .11]],
    light: [[1450, 320, .035]]
  };
  function play(name) {
    if (muted || document.hidden || context?.state !== 'running') return;
    const now = performance.now();
    if (name === lastCue && now - lastAt < (name === 'open' ? 400 : 80)) return;
    lastCue = name; lastAt = now;
    for (const [from, to, length, delay = 0] of cues[name] || cues.click) {
      const osc = context.createOscillator(), gain = context.createGain();
      const start = context.currentTime + delay;
      osc.type = name === 'light' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(from, start); osc.frequency.exponentialRampToValueAtTime(to, start + length);
      gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(.035, start + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, start + length);
      osc.connect(gain); gain.connect(context.destination); osc.start(start); osc.stop(start + length + .01);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    }
  }
  function toggle() {
    muted = !muted;
    try { localStorage.setItem('eda-sfx-muted', muted ? '1' : '0'); } catch (_) {}
    if (muted) context?.suspend().catch(() => {});
    else { unlock(); context?.resume().then(() => play('select')).catch(() => {}); }
    label();
  }
  button.addEventListener('click', toggle);
  document.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  document.addEventListener('keydown', event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key.toLowerCase() === 'm' && !event.repeat) { event.preventDefault(); toggle(); } else unlock();
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) context?.suspend().catch(() => {}); });
  window.EDA_SFX = { play, toggle, get muted() { return muted; } };
  label();
})();
