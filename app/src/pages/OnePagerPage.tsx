import { Button, Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Comments } from '../components/Comments'
import { IconArrow, IconCoins, IconPen, IconPrinter, IconUsers } from '../components/icons'
import { EASE, Item, Magnetic, MaskText, Reveal, Spotlight } from '../components/motion'
import { EmptyNote, Glow, Initials, ProgressLine, StageChip } from '../components/ui'
import { MODULES, type Module } from '../data/modules'
import type { Project } from '../data/types'
import { formatDate, getAnswer, getLookingFor, getModuleStatus, getProgress, getStage, STAGE_META } from '../lib/derive'
import { useStore } from '../store/store'

function Block({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <h4 className="eyebrow mb-2">{title}</h4>
      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{children}</div>
    </div>
  )
}

/** Секция one-pager из одного модуля. Пустой модуль — честно пустой раздел. */
function ModuleSection({ project, module, index }: { project: Project; module: Module; index: number }) {
  const status = getModuleStatus(project, module)
  const editable = useStore().role === 'member'

  return (
    <Spotlight as="section" className="print-plain p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="h-section flex items-baseline gap-3 text-[24px]">
          <span className="text-sm text-muted tabular-nums">0{index + 1}</span>
          {module.title}
        </h3>
        {status === 'partial' && (
          <Chip size="sm" color="warning" variant="soft">
            <Chip.Label>частично</Chip.Label>
          </Chip>
        )}
      </div>

      {status === 'empty' ? (
        <EmptyNote>
          Модуль ещё не заполнен.
          {editable && (
            <>
              {' '}
              <Link to={`/p/${project.id}/m/${module.id}`} className="font-medium text-accent">
                Заполнить
              </Link>
            </>
          )}
        </EmptyNote>
      ) : module.id === 'm4' ? (
        <TeamSection project={project} module={module} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {module.fields.map((f, i) => {
            const a = getAnswer(project, module.id, f.id)
            return (
              <Block key={f.id} title={f.onePagerTitle} wide={i === 0}>
                {a || <span className="text-muted italic">— не заполнено</span>}
              </Block>
            )
          })}
        </div>
      )}
    </Spotlight>
  )
}

/** Модуль «Команда и ресурсы» — блоки «Ищем в команду» и «Инвестиции» */
function TeamSection({ project, module }: { project: Project; module: Module }) {
  const [roles, looking, money] = module.fields
  const rolesText = getAnswer(project, module.id, roles.id)
  const lookingFor = getLookingFor(project)
  const moneyText = getAnswer(project, module.id, money.id)

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Block title={roles.onePagerTitle}>{rolesText || <span className="text-muted italic">— не заполнено</span>}</Block>
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="eyebrow mb-2 flex items-center gap-1.5">
            <IconUsers size={13} /> {looking.onePagerTitle}
          </h4>
          {lookingFor.length ? (
            <div className="flex flex-wrap gap-1.5">
              {lookingFor.map((r) => (
                <Chip key={r} color="accent" variant="soft">
                  <Chip.Label>{r}</Chip.Label>
                </Chip>
              ))}
            </div>
          ) : (
            <span className="text-[15px] text-muted italic">— не заполнено</span>
          )}
        </div>
        <div className="print-plain relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <span className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-accent/15 blur-3xl print:hidden" aria-hidden />
          <h4 className="eyebrow mb-2 flex items-center gap-1.5 text-accent">
            <IconCoins size={13} /> {money.onePagerTitle}
          </h4>
          <p className="relative text-[15px] leading-relaxed whitespace-pre-wrap">
            {moneyText || <span className="text-muted italic">— не заполнено</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

export function OnePagerPage() {
  const { id = '' } = useParams()
  const { getProject, role } = useStore()
  const navigate = useNavigate()
  const project = getProject(id)
  if (!project) return <Navigate to="/" replace />

  const stage = getStage(project)
  const { done, total } = getProgress(project)
  const backTo = role === 'member' ? `/p/${project.id}` : '/'
  const backLabel = role === 'member' ? 'К модулям' : role === 'curator' ? 'Все команды' : 'Галерея'

  return (
    <div className="relative overflow-hidden">
      <Glow />
      <div className="container-x max-w-5xl py-10 md:py-16">
        <motion.div
          className="no-print mb-8 flex flex-wrap items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-muted no-underline transition-colors hover:text-foreground">
            <IconArrow size={15} className="rotate-180" /> {backLabel}
          </Link>
          <div className="flex gap-2">
            {role === 'member' && (
              <Button variant="secondary" onPress={() => navigate(`/p/${project.id}`)} className="gap-1.5">
                <IconPen size={15} /> Редактировать
              </Button>
            )}
            <Magnetic strength={0.25}>
              <Button onPress={() => window.print()} className="gap-2">
                <IconPrinter size={16} /> PDF
              </Button>
            </Magnetic>
          </div>
        </motion.div>

        {/* ---------- Шапка one-pager ---------- */}
        <header className="mb-10">
          <motion.div
            className="mb-4 flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <StageChip project={project} />
            <span className="text-sm text-muted">{STAGE_META[stage].hint}</span>
          </motion.div>
          <MaskText text={project.title} className="h-display text-[48px] md:text-[80px]" delay={0.05} />
          <motion.p
            className="lead mt-5 max-w-2xl text-[20px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          >
            {project.description || <span className="italic">Краткое описание пока не заполнено</span>}
          </motion.p>

          {/* На экране — карточка с аватарами и прогрессом */}
          <motion.div
            className="no-print mt-8 grid gap-4 rounded-3xl border border-border bg-surface/70 p-5 backdrop-blur-sm sm:grid-cols-[auto_1fr_auto] sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {project.team.map((m) => (
                  <Initials key={m} name={m} />
                ))}
              </div>
              <span className="text-[15px] font-medium">{project.team.join(', ')}</span>
            </div>
            <div className="sm:max-w-xs sm:justify-self-center sm:w-full">
              <ProgressLine project={project} />
            </div>
            <span className="text-sm text-muted">Обновлено {formatDate(project.updatedAt)}</span>
          </motion.div>

          {/* В PDF — обычный список: стадия, прогресс, участники */}
          <ul className="print-list mt-6 hidden list-disc pl-5 text-[15px] leading-relaxed print:block">
            <li>
              <span className="text-muted">Стадия:</span> {STAGE_META[stage].label}
            </li>
            <li>
              <span className="text-muted">Прогресс:</span> {done} из {total} модулей
            </li>
            {project.team.map((m) => (
              <li key={m}>{m}</li>
            ))}
            <li>
              <span className="text-muted">Обновлено:</span> {formatDate(project.updatedAt)}
            </li>
          </ul>
        </header>

        {/* ---------- Секции из модулей (генерируются из MODULES) ---------- */}
        <Reveal stagger className="flex flex-col gap-4" delay={0.15}>
          {MODULES.map((m, i) => (
            <Item key={m.id}>
              <ModuleSection project={project} module={m} index={i} />
            </Item>
          ))}
        </Reveal>

        <Reveal className="mt-8 flex items-center justify-between text-xs text-muted">
          <span>Собрано автоматически из ответов команды в программе Launch Lab 21</span>
          <span className="hidden print:inline">launchlab21</span>
        </Reveal>

        <Reveal className="no-print mt-10">
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
            <Comments
              project={project}
              moduleId={null}
              title={role === 'curator' ? 'Комментарии к проекту' : 'Отзывы и идеи'}
              canWrite={role !== 'member'}
            />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
