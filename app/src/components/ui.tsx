import { Chip, ProgressBar } from '@heroui/react'
import type { Project } from '../data/types'
import { getProgress, getStage, STAGE_META, type ModuleStatus, type Stage, type StageIcon } from '../lib/derive'
import { IconBuild, IconRocket, IconSpark } from './icons'

const STAGE_COLOR: Record<Stage, 'default' | 'accent' | 'success'> = {
  idea: 'default',
  mvp: 'accent',
  invest: 'success',
}

export function StageIconEl({ icon, size = 14 }: { icon: StageIcon; size?: number }) {
  if (icon === 'spark') return <IconSpark size={size} />
  if (icon === 'build') return <IconBuild size={size} />
  return <IconRocket size={size} />
}

export function StageChip({ project, size = 'md', short }: { project: Project; size?: 'sm' | 'md' | 'lg'; short?: boolean }) {
  const stage = getStage(project)
  const meta = STAGE_META[stage]
  return (
    <Chip color={STAGE_COLOR[stage]} variant="soft" size={size} title={meta.hint} className="gap-1.5 pl-2">
      <StageIconEl icon={meta.icon} size={size === 'sm' ? 13 : 15} />
      <Chip.Label>{short ? meta.short : meta.label}</Chip.Label>
    </Chip>
  )
}

export function ProgressLine({ project, showLabel = true }: { project: Project; showLabel?: boolean }) {
  const { done, total, percent } = getProgress(project)
  return (
    <ProgressBar value={percent} aria-label="Прогресс по модулям" color="accent" className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted">Прогресс</span>
          <span className="font-medium tabular-nums">
            {done} / {total}
          </span>
        </div>
      )}
      <ProgressBar.Track className="h-1.5 rounded-full bg-surface-tertiary">
        <ProgressBar.Fill className="rounded-full bg-accent" />
      </ProgressBar.Track>
    </ProgressBar>
  )
}

const STATUS_META: Record<ModuleStatus, { label: string; color: 'default' | 'accent' | 'success' | 'warning' }> = {
  done: { label: 'Пройден', color: 'success' },
  partial: { label: 'В работе', color: 'warning' },
  empty: { label: 'Не начат', color: 'default' },
}

export function ModuleStatusChip({ status, isCurrent }: { status: ModuleStatus; isCurrent: boolean }) {
  if (isCurrent && status !== 'done') {
    return (
      <Chip color="accent" variant="primary" size="sm">
        <Chip.Label>Сейчас здесь</Chip.Label>
      </Chip>
    )
  }
  const m = STATUS_META[status]
  return (
    <Chip color={m.color} variant="soft" size="sm">
      <Chip.Label>{m.label}</Chip.Label>
    </Chip>
  )
}

/** Синий «мазок кисти» под словом, рисуется при загрузке */
export function Brush({ children }: { children: React.ReactNode }) {
  return (
    <span className="underline-brush">
      {children}
      <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
        <path d="M3 9 C 40 3, 90 2, 197 6" stroke="#2f7bf0" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  )
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-secondary/60 px-5 py-6 text-center text-[15px] text-muted">
      {children}
    </div>
  )
}

export function Initials({ name, size = 8 }: { name: string; size?: 7 | 8 | 10 }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  const sz = size === 10 ? 'size-10 text-xs' : size === 7 ? 'size-7 text-[10px]' : 'size-8 text-[11px]'
  return (
    <span
      className={`grid ${sz} shrink-0 place-items-center rounded-full bg-foreground font-semibold text-background ring-2 ring-background`}
    >
      {letters || '?'}
    </span>
  )
}

/** Фоновые свечения — кладём в relative-контейнер */
export function Glow({ variant = 'hero' }: { variant?: 'hero' | 'soft' }) {
  if (variant === 'soft')
    return (
      <div className="glow-field" aria-hidden>
        <i className="left-[-10%] top-[-20%] h-[420px] w-[520px] bg-[var(--glow-blue)]" />
      </div>
    )
  return (
    <div className="glow-field" aria-hidden>
      <i className="left-[-8%] top-[-10%] h-[520px] w-[640px] bg-[var(--glow-blue)] animate-float" />
      <i className="right-[-6%] top-[10%] h-[420px] w-[520px] bg-[var(--glow-violet)] animate-float [animation-delay:-3s]" />
      <i className="bottom-[-30%] left-[35%] h-[380px] w-[480px] bg-[var(--glow-mint)]" />
    </div>
  )
}
