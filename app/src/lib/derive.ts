import { MODULES, type Module } from '../data/modules'
import type { Project } from '../data/types'

export type ModuleStatus = 'done' | 'partial' | 'empty'
export type Stage = 'idea' | 'mvp' | 'invest'

export type StageIcon = 'spark' | 'build' | 'rocket'

export const STAGE_META: Record<Stage, { label: string; short: string; icon: StageIcon; hint: string }> = {
  idea: { label: 'Идея', short: 'Идея', icon: 'spark', hint: 'Меньше двух модулей пройдено' },
  mvp: { label: 'MVP', short: 'MVP', icon: 'build', hint: 'Есть решение и понимание рынка' },
  invest: { label: 'Готов к инвестициям', short: 'Инвестиции', icon: 'rocket', hint: 'Вся программа пройдена' },
}

export function getAnswer(project: Project, moduleId: string, fieldId: string): string {
  return project.answers[moduleId]?.[fieldId]?.trim() ?? ''
}

export function getModuleStatus(project: Project, module: Module): ModuleStatus {
  const filled = module.fields.filter((f) => getAnswer(project, module.id, f.id) !== '').length
  if (filled === 0) return 'empty'
  if (filled === module.fields.length) return 'done'
  return 'partial'
}

export function getProgress(project: Project) {
  const done = MODULES.filter((m) => getModuleStatus(project, m) === 'done').length
  return { done, total: MODULES.length, percent: Math.round((done / MODULES.length) * 100) }
}

/** Текущий модуль — первый, который ещё не пройден целиком */
export function getCurrentModule(project: Project): Module | null {
  return MODULES.find((m) => getModuleStatus(project, m) !== 'done') ?? null
}

/** Стадия не хранится — она вытекает из прогресса команды */
export function getStage(project: Project): Stage {
  const { done, total } = getProgress(project)
  if (done === total) return 'invest'
  if (done >= 2) return 'mvp'
  return 'idea'
}

/** «Кого ищем» из модуля 4 в виде списка ролей */
export function getLookingFor(project: Project): string[] {
  return getAnswer(project, 'm4', 'q2')
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
