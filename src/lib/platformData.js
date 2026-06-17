// Platform data layer — real Supabase reads + writes.
// The dashboard, submit form, and search all go through here.

import { supabase } from './supabase'

// --- WRITE: submit a new dataset ------------------------------------------
// Stores the dataset AND logs an activity row (so the live feed updates).
export async function submitDataset(payload) {
  const row = {
    title: payload.title,
    org: payload.org || null,
    description: payload.description || null,
    ecosystem: payload.ecosystem || null,
    type: payload.type || 'dataset',
    species: payload.species || null,
    tags: payload.tags || [],
    permission: payload.permission || 'public',
    record_count: Number(payload.record_count) || 0,
    // simple auto quality score: more complete = higher
    quality_score: scoreQuality(payload),
  }

  const { data, error } = await supabase.from('datasets').insert(row).select().single()
  if (error) return { ok: false, error: error.message }

  // log activity (best-effort; don't fail the submit if this errors)
  await supabase.from('activity').insert({
    org: row.org || 'New submission',
    description: `${row.title} — ${row.record_count.toLocaleString()} records ingested`,
    color: ecosystemColor(row.ecosystem),
  })

  return { ok: true, data }
}

function scoreQuality(p) {
  let score = 60
  if (p.title) score += 10
  if (p.description && p.description.length > 20) score += 10
  if (p.ecosystem) score += 8
  if (p.species) score += 6
  if (Number(p.record_count) > 0) score += 6
  return Math.min(score, 100)
}

function ecosystemColor(eco) {
  const map = { Desert: '#F59E0B', Marine: '#14B8A6', Forest: '#16A34A', Freshwater: '#3B82F6', Coral: '#EF4444', Grassland: '#22C55E' }
  return map[eco] || '#22C55E'
}

// --- READ: dashboard stats ------------------------------------------------
export async function getStats() {
  const [datasets, orgs, activity] = await Promise.all([
    supabase.from('datasets').select('id, record_count, ecosystem, permission, quality_score', { count: 'exact' }),
    supabase.from('organizations').select('id', { count: 'exact' }),
    supabase.from('activity').select('id', { count: 'exact' }),
  ])

  const rows = datasets.data || []
  const totalRecords = rows.reduce((sum, r) => sum + (r.record_count || 0), 0)

  // ecosystem breakdown
  const ecoMap = {}
  rows.forEach((r) => { if (r.ecosystem) ecoMap[r.ecosystem] = (ecoMap[r.ecosystem] || 0) + 1 })
  const byEcosystem = Object.entries(ecoMap).map(([name, value]) => ({ name, value }))

  // permission breakdown
  const permMap = { public: 0, restricted: 0, private: 0 }
  rows.forEach((r) => { permMap[r.permission] = (permMap[r.permission] || 0) + 1 })

  return {
    datasetCount: datasets.count || 0,
    orgCount: orgs.count || 0,
    activityCount: activity.count || 0,
    totalRecords,
    byEcosystem,
    permissions: permMap,
    avgQuality: rows.length ? Math.round(rows.reduce((s, r) => s + (r.quality_score || 0), 0) / rows.length) : 0,
  }
}

// --- READ: recent datasets ------------------------------------------------
export async function getDatasets(limit = 20) {
  const { data, error } = await supabase
    .from('datasets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data || []
}

// --- READ: live activity feed ---------------------------------------------
export async function getActivity(limit = 8) {
  const { data, error } = await supabase
    .from('activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data || []
}

// --- READ: search datasets (used by the Search page) ----------------------
export async function searchDatasets(query) {
  const { data, error } = await supabase
    .from('datasets')
    .select('title, org, description, type, ecosystem, tags, record_count')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,species.ilike.%${query}%`)
    .limit(8)
  if (error) return []
  return (data || []).map((d) => ({ ...d, _source: 'biovance' }))
}

// relative time helper for the feed
export function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
