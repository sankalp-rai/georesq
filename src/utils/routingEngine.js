const RISK_PENALTIES = { Low: 0, Medium: 3, High: 8 }
const RISK_VALUES = { Low: 1, Medium: 2, High: 3 }
const AVERAGE_SPEED_KMH = 35

function routeCost(segment, mode) {
  if (segment.status === 'Blocked') return Infinity
  if (mode === 'fastest') return segment.distanceKm
  const restrictedPenalty = segment.status === 'Restricted' ? 5 : 0
  return segment.distanceKm + RISK_PENALTIES[segment.riskLevel] + restrictedPenalty
}

function buildGraph(segments, mode) {
  const graph = new Map()
  segments.forEach((segment) => {
    const cost = routeCost(segment, mode)
    if (!Number.isFinite(cost)) return
    ;[[segment.from, segment.to], [segment.to, segment.from]].forEach(([from, to]) => {
      if (!graph.has(from)) graph.set(from, [])
      graph.get(from).push({ to, segment, cost })
    })
  })
  return graph
}

export function getRouteRiskLevel(riskScore) {
  if (riskScore <= 3) return 'Low'
  if (riskScore <= 7) return 'Medium'
  return 'High'
}

export function findRoute(segments, originId, destinationId, mode = 'fastest') {
  const graph = buildGraph(segments, mode)
  const distances = new Map([[originId, 0]])
  const previous = new Map()
  const unsettled = new Set([originId])

  while (unsettled.size > 0) {
    const current = [...unsettled].reduce((closest, node) => (distances.get(node) < distances.get(closest) ? node : closest))
    unsettled.delete(current)
    if (current === destinationId) break

    for (const edge of graph.get(current) ?? []) {
      const nextDistance = distances.get(current) + edge.cost
      if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, nextDistance)
        previous.set(edge.to, { node: current, segment: edge.segment })
        unsettled.add(edge.to)
      }
    }
  }

  if (!distances.has(destinationId)) {
    return { route: [], totalDistance: Infinity, riskScore: Infinity, restrictedSegments: [], blockedSegments: segments.filter((segment) => segment.status === 'Blocked'), estimatedTime: null }
  }

  const route = []
  let current = destinationId
  while (current !== originId) {
    const step = previous.get(current)
    route.unshift(step.segment)
    current = step.node
  }

  const totalDistance = route.reduce((sum, segment) => sum + segment.distanceKm, 0)
  const restrictedSegments = route.filter((segment) => segment.status === 'Restricted')
  const riskScore = route.reduce((sum, segment) => sum + RISK_VALUES[segment.riskLevel], 0)

  return {
    route,
    totalDistance,
    riskScore,
    restrictedSegments,
    blockedSegments: segments.filter((segment) => segment.status === 'Blocked'),
    estimatedTime: Math.round((totalDistance / AVERAGE_SPEED_KMH) * 60),
  }
}

export function chooseRecommendedRoute(fastest, safest) {
  if (!Number.isFinite(fastest.totalDistance)) return { route: safest, mode: 'safest' }
  if (!Number.isFinite(safest.totalDistance)) return { route: fastest, mode: 'fastest' }
  const fastestIsComparable = fastest.riskScore <= safest.riskScore && fastest.restrictedSegments.length <= safest.restrictedSegments.length
  return fastestIsComparable ? { route: fastest, mode: 'fastest' } : { route: safest, mode: 'safest' }
}

export function getRoadAccessibility(segments) {
  const totalSegments = segments.length
  const openSegments = segments.filter((segment) => segment.status === 'Open').length
  const restrictedSegments = segments.filter((segment) => segment.status === 'Restricted').length
  const blockedSegments = segments.filter((segment) => segment.status === 'Blocked').length
  const roadAccessibilityScore = Math.round((openSegments / totalSegments) * 100)
  const roadAccessibilityStatus = roadAccessibilityScore >= 75 ? 'Good' : roadAccessibilityScore >= 50 ? 'Moderate' : 'Poor'
  return { totalSegments, openSegments, restrictedSegments, blockedSegments, roadAccessibilityScore, roadAccessibilityStatus }
}

export function getZoneRoadAccess(segments, zoneId) {
  const nearbySegments = segments.filter((segment) => segment.zoneIds.includes(zoneId))
  const blockedRoads = nearbySegments.filter((segment) => segment.status === 'Blocked').length
  const restrictedRoads = nearbySegments.filter((segment) => segment.status === 'Restricted').length
  const accessibility = nearbySegments.length === 0 ? 0 : Math.round(nearbySegments.reduce((sum, segment) => sum + (segment.status === 'Open' ? 100 : segment.status === 'Restricted' ? 50 : 0), 0) / nearbySegments.length)
  return { accessibility, blockedRoads, restrictedRoads }
}
