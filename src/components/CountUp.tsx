import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function CountUp({
  value,
  decimals = 0,
  duration = 1200,
  prefix = '',
  suffix = '',
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState('0')
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return
    hasStarted.current = true

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * value

      setDisplay(current.toFixed(decimals))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplay(value.toFixed(decimals))
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, value, decimals, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
