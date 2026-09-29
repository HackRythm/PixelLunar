import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
  matched: boolean
  matchIdx: number
  phase: number
  side: 'left' | 'right'
}

export default function TiePointAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let points: Point[] = []
    const POINT_COUNT = 28
    const CYCLE_DURATION = 4000 // ms per match cycle
    let startTime = performance.now()

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      canvas!.width = rect.width * window.devicePixelRatio
      canvas!.height = rect.height * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas!.style.width = rect.width + 'px'
      canvas!.style.height = rect.height + 'px'
      initPoints(rect.width, rect.height)
    }

    function initPoints(w: number, h: number) {
      points = []
      const halfW = w / 2
      const gap = 16
      const padding = 20

      for (let i = 0; i < POINT_COUNT; i++) {
        const side: 'left' | 'right' = i < POINT_COUNT / 2 ? 'left' : 'right'
        const baseX = side === 'left'
          ? padding + Math.random() * (halfW - gap - padding * 2)
          : halfW + gap + padding + Math.random() * (halfW - gap - padding * 2)
        const baseY = padding + Math.random() * (h - padding * 2)

        // Target position (where it snaps to when matched)
        const matchIdx = side === 'left' ? i + POINT_COUNT / 2 : i - POINT_COUNT / 2

        points.push({
          x: baseX,
          y: baseY,
          tx: baseX,
          ty: baseY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          matched: false,
          matchIdx,
          phase: Math.random() * Math.PI * 2,
          side,
        })
      }
    }

    function draw(now: number) {
      const w = canvas!.width / window.devicePixelRatio
      const h = canvas!.height / window.devicePixelRatio
      ctx!.clearRect(0, 0, w, h)

      const elapsed = (now - startTime) % CYCLE_DURATION
      const cycleProgress = elapsed / CYCLE_DURATION

      // Phase 0-0.3: drifting freely
      // Phase 0.3-0.5: snapping to matched positions
      // Phase 0.5-0.8: held in matched state with lines
      // Phase 0.8-1.0: releasing back to drift
      const halfW = w / 2

      // Draw divider
      ctx!.strokeStyle = 'rgba(26, 31, 48, 0.6)'
      ctx!.lineWidth = 1
      ctx!.setLineDash([4, 4])
      ctx!.beginPath()
      ctx!.moveTo(halfW, 0)
      ctx!.lineTo(halfW, h)
      ctx!.stroke()
      ctx!.setLineDash([])

      // Panel labels
      ctx!.font = '9px "JetBrains Mono", monospace'
      ctx!.fillStyle = 'rgba(138, 143, 156, 0.4)'
      ctx!.textAlign = 'center'
      ctx!.fillText('SOURCE', halfW / 2, 14)
      ctx!.fillText('TARGET', halfW + halfW / 2, 14)

      // Update and draw points
      const matchPhase = cycleProgress < 0.3 ? 0
        : cycleProgress < 0.5 ? (cycleProgress - 0.3) / 0.2
        : cycleProgress < 0.8 ? 1
        : 1 - (cycleProgress - 0.8) / 0.2

      for (let i = 0; i < points.length; i++) {
        const p = points[i]

        // Drift animation
        const drift = 1 - matchPhase
        p.x = p.tx + Math.sin(now * 0.001 + p.phase) * 6 * drift + p.vx * drift
        p.y = p.ty + Math.cos(now * 0.0013 + p.phase) * 4 * drift + p.vy * drift

        // Draw point
        const isLeft = p.side === 'left'
        const color = isLeft ? '#F5A623' : '#3EC6E0'
        const alpha = 0.5 + matchPhase * 0.4

        // Glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx!.fillStyle = isLeft
          ? `rgba(245, 166, 35, ${0.08 * alpha})`
          : `rgba(62, 198, 224, ${0.08 * alpha})`
        ctx!.fill()

        // Dot
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = color
        ctx!.globalAlpha = alpha
        ctx!.fill()
        ctx!.globalAlpha = 1

        // Ring when matched
        if (matchPhase > 0.5) {
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, 5, 0, Math.PI * 2)
          ctx!.strokeStyle = color
          ctx!.lineWidth = 0.5
          ctx!.globalAlpha = (matchPhase - 0.5) * 0.6
          ctx!.stroke()
          ctx!.globalAlpha = 1
        }
      }

      // Draw connection lines between matched pairs
      if (matchPhase > 0.1) {
        const lineAlpha = Math.min(matchPhase, 1) * 0.35
        ctx!.lineWidth = 0.8
        ctx!.setLineDash([2, 3])

        for (let i = 0; i < POINT_COUNT / 2; i++) {
          const left = points[i]
          const right = points[i + POINT_COUNT / 2]

          // Animated line draw
          const lineProgress = Math.min(1, matchPhase * 1.5)
          const endX = left.x + (right.x - left.x) * lineProgress
          const endY = left.y + (right.y - left.y) * lineProgress

          ctx!.beginPath()
          ctx!.moveTo(left.x, left.y)
          ctx!.lineTo(endX, endY)
          ctx!.strokeStyle = `rgba(242, 243, 245, ${lineAlpha})`
          ctx!.stroke()
        }
        ctx!.setLineDash([])
      }

      // Match count indicator
      const matchedCount = Math.floor(matchPhase * POINT_COUNT / 2)
      if (matchPhase > 0.1) {
        ctx!.font = '10px "JetBrains Mono", monospace'
        ctx!.fillStyle = `rgba(62, 198, 224, ${matchPhase * 0.7})`
        ctx!.textAlign = 'center'
        ctx!.fillText(
          `${matchedCount}/${POINT_COUNT / 2} CORRESPONDENCES`,
          halfW,
          h - 10
        )
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[200px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
