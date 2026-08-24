import { Users, Home, LifeBuoy, Waves, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import PanelCard from '../components/ui/PanelCard'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import SituationMap from '../components/map/SituationMap'
import { districts, activityLog } from '../data/sampleDistricts'
import { floodRiskZones } from '../data/mapData'
import { rankZonesByRisk } from '../utils/riskEngine'

const TREND_ICON = { up: ArrowUp, down: ArrowDown, flat: Minus }
const TREND_CLASS = { up: 'text-status-severe', down: 'text-status-safe', flat: 'text-text-faint' }
const PRIORITY_STYLES = {
  Critical: 'bg-status-severe-soft text-status-severe',
  High: 'bg-status-warning-soft text-status-warning',
  Moderate: 'bg-status-watch-soft text-status-watch',
  Low: 'bg-status-safe-soft text-status-safe',
}

const priorityZones = rankZonesByRisk(floodRiskZones)

export default function Overview() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="People Affected" value="4.2" unit="lakh" icon={Users} delta="+8.1% vs yesterday" deltaTone="up" />
        <StatCard label="Districts on Alert" value="7" unit="of 33" icon={Home} delta="2 at Red level" deltaTone="up" />
        <StatCard label="Relief Camps Active" value="146" icon={LifeBuoy} delta="+12 today" deltaTone="down" />
        <StatCard label="Rivers Above Danger" value="5" unit="stations" icon={Waves} delta="Steady" deltaTone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* GIS map — spans 2 cols on large screens */}
        <PanelCard
          title="Situation Map"
          eyebrow="Live Overview"
          className="overflow-hidden lg:col-span-2"
          bodyClassName="p-0"
        >
          <SituationMap />
        </PanelCard>

        {/* Activity log */}
        <PanelCard title="Field Activity Log" eyebrow="Sample Feed">
          <ul className="scrollbar-thin -mr-1 max-h-72 space-y-3 overflow-y-auto pr-1">
            {activityLog.map((entry, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-text-faint">{entry.time}</span>
                <div className="min-w-0">
                  <p className="text-text-secondary">{entry.text}</p>
                  <span className="mt-1 inline-block rounded-sm bg-panel-raised px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-faint">
                    {entry.tag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <PanelCard title="Priority Zones" eyebrow="Risk Intelligence · Illustrative Demo Data">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-[11px] uppercase tracking-wide text-text-faint">
                <th className="pb-2 font-mono font-medium">Rank</th>
                <th className="pb-2 font-mono font-medium">Zone</th>
                <th className="pb-2 font-mono font-medium">Risk score</th>
                <th className="pb-2 font-mono font-medium">Priority</th>
                <th className="pb-2 font-mono font-medium">Population exposed</th>
                <th className="pb-2 font-mono font-medium">Accessibility</th>
              </tr>
            </thead>
            <tbody>
              {priorityZones.map((zone, index) => (
                <tr key={zone.id} className="border-b border-line-soft last:border-0">
                  <td className="py-3 font-mono text-text-faint">{index + 1}</td>
                  <td className="py-3 font-medium text-text-primary">{zone.name}</td>
                  <td className="py-3">
                    <div className="flex min-w-36 items-center gap-2">
                      <span className="w-6 font-mono text-text-primary">{zone.risk.riskScore}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-raised" aria-label={`Risk score ${zone.risk.riskScore} out of 100`}>
                        <span className="block h-full rounded-full bg-status-severe" style={{ width: `${zone.risk.riskScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${PRIORITY_STYLES[zone.risk.priorityLevel]}`}>
                      {zone.risk.priorityLevel}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-text-secondary">{zone.populationExposed}</td>
                  <td className="py-3 font-mono text-text-secondary">{zone.accessibility}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* District severity table */}
      <PanelCard title="District Severity Board" eyebrow="Sample Data · IMD Colour Scale">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-[11px] uppercase tracking-wide text-text-faint">
                <th className="pb-2 font-mono font-medium">District</th>
                <th className="pb-2 font-mono font-medium">Alert Level</th>
                <th className="pb-2 font-mono font-medium">People Affected</th>
                <th className="pb-2 font-mono font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => {
                const TrendIcon = TREND_ICON[d.trend]
                return (
                  <tr key={d.name} className="border-b border-line-soft last:border-0">
                    <td className="py-2.5 font-medium text-text-primary">{d.name}</td>
                    <td className="py-2.5">
                      <StatusBadge level={d.level} />
                    </td>
                    <td className="py-2.5 font-mono text-text-secondary">{d.affected}</td>
                    <td className={`py-2.5 ${TREND_CLASS[d.trend]}`}>
                      <TrendIcon size={14} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  )
}
