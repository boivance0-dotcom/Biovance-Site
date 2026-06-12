import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import SettingsSheet from '@/components/SettingsSheet';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/context/AuthContext';

const SLUG_TITLE: Record<string, string> = {
  nature: 'Nature AI',
  forest: 'Forest AI',
  wildlife: 'Wildlife AI',
  climate: 'Climate AI',
  marine: 'Marine AI',
  research: 'Research AI',
  career: 'Career AI',
  education: 'Education AI',
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, signIn, signOut } = useAuth();

  const aiMatch = location.pathname.match(/^\/ai\/([^/]+)/);
  const pathAISlug = aiMatch ? aiMatch[1] : undefined;
  const queryAISlug = new URLSearchParams(location.search).get('ai') || undefined;
  const currentAISlug = (pathAISlug || queryAISlug || 'forest').toLowerCase();

  const brandTitle = SLUG_TITLE[currentAISlug] || 'Forest AI';
  const brandInitials = brandTitle
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (query: string) => {
    if (!query) return;
    const ai = currentAISlug || 'forest';
    navigate(`/results?q=${encodeURIComponent(query)}&ai=${encodeURIComponent(ai)}`);
  };

  const goBack = () => navigate(-1);

  return (
    <header
      className={"fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"}
      role="banner"
    >
      <nav
        className={"mx-auto max-w-7xl flex items-center justify-between gap-3 px-4 md:px-8 h-16"}
        aria-label="Primary"
      >
        {/* Left: Back + Brand */}
        <div className="flex items-center gap-2">
          <button onClick={goBack} aria-label="Go back" className="h-10 w-10 grid place-items-center rounded-full border border-white/30 text-white/90 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to={`/ai/${currentAISlug}`} className="flex items-center gap-3 rounded hover:opacity-90 focus-visible:underline" >
            <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
              {brandInitials}
            </div>
            <span className="text-white/95 font-semibold tracking-wide hidden sm:inline">{brandTitle}</span>
            <span className="sr-only">{brandTitle} Home</span>
          </Link>
        </div>

        {/* Center: Global Search (always visible) */}
        <div className="flex-1 block">
          <div className="max-w-xl mx-auto">
            <SearchBar onSearch={handleSearch} className="search-input" buttonClassName="search-button" />
          </div>
        </div>

        {/* Right: Links + Settings + Auth toggle */}
        <div className="flex items-center justify-end gap-3 md:gap-6 text-[14px] tracking-[0.08em] uppercase">
          <span className={`hidden md:inline px-2 py-0.5 rounded-full border text-[11px] ${isLoggedIn ? 'text-white/90 border-white/30 bg-white/10' : 'text-black'} `} style={!isLoggedIn ? { backgroundColor: '#ffdd55', borderColor: '#00000022' } : undefined}>
            {isLoggedIn ? 'Private' : 'Demo'}
          </span>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-white/80 hover:text-white/100 transition-colors rounded px-1">Log in</Link>
              <button onClick={signIn} className="hidden md:inline text-white/80 hover:text-white/100 transition-colors rounded px-1">Mock Sign In</button>
            </>
          ) : (
            <button onClick={signOut} className="text-white/80 hover:text-white/100 transition-colors rounded px-1">Sign Out</button>
          )}
          <a href="#about" className="hidden md:inline text-white/80 hover:text-white/100 transition-colors rounded px-1">About us</a>
          <a href="#contact" className="hidden md:inline text-white/80 hover:text-white/100 transition-colors rounded px-1">Contact</a>
          <SettingsSheet>
            <button aria-label="Settings" className="h-10 w-10 grid place-items-center rounded-full border border-white/30 text-white/90 hover:text-white hover:bg-white/10 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </SettingsSheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;