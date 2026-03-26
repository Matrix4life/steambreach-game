// soundEngine.js
// STEAMBREACH Audio Engine — Web Audio API, zero dependencies
// Drop into src/audio/soundEngine.js

let ctx = null;
let masterGain = null;
let enabled = true;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function osc(type, freq, startTime, duration, gainVal = 0.3, destination = null) {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  g.gain.setValueAtTime(gainVal, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  o.connect(g);
  g.connect(destination || masterGain);
  o.start(startTime);
  o.stop(startTime + duration);
  return { osc: o, gain: g };
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

export function setVolume(val) {
  if (masterGain) masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), getCtx().currentTime);
}

export function setSoundEnabled(val) {
  enabled = val;
}

/** Ascending sting — successful exploit / command accepted */
export function playSuccess() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  osc('sine', 440, t,        0.12, 0.25);
  osc('sine', 550, t + 0.08, 0.12, 0.25);
  osc('sine', 660, t + 0.16, 0.18, 0.3);
}

/** Harsh buzz — command failed / wrong syntax */
export function playFailure() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  osc('sawtooth', 180, t,        0.1, 0.3);
  osc('sawtooth', 140, t + 0.07, 0.14, 0.25);
  osc('square',   100, t + 0.14, 0.1, 0.15);
}

/** Satisfying "root shell" tone — pwnkit / privilege escalation */
export function playRootShell() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  // Cinematic low-to-high sweep
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(220, t);
  o.frequency.exponentialRampToValueAtTime(880, t + 0.4);
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(g);
  g.connect(masterGain);
  o.start(t);
  o.stop(t + 0.6);
  // Harmonic layer
  osc('triangle', 440, t + 0.2, 0.3, 0.15);
}

/** Data-transfer whir — exfil / download */
export function playExfil() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  // Rapid frequency bursts simulating data packets
  for (let i = 0; i < 6; i++) {
    const freq = 300 + Math.random() * 400;
    osc('square', freq, t + i * 0.06, 0.05, 0.12);
  }
  osc('sine', 800, t + 0.36, 0.15, 0.2);
}

/** Pulsing alarm — trace warning (>75%) */
export function playTraceWarning() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  for (let i = 0; i < 3; i++) {
    osc('square', 880, t + i * 0.22,       0.1, 0.2);
    osc('square', 660, t + i * 0.22 + 0.1, 0.08, 0.15);
  }
}

/** Sharp burst — heat spike alert */
export function playHeatSpike() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  // Single sharp attack
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(1200, t);
  o.frequency.exponentialRampToValueAtTime(200, t + 0.25);
  g.gain.setValueAtTime(0.4, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  o.connect(g);
  g.connect(masterGain);
  o.start(t);
  o.stop(t + 0.25);
}

/** Soft blip — UI navigation / menu selection */
export function playBlip() {
  if (!enabled) return;
  const c = getCtx();
  osc('sine', 600, c.currentTime, 0.07, 0.15);
}

/** Deep thud — node destroyed / shred / wipe */
export function playDestroy() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  osc('sawtooth', 80,  t,        0.3, 0.4);
  osc('square',   60,  t + 0.05, 0.3, 0.3);
  osc('sine',     40,  t + 0.1,  0.4, 0.35);
}

/** Glitchy chirp — sliver beacon deployed / C2 established */
export function playBeacon() {
  if (!enabled) return;
  const c = getCtx();
  const t = c.currentTime;
  osc('square', 1200, t,        0.04, 0.2);
  osc('square', 900,  t + 0.05, 0.04, 0.2);
  osc('square', 1500, t + 0.1,  0.04, 0.2);
  osc('sine',   600,  t + 0.18, 0.12, 0.15);
}
