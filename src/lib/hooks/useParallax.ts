import { useEffect } from 'react';

/**
 * useParallax
 * Applies translateY parallax to elements with the provided selector based on data-speed.
 * Also toggles a reveal-on-scroll class for subtle fade-in when entering viewport.
 */
export function useParallax(selector: string = '.parallax-item') {
  useEffect(() => {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
    const speeds = new Map<HTMLElement, number>();
    elements.forEach((el) => {
      const sp = Number(el.dataset.speed || '0.5');
      speeds.set(el, isNaN(sp) ? 0.5 : sp);
      el.classList.add('reveal-on-scroll');
    });

    // Reveal on scroll observer
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        }
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => io.observe(el));

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return; // throttle to one per frame
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        elements.forEach((el) => {
          const speed = speeds.get(el) ?? 0.5;
          const translate = Math.round(scrollY * (1 - speed)); // slower than scroll
          el.style.transform = `translate3d(0, ${translate}px, 0)`;
        });
        rafId = 0;
      });
    };

    // Init position
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, [selector]);
}