import { Button, Card, Input, Label, TextArea, TextField } from '@heroui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { IconArrow, IconCheck, IconPen } from '../components/icons'
import { EASE, Item, Magnetic, MaskText, Reveal, Spotlight } from '../components/motion'
import { Glow, Initials, ModuleStatusChip, ProgressLine, StageChip, StageIconEl } from '../components/ui'
import { MODULES } from '../data/modules'
import type { Project } from '../data/types'
import { getCurrentModule, getModuleStatus, getProgress, getStage, STAGE_META } from '../lib/derive'
import { useStore } from '../store/store'

function ProfileEditor({ project, onDone }: { project: Project; onDone: () => void }) {
  const { updateProfile } = useStore()
  const [title, setTitle] = useState(project.title)
  const [team, setTeam] = useState(project.team.join(', '))
  const [description, setDescription] = useState(project.description)

  const save = () => {
    updateProfile(project.id, {
      title: title.trim() || 'Без названия',
      team: team.split(',').map((s) => s.trim()).filter(Boolean),
      description: description.trim(),
    })
    onDone()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
      <TextField value={title} onChange={setTitle} isRequired>
        <Label>Название</Label>
        <Input placeholder="Коротко. Как назовёте — так и запомнят" />
      </TextField>
      <TextField value={team} onChange={setTeam}>
        <Label>Команда</Label>
        <Input placeholder="Имена через запятую" />
      </TextField>
      <TextField value={description} onChange={setDescription}>
        <Label>Одной фразой</Label>
        <TextArea placeholder="Что делаете и для кого" />
      </TextField>
      <div className="flex gap-2">
        <Button onPress={save}>Сохранить</Button>
        <Button variant="ghost" onPress={onDone}>
          Отмена
        </Button>
      </div>
    </motion.div>
  )
}

export function ProjectPage() {
  const { id = '' } = useParams()
  const { getProject, role } = useStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const project = getProject(id)

  if (!project) return <Navigate to="/" replace />
  if (role === 'guest') return <Navigate to={`/p/${id}/one-pager`} replace />

  const canEdit = role === 'member'
  const current = getCurrentModule(project)
  const stage = getStage(project)
  const { done, total, percent } = getProgress(project)

  return (
    <div className="relative overflow-hidden">
      <Glow variant="soft" />
      <div className="container-x py-10 md:py-16">
        {role === 'curator' && (
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted no-underline transition-colors hover:text-foreground">
            <IconArrow size={15} className="rotate-180" /> Все команды
          </Link>
        )}

        <div className="grid-safe grid gap-10 lg:grid-cols-12">
          {/* ---------- Заголовок + модули ---------- */}
          <div className="lg:col-span-8">
            <motion.div
              className="mb-3 flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="eyebrow">{canEdit ? 'Ваш проект' : 'Проект команды'}</span>
              <StageChip project={project} size="sm" />
            </motion.div>
            <MaskText text={project.title} className="h-display text-[44px] md:text-[64px]" delay={0.05} />
            <motion.p
              className="lead mt-5 max-w-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            >
              {project.description || <span className="italic">Пока без описания — добавьте одной фразой справа.</span>}
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            >
              {canEdit && current && (
                <Magnetic>
                  <Button size="lg" onPress={() => navigate(`/p/${project.id}/m/${current.id}`)} className="gap-2">
                    {done === 0 ? 'Начать программу' : 'Продолжить'}
                    <IconArrow size={17} />
                  </Button>
                </Magnetic>
              )}
              <Button size="lg" variant={canEdit && current ? 'secondary' : 'primary'} onPress={() => navigate(`/p/${project.id}/one-pager`)}>
                Открыть one-pager
              </Button>
            </motion.div>

            <Reveal className="mt-14 mb-5 flex items-end justify-between" delay={0.2}>
              <h2 className="h-section text-[28px]">Программа</h2>
              <span className="text-sm text-muted tabular-nums">
                {done} / {total} · {percent}%
              </span>
            </Reveal>

            <Reveal stagger as="ul" className="flex flex-col gap-3" delay={0.25}>
              {MODULES.map((m, i) => {
                const status = getModuleStatus(project, m)
                const isCurrent = current?.id === m.id
                return (
                  <Item key={m.id} as="li">
                    <Link to={`/p/${project.id}/m/${m.id}`} className="group block no-underline">
                      <Spotlight className={`flex items-center gap-5 p-5 ${isCurrent ? 'border-accent/60 shadow-glow' : ''}`}>
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors ${
                            status === 'done'
                              ? 'bg-success text-white'
                              : isCurrent
                                ? 'bg-accent text-white'
                                : 'bg-surface-secondary text-muted'
                          }`}
                        >
                          {status === 'done' ? <IconCheck size={18} /> : `0${i + 1}`}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[18px] font-semibold tracking-tight">{m.title}</span>
                            <ModuleStatusChip status={status} isCurrent={isCurrent} />
                          </div>
                          <p className="mt-0.5 truncate text-sm text-muted">{m.description}</p>
                        </div>
                        <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-muted transition-colors group-hover:text-foreground sm:flex">
                          {canEdit ? (status === 'empty' ? 'Заполнить' : 'Открыть') : 'Ответы'}
                          <IconArrow size={15} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                        </span>
                      </Spotlight>
                    </Link>
                  </Item>
                )
              })}
            </Reveal>
          </div>

          {/* ---------- Сайдбар: стадия + профиль ---------- */}
          <aside className="flex flex-col gap-4 lg:col-span-4">
            <Reveal delay={0.3}>
              <Spotlight className="spot--accent p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-accent text-white">
                    <StageIconEl icon={STAGE_META[stage].icon} size={18} />
                  </span>
                  <span className="eyebrow">Стадия</span>
                </div>
                <div className="h-section text-[28px]">{STAGE_META[stage].label}</div>
                <p className="mt-2 text-sm text-muted">
                  {done === total
                    ? 'Программа пройдена. One-pager готов к показу инвесторам.'
                    : current
                      ? `Дальше — «${current.title}». Стадия обновится сама.`
                      : ''}
                </p>
                <div className="mt-6">
                  <ProgressLine project={project} />
                </div>
              </Spotlight>
            </Reveal>

            <Reveal delay={0.4}>
              <Card>
                <Card.Header className="flex-row items-center justify-between">
                  <Card.Title className="text-lg">Профиль</Card.Title>
                  {canEdit && !editing && (
                    <Button size="sm" variant="ghost" onPress={() => setEditing(true)} className="gap-1.5">
                      <IconPen size={14} /> Изменить
                    </Button>
                  )}
                </Card.Header>
                <Card.Content>
                  {editing ? (
                    <ProfileEditor project={project} onDone={() => setEditing(false)} />
                  ) : (
                    <dl className="flex flex-col gap-4 text-sm">
                      <div>
                        <dt className="eyebrow mb-1.5">Команда</dt>
                        <dd className="flex flex-col gap-2">
                          {project.team.map((m) => (
                            <span key={m} className="flex items-center gap-2.5 font-medium">
                              <Initials name={m} /> {m}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow mb-1.5">Описание</dt>
                        <dd className="font-medium leading-snug">
                          {project.description || <span className="text-muted italic">не заполнено</span>}
                        </dd>
                      </div>
                    </dl>
                  )}
                </Card.Content>
              </Card>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  )
}
