import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SEED } from '../data/seed'
import type { Comment, Project, Role, State } from '../data/types'

const KEY = 'll21'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as State
      if (parsed && Array.isArray(parsed.projects)) return parsed
    }
  } catch {
    /* повреждённые данные — начинаем с сида */
  }
  return SEED
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

type Store = {
  state: State
  role: Role
  projects: Project[]
  currentProject: Project | null
  setRole: (role: Role) => void
  setCurrentProject: (id: string) => void
  getProject: (id: string) => Project | undefined
  createProject: (data: Pick<Project, 'title' | 'team' | 'description'>) => Project
  updateProfile: (id: string, data: Pick<Project, 'title' | 'team' | 'description'>) => void
  saveAnswers: (projectId: string, moduleId: string, values: Record<string, string>) => void
  addComment: (projectId: string, c: Omit<Comment, 'id' | 'createdAt'>) => void
  resetAll: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  // Каждое изменение сразу уходит в LocalStorage
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const store = useMemo<Store>(() => {
    const patchProject = (id: string, fn: (p: Project) => Project) =>
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) => (p.id === id ? { ...fn(p), updatedAt: new Date().toISOString() } : p)),
      }))

    return {
      state,
      role: state.role,
      projects: state.projects,
      currentProject: state.projects.find((p) => p.id === state.currentProjectId) ?? null,
      setRole: (role) => setState((s) => ({ ...s, role })),
      setCurrentProject: (id) => setState((s) => ({ ...s, currentProjectId: id })),
      getProject: (id) => state.projects.find((p) => p.id === id),
      createProject: (data) => {
        const now = new Date().toISOString()
        const p: Project = { id: uid('p'), ...data, answers: {}, comments: [], createdAt: now, updatedAt: now }
        setState((s) => ({ ...s, projects: [...s.projects, p], currentProjectId: p.id }))
        return p
      },
      updateProfile: (id, data) => patchProject(id, (p) => ({ ...p, ...data })),
      saveAnswers: (projectId, moduleId, values) =>
        patchProject(projectId, (p) => ({
          ...p,
          answers: { ...p.answers, [moduleId]: { ...(p.answers[moduleId] ?? {}), ...values } },
        })),
      addComment: (projectId, c) =>
        patchProject(projectId, (p) => ({
          ...p,
          comments: [...p.comments, { ...c, id: uid('c'), createdAt: new Date().toISOString() }],
        })),
      resetAll: () => setState(SEED),
    }
  }, [state])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}
