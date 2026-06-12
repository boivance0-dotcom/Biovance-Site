import React, { useRef, useState, useEffect } from 'react';

const themeContainer: Record<string, string> = {
  forest: 'bg-[rgba(7,16,12,0.65)] border-white/15 backdrop-blur-md',
  wildlife: 'bg-[rgba(25,18,12,0.7)] border-white/15 backdrop-blur-md',
  climate: 'bg-[rgba(10,20,28,0.6)] border-white/20 backdrop-saturate-[1.2] backdrop-blur-md',
  marine: 'bg-white/8 border-white/20 backdrop-blur-xl',
  research: 'bg-[rgba(20,22,28,0.7)] border-white/15 backdrop-blur-md',
  career: 'bg-[rgba(14,20,34,0.7)] border-white/15 backdrop-blur-md',
  education: 'bg-[rgba(16,18,20,0.7)] border-white/15 backdrop-blur-md',
};

interface SliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  accentColor?: string;
  theme?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const FALLBACK_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"><rect width="100%" height="100%" fill="%23000000"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff99" font-size="16">Image unavailable</text></svg>';

const BeforeAfterSlider: React.FC<SliderProps> = ({ beforeSrc, afterSrc, alt, accentColor = '#86C232', theme = 'forest', beforeLabel = 'Before', afterLabel = 'After' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [swapSides, setSwapSides] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<'slider' | 'sideBySide'>('slider');
  const rafRef = useRef<number | null>(null);
  const dirRef = useRef<1 | -1>(1);

  const [beforeOk, setBeforeOk] = useState(true);
  const [afterOk, setAfterOk] = useState(true);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  useEffect(() => {
    if (mode !== 'slider') {
      setPlaying(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const step = () => {
      setPos((p) => {
        const next = p + (dirRef.current === 1 ? 0.006 : -0.006);
        if (next >= 1) {
          dirRef.current = -1;
          return 1;
        }
        if (next <= 0) {
          dirRef.current = 1;
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  const setPosFromClient = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (orientation === 'vertical') {
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setPos(x / rect.width);
    } else {
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      setPos(y / rect.height);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setPosFromClient(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPosFromClient(e.clientX, e.clientY);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setPos((p) => Math.max(0, p - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setPos((p) => Math.min(1, p + step));
    } else if (e.key.toLowerCase() === 'r') {
      setPos(0.5);
    } else if (e.key.toLowerCase() === 'o') {
      setOrientation((o) => (o === 'vertical' ? 'horizontal' : 'vertical'));
    } else if (e.key.toLowerCase() === 's') {
      setSwapSides((v) => !v);
    } else if (e.key.toLowerCase() === ' ') {
      e.preventDefault();
      if (mode === 'slider') setPlaying((p) => !p);
    }
  };

  const containerClass = themeContainer[theme] || themeContainer.forest;
  const percent = Math.round(pos * 100);

  const bgSrc = swapSides ? afterSrc : beforeSrc;
  const fgSrc = swapSides ? beforeSrc : afterSrc;

  return (
    <div className="rounded-2xl p-[1px]" style={{ background: `linear-gradient(135deg, ${accentColor}55, rgba(255,255,255,0.08))` }}>
      <div className={`rounded-2xl p-5 border shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${containerClass}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white/95 font-semibold">Satellite Imagery Viewer</h3>
          <div className="flex items-center gap-2 md:gap-3 text-xs text-white/80">
            <div className="inline-flex rounded-md overflow-hidden border border-white/15">
              <button
                className={`px-2 py-1 ${mode === 'slider' ? 'bg-white/15 text-white' : 'bg-transparent text-white/80'} hover:bg-white/15`}
                onClick={() => setMode('slider')}
                aria-label="Slider mode"
              >Slider</button>
              <button
                className={`px-2 py-1 ${mode === 'sideBySide' ? 'bg-white/15 text-white' : 'bg-transparent text-white/80'} hover:bg-white/15`}
                onClick={() => setMode('sideBySide')}
                aria-label="Side-by-side mode"
              >Side-by-side</button>
            </div>
            {mode === 'slider' && (
              <>
                <button className="px-2 py-1 rounded-md bg-white/10 border border-white/15 hover:bg-white/15" onClick={() => setPos(0.5)} aria-label="Reset slider">Reset</button>
                <button className="px-2 py-1 rounded-md bg-white/10 border border-white/15 hover:bg-white/15" onClick={() => setOrientation((o) => (o === 'vertical' ? 'horizontal' : 'vertical'))} aria-label="Toggle orientation">{orientation === 'vertical' ? 'Vertical' : 'Horizontal'}</button>
                <button className="px-2 py-1 rounded-md bg-white/10 border border-white/15 hover:bg-white/15" onClick={() => setSwapSides((v) => !v)} aria-label="Swap before/after">Swap</button>
                <button className="px-2 py-1 rounded-md bg-white/10 border border-white/15 hover:bg-white/15" onClick={() => setPlaying((p) => !p)} aria-label="Play/Pause">{playing ? 'Pause' : 'Play'}</button>
              </>
            )}
          </div>
        </div>

        {mode === 'slider' ? (
          <>
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-lg border border-white/10 select-none shadow-[0_10px_40px_rgba(0,0,0,0.35)] focus:outline-none"
              style={{ aspectRatio: '16 / 9' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={() => setDragging(false)}
              onKeyDown={onKeyDown}
              onDoubleClick={() => setPos(0.5)}
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Before and after comparison slider"
            >
              {!beforeLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:200%_100%]" />
              )}
              <img
                src={bgSrc}
                alt={alt || beforeLabel}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
                decoding="async"
                fetchpriority="high"
                onError={() => setBeforeOk(false)}
                onLoad={() => setBeforeLoaded(true)}
                style={{ opacity: beforeOk ? 1 : 0 }}
              />
              {!beforeOk && <img src={FALLBACK_IMG} alt="Fallback" className="absolute inset-0 w-full h-full object-cover" />}

              <div
                className="absolute inset-0"
                style={
                  orientation === 'vertical'
                    ? { width: `${pos * 100}%`, overflow: 'hidden', transition: dragging ? undefined : 'width 140ms ease-out' }
                    : { height: `${pos * 100}%`, overflow: 'hidden', transition: dragging ? undefined : 'height 140ms ease-out' }
                }
              >
                {!afterLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:200%_100%]" />
                )}
                <img
                  src={fgSrc}
                  alt={alt || afterLabel}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                  decoding="async"
                  fetchpriority="high"
                  onError={() => setAfterOk(false)}
                  onLoad={() => setAfterLoaded(true)}
                  style={{ opacity: afterOk ? 1 : 0 }}
                />
                {!afterOk && <img src={FALLBACK_IMG} alt="Fallback" className="absolute inset-0 w-full h-full object-cover" />}
              </div>

              <div className="pointer-events-none absolute inset-0" style={{ background: orientation === 'vertical' ? `linear-gradient(90deg, ${accentColor}14 0%, transparent 25%, transparent 75%, ${accentColor}10 100%)` : `linear-gradient(180deg, ${accentColor}14 0%, transparent 25%, transparent 75%, ${accentColor}10 100%)` }} />

              <span className="absolute top-2 left-2 text-[11px] md:text-xs font-semibold text-white/90 px-2 py-1 rounded-md bg-black/40 border border-white/15">{beforeLabel}</span>
              <span className="absolute bottom-2 right-2 text-[11px] md:text-xs font-semibold text-white/90 px-2 py-1 rounded-md bg-black/40 border border-white/15">{afterLabel}</span>

              {orientation === "vertical" ? (
                <div className="absolute inset-y-0" style={{ left: `${pos * 100}%`, transition: dragging ? undefined : 'left 140ms ease-out' }}>
                  <div className="w-0.5 h-full" style={{ background: '#ffffffcc', boxShadow: '0 0 12px rgba(255,255,255,0.6)' }} />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#ffffff', border: `1px solid ${accentColor}`, boxShadow: `0 6px 20px ${accentColor}44` }}
                  >
                    ↔ {percent}%
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-0" style={{ top: `${pos * 100}%`, transition: dragging ? undefined : 'top 140ms ease-out' }}>
                  <div className="h-0.5 w-full" style={{ background: '#ffffffcc', boxShadow: '0 0 12px rgba(255,255,255,0.6)' }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-black text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#ffffff', border: `1px solid ${accentColor}`, boxShadow: `0 6px 20px ${accentColor}44` }}
                  >
                    ↕ {percent}%
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={100}
                value={percent}
                onChange={(e) => setPos(parseInt(e.target.value, 10) / 100)}
                className="w-full accent-white/90"
                style={{ accentColor: accentColor }}
                aria-label="Adjust comparison"
              />
            </div>
          </>
        ) : (
          <div className="relative w-full rounded-lg border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-full" style={{ aspectRatio: '16 / 9' }}>
                <img src={beforeSrc} alt={alt || beforeLabel} className="absolute inset-0 w-full h-full object-cover" decoding="async" fetchpriority="high" />
                <span className="absolute top-2 left-2 text-[11px] md:text-xs font-semibold text-white/90 px-2 py-1 rounded-md bg-black/40 border border-white/15">{beforeLabel}</span>
              </div>
              <div className="relative h-full" style={{ aspectRatio: '16 / 9' }}>
                <img src={afterSrc} alt={alt || afterLabel} className="absolute inset-0 w-full h-full object-cover" decoding="async" fetchpriority="high" />
                <span className="absolute top-2 left-2 text-[11px] md:text-xs font-semibold text-white/90 px-2 py-1 rounded-md bg-black/40 border border-white/15">{afterLabel}</span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(1000px_700px_at_80%_10%, ${accentColor}12, transparent 60%)` }} />
          </div>
        )}

        <div className="mt-2 text-[11px] text-white/60">
          {mode === 'slider' ? 'Shortcuts: ←/→ or ↑/↓ to move, Shift for large steps, R reset, O toggle orientation, S swap, Space play/pause' : 'Tip: Use side-by-side to compare details without a divider'}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;