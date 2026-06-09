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

// ---- Product floating preview ----
const pfloat = document.getElementById('pfloat');
if (pfloat) {
  const pimg = pfloat.querySelector('img');
  const items = document.querySelectorAll('.pitem[data-img]');
  const move = (e) => { pfloat.style.left = e.clientX + 'px'; pfloat.style.top = e.clientY + 'px'; };
  items.forEach(it => {
    it.addEventListener('mouseenter', () => {
      pimg.src = it.dataset.img;
      pfloat.classList.add('show');
    });
    it.addEventListener('mousemove', move);
    it.addEventListener('mouseleave', () => pfloat.classList.remove('show'));
  });
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
