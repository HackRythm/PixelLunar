import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
}

export default function IrisTransition({ children, className = '' }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={
        isInView
          ? { clipPath: 'circle(75% at 50% 50%)' }
          : { clipPath: 'circle(0% at 50% 50%)' }
      }
      transition={{
        duration: 0.9,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
