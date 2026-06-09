// Sticky nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
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

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), (i % 6) * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    let n = 0;
    const step = Math.max(1, Math.round(target / 30));
    const tick = () => {
      n = Math.min(target, n + step);
      el.textContent = n;
      if (n < target) requestAnimationFrame(tick);
    };
    tick();
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => cio.observe(c));

// Graceful image fallback (themed placeholder photos)
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    const host = img.parentElement;
    if (host) host.classList.add('img-fallback');
    img.style.display = 'none';
  });
});

// Agrobazar filtering
const filterBar = document.getElementById('filters');
if (filterBar) {
  const chips = filterBar.querySelectorAll('.chip');
  const items = document.querySelectorAll('#listings .listing');
  filterBar.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    items.forEach(it => {
      const show = f === 'all' || it.dataset.cat === f;
      it.style.display = show ? '' : 'none';
    });
  });
}

// Contact form → opens e-mail client with prefilled message
function handleSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const get = (id) => (f.querySelector('#' + id)?.value || '').trim();
  const name = get('name'), email = get('email'), phone = get('phone'),
        topic = get('topic'), msg = get('msg');
  const subject = `Poptávka z webu${topic ? ' – ' + topic : ''}`;
  const body =
    `Jméno: ${name}\n` +
    `E-mail: ${email}\n` +
    (phone ? `Telefon: ${phone}\n` : '') +
    (topic ? `Téma: ${topic}\n` : '') +
    `\n${msg}\n`;
  const mailto = `mailto:roman.lzicar@navos-km.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  const note = document.getElementById('formNote');
  if (note) note.hidden = false;
  return false;
}

// Year
const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();
