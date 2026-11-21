// Senja di Taman Kota — mouse and keyboard input.
// Clicks are translated from page pixels into canvas pixels, then handed to
// the game as either a panel click (with panel-local coordinates) or a
// button press. Keys: H hint, R restart, 1/2/3 pick a round on the title.

import { CANVAS_W, CANVAS_H, LEFT_X, RIGHT_X, PANEL_W, PANEL_Y, PANEL_H } from './config.js';

export function canvasPoint(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * CANVAS_W,
    y: ((clientY - r.top) / r.height) * CANVAS_H,
  };
}

// Which panel, if any, holds this canvas point? Returns null outside panels.
export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) {
    return { side: 0, px: x - LEFT_X, py: y - PANEL_Y };
  }
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) {
    return { side: 1, px: x - RIGHT_X, py: y - PANEL_Y };
  }
  return null;
}

export function bindInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const p = canvasPoint(canvas, event.clientX, event.clientY);
    handlers.onPointer(p.x, p.y);
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === '1' || key === '2' || key === '3') handlers.onRoundKey(Number(key));
    else if (key === 'enter' || key === ' ') handlers.onConfirm();
  });
}
