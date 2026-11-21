# spot-the-difference-senja

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ranstar02/spot-the-difference-senja/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ranstar02/spot-the-difference-senja/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Senja di Taman Kota** — a spot-the-difference game set in a city park at dusk. Two nearly identical park scenes sit side by side: an orange sunset sky, a bench with a parasol, a pond with a duck, a sitting cat, a leaning bicycle, a kite, and garden clock. Find 7 differences per round before the 90-second timer runs out.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — every picture is drawn procedurally on canvas and every sound is a tiny WebAudio blip.

## How to play

- **Click** a difference on either picture — a golden ring marks it on both panels and your score goes up.
- **Wrong click:** −5 seconds and the screen shakes.
- **Hint (H):** up to 3 per round, a pulsing pink ring points at one difference you haven't found yet.
- **Restart (R):** restart the current round.
- **1 / 2 / 3** on the title screen: jump straight to that round.
- **3 rounds**, 7 differences each, harder as the dusk deepens. Clear a round for a time bonus; finish all three and collect 1–3 stars from your total score.

## Files

- `game/index.html` — the page; `game/src/` holds one module per job: `config.js` (constants), `differences.js` (the 21 differences), `scene.js` (the procedural park), `input.js` (mouse + keyboard), `render.js` (HUD, markers, screens), `audio.js` (WebAudio blips), `shots.js` (deterministic screenshot frames), `main.js` (state + loop).
- `main.ts` — the make.fun entrypoint: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
- `screenshots/` — four real renders of the game (cover first).

---

<sub>Entered on [make.fun](https://make.fun/?ref=ranstar02&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
