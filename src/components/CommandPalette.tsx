import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PaletteItem {
  id: string
  label: string
  section: string
  mono: string
}

const items: PaletteItem[] = [
  { id: 'hero', label: 'Hero', section: '#hero', mono: 'HOME' },
  { id: 'problem', label: 'The Problem — Three Axes', section: '#problem', mono: 'PROBLEM' },
  { id: 'pipeline', label: 'Pipeline Walkthrough', section: '#pipeline', mono: 'PIPELINE' },
  { id: 'stage-0', label: 'Stage 0 — Ingestion & Tiling', section: '#pipeline', mono: 'STG 0' },
  { id: 'stage-1', label: 'Stage 1 — Illumination Correction', section: '#pipeline', mono: 'STG 1' },
  { id: 'stage-2', label: 'Stage 2 — Phase Congruency', section: '#pipeline', mono: 'STG 2' },
  { id: 'stage-3', label: 'Stage 3 — Hierarchical Matching', section: '#pipeline', mono: 'STG 3' },
  { id: 'stage-4', label: 'Stage 4 — Outlier Pruning & Warping', section: '#pipeline', mono: 'STG 4' },
  { id: 'stage-5', label: 'Stage 5 — Geodetic Tying & Export', section: '#pipeline', mono: 'STG 5' },
  { id: 'comparison', label: 'Live Comparison Demo', section: '#comparison', mono: 'DEMO' },
  { id: 'results', label: 'Results Dashboard', section: '#results', mono: 'METRICS' },
  { id: 'engineering', label: 'Engineering Approach', section: '#engineering', mono: 'APPROACH' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.mono.toLowerCase().includes(query.toLowerCase())
  )

  const navigate = useCallback(
    (item: PaletteItem) => {
      setOpen(false)
      setQuery('')
      const el = document.querySelector(item.section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    []
  )

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Open: Cmd+K or /
      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (e.key === '/' && !open && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setOpen(true)
        return
      }
      // Close: Escape
      if (e.key === 'Escape' && open) {
        setOpen(false)
        setQuery('')
        return
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  // Arrow navigation
  useEffect(() => {
    if (!open) return
    function handleNav(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault()
        navigate(filtered[selectedIdx])
      }
    }
    window.addEventListener('keydown', handleNav)
    return () => window.removeEventListener('keydown', handleNav)
  }, [open, filtered, selectedIdx, navigate])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <>
      {/* Trigger hint */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 glass-card rounded-sm px-3 py-1.5 flex items-center gap-2 hover:border-text-muted transition-colors cursor-pointer group"
        aria-label="Open command palette"
      >
        <span className="font-mono text-[10px] text-text-muted group-hover:text-text-secondary transition-colors">
          Navigate
        </span>
        <kbd className="font-mono text-[9px] text-text-muted bg-base-elevated px-1.5 py-0.5 rounded border border-base-border">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-base/60 backdrop-blur-sm"
              onClick={() => { setOpen(false); setQuery('') }}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed z-[101] top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg"
            >
              <div className="glass-card rounded-sm overflow-hidden border border-base-border shadow-2xl">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-base-border">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8F9C" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Jump to section..."
                    className="flex-1 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-muted outline-none"
                  />
                  <kbd className="font-mono text-[9px] text-text-muted bg-base-elevated px-1.5 py-0.5 rounded border border-base-border">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto py-1">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-6 font-mono text-xs text-text-muted text-center">
                      No results found
                    </p>
                  ) : (
                    filtered.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setSelectedIdx(i)}
                        className={`
                          w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors
                          ${i === selectedIdx ? 'bg-base-surface' : 'hover:bg-base-elevated'}
                        `}
                      >
                        <span
                          className={`
                            font-mono text-[10px] tracking-wider w-16 shrink-0
                            ${i === selectedIdx ? 'text-cyan' : 'text-text-muted'}
                          `}
                        >
                          {item.mono}
                        </span>
                        <span
                          className={`
                            text-sm
                            ${i === selectedIdx ? 'text-text-primary' : 'text-text-secondary'}
                          `}
                        >
                          {item.label}
                        </span>
                        {i === selectedIdx && (
                          <span className="ml-auto font-mono text-[9px] text-text-muted">
                            ↵
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
