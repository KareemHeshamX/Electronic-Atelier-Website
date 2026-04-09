/*
  THE DIGITAL ATELIER — minimal frontend behavior

  The `@stitch` designs are primarily visual. This file adds only light behavior:
  - mobile nav toggle
  - demo quantity stepper (for product + checkout)

  No frameworks, no build step, no API calls — easy to read and extend.
*/

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function initMobileNav() {
  const toggle = qs("[data-nav-toggle]");
  const mobileNav = qs("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const open = mobileNav.getAttribute("data-open") === "true";
    mobileNav.setAttribute("data-open", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
  });
}

function initQuantitySteppers() {
  qsa("[data-qty]").forEach((wrapper) => {
    const input = qs("input", wrapper);
    const dec = qs("[data-qty-dec]", wrapper);
    const inc = qs("[data-qty-inc]", wrapper);
    if (!input || !dec || !inc) return;

    const min = Number(input.min || 1);
    const max = Number(input.max || 99);

    const clamp = (n) => Math.max(min, Math.min(max, n));
    const set = (n) => {
      input.value = String(clamp(n));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    dec.addEventListener("click", () => set(Number(input.value || min) - 1));
    inc.addEventListener("click", () => set(Number(input.value || min) + 1));
  });
}

function initProductsDropdown() {
  const dropdown = qs("[data-products-dropdown]");
  if (!dropdown) return;

  const trigger = qs("[data-products-trigger]", dropdown);
  const menu = qs("[data-products-menu]", dropdown);
  if (!trigger || !menu) return;

  const close = () => {
    dropdown.setAttribute("data-open", "false");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    dropdown.setAttribute("data-open", "true");
    trigger.setAttribute("aria-expanded", "true");
  };

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = dropdown.getAttribute("data-open") === "true";
    if (isOpen) close();
    else open();
  });

  // Close when clicking outside the dropdown
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initProductGallery() {
  const gallery = qs("[data-product-gallery]");
  if (!gallery) return;

  const mainImage = qs("[data-gallery-main]", gallery);
  const thumbs = qsa("[data-gallery-thumb]", gallery);
  if (!mainImage || thumbs.length === 0) return;

  const setActiveThumb = (nextThumb) => {
    thumbs.forEach((thumb) => {
      const isActive = thumb === nextThumb;
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const updateMainImage = (thumb) => {
    const nextSrc = thumb.getAttribute("data-image");
    const nextAlt = thumb.getAttribute("data-alt");
    if (!nextSrc) return;

    // Tiny fade for a smoother transition between gallery images.
    mainImage.style.opacity = "0.4";
    window.setTimeout(() => {
      mainImage.src = nextSrc;
      if (nextAlt) mainImage.alt = nextAlt;
      mainImage.style.opacity = "1";
    }, 120);

    setActiveThumb(thumb);
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => updateMainImage(thumb));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initQuantitySteppers();
  initProductsDropdown();
  initProductGallery();
});

