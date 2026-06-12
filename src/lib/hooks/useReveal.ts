import { useEffect } from 'react';

/**
 * useReveal
 * Reveals elements matching the selector by toggling the 'is-visible' class
 * and applying optional data-delay / data-duration CSS timings.
 * Also observes DOM mutations to register elements added later (e.g., after state changes).
 */
export function useReveal(selector: string = '.reveal-on-scroll') {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target); // reveal once
          }
        }
      },
      { threshold: 0.12 }
    );

    const register = (el: HTMLElement) => {
      if (!el || !(el instanceof HTMLElement)) return;
      if (!el.matches(selector)) return;
      el.classList.add('reveal-on-scroll');
      el.style.willChange = 'opacity, transform';
      if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay;
      if (el.dataset.duration) el.style.transitionDuration = el.dataset.duration;
      io.observe(el);
    };

    // Register existing
    document.querySelectorAll<HTMLElement>(selector).forEach(register);

    // Watch for future elements
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(selector)) register(node);
            node.querySelectorAll?.(selector).forEach((el) => register(el as HTMLElement));
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [selector]);
}