import { motion } from 'framer-motion'
import Starfield from './Starfield'
import TiePointAnimation from './TiePointAnimation'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <Starfield />

      {/* Subtle ambient glow — single amber spot, restrained */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Mono tag */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-mono text-xs sm:text-sm tracking-[0.2em] text-text-secondary mb-6 uppercase"
            >
              SIH 2026 · PS 26166 · ISRO · Space Technology
            </motion.p>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="font-display text-hero font-bold tracking-tight text-text-primary">
                GeoPhase
                <span className="text-cyan">-</span>
                Lunar
              </h1>
            </motion.div>

            {/* Mission statement */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed font-body"
            >
              Multi-modal, sun-angle &amp; scale-invariant image correspondence
              for Chandrayaan-2 imagery — bridging a{' '}
              <span className="font-mono text-amber font-medium">320×</span>{' '}
              scale gap between OHRC, TMC-2, and IIRS payloads through
              phase-congruency features and cascaded hierarchical matching.
            </motion.p>

            {/* Spec line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-text-muted tracking-wider"
            >
              <span>OHRC 0.25 m/px</span>
              <span className="text-base-border">|</span>
              <span>TMC-2 5.0 m/px</span>
              <span className="text-base-border">|</span>
              <span>IIRS 80.0 m/px</span>
              <span className="text-base-border">|</span>
              <span>256 spectral bands</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="mt-10 flex gap-4"
            >
              <a
                href="#pipeline"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-amber/10 border border-amber/30 rounded-sm text-amber font-mono text-sm tracking-wide hover:bg-amber/20 hover:border-amber/50 transition-all duration-300"
              >
                View Pipeline
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a
                href="#comparison"
                className="inline-flex items-center gap-2 px-6 py-3 border border-base-border rounded-sm text-text-secondary font-mono text-sm tracking-wide hover:text-text-primary hover:border-text-muted transition-all duration-300"
              >
                Live Demo
              </a>
            </motion.div>
          </div>

          {/* Right: Live tie-point matching animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="hidden lg:block"
          >
            <div className="glass-card rounded-sm overflow-hidden">
              <div className="px-3 py-1.5 border-b border-base-border flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
                <span className="font-mono text-[9px] text-text-muted tracking-wider uppercase">
                  Feature Matching · Live
                </span>
              </div>
              <div className="h-[260px]">
                <TiePointAnimation />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent"
        />
      </motion.div>
    </section>
  )
}
