import { Route } from 'lucide-react'

const STATUS_STYLE = { Good: 'text-status-safe', Moderate: 'text-status-watch', Poor: 'text-status-severe' }

export default function RoadAccessibility({ intelligence }) {
  return (
    <div>
      <p className="mb-3 text-xs text-text-secondary">Illustrative road network status; not live traffic or navigation data.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Total segments</p><p className="mt-2 font-mono text-xl font-semibold text-text-primary">{intelligence.totalSegments}</p></div>
        <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Open</p><p className="mt-2 font-mono text-xl font-semibold text-status-safe">{intelligence.openSegments}</p></div>
        <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Restricted</p><p className="mt-2 font-mono text-xl font-semibold text-status-watch">{intelligence.restrictedSegments}</p></div>
        <div className="rounded-sm border border-line-soft bg-panel-raised/50 p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Blocked</p><p className="mt-2 font-mono text-xl font-semibold text-status-severe">{intelligence.blockedSegments}</p></div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-sm border border-line-soft bg-panel-raised/30 p-3">
        <Route size={18} className="text-hydro" />
        <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Road accessibility score</p><p className="mt-1 font-mono text-xl font-semibold text-text-primary">{intelligence.roadAccessibilityScore} / 100 <span className={`text-sm ${STATUS_STYLE[intelligence.roadAccessibilityStatus]}`}>{intelligence.roadAccessibilityStatus}</span></p></div>
      </div>
    </div>
  )
}
