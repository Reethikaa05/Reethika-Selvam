/**
 * tisso-site.js
 * =============================================================
 * Global interactivity for Tisso Vison store
 *   1. FAQ accordion
 *   2. Scroll-reveal animations
 *   3. Mini cart count updater
 *   4. Newsletter form feedback
 * Vanilla JS only — no jQuery
 * =============================================================
 */

(function () {
  'use strict';

  /* ===================================================================
     1. FAQ ACCORDION
     =================================================================== */

  /**
   * Initialise all .tv-faq-item elements with accessible toggle behaviour.
   * Uses CSS grid-template-rows trick for smooth height animation.
   */
  function initFAQ() {
    document.querySelectorAll('.tv-faq-item__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item   = btn.closest('.tv-faq-item');
        const answer = item.querySelector('.tv-faq-item__answer');
        const isOpen = item.classList.contains('is-open');

        // Close all other items (accordion behaviour)
        document.querySelectorAll('.tv-faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.tv-faq-item__btn').setAttribute('aria-expanded', 'false');
            openItem.querySelector('.tv-faq-item__answer').setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current item
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        answer.setAttribute('aria-hidden', String(isOpen));
      });
    });
  }

  /* ===================================================================
     2. SCROLL REVEAL
     Adds .is-visible to elements with [data-reveal] when they enter viewport
     =================================================================== */

  /**
   * Set up IntersectionObserver for scroll-triggered reveal animations.
   * Elements with [data-reveal] get class .is-visible when in view.
   */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===================================================================
     3. MINI CART COUNT — update header cart bubble after ATC
     =================================================================== */

  /**
   * Fetch current cart and update any cart-count elements in the header.
   * Called after any successful add-to-cart action.
   */
  async function updateCartCount() {
    try {
      const res  = await fetch('/cart.js');
      const cart = await res.json();
      const count = cart.item_count;

      document.querySelectorAll('[data-cart-count], .cart-count, .cart-icon-bubble').forEach(function (el) {
        el.textContent = count;
        el.setAttribute('aria-label', count + ' items in cart');

        // Show/hide badge
        if (count > 0) {
          el.removeAttribute('hidden');
          el.style.display = '';
        }
      });
    } catch (err) {
      // Silently fail — cart count is non-critical
      console.warn('[tisso-site] Cart count update failed:', err);
    }
  }

  /* ===================================================================
     4. NEWSLETTER FORM — inline feedback without page reload
     =================================================================== */

  /**
   * Enhance newsletter forms with inline success/error feedback.
   */
  function initNewsletterForms() {
    document.querySelectorAll('#tv-newsletter-form').forEach(function (form) {
      // Shopify's form submission already reloads; we just ensure it looks good
      // If the URL contains ?customer_posted=true after submit, show success
      if (window.location.search.includes('customer_posted=true')) {
        const msg = document.createElement('p');
        msg.textContent = '✓ You\'re subscribed! Check your email for your 10% discount code.';
        msg.style.cssText = 'color: var(--tv-yellow); font-size: 0.875rem; margin-top: 12px; text-align: center;';
        form.after(msg);
      }
    });
  }

  /* ===================================================================
     5. SMOOTH ACTIVE NAV LINK
     =================================================================== */

  /**
   * Add 'is-active' class to nav links matching the current URL path.
   */
  function initActiveNav() {
    var path = window.location.pathname;
    document.querySelectorAll('.header__menu a, nav a').forEach(function (link) {
      try {
        var linkPath = new URL(link.href).pathname;
        if (linkPath === path || (path !== '/' && path.startsWith(linkPath) && linkPath !== '/')) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      } catch (_) {}
    });
  }

  /* ===================================================================
     CUSTOM EVENTS — listen for ATC from custom-page.js popup
     =================================================================== */

  document.addEventListener('tisso:cart-updated', function () {
    updateCartCount();
  });

  /* ===================================================================
     BOOT
     =================================================================== */
  function init() {
    initFAQ();
    initScrollReveal();
    initNewsletterForms();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
