/**
 * ESSENZA Estética & Bem-Estar - Client JavaScript
 * Pure Vanilla JS handling layout interactions, Intro Preloader Curtain,
 * mobile drawer, scroll reveals, FAQ accordion, and dynamic WhatsApp action links.
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroPreloader();
  initHeaderScroll();
  initMobileMenu();
  initFaqAccordion();
  initScrollReveal();
  initActiveNavHighlight();
});

/**
 * Opening Preloader Curtain Animation (0% to 100% Counter)
 */
function initIntroPreloader() {
  const preloader = document.getElementById('introPreloader');
  const counterEl = document.getElementById('preloaderCounter');
  const fillEl = document.getElementById('preloaderFill');

  if (!preloader || !counterEl || !fillEl) return;

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    preloader.classList.add('loaded');
    document.body.style.overflow = '';
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  // Lock scroll during intro animation
  document.body.style.overflow = 'hidden';

  let currentCount = 0;
  const targetCount = 100;
  const duration = 1200; // 1.2s total count duration
  const intervalTime = 15;
  const step = targetCount / (duration / intervalTime);

  const timer = setInterval(() => {
    currentCount += step;
    if (currentCount >= targetCount) {
      currentCount = targetCount;
      clearInterval(timer);
      
      counterEl.textContent = '100%';
      fillEl.style.width = '100%';

      // Delay slightly at 100% before lifting curtain
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        
        // Trigger reveal animations on initial viewport elements
        setTimeout(() => {
          document.querySelectorAll('.hero-lookbook-section .reveal').forEach(el => {
            el.classList.add('revealed');
          });
        }, 300);
      }, 250);
    } else {
      const rounded = Math.floor(currentCount);
      counterEl.textContent = `${rounded}%`;
      fillEl.style.width = `${rounded}%`;
    }
  }, intervalTime);
}

/**
 * Header shrink effect on window scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile drawer menu toggle & overlay management
 */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer a');

  if (!hamburgerBtn || !mobileDrawer || !mobileNavOverlay) return;

  const toggleMenu = () => {
    const isOpen = mobileDrawer.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', toggleMenu);
  mobileNavOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * FAQ Accordion expand & collapse
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-accordion-header');
    const answerEl = item.querySelector('.faq-accordion-content');

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-accordion-content');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          const otherBtn = otherItem.querySelector('.faq-accordion-header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answerEl.style.maxHeight = null;
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Intersection Observer for smooth element entrance animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Highlight header navigation link based on current section in viewport
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const onScroll = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
