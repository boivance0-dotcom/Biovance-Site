import React from 'react';

// Backend dev note:
// - Hydrate this gallery with GET /api/ai/:slug/gallery/today
// - Expect an array of { url, caption, time, source }
// - The data-endpoint attribute is provided for progressive enhancement
interface GalleryImage {
  url: string;
  caption?: string;
  source?: string;
  time?: string;
}

const SatelliteGallery: React.FC<{ images: GalleryImage[]; accentColor?: string; title?: string }>
= ({ images, accentColor = '#86C232', title = "Today's Best Satellite Images" }) => {
  return (
    <section className="rounded-2xl p-5 bg-[rgba(7,16,12,0.65)] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/95 font-semibold">
          <span
            className="inline-block rounded-md bg-black/60 border border-white/15 px-2 py-1"
            style={{ color: accentColor, textShadow: '0 1px 0 rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.45)' }}
          >
            {title}
          </span>
        </h3>
        <span className="text-xs text-white/70">Auto-refreshed daily</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={i} className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <img
              src={img.url}
              alt={img.caption || 'Satellite image'}
              className="w-full h-44 object-cover md:h-48"
              loading="lazy"
              decoding="async"
              data-endpoint="/api/gallery/today"
              data-index={i}
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white/90 text-xs">
              <div className="flex items-center justify-between">
                <span className="line-clamp-1">{img.caption || 'High-resolution capture'}</span>
                {img.time && <span className="text-white/70 ml-2 shrink-0">{img.time}</span>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default SatelliteGallery;