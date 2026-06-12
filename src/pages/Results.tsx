import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import ResultRichItem from '@/components/results/ResultRichItem';
import { useAuth } from '@/context/AuthContext';
import { Fish, Leaf, CloudSun, BookOpen, Briefcase, GraduationCap, PawPrint } from 'lucide-react';

// Backend dev note:
// - This page is wired for API integration. See the following locations:
//   1) Sticky bar: call performSearch(q, filters, page, isPrivate) and set list items
//   2) List items: render from API response items (title, snippet, url, source, thumb)
//   3) Modal tabs: hydrate Map/Media using data-* attributes
//   4) Use parseFilters(URLSearchParams) to build server filter params

const bgMap: Record<string, { url: string; accent: string; heading: string; blurb: string; theme: string }> = {
	nature: { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#86C232', heading: 'Nature Results', blurb: 'Curated nature intelligence and discoveries.', theme: 'forest' },
	forest: { url: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/refs/heads/main/forest.jpg', accent: '#86C232', heading: 'Forest Results', blurb: 'Forest health, conservation, and monitoring insights.', theme: 'forest' },
	wildlife: { url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#5C4033', heading: 'Wildlife Results', blurb: 'Species tracking, biodiversity, and habitat updates.', theme: 'wildlife' },
	climate: { url: 'https://raw.githubusercontent.com/varunsingh3545/search-engine/main/climate.jpg', accent: '#4DB6E2', heading: 'Climate Results', blurb: 'Trends, projections, and renewable transitions.', theme: 'climate' },
	marine: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#00B8D9', heading: 'Marine Results', blurb: 'Ocean health, coral status, and marine activity.', theme: 'marine' },
	research: { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#2196F3', heading: 'Research Results', blurb: 'Papers, datasets, and field study findings.', theme: 'research' },
	career: { url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#FFC107', heading: 'Career Results', blurb: 'Roles, skills, and opportunities in sustainability.', theme: 'career' },
	education: { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=90&w=3840&h=2160&fit=crop&auto=format', accent: '#1976D2', heading: 'Education Results', blurb: 'Courses, tutorials, and learning resources.', theme: 'education' },
};

const THEME_CFG: Record<string, { tint: string; icon: React.ReactNode; chips: string[] }> = {
  wildlife: { tint: 'bg-[rgba(35,24,12,0.65)]', icon: <PawPrint className="w-6 h-6" />, chips: ['camera trap', 'migration', 'endangered'] },
  climate: { tint: 'bg-[rgba(10,20,28,0.65)]', icon: <CloudSun className="w-6 h-6" />, chips: ['AQI', 'CO₂', 'forecast'] },
  marine: { tint: 'bg-[rgba(8,18,30,0.6)]', icon: <Fish className="w-6 h-6" />, chips: ['SST', 'reef', 'currents'] },
  forest: { tint: 'bg-[rgba(7,16,12,0.65)]', icon: <Leaf className="w-6 h-6" />, chips: ['deforestation', 'carbon', 'satellite'] },
  research: { tint: 'bg-[rgba(18,20,28,0.7)]', icon: <BookOpen className="w-6 h-6" />, chips: ['papers', 'citations', 'trends'] },
  career: { tint: 'bg-[rgba(14,20,34,0.7)]', icon: <Briefcase className="w-6 h-6" />, chips: ['jobs', 'skills', 'demand'] },
  education: { tint: 'bg-[rgba(16,18,20,0.7)]', icon: <GraduationCap className="w-6 h-6" />, chips: ['courses', 'progress', 'skill map'] },
  nature: { tint: 'bg-[rgba(7,16,12,0.65)]', icon: <Leaf className="w-6 h-6" />, chips: ['ecosystem', 'wellbeing'] },
};

const SidebarWidgets: React.FC<{ ai: string; accent: string }> = ({ ai, accent }) => {
	return (
		<aside className="lg:col-span-1">
			<div className="sticky top-20 grid gap-4">
				{/* Example themed widget */}
				<div className={`rounded-xl p-4 ${THEME_CFG[ai]?.tint || 'bg-black/40'} border border-white/10`}>
					<h4 className="text-white/90 font-semibold inline-flex items-center gap-2">{THEME_CFG[ai]?.icon} <span>Highlights</span></h4>
					<div className="mt-2 text-white/75 text-sm">AI-specific quick stats and links</div>
				</div>
				{/* AI-specific widgets placeholders (ready for backend) */}
				{ai === 'wildlife' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Species Tracker</h4>
						<div className="mt-2 text-white/75 text-sm">Top sightings today. <span className="text-white/60 text-xs">(data: /api/wildlife/species)</span></div>
					</div>
				)}
				{ai === 'climate' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Climate Indicators</h4>
						<div className="mt-2 text-white/75 text-sm">AQI, CO₂, temp. <span className="text-white/60 text-xs">(data: /api/climate/indicators)</span></div>
					</div>
				)}
				{ai === 'marine' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Marine Conditions</h4>
						<div className="mt-2 text-white/75 text-sm">SST, waves. <span className="text-white/60 text-xs">(data: /api/marine/conditions)</span></div>
					</div>
				)}
				{ai === 'forest' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Coverage & Biodiversity</h4>
						<div className="mt-2 text-white/75 text-sm">Coverage %, index. <span className="text-white/60 text-xs">(data: /api/forest/indices)</span></div>
					</div>
				)}
				{ai === 'research' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Trending Topics</h4>
						<div className="mt-2 text-white/75 text-sm">Keywords, authors. <span className="text-white/60 text-xs">(data: /api/research/trending)</span></div>
					</div>
				)}
				{ai === 'career' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Top Hiring</h4>
						<div className="mt-2 text-white/75 text-sm">Companies, roles. <span className="text-white/60 text-xs">(data: /api/career/hiring)</span></div>
					</div>
				)}
				{ai === 'education' && (
					<div className="rounded-xl p-4 bg-black/40 border border-white/10">
						<h4 className="text-white/90 font-semibold">Progress & Skills</h4>
						<div className="mt-2 text-white/75 text-sm">Tracker, heatmap. <span className="text-white/60 text-xs">(data: /api/education/progress)</span></div>
					</div>
				)}
			</div>
		</aside>
	);
};

const Results: React.FC = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	const query = params.get('q')?.trim() || '';
	const aiParam = (params.get('ai') || 'forest').toLowerCase();
	const theme = bgMap[aiParam] || bgMap.forest;

	const [items, setItems] = useState<any[]>(() =>
		Array.from({ length: 12 }).map((_, i) => ({
			id: `r-${i}`,
			type: (['project', 'wildlife', 'alert', 'research'] as any[])[i % 4],
			title: `Result ${i + 1}: ${query || 'Insight'}`,
			description: 'Concise summary with high signal, tailored to the selected AI context.',
			location: ['Amazon', 'Congo Basin', 'Sumatra', 'Borneo'][i % 4],
			health: (['healthy', 'stressed', 'critical'] as any[])[i % 3],
			confidence: 0.6 + (i % 5) * 0.08,
			endangered: i % 5 === 0,
		}))
	);

	const [showFilters, setShowFilters] = useState(false);
	const [activeItem, setActiveItem] = useState<any | null>(null);
	const [modalTab, setModalTab] = useState<'overview' | 'map' | 'media'>('overview');

	const handleSearch = (next: string) => {
		if (!next) return;
		navigate(`/results?q=${encodeURIComponent(next)}&ai=${encodeURIComponent(aiParam)}`);
	};

	const loadMore = () => {
		const start = items.length;
		const more = Array.from({ length: 9 }).map((_, i) => ({
			id: `r-${start + i}`,
			type: (['project', 'wildlife', 'alert', 'research'] as any[])[(start + i) % 4],
			title: `Result ${start + i + 1}: ${query || 'Insight'}`,
			description: 'Additional relevant data appended seamlessly as you scroll.',
			location: ['Amazon', 'Congo Basin', 'Sumatra', 'Borneo'][(start + i) % 4],
			health: (['healthy', 'stressed', 'critical'] as any[])[(start + i) % 3],
			confidence: 0.6 + ((start + i) % 5) * 0.08,
			endangered: (start + i) % 5 === 0,
		}));
		setItems((prev) => [...prev, ...more]);
	};

	const [page, setPage] = useState(1);

	// Backend dev note:
	// Replace the mock items below with the server response from /api/search.
	// Keep the shape compatible with ResultRichItem: { title, description, url, source, thumbUrl }.
	const makeThumb = (i: number) => `https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=60&w=${500 + i * 20}&auto=format&fit=crop`;

	return (
		<div className="relative z-10 min-h-screen">
			<div className="relative min-h-[60vh] overflow-hidden">
				{/* Themed AI background (no blur) */}
				<div
					className="fixed-bg hero-image-filter"
					style={{ backgroundImage: `url(${theme.url})`, zIndex: 0 as unknown as number }}
					aria-hidden
				/>
				{/* Subtle theme tint overlay */}
				<div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(1200px_800px_at_10%_10%, ${theme.accent}10, transparent 60%), radial-gradient(1000px_700px_at_90%_30%, ${theme.accent}12, transparent 55%)` }} />
				<div className="hero-gradient-top" />
				<div className="hero-gradient-bottom" />
				<div className="hero-vignette" />

				<div className="relative z-10 container mx-auto px-6 py-10 md:py-14">
					{/* Sticky search/filters bar */}
					<div className="sticky top-16 z-40 -mx-6 mb-6 px-6 py-3 bg-[rgba(7,16,12,0.7)] backdrop-blur-md border border-white/10 rounded-xl">
						<div className="flex flex-wrap items-center gap-3 justify-between">
							<div className="min-w-[260px] flex-1 max-w-xl">
								<SearchBar onSearch={handleSearch} className="search-input" buttonClassName="search-button" />
							</div>
							<div className="flex items-center gap-2 text-xs text-white/80">
								<button onClick={() => setShowFilters((v) => !v)} className="px-3 py-1 rounded bg-white/10 border border-white/15">
									{showFilters ? 'Hide Filters' : 'Show Filters'}
								</button>
								<span className="px-2 py-1 rounded bg-white/10 border border-white/15">Relevance</span>
								<span className="px-2 py-1 rounded bg-white/10 border border-white/15">Latest</span>
								<span className="px-2 py-1 rounded bg-white/10 border border-white/15">Priority</span>
							</div>
						</div>
						{showFilters && (
							<div className="mt-3 rounded-lg p-3 bg-black/30 border border-white/10 text-white/80 text-sm">
								{/* filters UI placeholder */}
								Filters here (ecosystem, zone, species, status)
							</div>
						)}
					</div>

					{/* Heading panel */}
					<div className="max-w-3xl mx-auto page-enter">
						<div className="rounded-xl bg-black/55 border border-white/15 backdrop-blur-sm px-4 md:px-6 py-4 text-center">
							<h1 className="hero-title-clean" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', color: theme.accent }}>
								{theme.heading} {isLoggedIn ? '' : '(Demo)'}
							</h1>
							<p className="mt-2 text-white/90 text-base md:text-lg">
								{query ? (
									<>
										Showing results for <span className="text-white font-semibold">"{query}"</span>
									</>
								) : (
									theme.blurb
								)}
							</p>
						</div>
					</div>

					{/* Backend dev note: center column shows search results. Populate from /api/search.
         Call performSearch(query, filters, page, isLoggedIn) and setItems with the response */}
					<div className="mt-6 mx-auto" style={{ width: 'min(1100px, 70vw)' }}>
						<div className="grid gap-4">
							{items.map((it, idx) => (
								<ResultRichItem
									key={it.id}
									item={it}
									onView={(it) => { setActiveItem(it); setModalTab('overview'); }}
									accentColor={theme.accent}
									url="#" // Backend dev: set this to the canonical URL from the result
									source={`${aiParam.toUpperCase()} • example.org`} // Backend dev: use domain/section
									date={`Today ${String(9 + (idx % 6)).padStart(2, '0')}:${String(10 + (idx % 5) * 5).padStart(2, '0')}`} // Backend dev: server-provided timestamp
									thumbUrl={makeThumb(idx)} // Backend dev: result.thumbnailUrl
									chips={THEME_CFG[aiParam]?.chips}
								/>
							))}
							{/* Pagination controls (Backend dev: use total/pages from /api/search) */}
							<div className="pt-2 flex items-center justify-center gap-2 text-sm">
								<button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-white/10 border border-white/15 text-white/85">Prev</button>
								<span className="text-white/80">Page {page}</span>
								<button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded bg-white/10 border border-white/15 text-white/85">Next</button>
							</div>
						</div>
					</div>

					{/* Modal remains */}
				</div>
			</div>

			{activeItem && (
				<div className="fixed inset-0 z-50 grid place-items-center">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveItem(null)} />
					<div className="relative z-10 w-[92%] max-w-3xl rounded-xl p-6 bg-[rgba(7,16,12,0.9)] border border-white/15 shadow-[0_24px_96px_rgba(0,0,0,0.6)]">
						<div className="flex items-center justify-between">
							<h3 className="text-white font-semibold text-lg" style={{ color: theme.accent }}>{activeItem.title}</h3>
							<button className="text-white/70 hover:text-white" onClick={() => setActiveItem(null)}>Close</button>
						</div>
						<p className="text-white/80 mt-2">{activeItem.description}</p>

						<div className="mt-4 flex items-center gap-2 text-xs">
							<button onClick={() => setModalTab('overview')} className={`px-2 py-1 rounded border ${modalTab === 'overview' ? 'bg-white/15 text-white border-white/25' : 'bg-white/10 text-white/80 border-white/15'}`}>Overview</button>
							<button onClick={() => setModalTab('map')} className={`px-2 py-1 rounded border ${modalTab === 'map' ? 'bg-white/15 text-white border-white/25' : 'bg-white/10 text-white/80 border-white/15'}`}>Map</button>
							<button onClick={() => setModalTab('media')} className={`px-2 py-1 rounded border ${modalTab === 'media' ? 'bg-white/15 text-white border-white/25' : 'bg-white/10 text-white/80 border-white/15'}`}>Media</button>
						</div>

						{modalTab === 'overview' && (
							<div className="mt-3 grid gap-3 text-sm text-white/85">
								<div className="grid grid-cols-2 gap-3">
									<div className="rounded bg-black/30 border border-white/10 px-3 py-2">Type: <span className="font-semibold capitalize">{activeItem.type}</span></div>
									<div className="rounded bg-black/30 border border-white/10 px-3 py-2">Health: <span className="font-semibold capitalize">{activeItem.health}</span></div>
									<div className="rounded bg-black/30 border border-white/10 px-3 py-2">Location: <span className="font-semibold">{activeItem.location || 'Unknown'}</span></div>
									<div className="rounded bg-black/30 border border-white/10 px-3 py-2">Confidence: <span className="font-semibold">{Math.round((activeItem.confidence ?? 0.9) * 100)}%</span></div>
								</div>
								<div className="rounded bg-black/30 border border-white/10 px-3 py-3">
									<div className="text-white/70 text-xs mb-1">Ready for backend</div>
									<pre className="text-[11px] text-white/80 overflow-auto">
									{JSON.stringify({
										endpoint: '/api/results/:id',
										resultId: activeItem.id,
										params: { include: ['geometry', 'media', 'metrics'] },
									}, null, 2)}
									</pre>
								</div>
							</div>
						)}

						{modalTab === 'map' && (
							<div className="mt-3 relative">
								<div
									id="result-map"
									className="h-48 md:h-64 rounded-lg bg-black/30 border border-white/10"
									data-endpoint="/api/results/:id/geometry"
									data-result-id={activeItem.id}
									data-location={activeItem.location || ''}
								/>
								{!isLoggedIn && (
									<div className="absolute inset-0 grid place-items-center rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
										<div className="text-center text-white/90 text-xs">
											Public preview — sign in for interactive map
										</div>
									</div>
								)}
								<div className="mt-2 text-white/70 text-xs">This container is ready for Mapbox/Leaflet. Use the data-* attributes above.</div>
							</div>
						)}

						{modalTab === 'media' && (
							<div className="mt-3 grid gap-3 md:grid-cols-2">
								<div className="relative rounded-lg overflow-hidden bg-black/30 border border-white/10">
									<div className="aspect-video bg-white/5 grid place-items-center text-white/60 text-xs"
										data-endpoint="/api/results/:id/media"
										data-result-id={activeItem.id}
									>
										Media placeholder (image/video)
									</div>
									{!isLoggedIn && (
										<div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm border border-white/10">
											<div className="text-center text-white/90 text-xs">Public preview — sign in for high‑res media</div>
										</div>
									)}
								</div>
								<div className="rounded-lg overflow-hidden bg-black/30 border border-white/10">
									<div className="p-3 text-white/80 text-sm">
										Random notes: high canopy density; signs of regrowth; low fire risk. Attach richer metadata from backend here.
									</div>
								</div>
							</div>
						)}

						<div className="mt-4 flex items-center gap-3">
							<button className="px-3 py-2 rounded-md bg-white text-black text-sm font-semibold">Contribute Data</button>
							<button className="px-3 py-2 rounded-md text-black text-sm font-semibold" style={{ backgroundColor: theme.accent }}>Add Observation</button>
							<div className="hidden" data-endpoint="/api/results/:id" data-result-id={activeItem.id} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Results;