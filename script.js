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
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    })
  );
}

// ---- Products mega-dropdown (image + external link) ----
const NHM = 'https://www.eagrotec.cz/products/nakladace-a-manipulatory/';
const PRODUCTS = {
  agri: { title: 'New Holland Agriculture', items: [
    { n: 'Traktory', u: 'https://www.eagrotec.cz/produkty/traktory', img: 'assets/img/p-traktory.jpg' },
    { n: 'Sklizňové stroje', u: 'https://www.eagrotec.cz/produkty/skliznove-stroje', img: 'assets/img/p-skliznove.jpg' },
    { n: 'Svinovací a vysokotlaké lisy', u: 'https://www.eagrotec.cz/produkty/svinovaci-lisy', img: 'assets/img/p-lisy.png' },
    { n: 'PLMi — precizní zemědělství', u: 'https://www.eagrotec.cz/products/navigace', img: 'assets/img/p-plmi.png' },
    { n: 'Komunální technika', u: 'https://www.eagrotec.cz/products/komunalni-technika', img: 'assets/img/p-komunalni.png' },
    { n: 'Viniční technika', u: 'https://www.eagrotec.cz/produkty/vinicni-technika', img: 'assets/img/p-vinicni.png' },
    { n: 'Reklamní předměty', u: 'http://shop.eagrotec.cz/', img: 'assets/img/p-reklamni.jpg' },
  ]},
  constr: { title: 'New Holland Construction', items: [
    { n: 'Smykem řízené nakladače řady L', u: NHM + 'l213-l234', img: 'assets/img/p-smykem-l.jpg' },
    { n: 'Kloubové nakladače řady W', u: NHM + 'klbove-nakladace-w', img: 'assets/img/p-kloubove-w.png' },
    { n: 'Minirýpadla řady E', u: NHM + 'mini-rypadla-e', img: 'assets/img/p-minirypadla-e.jpg' },
    { n: 'Rypadlonakladače řady B', u: NHM + 'rypadlove-nakladace-b', img: 'assets/img/p-rypadlo-b.png' },
    { n: 'Kompaktní kloubové nakladače řady W', u: NHM + 'kompaktne-nakladace-w', img: 'assets/img/p-kompaktni-w.png' },
    { n: 'Teleskopické manipulátory TH', u: NHM + 'teleskopicke-manipulatory-th', img: 'assets/img/p-teleskop-th.png' },
  ]},
};
const dropdown = document.getElementById('prodDropdown');
if (dropdown) {
  const group = (g) => `
    <div class="mega__group">
      <h4>${g.title}</h4>
      <div class="mega__grid">
        ${g.items.map(it => `
          <a class="mega__card" href="${it.u}" target="_blank" rel="noopener">
            <img src="${it.img}" alt="" loading="lazy" />
            <span>${it.n} <i>↗</i></span>
          </a>`).join('')}
      </div>
    </div>`;
  dropdown.innerHTML = `<div class="megamenu container">${group(PRODUCTS.agri)}${group(PRODUCTS.constr)}</div>`;
}
// mobile caret toggle for the dropdown
document.querySelectorAll('.nav__item--drop .caret').forEach(c => {
  c.addEventListener('click', (e) => {
    if (window.innerWidth > 1024) return;        // desktop uses hover
    e.preventDefault();
    c.closest('.nav__item--drop').classList.toggle('open');
  });
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
