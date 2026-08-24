function total(items, field) {
  return items.reduce((sum, item) => sum + (Number(item[field]) || 0), 0)
}

function percentage(numerator, denominator) {
  if (denominator <= 0) return 0
  return Math.min(100, Math.round((numerator / denominator) * 100))
}

export function getResourceStatus(resourceCoverageScore) {
  if (resourceCoverageScore >= 75) return 'Adequate'
  if (resourceCoverageScore >= 50) return 'Limited'
  if (resourceCoverageScore >= 25) return 'Significant Gap'
  return 'Critical Gap'
}

export function analyzeZoneResources(zone, resources) {
  const nearbyHospitals = resources.hospitals.filter((hospital) => hospital.zoneId === zone.id)
  const nearbyShelters = resources.reliefShelters.filter((shelter) => shelter.zoneId === zone.id)
  const nearbyRescueTeams = resources.rescueTeams.filter((team) => team.baseZoneId === zone.id)
  const nearbyReliefUnits = resources.reliefUnits.filter((unit) => unit.baseZoneId === zone.id)
  const availableShelterCapacity = total(nearbyShelters, 'availableCapacity')
  const availableHospitalCapacity = total(nearbyHospitals, 'availableCapacity')
  const occupiedShelterCapacity = total(nearbyShelters, 'occupied')
  const shelterDemand = Math.round(zone.populationExposed * 0.5)
  const shelterCapacityGap = Math.max(0, shelterDemand - availableShelterCapacity)
  const availableRescueTeams = nearbyRescueTeams.filter((team) => team.status === 'Available')
  const availableReliefUnits = nearbyReliefUnits.filter((unit) => unit.status === 'Available')
  const shelterCoverage = percentage(availableShelterCapacity, shelterDemand)
  const hospitalAvailability = percentage(availableHospitalCapacity, total(nearbyHospitals, 'capacity'))
  const rescueTeamAvailability = percentage(availableRescueTeams.length, nearbyRescueTeams.length)
  const reliefAvailability = percentage(availableReliefUnits.length, nearbyReliefUnits.length)
  const resourceCoverageScore = Math.round(
    (shelterCoverage * 0.5)
    + (hospitalAvailability * 0.25)
    + (rescueTeamAvailability * 0.15)
    + (reliefAvailability * 0.1),
  )

  return {
    nearbyHospitals,
    nearbyShelters,
    availableShelterCapacity,
    availableHospitalCapacity,
    occupiedShelterCapacity,
    nearbyRescueTeams,
    availableRescueTeams,
    availableReliefUnits,
    shelterDemand,
    shelterCapacityGap,
    resourceCoverageScore,
    resourceStatus: getResourceStatus(resourceCoverageScore),
    hospitalAvailability,
  }
}

export function getResourceRecommendation(analysis) {
  if (analysis.resourceCoverageScore >= 75) return 'Current resource coverage is adequate for the estimated demand.'

  const recommendations = []
  if (analysis.shelterCapacityGap > 0) recommendations.push('Additional shelter capacity required.')
  if (analysis.availableRescueTeams.length === 0) recommendations.push('Deploy additional rescue teams.')
  if (analysis.hospitalAvailability < 40) recommendations.push('Consider redirecting medical resources.')
  if (analysis.availableReliefUnits.length === 0) recommendations.push('Stage additional relief units.')
  return recommendations.join(' ') || 'Monitor resource coverage as demand changes.'
}

export function summarizeResources(zones, resources) {
  const analyses = zones.map((zone) => ({ zone, analysis: analyzeZoneResources(zone, resources) }))
  const resourceCoverageScore = Math.round(analyses.reduce((sum, item) => sum + item.analysis.resourceCoverageScore, 0) / analyses.length)

  return {
    analyses,
    totalHospitals: resources.hospitals.length,
    hospitalsAvailable: resources.hospitals.filter((hospital) => hospital.emergencyReady && hospital.availableCapacity > 0).length,
    totalShelters: resources.reliefShelters.length,
    availableShelterCapacity: total(resources.reliefShelters, 'availableCapacity'),
    availableRescueTeams: resources.rescueTeams.filter((team) => team.status === 'Available').length,
    reliefUnits: resources.reliefUnits.filter((unit) => unit.status === 'Available').length,
    zonesWithResourceGaps: analyses.filter(({ analysis }) => analysis.resourceStatus !== 'Adequate').length,
    resourceCoverageScore,
    resourceStatus: getResourceStatus(resourceCoverageScore),
  }
}
