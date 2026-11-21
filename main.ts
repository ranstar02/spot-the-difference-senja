// Senja di Taman Kota — the entrypoint that hands this game in.
// Runs on Node 22 with the standard library only. It takes the game/ folder
// and the screenshots/ folder sitting next to this file, copies both into
// the output directory, and writes dossier.json there with the vendored
// make.fun library (vendor/makefun-game.ts). The grader runs this program
// twice and both runs must produce identical bytes.
//
// Local check:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Play it locally with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, as the kit's reference/gate.json states them: the text
// cap shapes the dossier's bytes, the rest refuse an entry the scorer
// would refuse (more than 4 screenshots, one over 256 KiB, game/ over
// 993 files or 48 MiB, or a game/ path over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
