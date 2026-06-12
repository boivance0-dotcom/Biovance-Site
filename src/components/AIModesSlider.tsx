
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Leaf, Trees, Bird, Globe, Zap, Droplets } from 'lucide-react';

interface AIMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  status?: 'active' | 'beta' | 'soon';
}

const aiModes: AIMode[] = [
  { id: 'climate', name: 'Climate Intelligence', description: 'Advanced climate modeling and environmental impact analysis', icon: <Globe className="h-7 w-7" />, gradient: 'from-primary/8 to-accent/8', status: 'beta' },
  { id: 'forest', name: 'Forest Monitoring', description: 'Ecosystem health assessment and conservation strategies', icon: <Trees className="h-7 w-7" />, gradient: 'from-primary/10 to-primary/5', status: 'active' },
  { id: 'wildlife', name: 'Wildlife Analytics', description: 'Species tracking and biodiversity conservation insights', icon: <Bird className="h-7 w-7" />, gradient: 'from-accent/8 to-primary/6', status: 'active' },
  { id: 'energy', name: 'Energy Systems', description: 'Renewable energy optimization and smart grid analysis', icon: <Zap className="h-7 w-7" />, gradient: 'from-primary/6 to-accent/10', status: 'soon' },
  { id: 'ocean', name: 'Marine Research', description: 'Ocean health monitoring and marine conservation', icon: <Droplets className="h-7 w-7" />, gradient: 'from-accent/6 to-primary/8', status: 'beta' },
  { id: 'sustainability', name: 'ESG Analytics', description: 'Corporate sustainability metrics and environmental compliance', icon: <Leaf className="h-7 w-7" />, gradient: 'from-primary/8 to-accent/6', status: 'active' },
];

interface AIModesSliderProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const statusStyles: Record<NonNullable<AIMode['status']>, string> = {
  active: 'bg-[#86C232] text-[#86C232]',
  beta: 'bg-amber-400/90 text-amber-300',
  soon: 'bg-white/30 text-white/60'
};

const AIModesSlider: React.FC<AIModesSliderProps> = ({ selectedMode, onModeChange, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedIndex = aiModes.findIndex(mode => mode.id === selectedMode);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % Math.max(1, aiModes.length - 2));
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + Math.max(1, aiModes.length - 2)) % Math.max(1, aiModes.length - 2));

  const getVisibleModes = () => {
    const visible = [] as AIMode[];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % aiModes.length;
      visible.push(aiModes[index]);
    }
    return visible;
  };

  const visibleModes = getVisibleModes();

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`} role="region" aria-label="AI Selector">
      <div className="relative flex items-center justify-center gap-4">
        <button aria-label="Previous AI" onClick={prevSlide} className="p-3 rounded-full bg-black/30 border border-white/10 text-white hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#86C232] backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-5 items-center">
          {visibleModes.map((mode, index) => {
            const isActive = mode.id === selectedMode;
            const isCenter = index === 1;
            const inactive = !isActive && !isCenter;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                aria-pressed={isActive}
                className={`w-[280px] rounded-[14px] p-4 text-left backdrop-blur-md bg-[rgba(7,16,12,0.56)] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#86C232] ${
                  isActive ? 'scale-105 z-10' : isCenter ? 'scale-100' : 'opacity-40 grayscale-[12%] scale-95'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B3D2E] flex items-center justify-center text-white">
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{mode.name}</h4>
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{mode.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusStyles[mode.status || 'active'].split(' ')[0]}`}></span>
                      <span className={`text-sm ${statusStyles[mode.status || 'active'].split(' ')[1]}`}>{mode.status === 'soon' ? 'Coming soon' : mode.status === 'beta' ? 'Beta' : 'Active'}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button aria-label="Next AI" onClick={nextSlide} className="p-3 rounded-full bg-black/30 border border-white/10 text-white hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#86C232] backdrop-blur">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mode Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {aiModes.map((mode, i) => (
          <button key={mode.id} onClick={() => onModeChange(mode.id)} aria-current={mode.id === selectedMode}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${mode.id === selectedMode ? 'bg-[#86C232] w-6' : 'bg-white/40 hover:bg-white/60'}`} />
        ))}
      </div>
    </div>
  );
};

export default AIModesSlider;
