import { Route, ShieldCheck, X } from 'lucide-react'
import { getRouteRiskLevel } from '../../utils/routingEngine'

function RouteOption({ title, result, recommended, onShow }) {
  if (!Number.isFinite(result.totalDistance)) return null
  return (
    <div className={`rounded-sm border p-3 ${recommended ? 'border-hydro bg-hydro/5' : 'border-line-soft bg-panel-raised/40'}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">{title}</p>
        {recommended && <span className="rounded-sm bg-hydro/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-hydro">Recommended</span>}
      </div>
      <p className="mt-2 font-mono text-lg font-semibold text-text-primary">{result.totalDistance} <span className="text-xs font-normal text-text-secondary">km</span></p>
      <div className="mt-1 space-y-0.5 text-xs text-text-secondary">
        <p>Prototype time: {result.estimatedTime} min</p>
        <p>Restricted segments: {result.restrictedSegments.length}</p>
        <p>Risk level: {getRouteRiskLevel(result.riskScore)}</p>
      </div>
      <button type="button" onClick={onShow} className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-line px-2 py-1 text-[11px] text-text-secondary hover:bg-panel hover:text-text-primary"><Route size={13} /> Show route</button>
    </div>
  )
}

export default function RouteOptimizer({ origins, destinations, originId, destinationId, onOriginChange, onDestinationChange, fastest, safest, recommendedMode, onShowRoute, onClearRoute }) {
  return (
    <div id="route-optimizer">
      <p className="mb-3 text-xs text-text-secondary">Prototype routes avoid blocked segments. Travel times use an assumed average speed of 35 km/h.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-faint">From
          <select value={originId} onChange={(event) => onOriginChange(event.target.value)} className="rounded-sm border border-line bg-panel-raised px-2.5 py-2 text-xs normal-case tracking-normal text-text-primary focus:outline-none">
            {origins.map((origin) => <option key={origin.id} value={origin.id}>{origin.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-faint">To
          <select value={destinationId} onChange={(event) => onDestinationChange(event.target.value)} className="rounded-sm border border-line bg-panel-raised px-2.5 py-2 text-xs normal-case tracking-normal text-text-primary focus:outline-none">
            {destinations.map((destination) => <option key={destination.id} value={destination.id}>{destination.name}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <RouteOption title="Fastest route" result={fastest} recommended={recommendedMode === 'fastest'} onShow={() => onShowRoute('fastest')} />
        <RouteOption title="Safest route" result={safest} recommended={recommendedMode === 'safest'} onShow={() => onShowRoute('safest')} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={() => onShowRoute(recommendedMode)} className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-2.5 py-1.5 text-xs font-medium text-white hover:bg-accent/90"><ShieldCheck size={14} /> Show recommended route</button>
        <button type="button" onClick={onClearRoute} className="inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-xs text-text-secondary hover:bg-panel-raised hover:text-text-primary"><X size={14} /> Clear route</button>
      </div>
    </div>
  )
}
