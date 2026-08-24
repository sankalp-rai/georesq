import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/Overview'

// Routing, auth, and live data are not wired up yet — this shell renders
// the Overview page directly as the foundation for those to plug into.
export default function App() {
  return (
    <DashboardLayout>
      <Overview />
    </DashboardLayout>
  )
}
