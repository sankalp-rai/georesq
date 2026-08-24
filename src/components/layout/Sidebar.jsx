import { Radio, X } from 'lucide-react'
import { navSections, navFooter } from '../../data/navigation'

function NavItem({ item, collapsed }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      disabled={item.comingSoon}
      title={item.comingSoon ? `${item.label} — coming soon` : item.label}
      className={`relative flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors
        ${item.active
          ? 'bg-accent-soft text-text-primary'
          : item.comingSoon
            ? 'cursor-not-allowed text-text-faint'
            : 'text-text-secondary hover:bg-panel-raised hover:text-text-primary'
        }`}
    >
      {item.active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
      )}
      <Icon size={17} strokeWidth={1.75} className={item.active ? 'text-accent' : ''} />
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="rounded-full bg-status-severe-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-status-severe">
          {item.badge}
        </span>
      )}
      {!collapsed && item.comingSoon && !item.badge && (
        <span className="font-mono text-[9px] uppercase tracking-wide text-text-faint">soon</span>
      )}
    </button>
  )
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-line-soft bg-panel-raised">
          <Radio size={16} className="text-hydro" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-text-primary">GeoResQ</p>
            <p className="truncate font-mono text-[10px] uppercase tracking-widest text-text-faint">
              Response Console
            </p>
          </div>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-sm p-1 text-text-faint hover:bg-panel-raised hover:text-text-primary md:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2.5 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5 last:mb-0">
            {!collapsed && (
              <p className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.id} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-2.5 py-3">
        {navFooter.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-line bg-panel transition-[width] duration-150 md:block ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {content}
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-50 h-full w-64 border-r border-line bg-panel">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
