// ---- Inline SVG icon sprite (clean line icons replace emoji) ----
(function injectIcons() {
  if (document.getElementById('i-pin')) return;   // already inlined in HTML
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3l2 5-2.2 1.4a11 11 0 0 0 5.8 5.8L15 14l5 2v3a2 2 0 0 1-2.1 2A16 16 0 0 1 3 6.1 2 2 0 0 1 5 4z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
    <symbol id="i-building" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13m-5-6 6 6-6 6"/></symbol>
    <symbol id="i-ext" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></symbol>`;
  document.body.insertBefore(svg, document.body.firstChild);
})();
const ICO = (id, cls) => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Mobile menu (side drawer) ----
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
let backdrop;
if (toggle && links) {
  backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);
  const setOpen = (open) => {
    if (open) {
      // align the drawer's top yellow border exactly onto the header's yellow strip
      const nav = document.querySelector('.nav');
      const navBottom = Math.round(nav.getBoundingClientRect().bottom);
      const bw = Math.round(parseFloat(getComputedStyle(nav).borderBottomWidth) || 3);
      links.style.top = (navBottom - bw) + 'px';
      backdrop.style.top = navBottom + 'px';
    }
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-locked', open);
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  backdrop.addEventListener('click', () => setOpen(false));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      if (a.classList.contains('nav__toplink') && window.innerWidth <= 1024) return;
      setOpen(false);
    })
  );
}

// ---- Product catalog (shared by navbar dropdown AND the Products section) ----
const NHM = 'https://www.eagrotec.cz/products/nakladace-a-manipulatory/';
const PRODUCTS = {
  agri: { title: 'New Holland Agriculture', items: [
    { n: 'Traktory', u: 'https://www.eagrotec.cz/produkty/traktory', s: 'traktory' },
    { n: 'Sklizňové stroje', u: 'https://www.eagrotec.cz/produkty/skliznove-stroje', s: 'skliznove' },
    { n: 'Svinovací a vysokotlaké lisy', u: 'https://www.eagrotec.cz/produkty/svinovaci-lisy', s: 'lisy' },
    { n: 'PLMi — precizní zemědělství', u: 'https://www.eagrotec.cz/products/navigace', s: 'plmi' },
    { n: 'Komunální technika', u: 'https://www.eagrotec.cz/products/komunalni-technika', s: 'komunalni' },
    { n: 'Viniční technika', u: 'https://www.eagrotec.cz/produkty/vinicni-technika', s: 'vinicni' },
    { n: 'Reklamní předměty', u: 'http://shop.eagrotec.cz/', s: 'reklamni' },
  ]},
  constr: { title: 'New Holland Construction', items: [
    { n: 'Smykem řízené nakladače řady L', u: NHM + 'l213-l234', s: 'smykem-l' },
    { n: 'Kloubové nakladače řady W', u: NHM + 'klbove-nakladace-w', s: 'kloubove-w' },
    { n: 'Minirýpadla řady E', u: NHM + 'mini-rypadla-e', s: 'minirypadla-e' },
    { n: 'Rypadlonakladače řady B', u: NHM + 'rypadlove-nakladace-b', s: 'rypadlo-b' },
    { n: 'Kompaktní kloubové nakladače řady W', u: NHM + 'kompaktne-nakladace-w', s: 'kompaktni-w' },
    { n: 'Teleskopické manipulátory TH', u: NHM + 'teleskopicke-manipulatory-th', s: 'teleskop-th' },
  ]},
};
const imgFor = (it) => `assets/products/${it.s}.jpg`;
const onErr = "this.parentElement.classList.add('img-fallback');this.style.visibility='hidden'";

// Navbar mega-dropdown
const dropdown = document.getElementById('prodDropdown');
if (dropdown) {
  const group = (g) => `
    <div class="mega__group">
      <h4>${g.title}</h4>
      <div class="mega__grid">
        ${g.items.map(it => `
          <a class="mega__card" href="${it.u}" target="_blank" rel="noopener">
            <img src="${imgFor(it)}" alt="" loading="lazy" onerror="${onErr}" />
            <span>${it.n}${ICO('i-ext', 'ico--ext')}</span>
          </a>`).join('')}
      </div>
    </div>`;
  dropdown.innerHTML = `<div class="megamenu container">${group(PRODUCTS.agri)}${group(PRODUCTS.constr)}</div>`;
}

// Products section cards (homepage)
const pcard = (it) => `
  <a class="pcard" href="${it.u}" target="_blank" rel="noopener">
    <div class="pcard__img"><img src="${imgFor(it)}" alt="${it.n}" loading="lazy" onerror="${onErr}" /></div>
    <span class="pcard__name">${it.n}${ICO('i-ext', 'ico--ext')}</span>
  </a>`;
const fillCards = (id, g) => { const el = document.getElementById(id); if (el) el.innerHTML = g.items.map(pcard).join(''); };
fillCards('prodCardsAgri', PRODUCTS.agri);
fillCards('prodCardsConstr', PRODUCTS.constr);

// Dropdown toggle: hover on desktop, tap the whole "Produkty" row on mobile
document.querySelectorAll('.nav__item--drop').forEach(drop => {
  const dd = drop.querySelector('.dropdown');
  const toggleDrop = (e) => {
    if (window.innerWidth > 1024) return;        // desktop uses hover
    e.preventDefault();
    const opening = !drop.classList.contains('open');
    drop.classList.toggle('open', opening);
    if (dd) dd.style.maxHeight = opening ? dd.scrollHeight + 'px' : '0px';  // exact height = smooth both ways
  };
  drop.querySelector('.caret')?.addEventListener('click', toggleDrop);
  drop.querySelector('.nav__toplink')?.addEventListener('click', toggleDrop);
});

// ---- Nav shadow once scrolled ----
const navEl = document.querySelector('.nav');
if (navEl) {
  const onScrollNav = () => navEl.classList.toggle('nav--scrolled', window.scrollY > 8);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });
}

// ---- Reveal on scroll (staggered, fine-grained) ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx = Math.max(0, sibs.indexOf(el));
    el.style.transitionDelay = Math.min(idx, 8) * 80 + 'ms';
    el.classList.add('in');
    io.unobserve(el);
  });
}, { threshold: 0.02, rootMargin: '0px 0px 14% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Animated counters ----
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    if (RM) { el.textContent = target; cio.unobserve(el); return; }
    const dur = 1100, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(c => cio.observe(c));

// ---- Subtle parallax on photo bands (replaces the auto-zoom) ----
const bandImgs = [...document.querySelectorAll('.band__img')];
if (bandImgs.length && !RM) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    bandImgs.forEach(img => {
      const band = img.parentElement;
      const r = band.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
      const shift = Math.max(-1, Math.min(1, progress)) * (r.height * 0.25);
      img.style.transform = `translate3d(0, ${(-shift).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

// ---- Graceful image fallback ----
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    const host = img.parentElement;
    if (host) host.classList.add('img-fallback');
    img.style.visibility = 'hidden';
  });
});

// ---- Contact form → opens e-mail client ----
function handleSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const get = (id) => (f.querySelector('#' + id)?.value || '').trim();
  const name = get('name'), email = get('email'), phone = get('phone'), topic = get('topic'), msg = get('msg');
  const subject = `Poptávka z webu${topic ? ' – ' + topic : ''}`;
  const body =
    `Jméno: ${name}\n` +
    `E-mail: ${email}\n` +
    (phone ? `Telefon: ${phone}\n` : '') +
    (topic ? `Téma: ${topic}\n` : '') +
    `\n${msg}\n`;
  window.location.href = `mailto:roman.lzicar@navos-km.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const note = document.getElementById('formNote');
  if (note) note.hidden = false;
  return false;
}

// ---- Financing calculator ----
const calcPrice = document.getElementById('calcPrice');
if (calcPrice) {
  const $ = (id) => document.getElementById(id);
  const down = $('calcDown'), term = $('calcTerm');
  const priceOut = $('calcPriceOut'), downOut = $('calcDownOut'), termOut = $('calcTermOut'), monthly = $('calcMonthly');
  const RATE = 0.059; // orientační úrok p.a.
  const fmt = (n) => Math.round(n).toLocaleString('cs-CZ');
  const update = () => {
    const p = +calcPrice.value, d = +down.value, t = +term.value;
    priceOut.textContent = fmt(p) + ' Kč';
    downOut.textContent = d + ' %';
    termOut.textContent = t + ' měs.';
    const principal = p * (1 - d / 100);
    const r = RATE / 12;
    const pay = r ? principal * r / (1 - Math.pow(1 + r, -t)) : principal / t;
    monthly.textContent = fmt(pay);
  };
  [calcPrice, down, term].forEach((el) => el.addEventListener('input', update));
  update();
}

// ---- Newsletter sign-up ----
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type=email]');
  const email = (input?.value || '').trim();
  const subject = 'Přihlášení k odběru newsletteru';
  const body = `Dobrý den,\nrád/a bych odebíral/a novinky AGROTECHNIC MORAVIA.\nMůj e-mail: ${email}\n`;
  window.location.href = `mailto:roman.lzicar@navos-km.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const note = e.target.querySelector('.newsletter__note');
  if (note) note.hidden = false;
  return false;
}

// ---- Year ----
const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();
