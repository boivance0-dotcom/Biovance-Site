import React from 'react';

const testimonials = [
  { name: 'Maya', quote: 'The forest analytics are incredibly actionable.' },
  { name: 'Arun', quote: 'Clean UI and surprisingly insightful AI outputs.' },
  { name: 'Leah', quote: 'Felt premium and responsive across all devices.' },
];

const Testimonials: React.FC = () => {
  return (
    <section className="w-full py-20 bg-black/20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-white/95 text-xl font-semibold mb-6">What users are saying</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article key={t.name} className="rounded-xl p-5 bg-[rgba(7,16,12,0.65)] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] hover:border-[#86C232]/40">
              <p className="text-white/90">“{t.quote}”</p>
              <div className="mt-4 text-white/70 text-sm">— {t.name}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;