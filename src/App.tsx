import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BootSequence from './components/BootSequence'
import GrainOverlay from './components/GrainOverlay'
import CommandPalette from './components/CommandPalette'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Pipeline from './components/Pipeline'
import Comparison from './components/Comparison'
import Results from './components/Results'
import Engineering from './components/Engineering'
import Footer from './components/Footer'
import IrisTransition from './components/IrisTransition'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      {/* Boot sequence — plays once per session */}
      <BootSequence onComplete={() => setBooted(true)} />

      {/* Grain/noise overlay — premium film texture */}
      <GrainOverlay />

      {/* Command palette — ⌘K or "/" to navigate */}
      <CommandPalette />

      {/* Telemetry ticker — bottom of viewport */}
      <Ticker />

      {/* Main content — fades in after boot */}
      <AnimatePresence>
        {booted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-base text-text-primary"
          >
            {/* Navigation - minimal, mission-control style */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-md border-b border-base-border/50">
              <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 h-14 flex items-center justify-between">
                <a href="#hero" className="font-display text-sm font-bold text-text-primary tracking-tight">
                  GeoPhase<span className="text-cyan">-</span>Lunar
                </a>
                <div className="hidden sm:flex items-center gap-6">
                  {[
                    { href: '#problem', label: 'Problem' },
                    { href: '#pipeline', label: 'Pipeline' },
                    { href: '#comparison', label: 'Demo' },
                    { href: '#results', label: 'Results' },
                    { href: '#engineering', label: 'Approach' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="font-mono text-[11px] tracking-wider text-text-muted hover:text-text-primary transition-colors uppercase"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-text-muted tracking-wider hidden lg:block">
                  SIH 2026 · PS 26166
                </span>
              </div>
            </nav>

            {/* Sections */}
            <Hero />

            <div className="section-divider mx-auto max-w-4xl" />
            <IrisTransition>
              <Problem />
            </IrisTransition>

            <div className="section-divider mx-auto max-w-4xl" />
            <Pipeline />

            <div className="section-divider mx-auto max-w-4xl" />
            <IrisTransition>
              <Comparison />
            </IrisTransition>

            <div className="section-divider mx-auto max-w-4xl" />
            <Results />

            <div className="section-divider mx-auto max-w-4xl" />
            <IrisTransition>
              <Engineering />
            </IrisTransition>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
