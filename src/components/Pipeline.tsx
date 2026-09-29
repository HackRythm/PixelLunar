import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stage {
  num: number
  title: string
  subtitle: string
  description: string
  details: string[]
  accent: 'amber' | 'cyan'
  visual: 'ingestion' | 'illumination' | 'phase' | 'matching' | 'pruning' | 'export'
}

const stages: Stage[] = [
  {
    num: 0,
    title: 'Ingestion & Tiling',
    subtitle: 'PDS4 → Geocoded Quadtree',
    description:
      'Raw PDS4 archives are parsed, SPICE kernels extract sun/observer geometry per scanline, and imagery is projected into UTM / Lunar Polar Stereographic coordinates.',
    details: [
      'PDS4 label parsing with SPICE CK/SPK attachment',
      'Per-scanline incidence, emission, and phase angles',
      'UTM zone selection or Lunar Polar Stereographic for polar sites',
      '1024×1024 quadtree tiling with 64 px overlap for seamless stitching',
    ],
    accent: 'amber',
    visual: 'ingestion',
  },
  {
    num: 1,
    title: 'Illumination Correction',
    subtitle: 'Three-Tier Shadow Normalization',
    description:
      'A three-tier fallback cascade normalizes illumination across sun-angle ranges, making appearance-based matching viable even between orbits with 40°+ elevation difference.',
    details: [
      'Tier 1 — Hapke BRDF inversion using SPICE-derived geometry',
      'Tier 2 — Constrained STV-RPCA with SPICE shadow mask + Pyramid-ADMM solver',
      'Tier 3 — MSRCR + CLAHE (robust fallback for degraded metadata)',
      'Automatic tier selection based on SPICE kernel completeness',
    ],
    accent: 'amber',
    visual: 'illumination',
  },
  {
    num: 2,
    title: 'Phase Congruency',
    subtitle: 'Log-Gabor Feature Representation',
    description:
      'Instead of intensity gradients, we extract phase-congruency maps — structural features invariant to illumination and contrast changes. This is the key enabler for cross-sun-angle matching.',
    details: [
      'Log-Gabor filterbank: 4 scales × 6 orientations',
      'Output: structural energy, phase symmetry, orientation maps',
      'Invariant to monotonic intensity changes by design',
      'Produces dense feature maps, not sparse keypoints — critical for textureless maria',
    ],
    accent: 'cyan',
    visual: 'phase',
  },
  {
    num: 3,
    title: 'Hierarchical Matching',
    subtitle: 'Two-Stage Cascaded Registration',
    description:
      'The 320× scale gap is too large for any single matcher. We decompose it into two manageable steps, each using the best available matcher for that scale regime.',
    details: [
      'Stage A — OHRC ↔ TMC-2: ~20× scale step via SuperGlue / Efficient-LoFTR',
      'Stage B — TMC-2 ↔ IIRS: ~16× step via RoMa / XoFTR on SGW-SVD pseudo-RGB composite',
      'Phase-gated attention: token pruning masks featureless maria regions',
      'Coarse-to-fine: L3 → L1 pyramid with guided local search',
    ],
    accent: 'cyan',
    visual: 'matching',
  },
  {
    num: 4,
    title: 'Outlier Pruning & Warping',
    subtitle: 'MAGSAC + Anisotropic TPS',
    description:
      'Correspondences are aggressively filtered and the final warp accounts for local topographic distortion, not just projective geometry.',
    details: [
      'MAGSAC++ with σ-consensus for robust inlier selection',
      'Topography-anisotropic TPS (TA-TPS) warp kernel',
      'DEM-source-gated: stereo OHRC DEM preferred, SLDEM2015 fallback',
      'Residual ≤ 0.9 px (Stage A), ≤ 1.8 px (Stage B)',
    ],
    accent: 'cyan',
    visual: 'pruning',
  },
  {
    num: 5,
    title: 'Geodetic Tying & Export',
    subtitle: 'Absolute Reference → COG + PDS4',
    description:
      'Final tie-point solutions are anchored to absolute geodetic references and exported in interoperable formats ready for downstream science pipelines.',
    details: [
      'Tied to LRO NAC control network / SELENE TC absolute points',
      'Cloud-Optimized GeoTIFF (COG) for web-served visualization',
      'PDS4-compliant tie-point table with covariance per pair',
      'Per-tile QA: RMSE, inlier count, coverage fraction metadata',
    ],
    accent: 'amber',
    visual: 'export',
  },
]

function StageVisual({ visual, accent }: { visual: string; accent: 'amber' | 'cyan' }) {
  const accentColor = accent === 'amber' ? '#F5A623' : '#3EC6E0'
  const dimColor = accent === 'amber' ? 'rgba(245,166,35,0.15)' : 'rgba(62,198,224,0.15)'

  const visuals: Record<string, JSX.Element> = {
    ingestion: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* PDS4 file icon */}
        <rect x="20" y="30" width="60" height="80" rx="2" stroke={accentColor} strokeWidth="1.5" fill={dimColor} />
        <text x="50" y="75" textAnchor="middle" fill={accentColor} className="font-mono" fontSize="10">.PDS4</text>
        {/* Arrow */}
        <line x1="90" y1="70" x2="130" y2="70" stroke={accentColor} strokeWidth="1" strokeDasharray="4 3" />
        <polygon points="130,65 140,70 130,75" fill={accentColor} />
        {/* Quadtree grid */}
        <rect x="150" y="20" width="150" height="150" rx="2" stroke="rgba(138,143,156,0.3)" strokeWidth="1" />
        <line x1="225" y1="20" x2="225" y2="170" stroke="rgba(138,143,156,0.2)" strokeWidth="1" />
        <line x1="150" y1="95" x2="300" y2="95" stroke="rgba(138,143,156,0.2)" strokeWidth="1" />
        <line x1="187" y1="20" x2="187" y2="95" stroke="rgba(138,143,156,0.15)" strokeWidth="0.5" />
        <line x1="150" y1="57" x2="225" y2="57" stroke="rgba(138,143,156,0.15)" strokeWidth="0.5" />
        <text x="225" y="200" textAnchor="middle" fill="#8A8F9C" fontSize="9" className="font-mono">1024×1024 quadtree tiles</text>
        {/* Tile labels */}
        <text x="168" y="45" fill={accentColor} fontSize="8" className="font-mono" opacity="0.7">L0</text>
        <text x="205" y="80" fill={accentColor} fontSize="7" className="font-mono" opacity="0.5">L1</text>
        <text x="250" y="130" fill="#8A8F9C" fontSize="8" className="font-mono" opacity="0.5">L2</text>
      </svg>
    ),
    illumination: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* Decision tree */}
        <rect x="110" y="10" width="100" height="30" rx="2" stroke={accentColor} strokeWidth="1.5" fill={dimColor} />
        <text x="160" y="30" textAnchor="middle" fill={accentColor} fontSize="9" className="font-mono">SPICE kernels?</text>
        {/* Yes branch */}
        <line x1="135" y1="40" x2="70" y2="70" stroke={accentColor} strokeWidth="1" />
        <text x="90" y="58" fill="#4ade80" fontSize="8" className="font-mono">yes</text>
        <rect x="20" y="70" width="100" height="28" rx="2" stroke="#4ade80" strokeWidth="1" fill="rgba(74,222,128,0.08)" />
        <text x="70" y="89" textAnchor="middle" fill="#F2F3F5" fontSize="8" className="font-mono">Hapke BRDF</text>
        {/* Partial branch */}
        <line x1="160" y1="40" x2="160" y2="70" stroke={accentColor} strokeWidth="1" />
        <text x="170" y="58" fill="#F5A623" fontSize="8" className="font-mono">partial</text>
        <rect x="110" y="70" width="100" height="28" rx="2" stroke="#F5A623" strokeWidth="1" fill="rgba(245,166,35,0.08)" />
        <text x="160" y="89" textAnchor="middle" fill="#F2F3F5" fontSize="8" className="font-mono">STV-RPCA</text>
        {/* No branch */}
        <line x1="185" y1="40" x2="250" y2="70" stroke={accentColor} strokeWidth="1" />
        <text x="225" y="58" fill="#ef4444" fontSize="8" className="font-mono">no</text>
        <rect x="200" y="70" width="100" height="28" rx="2" stroke="#ef4444" strokeWidth="1" fill="rgba(239,68,68,0.08)" />
        <text x="250" y="89" textAnchor="middle" fill="#F2F3F5" fontSize="8" className="font-mono">MSRCR+CLAHE</text>
        {/* Converge */}
        <line x1="70" y1="98" x2="160" y2="130" stroke="rgba(138,143,156,0.3)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="160" y1="98" x2="160" y2="130" stroke="rgba(138,143,156,0.3)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="250" y1="98" x2="160" y2="130" stroke="rgba(138,143,156,0.3)" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="110" y="130" width="100" height="28" rx="2" stroke="#3EC6E0" strokeWidth="1.5" fill="rgba(62,198,224,0.08)" />
        <text x="160" y="149" textAnchor="middle" fill="#3EC6E0" fontSize="8" className="font-mono">Normalized Tile</text>
        {/* Labels */}
        <text x="160" y="190" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">Three-tier illumination cascade</text>
        <text x="160" y="205" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">Auto-selected by SPICE completeness</text>
      </svg>
    ),
    phase: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* Raw tile */}
        <rect x="20" y="40" width="90" height="90" rx="2" stroke="rgba(138,143,156,0.3)" strokeWidth="1" />
        {/* Simulated lunar texture with circles */}
        <circle cx="50" cy="70" r="12" stroke="rgba(138,143,156,0.2)" strokeWidth="0.5" fill="rgba(138,143,156,0.05)" />
        <circle cx="75" cy="95" r="8" stroke="rgba(138,143,156,0.2)" strokeWidth="0.5" fill="rgba(138,143,156,0.05)" />
        <circle cx="40" cy="110" r="15" stroke="rgba(138,143,156,0.15)" strokeWidth="0.5" fill="rgba(138,143,156,0.03)" />
        <circle cx="85" cy="65" r="5" stroke="rgba(138,143,156,0.2)" strokeWidth="0.5" fill="rgba(138,143,156,0.05)" />
        <text x="65" y="150" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">Raw Tile</text>
        {/* Arrow */}
        <line x1="120" y1="85" x2="155" y2="85" stroke={accentColor} strokeWidth="1" strokeDasharray="4 3" />
        <polygon points="155,80 165,85 155,90" fill={accentColor} />
        <text x="140" y="75" textAnchor="middle" fill={accentColor} fontSize="7" className="font-mono">Log-Gabor</text>
        {/* Phase congruency map */}
        <rect x="175" y="40" width="90" height="90" rx="2" stroke={accentColor} strokeWidth="1.5" fill={dimColor} />
        {/* Structural edges highlighted */}
        <circle cx="205" cy="70" r="12" stroke={accentColor} strokeWidth="1.5" fill="none" />
        <circle cx="230" cy="95" r="8" stroke={accentColor} strokeWidth="1.5" fill="none" />
        <circle cx="195" cy="110" r="15" stroke={accentColor} strokeWidth="1" fill="none" />
        <circle cx="240" cy="65" r="5" stroke={accentColor} strokeWidth="1.5" fill="none" />
        <text x="220" y="150" textAnchor="middle" fill={accentColor} fontSize="8" className="font-mono">Phase Energy</text>
        {/* Specs */}
        <text x="160" y="180" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">4 scales × 6 orientations</text>
        <text x="160" y="195" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">Invariant to monotonic intensity change</text>
      </svg>
    ),
    matching: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* Stage A */}
        <text x="85" y="20" textAnchor="middle" fill="#F5A623" fontSize="9" className="font-mono">Stage A · ~20× step</text>
        <rect x="20" y="30" width="50" height="50" rx="2" stroke="#F5A623" strokeWidth="1" fill="rgba(245,166,35,0.08)" />
        <text x="45" y="60" textAnchor="middle" fill="#F5A623" fontSize="8" className="font-mono">OHRC</text>
        {/* Match lines A */}
        <line x1="70" y1="45" x2="100" y2="45" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
        <line x1="70" y1="55" x2="100" y2="50" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
        <line x1="70" y1="65" x2="100" y2="60" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
        <rect x="100" y="35" width="40" height="40" rx="2" stroke="#8A8F9C" strokeWidth="1" fill="rgba(138,143,156,0.08)" />
        <text x="120" y="60" textAnchor="middle" fill="#8A8F9C" fontSize="7" className="font-mono">TMC-2</text>
        <text x="85" y="100" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">SuperGlue / E-LoFTR</text>

        {/* Stage B */}
        <text x="240" y="20" textAnchor="middle" fill="#3EC6E0" fontSize="9" className="font-mono">Stage B · ~16× step</text>
        <rect x="190" y="35" width="40" height="40" rx="2" stroke="#8A8F9C" strokeWidth="1" fill="rgba(138,143,156,0.08)" />
        <text x="210" y="60" textAnchor="middle" fill="#8A8F9C" fontSize="7" className="font-mono">TMC-2</text>
        {/* Match lines B */}
        <line x1="230" y1="45" x2="260" y2="48" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.5" />
        <line x1="230" y1="55" x2="260" y2="53" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.5" />
        <line x1="230" y1="60" x2="260" y2="58" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.5" />
        <rect x="260" y="40" width="30" height="30" rx="2" stroke="#3EC6E0" strokeWidth="1" fill="rgba(62,198,224,0.08)" />
        <text x="275" y="60" textAnchor="middle" fill="#3EC6E0" fontSize="6" className="font-mono">IIRS</text>
        <text x="240" y="100" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">RoMa / XoFTR + SGW-SVD</text>

        {/* Cascade arrow */}
        <line x1="145" y1="55" x2="185" y2="55" stroke="rgba(138,143,156,0.3)" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="183,51 190,55 183,59" fill="rgba(138,143,156,0.3)" />
        <text x="165" y="50" textAnchor="middle" fill="#5A5F6C" fontSize="6" className="font-mono">cascade</text>

        {/* Bottom summary */}
        <rect x="60" y="120" width="200" height="35" rx="2" stroke="rgba(138,143,156,0.2)" strokeWidth="1" fill="rgba(11,14,23,0.5)" />
        <text x="160" y="135" textAnchor="middle" fill="#F2F3F5" fontSize="8" className="font-mono">OHRC → TMC-2 → IIRS</text>
        <text x="160" y="148" textAnchor="middle" fill="#8A8F9C" fontSize="7" className="font-mono">320× bridged in two ~17× steps</text>
        
        <text x="160" y="185" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">Phase-gated attention prunes featureless maria tokens</text>
      </svg>
    ),
    pruning: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* Scatter of points — inliers and outliers */}
        {/* Inliers (cyan) */}
        <circle cx="80" cy="60" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="110" cy="80" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="140" cy="70" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="160" cy="100" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="190" cy="90" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="220" cy="110" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="250" cy="95" r="3" fill="#3EC6E0" opacity="0.8" />
        <circle cx="130" cy="110" r="3" fill="#3EC6E0" opacity="0.8" />
        {/* Outliers (red, crossed) */}
        <circle cx="60" cy="140" r="3" fill="#ef4444" opacity="0.6" />
        <line x1="56" y1="136" x2="64" y2="144" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        <line x1="64" y1="136" x2="56" y2="144" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        <circle cx="260" cy="50" r="3" fill="#ef4444" opacity="0.6" />
        <line x1="256" y1="46" x2="264" y2="54" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        <line x1="264" y1="46" x2="256" y2="54" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        <circle cx="200" cy="160" r="3" fill="#ef4444" opacity="0.6" />
        <line x1="196" y1="156" x2="204" y2="164" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        <line x1="204" y1="156" x2="196" y2="164" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        {/* Fit curve through inliers */}
        <path d="M70 65 Q120 75 160 100 Q200 90 260 100" stroke="#3EC6E0" strokeWidth="1.5" fill="none" strokeDasharray="6 3" />
        {/* Labels */}
        <text x="160" y="190" textAnchor="middle" fill="#3EC6E0" fontSize="8" className="font-mono">MAGSAC++ σ-consensus</text>
        <text x="160" y="205" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">→ TA-TPS warp (DEM-gated)</text>
        <text x="160" y="225" textAnchor="middle" fill="#5A5F6C" fontSize="7" className="font-mono">Residual ≤ 0.9 px (A) · ≤ 1.8 px (B)</text>
      </svg>
    ),
    export: (
      <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
        {/* Reference network */}
        <text x="160" y="20" textAnchor="middle" fill={accentColor} fontSize="9" className="font-mono">Geodetic Reference Network</text>
        {/* LRO NAC */}
        <rect x="30" y="35" width="80" height="25" rx="2" stroke="rgba(138,143,156,0.3)" strokeWidth="1" fill="rgba(138,143,156,0.05)" />
        <text x="70" y="52" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">LRO NAC</text>
        {/* SELENE TC */}
        <rect x="210" y="35" width="80" height="25" rx="2" stroke="rgba(138,143,156,0.3)" strokeWidth="1" fill="rgba(138,143,156,0.05)" />
        <text x="250" y="52" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">SELENE TC</text>
        {/* Lines down */}
        <line x1="70" y1="60" x2="160" y2="90" stroke="rgba(138,143,156,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="250" y1="60" x2="160" y2="90" stroke="rgba(138,143,156,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        {/* Central tied solution */}
        <rect x="110" y="85" width="100" height="30" rx="2" stroke={accentColor} strokeWidth="1.5" fill={dimColor} />
        <text x="160" y="105" textAnchor="middle" fill={accentColor} fontSize="8" className="font-mono">Tied Solution</text>
        {/* Export outputs */}
        <line x1="130" y1="115" x2="80" y2="145" stroke={accentColor} strokeWidth="1" />
        <line x1="160" y1="115" x2="160" y2="145" stroke={accentColor} strokeWidth="1" />
        <line x1="190" y1="115" x2="240" y2="145" stroke={accentColor} strokeWidth="1" />
        <rect x="40" y="145" width="80" height="25" rx="2" stroke={accentColor} strokeWidth="1" fill={dimColor} />
        <text x="80" y="162" textAnchor="middle" fill="#F2F3F5" fontSize="7" className="font-mono">COG GeoTIFF</text>
        <rect x="120" y="145" width="80" height="25" rx="2" stroke={accentColor} strokeWidth="1" fill={dimColor} />
        <text x="160" y="162" textAnchor="middle" fill="#F2F3F5" fontSize="7" className="font-mono">PDS4 Table</text>
        <rect x="200" y="145" width="80" height="25" rx="2" stroke={accentColor} strokeWidth="1" fill={dimColor} />
        <text x="240" y="162" textAnchor="middle" fill="#F2F3F5" fontSize="7" className="font-mono">QA Metadata</text>
        {/* Bottom notes */}
        <text x="160" y="200" textAnchor="middle" fill="#8A8F9C" fontSize="8" className="font-mono">Per-tile covariance + coverage fraction</text>
      </svg>
    ),
  }

  return (
    <div className="w-full aspect-[4/3] rounded-sm glass-card p-4 flex items-center justify-center">
      {visuals[visual] || visuals.ingestion}
    </div>
  )
}

export default function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)

  return (
    <section id="pipeline" className="relative py-28 sm:py-36">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mb-20">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan uppercase mb-4">
          Architecture
        </p>
        <h2 className="font-display text-section font-bold text-text-primary mb-4">
          Pipeline Walkthrough
        </h2>
        <p className="max-w-2xl text-text-secondary leading-relaxed">
          Six stages from raw PDS4 ingestion to geodetically-tied, science-ready
          output. Each stage is independently testable and metrics-observable.
        </p>
      </div>

      {/* Scrollytelling: sticky visual + scrolling descriptions */}
      <div ref={containerRef} className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Sticky visual panel (left on desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <StageVisual
                  visual={stages[activeStage].visual}
                  accent={stages[activeStage].accent}
                />
              </motion.div>
              {/* Stage progress indicator */}
              <div className="flex gap-1.5 mt-6">
                {stages.map((s) => (
                  <div
                    key={s.num}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: activeStage === s.num ? '32px' : '12px',
                      backgroundColor:
                        activeStage === s.num
                          ? s.accent === 'amber'
                            ? '#F5A623'
                            : '#3EC6E0'
                          : '#1A1F30',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrolling stage descriptions (right on desktop) */}
          <div className="space-y-8 lg:space-y-20">
            {stages.map((stage) => (
              <StageCard
                key={stage.num}
                stage={stage}
                onVisible={() => setActiveStage(stage.num)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StageCard({
  stage,
  onVisible,
}: {
  stage: Stage
  onVisible: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-40% 0px -40% 0px' })

  useEffect(() => {
    if (isInView) onVisible()
  }, [isInView])

  const accentColor = stage.accent === 'amber' ? '#F5A623' : '#3EC6E0'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
      className="py-4"
    >
      {/* Mobile visual (hidden on desktop where sticky panel handles it) */}
      <div className="lg:hidden mb-6">
        <StageVisual visual={stage.visual} accent={stage.accent} />
      </div>

      {/* Stage badge */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono text-xs font-semibold tracking-[0.15em] uppercase"
          style={{ color: accentColor }}
        >
          Stage {stage.num}
        </span>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: `${accentColor}20` }}
        />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-1">
        {stage.title}
      </h3>
      <p className="font-mono text-xs text-text-muted mb-4">{stage.subtitle}</p>
      <p className="text-text-secondary text-sm leading-relaxed mb-5">
        {stage.description}
      </p>

      {/* Detail bullets */}
      <ul className="space-y-2">
        {stage.details.map((d, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-text-secondary font-mono text-xs leading-relaxed">
              {d}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
