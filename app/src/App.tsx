import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Navigate, Route, Routes, matchPath, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { pageVariants } from './components/motion'
import { Gallery } from './pages/Gallery'
import { ModulePage } from './pages/ModulePage'
import { NewProjectPage } from './pages/NewProjectPage'
import { OnePagerPage } from './pages/OnePagerPage'
import { ProjectPage } from './pages/ProjectPage'
import { useStore } from './store/store'

/** Участник с главной попадает сразу в свой проект; куратор и гость — в галерею */
function Home() {
  const { role, currentProject } = useStore()
  if (role === 'member') return <Navigate to={currentProject ? `/p/${currentProject.id}` : '/new'} replace />
  return <Gallery />
}

/** Участник, открывший проект по ссылке, «становится» его командой — переключатель в шапке следует за URL */
function SyncCurrentProject() {
  const { pathname } = useLocation()
  const { role, currentProject, projects, setCurrentProject } = useStore()
  const id = matchPath('/p/:id/*', pathname)?.params.id
  useEffect(() => {
    if (role === 'member' && id && id !== currentProject?.id && projects.some((p) => p.id === id)) setCurrentProject(id)
  }, [role, id, currentProject?.id, projects, setCurrentProject])
  return null
}

/** Скролл наверх при смене страницы (внутри плавного перехода) */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  // Ключ перехода — страница целиком (без id модуля), чтобы шаги модуля меняли контент без «моргания» страницы
  const pageKey = location.pathname.replace(/\/m\/[^/]+$/, '/m')

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <SyncCurrentProject />
        <ScrollToTop />
        <Header />
        <main className="relative flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={pageKey} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<NewProjectPage />} />
                <Route path="/p/:id" element={<ProjectPage />} />
                <Route path="/p/:id/m/:mid" element={<ModulePage />} />
                <Route path="/p/:id/one-pager" element={<OnePagerPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="no-print border-t border-border/70 py-8">
          <div className="container-x flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <span>Launch Lab 21 · School 21</span>
            <span>Всё хранится в вашем браузере. Без серверов, без регистрации.</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
