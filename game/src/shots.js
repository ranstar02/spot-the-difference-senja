// Senja di Taman Kota — deterministic screenshot frames.
// ?shot=title|play|found|clear&seed=1 drives the game into a fixed frame
// so screenshots are reproducible renders of the real game code.
// The timer is frozen in shot mode: the frame never changes on its own.

import { roundDiffs } from './differences.js';

function firstN(round, n) {
  return roundDiffs(round).slice(0, n).map((d) => d.id);
}

export function applyShot(state, search) {
  const params = new URLSearchParams(search);
  const shot = params.get('shot');
  if (!shot) return false;
  state.frozen = true;
  state.shot = shot;
  if (shot === 'title') {
    state.screen = 'title';
    state.round = 1;
    return true;
  }
  if (shot === 'play') {
    state.screen = 'playing';
    state.round = 1;
    state.found = new Set(firstN(1, 3));
    state.score = 300;
    state.roundScore = 300;
    state.timeLeft = 62;
    state.hintsLeft = 2;
    return true;
  }
  if (shot === 'found') {
    state.screen = 'playing';
    state.round = 1;
    state.found = new Set(firstN(1, 6));
    state.score = 600;
    state.roundScore = 600;
    state.timeLeft = 34;
    state.hintsLeft = 1;
    return true;
  }
  if (shot === 'clear') {
    state.screen = 'roundClear';
    state.round = 1;
    state.found = new Set(firstN(1, 7));
    state.score = 850;
    state.roundScore = 850;
    state.lastBonus = 150;
    state.timeLeft = 45;
    return true;
  }
  return false;
}
