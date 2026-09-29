import { useState, useRef, useCallback, useEffect } from 'react'
import { FadeIn } from './Animations'

interface ComparisonPair {
  id: string
  label: string
  leftLabel: string
  rightLabel: string
  leftDesc: string
  rightDesc: string
  matchPoints: { lx: number; ly: number; rx: number; ry: number }[]
}

const pairs: ComparisonPair[] = [
  {
    id: 'ohrc-tmc2',
    label: 'OHRC ↔ TMC-2 (Stage A)',
    leftLabel: 'OHRC · 0.25 m/px',
    rightLabel: 'TMC-2 · 5.0 m/px',
    leftDesc: 'Panchromatic, high-sun orbit',
    rightDesc: 'Stereo optical, low-sun orbit',
    matchPoints: [
      { lx: 25, ly: 30, rx: 28, ry: 32 },
      { lx: 60, ly: 45, rx: 58, ry: 47 },
      { lx: 40, ly: 70, rx: 42, ry: 68 },
      { lx: 75, ly: 25, rx: 73, ry: 27 },
      { lx: 50, ly: 55, rx: 52, ry: 53 },
      { lx: 15, ly: 80, rx: 17, ry: 78 },
    ],
  },
  {
    id: 'tmc2-iirs',
    label: 'TMC-2 ↔ IIRS (Stage B)',
    leftLabel: 'TMC-2 · 5.0 m/px',
    rightLabel: 'IIRS · 80.0 m/px',
    leftDesc: 'Stereo optical PAN',
    rightDesc: '256-band SWIR, SGW-SVD composite',
    matchPoints: [
      { lx: 30, ly: 35, rx: 32, ry: 37 },
      { lx: 65, ly: 50, rx: 63, ry: 52 },
      { lx: 45, ly: 75, rx: 47, ry: 73 },
      { lx: 20, ly: 55, rx: 22, ry: 57 },
      { lx: 70, ly: 30, rx: 68, ry: 32 },
    ],
  },
  {
    id: 'ohrc-iirs',
    label: 'OHRC ↔ IIRS (End-to-End)',
    leftLabel: 'OHRC · 0.25 m/px',
    rightLabel: 'IIRS · 80.0 m/px (pseudo-RGB)',
    leftDesc: 'Full-resolution panchromatic',
    rightDesc: 'SGW-SVD reduced, 320× gap bridged',
    matchPoints: [
      { lx: 35, ly: 40, rx: 38, ry: 42 },
      { lx: 55, ly: 60, rx: 53, ry: 62 },
      { lx: 25, ly: 75, rx: 27, ry: 73 },
      { lx: 70, ly: 35, rx: 68, ry: 37 },
    ],
  },
]

// Generate a procedural lunar surface tile using canvas
function generateLunarTile(
  canvas: HTMLCanvasElement,
  seed: number,
  tint: [number, number, number],
  contrast: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  // Base grey
  ctx.fillStyle = `rgb(${60 + seed * 3}, ${58 + seed * 2}, ${55 + seed * 4})`
  ctx.fillRect(0, 0, w, h)

  // Pseudo-random from seed
  const rng = (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  // Craters
  const craterCount = 8 + Math.floor(rng(0) * 12)
  for (let i = 0; i < craterCount; i++) {
    const cx = rng(i * 2 + 1) * w
    const cy = rng(i * 2 + 2) * h
    const r = rng(i * 3 + 3) * 40 + 8

    // Crater shadow (sun from top-left)
    const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r)
    grad.addColorStop(0, `rgba(${30 + tint[0]}, ${28 + tint[1]}, ${25 + tint[2]}, ${0.5 * contrast})`)
    grad.addColorStop(0.5, `rgba(${45 + tint[0]}, ${43 + tint[1]}, ${40 + tint[2]}, ${0.3 * contrast})`)
    grad.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // Rim highlight
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${100 + tint[0]}, ${98 + tint[1]}, ${95 + tint[2]}, ${0.15 * contrast})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Noise texture overlay
  const imageData = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (rng(i / 4) - 0.5) * 15 * contrast
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
}

function LunarCanvas({
  seed,
  tint,
  contrast,
  className,
}: {
  seed: number
  tint: [number, number, number]
  contrast: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 512
    canvas.height = 512
    generateLunarTile(canvas, seed, tint, contrast)
  }, [seed, tint, contrast])

  return <canvas ref={canvasRef} className={className} />
}

// Reticle cursor SVG for scientific instrument feel
function ReticleCursor({ x, y, visible }: { x: number; y: number; visible: boolean }) {
  return (
    <div
      className="reticle-cursor"
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Crosshair lines */}
        <line x1="14" y1="0" x2="14" y2="9" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.7" />
        <line x1="14" y1="19" x2="14" y2="28" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.7" />
        <line x1="0" y1="14" x2="9" y2="14" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.7" />
        <line x1="19" y1="14" x2="28" y2="14" stroke="#3EC6E0" strokeWidth="0.8" opacity="0.7" />
        {/* Center dot */}
        <circle cx="14" cy="14" r="1.5" fill="#3EC6E0" opacity="0.9" />
        {/* Outer ring */}
        <circle cx="14" cy="14" r="10" stroke="#3EC6E0" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  )
}

export default function Comparison() {
  const [activePair, setActivePair] = useState(0)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [showTiePoints, setShowTiePoints] = useState(true)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * 100
      setSliderPos(Math.max(2, Math.min(98, x)))
    },
    []
  )

  const handleMouseMoveContainer = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    },
    [isDragging, handleMove]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX)
    },
    [isDragging, handleMove]
  )

  const stopDrag = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', stopDrag)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', stopDrag)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', stopDrag)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, stopDrag])

  const pair = pairs[activePair]

  // Different seeds/tints per pair to simulate different instrument views
  const leftSeeds = [42, 17, 42]
  const rightSeeds = [42, 89, 89]
  const leftTints: [number, number, number][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  const rightTints: [number, number, number][] = [[5, 3, -2], [15, 8, -5], [15, 8, -5]]
  const leftContrasts = [1.0, 0.8, 1.0]
  const rightContrasts = [0.7, 0.5, 0.4]

  return (
    <section id="comparison" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-cyan uppercase mb-4">
            Live Demo
          </p>
          <h2 className="font-display text-section font-bold text-text-primary mb-4">
            Before / After Comparison
          </h2>
          <p className="max-w-2xl text-text-secondary leading-relaxed mb-10">
            Drag the slider to compare registered image pairs. Tie-point
            markers show matched correspondences across scale and modality gaps.
          </p>
        </FadeIn>

        {/* Pair selector */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8">
            {pairs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setActivePair(i); setSliderPos(50) }}
                className={`
                  px-4 py-2 font-mono text-xs tracking-wider border rounded-sm
                  transition-all duration-300
                  ${activePair === i
                    ? 'border-cyan/40 bg-cyan/10 text-cyan'
                    : 'border-base-border text-text-muted hover:text-text-secondary hover:border-text-muted'
                  }
                `}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowTiePoints(!showTiePoints)}
              className={`
                px-4 py-2 font-mono text-xs tracking-wider border rounded-sm
                transition-all duration-300 ml-auto
                ${showTiePoints
                  ? 'border-amber/40 bg-amber/10 text-amber'
                  : 'border-base-border text-text-muted'
                }
              `}
            >
              {showTiePoints ? 'Tie Points ON' : 'Tie Points OFF'}
            </button>
          </div>
        </FadeIn>

        {/* Comparison viewer */}
        <FadeIn delay={0.2}>
          <div className="glass-card rounded-sm overflow-hidden">
            {/* Labels bar */}
            <div className="flex justify-between px-4 py-2 border-b border-base-border">
              <div>
                <span className="font-mono text-xs text-amber">{pair.leftLabel}</span>
                <span className="font-mono text-[10px] text-text-muted ml-2 hidden sm:inline">{pair.leftDesc}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-cyan">{pair.rightLabel}</span>
                <span className="font-mono text-[10px] text-text-muted ml-2 hidden sm:inline">{pair.rightDesc}</span>
              </div>
            </div>

            {/* Image container with scoped reticle cursor */}
            <div
              ref={containerRef}
              className={`comparison-area relative w-full aspect-[16/10] select-none overflow-hidden ${isDragging ? 'is-dragging' : ''}`}
              onMouseDown={(e) => {
                setIsDragging(true)
                handleMove(e.clientX)
              }}
              onTouchStart={(e) => {
                setIsDragging(true)
                if (e.touches[0]) handleMove(e.touches[0].clientX)
              }}
              onMouseMove={handleMouseMoveContainer}
              onMouseEnter={() => setCursorVisible(true)}
              onMouseLeave={() => setCursorVisible(false)}
            >
              {/* Right image (full) */}
              <LunarCanvas
                seed={rightSeeds[activePair]}
                tint={rightTints[activePair]}
                contrast={rightContrasts[activePair]}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Left image (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <LunarCanvas
                  seed={leftSeeds[activePair]}
                  tint={leftTints[activePair]}
                  contrast={leftContrasts[activePair]}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slider line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 z-10"
                style={{
                  left: `${sliderPos}%`,
                  background: 'linear-gradient(180deg, #3EC6E0, #2C8FBF)',
                  boxShadow: '0 0 12px rgba(62, 198, 224, 0.4)',
                }}
              />

              {/* Slider handle */}
              <div
                className="absolute z-20 w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${sliderPos}%`,
                  top: '50%',
                }}
              >
                <div className="w-8 h-8 rounded-full bg-base-elevated border-2 border-cyan flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 3L2 8L5 13" stroke="#3EC6E0" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 3L14 8L11 13" stroke="#3EC6E0" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Tie point overlay */}
              {showTiePoints && (
                <svg
                  className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {pair.matchPoints.map((mp, i) => (
                    <g key={i}>
                      {/* Left point */}
                      <circle cx={mp.lx} cy={mp.ly} r="0.8" fill="#F5A623" opacity="0.9" />
                      <circle cx={mp.lx} cy={mp.ly} r="1.5" fill="none" stroke="#F5A623" strokeWidth="0.2" opacity="0.5" />
                      {/* Right point */}
                      <circle cx={mp.rx + 50} cy={mp.ry} r="0.8" fill="#3EC6E0" opacity="0.9" />
                      <circle cx={mp.rx + 50} cy={mp.ry} r="1.5" fill="none" stroke="#3EC6E0" strokeWidth="0.2" opacity="0.5" />
                      {/* Connecting line */}
                      <line
                        x1={mp.lx}
                        y1={mp.ly}
                        x2={mp.rx + 50}
                        y2={mp.ry}
                        stroke="rgba(242, 243, 245, 0.2)"
                        strokeWidth="0.15"
                        strokeDasharray="0.5 0.5"
                      />
                    </g>
                  ))}
                </svg>
              )}

              {/* Scoped reticle cursor */}
              <ReticleCursor x={cursorPos.x} y={cursorPos.y} visible={cursorVisible} />

              {/* Coordinate readout */}
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-text-muted bg-base/80 px-2 py-1 rounded-sm z-10">
                Slider: {sliderPos.toFixed(1)}% · {pair.matchPoints.length} matches
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="flex flex-wrap justify-between px-4 py-2 border-t border-base-border gap-4">
              <span className="font-mono text-[10px] text-text-muted">
                {pair.matchPoints.length} tie points displayed (mock)
              </span>
              <span className="font-mono text-[10px] text-text-muted">
                Drop real OHRC/TMC-2/IIRS crops into <code className="text-cyan">/public/tiles/</code> to replace
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
