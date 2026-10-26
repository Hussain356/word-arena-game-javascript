# 🎮 WordPlay Arena

Two classic word games in one polished, responsive web app: **Word Guess** (Hangman-style) and **Word Scramble** (timed unscramble). Pure HTML, CSS and JavaScript – no frameworks, no build step, no dependencies.

**[▶ Live demo](https://YOUR-USERNAME.github.io/wordplay-arena/)** · MIT licensed

## ✨ Features

| Area | Details |
|---|---|
| Game modes | Word Guess (lives, on-screen + physical keyboard) · Word Scramble (countdown timer, shuffle) |
| Content | 80 words across 5 categories: Tech, Science, World, Fun, Daily life |
| Difficulty | Auto-derived from word length: Easy (≤5), Medium (6–7), Hard (8+) – affects lives, time and points |
| Scoring | Base points + lives/time bonus + streak bonus (max +25) − hint penalty (−5) |
| Progress | Best score, wins and games played saved in `localStorage` |
| UX | Dark/light theme (follows system), sound toggle, hints, skip, how-to-play dialog, no blocking `alert()` popups |
| Quality | Mobile-first responsive, keyboard accessible, ARIA live regions, reduced-motion support, unit-tested logic |

## 🚀 Run locally

```bash
git clone https://github.com/Hussain356/wordplay-arena.git
cd wordplay-arena
npx serve .        # or just open index.html
npm test           # run unit tests (Node 18+)
```

## 🗂 Project structure

```
index.html          App shell
css/style.css       Themes, layout, responsive rules
js/words.js         Word bank (category|word|hint)
js/game.js          Pure game logic (testable, no DOM)
js/app.js           UI, state, storage, audio
tests/game.test.js  Unit tests (node:test)
.github/workflows   CI + GitHub Pages deploy
```

## 🛠 Customise

Add words in `js/words.js` using `category|word|hint` (lowercase letters only). Difficulty is calculated automatically. To add a category, add its label to `CATS` in `js/app.js`.

## 🧪 What was improved over the two original mini-games

- Merged two separate projects into one app with a shared score, streak and settings
- Separated logic from UI and added automated tests + CI
- Fixed duplicate-letter handling and the repeated-word problem (words don't repeat until the pool is exhausted)
- Scrambler can no longer return the unscrambled word
- Replaced `alert()` dialogs with inline messages and a non-blocking flow
- Added categories, difficulty levels, hints, persistence, themes, sound and accessibility

## 🗺 Roadmap

Daily challenge · multiplayer/pass-and-play · PWA offline install · word-pack import (JSON) · leaderboard API

## 📄 License

MIT – see [LICENSE](LICENSE).
