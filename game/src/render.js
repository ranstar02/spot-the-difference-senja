// Senja di Taman Kota — everything drawn on top of the park scene:
// the HUD (counter, timer, score, buttons), the found markers, the hint
// pulse, and the title / round-clear / game-over / win screens.

import {
  CANVAS_W, CANVAS_H, HUD_H, PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X,
  ROUND_NAMES, starsForScore,
} from './config.js';
import { roundDiffs } from './differences.js';
import { drawScene } from './scene.js';

export const HINT_BTN = { x: 1090, y: 16, w: 84, h: 54 };
export const RESTART_BTN = { x: 1184, y: 16, w: 84, h: 54 };

export function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawButton(ctx, rect, label, sub, enabled) {
  ctx.fillStyle = enabled ? '#ffd166' : '#6b6258';
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.fillStyle = '#3d2b3d';
  ctx.textAlign = 'center';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + 24);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText(sub, rect.x + rect.w / 2, rect.y + 43);
}

function drawHud(ctx, state) {
  ctx.fillStyle = '#241a2e';
  ctx.fillRect(0, 0, CANVAS_W, HUD_H);
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'left';
  ctx.font = 'bold 25px system-ui, sans-serif';
  ctx.fillText('SENJA DI TAMAN KOTA', 20, 36);
  ctx.fillStyle = '#e8b4c8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(ROUND_NAMES[state.round] || '', 20, 62);

  // The counter pill: found so far and how many are left — always visible.
  const diffs = roundDiffs(state.round);
  const found = state.found.size;
  const left = diffs.length - found;
  ctx.fillStyle = '#3a2b47';
  ctx.beginPath();
  ctx.roundRect(430, 14, 420, 58, 12);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(`Ditemukan ${found} / ${diffs.length}  ·  Sisa ${left}`, 640, 52);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`Skor ${state.score}`, 878, 44);
  const low = state.timeLeft <= 15 && state.screen === 'playing';
  ctx.fillStyle = low ? '#ff5d5d' : '#ffffff';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(fmtTime(state.timeLeft), 990, 46);

  drawButton(ctx, HINT_BTN, 'Hint', `H · ${state.hintsLeft} lagi`, state.hintsLeft > 0);
  drawButton(ctx, RESTART_BTN, 'Restart', 'R', true);
}

function drawMarker(ctx, x, y, r, now) {
  const pulse = 1 + 0.06 * Math.sin(now / 180);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, (r + 8) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 209, 102, 0.45)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, (r + 14) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  // Little check mark in the middle of the ring.
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x - 2, y + 7);
  ctx.lineTo(x + 10, y - 7);
  ctx.stroke();
}

function drawPanels(ctx, state, now) {
  const shake = state.screen === 'playing' && now < state.shakeUntil
    ? (Math.random() - 0.5) * 10 : 0;
  ctx.save();
  ctx.translate(shake, shake * 0.6);
  for (const [side, px] of [[0, LEFT_X], [1, RIGHT_X]]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(px, PANEL_Y);
    drawScene(ctx, state.round, side);
    ctx.restore();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3;
    ctx.strokeRect(px + 1.5, PANEL_Y + 1.5, PANEL_W - 3, PANEL_H - 3);
  }
  // Markers on both panels for every difference found.
  for (const id of state.found) {
    const d = roundDiffs(state.round).find((x) => x.id === id);
    if (!d) continue;
    drawMarker(ctx, LEFT_X + d.x, PANEL_Y + d.y, d.r, now);
    drawMarker(ctx, RIGHT_X + d.x, PANEL_Y + d.y, d.r, now);
  }
  // Hint pulse on the one difference the hint points at.
  if (state.hintPulse && now < state.hintPulse.until) {
    const d = roundDiffs(state.round).find((x) => x.id === state.hintPulse.id);
    if (d) {
      const breathe = 1 + 0.25 * Math.sin(now / 130);
      ctx.strokeStyle = '#ff5d8f';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(LEFT_X + d.x, PANEL_Y + d.y, (d.r + 12) * breathe, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(RIGHT_X + d.x, PANEL_Y + d.y, (d.r + 12) * breathe, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  // Wrong-click flash.
  if (state.wrongFlash && now < state.wrongFlash.until) {
    const { x, y } = state.wrongFlash;
    ctx.strokeStyle = '#ff5d5d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12); ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12); ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
  }
  ctx.restore();
}

function dim(ctx) {
  ctx.fillStyle = 'rgba(20, 12, 28, 0.72)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function centerCard(ctx, w, h) {
  const x = (CANVAS_W - w) / 2;
  const y = (CANVAS_H - h) / 2;
  ctx.fillStyle = '#2e2138';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.stroke();
  return { x, y, w, h };
}

function drawTitle(ctx, state) {
  drawPanels(ctx, state, performance.now());
  dim(ctx);
  const c = centerCard(ctx, 760, 480);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('SENJA DI', c.x + c.w / 2, c.y + 96);
  ctx.fillText('TAMAN KOTA', c.x + c.w / 2, c.y + 156);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('Dua gambar taman saat senja — nyaris sama.', c.x + c.w / 2, c.y + 208);
  ctx.fillText('Temukan 7 perbedaan di tiap ronde sebelum waktu habis!', c.x + c.w / 2, c.y + 238);
  ctx.fillStyle = '#e8b4c8';
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText('Klik perbedaan di gambar mana pun  ·  Klik salah: −5 detik', c.x + c.w / 2, c.y + 288);
  ctx.fillText('H = Hint (3× per ronde)   ·   R = Restart   ·   1 / 2 / 3 = pilih ronde', c.x + c.w / 2, c.y + 316);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('▶  KLIK DI MANA SAJA UNTUK MULAI  ◀', c.x + c.w / 2, c.y + 388);
  ctx.fillStyle = '#b9a8c4';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('3 ronde · 7 perbedaan tiap ronde · 90 detik per ronde', c.x + c.w / 2, c.y + 430);
}

function drawRoundClear(ctx, state) {
  drawPanels(ctx, state, performance.now());
  dim(ctx);
  const c = centerCard(ctx, 640, 380);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7dff9b';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText(`RONDE ${state.round} SELESAI!`, c.x + c.w / 2, c.y + 90);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Semua 7 perbedaan ketemu. Kerja bagus!', c.x + c.w / 2, c.y + 146);
  ctx.fillText(`Bonus waktu: +${state.lastBonus} poin`, c.x + c.w / 2, c.y + 186);
  ctx.fillText(`Skor ronde: ${state.roundScore}  ·  Total: ${state.score}`, c.x + c.w / 2, c.y + 222);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 24px system-ui, sans-serif';
  const next = state.round < 3 ? `RONDE ${state.round + 1} MENANTI` : 'LIHAT HASIL AKHIR';
  ctx.fillText('▶  KLIK UNTUK LANJUT: ' + next, c.x + c.w / 2, c.y + 300);
}

function drawGameOver(ctx, state) {
  drawPanels(ctx, state, performance.now());
  dim(ctx);
  const c = centerCard(ctx, 640, 360);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff5d5d';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText('WAKTU HABIS!', c.x + c.w / 2, c.y + 92);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText(`Kamu menemukan ${state.found.size} dari 7 perbedaan di ronde ${state.round}.`, c.x + c.w / 2, c.y + 150);
  ctx.fillText(`Skor akhir: ${state.score}`, c.x + c.w / 2, c.y + 190);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('Tekan R atau klik untuk coba lagi', c.x + c.w / 2, c.y + 268);
}

function drawWin(ctx, state) {
  drawPanels(ctx, state, performance.now());
  dim(ctx);
  const c = centerCard(ctx, 700, 430);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText('TAMAN SELESAI!', c.x + c.w / 2, c.y + 88);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Semua 21 perbedaan ketemu. Senja pun turun dengan tenang.', c.x + c.w / 2, c.y + 140);
  const stars = starsForScore(state.score);
  ctx.font = '54px system-ui, sans-serif';
  ctx.fillStyle = '#ffd166';
  ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), c.x + c.w / 2, c.y + 214);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(`Skor total: ${state.score}`, c.x + c.w / 2, c.y + 272);
  ctx.fillStyle = '#e8b4c8';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Bintang: 1 ★ dari 2000 · 2 ★ dari 2600 · 3 ★ dari 3000', c.x + c.w / 2, c.y + 312);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('Tekan R atau klik untuk main lagi', c.x + c.w / 2, c.y + 372);
}

export function drawGame(ctx, state, now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#241a2e';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (state.screen === 'title') {
    drawTitle(ctx, state);
    return;
  }
  drawHud(ctx, state);
  drawPanels(ctx, state, now);
  if (state.screen === 'roundClear') drawRoundClear(ctx, state);
  else if (state.screen === 'gameOver') drawGameOver(ctx, state);
  else if (state.screen === 'win') drawWin(ctx, state);
  else if (state.message && now < state.messageUntil) {
    // Toast in the dark strip below the panels, clear of the HUD pill.
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = state.messageColor || '#7dff9b';
    ctx.fillText(state.message, CANVAS_W / 2, CANVAS_H - 12);
  }
}
