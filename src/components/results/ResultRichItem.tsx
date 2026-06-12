import React from 'react';
import { ResultItem } from './ResultCard';

const Chip: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/85 text-[10px] uppercase tracking-wide">
    {label}
  </span>
);

const ResultRichItem: React.FC<{
  item: ResultItem;
  onView: (item: ResultItem) => void;
  accentColor?: string;
  url?: string;
  source?: string;
  date?: string;
  thumbUrl?: string;
  chips?: string[];
}> = ({ item, onView, accentColor = '#86C232', url, source, date, thumbUrl, chips }) => {
  return (
    <article className="group relative rounded-xl p-4 md:p-5 bg-[rgba(7,16,12,0.65)] border border-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          {source && (
            <div className="text-white/70 text-xs md:text-[13px] truncate">{source}{date ? ` • ${date}` : ''}</div>
          )}
          <h3 className="mt-1 leading-snug">
            <button
              onClick={() => onView(item)}
              className="text-left inline-block text-[clamp(1rem,1.1vw,1.15rem)] font-semibold text-white hover:underline"
              style={{ textDecorationColor: accentColor }}
            >
              {item.title}
            </button>
          </h3>
          <p className="mt-2 text-white/85 text-[13px] md:text-[14px] leading-relaxed line-clamp-3">
            {item.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {chips && chips.slice(0, 4).map((c) => <Chip key={c} label={c} />)}
          </div>
        </div>
        {thumbUrl && (
          <div className="hidden sm:block shrink-0 w-28 h-24 md:w-36 md:h-28 rounded-lg overflow-hidden border border-white/15 bg-white/5">
            <img src={thumbUrl} alt="preview" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        )}
      </div>
    </article>
  );
};

export default ResultRichItem;