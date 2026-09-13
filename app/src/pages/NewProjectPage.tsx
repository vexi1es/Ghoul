import { Button, Card, Input, Label, TextArea, TextField } from '@heroui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrow } from '../components/icons'
import { EASE, Item, Magnetic, MaskText, Reveal } from '../components/motion'
import { Glow } from '../components/ui'
import { MODULES } from '../data/modules'
import { useStore } from '../store/store'

export function NewProjectPage() {
  const { createProject } = useStore()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [team, setTeam] = useState('')
  const [description, setDescription] = useState('')

  const submit = () => {
    if (!title.trim()) return
    const p = createProject({
      title: title.trim(),
      team: team.split(',').map((s) => s.trim()).filter(Boolean),
      description: description.trim(),
    })
    navigate(`/p/${p.id}/m/${MODULES[0].id}`)
  }

  return (
    <div className="relative overflow-hidden">
      <Glow />
      <div className="container-x py-12 md:py-20">
        <div className="grid-safe grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.p
              className="eyebrow mb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Новый проект
            </motion.p>
            <MaskText text="Сырая идея — это нормально." className="h-display text-[42px] md:text-[56px]" delay={0.1} />
            <motion.p
              className="lead mt-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            >
              Название и пара имён. Остальное вытянут модули: {MODULES.length} шага, и one-pager соберётся сам.
            </motion.p>
            <Reveal stagger as="ul" className="mt-8 flex flex-col gap-2" delay={0.5}>
              {MODULES.map((m, i) => (
                <Item key={m.id} as="li" className="flex items-center gap-3 text-sm">
                  <span className="grid size-7 place-items-center rounded-full bg-surface-secondary text-xs font-semibold text-muted tabular-nums">
                    {i + 1}
                  </span>
                  <span className="font-medium">{m.title}</span>
                </Item>
              ))}
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.3}>
            <Card>
              <Card.Content className="flex flex-col gap-5">
                <TextField value={title} onChange={setTitle} isRequired autoFocus>
                  <Label>Название</Label>
                  <Input placeholder="Коротко. Как назовёте — так и запомнят" />
                </TextField>
                <TextField value={team} onChange={setTeam}>
                  <Label>Команда</Label>
                  <Input placeholder="Имена через запятую" />
                </TextField>
                <TextField value={description} onChange={setDescription}>
                  <Label>Одной фразой</Label>
                  <TextArea placeholder="Что делаете и для кого. Можно уточнить позже" />
                </TextField>
              </Card.Content>
              <Card.Footer className="gap-2">
                <Magnetic strength={0.25}>
                  <Button size="lg" onPress={submit} isDisabled={!title.trim()} className="gap-2">
                    Создать и начать <IconArrow size={17} />
                  </Button>
                </Magnetic>
                <Button size="lg" variant="ghost" onPress={() => navigate(-1)}>
                  Отмена
                </Button>
              </Card.Footer>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
