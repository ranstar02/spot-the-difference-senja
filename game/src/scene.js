// Senja di Taman Kota — the park scene, drawn procedurally on canvas.
// One function draws the whole dusk park for one panel; `side` 0 is the
// left panel, 1 the right. Differences from differences.js are read while
// drawing, so each panel is the same scene except at the listed spots.

import { diffSide } from './differences.js';

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function rrect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawSky(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 360);
  g.addColorStop(0, '#ffb347');
  g.addColorStop(0.45, '#ff7e5f');
  g.addColorStop(0.8, '#c65d7b');
  g.addColorStop(1, '#7a4a8f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 362);
  // Setting sun with a warm halo.
  const halo = ctx.createRadialGradient(470, 140, 10, 470, 140, 110);
  halo.addColorStop(0, 'rgba(255, 236, 170, 0.95)');
  halo.addColorStop(0.5, 'rgba(255, 170, 90, 0.45)');
  halo.addColorStop(1, 'rgba(255, 170, 90, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(340, 10, 260, 260);
  circle(ctx, 470, 140, 46, '#ffdf8a');
  circle(ctx, 470, 140, 38, '#ffe9a8');
}

function drawCloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y - 6 * s, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 44 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawKite(ctx, round, side) {
  if (round === 1 && !diffSide(1, 'layang', side).show) return;
  // Diamond kite with a wavy tail, high in the sky.
  ctx.save();
  ctx.translate(112, 118);
  ctx.rotate(-0.35);
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(0, -26); ctx.lineTo(20, 0); ctx.lineTo(0, 26); ctx.lineTo(-20, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(0, -26); ctx.lineTo(20, 0); ctx.lineTo(0, 0); ctx.lineTo(-20, 0);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#fff3d6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.quadraticCurveTo(14, 44, 2, 62);
  ctx.quadraticCurveTo(-10, 78, 4, 92);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255, 243, 214, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(112, 144);
  ctx.lineTo(150, 210);
  ctx.stroke();
}

function drawBird(ctx, x, y, s) {
  ctx.strokeStyle = '#3d2b3d';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 3 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 7 * s, x + 9 * s, y);
  ctx.stroke();
}

function drawBuildings(ctx, round, side) {
  const blocks = [
    { x: 10, w: 110, h: 90, color: '#5b3a6e' },
    { x: 130, w: 90, h: 120, color: '#4a2f5e' },
    { x: 230, w: 130, h: 80, color: '#5b3a6e' },
    { x: 370, w: 110, h: 110, color: '#4a2f5e' },
    { x: 460, w: 130, h: 95, color: '#5b3a6e' },
  ];
  for (const b of blocks) {
    rect(ctx, b.x, 360 - b.h, b.w, b.h, b.color);
    // Little lit windows, two rows.
    for (let wy = 0; wy < 2; wy++) {
      for (let wx = 0; wx < Math.floor(b.w / 28); wx++) {
        const winX = b.x + 12 + wx * 28;
        const winY = 360 - b.h + 14 + wy * 30;
        const lit = (wx + wy) % 3 === 0;
        rect(ctx, winX, winY, 12, 16, lit ? '#ffd166' : '#2e1f3d');
      }
    }
  }
  // The two windows that are themselves differences, drawn on top of the grid.
  if (round === 2) {
    rect(ctx, 446, 290, 16, 20, diffSide(2, 'jendela', side).lit ? '#ffd166' : '#2e1f3d');
  }
  if (round === 3) {
    rect(ctx, 90, 290, 16, 20, diffSide(3, 'jendela2', side).lit ? '#ffd166' : '#2e1f3d');
  }
}

function drawClock(ctx, round, side) {
  // Garden clock on a pole, left side of the park.
  rect(ctx, 77, 216, 6, 146, '#3d2b3d');
  circle(ctx, 80, 190, 28, '#fff8e7');
  ctx.strokeStyle = '#3d2b3d';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(80, 190, 28, 0, Math.PI * 2); ctx.stroke();
  const minute = round === 2 ? diffSide(2, 'jarum', side).minute : 2;
  const hourAngle = -Math.PI / 2 + (6 / 12) * Math.PI * 2;
  const minAngle = -Math.PI / 2 + (minute / 12) * Math.PI * 2;
  ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(80, 190);
  ctx.lineTo(80 + Math.cos(hourAngle) * 13, 190 + Math.sin(hourAngle) * 13); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(80, 190);
  ctx.lineTo(80 + Math.cos(minAngle) * 20, 190 + Math.sin(minAngle) * 20); ctx.stroke();
  circle(ctx, 80, 190, 3, '#3d2b3d');
}

function drawTrees(ctx, round, side) {
  // Big tree, left.
  rect(ctx, 142, 300, 16, 62, '#5a3a28');
  circle(ctx, 150, 262, 62, '#2f6b2f');
  circle(ctx, 108, 282, 42, '#357a35');
  circle(ctx, 192, 282, 44, '#2f6b2f');
  circle(ctx, 150, 228, 48, '#3f7d3a');
  // Apples on the big tree; one of them is a round-2 difference.
  circle(ctx, 112, 272, 6, '#e63946');
  if (round !== 2 || diffSide(2, 'apel', side).show) circle(ctx, 132, 282, 6, '#e63946');
  circle(ctx, 182, 266, 6, '#e63946');
  // Second tree, right; one canopy puff changes hue in round 3.
  rect(ctx, 478, 306, 14, 56, '#5a3a28');
  const leaf = round === 3 ? diffSide(3, 'daun', side).color : '#3f7d3a';
  circle(ctx, 486, 252, 52, leaf);
  circle(ctx, 448, 272, 34, '#357a35');
  circle(ctx, 522, 274, 32, '#2f6b2f');
}

function drawGround(ctx) {
  const g = ctx.createLinearGradient(0, 360, 0, 600);
  g.addColorStop(0, '#4a7c3a');
  g.addColorStop(1, '#2e5230');
  ctx.fillStyle = g;
  ctx.fillRect(0, 360, 600, 240);
  // Footpath down the middle.
  ctx.fillStyle = '#c9a86a';
  ctx.beginPath();
  ctx.moveTo(268, 360); ctx.lineTo(332, 360);
  ctx.lineTo(372, 600); ctx.lineTo(228, 600);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b3925a';
  ctx.beginPath();
  ctx.moveTo(268, 360); ctx.lineTo(332, 360);
  ctx.lineTo(340, 420); ctx.lineTo(260, 420);
  ctx.closePath(); ctx.fill();
}

function drawPond(ctx, round, side) {
  ellipse(ctx, 470, 540, 96, 26, '#4d7ea8');
  ellipse(ctx, 470, 536, 82, 20, '#6fa3c8');
  const ripples = round === 3 ? diffSide(3, 'riak', side).count : 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < ripples; i++) {
    ctx.beginPath();
    ctx.ellipse(500, 540 + i * 5, 14 + i * 8, 4 + i, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Duck on the pond; missing on the right panel in round 1.
  if (round !== 1 || diffSide(1, 'bebek', side).show) {
    ellipse(ctx, 462, 534, 14, 9, '#fff8e7');
    circle(ctx, 474, 526, 7, '#fff8e7');
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath(); ctx.moveTo(480, 524); ctx.lineTo(488, 527); ctx.lineTo(480, 530); ctx.closePath(); ctx.fill();
    circle(ctx, 476, 524, 1.6, '#222');
  }
}

function drawBench(ctx, round, side) {
  // Parasol over the bench; its colour is a round-1 difference.
  const parasol = round === 1 ? diffSide(1, 'payung', side).color : '#ff7b2f';
  rect(ctx, 297, 396, 6, 78, '#6b4a2f');
  ctx.fillStyle = parasol;
  ctx.beginPath();
  ctx.moveTo(238, 398);
  ctx.quadraticCurveTo(300, 352, 362, 398);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.moveTo(282, 392);
  ctx.quadraticCurveTo(300, 372, 318, 392);
  ctx.closePath(); ctx.fill();
  // Bench: back, seat, legs.
  rect(ctx, 252, 436, 96, 10, '#7a4a2f');
  rect(ctx, 252, 462, 96, 10, '#8a5a35');
  rect(ctx, 258, 472, 8, 34, '#5a3a28');
  rect(ctx, 334, 472, 8, 34, '#5a3a28');
  rect(ctx, 252, 448, 8, 58, '#5a3a28');
  rect(ctx, 340, 448, 8, 58, '#5a3a28');
  // Cushion on the seat; missing on the right panel in round 2.
  if (round !== 2 || diffSide(2, 'bantal', side).show) {
    rrect(ctx, 282, 452, 36, 12, 5, '#e63946');
  }
}

function drawLamp(ctx, round, side) {
  rect(ctx, 538, 392, 8, 128, '#2e2a33');
  circle(ctx, 542, 372, 14, '#2e2a33');
  const lit = round === 1 ? diffSide(1, 'lampu', side).lit : true;
  if (lit) {
    const glow = ctx.createRadialGradient(542, 372, 4, 542, 372, 60);
    glow.addColorStop(0, 'rgba(255, 209, 102, 0.85)');
    glow.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(482, 312, 120, 120);
    circle(ctx, 542, 372, 10, '#ffd166');
  } else {
    circle(ctx, 542, 372, 10, '#5a5460');
  }
  // Flower pot at the lamp's foot; missing on the right panel in round 2.
  if (round !== 2 || diffSide(2, 'pot', side).show) {
    ctx.fillStyle = '#b5651d';
    ctx.beginPath();
    ctx.moveTo(528, 566); ctx.lineTo(556, 566); ctx.lineTo(552, 584); ctx.lineTo(532, 584);
    ctx.closePath(); ctx.fill();
    circle(ctx, 536, 560, 6, '#e63946');
    circle(ctx, 548, 558, 6, '#ff7b9c');
  }
}

function drawCat(ctx, round, side) {
  if (round === 1 && !diffSide(1, 'kucing', side).show) return;
  // Sitting cat, dark ginger, facing right.
  ellipse(ctx, 182, 540, 22, 16, '#c97b2f');
  circle(ctx, 196, 516, 13, '#c97b2f');
  ctx.fillStyle = '#c97b2f';
  ctx.beginPath();
  ctx.moveTo(186, 508); ctx.lineTo(190, 496); ctx.lineTo(196, 506); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(200, 505); ctx.lineTo(206, 495); ctx.lineTo(209, 507); ctx.closePath(); ctx.fill();
  // Tail curled on the ground.
  ctx.strokeStyle = '#c97b2f';
  ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(162, 544);
  ctx.quadraticCurveTo(142, 546, 146, 530);
  ctx.stroke();
  circle(ctx, 200, 513, 1.8, '#222');
  // Whiskers; missing on the right panel in round 3.
  if (round !== 3 || diffSide(3, 'kumis', side).show) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(206, 518); ctx.lineTo(222, 514);
    ctx.moveTo(206, 521); ctx.lineTo(222, 522);
    ctx.stroke();
  }
}

function drawBicycle(ctx, round, side) {
  // A bicycle leaning by the path; its rear wheel is a round-1 difference.
  ctx.strokeStyle = '#2e2a33';
  ctx.lineWidth = 3;
  if (round !== 1 || diffSide(1, 'roda', side).show) {
    ctx.beginPath(); ctx.arc(322, 548, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(322, 548, 3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(378, 548, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(378, 548, 3, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(322, 548); ctx.lineTo(352, 516); ctx.lineTo(378, 548);
  ctx.moveTo(352, 516); ctx.lineTo(340, 516);
  ctx.moveTo(352, 516); ctx.lineTo(366, 502);
  ctx.moveTo(366, 502); ctx.lineTo(378, 548);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(340, 516); ctx.lineTo(332, 512); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(366, 502); ctx.lineTo(378, 500); ctx.stroke();
}

function drawFlowers(ctx, round, side) {
  const spots = [
    { x: 40, c: '#ff7b9c' }, { x: 120, c: '#ffd166' }, { x: 210, c: '#c77dff' },
    { x: 420, c: '#ff7b9c' }, { x: 520, c: '#ffd166' }, { x: 570, c: '#c77dff' },
  ];
  for (const s of spots) drawFlower(ctx, s.x, 578, s.c);
  // The big red flower by the path; missing on the right panel in round 1.
  if (round !== 1 || diffSide(1, 'bunga', side).show) drawFlower(ctx, 82, 566, '#e63946');
}

function drawFlower(ctx, x, y, color) {
  ctx.strokeStyle = '#2f6b2f';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 12); ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 4, color);
  }
  circle(ctx, x, y, 4, '#ffd166');
}

function drawButterfly(ctx, round, side) {
  if (round === 2 && !diffSide(2, 'kupu', side).show) return;
  ctx.fillStyle = '#ff7b9c';
  ctx.beginPath();
  ctx.ellipse(246, 558, 7, 5, -0.5, 0, Math.PI * 2);
  ctx.ellipse(258, 558, 7, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d2b3d';
  ctx.fillRect(250, 554, 3, 10);
}

function drawStone(ctx, round, side) {
  if (round === 3 && !diffSide(3, 'batu', side).show) return;
  ellipse(ctx, 296, 586, 12, 6, '#8d8578');
}

// The whole park for one panel. Callers translate to the panel origin first.
export function drawScene(ctx, round, side) {
  drawSky(ctx);
  drawCloud(ctx, 120, 80, 1, 'rgba(255, 220, 190, 0.85)');
  if (round !== 3 || diffSide(3, 'awan', side).show) drawCloud(ctx, 320, 58, 0.8, 'rgba(255, 220, 190, 0.85)');
  drawCloud(ctx, 520, 100, 0.9, 'rgba(255, 200, 180, 0.8)');
  drawKite(ctx, round, side);
  drawBird(ctx, 250, 90, 1);
  drawBird(ctx, 320, 70, 0.85);
  if (round !== 2 || diffSide(2, 'burung', side).show) drawBird(ctx, 392, 98, 0.9);
  drawBuildings(ctx, round, side);
  drawClock(ctx, round, side);
  drawTrees(ctx, round, side);
  drawGround(ctx);
  // Tree shadow on the grass; missing on the right panel in round 3.
  if (round !== 3 || diffSide(3, 'bayang', side).show) {
    ellipse(ctx, 150, 566, 78, 12, 'rgba(0, 0, 0, 0.25)');
  }
  drawPond(ctx, round, side);
  drawBench(ctx, round, side);
  drawLamp(ctx, round, side);
  drawCat(ctx, round, side);
  drawBicycle(ctx, round, side);
  drawFlowers(ctx, round, side);
  drawButterfly(ctx, round, side);
  drawStone(ctx, round, side);
}
