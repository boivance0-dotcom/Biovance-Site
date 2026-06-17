import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, Database, Plus, ArrowLeft, Loader2, X, Check,
  TrendingUp, Layers, ShieldCheck, Search as SearchIcon,
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import { getStats, getDatasets, getActivity, submitDataset, timeAgo } from '../lib/platformData'

const ECO_COLORS = { Desert: '#F59E0B', Marine: '#14B8A6', Forest: '#16A34A', Freshwater: '#3B82F6', Coral: '#EF4444', Grassland: '#22C55E' }
const PERM_COLORS = { public: '#22C55E', restricted: '#F59E0B', private: '#3B82F6' }

const Backend = () => {
  const [stats, setStats] = useState(null)
  const [datasets, setDatasets] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [s, d, a] = await Promise.all([getStats(), getDatasets(), getActivity()])
    setStats(s); setDatasets(d); setActivity(a); setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const ecoData = (stats?.byEcosystem || []).map((e) => ({ ...e, color: ECO_COLORS[e.name] || '#22C55E' }))
  const permData = stats ? Object.entries(stats.permissions).map(([name, value]) => ({ name, value, color: PERM_COLORS[name] })) : []
  const recordsByDataset = datasets.slice(0, 7).map((d) => ({ name: (d.title || '').slice(0, 12), records: d.record_count || 0 }))

  return (
    <div className="min-h-screen text-white relative" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.10), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(20,184,166,0.08), transparent 55%), linear-gradient(180deg, #071109 0%, #0a1610 45%, #081410 100%)' }}>
      {/* subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0c1810]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center gap-3 px-5 py-3">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="font-extrabold tracking-tight">Zytherion <span className="text-green-400">Biovance</span></div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 ml-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Platform
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/search" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white text-sm">
              <SearchIcon className="w-4 h-4" /> Search
            </Link>
            <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-600 hover:bg-green-500 transition text-sm font-bold">
              <Plus className="w-4 h-4" /> Submit Dataset
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black">Live Dashboard</h1>
          <p className="text-white/50 text-sm">Real-time data from your platform database · Supabase-backed</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-white/60 py-24">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading platform data…
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <KPI icon={Database} accent="#22C55E" label="Datasets" value={stats.datasetCount} />
              <KPI icon={Layers} accent="#14B8A6" label="Total Records" value={stats.totalRecords.toLocaleString()} />
              <KPI icon={TrendingUp} accent="#F59E0B" label="Partner Orgs" value={stats.orgCount} />
              <KPI icon={ShieldCheck} accent="#3B82F6" label="Avg Quality" value={`${stats.avgQuality}/100`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
              <Card title="Records by Dataset" className="lg:col-span-1">
                <div className="h-[180px] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recordsByDataset}>
                      <CartesianGrid stroke="#ffffff12" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#7aa882' }} />
                      <YAxis tick={{ fontSize: 9, fill: '#7aa882' }} width={30} />
                      <Bar dataKey="records" fill="#16A34A" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card title="By Ecosystem">
                <div className="h-[180px] p-2">
                  {ecoData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ecoData} dataKey="value" innerRadius={38} outerRadius={62} paddingAngle={2}>
                          {ecoData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <Empty />}
                </div>
              </Card>
              <Card title="Permissions">
                <div className="h-[180px] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={permData} dataKey="value" innerRadius={38} outerRadius={62} paddingAngle={2}>
                        {permData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Datasets + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card title="Datasets" right={<span className="text-xs text-white/40">{datasets.length} shown</span>}>
                <div className="divide-y divide-white/5 max-h-[340px] overflow-y-auto">
                  {datasets.length ? datasets.map((d) => (
                    <div key={d.id} className="p-3 hover:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm">{d.title}</span>
                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md font-bold" style={{ color: ECO_COLORS[d.ecosystem] || '#22C55E', background: (ECO_COLORS[d.ecosystem] || '#22C55E') + '1a' }}>{d.ecosystem || d.type}</span>
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">{d.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-white/40">
                        {d.org && <span className="text-green-400">{d.org}</span>}
                        <span>{(d.record_count || 0).toLocaleString()} records</span>
                        <span>Q {d.quality_score}/100</span>
                      </div>
                    </div>
                  )) : <Empty label="No datasets yet — click Submit Dataset to feed the platform." />}
                </div>
              </Card>
              <Card title="Live Ingest Feed" right={<span className="text-xs text-green-400">streaming</span>}>
                <div className="divide-y divide-white/5 max-h-[340px] overflow-y-auto">
                  {activity.length ? activity.map((a) => (
                    <div key={a.id} className="flex gap-2 p-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{a.org}</div>
                        <div className="text-xs text-white/50">{a.description}</div>
                      </div>
                      <div className="text-[10px] text-white/30 whitespace-nowrap">{timeAgo(a.created_at)}</div>
                    </div>
                  )) : <Empty label="No activity yet." />}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>

      {modal && <SubmitModal onClose={() => setModal(false)} onDone={() => { setModal(false); load() }} />}
    </div>
  )
}

const KPI = ({ icon: Icon, accent, label, value }) => (
  <div className="relative rounded-xl border border-white/10 p-4 overflow-hidden shadow-lg" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))' }}>
    <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: accent }} />
    <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: accent }} />
    <Icon className="w-4 h-4 mb-2" style={{ color: accent }} />
    <div className="text-2xl font-extrabold leading-none">{value}</div>
    <div className="text-[11px] text-white/50 mt-1 uppercase tracking-wide">{label}</div>
  </div>
)

const Card = ({ title, right, children, className = '' }) => (
  <div className={`rounded-xl border border-white/10 overflow-hidden shadow-lg backdrop-blur-sm ${className}`} style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))' }}>
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
      <span className="text-sm font-bold">{title}</span>{right}
    </div>
    {children}
  </div>
)

const Empty = ({ label = 'No data yet.' }) => (
  <div className="grid place-items-center h-full text-center text-white/40 text-sm p-8">{label}</div>
)

const SubmitModal = ({ onClose, onDone }) => {
  const [form, setForm] = useState({ title: '', org: '', description: '', ecosystem: 'Desert', type: 'dataset', species: '', record_count: '', permission: 'public' })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.title.trim()) { setStatus('Title is required.'); return }
    setSaving(true); setStatus('Storing in platform database…')
    const tags = []
    const res = await submitDataset({ ...form, tags })
    if (res.ok) {
      setStatus('✓ Stored · dashboard + search updated')
      setTimeout(onDone, 800)
    } else {
      setSaving(false)
      setStatus('Error: ' + res.error + ' (did you run supabase/schema.sql?)')
    }
  }

  const field = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500'

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1810] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="font-extrabold">Submit Dataset</span>
          <button onClick={onClose} className="w-6 h-6 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <Inp label="Title *" v={form.title} on={(v) => set('title', v)} cls={field} ph="e.g. Sonoran Reptile Survey Q2" />
          <Inp label="Organization" v={form.org} on={(v) => set('org', v)} cls={field} ph="e.g. Arizona Game & Fish" />
          <div>
            <Lbl>Description</Lbl>
            <textarea className={field} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What's in this dataset?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Lbl>Ecosystem</Lbl>
              <select className={field} value={form.ecosystem} onChange={(e) => set('ecosystem', e.target.value)}>
                {['Desert', 'Marine', 'Forest', 'Freshwater', 'Coral', 'Grassland'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Type</Lbl>
              <select className={field} value={form.type} onChange={(e) => set('type', e.target.value)}>
                {['dataset', 'program', 'research', 'volunteer'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Primary Species" v={form.species} on={(v) => set('species', v)} cls={field} ph="optional" />
            <Inp label="Record Count" v={form.record_count} on={(v) => set('record_count', v)} cls={field} ph="e.g. 142" type="number" />
          </div>
          <div>
            <Lbl>Permission</Lbl>
            <div className="flex gap-2">
              {['public', 'restricted', 'private'].map((p) => (
                <button key={p} onClick={() => set('permission', p)} className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold capitalize ${form.permission === p ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-white/15 text-white/60'}`}>{p}</button>
              ))}
            </div>
          </div>
          {status && <div className="text-xs font-mono text-green-400">{status}</div>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-1.5 rounded-full border border-white/15 text-white/70 text-sm">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-1.5 rounded-full bg-green-600 hover:bg-green-500 text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit
          </button>
        </div>
      </div>
    </div>
  )
}

const Lbl = ({ children }) => <div className="text-[10px] uppercase tracking-wide text-white/40 font-bold mb-1">{children}</div>
const Inp = ({ label, v, on, cls, ph, type = 'text' }) => (
  <div><Lbl>{label}</Lbl><input type={type} className={cls} value={v} onChange={(e) => on(e.target.value)} placeholder={ph} /></div>
)

export default Backend
