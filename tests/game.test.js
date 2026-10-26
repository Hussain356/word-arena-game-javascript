const test = require('node:test');
const assert = require('node:assert');
const G = require('../js/game.js');
const items = G.parse(require('../js/words.js'));
const mk = word => ({ word, hint: '', cat: 'x', diff: G.diffOf(word) });

test('word bank is valid with no duplicates', () => {
  assert.ok(items.length >= 70);
  assert.strictEqual(new Set(items.map(i => i.word)).size, items.length);
  for (const i of items) { assert.match(i.word, /^[a-z]+$/); assert.ok(i.hint && i.cat); }
});
test('difficulty derives from length', () => {
  assert.strictEqual(G.diffOf('gold'), 'easy');
  assert.strictEqual(G.diffOf('python'), 'medium');
  assert.strictEqual(G.diffOf('algorithm'), 'hard');
});
test('scramble keeps letters and never returns the original', () => {
  for (let i = 0; i < 200; i++) {
    const s = G.scramble('library');
    assert.notStrictEqual(s, 'library');
    assert.strictEqual([...s].sort().join(''), [...'library'].sort().join(''));
  }
});
test('pick respects filters and avoids repeats', () => {
  const used = new Set(), seen = new Set();
  const n = items.filter(i => i.cat === 'world').length;
  for (let i = 0; i < n; i++) {
    const w = G.pick(items, { cat: 'world' }, used);
    assert.strictEqual(w.cat, 'world');
    assert.ok(!seen.has(w.word));
    seen.add(w.word);
  }
  assert.strictEqual(G.pick(items, { cat: 'nope' }), null);
});
test('hangman win and loss', () => {
  let s = G.newHangman(mk('gold'));
  for (const c of 'gold') s = G.guess(s, c);
  assert.strictEqual(s.status, 'won');
  s = G.newHangman(mk('gold'));
  for (const c of 'qxzjkwv') s = G.guess(s, c);
  assert.strictEqual(s.status, 'lost');
});
test('repeat and invalid guesses are ignored', () => {
  let s = G.newHangman(mk('gold'));
  s = G.guess(s, 'z');
  assert.strictEqual(G.guess(s, 'z').misses, 1);
  assert.strictEqual(G.guess(s, '1'), s);
});
test('reveal never gives away the last letter or costs a life', () => {
  let s = G.newHangman(mk('abc'));
  s = G.reveal(G.reveal(G.reveal(s)));
  assert.strictEqual(s.status, 'playing');
  assert.strictEqual(s.misses, 0);
  assert.strictEqual(s.guessed.length, 2);
});
test('answer check and scoring', () => {
  assert.ok(G.checkAnswer({ word: 'gold' }, '  GOLD '));
  assert.strictEqual(G.score({ diff: 'hard', hints: 99 }), 5);
  assert.strictEqual(G.score({ diff: 'easy', lives: 3, streak: 9 }), 10 + 6 + 25);
});
