// Senja di Taman Kota — game state, rules and the animation loop.
// Wires input.js, render.js, audio.js and shots.js together.

import {
  CANVAS_W, CANVAS_H, ROUND_TIME, HINTS_PER_ROUND, WRONG_CLICK_PENALTY,
  FIND_POINTS, TIME_BONUS_PER_SECOND, TOTAL_ROUNDS,
} from './config.js';
import { roundDiffs } from './differences.js';
import { bindInput, panelAt } from './input.js';
import { drawGame, HINT_BTN, RESTART_BTN, inRect } from './render.js';
import { applyShot } from './shots.js';
import { playPop, playWrong, playHint, playRoundClear, playGameOver } from './audio.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

function freshState(round) {
  return {
    screen: 'playing',
    round,
    found: new Set(),
    score: 0,
    roundScore: 0,
    timeLeft: ROUND_TIME,
    hintsLeft: HINTS_PER_ROUND,
    hintPulse: null,
    shakeUntil: 0,
    wrongFlash: null,
    message: '',
    messageColor: '#7dff9b',
    messageUntil: 0,
    lastBonus: 0,
    frozen: false,
    shot: null,
  };
}

const state = freshState(1);
state.screen = 'title';
state.totalScore = 0;

let lastTick = performance.now();

function startRound(round, keepScore) {
  const score = keepScore ? state.score : 0;
  const next = freshState(round);
  next.score = score;
  Object.assign(state, next);
  state.screen = 'playing';
  announce(`Ronde ${round}. Temukan 7 perbedaan, waktu ${ROUND_TIME} detik.`);
}

function announce(text) {
  if (statusEl) statusEl.textContent = text;
}

function showMessage(text, color) {
  state.message = text;
  state.messageColor = color || '#7dff9b';
  state.messageUntil = performance.now() + 1400;
}

function useHint() {
  if (state.screen !== 'playing' || state.frozen) return;
  if (state.hintsLeft <= 0) {
    showMessage('Hint habis!', '#ff5d5d');
    return;
  }
  const remaining = roundDiffs(state.round).filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.hintPulse = { id: pick.id, until: performance.now() + 2200 };
  playHint();
  showMessage('Hint: lihat lingkaran pink berdenyut!', '#ff9ec4');
}

function onPanelClick(px, py) {
  const diffs = roundDiffs(state.round);
  for (const d of diffs) {
    if (state.found.has(d.id)) continue;
    const dx = px - d.x;
    const dy = py - d.y;
    if (dx * dx + dy * dy <= (d.r + 6) * (d.r + 6)) {
      state.found.add(d.id);
      state.score += FIND_POINTS;
      state.roundScore += FIND_POINTS;
      playPop();
      const left = diffs.length - state.found.size;
      showMessage(left === 0 ? 'Semua ketemu!' : `Ketemu! +${FIND_POINTS} · Sisa ${left}`);
      announce(`Ketemu ${d.label}. Sisa ${left} perbedaan.`);
      if (state.found.size === diffs.length) {
        const bonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
        state.lastBonus = bonus;
        state.score += bonus;
        state.roundScore += bonus;
        state.screen = 'roundClear';
        playRoundClear();
      }
      return;
    }
  }
  // No difference there: lose five seconds and shake the frame.
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_PENALTY);
  state.shakeUntil = performance.now() + 320;
  state.wrongFlash = { x: px, y: py, until: performance.now() + 500 };
  playWrong();
  showMessage(`Salah! −${WRONG_CLICK_PENALTY} detik`, '#ff5d5d');
}

function onPointer(x, y) {
  if (state.screen === 'title') {
    startRound(1, false);
    return;
  }
  if (state.screen === 'roundClear') {
    if (state.round < TOTAL_ROUNDS) startRound(state.round + 1, true);
    else state.screen = 'win';
    return;
  }
  if (state.screen === 'gameOver' || state.screen === 'win') {
    state.screen = 'title';
    state.round = 1;
    state.found = new Set();
    state.score = 0;
    return;
  }
  if (state.screen !== 'playing') return;
  if (inRect(x, y, HINT_BTN)) { useHint(); return; }
  if (inRect(x, y, RESTART_BTN)) { startRound(state.round, false); return; }
  const hit = panelAt(x, y);
  if (hit) onPanelClick(hit.px, hit.py);
}

function onRoundKey(n) {
  if (state.screen === 'title' && n >= 1 && n <= TOTAL_ROUNDS) startRound(n, false);
}

function onConfirm() {
  if (state.screen === 'title') startRound(1, false);
  else if (state.screen === 'roundClear') onPointer(-1, -1);
}

bindInput(canvas, {
  onPointer,
  onHint: useHint,
  onRestart: () => {
    if (state.screen === 'playing' || state.screen === 'gameOver' || state.screen === 'win') {
      startRound(state.screen === 'playing' ? state.round : 1, false);
    }
  },
  onRoundKey,
  onConfirm,
});

applyShot(state, window.location.search);

function tick(now) {
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  if (state.screen === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'gameOver';
      playGameOver();
      announce(`Waktu habis. Kamu menemukan ${state.found.size} dari 7 perbedaan.`);
    }
  }
  drawGame(canvas.getContext('2d'), state, now);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
