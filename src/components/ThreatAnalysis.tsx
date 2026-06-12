import React from 'react';

interface ThreatItem {
  label: string;
  probability: number; // 0..1
}

const PROGRESS_COLOR = '#EFB341';

const themeContainer: Record<string, string> = {
  forest: 'bg-[rgba(7,16,12,0.65)] border-white/15 backdrop-blur-md',
  wildlife: 'bg-[rgba(25,18,12,0.7)] border-white/15 backdrop-blur-md',
  climate: 'bg-[rgba(10,20,28,0.6)] border-white/20 backdrop-saturate-[1.2] backdrop-blur-md',
  marine: 'bg-white/8 border-white/20 backdrop-blur-xl',
  research: 'bg-[rgba(20,22,28,0.7)] border-white/15 backdrop-blur-md',
  career: 'bg-[rgba(14,20,34,0.7)] border-white/15 backdrop-blur-md',
  education: 'bg-[rgba(16,18,20,0.7)] border-white/15 backdrop-blur-md',
};

const ThreatBar: React.FC<ThreatItem> = ({ label, probability }) => {
  const pct = Math.round(probability * 100);
  return (
    <div className="rounded-lg p-3 bg-black/40 border border-white/10">
      <div className="flex items-center justify-between text-white/90 text-sm">
        <span>{label}</span>
        <span className="text-white/70 text-xs">{pct}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, background: PROGRESS_COLOR }} />
      </div>
    </div>
  );
};

const ThreatAnalysis: React.FC<{ items?: ThreatItem[]; theme?: string }> = ({ items, theme = 'forest' }) => {
  const data: ThreatItem[] = items || [
    { label: 'Illegal logging', probability: 0.72 },
    { label: 'Wildfires', probability: 0.41 },
    { label: 'Pest infestation', probability: 0.58 },
    { label: 'Mining activity', probability: 0.24 },
  ];

  const containerClass = themeContainer[theme] || themeContainer.forest;

  return (
    <div className={`rounded-xl p-5 border shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${containerClass}`}>
      <h3 className="text-white/95 font-semibold mb-3">Threat Analysis</h3>
      <div className="grid gap-3">
        {data.map((t) => (
          <ThreatBar key={t.label} label={t.label} probability={t.probability} />
        ))}
      </div>
    </div>
  );
};

export default ThreatAnalysis;