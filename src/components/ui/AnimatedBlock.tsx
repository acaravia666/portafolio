'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedBlockProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function AnimatedBlock({ children, delay = 0, className }: AnimatedBlockProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        ...itemVariants,
        visible: {
          ...itemVariants.visible,
          transition: { duration: 0.5, ease: 'easeOut', delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
