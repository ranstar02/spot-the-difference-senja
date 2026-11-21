// Senja di Taman Kota — the differences of every round.
//
// Coordinates are in panel space (600 x 600, origin at the panel's top-left).
// `left` / `right` describe how the same spot looks on each panel; scene.js
// reads these values while it draws, so both panels stay one coherent scene
// and only the listed spots differ. Every difference is fair: visible to a
// careful eye, hidden by the busy dusk scene.

export const ROUNDS = [
  {
    round: 1,
    diffs: [
      { id: 'bunga', x: 82, y: 566, r: 30, label: 'Bunga merah hilang',
        left: { show: true }, right: { show: false } },
      { id: 'payung', x: 300, y: 396, r: 44, label: 'Warna payung berubah',
        left: { color: '#ff7b2f' }, right: { color: '#3fa7ff' } },
      { id: 'layang', x: 112, y: 118, r: 34, label: 'Layang-layang hilang',
        left: { show: true }, right: { show: false } },
      { id: 'kucing', x: 182, y: 528, r: 36, label: 'Kucing hilang',
        left: { show: true }, right: { show: false } },
      { id: 'lampu', x: 542, y: 372, r: 32, label: 'Lampu taman menyala',
        left: { lit: true }, right: { lit: false } },
      { id: 'roda', x: 322, y: 548, r: 30, label: 'Roda sepeda hilang',
        left: { show: true }, right: { show: false } },
      { id: 'bebek', x: 462, y: 534, r: 30, label: 'Bebek di kolam hilang',
        left: { show: true }, right: { show: false } },
    ],
  },
  {
    round: 2,
    diffs: [
      { id: 'jarum', x: 80, y: 190, r: 30, label: 'Jarum jam taman beda',
        left: { minute: 2 }, right: { minute: 9 } },
      { id: 'burung', x: 392, y: 98, r: 28, label: 'Seekor burung berkurang',
        left: { show: true }, right: { show: false } },
      { id: 'apel', x: 132, y: 282, r: 26, label: 'Apel di pohon hilang',
        left: { show: true }, right: { show: false } },
      { id: 'bantal', x: 300, y: 470, r: 34, label: 'Bantal bangku hilang',
        left: { show: true }, right: { show: false } },
      { id: 'jendela', x: 452, y: 296, r: 26, label: 'Jendela gedung menyala',
        left: { lit: true }, right: { lit: false } },
      { id: 'kupu', x: 252, y: 562, r: 28, label: 'Kupu-kupu hilang',
        left: { show: true }, right: { show: false } },
      { id: 'pot', x: 540, y: 566, r: 28, label: 'Pot bunga di lampu hilang',
        left: { show: true }, right: { show: false } },
    ],
  },
  {
    round: 3,
    diffs: [
      { id: 'bayang', x: 150, y: 566, r: 40, label: 'Bayangan pohon hilang',
        left: { show: true }, right: { show: false } },
      { id: 'daun', x: 486, y: 252, r: 30, label: 'Warna daun berubah tipis',
        left: { color: '#3f7d3a' }, right: { color: '#7d8f3a' } },
      { id: 'jendela2', x: 96, y: 296, r: 24, label: 'Jendela gedung gelap',
        left: { lit: false }, right: { lit: true } },
      { id: 'kumis', x: 196, y: 512, r: 26, label: 'Kumis kucing hilang',
        left: { show: true }, right: { show: false } },
      { id: 'riak', x: 500, y: 548, r: 30, label: 'Riak kolam berkurang',
        left: { count: 3 }, right: { count: 1 } },
      { id: 'batu', x: 296, y: 586, r: 24, label: 'Batu di jalan hilang',
        left: { show: true }, right: { show: false } },
      { id: 'awan', x: 320, y: 58, r: 30, label: 'Awan kecil hilang',
        left: { show: true }, right: { show: false } },
    ],
  },
];

export function roundDiffs(round) {
  const found = ROUNDS.find((r) => r.round === round);
  return found ? found.diffs : [];
}

export function getDiff(round, id) {
  return roundDiffs(round).find((d) => d.id === id);
}

// The value of one difference on one side: side 0 = left panel, 1 = right.
export function diffSide(round, id, side) {
  const d = getDiff(round, id);
  if (!d) return null;
  return side === 0 ? d.left : d.right;
}
