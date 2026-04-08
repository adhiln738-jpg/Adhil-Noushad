/* ============================================================
   main.js — Adhil Noushad Portfolio
   Global JS: Navbar, Scroll Reveal, Mobile Nav, Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // 1. NAVBAR — scroll behaviour + active link
  // ─────────────────────────────────────────
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar-links a');

  // Sticky class on scroll
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Highlight active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  // ─────────────────────────────────────────
  // 2. MOBILE NAV
  // ─────────────────────────────────────────
  const navToggle  = document.getElementById('navToggle');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (navToggle && mobileNav) {
    // Inject mobile nav styles once
    if (!document.getElementById('mobileNavStyle')) {
      const style = document.createElement('style');
      style.id = 'mobileNavStyle';
      style.textContent = `
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,10,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(.4,0,.2,1);
        }
        .mobile-nav-overlay.open {
          transform: translateX(0);
        }
        .mobile-nav-overlay .navbar-links {
          display: flex !important;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          font-size: 1.3rem;
        }
        .mobile-nav-overlay .navbar-links a {
          color: rgba(255,255,255,0.75);
          font-weight: 600;
          transition: color 0.2s;
        }
        .mobile-nav-overlay .navbar-links a:hover {
          color: var(--gold);
        }
        .mobile-close {
          position: absolute;
          top: 24px;
          right: 28px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 1.6rem;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1;
        }
        .mobile-close:hover { color: var(--gold); }
        /* Hamburger → X animation */
        .nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .nav-toggle span { transition: transform 0.3s ease, opacity 0.3s ease; }
      `;
      document.head.appendChild(style);
    }

    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileNav);
    }

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  }


  // ─────────────────────────────────────────
  // 3. SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }


  // ─────────────────────────────────────────
  // 4. ANIMATED COUNTER (stats numbers)
  // ─────────────────────────────────────────
  function animateCounter(el, target, prefix, suffix, duration) {
    let start = 0;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Data attributes: data-count, data-prefix, data-suffix, data-duration
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = parseFloat(el.dataset.count);
          const prefix   = el.dataset.prefix  || '';
          const suffix   = el.dataset.suffix  || '';
          const duration = parseInt(el.dataset.duration) || 1800;
          animateCounter(el, target, prefix, suffix, duration);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }


  // ─────────────────────────────────────────
  // 5. SMOOTH SCROLL for anchor links
  // ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ─────────────────────────────────────────
  // 6. HERO PARALLAX (subtle, performance-safe)
  // ─────────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  const heroGrid = document.querySelector('.hero-grid');

  if (heroBg && heroGrid) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          heroBg.style.transform   = `translateY(${y * 0.25}px)`;
          heroGrid.style.transform = `translateY(${y * 0.15}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  // ─────────────────────────────────────────
  // 7. TYPING EFFECT on hero (optional cycle)
  // ─────────────────────────────────────────
  const typingTarget = document.querySelector('.hero-typing');
  if (typingTarget) {
    const phrases = [
      'Shopify Stores',
      'Meta Ad Campaigns',
      'Dropshipping Brands',
      'E-commerce Empires',
    ];
    let phraseIdx  = 0;
    let charIdx    = 0;
    let isDeleting = false;
    let delay      = 120;

    function type() {
      const phrase = phrases[phraseIdx];
      if (isDeleting) {
        typingTarget.textContent = phrase.slice(0, charIdx - 1);
        charIdx--;
        delay = 60;
      } else {
        typingTarget.textContent = phrase.slice(0, charIdx + 1);
        charIdx++;
        delay = 110;
      }

      if (!isDeleting && charIdx === phrase.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }
    type();
  }


  // ─────────────────────────────────────────
  // 8. CARD TILT EFFECT (subtle 3D on hover)
  // ─────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.service-card, .pricing-card, .portfolio-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ─────────────────────────────────────────
  // 9. STAT PILL STAGGER (hero)
  // ─────────────────────────────────────────
  const statPills = document.querySelectorAll('.stat-pill');
  statPills.forEach((pill, i) => {
    pill.style.animationDelay = `${0.5 + i * 0.12}s`;
  });


  // ─────────────────────────────────────────
  // 10. PAGE TRANSITION (fade-in on load)
  // ─────────────────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });


  // ─────────────────────────────────────────
  // 11. TOOLTIP on trust badges (hover label)
  // ─────────────────────────────────────────
  document.querySelectorAll('.trust-item').forEach(item => {
    item.style.cursor = 'default';
  });


  // ─────────────────────────────────────────
  // 12. WHATSAPP FLOAT — hide on footer overlap
  // ─────────────────────────────────────────
  const waFloat = document.querySelector('.whatsapp-float');
  const footer  = document.querySelector('footer');

  if (waFloat && footer) {
    const waObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Slightly pop back up when footer enters
        waFloat.style.opacity = entry.isIntersecting ? '0.4' : '1';
        waFloat.style.transform = entry.isIntersecting
          ? 'scale(0.85) translateY(-8px)'
          : '';
      });
    }, { threshold: 0 });

    waObserver.observe(footer);
  }


  // ─────────────────────────────────────────
  // 13. ACTIVE NAV LINK based on scroll section
  // ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('section-active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('section-active');
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }


  // ─────────────────────────────────────────
  // 14. GOLD CURSOR TRAIL (subtle premium touch)
  // ─────────────────────────────────────────
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(201,168,76,0.6);
    transform: translate(-50%,-50%);
    transition: left 0.12s ease, top 0.12s ease, opacity 0.3s;
    z-index: 9999;
    opacity: 0;
  `;
  document.body.appendChild(trail);

  let trailVisible = false;
  document.addEventListener('mousemove', (e) => {
    trail.style.left    = e.clientX + 'px';
    trail.style.top     = e.clientY + 'px';
    trail.style.opacity = '0.65';
    if (!trailVisible) {
      trailVisible = true;
    }
    clearTimeout(trail._timer);
    trail._timer = setTimeout(() => {
      trail.style.opacity = '0';
    }, 900);
  });


  // ─────────────────────────────────────────
  // 15. LOG INIT
  // ─────────────────────────────────────────
  console.log(
    '%cAdhil Noushad Portfolio%c — Built with ❤️ and precision.',
    'color:#c9a84c;font-size:1.1rem;font-weight:700;',
    'color:#888;font-size:0.9rem;'
  );

}); // end DOMContentLoaded
