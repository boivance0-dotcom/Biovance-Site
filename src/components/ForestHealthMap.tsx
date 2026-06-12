import React, { useMemo, useState } from 'react';

export type ZoneStatus = 'healthy' | 'stressed' | 'critical';

const STATUS_COLOR: Record<ZoneStatus, string> = {
  healthy: '#3CB371',
  stressed: '#F0AD4E',
  critical: '#E15241',
};

const Legend: React.FC = () => (
  <div className="flex items-center gap-3 text-xs text-white/80">
    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: STATUS_COLOR.healthy }} /> Healthy</div>
    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: STATUS_COLOR.stressed }} /> Stressed</div>
    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: STATUS_COLOR.critical }} /> Critical</div>
  </div>
);

interface Zone {
  id: string;
  x: number;
  y: number;
  status: ZoneStatus;
}

interface ForestHealthMapProps {
  title?: string;
  statusWeights?: Partial<Record<ZoneStatus, number>>;
  theme?: string;
}

const themeContainer: Record<string, string> = {
  forest: 'bg-[rgba(7,16,12,0.65)] border-white/15 backdrop-blur-md',
  wildlife: 'bg-[rgba(25,18,12,0.7)] border-white/15 backdrop-blur-md',
  climate: 'bg-[rgba(10,20,28,0.6)] border-white/20 backdrop-saturate-[1.2] backdrop-blur-md',
  marine: 'bg-white/8 border-white/20 backdrop-blur-xl',
  research: 'bg-[rgba(20,22,28,0.7)] border-white/15 backdrop-blur-md',
  career: 'bg-[rgba(14,20,34,0.7)] border-white/15 backdrop-blur-md',
  education: 'bg-[rgba(16,18,20,0.7)] border-white/15 backdrop-blur-md',
};

const chooseStatus = (r: number, w: Required<Record<ZoneStatus, number>>): ZoneStatus => {
  const total = w.healthy + w.stressed + w.critical;
  const pHealthy = w.healthy / total;
  const pStressed = w.stressed / total;
  if (r < pHealthy) return 'healthy';
  if (r < pHealthy + pStressed) return 'stressed';
  return 'critical';
};

const generateZones = (weights?: Partial<Record<ZoneStatus, number>>): Zone[] => {
  const zones: Zone[] = [];
  let id = 0;
  const w: Required<Record<ZoneStatus, number>> = {
    healthy: weights?.healthy ?? 6,
    stressed: weights?.stressed ?? 3,
    critical: weights?.critical ?? 1,
  };
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      const r = Math.random();
      const status = chooseStatus(r, w);
      zones.push({ id: `z-${id++}`, x: col, y: row, status });
    }
  }
  return zones;
};

const ForestHealthMap: React.FC<ForestHealthMapProps> = ({ title = 'Forest Health Index', statusWeights, theme = 'forest' }) => {
  const [zones, setZones] = useState<Zone[]>(() => generateZones(statusWeights));
  const [hover, setHover] = useState<Zone | null>(null);

  const counts = useMemo(() => zones.reduce((acc, z) => ({ ...acc, [z.status]: (acc[z.status] || 0) + 1 }), {} as Record<ZoneStatus, number>), [zones]);

  const handleClick = (zone: Zone) => {
    const next: ZoneStatus = zone.status === 'healthy' ? 'stressed' : zone.status === 'stressed' ? 'critical' : 'healthy';
    setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, status: next } : z)));
  };

  const width = 600;
  const height = 300;
  const cellW = width / 10;
  const cellH = height / 6;

  const containerClass = themeContainer[theme] || themeContainer.forest;

  return (
    <div className={`rounded-xl p-5 border shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${containerClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/95 font-semibold">{title}</h3>
        <Legend />
      </div>
      <div className="relative">
        {hover && (
          <div className="absolute -top-2 left-2 text-xs text-white/90 bg-black/60 border border-white/15 px-2 py-1 rounded">
            Zone {hover.id.replace('z-', '')}: {hover.status}
          </div>
        )}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {zones.map((z) => (
            <rect
              key={z.id}
              x={z.x * cellW + 2}
              y={z.y * cellH + 2}
              width={cellW - 4}
              height={cellH - 4}
              rx={6}
              fill={STATUS_COLOR[z.status]}
              opacity={0.9}
              onMouseEnter={() => setHover(z)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(z)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            />
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-white/85">
        <div className="rounded bg-black/40 border border-white/10 px-3 py-2">Healthy: <span className="font-semibold">{counts.healthy || 0}</span></div>
        <div className="rounded bg-black/40 border border-white/10 px-3 py-2">Stressed: <span className="font-semibold">{counts.stressed || 0}</span></div>
        <div className="rounded bg-black/40 border border-white/10 px-3 py-2">Critical: <span className="font-semibold">{counts.critical || 0}</span></div>
      </div>
    </div>
  );
};

export default ForestHealthMap;