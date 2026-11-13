/* Short synthesized cues, unlocked by a user gesture; no audio tracking or downloads. */
(function studioSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  let context, muted = false, lastCue = '', lastAt = 0;
  try { muted = localStorage.getItem('eda-sfx-muted') === '1'; } catch (_) {}
  const button = document.createElement('button');
  button.id = 'studio-sfx-toggle'; button.type = 'button';
  button.title = 'Activar o silenciar música y efectos (M)';
  document.querySelector('.hud-actions')?.appendChild(button);
  function label() {
    button.textContent = muted ? '♪ Silenciado' : '♪ Sonido';
    button.setAttribute('aria-pressed', String(!muted));
    button.setAttribute('aria-label', muted ? 'Activar música y efectos' : 'Silenciar música y efectos');
    document.dispatchEvent(new CustomEvent('eda:sound-state',{detail:{muted}}));
    if (!Audio) { button.disabled = true; button.textContent = 'Sonido no disponible'; }
  }
  function unlock() {
    if (!Audio || muted) return;
    try { context ||= new Audio(); context.resume().then(()=>{startScore();label();}).catch(() => {}); } catch (_) {}
  }
  // Original ambient score, synthesized locally: warm pads and a restrained arpeggio.
  let cinemaActive=false,score=null;
  function stopScore(){
    if(!score||!context)return;
    const old=score;score=null;const now=context.currentTime;
    old.bus.gain.cancelScheduledValues(now);old.bus.gain.setTargetAtTime(0,now,.10);
    for(const voice of old.voices){try{voice.stop(now+.4)}catch(_){}}
    setTimeout(()=>old.bus.disconnect(),600);
  }
  function startScore(){
    if(!cinemaActive||muted||document.hidden||context?.state!=='running'||score)return;
    const bus=context.createGain(),filter=context.createBiquadFilter(),now=context.currentTime;
    bus.gain.setValueAtTime(0,now);bus.gain.linearRampToValueAtTime(.30,now+1.1);
    filter.type='lowpass';filter.frequency.value=1800;filter.Q.value=.4;
    filter.connect(bus);bus.connect(context.destination);
    const voices=[];score={bus,voices};
    const note=(midi,start,length,level,type='sine',detune=0)=>{
      const osc=context.createOscillator(),env=context.createGain();osc.type=type;osc.detune.value=detune;
      osc.frequency.value=440*Math.pow(2,(midi-69)/12);
      env.gain.setValueAtTime(0,start);env.gain.linearRampToValueAtTime(level,start+Math.min(.8,length*.25));
      env.gain.setTargetAtTime(.0001,start+length*.58,length*.13);
      osc.connect(env);env.connect(filter);osc.start(start);osc.stop(start+length);voices.push(osc);
      osc.onended=()=>{osc.disconnect();env.disconnect();};
    };
    const chords=[[45,52,57,60],[41,48,53,57],[48,55,60,64],[43,50,55,62]];
    chords.forEach((chord,index)=>{
      const at=now+index*3.4;
      chord.forEach((pitch,i)=>note(pitch,at,4.2,.055,'triangle',i%2?3:-3));
      for(let i=0;i<6;i++)note(chord[i%4]+12,at+.35+i*.48,.85,.025);
    });
  }
  document.addEventListener('eda:cinema-start',()=>{cinemaActive=true;stopScore();startScore();});
  document.addEventListener('eda:cinema-stop',()=>{cinemaActive=false;stopScore();});
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
    if (muted) { stopScore();context?.suspend().catch(() => {}); }
    else { unlock(); context?.resume().then(() => play('select')).catch(() => {}); }
    label();
  }
  button.addEventListener('click', toggle);
  document.addEventListener('pointerdown', event=>{if(!event.target.closest?.('#cin-sound'))unlock();}, { capture: true, passive: true });
  document.addEventListener('keydown', event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key.toLowerCase() === 'm' && !event.repeat) { event.preventDefault(); toggle(); } else unlock();
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) {stopScore();context?.suspend().catch(() => {});} });
  window.EDA_SFX = { play, toggle, enable(){muted=false;try{localStorage.setItem('eda-sfx-muted','0')}catch(_){}unlock();label();}, get ready(){return context?.state==='running';}, get muted() { return muted; } };
  label();
})();
