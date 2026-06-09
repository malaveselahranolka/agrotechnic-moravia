// ---- Mobile menu ----
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      // the "Produkty" toplink toggles the dropdown on mobile — don't close the menu
      if (a.classList.contains('nav__toplink') && window.innerWidth <= 1024) return;
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
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
            <span>${it.n} <i>↗</i></span>
          </a>`).join('')}
      </div>
    </div>`;
  dropdown.innerHTML = `<div class="megamenu container">${group(PRODUCTS.agri)}${group(PRODUCTS.constr)}</div>`;
}

// Products section cards (homepage)
const pcard = (it) => `
  <a class="pcard" href="${it.u}" target="_blank" rel="noopener">
    <div class="pcard__img"><img src="${imgFor(it)}" alt="${it.n}" loading="lazy" onerror="${onErr}" /></div>
    <span class="pcard__name">${it.n} <i>↗</i></span>
  </a>`;
const fillCards = (id, g) => { const el = document.getElementById(id); if (el) el.innerHTML = g.items.map(pcard).join(''); };
fillCards('prodCardsAgri', PRODUCTS.agri);
fillCards('prodCardsConstr', PRODUCTS.constr);

// Dropdown toggle: hover on desktop, tap the whole "Produkty" row on mobile
document.querySelectorAll('.nav__item--drop').forEach(drop => {
  const toggleDrop = (e) => {
    if (window.innerWidth > 1024) return;        // desktop uses hover
    e.preventDefault();
    drop.classList.toggle('open');
  };
  drop.querySelector('.caret')?.addEventListener('click', toggleDrop);
  drop.querySelector('.nav__toplink')?.addEventListener('click', toggleDrop);
});

// ---- Reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), (i % 6) * 60);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Animated counters ----
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0;
    const step = Math.max(1, Math.round(target / 28));
    const tick = () => { n = Math.min(target, n + step); el.textContent = n; if (n < target) requestAnimationFrame(tick); };
    tick();
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(c => cio.observe(c));

// ---- Product floating preview (only shows once the image is actually loaded) ----
const pfloat = document.getElementById('pfloat');
if (pfloat) {
  const pimg = pfloat.querySelector('img');
  const items = document.querySelectorAll('.pitem[data-img]');
  let hovering = null;
  const move = (e) => { pfloat.style.left = e.clientX + 'px'; pfloat.style.top = e.clientY + 'px'; };
  const loaded = () => pimg.complete && pimg.naturalWidth > 0;
  items.forEach(it => {
    it.addEventListener('mouseenter', () => {
      hovering = it;
      const src = it.dataset.img;
      if (pimg.getAttribute('src') === src && loaded()) {
        pfloat.classList.add('show');
      } else {
        pfloat.classList.remove('show');   // hide until the new image is ready
        pimg.setAttribute('src', src);
      }
    });
    it.addEventListener('mousemove', move);
    it.addEventListener('mouseleave', () => {
      if (hovering === it) { hovering = null; pfloat.classList.remove('show'); }
    });
  });
  pimg.addEventListener('load', () => { if (hovering) pfloat.classList.add('show'); });
  pimg.addEventListener('error', () => pfloat.classList.remove('show'));
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

// ---- Year ----
const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();
