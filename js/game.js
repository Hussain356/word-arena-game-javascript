/* Pure game logic (no DOM) so it can be unit-tested with `npm test`. */
(function (root) {
  'use strict';
  const LIVES = { easy: 7, medium: 6, hard: 5 };
  const BASE = { easy: 10, medium: 20, hard: 30 };
  const diffOf = w => (w.length <= 5 ? 'easy' : w.length <= 7 ? 'medium' : 'hard');

  function parse(raw) {
    return raw.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [cat, word, hint] = l.split('|');
      return { cat, word: word.toLowerCase(), hint, diff: diffOf(word) };
    });
  }

  function shuffle(arr, rng = Math.random) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function scramble(word, rng = Math.random) {
    if (new Set(word).size < 2) return word;
    let s;
    do { s = shuffle([...word], rng).join(''); } while (s === word);
    return s;
  }

  /* Picks a word matching the filters; never repeats until the pool is exhausted. */
  function pick(list, { cat = 'all', diff = 'all' } = {}, used = new Set(), rng = Math.random) {
    const pool = list.filter(w => (cat === 'all' || w.cat === cat) && (diff === 'all' || w.diff === diff));
    if (!pool.length) return null;
    let fresh = pool.filter(w => !used.has(w.word));
    if (!fresh.length) { pool.forEach(w => used.delete(w.word)); fresh = pool; }
    const w = fresh[Math.floor(rng() * fresh.length)];
    used.add(w.word);
    return w;
  }

  const newHangman = item => ({ item, guessed: [], misses: 0, max: LIVES[item.diff], status: 'playing' });

  function guess(s, ch) {
    ch = String(ch).toLowerCase();
    if (s.status !== 'playing' || !/^[a-z]$/.test(ch) || s.guessed.includes(ch)) return s;
    const guessed = [...s.guessed, ch];
    const misses = s.misses + (s.item.word.includes(ch) ? 0 : 1);
    const won = [...s.item.word].every(c => guessed.includes(c));
    return { ...s, guessed, misses, status: won ? 'won' : misses >= s.max ? 'lost' : 'playing' };
  }

  /* Reveals one hidden letter without costing a life; never reveals the final one. */
  function reveal(s, rng = Math.random) {
    const left = [...new Set(s.item.word)].filter(c => !s.guessed.includes(c));
    if (s.status !== 'playing' || left.length < 2) return s;
    return guess(s, left[Math.floor(rng() * left.length)]);
  }

  const checkAnswer = (item, input) => item.word === String(input).trim().toLowerCase();

  function score({ diff, lives = 0, timeLeft = 0, hints = 0, streak = 0 }) {
    return Math.max(5, BASE[diff] + lives * 2 + timeLeft - hints * 5 + Math.min(streak, 5) * 5);
  }

  const api = { parse, shuffle, scramble, pick, newHangman, guess, reveal, checkAnswer, score, diffOf, LIVES };
  root.WordGame = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
