
import React, { useRef, useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import AIModesSlider from '@/components/AIModesSlider';
import { useParallax } from '@/lib/hooks/useParallax';
import { useReveal } from '@/lib/hooks/useReveal';
import HeroShowcase from '@/components/HeroShowcase';
import AnimatedGradient from '@/components/AnimatedGradient';
import FeatureCarousel from '@/components/FeatureCarousel';
import Testimonials from '@/components/Testimonials';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import ForestHealthMap from '@/components/ForestHealthMap';
import TrendChart from '@/components/TrendChart';
import ThreatAnalysis from '@/components/ThreatAnalysis';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SatelliteGallery from '@/components/SatelliteGallery';

const Index = () => {
  const [started, setStarted] = useState(false);
  const [earthAnimationComplete, setEarthAnimationComplete] = useState(false);
  const [showContent, setShowContent] = useState(true); // Show content immediately
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const earthRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useParallax('.parallax-item');
  useReveal('.reveal-on-scroll');

  const prefersReducedMotion = useReducedMotion();
  const EASE: any = [0.2, 0.9, 0.3, 1];

  const handleSearch = (query: string) => {
    if (!query) return;
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const startExperience = () => setStarted(true);

  const before = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1600&auto=format&fit=crop';
  const after = 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop';

  useEffect(() => {
    // Start Earth animation after a short delay
    const timer = setTimeout(() => {
      setEarthAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // When experience starts, bring the content section into view
  useEffect(() => {
    if (started && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [started]);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Earth Video Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Fixed Earth video as background */}
        <div className="fixed inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2400&auto=format&fit=crop"
          >
            <source src="https://raw.githubusercontent.com/varunsingh3545/search-engine/main/84589-585553865.mp4" type="video/mp4" />
          </video>
          <div className="fixed inset-0 bg-black/45" />
        </div>

        {/* Earth Entry Animation Container */}
        <div 
          ref={earthRef}
          className="relative z-20 container mx-auto px-6 py-16 min-h-screen flex flex-col justify-center items-center"
        >
          {/* Main Heading with Entry Animation */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={earthAnimationComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
          >
            <motion.h1
              className={`font-black leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-50 to-blue-100 drop-shadow-[0_25px_100px_rgba(0,0,0,0.8)] ${started ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              style={{ 
                fontSize: 'clamp(2.5rem, 7vw, 5rem)', 
                letterSpacing: '-0.03em', 
                textShadow: '0 10px 40px rgba(0,0,0,0.9)',
                fontFeatureSettings: '"liga" 1, "kern" 1',
                transition: 'opacity 400ms ease'
              }}
            >
              <span className="block">Digital Nervous System</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-blue-200/90" style={{ letterSpacing: '0.1em' }}>
                New Brain For Healthy Earth
              </span>
            </motion.h1>

            {/* Company Theory Reveal */}
            <motion.div
              className={`mt-8 max-w-4xl mx-auto ${started ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={earthAnimationComplete ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
            >
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Our Vision
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  We believe in harnessing the power of Earth observation to create intelligent systems that understand our planet's complex ecosystems. 
                  Through advanced AI and real-time data analysis, we transform satellite imagery into actionable insights that drive environmental 
                  conservation and sustainable development.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-300 mb-2">24/7</div>
                    <div className="text-sm text-white/80">Global Monitoring</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-300 mb-2">AI-Powered</div>
                    <div className="text-sm text-white/80">Intelligent Analysis</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-2">Real-Time</div>
                    <div className="text-sm text-white/80">Data Processing</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={earthAnimationComplete ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 2.5 }}
            >
              <button
                onClick={startExperience}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Explore Our Technology
              </button>
              <Link
                to="/search"
                className="px-8 py-4 bg-white/90 text-black font-bold text-lg rounded-xl border border-white/20 shadow-2xl hover:bg-white transition-all duration-300 transform hover:scale-105"
              >
                All‑in‑One Search
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Section - Below Earth */}
      <div 
        ref={contentRef}
        className="relative z-10"
      >
        {showContent && (
          <>
            {/* Experience State */}
            {started && (
              <div className="animate-hero-in parallax-item mt-16 md:mt-24" data-speed="1">
                <div className="max-w-3xl mx-auto text-center">
                  <motion.div
                    className="inline-block text-left rounded-lg bg-black/55 border border-white/15 backdrop-blur-sm px-5 py-4"
                    initial={prefersReducedMotion ? false : { x: -50, opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                  >
                    <h2
                      className="font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/80"
                      style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', letterSpacing: '-0.02em', textShadow: '0 8px 28px rgba(0,0,0,0.6)' }}
                    >
                      What do you want to explore?
                    </h2>
                    <p className="mt-2 text-white/95 text-base md:text-lg">
                      Explore our planet, monitor climate signals, and discover Earth's ecosystems — our AI will guide you.
                    </p>
                  </motion.div>
                  <motion.div
                    className="mt-6"
                    initial={prefersReducedMotion ? false : { scale: 0.95, opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
                  >
                    <SearchBar onSearch={handleSearch} className="search-input" buttonClassName="search-button" />
                  </motion.div>
                </div>

                {/* Cards shown only after start */}
                <div key="feature-cards" className="mt-12 reveal-on-scroll reveal-up" data-duration="600ms" data-delay="120ms">
                  <FeatureCarousel />
                </div>

                {/* Platform Backend entry */}
                <div className="mt-8 flex justify-center">
                  <Link to="/backend" className="group relative inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/60 px-6 py-4 backdrop-blur-sm hover:border-primary/60 transition-colors">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-foreground">Enter Platform Backend</div>
                      <div className="text-xs text-muted-foreground">Live dashboard · pipeline · satellites · intelligence — the Digital Nervous System</div>
                    </div>
                    <span className="ml-2 text-primary group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>

                {/* Forest AI Dashboard below slider (compact) */}
                <div className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 grid gap-6">
                      <ForestHealthMap />
                      <TrendChart />
                    </div>
                    <div className="lg:col-span-1">
                      <ThreatAnalysis />
                    </div>
                  </div>
                  <div className="mt-6">
                    <SatelliteGallery images={[
                      { url: before, caption: 'Morning pass', time: '09:10' },
                      { url: after, caption: 'Afternoon pass', time: '14:25' },
                    ]} />
                  </div>
                </div>
              </div>
            )}

            {/* About us */}
            <AboutSection />

            {/* Contact us */}
            <ContactSection />

            {/* Bottom brand marker */}
            <div className="pb-6 text-left">
              <span className="inline-block text-white/80 text-xs tracking-widest uppercase px-2 py-1 bg-black/20 rounded-md backdrop-blur">
                Zytherion Biovance
              </span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
