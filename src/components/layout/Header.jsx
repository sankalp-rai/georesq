import { useEffect, useState } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Bell } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import ScenarioSelector from './ScenarioSelector'
import { useScenario } from '../../context/useScenario'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Header({ onToggleSidebar, sidebarCollapsed, onOpenMobileNav }) {
  const now = useClock()
  const { selectedScenario } = useScenario()
  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const date = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
      <button
        onClick={onOpenMobileNav}
        className="rounded-sm p-1.5 text-text-secondary hover:bg-panel-raised hover:text-text-primary md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      <button
        onClick={onToggleSidebar}
        className="hidden rounded-sm p-1.5 text-text-secondary hover:bg-panel-raised hover:text-text-primary md:inline-flex"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-text-primary">
          Disaster Intelligence Command Center
        </h1>
        <p className="truncate font-mono text-[10px] uppercase tracking-widest text-text-faint">
          Universal geospatial response platform
        </p>
      </div>

      <div className="hidden sm:block"><ScenarioSelector /></div>
      <StatusBadge level={selectedScenario.hasDemoData ? 'warning' : 'watch'}>
        {selectedScenario.hasDemoData ? 'Orange Alert' : 'Demo Pending'}
      </StatusBadge>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-sm border border-line bg-panel-raised px-2.5 py-1.5 sm:flex">
          <Search size={14} className="text-text-faint" />
          <input
            type="text"
            placeholder="Search districts, teams, reports…"
            className="w-44 bg-transparent text-xs text-text-primary placeholder:text-text-faint focus:outline-none lg:w-64"
          />
        </div>

        <button
          className="relative rounded-sm p-2 text-text-secondary hover:bg-panel-raised hover:text-text-primary"
          aria-label="Alerts"
        >
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-status-severe" />
        </button>

        <div className="hidden flex-col items-end leading-tight sm:flex">
          <span className="font-mono text-sm tabular-nums text-text-primary">{time} IST</span>
          <span className="font-mono text-[10px] text-text-faint">{date}</span>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line-soft bg-panel-raised font-mono text-xs font-semibold text-text-secondary">
          OC
        </div>
      </div>
    </header>
  )
}
