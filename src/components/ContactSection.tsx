import React, { useState } from 'react';

const ContactSection: React.FC<{ companyName?: string; accentColor?: string }> = ({ companyName = 'Zytherion Biovance', accentColor }) => {
  const accent = accentColor || 'var(--accent, #86C232)';
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section id="contact" className="relative mt-16 md:mt-20">
      <div className="relative rounded-2xl p-6 md:p-8 bg-[rgba(7,16,12,0.65)] border border-white/15 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-[0.14] blur-3xl" style={{ background: accent }} />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[520px] h-[520px] rounded-full opacity-[0.1] blur-3xl" style={{ background: accent }} />

        <div className="relative z-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.4rem, 3.8vw, 2.2rem)' }}>
              Contact Us
            </h2>
            <p className="mt-2 text-white/85 max-w-xl">
              Have questions, ideas, or want to collaborate? Reach out — we love hearing from researchers, conservationists, and curious minds.
            </p>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-xl p-4 bg-black/40 border border-white/10">
                <div className="text-white/90 font-semibold">{companyName}</div>
                <div className="text-white/70 mt-1">Digital Nervous System Lab</div>
                <div className="text-white/70">4539 North 22nd STE R</div>
                <div className="text-white/70">Phoenix, AZ 85016</div>
              </div>
              <div className="rounded-xl p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="text-white/80">
                  <div>info@zytherionbiovance.com</div>
                  <div className="text-white/60 text-xs">480-490-4120</div>
                </div>
                <a href="mailto:info@zytherionbiovance.com" className="px-3 py-1 rounded-md text-white text-xs font-semibold ring-1 ring-white/40 hover:brightness-105 transition" style={{ backgroundColor: accent, textShadow: '0 1px 0 rgba(0,0,0,0.65), 0 0 8px rgba(0,0,0,0.35)' }}>Email us</a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Name</label>
              <input className="bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white/90 outline-none focus:border-white/20" placeholder="Your name" required />
            </div>
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Email</label>
              <input type="email" className="bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white/90 outline-none focus:border-white/20" placeholder="you@example.com" required />
            </div>
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Message</label>
              <textarea className="bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white/90 outline-none focus:border-white/20 min-h-[120px]" placeholder="How can we help?" required />
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-md text-white font-semibold ring-1 ring-white/40 hover:brightness-105 transition" style={{ backgroundColor: accent, textShadow: '0 1px 0 rgba(0,0,0,0.65), 0 0 8px rgba(0,0,0,0.35)' }}>Send</button>
              {sent && <span className="text-white/80 text-sm">Thanks! We will get back to you.</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;