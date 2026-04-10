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
  if (!toggle || !mobileNav) return () => {};

  const onToggle = () => {
    const open = mobileNav.getAttribute("data-open") === "true";
    mobileNav.setAttribute("data-open", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
  };

  toggle.addEventListener("click", onToggle);
  return () => toggle.removeEventListener("click", onToggle);
}

function initQuantitySteppers() {
  const removers = [];
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

    const onDec = () => set(Number(input.value || min) - 1);
    const onInc = () => set(Number(input.value || min) + 1);
    dec.addEventListener("click", onDec);
    inc.addEventListener("click", onInc);
    removers.push(() => {
      dec.removeEventListener("click", onDec);
      inc.removeEventListener("click", onInc);
    });
  });
  return () => removers.forEach((remove) => remove());
}

function initProductsDropdown() {
  const dropdown = qs("[data-products-dropdown]");
  if (!dropdown) return () => {};

  const trigger = qs("[data-products-trigger]", dropdown);
  const menu = qs("[data-products-menu]", dropdown);
  if (!trigger || !menu) return () => {};

  const close = () => {
    dropdown.setAttribute("data-open", "false");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    dropdown.setAttribute("data-open", "true");
    trigger.setAttribute("aria-expanded", "true");
  };

  const onTriggerClick = (e) => {
    e.preventDefault();
    const isOpen = dropdown.getAttribute("data-open") === "true";
    if (isOpen) close();
    else open();
  };

  const onDocumentClick = (e) => {
    if (!dropdown.contains(e.target)) close();
  };

  const onEscape = (e) => {
    if (e.key === "Escape") close();
  };

  trigger.addEventListener("click", onTriggerClick);
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onEscape);

  return () => {
    trigger.removeEventListener("click", onTriggerClick);
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onEscape);
  };
}

function initProductGallery() {
  const gallery = qs("[data-product-gallery]");
  if (!gallery) return () => {};

  const mainImage = qs("[data-gallery-main]", gallery);
  const thumbs = qsa("[data-gallery-thumb]", gallery);
  if (!mainImage || thumbs.length === 0) return () => {};

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

  const removers = thumbs.map((thumb) => {
    const onClick = () => updateMainImage(thumb);
    thumb.addEventListener("click", onClick);
    return () => thumb.removeEventListener("click", onClick);
  });

  return () => removers.forEach((remove) => remove());
}

export function initAtelierUi() {
  const cleanups = [
    initMobileNav(),
    initQuantitySteppers(),
    initProductsDropdown(),
    initProductGallery(),
  ];

  return () => cleanups.forEach((cleanup) => cleanup());
}

