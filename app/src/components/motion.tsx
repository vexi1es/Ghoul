import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from 'framer-motion'
import { useCallback, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'

/** Один easing на весь сайт — «expo out», как у top.co */
export const EASE = [0.22, 1, 0.36, 1] as const

/* ---------------------------------------------------------------------------
 * Reveal — появление при скролле: снизу + прозрачность, с каскадом у детей
 * ------------------------------------------------------------------------ */
export const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

type RevealProps = {
  children: ReactNode
  className?: string
  /** Задержка, сек */
  delay?: number
  /** Если true — сам элемент не анимируется, только каскадирует детей-<Item> */
  stagger?: boolean
  once?: boolean
  as?: 'div' | 'section' | 'li' | 'ul' | 'header' | 'article'
}

export function Reveal({ children, className, delay = 0, stagger, once = true, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -8% 0px' }}
      variants={
        stagger
          ? { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }
          : {
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
            }
      }
    >
      {children}
    </Tag>
  )
}

/** Ребёнок для Reveal stagger */
export function Item({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'span' | 'article' | 'section'
}) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={revealChild}>
      {children}
    </Tag>
  )
}

/* ---------------------------------------------------------------------------
 * MaskText — заголовок выезжает из-под маски пословно
 * ------------------------------------------------------------------------ */
export function MaskText({
  text,
  className,
  delay = 0,
  as: Tag = 'h1',
  accent,
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
  /** Слово (или слова), которые подсветить акцентом */
  accent?: string[]
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]" aria-hidden>
          <motion.span
            className={`inline-block ${accent?.includes(w) ? 'text-accent' : ''}`}
            initial={reduce ? false : { y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/* ---------------------------------------------------------------------------
 * Magnetic — обёртка, которая тянет CTA к курсору
 * ------------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (reduce || !ref.current) return
      const r = ref.current.getBoundingClientRect()
      x.set((e.clientX - (r.left + r.width / 2)) * strength)
      y.set((e.clientY - (r.top + r.height / 2)) * strength)
    },
    [reduce, strength, x, y],
  )
  const reset = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div ref={ref} className={`inline-block ${className ?? ''}`} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------------------
 * Spotlight — карточка с gradient spotlight под курсором и подсветкой границы
 * ------------------------------------------------------------------------ */
export function Spotlight({
  children,
  className = '',
  style,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'article' | 'section'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const Comp = Tag as 'div'
  return (
    <Comp ref={ref} onMouseMove={onMove} className={`spot ${className}`} style={style}>
      {children}
    </Comp>
  )
}

/* ---------------------------------------------------------------------------
 * Swap — плавная смена контента (fade + сдвиг), для табов и фильтров
 * ------------------------------------------------------------------------ */
export const swapVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } },
}

/** Переход между страницами */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: EASE } },
}
