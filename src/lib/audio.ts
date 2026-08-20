let ctx: AudioContext | null = null;
let lobby = false;
let timer: number | null = null;
let musicMuted = false;

function ac() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function beep(freq: number, dur: number, type: OscillatorType = 'square', gain = 0.06) {
  const c = ac();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(c.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.stop(c.currentTime + dur);
}

export function playCorrect() {
  beep(523, 0.12);
  setTimeout(() => beep(784, 0.18), 90);
}

export function playWrong() {
  beep(180, 0.28, 'sawtooth', 0.05);
}

export function playTick() {
  beep(880, 0.06, 'square', 0.04);
}

export function isLobbyMusicMuted() {
  return musicMuted;
}

export function setLobbyMusicMuted(muted: boolean) {
  musicMuted = muted;
  if (muted) stopLobbyMusic();
}

export function startLobbyMusic() {
  if (lobby || musicMuted) return;
  lobby = true;
  const notes = [392, 494, 587, 494, 523, 392, 440, 494];
  let i = 0;
  const loop = () => {
    if (!lobby) return;
    beep(notes[i % notes.length], 0.14, 'triangle', 0.03);
    i += 1;
    timer = window.setTimeout(loop, 280);
  };
  loop();
}

export function stopLobbyMusic() {
  lobby = false;
  if (timer) window.clearTimeout(timer);
  timer = null;
}
