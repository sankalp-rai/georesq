import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-base text-text-primary">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="scrollbar-thin flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
