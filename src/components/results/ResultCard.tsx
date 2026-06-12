import React from 'react';
import { MapPin, Leaf, Activity, BookOpen, Camera, Shield, Lock } from 'lucide-react';

export type ResultType = 'project' | 'wildlife' | 'alert' | 'research';
export type HealthStatus = 'healthy' | 'stressed' | 'critical';

const STATUS_BORDER: Record<HealthStatus, string> = {
	healthy: 'border-[#3CB371]/60',
	stressed: 'border-[#F0AD4E]/60',
	critical: 'border-[#E15241]/70',
};

const TYPE_ICON: Record<ResultType, React.ReactNode> = {
	project: <Shield className="w-4 h-4" />,
	wildlife: <Camera className="w-4 h-4" />,
	alert: <Activity className="w-4 h-4" />,
	research: <BookOpen className="w-4 h-4" />,
};

export interface ResultItem {
	id: string;
	type: ResultType;
	title: string;
	description: string;
	location?: string;
	health?: HealthStatus;
	confidence?: number; // 0..1
	endangered?: boolean;
}

const themeStyles: Record<string, { base: string; microBg?: string }> = {
	forest: {
		base: 'bg-[rgba(7,16,12,0.65)]',
		microBg: "bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=60&w=1200&auto=format&fit=crop')]",
	},
	wildlife: {
		base: 'bg-[rgba(25,18,12,0.7)]',
		microBg: "bg-[url('https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=60&w=1200&auto=format&fit=crop')]",
	},
	climate: {
		base: 'bg-[rgba(10,20,28,0.6)] backdrop-saturate-[1.2] border-white/20',
		microBg: "bg-[radial-gradient(circle_at_30%_20%,rgba(77,182,226,0.12),transparent_60%)]",
	},
	marine: {
		base: 'bg-white/8 backdrop-blur-xl border-white/20',
		microBg: "bg-[radial-gradient(600px_400px_at_80%_70%,rgba(0,184,217,0.18),transparent_60%)]",
	},
	research: {
		base: 'bg-[rgba(20,22,28,0.7)]',
		microBg: "bg-[radial-gradient(400px_300px_at_15%_20%,rgba(33,150,243,0.16),transparent_60%)]",
	},
	career: {
		base: 'bg-[rgba(14,20,34,0.7)]',
		microBg: "bg-[radial-gradient(400px_300px_at_80%_15%,rgba(255,193,7,0.16),transparent_60%)]",
	},
	education: {
		base: 'bg-[rgba(16,18,20,0.7)]',
		microBg: "bg-[radial-gradient(400px_300px_at_30%_80%,rgba(25,118,210,0.16),transparent_60%)]",
	},
};

const ResultCard: React.FC<{ item: ResultItem; onView: (item: ResultItem) => void; accentColor?: string; theme?: string; isLocked?: boolean }>
= ({ item, onView, accentColor = '#86C232', theme = 'forest', isLocked = false }) => {
	const confidencePct = Math.round((item.confidence ?? 0.9) * 100);
	const border = STATUS_BORDER[item.health ?? 'healthy'];
	const themeBase = themeStyles[theme]?.base || themeStyles.forest.base;
	const microBg = themeStyles[theme]?.microBg || themeStyles.forest.microBg;

	return (
		<article
			className={`group relative rounded-xl p-5 ${themeBase} border ${border} shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md hover:shadow-[0_24px_72px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-2 overflow-hidden`}
			style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.45)` }}
		>
			<div className={`pointer-events-none absolute -inset-6 ${microBg} bg-center bg-cover opacity-0 group-hover:opacity-[0.08] scale-110 blur-md transition-all`} />

			<div className="relative z-10 flex items-center gap-2 text-white/90 text-xs">
				<span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/40 border border-white/10">
					{TYPE_ICON[item.type]}
					<span className="capitalize">{item.type}</span>
				</span>
				{item.endangered && (
					<span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 border border-red-400/40 text-red-200">
						<Leaf className="w-3 h-3" /> Endangered
					</span>
				)}
			</div>

			<h3 className="relative z-10 text-white font-semibold text-lg leading-snug mt-3">
				{item.title}
			</h3>
			<p className="relative z-10 text-white/75 mt-2 text-sm leading-relaxed line-clamp-2">
				{item.description}
			</p>

			<div className="relative z-10 mt-3 flex items-center justify-between text-xs text-white/75">
				<div className="flex items-center gap-2">
					{item.location && (
						<span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
					)}
					<span className="inline-flex items-center gap-1"><Activity className="w-3 h-3" /> {confidencePct}%</span>
				</div>
				<button
					onClick={() => onView(item)}
					className={`relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-md text-black text-xs font-semibold transition-opacity hover:opacity-90 ${isLocked ? 'opacity-70' : ''}`}
					style={{ backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}55` }}
				>
					{isLocked ? (<><Lock className="w-3 h-3" /> Sign in</>) : (item.type === 'alert' ? 'Monitor Area' : 'View Details')}
				</button>
			</div>

			{item.type === 'wildlife' && (
				<div className="pointer-events-none absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<span className="text-white/80 text-lg">🦜</span>
				</div>
			)}

			{isLocked && (
				<div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-[2px] border border-white/10 z-20 grid place-items-center">
					<div className="text-white/85 text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 border border-white/15"><Lock className="w-3 h-3" /> Private feature</div>
				</div>
			)}
		</article>
	);
};

export default ResultCard;