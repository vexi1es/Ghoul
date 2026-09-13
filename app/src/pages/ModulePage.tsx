import { Button, Card, Label, TextArea, TextField } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Comments } from '../components/Comments'
import { IconArrow, IconCheck, IconLayers } from '../components/icons'
import { EASE, Item, Magnetic, MaskText, Reveal } from '../components/motion'
import { Glow, ModuleStatusChip } from '../components/ui'
import { MODULES } from '../data/modules'
import { getAnswer, getCurrentModule, getModuleStatus } from '../lib/derive'
import { useStore } from '../store/store'

export function ModulePage() {
  const { id = '', mid = '' } = useParams()
  const { getProject, role, saveAnswers } = useStore()
  const navigate = useNavigate()
  const project = getProject(id)
  const index = MODULES.findIndex((m) => m.id === mid)
  const module = MODULES[index]

  const [values, setValues] = useState<Record<string, string>>({})
  const [savedAt, setSavedAt] = useState<number | null>(null)

  // При смене модуля/проекта подтягиваем сохранённые ответы в форму
  useEffect(() => {
    if (!project || !module) return
    const v: Record<string, string> = {}
    for (const f of module.fields) v[f.id] = project.answers[module.id]?.[f.id] ?? ''
    setValues(v)
    setSavedAt(null)
  }, [project?.id, module?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) return <Navigate to="/" replace />
  if (!module) return <Navigate to={`/p/${id}`} replace />
  if (role === 'guest') return <Navigate to={`/p/${id}/one-pager`} replace />

  const canEdit = role === 'member'
  const status = getModuleStatus(project, module)
  const isCurrent = getCurrentModule(project)?.id === module.id
  const prev = MODULES[index - 1]
  const next = MODULES[index + 1]
  const dirty = module.fields.some((f) => (values[f.id] ?? '') !== (project.answers[module.id]?.[f.id] ?? ''))

  const save = (thenGo?: string) => {
    saveAnswers(project.id, module.id, values)
    setSavedAt(Date.now())
    if (thenGo) navigate(thenGo)
  }

  return (
    <div className="relative overflow-hidden">
      <Glow variant="soft" />
      <div className="container-x py-10 md:py-16">
        <Link
          to={`/p/${project.id}`}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted no-underline transition-colors hover:text-foreground"
        >
          <IconArrow size={15} className="rotate-180" /> {project.title}
        </Link>

        <div className="grid-safe grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Шаги программы */}
            <motion.ol
              className="mb-8 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              aria-label="Шаги программы"
            >
              {MODULES.map((m, i) => {
                const st = getModuleStatus(project, m)
                const active = i === index
                return (
                  <li key={m.id} className="flex items-center gap-2">
                    <Link
                      to={`/p/${project.id}/m/${m.id}`}
                      title={m.title}
                      className={`grid size-8 place-items-center rounded-full text-xs font-semibold no-underline transition-all duration-300 ${
                        active
                          ? 'bg-foreground text-background ring-4 ring-foreground/10'
                          : st === 'done'
                            ? 'bg-success/15 text-success'
                            : 'bg-surface-secondary text-muted hover:bg-surface-tertiary'
                      }`}
                    >
                      {st === 'done' && !active ? <IconCheck size={14} /> : i + 1}
                    </Link>
                    {i < MODULES.length - 1 && <span className={`h-px w-6 ${st === 'done' ? 'bg-success/50' : 'bg-border'}`} />}
                  </li>
                )
              })}
            </motion.ol>

            <AnimatePresence mode="wait">
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="mb-8">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="eyebrow">
                      Модуль {index + 1} / {MODULES.length}
                    </span>
                    <ModuleStatusChip status={status} isCurrent={isCurrent} />
                  </div>
                  <MaskText text={module.title} className="h-display text-[38px] md:text-[54px]" />
                  <p className="lead mt-4 max-w-xl">{module.description}</p>
                </div>

                <Reveal stagger>
                  <Card>
                    <Card.Content className="flex flex-col gap-7">
                      {module.fields.map((f, i) => {
                        const saved = getAnswer(project, module.id, f.id)
                        return (
                          <Item key={f.id}>
                            {canEdit ? (
                              <TextField value={values[f.id] ?? ''} onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))}>
                                <Label className="text-[16px] font-semibold tracking-tight">
                                  <span className="mr-2 text-muted tabular-nums">0{i + 1}</span>
                                  {f.label}
                                </Label>
                                <TextArea placeholder={f.placeholder} className="min-h-28 text-[15px] leading-relaxed" />
                              </TextField>
                            ) : (
                              <div>
                                <div className="mb-2 text-[16px] font-semibold tracking-tight">
                                  <span className="mr-2 text-muted tabular-nums">0{i + 1}</span>
                                  {f.label}
                                </div>
                                {saved ? (
                                  <p className="rounded-2xl bg-surface-secondary px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap">
                                    {saved}
                                  </p>
                                ) : (
                                  <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted italic">
                                    Команда ещё не ответила
                                  </p>
                                )}
                              </div>
                            )}
                          </Item>
                        )
                      })}
                    </Card.Content>

                    {canEdit && (
                      <Card.Footer className="flex-wrap items-center gap-3">
                        <Magnetic strength={0.25}>
                          <Button size="lg" onPress={() => save()}>
                            Сохранить
                          </Button>
                        </Magnetic>
                        {next ? (
                          <Button size="lg" variant="secondary" onPress={() => save(`/p/${project.id}/m/${next.id}`)} className="gap-2">
                            Сохранить и дальше <IconArrow size={16} />
                          </Button>
                        ) : (
                          <Button size="lg" variant="secondary" onPress={() => save(`/p/${project.id}/one-pager`)} className="gap-2">
                            Сохранить и открыть one-pager <IconArrow size={16} />
                          </Button>
                        )}
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={savedAt && !dirty ? 'saved' : dirty ? 'dirty' : 'idle'}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="ml-auto flex items-center gap-1.5 text-sm text-muted"
                            aria-live="polite"
                          >
                            {savedAt && !dirty ? (
                              <>
                                <IconCheck size={15} className="text-success" /> Сохранено
                              </>
                            ) : dirty ? (
                              'Не сохранено'
                            ) : null}
                          </motion.span>
                        </AnimatePresence>
                      </Card.Footer>
                    )}
                  </Card>
                </Reveal>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between text-sm">
              {prev ? (
                <Link
                  to={`/p/${project.id}/m/${prev.id}`}
                  className="inline-flex items-center gap-1.5 text-muted no-underline transition-colors hover:text-foreground"
                >
                  <IconArrow size={14} className="rotate-180" /> {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/p/${project.id}/m/${next.id}`}
                  className="inline-flex items-center gap-1.5 text-muted no-underline transition-colors hover:text-foreground"
                >
                  {next.title} <IconArrow size={14} />
                </Link>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <Reveal delay={0.25}>
              <Card>
                <Card.Content>
                  <Comments project={project} moduleId={module.id} title="Комментарии куратора" canWrite={role === 'curator'} />
                </Card.Content>
              </Card>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="rounded-3xl bg-surface-secondary p-5 text-sm">
                <p className="mb-3 flex items-center gap-2 font-semibold">
                  <IconLayers size={16} /> Куда это попадёт
                </p>
                <ul className="flex flex-col gap-1.5 text-muted">
                  {module.fields.map((f) => (
                    <li key={f.id} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      Блок «{f.onePagerTitle}» в one-pager
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  )
}
