import React, { useEffect, useRef, useState } from 'react';

const TypewriterLine: React.FC<{ text: string; delay?: number; speedMsPerChar?: number; className?: string }>
= ({ text, delay = 0, speedMsPerChar = 18, className }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setActive(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const startTimer = setTimeout(() => {
      const iv = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, Math.max(5, speedMsPerChar));
    }, Math.max(0, delay));
    return () => clearTimeout(startTimer);
  }, [active, delay, speedMsPerChar, text]);

  return (
    <div ref={ref} className={className} aria-live="polite">
      {displayed}
      {!done && <span className="inline-block align-baseline ml-[2px] h-[1.1em] w-[2px] bg-white/80 animate-pulse" />}
    </div>
  );
};

const AboutSection: React.FC<{ accentColor?: string }> = ({ accentColor }) => {
  const accent = accentColor || 'var(--accent, #86C232)';

  return (
    <section id="about" className="relative mt-16 md:mt-20">
      <div className="relative rounded-2xl p-6 md:p-8 bg-[rgba(7,16,12,0.65)] border border-white/15 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.18] blur-3xl" style={{ background: accent }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full opacity-[0.12] blur-3xl" style={{ background: accent }} />

        <div className="relative z-10">
          <h2 className="text-white font-extrabold tracking-tight bg-clip-text text-center" style={{ fontSize: 'clamp(1.4rem, 3.8vw, 2.2rem)' }}>
            About Us
          </h2>

          <div className="mt-3 space-y-4 text-white/85 max-w-4xl mx-auto text-center">
            <TypewriterLine
              className="text-white font-semibold"
              text="What We Are: A Conservation Data & Collaboration Platform"
              delay={0}
              speedMsPerChar={14}
            />
            <TypewriterLine
              className=""
              text={"Zytherion Biovance is building the world's first comprehensive conservation infrastructure platform — think of it as the foundational operating system that connects every aspect of wildlife research, environmental monitoring, and conservation efforts globally. We're a platform company that happens to leverage AI technology, not an AI company building conservation tools."}
              delay={250}
              speedMsPerChar={12}
            />

            <TypewriterLine
              className="text-white font-semibold"
              text={"The Core Platform: “Digital Nervous System of the Planet”"}
              delay={700}
              speedMsPerChar={14}
            />
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <TypewriterLine
                className="text-white/85"
                text={"Primary Function: Conservation Data Infrastructure. Our platform serves as the central hub where conservation organizations, researchers, and government agencies can store, access, analyze, and collaborate on wildlife and environmental data. It's the missing infrastructure layer that currently forces every conservation project to work in isolation."}
                delay={950}
                speedMsPerChar={11}
              />
            </div>

            <TypewriterLine
              className="text-white font-semibold"
              text={"Search & Discovery Engine"}
              delay={1400}
              speedMsPerChar={14}
            />
            <TypewriterLine
              className=""
              text={'Think of it as "search engine for conservation" — a comprehensive search and discovery system that indexes conservation research, wildlife data, habitat information, and scientific findings from across the globe. Users can search across decades of research, current monitoring projects, and real‑time environmental conditions.'}
              delay={1600}
              speedMsPerChar={12}
            />

            <TypewriterLine
              className="text-white font-semibold"
              text={"Platform Architecture: Dual‑Layer Infrastructure"}
              delay={2000}
              speedMsPerChar={14}
            />

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="rounded-xl p-4 bg-black/40 border border-white/10">
                <h4 className="text-white/90 font-semibold">Public Layer: Open Conservation Hub</h4>
                <ul className="mt-2 list-disc pl-5 text-white/80 text-sm space-y-1">
                  <li>
                    <TypewriterLine text="Data Discovery: Search and explore conservation research, wildlife databases, and environmental studies" delay={2200} speedMsPerChar={12} />
                  </li>
                  <li>
                    <TypewriterLine text="Educational Resources: Access to scientific findings, habitat maps, species information" delay={2400} speedMsPerChar={12} />
                  </li>
                  <li>
                    <TypewriterLine text="Citizen Science Portal: Tools for public participation in data collection and monitoring" delay={2600} speedMsPerChar={12} />
                  </li>
                  <li>
                    <TypewriterLine text="Collaboration Space: Connect researchers, students, and conservation enthusiasts" delay={2800} speedMsPerChar={12} />
                  </li>
                </ul>
              </div>

              <div className="rounded-xl p-4 bg-black/40 border border-white/10">
                <h4 className="text-white/90 font-semibold">Private Layer: Secure Research Infrastructure</h4>
                <TypewriterLine
                  className="mt-2 text-white/80 text-sm"
                  text={"A protected workspace for sensitive research data and active field projects. Provides secure storage, fine‑grained access controls, encrypted collaboration, audit trails, and compliant data sharing across institutions — so teams can move faster without compromising trust or integrity."}
                  delay={3000}
                  speedMsPerChar={11}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full text-black font-semibold" style={{ backgroundColor: accent }}>Open Science</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">Responsible AI</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">Community</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;