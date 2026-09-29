import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from './Animations'
import IrisTransition from './IrisTransition'

interface Payload {
  id: string
  name: string
  fullName: string
  resolution: string
  resolutionNum: number
  type: string
  bands: string
  swath: string
  swathKm: number
  scaleRatio: string
  color: string
  borderColor: string
  barWidth: string
}

const payloads: Payload[] = [
  {
    id: 'ohrc',
    name: 'OHRC',
    fullName: 'Orbiter High Resolution Camera',
    resolution: '0.25 m/px',
    resolutionNum: 0.25,
    type: 'Panchromatic Optical',
    bands: '1 band (PAN)',
    swath: '3 km',
    swathKm: 3,
    scaleRatio: '1×',
    color: '#F5A623',
    borderColor: 'rgba(245, 166, 35, 0.3)',
    barWidth: '100%',
  },
  {
    id: 'tmc2',
    name: 'TMC-2',
    fullName: 'Terrain Mapping Camera 2',
    resolution: '5.0 m/px',
    resolutionNum: 5.0,
    type: 'Stereo Optical',
    bands: '1 band (PAN)',
    swath: '20 km',
    swathKm: 20,
    scaleRatio: '20×',
    color: '#8A8F9C',
    borderColor: 'rgba(138, 143, 156, 0.3)',
    barWidth: '5%',
  },
  {
    id: 'iirs',
    name: 'IIRS',
    fullName: 'Imaging Infrared Spectrometer',
    resolution: '80.0 m/px',
    resolutionNum: 80.0,
    type: '256-Band SWIR Spectrometer',
    bands: '256 bands (0.8–5.0 µm)',
    swath: '20 km',
    swathKm: 20,
    scaleRatio: '320×',
    color: '#3EC6E0',
    borderColor: 'rgba(62, 198, 224, 0.3)',
    barWidth: '0.3%',
  },
]

function OrbitalSwathViz() {
  // Top-down Moon with three overlaid swath widths
  const moonR = 80
  return (
    <div className="glass-card rounded-sm p-4">
      <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-3 text-center">
        Orbital Swath Comparison (to scale)
      </p>
      <svg viewBox="0 0 300 200" className="w-full" fill="none">
        {/* Moon circle */}
        <circle cx="150" cy="100" r={moonR} fill="#111525" stroke="rgba(138,143,156,0.2)" strokeWidth="1" />
        {/* Surface texture hints */}
        <circle cx="120" cy="80" r="12" fill="none" stroke="rgba(138,143,156,0.08)" strokeWidth="0.5" />
        <circle cx="160" cy="110" r="18" fill="none" stroke="rgba(138,143,156,0.06)" strokeWidth="0.5" />
        <circle cx="140" cy="130" r="8" fill="none" stroke="rgba(138,143,156,0.08)" strokeWidth="0.5" />
        <circle cx="175" cy="80" r="10" fill="none" stroke="rgba(138,143,156,0.07)" strokeWidth="0.5" />

        {/* Orbit path (dashed ellipse) */}
        <ellipse cx="150" cy="100" rx="120" ry="95" fill="none" stroke="rgba(138,143,156,0.15)" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* IIRS swath — widest, cyan */}
        <g opacity="0.25">
          <rect x="134" y="5" width="32" height="190" fill="#3EC6E0" rx="1">
            <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0; -2,0; 0,0" dur="8s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* TMC-2 swath — medium, grey */}
        <g opacity="0.3">
          <rect x="140" y="5" width="20" height="190" fill="#8A8F9C" rx="1">
            <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0; -2,0; 0,0" dur="8s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* OHRC swath — narrowest, amber */}
        <g opacity="0.5">
          <rect x="148" y="5" width="4" height="190" fill="#F5A623" rx="0.5">
            <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0; -2,0; 0,0" dur="8s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Spacecraft dot */}
        <circle cx="150" cy="8" r="2.5" fill="#F2F3F5">
          <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0; -2,0; 0,0" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="8" r="5" fill="none" stroke="rgba(242,243,245,0.3)" strokeWidth="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0; -2,0; 0,0" dur="8s" repeatCount="indefinite" />
        </circle>

        {/* Labels */}
        <text x="106" y="100" textAnchor="end" fill="#F5A623" fontSize="8" className="font-mono" opacity="0.8">OHRC 3km</text>
        <text x="106" y="115" textAnchor="end" fill="#8A8F9C" fontSize="8" className="font-mono" opacity="0.8">TMC-2 20km</text>
        <text x="106" y="130" textAnchor="end" fill="#3EC6E0" fontSize="8" className="font-mono" opacity="0.8">IIRS 20km</text>

        {/* Swath width markers */}
        <line x1="148" y1="195" x2="152" y2="195" stroke="#F5A623" strokeWidth="1.5" />
        <line x1="140" y1="197" x2="160" y2="197" stroke="#8A8F9C" strokeWidth="1" />
        <line x1="134" y1="199" x2="166" y2="199" stroke="#3EC6E0" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default function Problem() {
  const [active, setActive] = useState<string>('ohrc')

  return (
    <section id="problem" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-amber uppercase mb-4">
            The Challenge
          </p>
          <h2 className="font-display text-section font-bold text-text-primary mb-4">
            Three Payloads, Three Scales, One Surface
          </h2>
          <p className="max-w-2xl text-text-secondary leading-relaxed mb-16">
            Chandrayaan-2 carries instruments spanning a 320× resolution gap —
            from sub-meter OHRC panchromatic to 80 m/px IIRS hyperspectral.
            Different modalities, different sun angles, different shadow
            geometries. No existing pipeline registers all three.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Left: Payload cards */}
          <div>
            {/* Payload toggle row */}
            <FadeIn delay={0.15}>
              <div className="flex gap-2 mb-10">
                {payloads.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    className={`
                      px-5 py-2.5 font-mono text-sm tracking-wider uppercase
                      border transition-all duration-300 rounded-sm
                      ${active === p.id
                        ? 'border-opacity-60 bg-opacity-10'
                        : 'border-base-border text-text-muted hover:text-text-secondary hover:border-text-muted'
                      }
                    `}
                    style={
                      active === p.id
                        ? {
                            borderColor: p.borderColor,
                            backgroundColor: `${p.color}10`,
                            color: p.color,
                          }
                        : undefined
                    }
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Payload detail card */}
            <AnimatePresence mode="wait">
              {payloads
                .filter((p) => p.id === active)
                .map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-sm p-8 sm:p-10"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 items-start">
                      {/* Left: Info */}
                      <div>
                        <div className="flex items-baseline gap-3 mb-1">
                          <h3 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: p.color }}>
                            {p.name}
                          </h3>
                          <span className="font-mono text-xs text-text-muted">{p.fullName}</span>
                        </div>

                        <p className="text-text-secondary text-sm mt-2 mb-8">{p.type}</p>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">
                              Resolution
                            </p>
                            <p className="font-mono text-xl font-semibold" style={{ color: p.color }}>
                              {p.resolution}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">
                              Spectral
                            </p>
                            <p className="font-mono text-sm text-text-primary">{p.bands}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">
                              Swath
                            </p>
                            <p className="font-mono text-sm text-text-primary">{p.swath}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">
                              Scale Gap
                            </p>
                            <p className="font-mono text-xl font-semibold text-text-primary">
                              {p.scaleRatio}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Visual scale bar */}
                      <div className="flex flex-col items-center gap-3 min-w-[140px]">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
                          Relative Pixel
                        </p>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* Outer reference square (OHRC scale) */}
                          <div
                            className="absolute border border-dashed rounded-sm"
                            style={{
                              borderColor: 'rgba(138, 143, 156, 0.2)',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          {/* Payload pixel square */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="rounded-sm"
                            style={{
                              width: p.barWidth,
                              height: p.barWidth,
                              minWidth: '4px',
                              minHeight: '4px',
                              backgroundColor: p.color,
                              boxShadow: `0 0 20px ${p.color}30`,
                            }}
                          />
                        </div>
                        <p className="font-mono text-xs text-text-muted">
                          {p.resolutionNum} m² per pixel
                        </p>
                      </div>
                    </div>

                    {/* Sun-angle / modality note */}
                    <div className="mt-8 pt-6 border-t border-base-border">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber" />
                          <span className="font-mono text-xs text-text-muted">
                            Sun elevation varies 5°–85° across orbits — shadow geometry changes radically
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan" />
                          <span className="font-mono text-xs text-text-muted">
                            {p.id === 'iirs'
                              ? 'SWIR spectral modality — no direct intensity correspondence with optical bands'
                              : 'Optical panchromatic — intensity-based features break under illumination change'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Right: Orbital swath visualization */}
          <FadeIn delay={0.25} className="hidden lg:block">
            <OrbitalSwathViz />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
