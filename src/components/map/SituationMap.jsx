import { useEffect } from 'react'
import {
  CircleMarker,
  GeoJSON,
  LayersControl,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import {
  assamDataBounds,
  floodRiskZones,
  hospitals,
  reliefShelters,
  roads,
} from '../../data/mapData'
import { calculateRisk, getRiskExplanation } from '../../utils/riskEngine'

const { Overlay } = LayersControl

const RISK_STYLES = {
  Critical: { color: '#dc3c46', fillColor: '#dc3c46', fillOpacity: 0.42, weight: 2 },
  High: { color: '#e0812f', fillColor: '#e0812f', fillOpacity: 0.38, weight: 2 },
  Moderate: { color: '#d3a72c', fillColor: '#d3a72c', fillOpacity: 0.32, weight: 2 },
}

const ROAD_STYLES = {
  Open: { color: '#22a35e', weight: 4, opacity: 0.9 },
  Restricted: { color: '#d3a72c', weight: 4, opacity: 0.9, dashArray: '8 6' },
  Blocked: { color: '#dc3c46', weight: 4, opacity: 0.9, dashArray: '3 7' },
}

function ResponsiveMapSize() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const updateSize = () => map.invalidateSize({ pan: false, debounceMoveend: true })
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)
    window.addEventListener('resize', updateSize)
    requestAnimationFrame(updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [map])

  return null
}

function ResetViewButton() {
  const map = useMap()

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        map.fitBounds(assamDataBounds, { padding: [20, 20] })
      }}
      className="absolute right-3 top-3 z-[1000] rounded-sm border border-line bg-panel/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide text-text-secondary shadow-lg transition-colors hover:bg-panel-raised hover:text-text-primary"
      aria-label="Reset map view to Assam demo data"
    >
      Reset view
    </button>
  )
}

function MapLegend() {
  return (
    <aside className="pointer-events-none absolute bottom-3 left-3 z-[1000] w-44 rounded-sm border border-line bg-panel/95 p-2.5 text-[10px] shadow-lg">
      <p className="mb-2 font-mono font-medium uppercase tracking-widest text-text-secondary">Legend</p>
      <div className="space-y-1.5 text-text-secondary">
        <p className="font-mono uppercase tracking-wide text-text-faint">Flood risk</p>
        {Object.entries(RISK_STYLES).map(([label, style]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: style.fillColor }} />
            <span>{label}</span>
          </div>
        ))}
        <p className="pt-1 font-mono uppercase tracking-wide text-text-faint">Road access</p>
        {Object.entries(ROAD_STYLES).map(([label, style]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-0.5 w-4" style={{ backgroundColor: style.color }} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-status-severe" />
          <span>Hospital marker</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rotate-45 border-2 border-white bg-hydro" />
          <span>Relief shelter marker</span>
        </div>
      </div>
    </aside>
  )
}

function FloodZoneLayers() {
  return floodRiskZones.map((zone) => {
    const risk = calculateRisk(zone)
    const explanation = getRiskExplanation(risk)

    return (
      <GeoJSON
        key={zone.id}
        data={{ type: 'Feature', properties: { id: zone.id }, geometry: zone.geometry }}
        style={RISK_STYLES[zone.riskLevel]}
      >
        <Popup>
          <div className="map-popup">
            <strong>{zone.name}</strong>
            <span className="map-popup-label">Risk intelligence</span>
            <span>Risk score: {risk.riskScore}/100</span>
            <span>Priority: {risk.priorityLevel}</span>
            <span>Hazard severity: {risk.factors.hazardSeverity}</span>
            <span>Population exposure: {risk.factors.populationExposure}</span>
            <span>Vulnerability: {risk.factors.vulnerability}</span>
            <span>Infrastructure impact: {risk.factors.infrastructureImpact}</span>
            <span>Accessibility: {risk.factors.accessibility}</span>
            <span className="map-popup-explanation">{explanation}</span>
          </div>
        </Popup>
      </GeoJSON>
    )
  })
}

function RoadLayers() {
  return roads.map((road) => (
    <GeoJSON
      key={road.id}
      data={{ type: 'Feature', properties: { id: road.id }, geometry: road.geometry }}
      style={ROAD_STYLES[road.status]}
    >
      <Popup><div className="map-popup"><strong>{road.name}</strong><span>Status: {road.status}</span></div></Popup>
    </GeoJSON>
  ))
}

export default function SituationMap() {
  return (
    <div className="relative h-[360px] overflow-hidden bg-panel-raised sm:h-[400px] lg:h-[430px]">
      <MapContainer
        center={[26.55, 92.65]}
        zoom={7}
        minZoom={6}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <Overlay checked name="Flood Risk Zones"><FloodZoneLayers /></Overlay>
          <Overlay checked name="Hospitals">
            {hospitals.map((hospital) => (
              <CircleMarker key={hospital.id} center={[hospital.latitude, hospital.longitude]} radius={7} pathOptions={{ color: '#ffffff', fillColor: '#dc3c46', fillOpacity: 1, weight: 2 }}>
                <Popup><div className="map-popup"><strong>{hospital.name}</strong><span>Type: {hospital.type}</span></div></Popup>
              </CircleMarker>
            ))}
          </Overlay>
          <Overlay checked name="Relief Shelters">
            {reliefShelters.map((shelter) => (
              <CircleMarker key={shelter.id} center={[shelter.latitude, shelter.longitude]} radius={7} pathOptions={{ color: '#ffffff', fillColor: '#14b8b0', fillOpacity: 1, weight: 2 }}>
                <Popup><div className="map-popup"><strong>{shelter.name}</strong><span>Capacity: {shelter.capacity.toLocaleString()} people</span></div></Popup>
              </CircleMarker>
            ))}
          </Overlay>
          <Overlay checked name="Roads"><RoadLayers /></Overlay>
        </LayersControl>
        <ResponsiveMapSize />
        <ResetViewButton />
      </MapContainer>
      <p className="pointer-events-none absolute left-1/2 top-3 z-[1000] -translate-x-1/2 rounded-sm border border-line bg-panel/95 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-text-secondary shadow-lg">
        Demo data • Assam flood case study
      </p>
      <MapLegend />
    </div>
  )
}
