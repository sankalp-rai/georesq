export const RESPONSE_SECTIONS = [
  ['situationSummary', 'Situation Summary'],
  ['whyPrioritized', 'Why This Zone Is Prioritized'],
  ['resourceRequirements', 'Resource Requirements'],
  ['routeRecommendation', 'Route Recommendation'],
  ['immediateActions', 'Immediate Actions'],
  ['dataLimitations', 'Data Limitations'],
]

export function generateDeterministicResponse(context) {
  const { priorityZone, resources, recommendedRoute, scenario } = context
  const limitedAccess = priorityZone.accessibility < 50
  const resourceNeed = resources.shelterCapacityGap > 0

  return {
    situationSummary: `${priorityZone.name} is currently classified as a ${priorityZone.priority} priority zone with a risk score of ${priorityZone.riskScore}/100 in the ${scenario.name} scenario.`,
    whyPrioritized: `Hazard severity is ${priorityZone.hazardSeverity}/100 with ${priorityZone.populationExposed.toLocaleString('en-IN')} people exposed and ${priorityZone.vulnerablePopulation.toLocaleString('en-IN')} identified as vulnerable.${limitedAccess ? ` Road accessibility is limited at ${priorityZone.accessibility}%, increasing response urgency.` : ''}`,
    resourceRequirements: resourceNeed
      ? `Available shelter capacity is ${resources.availableShelterCapacity.toLocaleString('en-IN')} against estimated demand of ${resources.shelterDemand.toLocaleString('en-IN')}, leaving a ${resources.shelterCapacityGap.toLocaleString('en-IN')} capacity gap. Resource coverage is ${resources.resourceCoverageScore}/100 (${resources.resourceStatus}).`
      : `Current shelter capacity meets the prototype estimated demand. Resource coverage is ${resources.resourceCoverageScore}/100 (${resources.resourceStatus}).`,
    routeRecommendation: `Use the ${recommendedRoute.routeType.toLowerCase()} route from ${recommendedRoute.origin} to ${recommendedRoute.destination}: ${recommendedRoute.distance} km, with a prototype estimate of ${recommendedRoute.estimatedTime} minutes and ${recommendedRoute.restrictedSegments} restricted segment(s). Blocked segments are excluded from the route.`,
    immediateActions: [
      `Prioritize response to ${priorityZone.name}.`,
      resources.rescueTeamsAvailable > 0 ? `Deploy the ${resources.rescueTeamsAvailable} available rescue team(s) assigned to this zone.` : 'Deploy additional rescue teams to this zone.',
      resourceNeed ? `Address the identified shelter capacity gap of ${resources.shelterCapacityGap.toLocaleString('en-IN')}.` : 'Monitor shelter capacity against the estimated demand.',
      `Use the recommended accessible route from ${recommendedRoute.origin}.`,
    ],
    dataLimitations: 'All scenario, population, resource, road, and route values are illustrative prototype data. This brief is not real-time operational guidance.',
  }
}

export function normalizeAiResponse(response) {
  if (!response || typeof response !== 'object') return null
  const normalized = {}
  for (const [key] of RESPONSE_SECTIONS) {
    if (key === 'immediateActions') {
      if (!Array.isArray(response[key]) || !response[key].every((item) => typeof item === 'string')) return null
    } else if (typeof response[key] !== 'string') return null
    normalized[key] = response[key]
  }
  return normalized
}
