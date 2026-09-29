import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  { text: 'INITIALIZING GEOPHASE-LUNAR v0.9.2', delay: 0 },
  { text: 'LOADING SPICE KERNELS... CK/SPK/FK ATTACHED', delay: 200 },
  { text: 'INDEXING OHRC TILES... 1180 TILES FOUND', delay: 450 },
  { text: 'INDEXING TMC-2 STEREO PAIRS... 342 PAIRS', delay: 650 },
  { text: 'INDEXING IIRS CUBES... 89 HYPERSPECTRAL CUBES', delay: 800 },
  { text: 'CALIBRATING LOG-GABOR FILTERBANK [4s×6o]', delay: 950 },
  { text: 'WARMING SUPERGLUE / E-LOFTR WEIGHTS', delay: 1100 },
  { text: 'LOADING SLDEM2015 FALLBACK DEM', delay: 1200 },
  { text: 'PHASE CONGRUENCY ENGINE... READY', delay: 1350 },
  { text: 'ALL SUBSYSTEMS NOMINAL', delay: 1550, highlight: true },
]

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    sessionStorage.setItem('geophase-booted', '1')
    setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 400)
  }, [exiting, onComplete])

  useEffect(() => {
    // Skip if already played this session
    if (sessionStorage.getItem('geophase-booted')) {
      setVisible(false)
      onComplete()
      return
    }

    // Show lines one by one
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1)
        setProgress(((i + 1) / BOOT_LINES.length) * 100)
      }, line.delay)
    })

    // Auto-dismiss after last line
    const totalTime = BOOT_LINES[BOOT_LINES.length - 1].delay + 500
    const timer = setTimeout(dismiss, totalTime)
    return () => clearTimeout(timer)
  }, [onComplete, dismiss])

  // Click/key to skip
  useEffect(() => {
    const handler = () => dismiss()
    window.addEventListener('click', handler)
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [dismiss])

  if (!visible) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-[#05060A] flex flex-col items-center justify-center"
        >
          {/* Terminal output */}
          <div className="w-full max-w-xl px-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse-subtle" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">
                System Boot
              </span>
            </div>

            {/* Log lines */}
            <div className="space-y-1 mb-8 min-h-[280px]">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2"
                >
                  <span className="font-mono text-[10px] text-text-muted shrink-0 mt-[2px] w-12 text-right">
                    {String(i).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">{'>'}</span>
                  <span
                    className={`font-mono text-xs leading-relaxed ${
                      line.highlight
                        ? 'text-cyan font-semibold'
                        : 'text-text-secondary'
                    }`}
                  >
                    {line.text}
                    {i === visibleLines - 1 && !line.highlight && (
                      <span className="inline-block w-1.5 h-3 bg-cyan/60 ml-1 animate-pulse" />
                    )}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="relative h-px w-full bg-base-border overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full"
                style={{
                  background: 'linear-gradient(90deg, #3EC6E0, #2C8FBF)',
                  boxShadow: '0 0 8px rgba(62, 198, 224, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              className="font-mono text-[9px] text-text-muted mt-4 text-center tracking-[0.2em]"
            >
              CLICK OR PRESS ANY KEY TO SKIP
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
