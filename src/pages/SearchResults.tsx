import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import SettingsSheet from '@/components/SettingsSheet';
import { Settings } from 'lucide-react';

const TABS: Array<{ key: string; label: string }> = [
	{ key: 'all', label: 'All' },
	{ key: 'images', label: 'Images' },
	{ key: 'videos', label: 'Videos' },
	{ key: 'news', label: 'News' },
	{ key: 'maps', label: 'Maps' },
];

const TIME_FILTERS: Array<{ key: string; label: string }> = [
	{ key: 'any', label: 'Any time' },
	{ key: '24h', label: 'Past 24 hours' },
	{ key: 'week', label: 'Past week' },
	{ key: 'year', label: 'Past year' },
];

const DOMAIN_POOL = [
	'example.org',
	'nature.org',
	'planetdata.io',
	'wildwatch.net',
	'climatehub.ai',
];

const makeResults = (q: string, type: string, offset: number) =>
	Array.from({ length: 10 }).map((_, i) => {
		const idx = offset + i + 1;
		const domain = DOMAIN_POOL[(offset + i) % DOMAIN_POOL.length];
		const href = `https://${domain}/search?q=${encodeURIComponent(q)}&n=${idx}`;
		return {
			id: `r-${idx}`,
			title: `${q || 'Result'} — ${type.toUpperCase()} ${idx}`,
			url: href,
			domain,
			displayUrl: `${domain}/…`,
			snippet: 'A concise, relevant summary for this result. Replace with server-provided snippet for higher fidelity.',
			site: domain.replace(/\..*$/, ''),
			date: 'Today',
			thumb: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=60&w=${420 + i * 15}&auto=format&fit=crop`,
			duration: `${3 + (i % 6)}:${String(10 + (i * 7) % 50).padStart(2, '0')}`,
		};
	});

const PAA_QUESTIONS = [
	'What is the most biodiverse rainforest?',
	'How does deforestation impact climate change?',
	'Which species are endangered in the Amazon?',
	'What are the latest conservation efforts?'
];

const RELATED = ['forest coverage map', 'endangered species list', 'rainforest facts', 'climate action', 'satellite imagery'];

const SearchResults: React.FC = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const q = params.get('q')?.trim() || '';
	const t = (params.get('t') || 'all').toLowerCase();
	const page = Math.max(1, Number(params.get('page') || 1));
	const safe = params.get('safe') === '0' ? 0 : 1;
	const time = (params.get('time') || 'any').toLowerCase();

	const results = useMemo(() => makeResults(q, t, (page - 1) * 10), [q, t, page]);
	const resultCount = useMemo(() => 12800 + (q.length * 37), [q]);

	const onSearch = (query: string) => {
		if (!query) return;
		navigate(`/search/results?q=${encodeURIComponent(query)}&t=${encodeURIComponent(t)}&page=1&safe=${safe}&time=${time}`);
	};

	const setTab = (tab: string) => {
		navigate(`/search/results?q=${encodeURIComponent(q)}&t=${encodeURIComponent(tab)}&page=1&safe=${safe}&time=${time}`);
	};

	const goPage = (p: number) => {
		navigate(`/search/results?q=${encodeURIComponent(q)}&t=${encodeURIComponent(t)}&page=${p}&safe=${safe}&time=${time}`);
	};

	const setTime = (next: string) => {
		navigate(`/search/results?q=${encodeURIComponent(q)}&t=${encodeURIComponent(t)}&page=1&safe=${safe}&time=${next}`);
	};

	const [localSafe, setLocalSafe] = useState<boolean>(safe === 1);
	useEffect(() => { setLocalSafe(safe === 1); }, [safe]);
	useEffect(() => {
		const nextSafe = localSafe ? 1 : 0;
		navigate(`/search/results?q=${encodeURIComponent(q)}&t=${encodeURIComponent(t)}&page=${page}&safe=${nextSafe}&time=${time}`);
		try { localStorage.setItem('safeSearch', JSON.stringify(localSafe)); } catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localSafe]);

	const [openPaa, setOpenPaa] = useState<number | null>(null);

	return (
		<div className="min-h-screen bg-white text-gray-800">
			{/* Sticky header */}
			<div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
					{/* Brand left */}
					<div className="min-w-[140px]">
						<Link to="/search" className="font-extrabold tracking-tight text-lg md:text-xl text-gray-900">Zytherion Biovance</Link>
					</div>
					{/* Center search */}
					<div className="flex-1 max-w-3xl">
						<SearchBar
							onSearch={onSearch}
							className="w-full bg-white border border-gray-300 rounded-full px-6 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
							buttonClassName="bg-transparent text-gray-600 hover:bg-gray-100 rounded-full"
						/>
					</div>
					{/* Right controls */}
					<div className="min-w-[200px] flex items-center justify-end gap-3">
						<label className="flex items-center gap-2 text-xs text-gray-700">
							<span>Safe Search</span>
							<input
								type="checkbox"
								checked={localSafe}
								onChange={(e) => setLocalSafe(e.target.checked)}
								className="h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-blue-600 relative transition-colors cursor-pointer"
								aria-label="Safe Search"
							/>
						</label>
						<SettingsSheet>
							<button aria-label="Settings" className="h-10 w-10 grid place-items-center rounded-full border border-gray-300 text-gray-800 hover:bg-white">
								<Settings className="h-5 w-5" />
							</button>
						</SettingsSheet>
					</div>
				</div>
				{/* Tabs row */}
				<div className="mx-auto max-w-6xl px-4 pb-2">
					<div className="flex items-center gap-3 text-sm text-gray-600">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setTab(tab.key)}
								className={`px-3 py-2 rounded-full ${t === tab.key ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
							>
								{tab.label}
							</button>
						))}
					</div>
					{/* Filters row */}
					<div className="mt-2 flex items-center gap-2 text-xs">
						<span className="text-gray-600">Time:</span>
						{TIME_FILTERS.map(f => (
							<button key={f.key} onClick={() => setTime(f.key)} className={`px-2.5 py-1 rounded-full border ${time === f.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{f.label}</button>
						))}
						<span className="ml-auto text-gray-500">About {resultCount.toLocaleString()} results (0.{(q.length % 9) + 12}s){time !== 'any' ? ` • ${TIME_FILTERS.find(x => x.key === time)?.label}` : ''}</span>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left: results */}
				<div className="lg:col-span-8">
					{t === 'images' ? (
						/* Images grid */
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{results.map((r) => (
								<div key={r.id} className="group rounded-lg overflow-hidden bg-gray-100">
									<div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${r.thumb})` }} />
									<div className="px-2 py-1 text-[12px] text-gray-700 truncate">{r.site}</div>
								</div>
							))}
						</div>
					) : t === 'videos' ? (
						/* Videos grid */
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{results.map((r) => (
								<a key={r.id} href={r.url} className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden">
									<div className="relative">
										<div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${r.thumb})` }} />
										<span className="absolute bottom-2 right-2 text-[11px] px-1.5 py-0.5 rounded bg-black/80 text-white">{r.duration}</span>
									</div>
									<div className="p-3">
										<div className="text-sm text-gray-500">{r.displayUrl}</div>
										<div className="mt-1 text-base font-semibold text-gray-900 line-clamp-2">{r.title}</div>
									</div>
								</a>
							))}
						</div>
					) : t === 'news' ? (
						/* News list */
						<div className="grid gap-4">
							{results.map((r) => (
								<a key={r.id} href={r.url} className="rounded-xl border bg-white p-4 hover:shadow-sm transition block">
									<div className="text-xs text-gray-500">{r.site} · {r.date}</div>
									<div className="mt-1 text-lg font-semibold text-gray-900">{r.title}</div>
									<p className="mt-1 text-[15px] text-gray-700">{r.snippet}</p>
								</a>
							))}
						</div>
					) : t === 'maps' ? (
						/* Maps placeholder */
						<div className="rounded-xl border bg-white overflow-hidden">
							<div className="h-64 bg-[linear-gradient(135deg,#e5e7eb_25%,transparent_25%),linear-gradient(225deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(315deg,#e5e7eb_25%,#fff_25%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]" />
							<div className="p-4">
								<div className="text-sm text-gray-500">Map preview (connect real map SDK here)</div>
								<div className="mt-2 grid md:grid-cols-2 gap-2 text-sm">
									<div>Nearest parks · 1.2km</div>
									<div>Traffic: Light</div>
									<div>Weather: Clear</div>
									<div>POIs: 12</div>
								</div>
							</div>
						</div>
					) : (
						/* Default web results with enhancements */
						<>
							<div className="text-sm text-gray-500 mb-3">Showing results for <span className="text-gray-900 font-medium">{q || 'Search'}</span></div>
							<div className="grid gap-6">
								{results.map((r, idx) => (
									<div key={r.id} className="group">
										<div className="flex items-center gap-2 text-xs text-gray-500">
											<img alt="favicon" className="h-4 w-4 rounded" src={`https://www.google.com/s2/favicons?sz=64&domain=${r.domain}`} />
											<span>{r.displayUrl} · {r.date}</span>
										</div>
										<a href={r.url} className="mt-1 block text-xl leading-snug text-blue-700 hover:underline">
											{r.title}
										</a>
										<p className="mt-1 text-[15px] text-gray-700">{r.snippet}</p>
										{idx === 0 && (
											/* People also ask */
											<div className="mt-4 rounded-xl border bg-white">
												<div className="px-4 py-3 text-sm font-semibold text-gray-900">People also ask</div>
												<div className="divide-y">
													{PAA_QUESTIONS.map((qst, i) => (
														<div key={i} className="px-4 py-3">
															<button onClick={() => setOpenPaa(openPaa === i ? null : i)} className="w-full text-left text-sm text-gray-900 hover:text-blue-700">
																{qst}
															</button>
															{openPaa === i && (
																<p className="mt-2 text-sm text-gray-700">Quick answer preview. Replace with real snippet.</p>
															)}
														</div>
													))}
												</div>
											</div>
										)}
										<div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
											<button className="hover:text-gray-700">About this result</button>
											<span>·</span>
											<button className="hover:text-gray-700">Share</button>
											<span>·</span>
											<button className="hover:text-gray-700">Cached</button>
										</div>
									</div>
								))}
							</div>
						</>
					)}

					{/* Pagination */}
					<div className="mt-6 flex items-center gap-2 text-sm">
						<button onClick={() => goPage(Math.max(1, page - 1))} className="px-3 py-1 rounded border bg-white hover:bg-gray-50">Prev</button>
						<span className="text-gray-600">Page {page}</span>
						<button onClick={() => goPage(page + 1)} className="px-3 py-1 rounded border bg-white hover:bg-gray-50">Next</button>
					</div>

					{/* Related searches */}
					<div className="mt-6">
						<div className="text-sm text-gray-500 mb-2">Related searches</div>
						<div className="flex flex-wrap gap-2">
							{RELATED.map((rs) => (
								<button key={rs} onClick={() => onSearch(rs)} className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm">{rs}</button>
							))}
						</div>
					</div>
				</div>

				{/* Right: knowledge panel */}
				<aside className="lg:col-span-4">
					<div className="sticky top-28">
						<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
							<div className="h-40 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop)' }} />
							<div className="p-4">
								<div className="text-sm text-gray-500">Quick info</div>
								<div className="text-lg font-semibold text-gray-900">{q || 'Topic'}</div>
								<div className="mt-3 grid gap-2 text-sm text-gray-700">
									<div><span className="font-medium">Category:</span> {t.charAt(0).toUpperCase() + t.slice(1)}</div>
									<div><span className="font-medium">Relevance:</span> High</div>
									<div><span className="font-medium">Updated:</span> Today</div>
								</div>
								<div className="mt-4 flex flex-wrap items-center gap-2">
									<button className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm">Overview</button>
									<button className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm">News</button>
									<button className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm">Images</button>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default SearchResults;