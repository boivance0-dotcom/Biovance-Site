import React from 'react';
import ForestHealthMap from '@/components/ForestHealthMap';
import TrendChart from '@/components/TrendChart';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import ThreatAnalysis from '@/components/ThreatAnalysis';
import FeatureCarousel from '@/components/FeatureCarousel';

const forestHeroBgUrl = 'https://raw.githubusercontent.com/varunsingh3545/search-engine/refs/heads/main/forest.jpg';

const ForestAI: React.FC = () => {
  const before = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1600&auto=format&fit=crop';
  const after = 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="relative z-10 min-h-screen">
      <div className="relative overflow-hidden">
        {/* Fixed Background Image with cinematic treatment */}
        <div
          className="fixed-bg hero-image-filter"
          style={{ backgroundImage: `url(${forestHeroBgUrl})`, zIndex: 0 as unknown as number }}
          aria-hidden
        />
        <div className="hero-gradient-top" />
        <div className="hero-gradient-bottom" />
        <div className="hero-vignette" />

        <div className="relative z-10 container mx-auto px-6 py-10 md:py-14">
          <div className="page-enter">
            <h1 className="hero-title-clean" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}>Forest AI Dashboard</h1>
            <p className="mt-2 text-white/85 max-w-3xl">Live forest health monitoring, satellite comparisons, and AI-driven threat analysis.</p>
          </div>

          {/* Slider at top (compact) */}
          <div className="mt-4 max-w-5xl mx-auto transform origin-top scale-90 md:scale-95">
            <FeatureCarousel />
          </div>

          {/* Dashboard below slider */}
          <div className="mt-0 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6">
              <ForestHealthMap />
              <TrendChart />
            </div>
            <div className="lg:col-span-1">
              <ThreatAnalysis />
            </div>
          </div>

          <div className="mt-6">
            <BeforeAfterSlider beforeSrc={before} afterSrc={after} alt="Deforestation comparison" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestAI;