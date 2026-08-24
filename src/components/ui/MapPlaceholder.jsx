import { Map } from 'lucide-react'

export default function MapPlaceholder() {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-line bg-panel-raised/40 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-line-soft bg-panel">
        <Map size={20} className="text-text-faint" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">Situation map not yet connected</p>
        <p className="mt-1 max-w-xs text-xs text-text-faint">
          The Leaflet / OpenStreetMap layer, flood extents, and live asset positions render here once the mapping module ships.
        </p>
      </div>
    </div>
  )
}
