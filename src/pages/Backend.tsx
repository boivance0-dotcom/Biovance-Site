// Zytherion Biovance — Backend Platform (Digital Nervous System)
// Separate page from the public marketing/search site.
// Stack: React + TS + Tailwind + shadcn tokens + recharts + lucide-react (all already in project deps)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Database, Satellite, Radio, Video, Search as SearchIcon, FlaskConical,
  Bot, Upload, ShieldCheck, FolderTree, Settings2, DollarSign, Home, MessageSquare,
  ArrowLeft, AlertTriangle, CircleAlert, Info, Check, X, Plus,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';

/* ----------------------------------------------------------------------------
   Data
---------------------------------------------------------------------------- */
const NAV = {
  platform: [
    { id: 'dashboard', label: 'Live Dashboard', icon: Activity },
    { id: 'pipeline', label: 'Data Pipeline', icon: Database },
    { id: 'satellite', label: 'Satellite Feeds', icon: Satellite, badge: 'LIVE' },
    { id: 'safari', label: 'Live Safari', icon: Video, badge: '▶' },
    { id: 'fieldsync', label: 'Field Sync', icon: Radio, badge: '4' },
    { id: 'discovery', label: 'Discovery', icon: SearchIcon },
    { id: 'collab', label: 'Collaboration', icon: FlaskConical, badge: '3' },
    { id: 'predict', label: 'Intelligence', icon: Bot },
  ],
  data: [
    { id: 'submit', label: 'Submit Dataset', icon: Upload, action: 'modal' },
    { id: 'permissions', label: 'Permissions & Audit', icon: ShieldCheck },
    { id: 'datasets', label: 'My Datasets', icon: FolderTree, badge: '12' },
  ],
  system: [
    { id: 'techstack', label: 'Tech Stack', icon: Settings2 },
    { id: 'cost', label: 'Infrastructure Cost', icon: DollarSign },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, action: 'chat' },
    { id: 'home', label: 'Back to Site', icon: Home, action: 'home' },
  ],
};

const INGEST_24H = [120,180,210,160,90,110,200,280,350,290,240,310,380,420,360,300,340,410,470,390,310,360,430,480].map((v,i)=>({h:i,v}));
const ECO = [
  { name: 'Marine', value: 31, color: '#15803D' },
  { name: 'Desert', value: 22, color: '#D97706' },
  { name: 'Forest', value: 18, color: '#16A34A' },
  { name: 'Freshwater', value: 14, color: '#0D9488' },
  { name: 'Grassland', value: 9, color: '#22C55E' },
  { name: 'Coral', value: 6, color: '#DC2626' },
];
const PERM = [
  { name: 'Public', value: 74, color: '#22C55E' },
  { name: 'Restricted', value: 18, color: '#F59E0B' },
  { name: 'Private', value: 8, color: '#3B82F6' },
];
const COST_SCALE = [
  { users: '0', serverless: 200, traditional: 3500 },
  { users: '10K', serverless: 320, traditional: 3700 },
  { users: '25K', serverless: 600, traditional: 4200 },
  { users: '50K', serverless: 980, traditional: 5000 },
  { users: '100K', serverless: 1800, traditional: 6500 },
  { users: '250K', serverless: 3800, traditional: 10000 },
  { users: '500K', serverless: 7200, traditional: 17000 },
];
const SAT_VOL = [
  { name: 'NASA', gb: 142 }, { name: 'ESA', gb: 98 }, { name: 'USGS', gb: 34 },
  { name: 'NOAA', gb: 76 }, { name: 'Planet', gb: 51 },
];

const FEED_SEED = [
  { c: '#22C55E', o: 'AZ Game & Fish', d: 'Desert tortoise survey — 142 GPS observations uploaded', t: 'just now' },
  { c: '#14B8A6', o: 'NOAA Marine', d: 'SST satellite pass — Gulf thermal layer updated', t: '1m ago' },
  { c: '#F59E0B', o: 'Desert Research', d: 'Soil moisture sensors — 18 stations synced', t: '2m ago' },
  { c: '#3B82F6', o: 'USFS Region 6', d: 'Forest canopy LIDAR scan — 2.3 GB processed', t: '4m ago' },
  { c: '#EF4444', o: 'Coral Foundation', d: 'Florida Keys bleaching survey — 89 transect records', t: '6m ago' },
  { c: '#A855F7', o: 'Prairie Institute', d: 'Bison GPS collar data — 14 animals tracked', t: '8m ago' },
];
const FEED_EXTRA = [
  { c: '#22C55E', o: 'BLM California', d: 'Desert tortoise head-start — 23 releases logged' },
  { c: '#3B82F6', o: 'NOAA Fisheries', d: 'Columbia River salmon — hourly update processed' },
  { c: '#14B8A6', o: 'INPA Brazil', d: 'Amazon sector 7-G NDVI update — −3.2% canopy density' },
  { c: '#EF4444', o: 'FL Fish & Wildlife', d: 'Red tide bloom boundary — coordinates updated' },
];

const DISC = [
  { type: 'dataset', title: 'Sonoran Desert Reptile Population Survey', meta: '142 GPS records · Desert · Arizona', org: 'AZ Game & Fish', tags: ['GeoJSON','Species'], f: 'dataset desert' },
  { type: 'program', title: 'Gulf Coast Coral Reef Monitoring Network', meta: 'Active · 6 orgs · Open enrollment', org: 'NOAA Marine', tags: ['Ongoing'], f: 'program marine' },
  { type: 'volunteer', title: 'Pacific NW Trail Camera Survey', meta: 'June–Sept 2026 · Remote OK', org: 'USFS Region 6', tags: ['Wildlife'], f: 'volunteer forest' },
  { type: 'dataset', title: 'Great Lakes Water Quality — Q1 2026', meta: '18 stations · Real-time sensors', org: 'Freshwater Network', tags: ['Sensors'], f: 'dataset' },
  { type: 'research', title: 'White Shark Migration — Atlantic Cross-Study', meta: 'FL + CA + MA · 2024–2026', org: 'Marine Bio Consortium', tags: ['Sharks'], f: 'research marine' },
  { type: 'program', title: 'Arizona Pollinator Corridor Restoration', meta: 'Grant-funded · 4 counties', org: 'AZ Game & Fish', tags: ['Desert'], f: 'program desert' },
  { type: 'volunteer', title: 'Sea Turtle Nesting Monitoring — FL Keys', meta: 'May–Aug 2026 · 8 openings', org: 'Coral Foundation', tags: ['Turtles'], f: 'volunteer marine' },
  { type: 'dataset', title: 'Prairie Grassland NDVI 2010–2026', meta: '16 years · Landsat-8 · public domain', org: 'Prairie Institute', tags: ['Satellite'], f: 'dataset forest' },
  { type: 'research', title: 'Amazon Deforestation — INPA 2026', meta: '2,341 records · bi-weekly update', org: 'INPA Brazil', tags: ['Forest','NDVI'], f: 'research forest' },
  { type: 'dataset', title: 'Cascade Range Microseismic Events', meta: 'USGS + platform integration', org: 'USGS + Freshwater Net', tags: ['Seismic'], f: 'dataset' },
];

const RESEARCHERS = [
  { n: 'Dr. Sarah Chen', i: 'Florida Marine Institute', f: 'White shark migration · Atlantic tagging · ocean corridor mapping', av: 'SC', bg: '#15803D', orcid: '0000-0002-1234-5678', m: 97 },
  { n: 'Dr. Kenji Nakamura', i: 'Monterey Bay Aquarium Research', f: 'Pacific pelagics · ocean acidification · cross-hemisphere studies', av: 'KN', bg: '#1D4ED8', orcid: '0000-0002-8765-4321', m: 94 },
  { n: 'Dr. Amara Torres', i: 'UNAM — Instituto de Ecología', f: 'Sonoran reptile corridors · species displacement · climate migration', av: 'AT', bg: '#0D9488', orcid: '0000-0003-4567-8901', m: 89 },
  { n: 'Dr. James Okafor', i: 'NOAA Gulf Coast Science Center', f: 'Coral bleaching prediction · reef recovery · thermal stress modeling', av: 'JO', bg: '#1D4ED8', orcid: '0000-0001-9876-5432', m: 85 },
  { n: 'Dr. Lisa Petrov', i: 'University of Minnesota — CGDL', f: 'Great Lakes water quality · algal bloom forecasting · watershed stress', av: 'LP', bg: '#6D28D9', orcid: '0000-0003-2345-6789', m: 78 },
];

const SAFARI_SPECIES = ['Gila Woodpecker','Cactus Wren','Gila Monster','Greater Roadrunner','Desert Tortoise','Harris Hawk','Gambel Quail','Western Diamondback'];

/* small ui helpers using shadcn-compatible tokens (hsl design vars in index.css) */
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden ${className}`}>{children}</div>
);
const CardHead: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border">
    <span className="text-[13px] font-bold text-foreground">{title}</span>
    {right}
  </div>
);
const Tag: React.FC<{ tone?: string; children: React.ReactNode }> = ({ tone = 'g', children }) => {
  const map: Record<string,string> = {
    g: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    t: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    a: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    b: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    r: 'text-red-400 border-red-500/30 bg-red-500/10',
    p: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  };
  return <span className={`inline-flex text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md border ${map[tone]}`}>{children}</span>;
};

/* ----------------------------------------------------------------------------
   Page sub-views
---------------------------------------------------------------------------- */
const KPI: React.FC<{ accent: string; label: string; value: React.ReactNode; delta?: string; tone?: string }> = ({ accent, label, value, delta, tone='up' }) => (
  <div className="relative rounded-xl border border-border bg-card/60 p-3.5 overflow-hidden">
    <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: accent }} />
    <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-mono mb-1.5">{label}</div>
    <div className="text-[1.6rem] font-extrabold text-foreground leading-none tracking-tight">{value}</div>
    {delta && <div className={`text-[11px] mt-1 ${tone==='up'?'text-emerald-400':tone==='dn'?'text-red-400':'text-muted-foreground'}`}>{delta}</div>}
  </div>
);

const Dashboard: React.FC<{ feed: any[]; k1: number; k2: number; setMapTip: (s:string)=>void; mapTip: string }> = ({ feed, k1, k2, setMapTip, mapTip }) => (
  <div>
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/[0.07] text-amber-400 px-3 py-2.5 mb-3 text-[13px] leading-relaxed">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <span><strong>Anomaly detected —</strong> Water temp in Sonoran region +2.8°C above 30-yr baseline · AZ Game &amp; Fish notified · 4 min ago</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
      <KPI accent="#22C55E" label="Active Streams" value={k1} delta="↑ 12 today" />
      <KPI accent="#14B8A6" label="Datasets Ingested" value={k2.toLocaleString()} delta="↑ 6.2%" />
      <KPI accent="#F59E0B" label="Partner Orgs" value={38} delta="↑ 3 this month" />
      <KPI accent="#EF4444" label="Anomalies" value={7} delta="↑ 2 last hour" tone="dn" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-2.5 mb-2.5">
      <Card><CardHead title="Ingest Volume — 24h" right={<Tag>LIVE</Tag>} />
        <div className="p-3 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INGEST_24H}><defs><linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={0.25}/><stop offset="100%" stopColor="#22C55E" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis dataKey="h" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(h)=>h%4===0?`${h}h`:''}/><YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} width={26}/>
              <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={1.5} fill="url(#ig)"/></AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card><CardHead title="By Ecosystem" />
        <div className="p-3 h-[120px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ECO} dataKey="value" innerRadius={26} outerRadius={42} paddingAngle={2}>{ECO.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Legend layout="vertical" align="right" verticalAlign="middle" iconSize={7} wrapperStyle={{ fontSize: 8 }}/></PieChart></ResponsiveContainer></div>
      </Card>
      <Card><CardHead title="Permissions" />
        <div className="p-3 h-[120px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={PERM} dataKey="value" innerRadius={26} outerRadius={42} paddingAngle={2}>{PERM.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Legend layout="vertical" align="right" verticalAlign="middle" iconSize={7} wrapperStyle={{ fontSize: 8 }}/></PieChart></ResponsiveContainer></div>
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
      <Card>
        <CardHead title="Active Research Map" right={<Tag tone="t">38 Orgs</Tag>} />
        <div className="p-2.5 bg-secondary/40">
          <svg viewBox="0 0 580 195" className="w-full rounded-md" style={{ background: '#08110A' }}>
            <rect width="580" height="195" fill="#08110A" rx="6"/>
            <line x1="190" y1="0" x2="190" y2="195" stroke="#1A3020" strokeWidth="0.5" strokeDasharray="4,5"/>
            <line x1="330" y1="0" x2="330" y2="195" stroke="#1A3020" strokeWidth="0.5" strokeDasharray="4,5"/>
            <line x1="0" y1="98" x2="580" y2="98" stroke="#1A3020" strokeWidth="0.5" strokeDasharray="4,5"/>
            {[
              { x:168,y:122,c:'#22C55E',t:'Phoenix, AZ — Arizona Game & Fish · 847 datasets · 142 species', big:true, label:'Phoenix, AZ' },
              { x:332,y:158,c:'#3B82F6',t:'Gulf of Mexico — NOAA Marine · 1,204 datasets · coral + dolphin', big:true, label:'Gulf, TX' },
              { x:96,y:60,c:'#14B8A6',t:'Pacific NW — USFS Region 6 · 632 datasets · old-growth' },
              { x:445,y:160,c:'#EF4444',t:'Florida Keys — Coral Foundation · 389 datasets · bleaching' },
              { x:293,y:88,c:'#F59E0B',t:'Great Plains — Prairie Institute · 211 datasets · bison' },
              { x:406,y:68,c:'#A855F7',t:'Great Lakes — Freshwater Network · 567 datasets · water quality' },
              { x:380,y:155,c:'#22C55E',t:'Amazon Basin — INPA Brazil · 2,341 datasets · deforestation' },
            ].map((p,i)=>(
              <g key={i} style={{ cursor:'pointer' }} onClick={()=>setMapTip('→ '+p.t)}>
                {p.big && <circle cx={p.x} cy={p.y} r="8" fill="none" stroke={p.c+'55'}><animate attributeName="r" values="6;16;6" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/></circle>}
                <circle cx={p.x} cy={p.y} r={p.big?7:6} fill={p.c+'26'} stroke={p.c} strokeWidth="1.5"/>
                <circle cx={p.x} cy={p.y} r={p.big?3:2.5} fill={p.c}/>
                {p.label && <text x={p.x+10} y={p.y-3} fontSize="7" fill={p.c+'cc'} fontFamily="monospace">{p.label}</text>}
              </g>
            ))}
            <text x="8" y="190" fontSize="7" fill="#2A4030" fontFamily="monospace">Click pins · 38 active organizations · 7 priority zones</text>
          </svg>
        </div>
        <div className="px-3 py-1.5 text-[11px] font-mono text-emerald-400 bg-secondary/40 border-t border-border min-h-[26px]">{mapTip}</div>
      </Card>
      <Card><CardHead title="Live Ingest Feed" right={<Tag>STREAMING</Tag>} />
        <div className="max-h-[240px] overflow-y-auto">
          {feed.slice(0,6).map((f,i)=>(
            <div key={i} className="flex gap-2 px-3.5 py-2 border-b border-border last:border-0 hover:bg-secondary/40">
              <div className="w-[7px] h-[7px] rounded-full shrink-0 mt-1" style={{ background: f.c }}/>
              <div className="flex-1"><div className="text-[12px] font-semibold text-foreground">{f.o}</div><div className="text-[11px] text-muted-foreground leading-snug">{f.d}</div></div>
              <div className="text-[9px] font-mono text-muted-foreground/70 whitespace-nowrap pt-0.5">{f.t}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const Pipeline: React.FC = () => {
  const nodes = [
    { ico:'📡', name:'Sources', tech:'4 channels', lat:'concurrent', col:'border-teal-500/30' },
    { ico:'📨', name:'Kafka', tech:'Message Broker', lat:'<50ms queue', col:'border-emerald-500/30' },
    { ico:'⚡', name:'Flink', tech:'Stream Processor', lat:'<120ms process', col:'border-blue-500/30' },
    { ico:'🗄️', name:'Storage', tech:'6 DB types', lat:'async writes', col:'border-teal-500/30' },
    { ico:'🔌', name:'API Layer', tech:'GraphQL+WS+REST', lat:'<30ms P99', col:'border-purple-500/30' },
    { ico:'📊', name:'Dashboard', tech:'WebSocket push', lat:'real-time', col:'border-amber-500/30' },
  ];
  const channels = [
    { ico:'👩‍🔬', name:'Researcher Uploads', d:'Datasets, field reports, species observations structured via API. Queued instantly to Kafka.', b:'seconds to dashboard' },
    { ico:'🛰️', name:'Satellite Feeds', d:'NASA Earthdata, ESA Copernicus, USGS via scheduled + webhook pulls. 15-min refresh cycles.', b:'15-min cadence' },
    { ico:'🚁', name:'Drone & Safari', d:'RTMP/WebRTC to CDN edge node — bypasses warehouse for sub-second live video. Telemetry writes in parallel.', b:'<1s live latency' },
    { ico:'📴', name:'Offline Field Sync', d:'SQLite-first local app. CRDT conflict resolution. Auto-syncs on any connection including 2G.', b:'no data loss' },
  ];
  const actions = [
    { n:1, t:'Normalize', d:'Standardize every org\u2019s data format into the platform unified schema in milliseconds', cls:'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    { n:2, t:'Tag & Classify', d:'Auto-tag by species, geography, ecosystem type, and research category', cls:'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    { n:3, t:'Permission Route', d:'Reads dataset-level flag — public data routes to Discovery automatically, zero manual review', cls:'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    { n:4, t:'Anomaly Detection', d:'Isolation Forest runs inline — fires threshold alerts before data even reaches storage', cls:'text-red-400 bg-red-500/15 border-red-500/30' },
    { n:5, t:'Dead Letter Queue', d:'Malformed or rejected records routed to DLQ for manual review — zero data loss on errors', cls:'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  ];
  return (
    <div>
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-2.5 mb-3.5 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-emerald-400">How it works:</strong> Data hits the Kafka queue the moment it arrives — dashboards update in seconds without waiting for processing. Flink normalizes, classifies, and permission-routes every event in milliseconds. Public data flows automatically to the Discovery layer with zero manual review.
      </div>
      <div className="flex items-stretch gap-1.5 overflow-x-auto pb-3.5">
        {nodes.map((n,i)=>(
          <React.Fragment key={i}>
            <div className={`rounded-xl border bg-card/60 px-3.5 py-3 min-w-[120px] text-center ${n.col}`}>
              <div className="text-[1.3rem] mb-1">{n.ico}</div>
              <div className="text-[12px] font-bold text-foreground">{n.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{n.tech}</div>
              <div className="text-[9px] text-emerald-400 mt-1 font-mono">{n.lat}</div>
            </div>
            {i<nodes.length-1 && <div className="w-7 shrink-0 grid place-items-center text-muted-foreground">→</div>}
          </React.Fragment>
        ))}
      </div>
      <div className="text-[13px] font-bold text-foreground mb-2">Ingestion Channels</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {channels.map((c,i)=>(
          <Card key={i} className="p-3 hover:border-border cursor-default">
            <div className="text-[1.4rem] mb-1.5">{c.ico}</div>
            <div className="text-[12px] font-bold text-foreground mb-1">{c.name}</div>
            <div className="text-[11px] text-muted-foreground leading-snug">{c.d}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1.5">{c.b}</div>
          </Card>
        ))}
      </div>
      <Card><CardHead title="Stream Processor Actions (Flink)" right={<Tag>LIVE</Tag>} />
        <div className="p-3 flex flex-col gap-1.5">
          {actions.map(a=>(
            <div key={a.n} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/40">
              <div className={`w-5 h-5 rounded-full grid place-items-center text-[11px] shrink-0 border ${a.cls}`}>{a.n}</div>
              <div><div className="text-[12px] font-semibold text-foreground">{a.t}</div><div className="text-[11px] text-muted-foreground">{a.d}</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Satellite_View: React.FC = () => {
  const sats = [
    { name:'NASA Earthdata', agency:'NASA / GSFC', status:'LIVE', color:'#22C55E', detail:'MODIS · Landsat-9 · 15-min refresh', bar:'#22C55E' },
    { name:'ESA Copernicus', agency:'European Space Agency', status:'LIVE', color:'#22C55E', detail:'Sentinel-2 · 10m resolution · free tier', bar:'#22C55E' },
    { name:'USGS Seismic', agency:'US Geological Survey', status:'CONNECTED', color:'#14B8A6', detail:'Earthquake feed · precursor anomalies', bar:'#14B8A6' },
    { name:'NOAA Climate', agency:'National Oceanic & Atmospheric', status:'CONNECTED', color:'#14B8A6', detail:'SST · weather patterns · ocean heat', bar:'#14B8A6' },
    { name:'Planet Labs', agency:'Planet Labs PBC', status:'CONNECTED', color:'#14B8A6', detail:'SkySat · 3m resolution · daily', bar:'#14B8A6' },
    { name:'NASA SpaceCube', agency:'NASA / Goddard — FPGA Edge', status:'PENDING LICENSE', color:'#F59E0B', detail:'Onboard edge processing · bandwidth reduction', bar:'#F59E0B' },
  ];
  const events = [
    { c:'#22C55E', o:'NASA Earthdata — MODIS Thermal Pass', d:'Sonoran region thermal anomaly confirmed +2.8°C above 30-yr baseline · 3 stations flagged', t:'4 min ago' },
    { c:'#14B8A6', o:'ESA Copernicus — Sentinel-2 Pass', d:'NDVI update — Amazon sector 7-G · canopy density −3.2% from last pass', t:'12 min ago' },
    { c:'#3B82F6', o:'NOAA Climate — SST Update', d:'Gulf surface temp +1.4°C above seasonal average · coral bleaching risk elevated', t:'22 min ago' },
    { c:'#F59E0B', o:'USGS Seismic — Microevent Cluster', d:'14 micro-events M<2.0 detected near Cascade Range · 6-hour window · logged', t:'1 hr ago' },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
        <KPI accent="#22C55E" label="Active Feeds" value={5} delta="1 pending license" />
        <KPI accent="#14B8A6" label="Data Points/hr" value="48K" delta="↑ from 3 passes" />
        <KPI accent="#F59E0B" label="Coverage Area" value="62%" delta="of monitored zones" tone="n" />
        <KPI accent="#3B82F6" label="Last Pass" value={<span className="text-[1.1rem]">4 min</span>} delta="ago · Copernicus" tone="n" />
      </div>
      <div className="text-[13px] font-bold text-foreground mb-2">Satellite Integration Status</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        {sats.map((s,i)=>(
          <div key={i} className="relative rounded-lg border border-border bg-card/60 p-3 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: s.bar }}/>
            <div className="text-[13px] font-bold text-foreground">{s.name}</div>
            <div className="text-[11px] text-muted-foreground mb-1.5">{s.agency}</div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono"><span className="w-[5px] h-[5px] rounded-full" style={{ background: s.color }}/><span style={{ color: s.color }}>{s.status}</span></div>
            <div className="text-[11px] text-muted-foreground mt-1.5">{s.detail}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card><CardHead title="Satellite Ingest Volume (GB/day)" />
          <div className="p-3 h-[160px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={SAT_VOL}><CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis dataKey="name" tick={{ fontSize: 9, fill:'hsl(var(--muted-foreground))' }}/><YAxis tick={{ fontSize: 9, fill:'hsl(var(--muted-foreground))' }} width={26}/><Bar dataKey="gb" fill="#16A34A" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
        </Card>
        <Card><CardHead title="Recent Satellite Events" right={<Tag tone="t">AUTO-INGESTED</Tag>} />
          {events.map((e,i)=>(
            <div key={i} className="flex gap-2 px-3.5 py-2 border-b border-border last:border-0">
              <div className="w-[7px] h-[7px] rounded-full shrink-0 mt-1" style={{ background:e.c }}/>
              <div className="flex-1"><div className="text-[12px] font-semibold text-foreground">{e.o}</div><div className="text-[11px] text-muted-foreground leading-snug">{e.d}</div></div>
              <div className="text-[9px] font-mono text-muted-foreground/70 whitespace-nowrap pt-0.5">{e.t}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

const Safari: React.FC<{ species:string; tagged:number; clock:string; track:any[]; log:any[] }> = ({ species, tagged, clock, track, log }) => (
  <div>
    <div className="flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-500/[0.07] text-blue-400 px-3 py-2.5 mb-3.5 text-[13px]">
      <Video className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Drone stream active</strong> — Sonoran Desert Survey · Drone ZB-04 · GPS lock · 4 viewers watching</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-2.5 mb-2.5">
      <div className="rounded-xl overflow-hidden relative border border-border aspect-video" style={{ background:'#000' }}>
        <div className="w-full h-full relative overflow-hidden" style={{ background:'linear-gradient(160deg,#0A2010 0%,#142C0A 40%,#0D1F07 70%,#0A1505 100%)' }}>
          <div className="absolute text-2xl opacity-40" style={{ top:'20%', left:'15%' }}>🌿</div>
          <div className="absolute text-xl opacity-50" style={{ top:'55%', left:'25%' }}>🌵</div>
          <div className="absolute text-base opacity-40" style={{ top:'40%', left:'60%' }}>🌵</div>
          <div className="absolute font-mono text-[10px]" style={{ top:10, left:10, color:'#00FF88', textShadow:'0 0 6px #00FF88' }}><div>GPS: 33.4484°N 112.0740°W</div><div>ALT: 42.3m AGL</div><div>HDG: 247° SW</div></div>
          <div className="absolute font-mono text-[10px] text-right" style={{ top:10, right:10, color:'#00FF88', textShadow:'0 0 6px #00FF88' }}><div>DRONE: ZB-04</div><div>BATT: 78%</div><div>{clock}</div></div>
          <div className="absolute font-mono text-[9px]" style={{ bottom:10, left:10, color:'#00FF88', textShadow:'0 0 6px #00FF88' }}><div>SPEED: 8.4 m/s</div><div>TEMP: 38.2°C</div></div>
          <div className="absolute font-mono text-[9px] text-right" style={{ bottom:10, right:10, color:'#00FF88', textShadow:'0 0 6px #00FF88' }}><div>Species: {species}</div><div>Conf: 94%</div></div>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5"><span className="w-[5px] h-[5px] rounded-full bg-white animate-pulse"/>LIVE</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">🚁</div>
          <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500 zb-ping"/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 content-start">
        {[
          { l:'Live Viewers', v:'4', s:'public stream' },
          { l:'Species Tagged', v:tagged, s:'this session' },
          { l:'Observations', v:'142', s:'total today' },
          { l:'Stream Latency', v:<span className="text-base">0.8s</span>, s:'CDN edge · WebRTC' },
        ].map((x,i)=>(
          <div key={i} className="rounded-lg border border-border bg-card/60 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">{x.l}</div>
            <div className="text-[1.3rem] font-extrabold text-foreground mt-0.5 tracking-tight">{x.v}</div>
            <div className="text-[11px] text-emerald-400">{x.s}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
      <Card><CardHead title="GPS Track — Session" right={<Tag>LIVE</Tag>} />
        <div className="p-3 h-[120px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={track}><Line type="monotone" dataKey="y" stroke="#22C55E" strokeWidth={1.5} dot={{ r:2, fill:'#22C55E' }}/></LineChart></ResponsiveContainer></div>
      </Card>
      <Card><CardHead title="Species Log" right={<Tag tone="a">REAL-TIME</Tag>} />
        <div className="max-h-[200px] overflow-y-auto">
          {log.map((l,i)=>(
            <div key={i} className="flex gap-2 px-3.5 py-2 border-b border-border last:border-0">
              <div className="w-[7px] h-[7px] rounded-full shrink-0 mt-1" style={{ background:l.c }}/>
              <div className="flex-1"><div className="text-[12px] font-semibold text-foreground">{l.sp}</div><div className="text-[11px] text-muted-foreground">{l.d}</div></div>
              <div className="text-[9px] font-mono text-muted-foreground/70 whitespace-nowrap pt-0.5">{l.t}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const FieldSync: React.FC = () => {
  const devices = [
    { av:'RT', bg:'#F59E0B', name:'Dr. Torres', loc:'📴 Offline — Sierra Madre, MX', note:'847 records queued · no connection', pct:0, bar:'#F59E0B', stat:'0% — awaiting connection' },
    { av:'JN', bg:'#3B82F6', name:'Dr. Nakamura', loc:'📡 Syncing — Amazon Basin', note:'400 records uploading via satellite phone', pct:67, bar:'#3B82F6', stat:'67% — chunked transfer active' },
    { av:'SC', bg:'#22C55E', name:'Dr. Chen', loc:'✅ Complete — Cascade Range, WA', note:'312 records synced · no conflicts', pct:100, bar:'#22C55E', stat:'100% — complete · dashboard updated' },
    { av:'AZ', bg:'#14B8A6', name:'AZ Game & Fish', loc:'🟢 Live — Sonoran Desert, AZ', note:'Real-time · LTE connected · streaming', pct:100, bar:'#22C55E', stat:'LIVE — no queue' },
  ];
  const merges = [
    { c:'#22C55E', o:'Conflict Resolved — Observation #8841', d:'Torres + Nakamura logged same jaguar sighting 4 min apart. CRDT merged coordinates, kept both timestamps.', t:'2m ago' },
    { c:'#22C55E', o:'Conflict Resolved — Dataset gps_track_2026_06_11', d:'Two GPS track segments overlapped by 12 points. Merged with Chen\u2019s submission as authoritative.', t:'18m ago' },
    { c:'#14B8A6', o:'Sync Complete — Cascade Range batch', d:'312 records from Dr. Chen synced · 0 conflicts · stream processor routed to TimescaleDB + dashboard', t:'34m ago' },
  ];
  return (
    <div>
      <div className="rounded-lg border border-blue-500/25 bg-blue-500/[0.06] px-3.5 py-2.5 mb-3.5 text-[12px] text-blue-300 leading-relaxed">
        <strong>Offline-First Architecture:</strong> Field researchers use a local SQLite app — every observation writes instantly with zero network required. Background sync uploads incrementally over any connection including 2G. CRDTs handle conflicts when two researchers log overlapping data offline. A researcher in the Amazon with 3 days of zero connectivity syncs everything within minutes of reconnecting.
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
        <KPI accent="#22C55E" label="Devices Online" value={2} delta="of 4 active" tone="n" />
        <KPI accent="#14B8A6" label="Pending Records" value="1,247" delta="syncing now" />
        <KPI accent="#F59E0B" label="Conflicts Resolved" value={14} delta="CRDT auto-merge" />
        <KPI accent="#3B82F6" label="Last Sync" value={<span className="text-base">2m ago</span>} delta="Torres device" tone="n" />
      </div>
      <div className="text-[13px] font-bold text-foreground mb-2">Active Field Devices</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {devices.map((d,i)=>(
          <Card key={i} className="p-3">
            <div className="flex items-center gap-2 mb-2"><div className="w-[26px] h-[26px] rounded-full grid place-items-center text-[10px] font-bold text-black shrink-0" style={{ background:d.bg }}>{d.av}</div><div><div className="text-[12px] font-bold text-foreground">{d.name}</div><div className="text-[11px] text-muted-foreground">{d.loc}</div></div></div>
            <div className="text-[11px] text-muted-foreground">{d.note}</div>
            <div className="h-[5px] bg-secondary rounded-full overflow-hidden mt-1.5"><div className="h-full rounded-full transition-all duration-1000" style={{ width:d.pct+'%', background:d.bar }}/></div>
            <div className="text-[10px] text-muted-foreground/70 mt-1 font-mono">{d.stat}</div>
          </Card>
        ))}
      </div>
      <Card><CardHead title="CRDT Merge Log" right={<Tag tone="b">AUTO-RESOLVED</Tag>} />
        {merges.map((m,i)=>(
          <div key={i} className="flex gap-2 px-3.5 py-2 border-b border-border last:border-0">
            <div className="w-[7px] h-[7px] rounded-full shrink-0 mt-1" style={{ background:m.c }}/>
            <div className="flex-1"><div className="text-[12px] font-semibold text-foreground">{m.o}</div><div className="text-[11px] text-muted-foreground leading-snug">{m.d}</div></div>
            <div className="text-[9px] font-mono text-muted-foreground/70 whitespace-nowrap pt-0.5">{m.t}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const Discovery: React.FC = () => {
  const [chip, setChip] = useState('all');
  const [q, setQ] = useState('');
  const chips = [['all','All'],['dataset','Datasets'],['program','Programs'],['volunteer','Volunteer'],['research','Research'],['marine','🌊 Marine'],['forest','🌲 Forest'],['desert','🏜️ Desert']];
  const typeColor: Record<string,string> = { dataset:'text-emerald-400', program:'text-teal-400', volunteer:'text-amber-400', research:'text-blue-400' };
  const items = DISC.filter(d=>(chip==='all'||d.f.includes(chip))&&(!q||d.title.toLowerCase().includes(q.toLowerCase())||d.org.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div className="relative mb-2.5"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search datasets, programs, species…" className="w-full bg-secondary border border-input rounded-full py-2 pl-3.5 pr-9 text-[13px] text-foreground outline-none focus:border-primary"/><SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/></div>
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {chips.map(([id,lbl])=>(
          <button key={id} onClick={()=>setChip(id)} className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors ${chip===id?'bg-emerald-500/10 border-emerald-500 text-emerald-400':'border-input text-muted-foreground hover:border-primary hover:text-emerald-400'}`}>{lbl}</button>
        ))}
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))' }}>
        {items.map((d,i)=>(
          <Card key={i} className="p-3 cursor-pointer hover:border-border hover:bg-secondary/60 transition-colors">
            <div className={`text-[10px] uppercase tracking-[0.1em] font-bold mb-1 ${typeColor[d.type]}`}>{d.type.toUpperCase()}</div>
            <div className="text-[13px] font-bold text-foreground mb-0.5 leading-snug">{d.title}</div>
            <div className="text-[11px] text-muted-foreground leading-snug">{d.meta}</div>
            <div className="flex items-center justify-between mt-2"><span className="text-[10px] text-emerald-400">{d.org}</span><div className="flex gap-1">{d.tags.map((t,j)=><span key={j} className="text-[9px] bg-secondary border border-border text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>)}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Collab: React.FC = () => {
  const [sel, setSel] = useState(0);
  const [msgs, setMsgs] = useState([
    { s:'Dr. Chen → Dr. Nakamura', txt:'Kenji — I just uploaded the Q2 Atlantic shark tracking data. The migration corridor matches your Pacific data almost exactly. Platform flagged the overlap — want to open a shared workspace?', t:'10:41 AM' },
    { s:'Dr. Nakamura → Dr. Chen', txt:'Yes! That\u2019s exactly what I suspected. I can see the Neo4j graph already shows a 97% node overlap. Let\u2019s merge the datasets and run the cross-correlation model.', t:'10:43 AM' },
    { s:'Platform AI', txt:'🤖 Cross-institutional match detected — Dr. Chen (FL) + Dr. Nakamura (CA) studying overlapping white shark populations. Shared workspace created. Weaviate semantic similarity: 94%.', t:'10:43 AM', ai:true },
  ]);
  const [draft, setDraft] = useState('');
  const send = () => { if(!draft.trim())return; setMsgs([...msgs,{s:'You',txt:draft,t:'just now'}]); setDraft(''); };
  const conns = [
    { tone:'cm', type:'Research Match', txt:<>Dr. Chen (FL) + Dr. Nakamura (CA) — <strong>white shark migration</strong></>, act:'→ Open workspace', border:'border-l-emerald-500', tc:'text-emerald-400' },
    { tone:'cp', type:'Active Project', txt:<><strong>Cross-Basin Coral Study</strong> — 4 orgs · 6 datasets</>, act:'→ View dashboard', border:'border-l-teal-500', tc:'text-teal-400' },
    { tone:'cq', type:'Pending Request', txt:<>Dr. Torres — <strong>Sonoran reptile corridors</strong></>, act:'→ Review & approve', border:'border-l-amber-500', tc:'text-amber-400' },
    { tone:'cm', type:'Research Match', txt:<>Prairie Inst. + Great Plains — <strong>bison corridor</strong> · 94% overlap</>, act:'→ Open workspace', border:'border-l-emerald-500', tc:'text-emerald-400' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_270px] gap-2.5">
      <div>
        <input placeholder="Search researchers by name, species, or ecosystem…" className="w-full bg-secondary border border-input rounded-full py-2 px-3.5 text-[13px] text-foreground outline-none focus:border-primary mb-2"/>
        {RESEARCHERS.map((r,i)=>(
          <div key={i} onClick={()=>setSel(i)} className={`flex gap-2 p-2.5 rounded-lg border mb-1.5 cursor-pointer transition-colors ${sel===i?'border-border bg-secondary/60':'border-border bg-card/60 hover:bg-secondary/40'}`}>
            <div className="w-8 h-8 rounded-full grid place-items-center font-bold text-[11px] text-black shrink-0" style={{ background:r.bg }}>{r.av}</div>
            <div className="flex-1"><div className="text-[13px] font-bold text-foreground">{r.n}</div><div className="text-[11px] text-muted-foreground">{r.i}</div><div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{r.f}</div><div className="text-[11px] font-mono text-teal-400 mt-0.5">ORCID: {r.orcid}</div></div>
            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-md self-start shrink-0">{r.m}% match</div>
          </div>
        ))}
        <Card className="mt-2.5 flex flex-col h-[320px]">
          <CardHead title="Researcher Messaging" right={<Tag>WebSocket Live</Tag>} />
          <div className="flex-1 overflow-y-auto p-3">
            {msgs.map((m,i)=>(
              <div key={i} className="mb-2.5">
                <div className="text-[10px] text-emerald-400 font-bold mb-0.5 font-mono">{m.s}</div>
                <div className={`text-[12px] text-foreground border rounded-lg px-2.5 py-2 leading-relaxed ${(m as any).ai?'border-emerald-500/30 bg-emerald-500/[0.04]':'border-border bg-secondary/40'}`}>{m.txt}</div>
                <div className="text-[9px] text-muted-foreground/70 mt-0.5 font-mono">{m.t}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 px-3 py-2 border-t border-border">
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Send a message…" className="flex-1 bg-secondary border border-input rounded-full px-3 py-1.5 text-[12px] text-foreground outline-none focus:border-primary"/>
            <button onClick={send} className="px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">Send</button>
          </div>
        </Card>
      </div>
      <Card className="self-start">
        <div className="px-3 py-2.5 border-b border-border"><div className="text-[13px] font-bold text-foreground">Active Connections</div><div className="text-[11px] text-muted-foreground mt-0.5">Neo4j graph-matched</div></div>
        {conns.map((c,i)=>(
          <div key={i} className={`px-3 py-2.5 border-b border-l-2 border-border last:border-b-0 cursor-pointer hover:bg-secondary/40 ${c.border}`}>
            <div className={`text-[10px] uppercase tracking-wide font-bold mb-0.5 ${c.tc}`}>{c.type}</div>
            <div className="text-[12px] text-foreground leading-snug [&_strong]:text-foreground">{c.txt}</div>
            <div className="mt-0.5 text-[11px] text-emerald-400 cursor-pointer">{c.act}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const Predict: React.FC = () => {
  const [bars, setBars] = useState([0,0,0,0]);
  useEffect(()=>{ const t = setTimeout(()=>setBars([78,34,62,55]), 150); return ()=>clearTimeout(t); }, []);
  const cards = [
    { title:'Coral Bleaching Risk · Gulf of Mexico', conf:'91% conf', ct:'g', lbl:'Bleaching probability — 30 days', grad:'linear-gradient(90deg,#F59E0B,#EF4444)', val:'78% probability · LSTM model', vc:'text-red-400', sigHd:'Driving signals (Prophet decomposition)', sigs:[['Sea surface temp','+2.1°C','up'],['UV index anomaly','+34%','up'],['Ocean acidity (pH)','−0.04','up']] },
    { title:'Deforestation Risk · Sonoran Desert', conf:'74% conf', ct:'m', lbl:'Projected canopy loss — 6 months', grad:'#F59E0B', val:'34% decline · Transformer model', vc:'text-amber-400', sigHd:'Driving signals', sigs:[['NDVI satellite index','−0.12','up'],['Precipitation 90-day','−28%','up'],['Wildfire risk index','Elevated','wn']] },
    { title:'Shark Population · Atlantic Corridor', conf:'88% conf', ct:'g', lbl:'Population forecast — 12 months', grad:'linear-gradient(90deg,#15803D,#22C55E)', val:'+12% recovery · Facebook Prophet', vc:'text-emerald-400', sigHd:'Driving signals', sigs:[['Tagged migration returns','+18%','dn'],['Prey abundance index','+9%','dn'],['Fishing pressure','−22%','dn']] },
    { title:'Great Lakes Water Quality', conf:'61% conf', ct:'l', lbl:'Algal bloom probability — 60 days', grad:'linear-gradient(90deg,#3B82F6,#F59E0B)', val:'55% — monitoring · cross-correlation', vc:'text-blue-400', sigHd:'Driving signals', sigs:[['Phosphorus runoff','+14%','up'],['Temp stratification','Forming','wn'],['Wind mixing index','Low','wn']] },
  ];
  const confColor: Record<string,string> = { g:'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', m:'text-amber-400 border-amber-500/30 bg-amber-500/10', l:'text-red-400 border-red-500/30 bg-red-500/10' };
  const sigColor: Record<string,string> = { up:'text-red-400', dn:'text-emerald-400', wn:'text-amber-400' };
  const anoms = [
    { k:'crit', ico:<CircleAlert className="h-4 w-4 text-red-400"/>, cat:'Critical · Water · Sonoran AZ', title:'Temp Spike — +2.8°C above 30-yr baseline', d:'3 stations confirmed. AZ Game & Fish notified. Prediction models updating.', t:'4 min ago', bc:'border-l-red-500', tc:'text-red-400' },
    { k:'warn', ico:<AlertTriangle className="h-4 w-4 text-amber-400"/>, cat:'Warning · Species · Gulf Coast', title:'Dolphin Count Drop — 23% below average', d:'Red tide correlation detected. NOAA cross-correlated dataset flagged.', t:'31 min ago', bc:'border-l-amber-500', tc:'text-amber-400' },
    { k:'warn', ico:<AlertTriangle className="h-4 w-4 text-amber-400"/>, cat:'Warning · Seismic · Pacific NW', title:'Microseismic Cluster — Cascade Range', d:'14 micro-events M<2.0 in 6-hr window. USGS feed correlated. Precursor pattern flagged.', t:'1 hr ago', bc:'border-l-amber-500', tc:'text-amber-400' },
    { k:'info', ico:<Info className="h-4 w-4 text-blue-400"/>, cat:'Info · Vegetation · Great Plains', title:'NDVI Surge — 18% above seasonal norm', d:'Possible prairie recovery signal. Prediction published — indexed in Discovery layer.', t:'2 hr ago', bc:'border-l-blue-500', tc:'text-blue-400' },
  ];
  return (
    <div>
      <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/[0.07] text-red-400 px-3 py-2.5 mb-3.5 text-[13px]">
        <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Critical —</strong> Sonoran water temp +2.8°C above 30-yr baseline · Isolation Forest flagged · 91% confidence · AZ Game &amp; Fish notified</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
        {cards.map((c,i)=>(
          <Card key={i}>
            <div className="flex items-start justify-between gap-1.5 px-3 py-2.5 border-b border-border"><span className="text-[12px] font-bold text-foreground leading-snug">{c.title}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${confColor[c.ct]}`}>{c.conf}</span></div>
            <div className="p-3">
              <div className="text-[11px] text-muted-foreground mb-1">{c.lbl}</div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1"><div className="h-full rounded-full transition-all duration-[1400ms]" style={{ width:bars[i]+'%', background:c.grad }}/></div>
              <div className={`text-[11px] font-mono ${c.vc}`}>{c.val}</div>
              <div className="mt-2 pt-2 border-t border-border">
                <div className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-1">{c.sigHd}</div>
                {c.sigs.map((s,j)=>(<div key={j} className="flex items-center py-0.5 border-b border-border last:border-0"><span className="text-[11px] text-muted-foreground flex-1">{s[0]}</span><span className={`text-[11px] font-mono ${sigColor[s[2] as string]}`}>{s[1]}</span></div>))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card><CardHead title="Real-Time Anomaly Feed" right={<Tag>Isolation Forest · LIVE</Tag>} />
        <div className="p-3 flex flex-col gap-1.5">
          {anoms.map((a,i)=>(
            <div key={i} className={`flex gap-2 rounded-lg border border-border border-l-[3px] bg-card/60 px-2.5 py-2 ${a.bc}`}>
              <span className="text-base">{a.ico}</span>
              <div className="flex-1"><div className={`text-[9px] uppercase tracking-wide font-bold mb-0.5 ${a.tc}`}>{a.cat}</div><div className="text-[12px] font-semibold text-foreground mb-0.5">{a.title}</div><div className="text-[11px] text-muted-foreground leading-snug">{a.d}</div></div>
              <div className="text-[9px] font-mono text-muted-foreground/70 whitespace-nowrap shrink-0">{a.t}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Permissions: React.FC = () => {
  const audit = [
    ['a3f9...c2d1','GRANT PUBLIC','text-emerald-400','Sonoran Reptile Survey','d.hayes@azgfd.gov','14:28:03'],
    ['b7e2...f8a3','GRANT RESTRICTED','text-blue-400','Shark GPS Tracks','s.chen@fmi.edu','14:22:17'],
    ['c1d4...9e7b','ACCESS READ','text-amber-400','Gulf SST Dataset','api_partner_noaa','14:19:44'],
    ['d8f5...2c6a','GRANT PUBLIC','text-emerald-400','Prairie NDVI 2026','j.okafor@prairie.org','14:11:29'],
    ['e2a1...4b8d','REVOKE ACCESS','text-red-400','Private Camera Traps','admin@zytherion.com','13:58:11'],
  ];
  const fields = [
    ['GPS Coordinates','location · endangered species','PRIVATE','bg-blue-500/[0.12] text-blue-400'],
    ['Behavioral Observations','text · species behavior','PUBLIC','bg-emerald-500/[0.12] text-emerald-400'],
    ['Population Counts','numeric · census data','PUBLIC','bg-emerald-500/[0.12] text-emerald-400'],
    ['Researcher Contacts','PII · email / phone','PRIVATE','bg-blue-500/[0.12] text-blue-400'],
    ['Satellite Imagery','media · GeoTIFF','RESTRICTED','bg-amber-500/[0.12] text-amber-400'],
    ['Ecosystem Health Index','derived · calculated score','PUBLIC','bg-emerald-500/[0.12] text-emerald-400'],
  ];
  const quality = [
    ['Sonoran Desert Reptile Survey Q2 2026',97,'#22C55E'],
    ['Gulf Coast SST — NOAA Merge',94,'#22C55E'],
    ['Amazon Deforestation — INPA 2026',88,'#22C55E'],
    ['Prairie Grassland NDVI 2010–2026',71,'#F59E0B'],
    ['Cascade Range Microseismic — Partial',44,'#EF4444'],
  ];
  return (
    <div>
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-3.5 py-2.5 mb-3.5 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-emerald-400">Permission Architecture:</strong> Every grant is immutable — timestamped, tied to the specific dataset, and attributed to the authorizing user. This creates a full audit trail for FedRAMP compliance. Permissions are set by the submitting organization at the dataset level — not by Zytherion globally.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
        <div>
          <div className="text-[13px] font-bold text-foreground mb-2">Immutable Audit Log</div>
          <Card><div className="overflow-x-auto"><table className="w-full border-collapse">
            <thead><tr>{['Hash','Event','Dataset','User','Time'].map(h=><th key={h} className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-semibold px-2.5 py-1.5 text-left border-b border-border bg-card">{h}</th>)}</tr></thead>
            <tbody>{audit.map((r,i)=>(<tr key={i} className="hover:bg-secondary/40"><td className="text-[10px] px-2.5 py-2 border-b border-border font-mono text-emerald-400/80">{r[0]}</td><td className={`text-[11px] px-2.5 py-2 border-b border-border font-mono ${r[2]}`}>{r[1]}</td><td className="text-[11px] px-2.5 py-2 border-b border-border text-foreground">{r[3]}</td><td className="text-[10px] px-2.5 py-2 border-b border-border font-mono text-muted-foreground">{r[4]}</td><td className="text-[10px] px-2.5 py-2 border-b border-border font-mono text-muted-foreground">{r[5]}</td></tr>))}</tbody>
          </table></div></Card>
        </div>
        <div>
          <div className="text-[13px] font-bold text-foreground mb-2">Field-Level Permission Controls</div>
          <Card>{fields.map((f,i)=>(
            <div key={i} className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border last:border-0">
              <div className="flex-1"><div className="text-[12px] font-semibold text-foreground">{f[0]}</div><div className="text-[11px] text-muted-foreground">{f[1]}</div></div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${f[3]}`}>{f[2]}</span>
            </div>
          ))}</Card>
        </div>
      </div>
      <div className="text-[13px] font-bold text-foreground mb-2">Data Quality Scores</div>
      <Card>{quality.map((q,i)=>(
        <div key={i} className="flex items-center gap-2 px-3.5 py-2 border-b border-border last:border-0">
          <div className="text-[12px] text-foreground flex-1">{q[0]}</div>
          <div className="w-[100px] h-[5px] bg-secondary rounded-full overflow-hidden shrink-0"><div className="h-full rounded-full" style={{ width:q[1]+'%', background:q[2] as string }}/></div>
          <div className="text-[11px] font-mono text-muted-foreground w-8 text-right shrink-0">{q[1]}</div>
        </div>
      ))}</Card>
    </div>
  );
};

const TechStack: React.FC = () => {
  const rows = [
    ['L1 · Ingest','Apache Kafka','Message broker — zero-loss queueing, seconds to dashboard','CORE'],
    ['L2 · Process','Apache Flink','Stream processor — normalize, classify, permission-route, anomaly detect'],
    ['L3 · Storage','TimescaleDB','Time-series DB — sensor readings, satellite telemetry, drone GPS tracks','NEW'],
    ['L3 · Storage','PostgreSQL + PostGIS','Relational DB — accounts, permissions, metadata + geospatial indexing','NEW'],
    ['L3 · Storage','Neo4j','Graph DB — collaboration network, researcher matching, 2-hop discovery'],
    ['L3 · Storage','Weaviate','Vector DB — semantic search powering public Discovery layer'],
    ['L3 · Storage','Google Cloud Storage','Object storage — satellite imagery, drone video, PDFs, CSVs'],
    ['L3 · Storage','Redis','Cache — dashboard data served instantly, auto-invalidated by stream processor'],
    ['L4 · API','GraphQL + WebSockets + REST v1','API gateway — frontend requests exact data shape; WS for live dashboard push','NEW'],
    ['L5 · Discovery','Weaviate semantic search','Public Discovery — understands meaning, not just keywords'],
    ['L5 · Discovery','Offline sync (CRDT)','CouchDB/PouchDB pattern — conflict-free field researcher sync','NEW'],
    ['L5 · Discovery','WebRTC + CDN','Live drone/safari video — bypasses warehouse for sub-second latency','NEW'],
    ['L6 · Intelligence','Google Vertex AI','ML training + serving — prediction models with versioning + explainability','NEW'],
    ['L6 · Intelligence','LSTM + Transformer + Prophet','Forecasting — ecosystem health, species trends, deforestation trajectories'],
    ['L6 · Intelligence','Isolation Forest','Anomaly detection — runs inline in stream processor, fires in seconds'],
    ['L7 · Collab','Neo4j + ORCID','Scientific network — researcher identity verification + graph traversal matching','NEW'],
    ['L8 · Infra','Google Cloud Run / Lambda','Serverless compute — scales to zero, auto-scales to thousands concurrent'],
    ['L8 · Infra','Multi-region GCP','DR <60s RTO — US + EU failover · FedRAMP-compatible · AES-256 + TLS 1.3'],
    ['L8 · Infra','NASA SpaceCube (pending)','Edge computing on satellite — compresses imagery before downlink'],
  ];
  return (
    <div>
      <div className="mb-3 text-[13px] text-muted-foreground leading-relaxed">Full 8-layer backend architecture powering the Digital Nervous System. All infrastructure runs serverless-first on GCP — no idle servers, scales to zero overnight, auto-scales to thousands of concurrent safari viewers instantly.</div>
      <Card><div className="overflow-x-auto"><table className="w-full border-collapse">
        <thead><tr>{['Layer','Technology','Role'].map(h=><th key={h} className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-semibold px-3 py-2 text-left border-b border-border bg-card">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={i} className="hover:bg-secondary/40"><td className="text-[10px] px-3 py-2 border-b border-border font-mono text-muted-foreground/70 whitespace-nowrap">{r[0]}</td><td className="text-[13px] px-3 py-2 border-b border-border text-foreground font-semibold whitespace-nowrap">{r[1]}{r[3] && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-bold ml-1.5 align-middle">{r[3]}</span>}</td><td className="text-[12px] px-3 py-2 border-b border-border text-muted-foreground">{r[2]}</td></tr>
        ))}</tbody>
      </table></div></Card>
    </div>
  );
};

const Cost: React.FC = () => {
  const items = [
    ['Kafka / Cloud Pub/Sub (message broker)','$30 – $80/mo','per million messages ingested'],
    ['Cloud Run (serverless compute)','$40 – $120/mo','API + processing jobs · auto-scales to zero'],
    ['Cloud SQL — PostgreSQL + PostGIS','$50 – $150/mo','relational + geospatial · shared tier MVP'],
    ['TimescaleDB (time-series)','$30 – $80/mo','sensor readings + satellite telemetry'],
    ['Google Cloud Storage (objects)','$20 – $60/mo','satellite imagery, drone video, CSVs'],
    ['Weaviate (vector search)','$50 – $150/mo','semantic Discovery layer · managed'],
    ['Neo4j (graph DB)','$65 – $200/mo','collaboration network · Aura managed'],
    ['Redis (cache)','$15 – $40/mo','dashboard hot data · auto-invalidated'],
    ['Vertex AI (ML inference)','$60 – $200/mo','prediction serving · model versioning'],
    ['CDN + WebRTC (drone/safari video)','$70 – $140/mo','Cloudflare Stream · live edge delivery'],
  ];
  return (
    <div>
      <div className="rounded-xl border border-emerald-500/25 px-3.5 py-3.5 mb-3 text-center" style={{ background:'linear-gradient(135deg,rgba(34,197,94,.08),rgba(20,184,166,.06))' }}>
        <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Monthly Infrastructure Cost — MVP (Pre-100K Users)</div>
        <div className="text-[1.8rem] font-black text-emerald-400 tracking-tight">$430 — $1,220</div>
        <div className="text-[12px] text-muted-foreground mt-1">GCP serverless · scales with usage · no idle servers · no upfront purchase</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {items.map((c,i)=>(
          <Card key={i} className="p-3"><div className="text-[11px] text-muted-foreground mb-0.5">{c[0]}</div><div className="text-base font-bold text-foreground tracking-tight">{c[1]}</div><div className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">{c[2]}</div></Card>
        ))}
      </div>
      <Card><CardHead title="Cost vs Scale: Serverless vs Traditional Servers" />
        <div className="p-3 h-[200px]"><ResponsiveContainer width="100%" height="100%">
          <LineChart data={COST_SCALE}><CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis dataKey="users" tick={{ fontSize:9, fill:'hsl(var(--muted-foreground))' }} label={{ value:'Monthly Active Users', position:'insideBottom', offset:-2, fontSize:8, fill:'hsl(var(--muted-foreground))' }}/><YAxis tick={{ fontSize:9, fill:'hsl(var(--muted-foreground))' }} width={48} tickFormatter={(v)=>'$'+v.toLocaleString()}/><Legend wrapperStyle={{ fontSize:10 }}/>
          <Line type="monotone" dataKey="serverless" name="Serverless (GCP)" stroke="#22C55E" strokeWidth={1.5} dot={{ r:3 }}/><Line type="monotone" dataKey="traditional" name="Traditional Servers" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r:3 }}/></LineChart>
        </ResponsiveContainer></div>
      </Card>
      <div className="mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-emerald-400">Why serverless matters:</strong> A traditional server stack for this architecture would require $3,000–$6,000/month in dedicated infrastructure before a single user signs up. GCP serverless scales to near-zero when idle overnight, and auto-scales to thousands of concurrent safari viewers instantly with no pre-provisioning. This makes the $25,000 capital ask viable — you're not buying hardware, you're buying engineering time to build the software.
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   Submit Dataset Modal
---------------------------------------------------------------------------- */
const SubmitModal: React.FC<{ open: boolean; onClose: ()=>void }> = ({ open, onClose }) => {
  const [perm, setPerm] = useState<'sp'|'sr'|'sv'>('sp');
  const [status, setStatus] = useState('');
  if (!open) return null;
  const desc = { sp:'Publicly discoverable — flows automatically to Discovery layer with zero manual review required. Default recommended.', sr:'Only organizations with a signed data-sharing agreement can access. You control who.', sv:'Only your organization and explicitly invited collaborators. Does not appear in any search results.' }[perm];
  const fakeUp = () => { setStatus('Uploading…'); setTimeout(()=>setStatus('✓ Schema validated · running quality check…'),900); setTimeout(()=>setStatus('✓ Quality score: 94/100 · ready to submit'),1800); };
  const submit = () => { setStatus('Submitting to Kafka queue…'); setTimeout(()=>setStatus('✓ Stream processor routing: Flink → TimescaleDB → Discovery'),700); setTimeout(()=>{ setStatus('✅ Submitted · dashboard updating · audit log entry created'); setTimeout(onClose,1600); },1500); };
  const pbtnCls: Record<string,string> = {
    sp:'border-emerald-500 text-emerald-400 bg-emerald-500/[0.08]',
    sr:'border-amber-500 text-amber-400 bg-amber-500/[0.08]',
    sv:'border-blue-500 text-blue-400 bg-blue-500/[0.08]',
  };
  const pbtn = (k:'sp'|'sr'|'sv', label:string) => (
    <button onClick={()=>setPerm(k)} className={`flex-1 py-1.5 rounded-md border text-[11px] font-medium transition-colors ${perm===k?pbtnCls[k]:'border-input text-muted-foreground bg-secondary'}`}>{label}</button>
  );
  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm grid place-items-center" onClick={(e)=>e.target===e.currentTarget&&onClose()}>
      <div className="w-[450px] max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border"><div className="text-[15px] font-extrabold text-foreground">Submit Dataset</div><button onClick={onClose} className="w-[22px] h-[22px] grid place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5"/></button></div>
        <div className="p-4 space-y-3">
          <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-bold mb-1">Organization</div><input readOnly value="Arizona Game & Fish Department" className="w-full bg-secondary border border-input rounded-lg px-2.5 py-2 text-[13px] text-foreground outline-none"/></div>
          <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-bold mb-1">Dataset Title</div><input placeholder="e.g. Sonoran Desert Reptile Survey Q2 2026" className="w-full bg-secondary border border-input rounded-lg px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-primary"/></div>
          <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-bold mb-1">Ecosystem Type</div><select className="w-full bg-secondary border border-input rounded-lg px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-primary"><option>Desert &amp; Arid Lands</option><option>Marine &amp; Coastal</option><option>Freshwater &amp; Wetlands</option><option>Forest &amp; Woodland</option><option>Coral Reef</option><option>Grassland &amp; Prairie</option></select></div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-bold mb-1">Permission Level</div>
            <div className="flex gap-1.5">{pbtn('sp','🌍 Public')}{pbtn('sr','🔒 Restricted')}{pbtn('sv','🔐 Private')}</div>
            <div className="text-[11px] text-muted-foreground/70 mt-1">{desc}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70 font-bold mb-1">Upload Files</div>
            <div onClick={fakeUp} className="border-2 border-dashed border-input rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-emerald-500/[0.03] transition-colors">
              <div className="text-2xl mb-1">📁</div><div className="text-[13px] text-muted-foreground">Drop files here or <span className="text-emerald-400">browse</span></div><div className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">CSV · JSON · GeoJSON · Shapefile · PDF · Images</div>
            </div>
            {status && <div className="text-[11px] font-mono text-emerald-400 mt-1">{status}</div>}
          </div>
          <div className="text-[12px] text-muted-foreground bg-emerald-500/[0.06] border border-emerald-500/20 rounded-md px-2.5 py-2 leading-relaxed">✓ Schema validation runs automatically on upload. Data quality score (0–100) assigned by the stream processor. Score published with dataset in the discovery layer.</div>
        </div>
        <div className="flex justify-end gap-1.5 px-4 py-3 border-t border-border"><button onClick={onClose} className="px-4 py-1.5 rounded-full border border-input text-muted-foreground text-[12px] font-semibold hover:border-primary hover:text-emerald-400">Cancel</button><button onClick={submit} className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[12px] font-bold">Submit to Platform</button></div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   Main Backend page
---------------------------------------------------------------------------- */
const Backend: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState(false);
  const [mapTip, setMapTip] = useState('→ Click any pin to view organization details');
  const [k1, setK1] = useState(247);
  const [k2, setK2] = useState(1843);
  const [feed, setFeed] = useState(FEED_SEED);
  const fi = useRef(0);
  // safari live state
  const [species, setSpecies] = useState('Gila Woodpecker');
  const [tagged, setTagged] = useState(17);
  const [clock, setClock] = useState('14:32:07');
  const [track] = useState(Array.from({length:20},(_,i)=>({ x:i, y:30+Math.sin(i*0.4)*12+Math.random()*8 })));
  const [log, setLog] = useState([
    { c:'#22C55E', sp:'Gila Woodpecker', d:'Visual · GPS locked · 94% confidence', t:'just now' },
    { c:'#14B8A6', sp:'Cactus Wren', d:'Audio · saguaro nesting · 89%', t:'2m ago' },
    { c:'#F59E0B', sp:'Gila Monster', d:'Visual · basking behavior · 97%', t:'5m ago' },
    { c:'#3B82F6', sp:'Roadrunner', d:'Visual · foraging · 91%', t:'9m ago' },
  ]);

  // live tickers
  useEffect(() => {
    const t = setInterval(() => {
      setK1(v => v + Math.floor(Math.random()*3));
      setK2(v => v + Math.floor(Math.random()*8+1));
      const e = { ...FEED_EXTRA[fi.current % FEED_EXTRA.length], t:'just now' };
      fi.current++;
      setFeed(prev => [e, ...prev].slice(0,7).map((x,i)=>({ ...x, t:['just now','1m ago','3m ago','5m ago','7m ago','10m ago','14m ago'][i] })));
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // safari ticker (only meaningful on safari page but cheap to run)
  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-US',{ hour12:false }));
      const sp = SAFARI_SPECIES[Math.floor(Math.random()*SAFARI_SPECIES.length)];
      setSpecies(sp);
      setTagged(v => v + 1);
      setLog(prev => [{ c:'#22C55E', sp, d:`Visual · GPS locked · ${Math.floor(88+Math.random()*10)}% confidence`, t:'just now' }, ...prev].slice(0,10));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const onNav = (item: any) => {
    if (item.action === 'modal') return setModal(true);
    if (item.action === 'chat') return navigate('/ai/forest');
    if (item.action === 'home') return navigate('/');
    setPage(item.id);
  };

  const titleMap: Record<string,[string,string]> = {
    dashboard:['Live Dashboard','Real-time data · 38 organizations'],
    pipeline:['Data Pipeline','Kafka → Flink → Storage → API · seconds to dashboard'],
    satellite:['Satellite Feeds','NASA · ESA · USGS · NOAA · Planet Labs'],
    safari:['Live Safari','Drone ZB-04 · Sonoran Desert · WebRTC'],
    fieldsync:['Field Sync','Offline-first CRDT · 4 devices · 1,247 records queued'],
    discovery:['Public Discovery','Search conservation data · Weaviate semantic search'],
    collab:['Collaboration','Neo4j graph network · 3 new researcher matches'],
    predict:['Intelligence','Vertex AI · Anomaly detection · Forecasting'],
    permissions:['Permissions & Audit','Immutable log · Field-level controls · Quality scores'],
    techstack:['Tech Stack','8-layer backend architecture'],
    cost:['Infrastructure Cost','$430–$1,220/mo · GCP serverless'],
  };
  const [t0,t1] = titleMap[page] || ['',''];

  const Section: React.FC<{ title:string; items:any[] }> = ({ title, items }) => (
    <div className="py-1.5 border-b border-border">
      <div className="px-3.5 pt-2 pb-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60 font-semibold">{title}</div>
      {items.map(it => {
        const Icon = it.icon;
        const active = page === it.id;
        return (
          <button key={it.id} onClick={()=>onNav(it)} className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-[13px] border-l-2 transition-colors ${active?'bg-emerald-500/[0.07] text-emerald-400 border-l-emerald-500':'text-muted-foreground border-l-transparent hover:bg-secondary/60 hover:text-foreground'}`}>
            <Icon className="h-3.5 w-3.5 shrink-0" /><span className="flex-1 text-left">{it.label}</span>
            {it.badge && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 rounded font-mono">{it.badge}</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-hidden">
      <style>{`@keyframes zbping{0%{transform:translate(-50%,-50%) scale(1);opacity:.8}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}.zb-ping{animation:zbping 1.8s infinite}`}</style>
      <div className="grid grid-cols-[224px_1fr] h-full overflow-hidden">
        {/* sidebar */}
        <aside className="bg-card/80 border-r border-border overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="" className="w-[30px] h-[30px] rounded-full object-cover shrink-0 shadow-[0_0_12px_rgba(34,197,94,.35)]" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}}/>
              <div><div className="text-[13px] font-extrabold text-foreground uppercase tracking-wide">Zytherion <span className="text-emerald-400">Biovance</span></div><div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5"><span className="w-[5px] h-[5px] rounded-full bg-emerald-400 animate-pulse"/>Live Platform</div></div>
            </div>
          </div>
          <div className="p-2.5 border-b border-border"><div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-secondary border border-border cursor-pointer"><div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-emerald-700 to-emerald-400 grid place-items-center text-[10px] font-bold text-black">AZ</div><div><div className="text-[12px] font-semibold text-foreground">AZ Game &amp; Fish</div><div className="text-[10px] text-muted-foreground">Partner Organization</div></div></div></div>
          <Section title="Platform" items={NAV.platform} />
          <Section title="Data" items={NAV.data} />
          <Section title="System" items={NAV.system} />
        </aside>

        {/* main */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center px-4 h-12 bg-card/80 border-b border-border shrink-0">
            <button onClick={()=>navigate(-1)} className="h-8 w-8 grid place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary mr-3"><ArrowLeft className="h-4 w-4"/></button>
            <div><div className="text-[14px] font-bold text-foreground">{t0}</div><div className="text-[11px] text-muted-foreground">{t1}</div></div>
            <div className="ml-auto flex gap-1.5">
              <button onClick={()=>setModal(true)} className="px-3 py-1.5 rounded-full border border-input text-muted-foreground text-[11px] font-semibold hover:border-primary hover:text-emerald-400">+ Submit Data</button>
              <button className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">Export</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {page==='dashboard' && <Dashboard feed={feed} k1={k1} k2={k2} setMapTip={setMapTip} mapTip={mapTip} />}
            {page==='pipeline' && <Pipeline />}
            {page==='satellite' && <Satellite_View />}
            {page==='safari' && <Safari species={species} tagged={tagged} clock={clock} track={track} log={log} />}
            {page==='fieldsync' && <FieldSync />}
            {page==='discovery' && <Discovery />}
            {page==='collab' && <Collab />}
            {page==='predict' && <Predict />}
            {page==='permissions' && <Permissions />}
            {page==='techstack' && <TechStack />}
            {page==='cost' && <Cost />}
          </div>
        </div>
      </div>
      <SubmitModal open={modal} onClose={()=>setModal(false)} />
    </div>
  );
};

export default Backend;
