/* UI layer: wires the DOM to the pure logic in game.js */
(() => {
  'use strict';
  const G = window.WordGame, items = G.parse(window.WORD_DATA);
  const $ = s => document.querySelector(s);
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem('wpa:' + k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('wpa:' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
  };
  const CATS = { all: 'All categories', tech: 'Tech', science: 'Science', world: 'World', fun: 'Fun', daily: 'Daily life' };
  const st = {
    mode: 'guess', cat: 'all', diff: 'all', used: new Set(), game: null, item: null,
    score: 0, streak: 0, hints: 0, left: 0, total: 0, timer: null, over: false,
    prof: store.get('profile', { best: 0, wins: 0, played: 0 }), sound: store.get('sound', true)
  };

  /* ---------- helpers ---------- */
  let ctx;
  function beep(freq, dur = 0.12) {
    if (!st.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
    } catch { /* audio unavailable */ }
  }
  const msg = (t, cls = '') => { $('#msg').textContent = t; $('#msg').className = 'msg ' + cls; };
  function stats() {
    $('#score').textContent = st.score; $('#streak').textContent = st.streak;
    $('#best').textContent = st.prof.best; $('#wins').textContent = st.prof.wins;
  }

  /* ---------- round flow ---------- */
  function newRound() {
    clearInterval(st.timer);
    const item = G.pick(items, { cat: st.cat, diff: st.diff }, st.used);
    if (!item) { st.item = null; $('#word').innerHTML = ''; $('#controls').innerHTML = ''; $('#hint').textContent = '–'; $('#status').textContent = ''; return msg('No words match this filter.', 'bad'); }
    st.item = item; st.over = false; st.hints = 0; msg('');
    $('#hint').textContent = item.hint;
    if (st.mode === 'guess') st.game = G.newHangman(item);
    else {
      st.game = { view: G.scramble(item.word) };
      st.total = st.left = 15 + item.word.length * 4;
      st.timer = setInterval(tick, 1000);
    }
    render();
  }

  function tick() {
    if (--st.left <= 0) { st.left = 0; end(false, `Time's up! The word was ${st.item.word.toUpperCase()}.`); }
    renderStatus();
  }

  function end(won, text) {
    if (st.over) return;
    st.over = true; clearInterval(st.timer);
    st.prof.played++;
    if (won) {
      const g = st.game;
      const pts = G.score({
        diff: st.item.diff, streak: st.streak, hints: st.hints,
        lives: st.mode === 'guess' ? g.max - g.misses : 0, timeLeft: st.mode === 'scramble' ? st.left : 0
      });
      st.score += pts; st.streak++; st.prof.wins++;
      st.prof.best = Math.max(st.prof.best, st.score);
      msg(`${text} +${pts} pts`, 'ok'); beep(740); setTimeout(() => beep(980), 120);
    } else { st.streak = 0; msg(text, 'bad'); beep(180, 0.3); }
    store.set('profile', st.prof);
    stats(); render();
  }

  /* ---------- rendering ---------- */
  function renderStatus() {
    const el = $('#status');
    if (st.mode === 'guess') {
      const g = st.game; if (!g) return;
      el.textContent = '❤️'.repeat(g.max - g.misses) + '🖤'.repeat(g.misses);
      el.setAttribute('aria-label', `${g.max - g.misses} lives left`);
    } else {
      el.innerHTML = `⏱ ${st.left}s<div class="bar"><i style="width:${(st.left / st.total) * 100}%"></i></div>`;
    }
  }

  function render() {
    if (!st.item) return;
    const w = $('#word'), c = $('#controls');
    renderStatus();
    if (st.mode === 'guess') {
      const g = st.game;
      w.innerHTML = [...g.item.word].map(ch => {
        const shown = g.guessed.includes(ch), lost = g.status === 'lost' && !shown;
        return `<span class="tile ${shown ? 'fill' : lost ? 'lost' : ''}">${shown || lost ? ch : ''}</span>`;
      }).join('');
      const keys = 'abcdefghijklmnopqrstuvwxyz'.split('').map(k => {
        const used = g.guessed.includes(k), hit = g.item.word.includes(k);
        return `<button data-k="${k}" ${used || st.over ? 'disabled' : ''} class="${used ? (hit ? 'ok' : 'bad') : ''}" aria-label="Letter ${k}">${k}</button>`;
      }).join('');
      c.innerHTML = `<div class="kb">${keys}</div><div class="row">` + (st.over
        ? `<button class="primary" id="next">Next word ▶</button>`
        : `<button id="hintBtn">💡 Reveal a letter (−5)</button><button id="skip">Skip</button>`) + `</div>`;
    } else {
      w.innerHTML = [...st.game.view].map(ch => `<span class="tile sc">${ch}</span>`).join('');
      c.innerHTML = st.over
        ? `<div class="row"><button class="primary" id="next">Next word ▶</button></div>`
        : `<div class="row"><input id="ans" maxlength="${st.item.word.length}" placeholder="Your answer" autocomplete="off" spellcheck="false" aria-label="Your answer">
           <button class="primary" id="check">Check</button></div>
           <div class="row"><button id="shuf">🔀 Shuffle</button><button id="hintBtn">💡 First letter (−5)</button><button id="skip">Skip</button></div>`;
      if (!st.over) $('#ans').focus();
    }
  }

  /* ---------- actions ---------- */
  function guessLetter(k) {
    if (st.over || st.mode !== 'guess' || !st.item) return;
    const before = st.game;
    st.game = G.guess(st.game, k);
    if (st.game === before) return;
    beep(st.game.item.word.includes(k) ? 520 : 220, 0.08);
    if (st.game.status === 'won') end(true, `Correct! It's ${st.item.word.toUpperCase()}.`);
    else if (st.game.status === 'lost') end(false, `Out of lives! The word was ${st.item.word.toUpperCase()}.`);
    else render();
  }

  function checkAnswer() {
    const v = $('#ans').value;
    if (!v.trim()) return msg('Type your answer first.', 'bad');
    if (G.checkAnswer(st.item, v)) end(true, `Correct! It's ${st.item.word.toUpperCase()}.`);
    else { msg(`"${v.toUpperCase()}" is not right – try again.`, 'bad'); beep(220, 0.1); }
  }

  function hint() {
    if (st.over) return;
    if (st.mode === 'guess') {
      const next = G.reveal(st.game);
      if (next === st.game) return msg('No more hints for this word.', 'bad');
      st.game = next; st.hints++; render();
    } else if (!st.hints) {
      st.hints = 1; msg(`Starts with "${st.item.word[0].toUpperCase()}"`);
    }
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) guessLetter(b.dataset.k);
    else if (b.id === 'next') newRound();
    else if (b.id === 'hintBtn') hint();
    else if (b.id === 'check') checkAnswer();
    else if (b.id === 'shuf') { st.game.view = G.scramble(st.item.word); render(); }
    else if (b.id === 'skip') { end(false, `Skipped. The word was ${st.item.word.toUpperCase()}.`); }
    else if (b.classList.contains('tab')) {
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === b));
      st.mode = b.dataset.mode; st.score = 0; st.streak = 0; stats(); newRound();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.id === 'ans') { if (e.key === 'Enter') checkAnswer(); return; }
    if (/^[a-z]$/i.test(e.key) && !/SELECT|INPUT/.test(e.target.tagName)) guessLetter(e.key);
    else if (e.key === 'Enter' && st.over && !/BUTTON|SELECT/.test(e.target.tagName)) newRound();
  });

  /* ---------- setup ---------- */
  $('#cat').innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('#cat').addEventListener('change', e => { st.cat = e.target.value; newRound(); });
  $('#diff').addEventListener('change', e => { st.diff = e.target.value; newRound(); });
  $('#help').onclick = () => $('#dlg').showModal();
  $('#close').onclick = () => $('#dlg').close();
  $('#sound').textContent = st.sound ? '🔊' : '🔇';
  $('#sound').onclick = () => { st.sound = !st.sound; store.set('sound', st.sound); $('#sound').textContent = st.sound ? '🔊' : '🔇'; };
  const savedTheme = store.get('theme', null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $('#theme').onclick = () => {
    const dark = document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; store.set('theme', next);
  };
  stats(); newRound();
})();
