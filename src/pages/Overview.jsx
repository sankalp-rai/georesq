import { useMemo, useState } from 'react'
import { Users, Home, LifeBuoy, Waves, ArrowUp, ArrowDown, Minus, Building2, TriangleAlert, Route } from 'lucide-react'
import PanelCard from '../components/ui/PanelCard'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import SituationMap from '../components/map/SituationMap'
import { districts, activityLog } from '../data/sampleDistricts'
import { floodRiskZones } from '../data/mapData'
import { rankZonesByRisk } from '../utils/riskEngine'
import { useScenario } from '../context/useScenario'
import PopulationIntelligence from '../components/intelligence/PopulationIntelligence'
import ResourceIntelligence from '../components/intelligence/ResourceIntelligence'
import { hospitals, reliefShelters, reliefUnits, rescueTeams } from '../data/resourceData'
import { getResourceRecommendation, summarizeResources } from '../utils/resourceEngine'
import RouteOptimizer from '../components/intelligence/RouteOptimizer'
import RoadAccessibility from '../components/intelligence/RoadAccessibility'
import { roadNetwork, roadNodes } from '../data/roadNetwork'
import { chooseRecommendedRoute, findRoute, getRoadAccessibility, getZoneRoadAccess } from '../utils/routingEngine'
import { calculateVulnerability } from '../utils/vulnerabilityEngine'
import { buildResponseContext } from '../utils/responseContext'
import ResponseCopilot from '../components/intelligence/ResponseCopilot'

const TREND_ICON = { up: ArrowUp, down: ArrowDown, flat: Minus }
const TREND_CLASS = { up: 'text-status-severe', down: 'text-status-safe', flat: 'text-text-faint' }
const PRIORITY_STYLES = {
  Critical: 'bg-status-severe-soft text-status-severe',
  High: 'bg-status-warning-soft text-status-warning',
  Moderate: 'bg-status-watch-soft text-status-watch',
  Low: 'bg-status-safe-soft text-status-safe',
}

const priorityZones = rankZonesByRisk(floodRiskZones)
const resourceSummary = summarizeResources(floodRiskZones, { hospitals, reliefShelters, rescueTeams, reliefUnits })
const roadIntelligence = getRoadAccessibility(roadNetwork)
const routeOrigins = roadNodes.filter((node) => node.hospitalId)
const routeDestinations = roadNodes.filter((node) => node.zoneId && priorityZones.some((zone) => zone.id === node.zoneId && (zone.risk.priorityLevel === 'Critical' || zone.risk.priorityLevel === 'High')))
const recommendedZone = priorityZones[0]
const recommendedZoneNode = roadNodes.find((node) => node.zoneId === recommendedZone.id)
const recommendedZoneResources = resourceSummary.analyses.find((item) => item.zone.id === recommendedZone.id).analysis
const recommendedZoneRoadAccess = getZoneRoadAccess(roadNetwork, recommendedZone.id)
const recommendedZoneVulnerability = calculateVulnerability(recommendedZone)
const resourceGapZones = priorityZones
  .filter((zone) => zone.risk.priorityLevel === 'Critical' || zone.risk.priorityLevel === 'High')
  .map((zone) => {
    const analysis = resourceSummary.analyses.find((item) => item.zone.id === zone.id).analysis
    return { ...zone, analysis }
  })
const RESOURCE_STATUS_STYLES = {
  'Critical Gap': 'bg-status-severe-soft text-status-severe',
  'Significant Gap': 'bg-status-warning-soft text-status-warning',
  Limited: 'bg-status-watch-soft text-status-watch',
  Adequate: 'bg-status-safe-soft text-status-safe',
}

function formatPopulation(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function ScenarioDataUnavailable({ scenario }) {
  return (
    <PanelCard title="Demo Data Not Available" eyebrow="Scenario Workspace">
      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-text-primary">{scenario.name}</p>
        <p className="mt-2 max-w-md text-sm text-text-secondary">This {scenario.disasterType.toLowerCase()} scenario is a platform placeholder. Its geospatial, population, and risk demonstration data has not been created.</p>
      </div>
    </PanelCard>
  )
}

export default function Overview() {
  const { selectedScenario } = useScenario()
  const [originId, setOriginId] = useState('lakhimpur-hospital-node')
  const [destinationId, setDestinationId] = useState(recommendedZoneNode.id)
  const [routeMode, setRouteMode] = useState('safest')
  const [routeVisible, setRouteVisible] = useState(false)
  const fastestRoute = useMemo(() => findRoute(roadNetwork, originId, destinationId, 'fastest'), [originId, destinationId])
  const safestRoute = useMemo(() => findRoute(roadNetwork, originId, destinationId, 'safest'), [originId, destinationId])
  const recommendedRoute = useMemo(() => chooseRecommendedRoute(fastestRoute, safestRoute), [fastestRoute, safestRoute])
  const displayedRoute = routeMode === 'fastest' ? fastestRoute : safestRoute
  const responseContext = useMemo(() => buildResponseContext({
    scenario: selectedScenario,
    zone: recommendedZone,
    risk: recommendedZone.risk,
    vulnerability: recommendedZoneVulnerability,
    resources: recommendedZoneResources,
    roads: roadIntelligence,
    zoneRoadAccess: recommendedZoneRoadAccess,
    route: recommendedRoute.route,
    origin: roadNodes.find((node) => node.id === originId),
    destination: recommendedZoneNode,
    routeType: recommendedRoute.mode === 'safest' ? 'Safest Route' : 'Fastest Route',
  }), [selectedScenario, originId, recommendedRoute])

  function showRoute(mode) {
    setRouteMode(mode)
    setRouteVisible(true)
  }

  function planRecommendedResponse() {
    setDestinationId(recommendedZoneNode.id)
    setRouteMode(recommendedRoute.mode)
    setRouteVisible(true)
    document.getElementById('route-optimizer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!selectedScenario.hasDemoData) return <ScenarioDataUnavailable scenario={selectedScenario} />

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="People Affected" value="4.2" unit="lakh" icon={Users} delta="+8.1% vs yesterday" deltaTone="up" />
        <StatCard label="Districts on Alert" value="7" unit="of 33" icon={Home} delta="2 at Red level" deltaTone="up" />
        <StatCard label="Relief Camps Active" value="146" icon={LifeBuoy} delta="+12 today" deltaTone="down" />
        <StatCard label="Rivers Above Danger" value="5" unit="stations" icon={Waves} delta="Steady" deltaTone="neutral" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hospitals Available" value={resourceSummary.hospitalsAvailable} icon={Building2} delta="Emergency-ready prototype sites" />
        <StatCard label="Shelter Capacity" value={resourceSummary.availableShelterCapacity} unit="available" icon={Home} delta="Illustrative current capacity" />
        <StatCard label="Rescue Teams Available" value={resourceSummary.availableRescueTeams} icon={LifeBuoy} delta="Ready for assignment" />
        <StatCard label="Zones With Resource Gaps" value={resourceSummary.zonesWithResourceGaps} icon={TriangleAlert} delta="Coverage below adequate" deltaTone="up" />
      </div>

      <PanelCard title="Population & Vulnerability Intelligence" eyebrow="Illustrative Demo Data">
        <PopulationIntelligence zones={floodRiskZones} />
      </PanelCard>

      <PanelCard title="Resource Intelligence" eyebrow="Illustrative Demo Data">
        <ResourceIntelligence summary={resourceSummary} />
      </PanelCard>

      <PanelCard title="Road Accessibility" eyebrow="Illustrative Network Data">
        <RoadAccessibility intelligence={roadIntelligence} />
      </PanelCard>

      <PanelCard title="Recommended Response Zone" eyebrow="Priority + Resource + Road Intelligence">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Zone</p><p className="mt-1 text-sm font-semibold text-text-primary">{recommendedZone.name}</p></div>
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Risk score</p><p className="mt-1 font-mono text-lg text-text-primary">{recommendedZone.risk.riskScore} / 100</p></div>
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Priority</p><p className="mt-1 font-mono text-sm font-semibold uppercase text-status-severe">{recommendedZone.risk.priorityLevel}</p></div>
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Resource status</p><p className="mt-1 font-mono text-sm font-semibold uppercase text-status-severe">{recommendedZoneResources.resourceStatus}</p></div>
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Road accessibility</p><p className="mt-1 font-mono text-lg text-text-primary">{recommendedZoneRoadAccess.accessibility}%</p></div>
            <div className="col-span-2 sm:col-span-3"><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Recommended action</p><p className="mt-1 text-sm text-text-secondary">Prioritize this zone for immediate response.</p></div>
          </div>
          <button type="button" onClick={planRecommendedResponse} className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90"><Route size={16} /> Plan rescue route</button>
        </div>
      </PanelCard>

      <PanelCard title="AI Response Copilot" eyebrow="Operational Decision Support">
        <ResponseCopilot context={responseContext} />
      </PanelCard>

      <PanelCard title="Rescue Route Optimizer" eyebrow="Deterministic Prototype Routing">
        <RouteOptimizer
          origins={routeOrigins}
          destinations={routeDestinations}
          originId={originId}
          destinationId={destinationId}
          onOriginChange={(id) => { setOriginId(id); setRouteVisible(false) }}
          onDestinationChange={(id) => { setDestinationId(id); setRouteVisible(false) }}
          fastest={fastestRoute}
          safest={safestRoute}
          recommendedMode={recommendedRoute.mode}
          onShowRoute={showRoute}
          onClearRoute={() => setRouteVisible(false)}
        />
      </PanelCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* GIS map — spans 2 cols on large screens */}
        <PanelCard
          title="Situation Map"
          eyebrow="Live Overview"
          className="overflow-hidden lg:col-span-2"
          bodyClassName="p-0"
        >
          <SituationMap routePlan={routeVisible ? { route: displayedRoute, mode: routeMode, originId, destinationId, visible: true } : null} />
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
                  <td className="py-3 font-mono text-text-secondary">{formatPopulation(zone.populationExposed)}</td>
                  <td className="py-3 font-mono text-text-secondary">{zone.accessibility}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <PanelCard title="Resource Gaps" eyebrow="High-Priority Zones · Prototype Analysis">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-[11px] uppercase tracking-wide text-text-faint">
                <th className="pb-2 font-mono font-medium">Zone</th>
                <th className="pb-2 font-mono font-medium">Risk score</th>
                <th className="pb-2 font-mono font-medium">Shelter capacity</th>
                <th className="pb-2 font-mono font-medium">Estimated demand</th>
                <th className="pb-2 font-mono font-medium">Capacity gap</th>
                <th className="pb-2 font-mono font-medium">Resource status</th>
                <th className="pb-2 font-mono font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {resourceGapZones.map((zone) => (
                <tr key={zone.id} className="border-b border-line-soft align-top last:border-0">
                  <td className="py-3 font-medium text-text-primary">{zone.name}</td>
                  <td className="py-3 font-mono text-text-secondary">{zone.risk.riskScore} · {zone.risk.priorityLevel}</td>
                  <td className="py-3 font-mono text-text-secondary">{zone.analysis.availableShelterCapacity.toLocaleString('en-IN')}</td>
                  <td className="py-3 font-mono text-text-secondary">{zone.analysis.shelterDemand.toLocaleString('en-IN')}</td>
                  <td className="py-3 font-mono text-status-severe">{zone.analysis.shelterCapacityGap.toLocaleString('en-IN')}</td>
                  <td className="py-3"><span className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${RESOURCE_STATUS_STYLES[zone.analysis.resourceStatus]}`}>{zone.analysis.resourceStatus}</span></td>
                  <td className="max-w-64 py-3 text-xs leading-relaxed text-text-secondary">{getResourceRecommendation(zone.analysis)}</td>
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
