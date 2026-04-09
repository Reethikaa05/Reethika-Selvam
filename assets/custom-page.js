/**
 * custom-page.js
 * =============================================================
 * Handles all interactivity for the Custom Banner + Grid page:
 *   1. Product card / dot click  → open popup
 *   2. Fetch product JSON        → render title, price, desc, variants
 *   3. Variant selection         → colour pills + size dropdown
 *   4. Add to Cart               → Shopify AJAX cart API
 *   5. Upsell rule               → if variant has BOTH "Black" AND
 *      "Medium" selected, auto-add "soft-winter-jacket" to cart
 *
 * Rules enforced:
 *   - Vanilla JS only (no jQuery)
 *   - All functions documented with JSDoc
 *   - Single IIFE to avoid polluting global scope
 * =============================================================
 */

(function () {
  'use strict';

  /* ===================================================================
     CONFIG
     =================================================================== */

  /**
   * Shopify handle of the product to automatically upsell when a
   * shopper adds ANY product with BOTH "Black" AND "Medium" selected.
   * @type {string}
   */
  const UPSELL_HANDLE = 'soft-winter-jacket';

  /**
   * Option names treated as "colour" — rendered as pill buttons.
   * All other options fall back to a <select> dropdown.
   * @type {string[]}
   */
  const COLOR_OPTIONS = ['color', 'colour'];

  /* ===================================================================
     STATE
     =================================================================== */

  /** @type {Object|null} Currently loaded product JSON */
  let product = null;

  /** @type {number|null} Currently selected variant id */
  let selectedVariantId = null;

  /**
   * Map of option name → chosen value
   * e.g. { Color: 'Black', Size: 'Medium' }
   * @type {Object.<string, string>}
   */
  let selectedOptions = {};

  /* ===================================================================
     DOM ELEMENTS
     =================================================================== */

  const modal     = document.getElementById('cp-modal');
  const backdrop  = document.getElementById('cp-backdrop');
  const closeBtn  = document.getElementById('cp-close');
  const imgEl     = document.getElementById('cp-img');
  const titleEl   = document.getElementById('cp-title');
  const priceEl   = document.getElementById('cp-price');
  const descEl    = document.getElementById('cp-desc');
  const variantsEl = document.getElementById('cp-variants');
  const atcBtn    = document.getElementById('cp-atc');
  const msgEl     = document.getElementById('cp-msg');

  /* ===================================================================
     GRID — INITIALISE CARD LISTENERS
     =================================================================== */

  /**
   * Attach click and keyboard (Enter / Space) listeners to every
   * product card and its dot button in the grid.
   */
  function initGrid() {
    document.querySelectorAll('.cg__card').forEach(function (card) {
      const handle = card.dataset.productHandle;
      if (!handle) return;

      // Whole card click
      card.addEventListener('click', function () { openPopup(handle); });

      // Keyboard navigation
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPopup(handle);
        }
      });
    });
  }

  /* ===================================================================
     POPUP — OPEN / CLOSE
     =================================================================== */

  /**
   * Open the popup for a given product handle.
   * Shows a loading state while the product JSON is fetched.
   * @param {string} handle - Shopify product handle
   */
  async function openPopup(handle) {
    resetModal();
    showModal();

    try {
      product = await fetchProduct(handle);
      renderModal(product);
    } catch (err) {
      console.error('[custom-page] Failed to load product', err);
      titleEl.textContent = 'Product unavailable.';
    }
  }

  /** Make the modal visible and prevent body scroll. */
  function showModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  /** Hide the modal and restore body scroll. */
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    product          = null;
    selectedVariantId = null;
    selectedOptions  = {};
  }

  /** Clear all dynamic content before loading a new product. */
  function resetModal() {
    titleEl.textContent   = 'Loading…';
    priceEl.textContent   = '';
    descEl.innerHTML      = '';
    variantsEl.innerHTML  = '';
    imgEl.src             = '';
    imgEl.alt             = '';
    atcBtn.disabled       = false;
    setMsg('', '');
  }

  /* ── close triggers ── */
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  /* ===================================================================
     FETCH PRODUCT JSON
     =================================================================== */

  /**
   * Fetch a Shopify product by handle using the storefront JSON endpoint.
   * @param {string} handle
   * @returns {Promise<Object>} Shopify product object
   */
  async function fetchProduct(handle) {
    const res = await fetch('/products/' + handle + '.js');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  /* ===================================================================
     RENDER MODAL CONTENT
     =================================================================== */

  /**
   * Populate every element in the modal with data from the product object.
   * @param {Object} p - Shopify product JSON
   */
  function renderModal(p) {
    // Image — use first variant image or product featured image
    const firstVar = p.variants[0];
    const imgSrc   = (firstVar && firstVar.featured_image)
      ? firstVar.featured_image.src
      : p.featured_image;

    if (imgSrc) {
      imgEl.src = imgSrc;
      imgEl.alt = p.title;
    }

    // Basic info
    titleEl.textContent = p.title;
    priceEl.textContent = formatMoney(p.price);
    descEl.innerHTML    = sanitise(p.description);

    // Variants
    buildVariants(p);
  }

  /* ===================================================================
     VARIANT BUILDER
     =================================================================== */

  /**
   * Build variant UI for the modal.
   * - Colour options → pill buttons
   * - Other options  → <select> dropdown
   * Auto-selects the first available variant.
   * @param {Object} p - Shopify product JSON
   */
  function buildVariants(p) {
    variantsEl.innerHTML = '';

    // Single "Default Title" variant — nothing to render
    if (p.options.length === 1 && p.options[0] === 'Default Title') {
      selectedVariantId = p.variants[0].id;
      updatePrice(p.variants[0].price);
      return;
    }

    // Pre-select first available variant
    const firstAvailable = p.variants.find(function (v) { return v.available; })
      || p.variants[0];

    p.options.forEach(function (optName, idx) {
      selectedOptions[optName] = firstAvailable['option' + (idx + 1)];
    });

    selectedVariantId = firstAvailable.id;
    updatePrice(firstAvailable.price);

    // Render each option group
    p.options.forEach(function (optName, optIdx) {
      const isColor = COLOR_OPTIONS.includes(optName.toLowerCase());
      const values  = uniqueValues(p.variants, optIdx);
      const group   = buildOptionGroup(p, optName, optIdx, values, isColor);
      variantsEl.appendChild(group);
    });
  }

  /**
   * Build one option group element (label + controls).
   * @param {Object}  p       - product
   * @param {string}  optName - e.g. "Color"
   * @param {number}  optIdx  - 0-based index
   * @param {string[]} values - unique option values
   * @param {boolean} isColor - render as pills (true) or select (false)
   * @returns {HTMLElement}
   */
  function buildOptionGroup(p, optName, optIdx, values, isColor) {
    const group = document.createElement('div');
    group.className = 'cpv-group';

    const label = document.createElement('p');
    label.className = 'cpv-label';
    label.textContent = optName;
    group.appendChild(label);

    if (isColor) {
      group.appendChild(buildPills(p, optName, optIdx, values));
    } else {
      group.appendChild(buildSelect(p, optName, optIdx, values));
    }

    return group;
  }

  /**
   * Render colour pill buttons for a given option.
   * @param {Object}  p
   * @param {string}  optName
   * @param {number}  optIdx
   * @param {string[]} values
   * @returns {HTMLElement}
   */
  function buildPills(p, optName, optIdx, values) {
    const wrap = document.createElement('div');
    wrap.className = 'cpv-pills';

    values.forEach(function (val) {
      const btn = document.createElement('button');
      btn.type        = 'button';
      btn.className   = 'cpv-pill';
      btn.textContent = val;
      btn.dataset.optName  = optName;
      btn.dataset.optValue = val;

      if (selectedOptions[optName] === val) btn.classList.add('is-selected');

      const available = isValueAvailable(p, optName, optIdx, val);
      btn.disabled = !available;

      btn.addEventListener('click', function () {
        onOptionChange(p, optName, val);
      });

      wrap.appendChild(btn);
    });

    return wrap;
  }

  /**
   * Render a <select> dropdown for a given option (e.g. Size).
   * @param {Object}  p
   * @param {string}  optName
   * @param {number}  optIdx
   * @param {string[]} values
   * @returns {HTMLElement}
   */
  function buildSelect(p, optName, optIdx, values) {
    const wrap = document.createElement('div');
    wrap.className = 'cpv-select-wrap';

    const sel = document.createElement('select');
    sel.className        = 'cpv-select';
    sel.dataset.optName  = optName;
    sel.dataset.optIdx   = optIdx;
    sel.setAttribute('aria-label', optName);

    // Placeholder option
    const placeholder = document.createElement('option');
    placeholder.value    = '';
    placeholder.disabled = true;
    placeholder.textContent = 'Choose your ' + optName.toLowerCase();
    if (!selectedOptions[optName]) placeholder.selected = true;
    sel.appendChild(placeholder);

    values.forEach(function (val) {
      const opt = document.createElement('option');
      opt.value       = val;
      opt.textContent = val;
      if (selectedOptions[optName] === val) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', function () {
      onOptionChange(p, optName, sel.value);
    });

    wrap.appendChild(sel);
    return wrap;
  }

  /* ===================================================================
     VARIANT SELECTION LOGIC
     =================================================================== */

  /**
   * Handle a user selecting a new option value.
   * Updates selectedOptions, highlights UI, finds new variant.
   * @param {Object} p
   * @param {string} optName
   * @param {string} optVal
   */
  function onOptionChange(p, optName, optVal) {
    selectedOptions[optName] = optVal;

    // Update pill highlights
    variantsEl.querySelectorAll('.cpv-pill').forEach(function (btn) {
      if (btn.dataset.optName === optName) {
        btn.classList.toggle('is-selected', btn.dataset.optValue === optVal);
      }
    });

    // Find matching variant
    const matched = matchVariant(p, selectedOptions);
    if (matched) {
      selectedVariantId = matched.id;
      updatePrice(matched.price);
      atcBtn.disabled = !matched.available;

      // Swap image if this variant has its own photo
      if (matched.featured_image && matched.featured_image.src) {
        imgEl.src = matched.featured_image.src;
        imgEl.alt = matched.featured_image.alt || p.title;
      }
    } else {
      selectedVariantId = null;
      atcBtn.disabled   = true;
    }
  }

  /**
   * Find a variant that matches all currently selected options.
   * @param {Object} p
   * @param {Object.<string,string>} opts
   * @returns {Object|undefined}
   */
  function matchVariant(p, opts) {
    return p.variants.find(function (v) {
      return p.options.every(function (name, i) {
        return v['option' + (i + 1)] === opts[name];
      });
    });
  }

  /**
   * Check whether a value is purchasable given current other selections.
   * @param {Object} p
   * @param {string} optName
   * @param {number} optIdx
   * @param {string} val
   * @returns {boolean}
   */
  function isValueAvailable(p, optName, optIdx, val) {
    return p.variants.some(function (v) {
      if (!v.available) return false;
      // Test this value combined with current selections for other options
      return p.options.every(function (name, i) {
        if (name === optName) return v['option' + (i + 1)] === val;
        return !selectedOptions[name] || v['option' + (i + 1)] === selectedOptions[name];
      });
    });
  }

  /**
   * Extract unique option values for a given option index from variants.
   * @param {Object[]} variants
   * @param {number}   optIdx  - 0-based
   * @returns {string[]}
   */
  function uniqueValues(variants, optIdx) {
    const seen = [];
    variants.forEach(function (v) {
      const val = v['option' + (optIdx + 1)];
      if (!seen.includes(val)) seen.push(val);
    });
    return seen;
  }

  /* ===================================================================
     PRICE UPDATE
     =================================================================== */

  /**
   * Update the displayed price string.
   * @param {number} cents - price in Shopify's integer cents format
   */
  function updatePrice(cents) {
    priceEl.textContent = formatMoney(cents);
  }

  /* ===================================================================
     ADD TO CART
     =================================================================== */

  atcBtn.addEventListener('click', function () {
    if (!selectedVariantId) {
      setMsg('Please select all options.', 'error');
      return;
    }
    handleAddToCart(selectedVariantId);
  });

  /**
   * Add a variant to the cart, with optional upsell logic:
   * If selected options include BOTH "Black" AND "Medium",
   * also silently add the first available variant of UPSELL_HANDLE.
   * @param {number} variantId - the selected variant to add
   */
  async function handleAddToCart(variantId) {
    atcBtn.disabled = true;
    setMsg('', '');

    try {
      const items = [{ id: variantId, quantity: 1 }];

      // ── UPSELL CHECK ────────────────────────────────────────────
      // Convert all selected option values to lowercase for comparison
      const vals    = Object.values(selectedOptions).map(function (v) {
        return v.toLowerCase();
      });
      const hasBlack  = vals.includes('black');
      const hasMedium = vals.includes('medium');

      if (hasBlack && hasMedium) {
        const upsellId = await resolveUpsellVariant(UPSELL_HANDLE);
        if (upsellId) items.push({ id: upsellId, quantity: 1 });
      }
      // ────────────────────────────────────────────────────────────

      // POST to Shopify cart
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(function () { return {}; });
        throw new Error(errData.description || 'Could not add to cart.');
      }

      setMsg('Added to cart!', 'success');
      document.dispatchEvent(new CustomEvent('tisso:cart-updated'));

      // Re-enable after 2.5 s
      setTimeout(function () {
        atcBtn.disabled = false;
        setMsg('', '');
      }, 2500);

    } catch (err) {
      console.error('[custom-page] Add to cart error:', err);
      setMsg(err.message || 'Something went wrong.', 'error');
      atcBtn.disabled = false;
    }
  }

  /**
   * Resolve the first available variant id of the upsell product.
   * Returns null if the product can't be found or has no available variant.
   * @param {string} handle
   * @returns {Promise<number|null>}
   */
  async function resolveUpsellVariant(handle) {
    try {
      const p = await fetchProduct(handle);
      const v = p.variants.find(function (v) { return v.available; });
      return v ? v.id : null;
    } catch (err) {
      console.warn('[custom-page] Upsell product not found:', handle);
      return null;
    }
  }

  /* ===================================================================
     UTILITIES
     =================================================================== */

  /**
   * Format a Shopify price (integer cents) to a localised currency string.
   * Uses the store's active currency when available via window.Shopify.
   * @param {number} cents
   * @returns {string}
   */
  function formatMoney(cents) {
    if (cents == null) return '';
    const amount   = cents / 100;
    const currency = (window.Shopify && window.Shopify.currency)
      ? window.Shopify.currency.active
      : 'USD';
    try {
      return new Intl.NumberFormat(
        document.documentElement.lang || 'en',
        { style: 'currency', currency: currency }
      ).format(amount);
    } catch (_) {
      return '$' + amount.toFixed(2);
    }
  }

  /**
   * Very basic HTML sanitiser — strips <script> and <iframe> tags
   * from product descriptions fetched from the API.
   * @param {string} html
   * @returns {string}
   */
  function sanitise(html) {
    if (!html) return '';
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  }

  /**
   * Set the ATC feedback message.
   * @param {string} text
   * @param {'success'|'error'|''} type
   */
  function setMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className   = 'cp__msg' + (type ? ' cp__msg--' + type : '');
  }

  /* ===================================================================
     BOOT
     =================================================================== */

  /** Initialise everything once the DOM is ready. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrid);
  } else {
    initGrid();
  }

})();
