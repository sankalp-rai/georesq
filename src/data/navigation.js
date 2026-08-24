import {
  LayoutDashboard,
  Map,
  Siren,
  Boxes,
  Users,
  FileBarChart,
  Settings,
} from 'lucide-react'

// Static nav model for the MVP shell. No router wired up yet —
// `active` marks the only implemented view for now.
export const navSections = [
  {
    label: 'Operations',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, active: true },
      { id: 'sitmap', label: 'Situation Map', icon: Map, comingSoon: true },
      { id: 'alerts', label: 'Alerts', icon: Siren, comingSoon: true, badge: 3 },
    ],
  },
  {
    label: 'Coordination',
    items: [
      { id: 'resources', label: 'Resources', icon: Boxes, comingSoon: true },
      { id: 'teams', label: 'Response Teams', icon: Users, comingSoon: true },
      { id: 'reports', label: 'Reports', icon: FileBarChart, comingSoon: true },
    ],
  },
]

export const navFooter = [
  { id: 'settings', label: 'Settings', icon: Settings, comingSoon: true },
]
