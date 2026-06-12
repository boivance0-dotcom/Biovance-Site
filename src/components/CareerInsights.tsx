import React from 'react';

// Backend dev note:
// - Hydrate from career endpoints:
//   GET /api/career/top-hiring           -> companies list
//   GET /api/career/skills?ai=career     -> skills chips
//   GET /api/career/salary-trend         -> monthly salary trend values

const SkillChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90 text-[11px]">
    {label}
  </span>
);

const CareerInsights: React.FC<{ accentColor?: string }> = ({ accentColor = '#FFC107' }) => {
  const skills = ['Python', 'SQL', 'ML Ops', 'AWS', 'React']; // Backend: replace with server values
  const companies = ['EcoData Inc.', 'GreenWorks', 'BioMetric', 'ClimaTech']; // Backend: replace
  const values = [82, 85, 83, 87, 90, 92, 94, 96, 98, 101, 103, 105]; // Backend: replace (median salary index)

  const width = 260;
  const height = 90;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const dx = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * dx;
      const y = height - ((v - min) / (max - min || 1)) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="rounded-2xl p-4 bg-[rgba(14,20,34,0.7)] border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <h3 className="text-white font-semibold mb-3" style={{ color: accentColor }}>Career Insights</h3>

      <div className="grid gap-4">
        <div className="rounded-lg p-3 bg-black/35 border border-white/10" data-endpoint="/api/career/top-hiring">
          <div className="text-white/85 text-sm font-semibold">Top Hiring Companies</div>
          <ul className="mt-2 text-white/80 text-sm grid gap-1 list-disc list-inside">
            {companies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg p-3 bg-black/35 border border-white/10" data-endpoint="/api/career/skills">
          <div className="text-white/85 text-sm font-semibold">In‑Demand Skills</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s) => (
              <SkillChip key={s} label={s} />
            ))}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-black/35 border border-white/10" data-endpoint="/api/career/salary-trend">
          <div className="text-white/85 text-sm font-semibold">Salary Trend (Index)</div>
          <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 w-full h-auto">
            <defs>
              <linearGradient id="career-g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.55" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline fill="none" stroke={accentColor} strokeWidth="2" points={points} />
            <polygon fill="url(#career-g)" opacity="0.25" points={`0,${height} ${points} ${width},${height}`} />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CareerInsights;