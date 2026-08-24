// This module only assembles values already produced by GeoResQ engines.
// It intentionally performs no risk, resource, road, or route calculations.
export function buildResponseContext({ scenario, zone, risk, vulnerability, resources, roads, zoneRoadAccess, route, origin, destination, routeType }) {
  return {
    scenario: {
      name: scenario.name,
      region: scenario.region,
      disasterType: scenario.disasterType,
      date: scenario.date,
      status: scenario.status,
    },
    priorityZone: {
      name: zone.name,
      riskScore: risk.riskScore,
      priority: risk.priorityLevel,
      hazardSeverity: risk.factors.hazardSeverity,
      populationExposed: zone.populationExposed,
      vulnerablePopulation: zone.vulnerablePopulation,
      vulnerabilityScore: vulnerability.vulnerabilityScore,
      infrastructureImpact: risk.factors.infrastructureImpact,
      accessibility: zoneRoadAccess.accessibility,
    },
    resources: {
      hospitals: resources.nearbyHospitals.length,
      availableHospitalCapacity: resources.availableHospitalCapacity,
      shelters: resources.nearbyShelters.length,
      availableShelterCapacity: resources.availableShelterCapacity,
      shelterDemand: resources.shelterDemand,
      shelterCapacityGap: resources.shelterCapacityGap,
      rescueTeamsAvailable: resources.availableRescueTeams.length,
      reliefUnitsAvailable: resources.availableReliefUnits.length,
      resourceCoverageScore: resources.resourceCoverageScore,
      resourceStatus: resources.resourceStatus,
    },
    roads: {
      roadAccessibilityScore: roads.roadAccessibilityScore,
      openSegments: roads.openSegments,
      restrictedSegments: roads.restrictedSegments,
      blockedSegments: roads.blockedSegments,
    },
    recommendedRoute: {
      origin: origin.name,
      destination: destination.name,
      routeType,
      distance: route.totalDistance,
      estimatedTime: route.estimatedTime,
      restrictedSegments: route.restrictedSegments.length,
      riskScore: route.riskScore,
    },
  }
}
