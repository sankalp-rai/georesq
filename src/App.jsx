import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/Overview'
import { ScenarioProvider } from './context/ScenarioContext.jsx'

// Routing, auth, and live data are not wired up yet — this shell renders
// the Overview page directly as the foundation for those to plug into.
export default function App() {
  return <ScenarioProvider><DashboardLayout><Overview /></DashboardLayout></ScenarioProvider>
}
