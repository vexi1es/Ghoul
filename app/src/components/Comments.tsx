import { Button, TextArea, TextField } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { IconMessage } from './icons'
import { EASE } from './motion'
import { ROLE_LABEL, type Project } from '../data/types'
import { formatDate } from '../lib/derive'
import { useStore } from '../store/store'

type Props = {
  project: Project
  moduleId: string | null
  /** Заголовок блока */
  title?: string
  /** Кто может писать: по умолчанию куратор и гость */
  canWrite?: boolean
  placeholder?: string
}

export function Comments({ project, moduleId, title = 'Комментарии', canWrite, placeholder }: Props) {
  const { role, addComment } = useStore()
  const [text, setText] = useState('')
  const allowed = canWrite ?? role !== 'member'
  const list = project.comments.filter((c) => c.moduleId === moduleId)

  const submit = () => {
    const t = text.trim()
    if (!t) return
    addComment(project.id, { moduleId, role, author: ROLE_LABEL[role], text: t })
    setText('')
  }

  return (
    <section className="no-print">
      <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
        <IconMessage size={16} className="text-muted" />
        {title} <span className="text-muted tabular-nums">{list.length}</span>
      </h3>

      {list.length === 0 && !allowed && <p className="text-sm text-muted">Пока нет комментариев.</p>}

      <ul className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
        {list.map((c) => (
          <motion.li
            key={c.id}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-2xl bg-surface-secondary px-4 py-3"
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-foreground">{c.author}</span>
              <span>·</span>
              <span>{formatDate(c.createdAt)}</span>
            </div>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{c.text}</p>
          </motion.li>
        ))}
        </AnimatePresence>
      </ul>

      {allowed && (
        <TextField
          className="mt-3"
          value={text}
          onChange={setText}
          aria-label={title}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
          }}
        >
          <TextArea
            placeholder={placeholder ?? (role === 'curator' ? 'Замечание или совет команде…' : 'Отзыв или идея для команды…')}
            className="min-h-20"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted">Как {ROLE_LABEL[role]} · Ctrl+Enter</span>
            <Button size="sm" onPress={submit} isDisabled={!text.trim()}>
              Отправить
            </Button>
          </div>
        </TextField>
      )}
    </section>
  )
}
