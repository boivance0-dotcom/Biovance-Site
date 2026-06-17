import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, ArrowLeft, ExternalLink, Loader2, Leaf, Database } from 'lucide-react'
import { motion } from 'framer-motion'
import { runSearch, speciesImage, occurrenceCount } from '../lib/conservationSearch'

const TRENDING = ['Monarch butterfly', 'Coral reef', 'Gray wolf', 'Sea turtle', 'Saguaro cactus', 'Bald eagle']

const Search = () => {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [loading, setLoading] = useState(false)
  const [mine, setMine] = useState([])
  const [species, setSpecies] = useState([])
  const [enriched, setEnriched] = useState({})

  const doSearch = useCallback(async (q) => {
    const term = (q ?? query).trim()
    if (!term) return
    setSubmitted(term)
    setLoading(true)
    setMine([])
    setSpecies([])
    setEnriched({})

    const { mine, species } = await runSearch(term)
    setMine(mine)
    setSpecies(species)
    setLoading(false)

    species.forEach(async (s) => {
      const [img, count] = await Promise.all([speciesImage(s.key), occurrenceCount(s.key)])
      setEnriched((prev) => ({ ...prev, [s.key]: { img, count } }))
    })
  }, [query])

  const onKey = (e) => { if (e.key === 'Enter') doSearch() }

  return (
    <div className="min-h-screen bg-[#0b140e] text-white">
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-5 py-3">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/" className="font-extrabold tracking-tight text-lg">Biovance</Link>
          <span className="ml-auto text-xs text-white/50 hidden sm:flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-green-400" /> Live data via GBIF
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0b140e]/70 to-[#0b140e]" />
        <div className="relative max-w-3xl mx-auto px-5 pt-14 pb-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black mb-2">
            All-in-One Search
          </motion.h1>
          <p className="text-white/70 mb-7">Real biodiversity data — search any species, ecosystem, or organism on Earth.</p>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search species, ecosystems, wildlife…"
              className="w-full rounded-full bg-white/95 text-gray-900 pl-6 pr-14 py-4 text-base outline-none shadow-2xl"
            />
            <button onClick={() => doSearch()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-green-600 hover:bg-green-500 transition">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SearchIcon className="w-5 h-5" />}
            </button>
          </div>
          {!submitted && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {TRENDING.map((t) => (
                <button key={t} onClick={() => { setQuery(t); doSearch(t) }} className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition">
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 pb-20">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-white/60 py-16">
            <Loader2 className="w-5 h-5 animate-spin" /> Searching global biodiversity records…
          </div>
        )}

        {!loading && submitted && species.length === 0 && mine.length === 0 && (
          <div className="text-center text-white/60 py-16">
            No results for &ldquo;{submitted}&rdquo;. Try a common name like &ldquo;gray wolf&rdquo; or a scientific name.
          </div>
        )}

        {mine.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
              <Database className="w-4 h-4" /> Biovance Datasets
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {mine.map((d, i) => (
                <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <div className="text-[10px] uppercase tracking-wider text-green-400 font-bold mb-1">{d.type || 'Dataset'}</div>
                  <div className="font-bold mb-1">{d.title}</div>
                  <div className="text-sm text-white/60">{d.description}</div>
                  {d.org && <div className="text-xs text-green-400 mt-2">{d.org}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {species.length > 0 && (
          <div>
            <div className="text-sm text-white/50 mb-3">
              {species.length} species matched for <span className="text-white font-semibold">{submitted}</span> · source: GBIF
            </div>
            <div className="space-y-3">
              {species.map((s) => {
                const ex = enriched[s.key] || {}
                return (
                  <div key={s.key} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition">
                    <div className="w-20 h-20 rounded-lg bg-white/10 overflow-hidden shrink-0 grid place-items-center">
                      {ex.img
                        ? <img src={ex.img} alt={s.canonicalName} className="w-full h-full object-cover" loading="lazy" />
                        : <Leaf className="w-7 h-7 text-green-500/50" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-lg leading-tight">
                        {s.vernacularName || s.canonicalName}
                      </div>
                      <div className="text-sm italic text-white/50">{s.canonicalName}</div>
                      <div className="text-xs text-white/40 mt-1">
                        {[s.kingdom, s.phylum, s.class, s.order, s.family].filter(Boolean).join(' \u203a ')}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {typeof ex.count === 'number' && (
                          <span className="text-xs text-green-400">{ex.count.toLocaleString()} occurrence records</span>
                        )}
                        <a
                          href={`https://www.gbif.org/species/${s.key}`}
                          target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-300 hover:underline"
                        >
                          View on GBIF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {submitted && !loading && (
          <div className="text-center mt-10">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-700 hover:bg-green-600 transition text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" /> Return to Biovance home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
