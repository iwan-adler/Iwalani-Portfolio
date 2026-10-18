(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const store = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };

  /* ---------- theme ---------- */
  const saved = store.get('ir-theme'); if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = t => { root.dataset.theme = t; store.set('ir-theme', t); };
  $('#theme-btn').addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));

  /* ---------- menu ---------- */
  const menuBtn = $('#menu-btn'), links = $('#nav-links');
  menuBtn.addEventListener('click', () => { const o = links.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); });
  links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); } });

  /* ---------- clock ---------- */
  const clock = $('#clock');
  const tick = () => { try { clock.textContent = new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Kolkata'}).format(new Date()) + ' IST'; } catch(e){} };
  tick(); setInterval(tick, 20000);

  /* ---------- copy email ---------- */
  const EMAIL = 'rosiwa648@gmail.com';
  const copyState = $('#copy-state'), emailEl = $('#email');
  $('#copy-btn').addEventListener('click', () => {
    const select = () => { const r = document.createRange(); r.selectNodeContents(emailEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copyState.textContent = 'Selected'; };
    try { navigator.clipboard.writeText(EMAIL).then(() => copyState.textContent = 'Copied ✓', select); } catch(e) { select(); }
    setTimeout(() => copyState.textContent = '', 2400);
  });

  /* ---------- scroll progress ---------- */
  const prog = $('#progress');
  const onScroll = () => { const h = root.scrollHeight - innerHeight; prog.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal on scroll (visible at rest) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.h2, .about-text, .edu, .card, .role, .skill, .feat, .big').forEach(el => {
      el.classList.add('reveal'); el.style.animationDelay = ([...el.parentNode.children].indexOf(el) % 4) * 90 + 'ms'; io.observe(el);
    });
  }

  /* ---------- hero name: letters respond to the pointer ---------- */
  const hero = $('#home'), first = $('#first');
  first.innerHTML = [...first.textContent].map(c => '<span class="ch">' + c + '</span>').join('');
  const chars = $$('#first .ch');
  let hp = { x: 0, y: 0, inside: false, nx: 0, ny: 0 };
  hero.addEventListener('pointermove', e => {
    const b = hero.getBoundingClientRect();
    hp = { x: e.clientX - b.left, y: e.clientY - b.top, inside: true, nx: (e.clientX - b.left) / b.width - .5, ny: (e.clientY - b.top) / b.height - .5 };
    if (reduce) return;
    chars.forEach(ch => {
      const r = ch.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const k = Math.max(0, 1 - d / 240);
      ch.style.setProperty('--w', Math.round(700 - k * 420));
      ch.style.setProperty('--y', (-k * 14).toFixed(1) + 'px');
    });
  });
  hero.addEventListener('pointerleave', () => { hp.inside = false; chars.forEach(ch => { ch.style.setProperty('--w', 700); ch.style.setProperty('--y', '0px'); }); });

  /* ---------- typing roles ---------- */
  const typed = $('#typed');
  const roles = ['CSE (AI & ML) Student', 'Developer', 'Builder', 'Hackathon team leader', 'Always learning'];
  if (!reduce) {
    let ri = 0, ci = roles[0].length, del = true, wait = 2200;
    const step = () => {
      const word = roles[ri];
      if (wait > 0) { const w = wait; wait = 0; return setTimeout(step, w); }
      if (del) { ci--; typed.textContent = word.slice(0, ci); if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; wait = 250; } setTimeout(step, 35); }
      else { const nw = roles[ri]; ci++; typed.textContent = nw.slice(0, ci); if (ci >= nw.length) { del = true; wait = 2200; } setTimeout(step, 65 + Math.random() * 50); }
    };
    step();
  }

  /* ---------- custom cursor ---------- */
  const ring = $('#cur-ring'), dot = $('#cur-dot'), curLabel = $('#cur-label');
  let cx = -100, cy = -100, rx = -100, ry = -100, forced = null;
  const setCur = (mode, text) => { forced = mode; ring.classList.toggle('label', mode === 'label'); ring.classList.toggle('hot', mode === 'hot'); if (text) curLabel.textContent = text; };
  if (fine && !reduce) {
    root.classList.add('has-cursor');
    addEventListener('pointermove', e => { cx = e.clientX; cy = e.clientY; dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; }, { passive: true });
    (function follow(){ rx += (cx - rx) * .2; ry += (cy - ry) * .2; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(follow); })();
    document.addEventListener('pointerover', e => {
      if (e.target.closest('#orbit-wrap')) return;
      if (e.target.closest('#twin-btn, #twin-fab')) return setCur('label', 'chat');
      const hot = e.target.closest('a, button, .skill li, .chip, .tags span, .avatar');
      setCur(hot ? 'hot' : null);
    });
    document.addEventListener('pointerleave', () => { ring.style.opacity = dot.style.opacity = 0; });
    document.addEventListener('pointerenter', () => { ring.style.opacity = dot.style.opacity = 1; });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) $$('.btn, .icon-link, .tool-btn').forEach(el => {
    el.classList.add('mag');
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx2', ((e.clientX - r.left - r.width / 2) * .28).toFixed(1) + 'px'); el.style.setProperty('--my2', ((e.clientY - r.top - r.height / 2) * .38).toFixed(1) + 'px'); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx2', '0px'); el.style.setProperty('--my2', '0px'); });
  });

  /* ---------- project cards: spotlight + 3D tilt ---------- */
  $$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (fine && !reduce) { c.style.setProperty('--ry', ((x / r.width - .5) * 7).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y / r.height) * 7).toFixed(2) + 'deg'); }
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });

  /* ---------- hero visibility (pause canvases offscreen) ---------- */
  let heroOn = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { heroOn = es[0].isIntersecting; }).observe(hero);

  /* ---------- starfield ---------- */
  const sky = $('#sky'), sc = sky.getContext('2d');
  let SW = 0, SH = 0, stars = [], shoots = [], px = 0, py = 0;
  const sizeSky = () => {
    const d = Math.min(devicePixelRatio || 1, 2), b = sky.getBoundingClientRect();
    SW = b.width; SH = b.height; sky.width = SW * d; sky.height = SH * d; sc.setTransform(d, 0, 0, d, 0, 0);
    stars = Array.from({ length: Math.round(SW * SH / 4200) }, () => ({ x: Math.random() * SW, y: Math.random() * SH, z: Math.random() * .9 + .1, tw: Math.random() * 6.28 }));
  };
  new ResizeObserver(() => { sizeSky(); if (reduce) drawSky(0); }).observe(sky);
  sizeSky();
  const shootFrom = (x, y) => shoots.push({ x, y, l: 0, a: Math.PI * (0.82 + Math.random() * .12) });
  hero.addEventListener('click', e => { if (e.target.closest('a, button, #orbit-wrap')) return; const b = hero.getBoundingClientRect(); shootFrom(e.clientX - b.left, e.clientY - b.top); });
  function drawSky(t) {
    px += ((hp.inside ? hp.nx : 0) - px) * .05; py += ((hp.inside ? hp.ny : 0) - py) * .05;
    sc.clearRect(0, 0, SW, SH);
    for (const s of stars) {
      const x = s.x - px * 50 * s.z, y = s.y - py * 50 * s.z;
      const a = .2 + .6 * s.z * (.6 + .4 * Math.sin(t * 1.6 + s.tw));
      sc.fillStyle = 'rgba(207,224,255,' + a.toFixed(3) + ')';
      sc.beginPath(); sc.arc(x, y, s.z * 1.25, 0, 6.283); sc.fill();
      if (hp.inside && !reduce) {
        const d = Math.hypot(x - hp.x, y - hp.y);
        if (d < 130) { sc.strokeStyle = 'rgba(121,184,255,' + ((1 - d / 130) * .45).toFixed(3) + ')'; sc.lineWidth = .7; sc.beginPath(); sc.moveTo(x, y); sc.lineTo(hp.x, hp.y); sc.stroke(); }
      }
    }
    if (!reduce && Math.random() < .003 && shoots.length < 2) shootFrom(SW * (.3 + Math.random() * .7), SH * Math.random() * .4);
    shoots = shoots.filter(s => {
      s.l += 1; const len = 140, sp = 11;
      const hx = s.x + Math.cos(s.a) * s.l * sp, hy = s.y + Math.sin(s.a) * s.l * sp;
      const tx = hx - Math.cos(s.a) * len, ty = hy - Math.sin(s.a) * len;
      const fade = Math.max(0, 1 - s.l / 55);
      const g = sc.createLinearGradient(hx, hy, tx, ty); g.addColorStop(0, 'rgba(234,242,255,' + fade + ')'); g.addColorStop(1, 'rgba(121,184,255,0)');
      sc.strokeStyle = g; sc.lineWidth = 1.6; sc.beginPath(); sc.moveTo(hx, hy); sc.lineTo(tx, ty); sc.stroke();
      sc.fillStyle = 'rgba(255,255,255,' + fade + ')'; sc.beginPath(); sc.arc(hx, hy, 1.8, 0, 6.283); sc.fill();
      return s.l < 55;
    });
  }

  /* ---------- orbit: drag to spin, tap a planet ---------- */
  const wrap = $('#orbit-wrap'), cv = $('#orbit'), ctx = cv.getContext('2d');
  const bodies = [
    { label: 'AI', ring: 0, speed: .22, phase: .4, r: 7, c: '#CFE6FF', go: '#skills' },
    { label: 'Machine Learning', ring: 1, speed: .15, phase: 2.2, r: 6, c: '#79B8FF', go: '#about' },
    { label: 'Full-stack', ring: 2, speed: .1, phase: 4.1, r: 8, c: '#4D7DFF', go: '#projects' },
    { label: 'Web', ring: 1, speed: .15, phase: 5.3, r: 4.5, c: '#A6C8FF', go: '#skills' },
    { label: 'Hackathons', ring: 2, speed: .1, phase: 1.0, r: 5, c: '#EAF2FF', go: '#experience' },
  ];
  const rings = [.34, .6, .86];
  let W = 0, H = 0, spin = 0, vel = 0, boost = 0, hover = null, coreHover = false, coreR = 0, placed = [];
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2), b = cv.getBoundingClientRect(); W = b.width; H = b.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  new ResizeObserver(() => { size(); if (reduce) draw(0); }).observe(cv);
  size();
  let tilt = -.32, squash = .42;
  const pos = (ring, a) => { const R = rings[ring] * W / 2, x = Math.cos(a) * R, y = Math.sin(a) * R * squash; return { x: W / 2 + x * Math.cos(tilt) - y * Math.sin(tilt), y: H / 2 + x * Math.sin(tilt) + y * Math.cos(tilt), z: Math.sin(a) }; };
  function draw(t) {
    if (!reduce) { tilt += ((-.32 + px * .35) - tilt) * .06; squash += ((.42 + py * .3) - squash) * .06; }
    ctx.clearRect(0, 0, W, H);
    const cx0 = W / 2, cy0 = H / 2;
    rings.forEach((rr, i) => { ctx.save(); ctx.translate(cx0, cy0); ctx.rotate(tilt); ctx.beginPath(); ctx.ellipse(0, 0, rr * W / 2, rr * W / 2 * squash, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(160,190,255,' + (i === 1 ? .22 : .3) + ')'; ctx.setLineDash(i === 1 ? [3, 7] : []); ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); });
    placed = bodies.map(b => { const a = b.phase + t * b.speed * (1 + boost) + spin * (1 - b.ring * .18); return { b, a, p: pos(b.ring, a) }; });
    const drawBody = ({ b, a, p }) => {
      const isH = hover === b, s = (.8 + .3 * (p.z + 1) / 2) * (isH ? 1.45 : 1);
      if (!reduce) for (let k = 1; k <= 10; k++) { const q = pos(b.ring, a - k * .05 * Math.sign(b.speed + vel * 10 || 1)); ctx.fillStyle = 'rgba(121,184,255,' + (.28 * (1 - k / 10)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, b.r * s * (1 - k / 13) * .6, 0, 6.283); ctx.fill(); }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, b.r * 4 * s); g.addColorStop(0, b.c); g.addColorStop(.25, b.c); g.addColorStop(1, 'rgba(77,125,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, b.r * 4 * s, 0, 6.283); ctx.fill();
      ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(p.x, p.y, b.r * s, 0, 6.283); ctx.fill();
      if (isH) { ctx.strokeStyle = 'rgba(207,224,255,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, b.r * s + 7, 0, 6.283); ctx.stroke(); }
      ctx.font = (isH ? '600 ' : '500 ') + Math.max(10, W / 44) + 'px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(207,224,255,' + (isH ? 1 : .55 + .45 * (p.z + 1) / 2) + ')';
      const tw = ctx.measureText(b.label).width, lx = Math.min(p.x + b.r * s + 8, W - tw - 4);
      ctx.fillText(b.label, lx, p.y - b.r * s - 4);
    };
    placed.filter(i => i.p.z < 0).forEach(drawBody);
    const pulse = 1 + (reduce ? 0 : Math.sin(t * 1.4) * .04) + (coreHover ? .08 : 0);
    const cr = W * .12 * pulse; coreR = cr;
    const g = ctx.createRadialGradient(cx0 - cr * .3, cy0 - cr * .3, 0, cx0, cy0, cr * 2.4);
    g.addColorStop(0, '#EAF2FF'); g.addColorStop(.18, '#9FD0FF'); g.addColorStop(.42, '#2C63F0'); g.addColorStop(1, 'rgba(5,11,30,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx0, cy0, cr * 2.4, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#050B1E'; ctx.font = 'italic ' + (cr * .95) + 'px "Instrument Serif", Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ir', cx0, cy0 + cr * .04); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    placed.filter(i => i.p.z >= 0).forEach(drawBody);
  }
  const hit = (x, y) => {
    let best = null, bd = 1e9;
    placed.forEach(({ b, p }) => { const d = Math.hypot(x - p.x, y - p.y); if (d < Math.max(22, b.r * 4) && d < bd) { bd = d; best = b; } });
    return best;
  };
  let drag = null;
  wrap.addEventListener('pointerdown', e => { drag = { x: e.clientX, moved: 0, last: e.clientX, t: performance.now() }; wrap.setPointerCapture(e.pointerId); wrap.classList.add('dragging'); });
  wrap.addEventListener('pointermove', e => {
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    if (drag) {
      const dx = e.clientX - drag.last; drag.last = e.clientX; drag.moved += Math.abs(dx);
      spin += dx * .012; vel = dx * .012; if (reduce) draw(0);
      setCur('label', 'spin');
      return;
    }
    hover = hit(x, y); coreHover = !hover && Math.hypot(x - W / 2, y - H / 2) < coreR * 1.1;
    if (fine && !reduce) setCur('label', hover ? 'go →' : coreHover ? 'open' : 'drag');
    if (reduce) draw(0);
  });
  const endDrag = e => {
    if (!drag) return;
    const wasTap = drag.moved < 6; drag = null; wrap.classList.remove('dragging');
    if (!wasTap) return;
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, h = hit(x, y);
    if (h) { boost = 3; setTimeout(() => document.querySelector(h.go).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 260); }
    else if (Math.hypot(x - W / 2, y - H / 2) < coreR * 1.1) openTerm();
  };
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', () => { drag = null; wrap.classList.remove('dragging'); });
  wrap.addEventListener('pointerleave', () => { hover = null; coreHover = false; if (!drag) setCur(null); });

  /* ---------- main loop ---------- */
  if (reduce) { drawSky(0); draw(0); document.fonts && document.fonts.ready.then(() => draw(0)); }
  else {
    const t0 = performance.now();
    const loop = n => {
      if (heroOn) {
        const t = (n - t0) / 1000;
        if (!drag) { spin += vel; vel *= .95; }
        boost *= .96;
        drawSky(t); draw(t);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- terminal ---------- */
  const term = $('#term'), out = $('#term-out'), input = $('#term-input'), form = $('#term-form');
  let hist = [], hi = -1, lastFocus = null, booted = false;
  const line = (parts, cls) => {
    const d = document.createElement('div'); d.className = 'l' + (cls ? ' ' + cls : '');
    (Array.isArray(parts) ? parts : [parts]).forEach(p => {
      if (typeof p === 'string') d.append(p);
      else if (p.href) { const a = document.createElement('a'); a.href = p.href; a.textContent = p.text; a.target = '_blank'; a.rel = 'noopener'; d.append(a); }
      else { const s = document.createElement('span'); s.className = p.cls; s.textContent = p.text; d.append(s); }
    });
    out.append(d); out.scrollTop = out.scrollHeight;
  };
  const sections = ['home', 'about', 'projects', 'experience', 'skills', 'achievements', 'contact'];
  const go = id => { closeTerm(); setTimeout(() => document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 120); };
  const cmds = {
    help: () => {
      line('Available commands:', 'm');
      [['whoami', 'who I am'], ['about', 'a little about me'], ['projects', "things I've built"], ['experience', 'leadership & roles'], ['skills', 'my toolkit'], ['achievements', 'beyond code'], ['contact', 'how to reach me'], ['goto <section>', 'jump to a section'], ['theme [light|dark]', 'switch the theme'], ['warp', 'spin the orbit'], ['twin', 'chat with my AI twin'], ['sudo hire-me', 'try it'], ['clear', 'clear the screen'], ['exit', 'close the terminal']]
        .forEach(([c, d]) => line([{ cls: 'c', text: c.padEnd(20) }, d]));
    },
    whoami: () => { line('Iwalani Rosita'); line('Integrated M.Tech · CSE (AI & ML) · SRM University-AP', 'm'); },
    about: () => line("I'm a CSE (AI & ML) student who learns by building. I'm into AI, ML and full-stack web development, and I spend my time on projects, hackathons and E-Cell at SRM University-AP."),
    projects: () => {
      line([{ cls: 'c', text: '★ SRM Orbit' }, ' · Contextual Campus OS (Google Solution Hunt 2026)']);
      line(['  ', { href: 'https://google-solution-hunt-2026-qm9up1z9e-rosiwa648-6115.vercel.app/', text: 'live demo' }, '  ', { href: 'https://github.com/iwan-adler/google-solution-hunt-2026', text: 'github' }]);
      line([{ cls: 'c', text: '◦ Student Management System' }, ' · my first GitHub project']);
      line(['  ', { href: 'https://github.com/iwan-adler/Student_management_system', text: 'github' }]);
    },
    experience: () => { line([{ cls: 'c', text: 'Team Leader' }, ' · Google Solution Hunt 2026 · SRM Orbit (with Aislinn Shaikh & Damini Roy)']); line([{ cls: 'c', text: 'Events & Operations Member' }, ' · E-Cell, SRM University-AP']); },
    skills: () => { line([{ cls: 'c', text: 'programming '.padEnd(13) }, 'C++']); line([{ cls: 'c', text: 'web'.padEnd(13) }, 'HTML · CSS · JavaScript · TypeScript · React · Next.js · Tailwind CSS']); line([{ cls: 'c', text: 'ai'.padEnd(13) }, 'Gemini API · AI integration · natural-language interfaces']); line([{ cls: 'c', text: 'tools'.padEnd(13) }, 'Git · GitHub · VS Code · Vercel']); },
    achievements: () => { line('· Google Solution Hunt 2026 · Team Leader'); line('· E-Cell · Events & Operations Member'); line('· NCC A Certificate'); line('· Spell Bee and sports certifications'); },
    contact: () => { line([{ cls: 'c', text: 'email    ' }, EMAIL]); line([{ cls: 'c', text: 'linkedin ' }, { href: 'https://www.linkedin.com/in/iwalanirosita264826', text: 'linkedin.com/in/iwalanirosita264826' }]); line([{ cls: 'c', text: 'github   ' }, { href: 'https://github.com/iwan-adler', text: 'github.com/iwan-adler' }]); },
    goto: a => { const id = (a[0] || '').toLowerCase(); if (sections.includes(id)) { line('→ ' + id, 'g'); go(id); } else line('Try one of: ' + sections.join(', '), 'm'); },
    theme: a => { const t = a[0] === 'light' || a[0] === 'dark' ? a[0] : (isDark() ? 'light' : 'dark'); setTheme(t); line('Theme set to ' + t + '.', 'g'); },
    warp: () => { boost = 14; vel = .08; line('Warp speed engaged. Look at the orbit ✦', 'g'); },
    sudo: a => { if ((a[0] || '') === 'hire-me') { line('[sudo] password for recruiter: ********', 'm'); line('Access granted ✓', 'g'); line(['The fastest way in: ', EMAIL]); } else line('sudo: try "sudo hire-me"', 'm'); },
    clear: () => { out.textContent = ''; },
    exit: () => closeTerm(),
    ls: () => line(sections.join('   '), 'c'),
    hello: () => line('Hi! 👋 Type help to look around.'),
    twin: () => { line('Calling my AI twin…', 'g'); closeTerm(); setTimeout(() => window.openTwin && window.openTwin(), 150); },
  };
  cmds.hi = cmds.hello; cmds.cd = cmds.goto;
  const run = raw => {
    const v = raw.trim(); line([{ cls: 'c', text: '~ $ ' }, v]);
    if (!v) return;
    hist.unshift(v); hi = -1;
    const [c, ...args] = v.split(/\s+/); const fn = cmds[c.toLowerCase()];
    fn ? fn(args) : line('command not found: ' + c + '. Type help.', 'm');
  };
  const chipList = ['help', 'whoami', 'projects', 'twin', 'contact', 'warp', 'sudo hire-me'];
  chipList.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', () => { run(c); input.focus(); }); $('#term-chips').append(b); });
  function openTerm() {
    lastFocus = document.activeElement; term.hidden = false;
    if (!booted) { booted = true; line('iwalani.os v1.0 · ' + new Date().toDateString(), 'm'); line("Welcome! I'm Iwalani. Type help, or tap a command below.", 'g'); }
    setTimeout(() => input.focus(), 30);
  }
  function closeTerm() { term.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $('#term-btn').addEventListener('click', openTerm);
  $('#term-close').addEventListener('click', closeTerm);
  term.addEventListener('click', e => { if (e.target === term) closeTerm(); });
  form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); if (hi < hist.length - 1) input.value = hist[++hi]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.max(-1, hi - 1); input.value = hi < 0 ? '' : hist[hi]; }
    else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(cmds).filter(k => k.startsWith(input.value)); if (m.length === 1) input.value = m[0] + ' '; else if (m.length) line(m.join('  '), 'm'); }
  });
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === 'Escape' && !term.hidden) closeTerm();
    else if (((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); term.hidden ? openTerm() : closeTerm(); }
  });

  /* pause SMIL logo for reduced motion */
  if (reduce) { const l = $('#logo-svg'); l && l.pauseAnimations && l.pauseAnimations(); }
})();

/* ===== AI twin: animated character + chat ===== */
(() => {
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const twin = $('#twin'), btn = $('#twin-btn'), say = $('#twin-say'), fab = $('#twin-fab');
  const chat = $('#chat'), log = $('#chat-log'), form = $('#chat-form'), input = $('#chat-input'), sugg = $('#chat-sugg');
  if (!twin || !chat) return;
  const EMAIL = 'rosiwa648@gmail.com';

  /* speech bubble cycles through lines */
  const lines = ["Hey! ✨ I'm Iwalani's AI twin.<br>Click me to chat!", "Ask me about SRM Orbit 🚀", "Curious what I build with? Ask me!", "Psst… I know all her projects 👀"];
  let li = 0;
  if (!reduce) setInterval(() => {
    if (!chat.hidden) return;
    say.classList.add('swap');
    setTimeout(() => { li = (li + 1) % lines.length; say.innerHTML = lines[li]; say.classList.remove('swap'); }, 300);
  }, 4200);

  /* she leans toward the cursor */
  if (!reduce) addEventListener('pointermove', e => {
    const r = btn.getBoundingClientRect(); if (!r.width) return;
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    btn.querySelector('.twin-lean').style.setProperty('--lean', Math.max(-4, Math.min(4, dx * 9)).toFixed(2) + 'deg');
  }, { passive: true });

  /* floating launcher once the hero is out of view */
  const hero = document.getElementById('home');
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { fab.hidden = es[0].isIntersecting || !chat.hidden; }).observe(hero);

  /* local answers, used when the AI service is not reachable */
  const KB = [
    [/\b(hi|hey|hello|hii+|yo|namaste)\b/, "Hey there! 👋 I'm Iwalani's AI twin. Ask me about her projects, skills, experience or how to reach her."],
    [/srm orbit|orbit|campus os|solution hunt|hackathon|google/, "SRM Orbit is my favourite build! 🚀 It's a Contextual Campus OS we made at Google Solution Hunt 2026, an AI layer that lets students ask about wayfinding, academics, transport, student services, health and emergency support in plain language. I led a three-person team with Aislinn Shaikh and Damini Roy. Built with Next.js, React, TypeScript, Tailwind CSS, the Gemini API and Vercel.\nDemo: https://google-solution-hunt-2026-qm9up1z9e-rosiwa648-6115.vercel.app/\nCode: https://github.com/iwan-adler/google-solution-hunt-2026"],
    [/student management|first project|tkinter|sqlite|python/, "The Student Management System was my very first GitHub project. I built it to learn project structure and how to publish on GitHub. It uses Python, Tkinter and SQLite.\nhttps://github.com/iwan-adler/Student_management_system"],
    [/project|built|build|work|portfolio/, "I've built two projects you'll see here: SRM Orbit, an AI-powered campus assistant from Google Solution Hunt 2026, and a Student Management System, my first GitHub project. Want details on either?"],
    [/skill|stack|tech|language|know|tools?|react|next|typescript|javascript|c\+\+|gemini/, "My toolkit 🛠️\n• Programming: C++\n• Web: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS\n• AI: Gemini API, AI integration, natural-language interfaces\n• Tools: Git, GitHub, VS Code, Vercel"],
    [/e-?cell|experience|leader|role|lead|intern|job/, "I'm an Events & Operations Member at E-Cell, SRM University-AP, helping plan and run entrepreneurship events. I was also Team Leader at Google Solution Hunt 2026, where my team built SRM Orbit."],
    [/achieve|award|ncc|certif|spell|sport/, "Beyond code: Team Leader at Google Solution Hunt 2026, E-Cell Events & Operations Member, the NCC A Certificate, plus Spell Bee and sports certifications. ✨"],
    [/study|college|university|degree|education|srm|m\.?tech|course|year/, "I'm doing an Integrated M.Tech in Computer Science & Engineering (AI & ML) at SRM University-AP. 🎓"],
    [/contact|email|mail|reach|hire|linkedin|connect|github|collab/, "I'd love to hear from you! 💌\nEmail: " + EMAIL + "\nLinkedIn: https://www.linkedin.com/in/iwalanirosita264826\nGitHub: https://github.com/iwan-adler"],
    [/who|about|yourself|iwalani|rosita|tell me/, "I'm Iwalani Rosita's AI twin! She's a CSE (AI & ML) student at SRM University-AP who learns by building, mostly in AI and full-stack web development, through projects, hackathons and E-Cell."],
    [/interest|hobby|passion|like|love|ai|ml|machine/, "I'm most excited about AI, machine learning and full-stack development, especially building practical tools people actually use. 💙"],
    [/real|bot|ai twin|are you/, "I'm an AI twin, not Iwalani herself. I only answer from what's on her portfolio. For anything else, email her at " + EMAIL + "!"],
  ];
  const localAnswer = q => { const t = q.toLowerCase(); for (const [re, a] of KB) if (re.test(t)) return a; return "Hmm, I'm not sure about that one, and I don't want to make things up! 😅 Try asking about her projects, skills or experience, or email her at " + EMAIL + "."; };

  /* rendering */
  const linkify = (el, text) => {
    const parts = text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
    parts.forEach((p, i) => {
      if (i % 2) { const a = document.createElement('a'); a.textContent = p; a.href = p.includes('@') && !p.startsWith('http') ? 'mailto:' + p : p; a.target = '_blank'; a.rel = 'noopener'; el.append(a); }
      else el.append(p);
    });
  };
  const add = (who, text) => { const m = document.createElement('div'); m.className = 'msg ' + who; linkify(m, text); log.append(m); log.scrollTop = log.scrollHeight; return m; };
  const typing = () => { const m = document.createElement('div'); m.className = 'msg bot typing'; m.innerHTML = '<i></i><i></i><i></i>'; log.append(m); log.scrollTop = log.scrollHeight; return m; };

  const history = [];
  let busy = false, greeted = false;
  async function ask(q) {
    q = q.trim(); if (!q || busy) return;
    busy = true; add('me', q); history.push({ role: 'user', text: q });
    const t = typing(); const started = Date.now();
    let answer = null;
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch('/api/twin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-10) }), signal: ctl.signal });
      clearTimeout(to);
      if (r.ok) { const j = await r.json(); if (j && typeof j.reply === 'string' && j.reply.trim()) answer = j.reply.trim(); }
    } catch (e) {}
    if (!answer) answer = localAnswer(q);
    const wait = Math.max(0, 650 - (Date.now() - started));
    setTimeout(() => { t.remove(); add('bot', answer); history.push({ role: 'model', text: answer }); busy = false; }, wait);
  }

  const chips = ['Who are you?', 'Tell me about SRM Orbit', 'What are your skills?', 'Experience', 'How do I contact you?'];
  chips.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', () => ask(c)); sugg.append(b); });

  let lastFocus = null;
  function openTwin() {
    lastFocus = document.activeElement;
    chat.hidden = false; fab.hidden = true;
    if (!greeted) { greeted = true; add('bot', "Hey! ✨ I'm Iwalani's AI twin. I know all about her projects, skills and experience. What would you like to know?"); }
    setTimeout(() => input.focus({ preventScroll: true }), 60);
  }
  function closeTwin() {
    chat.hidden = true;
    const r = hero.getBoundingClientRect(); fab.hidden = r.bottom > 0 && r.top < innerHeight;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openTwin = openTwin;
  btn.addEventListener('click', () => { if (!reduce) { twin.classList.remove('hop'); void twin.offsetWidth; twin.classList.add('hop'); } setTimeout(openTwin, reduce ? 0 : 280); });
  fab.addEventListener('click', openTwin);
  $('#chat-close').addEventListener('click', closeTwin);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !chat.hidden) closeTwin(); });
  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; ask(v); });
})();
