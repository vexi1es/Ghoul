import { Button, Chip, Tabs } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowUpRight, IconLayers, IconRocket, IconUsers } from '../components/icons'
import { EASE, Item, Magnetic, MaskText, Reveal, Spotlight } from '../components/motion'
import { Glow, Initials, ProgressLine, StageChip, StageIconEl } from '../components/ui'
import { MODULES } from '../data/modules'
import type { Project } from '../data/types'
import { getCurrentModule, getLookingFor, getProgress, getStage, STAGE_META, type Stage } from '../lib/derive'
import { useStore } from '../store/store'

type Filter = 'all' | Stage | 'hiring'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'idea', label: 'Идеи' },
  { id: 'mvp', label: 'MVP' },
  { id: 'invest', label: 'К инвестициям' },
  { id: 'hiring', label: 'Ищут людей' },
]

function matches(p: Project, f: Filter) {
  if (f === 'all') return true
  if (f === 'hiring') return getLookingFor(p).length > 0
  return getStage(p) === f
}

/* ------------------------------------------------------------------ */
/* Карточка проекта                                                    */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const { role } = useStore()
  const looking = getLookingFor(project)
  const current = getCurrentModule(project)
  const { done, total } = getProgress(project)
  const to = role === 'curator' ? `/p/${project.id}` : `/p/${project.id}/one-pager`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.22 } }}
      transition={{ duration: 0.55, ease: EASE }}
      className={featured ? 'md:col-span-2' : ''}
    >
      <Link to={to} className="group block h-full no-underline">
        <Spotlight as="article" className={`flex h-full flex-col p-6 ${featured ? 'md:p-8' : ''}`}>
          <div className="mb-5 flex items-start justify-between gap-3">
            <StageChip project={project} size="sm" short={!featured} />
            <span className="grid size-9 place-items-center rounded-full border border-border text-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
              <IconArrowUpRight size={16} />
            </span>
          </div>

          <h3 className={`h-section ${featured ? 'text-[32px] md:text-[40px]' : 'text-[24px]'}`}>{project.title}</h3>
          <p className={`mt-2 text-muted ${featured ? 'max-w-lg text-[17px] leading-snug' : 'line-clamp-2 text-[15px] leading-snug'}`}>
            {project.description || <span className="italic">Команда ещё не описала идею</span>}
          </p>

          <div className="mt-auto flex flex-col gap-4 pt-6">
            <ProgressLine project={project} showLabel={false} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted tabular-nums">
                {done} / {total} модулей
              </span>
              {role === 'curator' && (
                <span className="truncate font-medium">{current ? `Сейчас: ${current.title}` : 'Программа пройдена'}</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 4).map((m) => (
                    <Initials key={m} name={m} size={7} />
                  ))}
                </div>
                <span className="truncate text-sm text-muted">{project.team.join(', ')}</span>
              </div>
              {looking.length > 0 && (
                <div className="hidden flex-wrap justify-end gap-1 sm:flex">
                  {looking.slice(0, featured ? 4 : 2).map((r) => (
                    <Chip key={r} size="sm" variant="secondary">
                      <Chip.Label>{r}</Chip.Label>
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Spotlight>
      </Link>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Bento-плитка со статистикой                                          */
/* ------------------------------------------------------------------ */
function StatTile({
  value,
  label,
  icon,
  accent,
  className = '',
  onClick,
}: {
  value: number | string
  label: string
  icon: React.ReactNode
  /** Выделенная плитка — светлая, с акцентной рамкой и цветной цифрой */
  accent?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <Spotlight className={`${accent ? 'spot--accent' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}>
      <button type="button" onClick={onClick} className="flex h-full w-full flex-col justify-between p-5 text-left" disabled={!onClick}>
        <span className={`grid size-9 place-items-center rounded-full ${accent ? 'bg-accent text-white' : 'bg-surface-secondary'}`}>{icon}</span>
        <span>
          <span className={`block h-display text-[44px] tabular-nums ${accent ? 'text-accent' : ''}`}>{value}</span>
          <span className="text-sm text-muted">{label}</span>
        </span>
      </button>
    </Spotlight>
  )
}

/* ------------------------------------------------------------------ */
/* Страница                                                            */
/* ------------------------------------------------------------------ */
export function Gallery() {
  const { projects, role } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const visible = useMemo(() => projects.filter((p) => matches(p, filter)), [projects, filter])

  const counts = {
    total: projects.length,
    invest: projects.filter((p) => getStage(p) === 'invest').length,
    hiring: projects.filter((p) => getLookingFor(p).length > 0).length,
    people: new Set(projects.flatMap((p) => p.team)).size,
  }

  const isCurator = role === 'curator'
  const jump = (f: Filter) => {
    setFilter(f)
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* ---------- Hero: асимметрия 7/5 + bento ---------- */}
      <section className="relative overflow-hidden pt-14 pb-16 md:pt-24 md:pb-20">
        <Glow />
        <div className="container-x grid-safe grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              className="eyebrow mb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            >
              {isCurator ? 'Режим куратора' : 'Demo Day · Launch Lab 21'}
            </motion.p>
            <MaskText
              text={isCurator ? 'Все команды. Один экран.' : 'Стартапы, которые растут прямо сейчас'}
              accent={isCurator ? ['экран.'] : ['растут']}
              className="h-display text-[44px] sm:text-[60px] lg:text-[76px]"
              delay={0.15}
            />
            <motion.p
              className="lead mt-6 max-w-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            >
              {isCurator
                ? 'Кто на каком модуле, кто застрял, кому нужна обратная связь. Открывайте ответы и оставляйте комментарии прямо к модулю.'
                : 'Стадия проекта считается из прогресса по программе. One-pager собирается из ответов команды. Ничего не пишется дважды.'}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            >
              <Magnetic>
                <Button size="lg" onPress={() => jump('invest')} className="gap-2">
                  Кто готов к инвестициям
                  <IconRocket size={17} />
                </Button>
              </Magnetic>
              <Button size="lg" variant="ghost" onPress={() => jump('hiring')}>
                Кому нужны люди
              </Button>
            </motion.div>
          </div>

          {/* Bento */}
          <motion.div
            className="grid grid-cols-2 gap-3 lg:col-span-5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } } }}
          >
            <Item className="col-span-2">
              <StatTile
                accent
                value={counts.total}
                label="команд в программе"
                icon={<IconLayers size={18} />}
                className="h-full"
                onClick={() => jump('all')}
              />
            </Item>
            <Item>
              <StatTile
                value={counts.invest}
                label="готовы к инвестициям"
                icon={<IconRocket size={18} />}
                className="h-full"
                onClick={() => jump('invest')}
              />
            </Item>
            <Item>
              <StatTile
                value={counts.hiring}
                label="ищут людей в команду"
                icon={<IconUsers size={18} />}
                className="h-full"
                onClick={() => jump('hiring')}
              />
            </Item>
          </motion.div>
        </div>
      </section>

      {/* ---------- Проекты + фильтр ---------- */}
      <section id="projects" className="container-x scroll-mt-24 pb-20">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Проекты</p>
            <h2 className="h-section text-[32px] md:text-[40px]">
              {visible.length === projects.length ? 'Все команды' : `${visible.length} из ${projects.length}`}
            </h2>
          </div>
          <Tabs
            aria-label="Фильтр по стадии"
            selectedKey={filter}
            onSelectionChange={(k) => setFilter(k as Filter)}
            variant="secondary"
            className="w-fit max-w-full"
          >
            <Tabs.List className="w-fit">
              {FILTERS.map((f) => (
                <Tabs.Tab key={f.id} id={f.id}>
                  {f.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Reveal>

        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-full rounded-3xl border border-dashed border-border px-6 py-20 text-center text-muted"
              >
                Под этот фильтр пока никого. Это временно.
              </motion.div>
            ) : (
              visible.map((p, i) => <ProjectCard key={p.id} project={p} featured={filter === 'all' && i === 0} />)
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ---------- Как считается стадия: смещённый bento ---------- */}
      <section id="how" className="relative overflow-hidden border-t border-border/70 py-20">
        <Glow variant="soft" />
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow mb-3">Как это работает</p>
            <h2 className="h-section text-[32px] md:text-[44px]">Стадию не выбирают. Её зарабатывают.</h2>
            <p className="lead mt-4">
              {MODULES.length} модуля программы. Каждый закрытый модуль двигает проект вперёд, а one-pager
              пересобирается сам.
            </p>
          </Reveal>

          <Reveal stagger className="grid gap-4 md:grid-cols-3">
            {(['idea', 'mvp', 'invest'] as Stage[]).map((s, i) => {
              const m = STAGE_META[s]
              const filled = i === 0 ? 1 : i === 1 ? 3 : 4
              return (
                <Item key={s} className={i === 1 ? 'md:translate-y-8' : ''}>
                  <Spotlight className={`h-full p-6 ${i === 2 ? 'spot--accent' : ''}`}>
                    <div className="mb-8 flex items-center justify-between">
                      <span className={`grid size-10 place-items-center rounded-full ${i === 2 ? 'bg-accent text-white' : 'bg-surface-secondary'}`}>
                        <StageIconEl icon={m.icon} size={18} />
                      </span>
                      <span className="text-xs text-muted tabular-nums">0{i + 1}</span>
                    </div>
                    <h3 className="h-section text-[26px]">{m.label}</h3>
                    <p className="mt-2 text-[15px] text-muted">{m.hint}</p>
                    <div className="mt-6 flex gap-1.5">
                      {MODULES.map((mod, k) => (
                        <span
                          key={mod.id}
                          className={`h-1.5 flex-1 rounded-full ${
                            k < filled ? 'bg-accent' : 'bg-surface-tertiary'
                          }`}
                        />
                      ))}
                    </div>
                  </Spotlight>
                </Item>
              )
            })}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
