import React from 'react';
// Backend dev note:
// - Fetch AI-specific data on mount using slug: map weights, trend values, and gallery images
// - Endpoints to consider:
//   GET /api/ai/:slug/map-weights   -> pass to ForestHealthMap
//   GET /api/ai/:slug/trend         -> pass to TrendChart
//   GET /api/ai/:slug/gallery/today -> pass to SatelliteGallery (images)
import { useParams, useNavigate } from 'react-router-dom';
import FeatureCarousel from '@/components/FeatureCarousel';
import ForestHealthMap from '@/components/ForestHealthMap';
import TrendChart from '@/components/TrendChart';
import SatelliteGallery from '@/components/SatelliteGallery';
import ThreatAnalysis from '@/components/ThreatAnalysis';
import SearchBar from '@/components/SearchBar';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import CareerInsights from '@/components/CareerInsights';

const bgMap: Record<string, string> = {
  nature: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=90&w=3840&h=2160&fit=crop&auto=format',
  forest: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/refs/heads/main/forest.jpg',
  wildlife: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=90&w=3840&h=2160&fit=crop&auto=format',
  climate: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/climate.jpg',
  marine: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=90&w=3840&h=2160&fit=crop&auto=format',
  research: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=90&w=3840&h=2160&fit=crop&auto=format',
  career: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=90&w=3840&h=2160&fit=crop&auto=format',
  education: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=90&w=3840&h=2160&fit=crop&auto=format',
};

const titleMap: Record<string, string> = {
  nature: 'Nature AI',
  forest: 'Forest AI',
  wildlife: 'Wildlife AI',
  climate: 'Climate AI',
  marine: 'Marine AI',
  research: 'Research AI',
  career: 'Career AI',
  education: 'Education AI',
};

const mapWeights: Record<string, { title: string; weights: { healthy?: number; stressed?: number; critical?: number } }> = {
  forest: { title: 'Forest Health Index', weights: { healthy: 6, stressed: 3, critical: 1 } },
  wildlife: { title: 'Habitat Health Index', weights: { healthy: 5, stressed: 3, critical: 2 } },
  climate: { title: 'Vegetation Stress Index', weights: { healthy: 4, stressed: 4, critical: 2 } },
  marine: { title: 'Coastal Canopy Index', weights: { healthy: 5, stressed: 2, critical: 3 } },
  nature: { title: 'Ecosystem Health Index', weights: { healthy: 6, stressed: 2, critical: 2 } },
  research: { title: 'Field Sites Index', weights: { healthy: 5, stressed: 3, critical: 2 } },
  career: { title: 'Regions of Interest', weights: { healthy: 5, stressed: 3, critical: 2 } },
  education: { title: 'Study Areas Index', weights: { healthy: 6, stressed: 2, critical: 2 } },
};

const chartCfg: Record<string, { title: string; values?: number[] }> = {
  forest: { title: '12-Month Forest Health Trend' },
  wildlife: { title: 'Species Activity Trend' },
  climate: { title: 'CO2/Temperature Trend' },
  marine: { title: 'Coastal Vegetation Trend' },
  nature: { title: 'Ecosystem Vitality Trend' },
  research: { title: 'Publications Trend' },
  career: { title: 'Opportunities Trend' },
  education: { title: 'Learning Engagement Trend' },
};

const accentMap: Record<string, string> = {
  nature: '#86C232',
  forest: '#86C232',
  wildlife: '#5C4033',
  climate: '#4DB6E2',
  marine: '#00B8D9',
  research: '#2196F3',
  career: '#FFC107',
  education: '#1976D2',
};

const viewerImages: Record<string, { before: string; after: string; alt: string }> = {
  forest: {
    before: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Forest canopy comparison',
  },
  wildlife: {
    before: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Wildlife habitat comparison',
  },
  climate: {
    before: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Climate impact comparison',
  },
  marine: {
    before: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Marine habitat comparison',
  },
  nature: {
    before: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=90&w=3840&h=2160&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=90&w=3840&h=2160&fit=crop&auto=format',
    alt: 'Nature 4K comparison',
  },
  research: {
    before: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1523246191869-8b30bf8b4d56?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Research sites comparison',
  },
  career: {
    before: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Career growth comparison',
  },
  education: {
    before: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=90&w=1920&h=1080&fit=crop&auto=format',
    after: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=90&w=1920&h=1080&fit=crop&auto=format',
    alt: 'Education engagement comparison',
  },
};

const AIDashboard: React.FC = () => {
  const { slug = 'forest' } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const bgUrl = bgMap[slug] || bgMap.forest;
  const aiTitle = titleMap[slug] || 'Forest AI';
  const mapCfg = mapWeights[slug] || mapWeights.forest;
  const trend = chartCfg[slug] || chartCfg.forest;
  const viewer = viewerImages[slug] || viewerImages.forest;
  const accent = accentMap[slug] || accentMap.forest;

  const handleSearch = (q: string) => {
    if (!q) return;
    navigate(`/results?q=${encodeURIComponent(q)}&ai=${encodeURIComponent(slug)}`);
  };

  const LockOverlay = () => (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
      <div className="text-center">
        <div className="text-white font-semibold">Sign in to access</div>
        <a href={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} className="inline-block mt-2 px-3 py-1 rounded-md text-black text-xs font-semibold" style={{ backgroundColor: accent }}>Sign in</a>
      </div>
    </div>
  );

  // Backend dev note:
  // Replace the gallery placeholder with data from /api/ai/:slug/gallery/today
  const gallery: Array<{ url: string; caption: string; time?: string }> = [
    { url: viewer.before, caption: 'Morning pass', time: '09:10' },
    { url: viewer.after, caption: 'Afternoon pass', time: '14:25' },
    { url: bgUrl, caption: 'Wide area capture' },
  ];

  return (
    <div className="relative z-10 min-h-screen ai-theme" data-theme={slug} style={{ ['--accent' as any]: accent }}>
      <div className="relative overflow-hidden">
        {/* AI background (no blur) */}
        <div
          className="fixed-bg hero-image-filter"
          style={{ backgroundImage: `url(${bgUrl})`, zIndex: 0 as unknown as number }}
          aria-hidden
        />
        {/* Theme tint overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(1200px_800px_at_10%_10%, ${accent}10, transparent 60%), radial-gradient(1000px_700px_at_90%_30%, ${accent}12, transparent 55%)` }} />
        <div className="hero-gradient-top" />
        <div className="hero-gradient-bottom" />
        <div className="hero-vignette" />

        <div className="relative z-10 container mx-auto px-6 py-10 md:py-14">
          {/* Slider at top (compact), initialized to this AI */}
          <div className="mt-6 max-w-5xl mx-auto transform origin-top scale-90 md:scale-95">
            <FeatureCarousel initialTitle={aiTitle} />
          </div>

          {/* Dashboard below slider */}
          <div className="mt-0 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6">
              <ForestHealthMap title={mapCfg.title} statusWeights={mapCfg.weights} theme={slug} />
              <TrendChart title={trend.title} values={trend.values} theme={slug} />
            </div>
            <div className="lg:col-span-1 relative grid gap-6">
              <ThreatAnalysis theme={slug} />
              {slug === 'career' && <CareerInsights accentColor={accent} />}
            </div>
          </div>

          {/* Satellite gallery replacing imagery viewer */}
          <div className="mt-6">
            <SatelliteGallery images={gallery} accentColor={accent} />
          </div>

          {/* About + Contact */}
          <AboutSection accentColor={accent} />
          <ContactSection accentColor={accent} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AIDashboard;