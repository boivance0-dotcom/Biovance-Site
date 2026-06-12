import React from 'react';
import { MapPin, Activity, Lock } from 'lucide-react';
import { ResultItem } from './ResultCard';

const TYPE_BADGE: Record<string, string> = {
  project: 'bg-white/10 border border-white/15 text-white/85',
  wildlife: 'bg-amber-800/30 border border-amber-500/30 text-amber-200',
  alert: 'bg-red-600/20 border border-red-500/30 text-red-200',
  research: 'bg-blue-700/25 border border-blue-500/30 text-blue-200',
};

const Chip: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/85 text-[10px] uppercase tracking-wide">
    {label}
  </span>
);

const ResultListItem: React.FC<{
  item: ResultItem;
  onView: (item: ResultItem) => void;
  accentColor?: string;
  isLocked?: boolean;
  aiIcon?: React.ReactNode;
  tintClass?: string;
  chips?: string[];
}> = ({ item, onView, accentColor = '#86C232', isLocked = false, aiIcon, tintClass, chips }) => {
  const badgeClass = TYPE_BADGE[item.type] || TYPE_BADGE.project;
  const confidencePct = Math.round((item.confidence ?? 0.9) * 100);

  return (
    <article className={`group relative rounded-xl p-4 ${tintClass || 'bg-[rgba(7,16,12,0.65)]'} border border-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-md hover:shadow-[0_18px_56px_rgba(0,0,0,0.55)] transition-colors`}>
      <div className="flex items-start gap-4">
        <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/15 bg-white/5">
          <div className="absolute inset-0 grid place-items-center text-white/70 text-sm">
            {aiIcon}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold text-base md:text-lg leading-snug truncate">
            {item.title}
          </h3>
          <p className="text-white/80 text-sm mt-1 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/75">
            {item.location && (
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
            )}
            <span className="inline-flex items-center gap-1"><Activity className="w-3 h-3" /> {confidencePct}%</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${badgeClass}`}>{item.type}</span>
            {item.health && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/85 capitalize">{item.health}</span>
            )}
            {chips && chips.slice(0, 3).map((c) => <Chip key={c} label={c} />)}
          </div>
        </div>
        <div className="mt-1">
          <button
            onClick={() => onView(item)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-black text-xs font-semibold transition-opacity hover:opacity-90 ${isLocked ? 'opacity-70' : ''}`}
            style={{ backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}55` }}
            aria-label={isLocked ? 'Sign in' : 'View details'}
          >
            {isLocked ? (<><Lock className="w-3 h-3" /> Sign in</>) : 'View'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ResultListItem;