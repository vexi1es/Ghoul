export type Role = 'member' | 'curator' | 'guest'

export type Answers = Record<string, Record<string, string>> // answers[moduleId][fieldId]

export type Comment = {
  id: string
  moduleId: string | null // null — отзыв к one-pager целиком
  author: string // подпись: «Куратор», «Гость», имя
  role: Role
  text: string
  createdAt: string
}

export type Project = {
  id: string
  title: string
  team: string[]
  description: string
  answers: Answers
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export type State = {
  role: Role
  currentProjectId: string | null
  projects: Project[]
}

export const ROLE_LABEL: Record<Role, string> = {
  member: 'Участник',
  curator: 'Куратор',
  guest: 'Гость',
}
