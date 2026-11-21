// Senja di Taman Kota — tiny WebAudio sound effects, no audio files.
// Everything is one oscillator blip, made on the first user gesture.

let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when = 0) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ac.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + when);
  osc.stop(ac.currentTime + when + dur + 0.02);
}

export function playPop() {
  tone(620, 0.12, 'sine', 0.25);
  tone(930, 0.1, 'sine', 0.18, 0.05);
}

export function playWrong() {
  tone(160, 0.22, 'square', 0.12);
}

export function playHint() {
  tone(880, 0.14, 'triangle', 0.18);
  tone(1170, 0.16, 'triangle', 0.15, 0.09);
}

export function playRoundClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.2, i * 0.11));
}

export function playGameOver() {
  [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'sine', 0.18, i * 0.16));
}
