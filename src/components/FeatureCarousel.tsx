import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const forestHeroBgUrl = 'https://raw.githubusercontent.com/varunsingh3545/search-engine/refs/heads/main/forest.jpg';

const features = [
  { title: 'Nature AI', slug: 'nature', desc: 'Immersive nature intelligence for curious minds.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/31201.jpg' },
  { title: 'Wildlife AI', slug: 'wildlife', desc: 'Track biodiversity and animal habitats.', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=2000&auto=format&fit=crop' },
  { title: 'Climate AI', slug: 'climate', desc: 'Climate trends and renewable energy insights.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/climate.jpg' },
  { title: 'Marine AI', slug: 'marine', desc: 'Protect oceans and marine ecosystems.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/marine.jpg' },
  { title: 'Forest AI', slug: 'forest', desc: 'Monitor deforestation and forest health.', img: forestHeroBgUrl },
  { title: 'Research AI', slug: 'research', desc: 'Discover papers, datasets, and findings.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/representation-user-experience-interface-design.jpg' },
  { title: 'Career AI', slug: 'career', desc: 'Explore roles, skills, and opportunities.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/business-concept-with-graphic-holography.jpg' },
  { title: 'Education AI', slug: 'education', desc: 'Learn with curated courses and tutorials.', img: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/photography%20of%20shelves%20of%20books.jpg' },
];

const EASE: any = [0.2, 0.9, 0.3, 1];

const titleToIndex = (title?: string) => {
  if (!title) return 0;
  const i = features.findIndex((f) => f.title.toLowerCase() === title.toLowerCase());
  return i >= 0 ? i : 0;
};

const FeatureCarousel: React.FC<{ initialTitle?: string }> = ({ initialTitle }) => {
  const [activeIndex, setActiveIndex] = useState<number>(titleToIndex(initialTitle));
  const itemCount = features.length;
  const stepAngle = 360 / itemCount;
  const navigate = useNavigate();

  useEffect(() => {
    setActiveIndex(titleToIndex(initialTitle));
  }, [initialTitle]);

  const { radius, cardWidth, cardHeight } = useMemo(() => {
    const isSmall = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    const isMedium = typeof window !== 'undefined' ? window.innerWidth >= 640 && window.innerWidth < 1024 : false;
    const baseWidth = isSmall ? 220 : isMedium ? 260 : 300;
    const baseHeight = Math.round(baseWidth * 0.625);
    const r = isSmall ? 260 : isMedium ? 360 : 460; // more radius to avoid overlap on sides
    return { radius: r, cardWidth: baseWidth, cardHeight: baseHeight };
  }, []);

  const rotateYDeg = -(activeIndex * stepAngle);

  const next = () => setActiveIndex((i) => (i + 1) % itemCount);
  const prev = () => setActiveIndex((i) => (i - 1 + itemCount) % itemCount);

  const handleChangeAI = () => {
    const active = features[activeIndex];
    if (active?.slug) navigate(`/ai/${active.slug}`);
  };

  // Basic swipe support
  const dragState = useRef<{ down: boolean; startX: number; lastX: number }>({ down: false, startX: 0, lastX: 0 });
  const onPointerDown = (x: number) => {
    dragState.current = { down: true, startX: x, lastX: x };
  };
  const onPointerMove = (x: number) => {
    if (!dragState.current.down) return;
    dragState.current.lastX = x;
  };
  const onPointerUp = () => {
    const { down, startX, lastX } = dragState.current;
    dragState.current.down = false;
    const delta = lastX - startX;
    const threshold = 40; // px
    if (Math.abs(delta) > threshold) {
      if (delta < 0) next(); else prev();
    }
  };

  return (
    <section className="relative w-full py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-white/95 text-xl font-semibold mb-6 text-center">Explore other AI's</h3>

        <div className="relative" style={{ perspective: 2200 }}>
          <motion.div
            className="relative mx-auto cursor-grab active:cursor-grabbing"
            style={{ width: '100%', height: cardHeight + 260 }}
            onMouseDown={(e) => onPointerDown(e.clientX)}
            onMouseMove={(e) => onPointerMove(e.clientX)}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
            onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
            onTouchEnd={onPointerUp}
          >
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-between">
              <div className="pointer-events-auto pl-1 sm:pl-3">
                <button
                  aria-label="Previous"
                  onClick={prev}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="h-10 w-10 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 border border-white/20 transition"
                >
                  ‹
                </button>
              </div>
              <div className="pointer-events-auto pr-1 sm:pr-3">
                <button
                  aria-label="Next"
                  onClick={next}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="h-10 w-10 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 border border-white/20 transition"
                >
                  ›
                </button>
              </div>
            </div>

            <motion.div
              className="absolute left-1/2 top-12 -translate-x-1/2 will-change-transform z-40"
              style={{ transformStyle: 'preserve-3d' as any }}
              animate={{ rotateY: rotateYDeg }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {features.map((f, index) => {
                const angle = index * stepAngle;
                const norm = Math.min(
                  Math.abs(((angle + rotateYDeg) % 360 + 360) % 360),
                  Math.abs((((angle + rotateYDeg) % 360 + 360) % 360) - 360)
                );
                const depthT = 1 - Math.min(norm / 180, 1);
                const scale = 0.75 + depthT * 0.2; // 0.75..0.95 to reduce side overlap
                const opacity = 0.5 + depthT * 0.5; // 0.5..1.0
                const isActive = index === activeIndex;
                const zIndex = 10 + Math.round(depthT * 100);

                const showCaption = norm <= (stepAngle + 5);

                return (
                  <div
                    key={f.title}
                    className="absolute left-1/2 top-0"
                    style={{
                      width: cardWidth,
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      marginLeft: -cardWidth / 2,
                      zIndex,
                    }}
                  >
                    <motion.article
                      className="relative rounded-xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0B3D2E] via-[#0E4A2D] to-[#1A5630] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
                      style={{ opacity, backfaceVisibility: 'hidden' as any }}
                      animate={{ scale }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <div style={{ width: cardWidth, height: cardHeight }}>
                        <img
                          src={f.img || '/placeholder.svg'}
                          onError={(e) => {
                            // @ts-ignore
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                          alt={f.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          fetchpriority="high"
                        />
                      </div>

                      {isActive && (
                        <div className="pointer-events-none absolute inset-0 ring-2 ring-[#86C232]/70 rounded-xl" />
                      )}
                    </motion.article>

                    {showCaption && (
                      <div className="mt-2 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/15 text-white font-semibold text-xs md:text-sm shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
                          {f.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <div className="-mt-2 md:-mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs tracking-wider uppercase">
            Active
          </div>
          <h4 className="mt-1 font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C8FF70] via-[#86C232] to-[#6BAF1F]" style={{ fontSize: 'clamp(1.25rem, 3.6vw, 2rem)' }}>
            {features[activeIndex].title}
          </h4>
          <div className="mt-0.5 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[#86C232] to-transparent opacity-80" />
          <p className="mt-1 text-white/85 text-sm md:text-base max-w-xl mx-auto">
            {features[activeIndex].desc}
          </p>
          <div className="mt-1 flex justify-center">
            <Button size="sm" className="bg-[#86C232] hover:bg-[#76b028] text-black font-semibold shadow-[0_8px_24px_rgba(134,194,50,0.35)]" onClick={handleChangeAI}>
              Change AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCarousel;