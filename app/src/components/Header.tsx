import { Button, ListBox, Select, Tabs } from '@heroui/react'
import { motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ROLE_LABEL, type Role } from '../data/types'
import { useStore } from '../store/store'
import { IconPlus } from './icons'
import { Initials } from './ui'
import { EASE } from './motion'

const ROLES: Role[] = ['member', 'curator', 'guest']

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5 text-foreground no-underline">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-foreground text-background">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 2h3v9h7v3H3z" fill="#2f7bf0" />
        </svg>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight whitespace-nowrap">Launch Lab 21</span>
    </Link>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return `relative rounded-full px-3.5 py-1.5 text-[15px] font-medium whitespace-nowrap no-underline transition-colors duration-300 ${
    isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
  }`
}

export function Header() {
  const { role, setRole, projects, currentProject, setCurrentProject } = useStore()
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="no-print sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md"
    >
      <div className="container-x flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 py-2">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {role === 'member' && currentProject ? (
            <>
              <NavLink to={`/p/${currentProject.id}`} end className={navClass}>
                {({ isActive }) => <NavItem active={isActive}>Мой проект</NavItem>}
              </NavLink>
              <NavLink to={`/p/${currentProject.id}/one-pager`} className={navClass}>
                {({ isActive }) => <NavItem active={isActive}>One-pager</NavItem>}
              </NavLink>
            </>
          ) : (
            <NavLink to="/" end className={navClass}>
              {({ isActive }) => <NavItem active={isActive}>{role === 'curator' ? 'Все команды' : 'Галерея'}</NavItem>}
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {role === 'member' && (
            <div className="hidden items-center gap-2 sm:flex">
              <Select
                aria-label="Команда"
                selectedKey={currentProject?.id ?? null}
                onSelectionChange={(k) => {
                  if (k == null) return
                  setCurrentProject(String(k))
                  navigate(`/p/${String(k)}`)
                }}
                className="w-auto"
              >
                <Select.Trigger className="h-9 min-h-9 max-w-52 rounded-full border-border bg-surface ps-3 pe-8 text-sm font-medium shadow-none transition-colors hover:border-foreground/30 data-[open]:border-foreground/40">
                  <Select.Value className="flex items-center gap-2 truncate">
                    {({ selectedText }) => (
                      <>
                        {currentProject && <Initials name={currentProject.title} size={7} />}
                        <span className="truncate">{selectedText || 'Команда'}</span>
                      </>
                    )}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="min-w-56 rounded-2xl border-border p-1.5 shadow-lift">
                  <ListBox aria-label="Проекты">
                    {projects.map((p) => (
                      <ListBox.Item key={p.id} id={p.id} textValue={p.title} className="rounded-xl">
                        <span className="flex items-center gap-2.5">
                          <Initials name={p.title} size={7} />
                          <span className="truncate text-sm font-medium">{p.title}</span>
                        </span>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <Button size="sm" variant="secondary" onPress={() => navigate('/new')} className="gap-1.5">
                <IconPlus size={15} />
                Проект
              </Button>
            </div>
          )}

          <Tabs
            aria-label="Роль"
            selectedKey={role}
            onSelectionChange={(k) => {
              setRole(k as Role)
              navigate(k === 'member' && currentProject ? `/p/${currentProject.id}` : '/')
            }}
            variant="secondary"
          >
            <Tabs.List>
              {ROLES.map((r) => (
                <Tabs.Tab key={r} id={r}>
                  {ROLE_LABEL[r]}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
      </div>
    </motion.header>
  )
}

/** Активный пункт — «пилюля» плавно переезжает между ссылками */
function NavItem({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <>
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-surface-secondary"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      {children}
    </>
  )
}
