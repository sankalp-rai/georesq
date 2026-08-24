import { Building2, Home, LifeBuoy, PackageCheck } from 'lucide-react'

const STATUS_STYLE = {
  'Critical Gap': 'text-status-severe',
  'Significant Gap': 'text-status-warning',
  Limited: 'text-status-watch',
  Adequate: 'text-status-safe',
}

function ResourceMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">{label}</p>
        <Icon size={14} className="text-hydro" />
      </div>
      <p className="mt-2 font-mono text-xl font-semibold text-text-primary">{value}</p>
    </div>
  )
}

export default function ResourceIntelligence({ summary }) {
  return (
    <div>
      <p className="mb-3 text-xs text-text-secondary">Illustrative prototype resource availability; not live operational data.</p>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <ResourceMetric label="Total hospitals" value={summary.totalHospitals} icon={Building2} />
        <ResourceMetric label="Total shelters" value={summary.totalShelters} icon={Home} />
        <ResourceMetric label="Available shelter capacity" value={summary.availableShelterCapacity.toLocaleString('en-IN')} icon={Home} />
        <ResourceMetric label="Available rescue teams" value={summary.availableRescueTeams} icon={LifeBuoy} />
        <ResourceMetric label="Relief units" value={summary.reliefUnits} icon={PackageCheck} />
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-sm border border-line-soft bg-panel-raised/30 p-3 sm:flex-row sm:items-center">
        <div className="min-w-36">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Resource coverage</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-text-primary">{summary.resourceCoverageScore} <span className="text-sm text-text-secondary">/ 100</span></p>
        </div>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-panel">
            <span className="block h-full rounded-full bg-status-warning" style={{ width: `${summary.resourceCoverageScore}%` }} />
          </div>
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Status</p>
          <p className={`mt-1 text-sm font-semibold uppercase ${STATUS_STYLE[summary.resourceStatus]}`}>{summary.resourceStatus}</p>
        </div>
      </div>
    </div>
  )
}
