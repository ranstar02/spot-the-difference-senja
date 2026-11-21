// Senja di Taman Kota — shared constants for the whole game.
// One canvas, 1280x720, two park panels side by side under a HUD strip.

export const CANVAS_W = 1280;
export const CANVAS_H = 720;

export const HUD_H = 86;

export const PANEL_W = 600;
export const PANEL_H = 600;
export const PANEL_Y = 86;
export const LEFT_X = 20;
export const RIGHT_X = 660;

export const ROUND_TIME = 90; // seconds per round
export const HINTS_PER_ROUND = 3;
export const WRONG_CLICK_PENALTY = 5; // seconds
export const FIND_POINTS = 100;
export const TIME_BONUS_PER_SECOND = 5;

export const ROUND_NAMES = {
  1: 'Ronde 1 · Senja Tenang',
  2: 'Ronde 2 · Lampu Mulai Menyala',
  3: 'Ronde 3 · Senja Kian Gelap',
};

export const TOTAL_ROUNDS = 3;

// Stars on the final screen, from the total score.
export function starsForScore(score) {
  if (score >= 2600) return 3;
  if (score >= 2000) return 2;
  return 1;
}
