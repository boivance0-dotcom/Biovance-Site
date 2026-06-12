import React from 'react';

const themeContainer: Record<string, { base: string; line: string; fillStart: string; }> = {
  forest: { base: 'bg-[rgba(7,16,12,0.65)] border-white/15 backdrop-blur-md', line: '#86C232', fillStart: '#86C232' },
  wildlife: { base: 'bg-[rgba(25,18,12,0.7)] border-white/15 backdrop-blur-md', line: '#4CAF50', fillStart: '#4CAF50' },
  climate: { base: 'bg-[rgba(10,20,28,0.6)] border-white/20 backdrop-saturate-[1.2] backdrop-blur-md', line: '#4DB6E2', fillStart: '#4DB6E2' },
  marine: { base: 'bg-white/8 border-white/20 backdrop-blur-xl', line: '#00B8D9', fillStart: '#00B8D9' },
  research: { base: 'bg-[rgba(20,22,28,0.7)] border-white/15 backdrop-blur-md', line: '#2196F3', fillStart: '#2196F3' },
  career: { base: 'bg-[rgba(14,20,34,0.7)] border-white/15 backdrop-blur-md', line: '#FFC107', fillStart: '#FFC107' },
  education: { base: 'bg-[rgba(16,18,20,0.7)] border-white/15 backdrop-blur-md', line: '#1976D2', fillStart: '#1976D2' },
};

const TrendChart: React.FC<{ values?: number[]; title?: string; theme?: string }> = ({ values, title, theme = 'forest' }) => {
  const data = values && values.length ? values : Array.from({ length: 12 }, () => 60 + Math.round(Math.random() * 40));
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const width = 600;
  const height = 220;
  const dx = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * dx;
      const y = height - ((v - min) / (max - min)) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const cfg = themeContainer[theme] || themeContainer.forest;

  return (
    <div className={`rounded-xl p-5 border shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${cfg.base}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/95 font-semibold">{title || '12-Month Trend'}</h3>
        <div className="text-xs text-white/70">Index (0-100)</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={cfg.fillStart} stopOpacity="0.6" />
            <stop offset="100%" stopColor={cfg.fillStart} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke={cfg.line} strokeWidth="2" points={points} />
        <polygon fill="url(#g)" opacity="0.25" points={`0,${height} ${points} ${width},${height}`} />
        {data.map((v, i) => (
          <circle key={i} cx={i * dx} cy={height - ((v - min) / (max - min)) * (height - 20) - 10} r="3" fill="#C8FF70" />
        ))}
      </svg>
    </div>
  );
};

export default TrendChart;