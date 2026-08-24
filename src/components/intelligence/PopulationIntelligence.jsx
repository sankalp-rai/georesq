import { Users, ShieldAlert, Building2, Activity } from 'lucide-react'
import { calculateVulnerability, getVulnerabilityLevel } from '../../utils/vulnerabilityEngine'

function formatPopulation(value) {
  return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function IntelligenceMetric({ label, value, detail, icon: Icon, tone = 'text-hydro', progress }) {
  return (
    <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">{label}</p>
        <Icon size={14} className={tone} />
      </div>
      <p className="mt-2 font-mono text-xl font-semibold text-text-primary">{value}</p>
      <p className="mt-1 text-[11px] text-text-secondary">{detail}</p>
      {progress !== undefined && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-panel">
          <span className={`block h-full rounded-full ${tone.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

export default function PopulationIntelligence({ zones }) {
  const totalExposed = zones.reduce((total, zone) => total + zone.populationExposed, 0)
  const totalVulnerable = zones.reduce((total, zone) => total + zone.vulnerablePopulation, 0)
  const averageDensity = Math.round(zones.reduce((total, zone) => total + zone.populationDensity, 0) / zones.length)
  const averageExposure = Math.round(zones.reduce((total, zone) => total + ((zone.populationExposed / zone.totalPopulation) * 100), 0) / zones.length)
  const averageVulnerability = Math.round(zones.reduce((total, zone) => total + calculateVulnerability(zone).vulnerabilityScore, 0) / zones.length)
  const overallLevel = getVulnerabilityLevel(averageVulnerability)

  return (
    <div>
      <p className="mb-3 text-xs text-text-secondary">Illustrative prototype estimates for the selected scenario; not official population statistics.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <IntelligenceMetric label="Total population exposed" value={formatPopulation(totalExposed)} detail="Estimated exposed population" icon={Users} tone="text-hydro" progress={averageExposure} />
        <IntelligenceMetric label="Vulnerable population" value={formatPopulation(totalVulnerable)} detail="Illustrative vulnerability estimate" icon={ShieldAlert} tone="text-status-warning" />
        <IntelligenceMetric label="Population density" value={averageDensity.toLocaleString('en-IN')} detail="People per km² (average)" icon={Building2} />
        <IntelligenceMetric label="Exposure percentage" value={`${averageExposure}%`} detail="Average across demo zones" icon={Users} tone="text-hydro" progress={averageExposure} />
        <IntelligenceMetric label="Overall vulnerability" value={overallLevel.toUpperCase()} detail={`Composite score ${averageVulnerability}/100`} icon={Activity} tone="text-status-severe" progress={averageVulnerability} />
      </div>
    </div>
  )
}
