// Conservation search data layer.
// - GBIF: live, free, open biodiversity API (no key needed). Powers real species results.
// - Supabase: your own curated datasets (optional). Clearly marked hook below — wire it
//   up whenever you add tables. Until then, Search works fully on GBIF alone.

import { supabase } from './supabase'
import { searchDatasets } from './platformData'

const GBIF = 'https://api.gbif.org/v1'

// --- GBIF: species search -------------------------------------------------
// Returns matched species with vernacular (common) names, taxonomy, and a key
// we can use to fetch an occurrence/photo.
export async function searchSpecies(query, limit = 8) {
  try {
    const res = await fetch(`${GBIF}/species/search?q=${encodeURIComponent(query)}&rank=SPECIES&status=ACCEPTED&limit=${limit}`)
    if (!res.ok) throw new Error(`GBIF species ${res.status}`)
    const data = await res.json()
    const results = (data.results || []).filter((r) => r.canonicalName)
    // de-dupe by canonical name
    const seen = new Set()
    return results.filter((r) => {
      if (seen.has(r.canonicalName)) return false
      seen.add(r.canonicalName)
      return true
    })
  } catch (e) {
    console.error('searchSpecies failed:', e)
    return []
  }
}

// --- GBIF: a representative photo for a species (best-effort) --------------
export async function speciesImage(taxonKey) {
  try {
    const res = await fetch(`${GBIF}/occurrence/search?taxonKey=${taxonKey}&mediaType=StillImage&limit=1`)
    if (!res.ok) return null
    const data = await res.json()
    const media = data.results?.[0]?.media?.[0]
    return media?.identifier || null
  } catch {
    return null
  }
}

// --- GBIF: occurrence counts (how many records exist, gives a "data depth" feel) ---
export async function occurrenceCount(taxonKey) {
  try {
    const res = await fetch(`${GBIF}/occurrence/search?taxonKey=${taxonKey}&limit=0`)
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.count === 'number' ? data.count : null
  } catch {
    return null
  }
}

// --- Supabase: YOUR curated datasets ---------------------------------------
// Now wired to the real `datasets` table (see supabase/schema.sql + platformData.js).
// Anything you submit through the Platform backend becomes searchable here.
export async function searchMyDatasets(query) {
  try {
    return await searchDatasets(query)
  } catch {
    return []
  }
}

// --- Combined search: blends your data (first) with live GBIF species ------
export async function runSearch(query) {
  const [mine, species] = await Promise.all([
    searchMyDatasets(query),
    searchSpecies(query),
  ])
  return { mine, species }
}
