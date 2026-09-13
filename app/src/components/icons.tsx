import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Единый набор тонких line-иконок (stroke 1.5) — без эмодзи и без внешних библиотек */
function Base({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconSpark = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    <circle cx="12" cy="12" r="3" />
  </Base>
)

export const IconBuild = (p: IconProps) => (
  <Base {...p}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5L9 22l-3-3L16.5 8.5" />
    <path d="M14.5 6.5 17 4a4 4 0 0 1 4 4l-2.5 2.5" />
  </Base>
)

export const IconRocket = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
    <path d="M9 15 4.5 10.5c2-3.5 5-6 9.5-7.5 1.4 4.5-.5 9-2 11L9 15Z" />
    <path d="M9.5 10.5 13.5 14.5" />
    <circle cx="14.5" cy="9.5" r="1.25" />
  </Base>
)

export const IconUsers = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
    <path d="M15.5 4.8a3.25 3.25 0 0 1 0 6.4M17.5 14.7c2 .7 3 2.6 3 5.3" />
  </Base>
)

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
)

export const IconArrow = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)

export const IconArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)

export const IconPrinter = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 8V4h10v4M7 17H4.5A1.5 1.5 0 0 1 3 15.5v-5A2.5 2.5 0 0 1 5.5 8h13A2.5 2.5 0 0 1 21 10.5v5a1.5 1.5 0 0 1-1.5 1.5H17" />
    <path d="M7 14h10v6H7z" />
  </Base>
)

export const IconMessage = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12.5a7.5 7.5 0 0 1-11 6.6L4 20l1-4.6A7.5 7.5 0 1 1 20 12.5Z" />
  </Base>
)

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconLayers = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 17.5 12 22l9-4.5" />
  </Base>
)

export const IconTarget = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Base>
)

export const IconCoins = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="9" cy="7" rx="6" ry="2.5" />
    <path d="M3 7v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7" />
    <path d="M3 12v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" />
    <path d="M15 10.2c3.4.1 6 1.2 6 2.5v5c0 1.4-2.7 2.5-6 2.5" />
  </Base>
)

export const IconPen = (p: IconProps) => (
  <Base {...p}>
    <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
    <path d="m13.5 7.5 3 3" />
  </Base>
)

export const IconGrid = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Base>
)

export const IconLock = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </Base>
)

export const IconEye = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
)
