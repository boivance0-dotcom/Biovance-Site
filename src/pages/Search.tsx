import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import AllInOneNavbar, { type SearchType } from '@/components/AllInOneNavbar';

const BG: Record<'nature' | 'wildlife', string> = {
	nature: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=90&w=3840&h=2160&fit=crop&auto=format',
	wildlife: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=90&w=3840&h=2160&fit=crop&auto=format',
};

const SUGGESTIONS = ['rainforest', 'wildlife migration', 'climate change', 'biodiversity', 'ocean currents'];

const Search: React.FC = () => {
	const navigate = useNavigate();
  const [params] = useSearchParams();
  const qParam = params.get('q') || '';

	const [safeSearch, setSafeSearch] = useState<boolean>(() => {
		try { const v = localStorage.getItem('safeSearch'); return v ? JSON.parse(v) : true; } catch { return true; }
	});
	const [theme, setTheme] = useState<'nature' | 'wildlife'>('nature');
	const [type, setType] = useState<SearchType>('all');
	const bgUrl = useMemo(() => BG[theme], [theme]);

	useEffect(() => { try { localStorage.setItem('safeSearch', JSON.stringify(safeSearch)); } catch {} }, [safeSearch]);

	const handleSearch = (query: string) => {
		if (!query) return;
		navigate(`/search/results?q=${encodeURIComponent(query)}&t=${encodeURIComponent(type)}&page=1&safe=${safeSearch ? '1' : '0'}`);
	};

	return (
		<div className="relative min-h-screen bg-white">
			<AllInOneNavbar selectedType={type} onTypeChange={setType} safeSearch={safeSearch} onSafeSearchChange={setSafeSearch} />

			{/* Aesthetic background */}
			<div className="fixed-bg hero-image-filter" style={{ backgroundImage: `url(${bgUrl})`, zIndex: 0 as unknown as number }} aria-hidden />
			<div className="hero-gradient-top" />
			<div className="hero-gradient-bottom" />
			<div className="hero-vignette" />

			{/* Page content */}
			<div className="relative z-10 container mx-auto px-6 pt-28 pb-16">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">DNS Discovery</h1>
					<p className="mt-2 text-white/85">Enhanced, fast, and focused — switch categories and search your world.</p>

					<div className="mt-6">
						<SearchBar
							onSearch={handleSearch}
							className="w-full bg-white border border-gray-300 text-black placeholder:text-gray-400 rounded-full px-6 py-4 shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
							buttonClassName="text-gray-700 hover:text-black bg-transparent hover:bg-gray-100 rounded-full"
						/>
						{qParam && <div className="mt-2 text-white/80 text-sm">Last query: "{qParam}"</div>}
					</div>

					<div className="mt-4 flex items-center justify-center gap-2 text-xs">
						<span className="text-white/80">Background:</span>
						<button onClick={() => setTheme('nature')} className={`px-3 py-1 rounded-full border ${theme === 'nature' ? 'bg-white/90 text-black border-white' : 'bg-black/30 text-white/85 border-white/20'}`}>Nature</button>
						<button onClick={() => setTheme('wildlife')} className={`px-3 py-1 rounded-full border ${theme === 'wildlife' ? 'bg-white/90 text-black border-white' : 'bg-black/30 text-white/85 border-white/20'}`}>Wildlife</button>
					</div>

					<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
						{SUGGESTIONS.map((s) => (
							<button key={s} onClick={() => handleSearch(s)} className="px-3 py-1 rounded-full bg-black/35 border border-white/15 text-white/90 hover:bg-black/45">{s}</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;