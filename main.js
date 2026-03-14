/* =============================================
   MARLON — Developer Portfolio
   main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================
     1. NAVBAR
  ===================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* =====================
     2. MOBILE MENU
  ===================== */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  const openMenu  = () => { mobileMenu.classList.add('open'); hamburger.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobileMenu.classList.remove('open'); hamburger.classList.remove('active'); document.body.style.overflow = ''; };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
  mobileMenu?.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });


  /* =====================
     3. SCROLL REVEAL
  ===================== */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* =====================
     4. TYPING EFFECT
     (Hero role line)
  ===================== */
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'Web Developer & Designer',
    'WordPress Specialist',
    'Shopify Expert',
    'Landing Page Builder',
    'Bug Fixer & Problem Solver',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      typingEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 500); return; }
    } else {
      typingEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
    }
    setTimeout(type, deleting ? 40 : 75);
  }
  if (typingEl) type();


  /* =====================
     5. MOUSE PARALLAX ORBS
  ===================== */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
    if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
  });


  /* =====================
     6. SMOOTH SCROLL
  ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });


  /* =====================
     7. ACTIVE NAV HIGHLIGHT
  ===================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--blue-bright)';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spyObs.observe(s));


  /* =====================
     8. EMAILJS CONTACT FORM
  ===================== */
  // ⚠️ Replace with your EmailJS credentials:
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formErrorMsg');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSpan = submitBtn.querySelector('span');
    const orig = btnSpan.textContent;
    btnSpan.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    if (formError) formError.style.display = 'none';

    const data = {
      from_name:  form.querySelector('[name="from_name"]').value.trim(),
      from_email: form.querySelector('[name="from_email"]').value.trim(),
      service:    form.querySelector('[name="service"]').value,
      budget:     form.querySelector('[name="budget"]').value,
      message:    form.querySelector('[name="message"]').value.trim(),
      reply_to:   form.querySelector('[name="from_email"]').value.trim(),
    };

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not configured. Add credentials in main.js.');
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
      form.style.display = 'none';
      formSuccess.classList.add('show');
    } catch (err) {
      console.error(err);
      if (formError) {
        formError.style.display = 'block';
        formError.textContent = err.message?.includes('not configured')
            ? '⚠️ EmailJS not configured yet — add your credentials in main.js.'
            : '❌ Something went wrong. Please email me directly.';
      }
      btnSpan.textContent = orig;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });


  /* =====================
     9. AUTO YEAR
  ===================== */
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();


  /* =====================
     10. TOOLS FILTER
  ===================== */
  const filterBtns = document.querySelectorAll('.tf-btn');
  const toolCards  = document.querySelectorAll('.tools-grid .tool-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      toolCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

});