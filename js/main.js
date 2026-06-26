// ═══════════ CADEVI Salud ═══════════
const WA = '5491149367634'; // Cel 15-4936-7634 (verificar cuál usa Cadevi para WhatsApp)

// ── Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  const o = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', o);
  navToggle.setAttribute('aria-expanded', o);
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// ── WhatsApp (data-wa)
document.querySelectorAll('[data-wa]').forEach(b => b.addEventListener('click', e => {
  e.preventDefault();
  const txt = b.dataset.wa || 'Hola CADEVI Salud! Quisiera hacer una consulta.';
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`, '_blank');
}));

// ── Hero: entrada palabra por palabra
(function(){
  const h = document.getElementById('heroTitle');
  if(!h) return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if(n.nodeType === 3){ // texto
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if(/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(w)); return; }
          if(!w) return;
          const s = document.createElement('span');
          s.className = 'word'; s.textContent = w;
          frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if(n.nodeType === 1){
        n.classList.add('word');
        walk(n);
      }
    });
  };
  walk(h);
  h.querySelectorAll('.word').forEach((w,i) => w.style.animationDelay = (.2 + i*.08) + 's');
})();

// ── Cómo trabajamos (pasos)
const PASOS = [
  {t:'Nos contactás', d:'Llamás o escribís por WhatsApp. Te escuchamos y entendemos la necesidad.'},
  {t:'Evaluamos el caso', d:'Definimos el tipo de acompañamiento, turnos y lugar: domicilio, sanatorio u hospital.'},
  {t:'Asignamos al acompañante', d:'Personal calificado, humano y supervisado, ideal para cada situación.'},
  {t:'Seguimiento continuo', d:'Supervisamos la atención y acompañamos a la familia en todo momento.'},
];
const pasosEl = document.getElementById('pasos');
if(pasosEl){
  pasosEl.innerHTML = PASOS.map((p,i)=>`
    <div class="paso reveal d${(i%3)+1}">
      <span class="paso-line" aria-hidden="true"></span>
      <span class="paso-num">${String(i+1).padStart(2,'0')}</span>
      <h3>${p.t}</h3>
      <p>${p.d}</p>
    </div>`).join('');
}

// ── Testimonios
const TESTIMONIOS = [
  {q:'El acompañante que nos asignaron fue una bendición. Trato humano, puntual y muy profesional con mi mamá.', n:'Marta G.', r:'Hija de paciente', a:'M'},
  {q:'Necesitábamos a alguien de un día para el otro por una internación y respondieron al instante. Recomendables.', n:'Roberto P.', r:'Familiar', a:'R'},
  {q:'Cuidaron a mi papá de noche durante semanas. Siempre supervisados y atentos. Nos dieron mucha tranquilidad.', n:'Lucía F.', r:'Hija de paciente', a:'L'},
];
const star = '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 18.5 5.9 20.4l1.4-6.8-5.1-4.6 6.9-.7z"/></svg>';
const testiEl = document.getElementById('testiGrid');
if(testiEl){
  testiEl.innerHTML = TESTIMONIOS.map((t,i)=>`
    <article class="testi-card reveal d${(i%3)+1}">
      <div class="testi-stars">${star.repeat(5)}</div>
      <p class="testi-quote">“${t.q}”</p>
      <div class="testi-who">
        <span class="testi-av">${t.a}</span>
        <span><span class="testi-name">${t.n}</span><br><span class="testi-rel">${t.r}</span></span>
      </div>
    </article>`).join('');
}

// ── Reveal observer
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── Count-up stats (Number Ticker)
(function(){
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const run = el => {
    const to = +el.dataset.to, suf = el.dataset.suffix || '';
    if(reduce){ el.textContent = to + suf; return; }
    const dur = 1400, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0)/dur, 1);
      const e = 1 - Math.pow(1-p, 3); // easeOutCubic
      el.textContent = Math.round(to*e) + suf;
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const so = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ run(e.target); so.unobserve(e.target); }
  }), {threshold:.6});
  document.querySelectorAll('.stat-num').forEach(el => so.observe(el));
})();

// ── Spotlight hover en servicios
document.querySelectorAll('.serv-card').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// ── Fondo: cruces médicas flotando (partículas)
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const C = document.getElementById('particles'); if(!C) return;
  const cross = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z"/></svg>';
  for(let i=0;i<14;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const s = 10 + Math.random()*22;
    p.style.width = p.style.height = s + 'px';
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (16 + Math.random()*16) + 's';
    p.style.animationDelay = (-Math.random()*20) + 's';
    p.innerHTML = cross;
    C.appendChild(p);
  }
})();

// ── Año footer
document.getElementById('yr').textContent = new Date().getFullYear();
