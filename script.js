/* ============================================
   PANTHRA - Elite Cybersecurity
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initCursorGlow();
  initHeader();
  initMobileMenu();
  initHeroParticles();
  initCounterAnimation();
  initScrollAnimations();
  initContactForm();
  initNewsletterForm();
  initSmoothScroll();
});

/* ============================================
   Cursor Glow Effect
   ============================================ */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (!cursorGlow) return;

  // Skip the mouse-follow loop on touch/coarse-pointer devices and when the
  // user prefers reduced motion, it has no effect there and wastes cycles.
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) {
    cursorGlow.style.display = 'none';
    return;
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    // Smooth lerp for cursor following
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    
    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
  const header = document.getElementById('header');
  
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuBtn || !mobileMenu) return;

  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.mobile-dropdown.active').forEach((dropdown) => {
      dropdown.classList.remove('active');
    });
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) {
      document.querySelectorAll('.mobile-dropdown.active').forEach((dropdown) => {
        dropdown.classList.remove('active');
      });
    }
  });

  document.querySelectorAll('.mobile-dropdown-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = trigger.closest('.mobile-dropdown');
      const isOpen = dropdown.classList.contains('active');

      document.querySelectorAll('.mobile-dropdown.active').forEach((item) => {
        if (item !== dropdown) item.classList.remove('active');
      });

      dropdown.classList.toggle('active', !isOpen);
    });
  });

  document.querySelectorAll('.mobile-dropdown-item, .mobile-link:not(.mobile-dropdown-trigger), .mobile-cta').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close the menu (and release the body scroll lock) if the viewport grows
  // past the nav breakpoint while the menu is open.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Allow Escape to close the mobile menu.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ============================================
   Hero Particles
   ============================================ */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  
  if (!container) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random properties
  const size = Math.random() * 4 + 1;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(147, 51, 234, ${Math.random() * 0.5 + 0.2});
    border-radius: 50%;
    left: ${x}%;
    top: ${y}%;
    animation: floatParticle ${duration}s ease-in-out infinite;
    animation-delay: -${delay}s;
    pointer-events: none;
  `;
  
  container.appendChild(particle);
}

// Add particle animation keyframes
const particleStyles = document.createElement('style');
particleStyles.textContent = `
  @keyframes floatParticle {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    25% {
      transform: translate(20px, -30px) scale(1.2);
      opacity: 0.6;
    }
    50% {
      transform: translate(-10px, -60px) scale(0.8);
      opacity: 0.4;
    }
    75% {
      transform: translate(30px, -30px) scale(1.1);
      opacity: 0.5;
    }
  }
`;
document.head.appendChild(particleStyles);

/* ============================================
   Counter Animation
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-counter, .stat-number:not([data-static])');
  // Hero 99.9% fades in after 1.4s, wait so the count-up is visible
  const HERO_FADE_DELAY_MS = 1500;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const isHeroStat = el.classList.contains('stat-number');
        const delay = isHeroStat ? HERO_FADE_DELAY_MS : 0;
        setTimeout(() => animateCounter(el), delay);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const isDecimal = target % 1 !== 0;
  const isHeroStat = element.classList.contains('stat-number');
  // Hero 99.9% counts up quickly from a nearby start; other counters keep a fuller duration
  const duration = isHeroStat && isDecimal ? 700 : 2000;
  const startValue = isHeroStat && isDecimal ? 99.0 : 0;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = startValue + (target - startValue) * easeOutQuart;

    if (isDecimal) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
    }
  }

  // Show the start value immediately so it never flashes 0
  if (isDecimal && startValue > 0) {
    element.textContent = startValue.toFixed(1);
  }

  requestAnimationFrame(update);
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.service-card, .stat-card, .about-feature, .contact-item, .section-header, .about-content, .about-visual, .testimonial-card'
  );
  
  // Add initial state
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
  });
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Contact Form
   ============================================ */
const PANTHRA_CONTACT_EMAIL = 'contact@panthra.ca';
const PANTHRA_CONTACT_API = '/api/contact';
const PANTHRA_NEWSLETTER_API = '/api/newsletter';
const PANTHRA_FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${PANTHRA_CONTACT_EMAIL}`;

function loadTurnstileScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
}

async function getTurnstileSiteKey() {
  if (window.PANTHRA_TURNSTILE_SITE_KEY) {
    return window.PANTHRA_TURNSTILE_SITE_KEY;
  }

  try {
    const response = await fetch('/api/config');
    if (!response.ok) return '';
    const config = await response.json();
    return config.turnstileSiteKey || '';
  } catch (_) {
    return '';
  }
}

async function setupTurnstileWidget(containerId) {
  const siteKey = await getTurnstileSiteKey();
  const container = document.getElementById(containerId);
  if (!siteKey || !container) {
    return { enabled: false, widgetId: null };
  }

  try {
    await loadTurnstileScript();
    const widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: 'dark',
    });
    return { enabled: true, widgetId };
  } catch (error) {
    console.error('Turnstile failed to load:', error);
    return { enabled: false, widgetId: null };
  }
}

function getTurnstileToken(turnstileState) {
  if (!turnstileState.enabled || turnstileState.widgetId == null) {
    return '';
  }
  return window.turnstile.getResponse(turnstileState.widgetId) || '';
}

function resetTurnstileWidget(turnstileState) {
  if (turnstileState.enabled && turnstileState.widgetId != null) {
    window.turnstile.reset(turnstileState.widgetId);
  }
}

function buildContactPayload(form, turnstileToken = '') {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const services = formData.getAll('services[]').filter(Boolean);

  return {
    name,
    email,
    company: String(formData.get('company') || '').trim() || 'Not provided',
    message: String(formData.get('message') || '').trim() || 'No message provided.',
    services: services.length ? services.join(', ') : 'Not specified',
    _honey: String(formData.get('_honey') || '').trim(),
    turnstileToken,
  };
}

function buildFormSubmitPayload(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const services = formData.getAll('services[]').filter(Boolean);

  return {
    name,
    email,
    company: String(formData.get('company') || '').trim() || 'Not provided',
    message: String(formData.get('message') || '').trim() || 'No message provided.',
    services: services.length ? services.join(', ') : 'Not specified',
    _subject: `New inquiry from ${name} — PANTHRA website`,
    _template: 'table',
    _captcha: 'false',
  };
}

function isFormSubmitSuccess(result) {
  return result?.success === true || result?.success === 'true';
}

async function verifyContactSubmission(form, turnstileToken = '') {
  const endpoint = window.PANTHRA_CONTACT_ENDPOINT || PANTHRA_CONTACT_API;
  const payload = buildContactPayload(form, turnstileToken);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Security verification failed. Please try again.');
  }

  return result;
}

async function sendViaFormSubmit(form) {
  const endpoint = window.PANTHRA_FORM_SUBMIT_ENDPOINT || PANTHRA_FORM_SUBMIT_ENDPOINT;
  const payload = buildFormSubmitPayload(form);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok || !isFormSubmitSuccess(result)) {
    throw new Error(result?.message || 'Unable to send your message right now.');
  }

  return result;
}

async function submitContactForm(form, turnstileToken = '') {
  await verifyContactSubmission(form, turnstileToken);
  return sendViaFormSubmit(form);
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('closeModal');
  
  if (!form) return;

  form.setAttribute('action', PANTHRA_FORM_SUBMIT_ENDPOINT);
  form.setAttribute('method', 'POST');

  let turnstileState = { enabled: false, widgetId: null };

  setupTurnstileWidget('contactTurnstile').then((state) => {
    turnstileState = state;
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    let turnstileToken = getTurnstileToken(turnstileState);
    if (turnstileState.enabled && !turnstileToken) {
      alert('Please complete the security verification.');
      return;
    }
    
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <span>Sending...</span>
    `;
    submitBtn.disabled = true;
    
    const spinner = submitBtn.querySelector('.spinner');
    if (spinner) {
      spinner.style.animation = 'spin 1s linear infinite';
    }

    try {
      const result = await submitContactForm(form, turnstileToken);
      form.reset();

      resetTurnstileWidget(turnstileState);

      if (modal) {
        modal.classList.add('active');
      } else {
        alert(result?.message || 'Thank you, your message has been sent.');
      }
    } catch (error) {
      resetTurnstileWidget(turnstileState);

      alert(
        `${error.message || 'Unable to send your message right now.'} Please email ${PANTHRA_CONTACT_EMAIL} or call +1 587-816-0621.`
      );
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/* ============================================
   Newsletter Signup
   ============================================ */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const status = document.getElementById('newsletterStatus');
  const input = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let turnstileState = { enabled: false, widgetId: null };

  setupTurnstileWidget('newsletterTurnstile').then((state) => {
    turnstileState = state;
  });

  const setStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) status.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (input?.value || '').trim();
    if (!emailPattern.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      input?.focus();
      return;
    }

    const turnstileToken = getTurnstileToken(turnstileState);
    if (turnstileState.enabled && !turnstileToken) {
      setStatus('Please complete the security verification.', 'error');
      return;
    }

    const honey = String(new FormData(form).get('_honey') || '').trim();
    const verifyEndpoint = window.PANTHRA_NEWSLETTER_ENDPOINT || PANTHRA_NEWSLETTER_API;
    const formSubmitEndpoint = window.PANTHRA_FORM_SUBMIT_ENDPOINT || PANTHRA_FORM_SUBMIT_ENDPOINT;

    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Subscribing...</span>';
    }

    try {
      const verifyResponse = await fetch(verifyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, turnstileToken, _honey: honey }),
      });

      let verifyResult = null;
      try {
        verifyResult = await verifyResponse.json();
      } catch (_) {
        verifyResult = null;
      }

      if (!verifyResponse.ok || !verifyResult?.success) {
        throw new Error(verifyResult?.message || 'Security verification failed. Please try again.');
      }

      const sendResponse = await fetch(formSubmitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          _subject: 'Newsletter signup — PANTHRA website',
          _template: 'table',
          _captcha: 'false',
        }),
      });

      let sendResult = null;
      try {
        sendResult = await sendResponse.json();
      } catch (_) {
        sendResult = null;
      }

      if (!sendResponse.ok || !isFormSubmitSuccess(sendResult)) {
        throw new Error(sendResult?.message || 'Unable to subscribe right now.');
      }

      form.reset();
      resetTurnstileWidget(turnstileState);
      setStatus("You're subscribed. Watch your inbox for our next update.", 'success');
    } catch (error) {
      resetTurnstileWidget(turnstileState);
      setStatus(
        `${error.message || 'Something went wrong.'} Please email ${PANTHRA_CONTACT_EMAIL} to subscribe.`,
        'error'
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

// Add spinner animation
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyles);

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  const header = document.getElementById('header');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Placeholder links should not jump to the top of the page.
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        // Offset for the fixed header so the target isn't hidden beneath it.
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================
   Parallax Effects (subtle)
   ============================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Parallax for hero elements
  const heroGradient = document.querySelector('.hero-gradient');
  const pantherGlow = document.querySelector('.panther-glow');
  
  if (heroGradient) {
    heroGradient.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
  }
  
  if (pantherGlow) {
    pantherGlow.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
});

/* ============================================
   Typing Effect for Terminal (optional enhancement)
   ============================================ */
function initTerminalTyping() {
  const terminal = document.querySelector('.terminal-body');
  if (!terminal) return;
  
  const lines = terminal.querySelectorAll('.terminal-line');
  
  lines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, index * 200 + 500);
  });
}

// Initialize terminal animation when in view
const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initTerminalTyping();
      terminalObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const terminal = document.querySelector('.terminal');
if (terminal) {
  terminalObserver.observe(terminal);
}

/* ============================================
   Service Card Tilt Effect
   ============================================ */
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ============================================
   Intersection Observer for Section Tags
   ============================================ */
const sectionTags = document.querySelectorAll('.section-tag');

sectionTags.forEach(tag => {
  tag.style.opacity = '0';
  tag.style.transform = 'translateX(-20px)';
});

const tagObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      tagObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

sectionTags.forEach(tag => tagObserver.observe(tag));

/* ============================================
   Logo Hover Effect
   ============================================ */
const navLogo = document.querySelector('.nav-logo');

if (navLogo) {
  navLogo.addEventListener('mouseenter', () => {
    const logoIcon = navLogo.querySelector('.logo-icon');
    if (logoIcon) {
      logoIcon.style.transform = 'scale(1.1)';
      logoIcon.style.transition = 'transform 0.3s ease';
    }
  });
  
  navLogo.addEventListener('mouseleave', () => {
    const logoIcon = navLogo.querySelector('.logo-icon');
    if (logoIcon) {
      logoIcon.style.transform = 'scale(1)';
    }
  });
}

console.log('%c🐆 PANTHRA Security Systems Active', 'color: #9333ea; font-size: 16px; font-weight: bold;');
console.log('%cSilent Protection. Absolute Security.', 'color: #a1a1aa; font-size: 12px;');
