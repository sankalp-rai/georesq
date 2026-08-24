import { calculateVulnerability } from './vulnerabilityEngine.js'

export const RISK_WEIGHTS = {
  hazardSeverity: 0.3,
  populationExposure: 0.25,
  vulnerability: 0.2,
  infrastructureImpact: 0.15,
  accessibilityRisk: 0.1,
}

function normalizeFactor(value) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 0
  return Math.max(0, Math.min(100, numericValue))
}

export function getPriorityLevel(riskScore) {
  if (riskScore >= 75) return 'Critical'
  if (riskScore >= 50) return 'High'
  if (riskScore >= 25) return 'Moderate'
  return 'Low'
}

export function calculateRisk(zone) {
  const hazardSeverity = normalizeFactor(zone.hazardSeverity)
  const populationExposure = normalizeFactor(zone.populationExposure)
  const vulnerability = calculateVulnerability(zone).vulnerabilityScore
  const infrastructureImpact = normalizeFactor(zone.infrastructureImpact)
  const accessibility = normalizeFactor(zone.accessibility)
  const accessibilityRisk = 100 - accessibility

  const riskScore = Math.round(
    (hazardSeverity * RISK_WEIGHTS.hazardSeverity)
    + (populationExposure * RISK_WEIGHTS.populationExposure)
    + (vulnerability * RISK_WEIGHTS.vulnerability)
    + (infrastructureImpact * RISK_WEIGHTS.infrastructureImpact)
    + (accessibilityRisk * RISK_WEIGHTS.accessibilityRisk),
  )

  return {
    riskScore,
    priorityLevel: getPriorityLevel(riskScore),
    factors: {
      hazardSeverity,
      populationExposure,
      vulnerability,
      infrastructureImpact,
      accessibility,
      accessibilityRisk,
    },
  }
}

export function getRiskExplanation(risk) {
  const { factors, priorityLevel } = risk
  const drivers = []

  if (factors.hazardSeverity >= 70) drivers.push('high flood severity')
  if (factors.populationExposure >= 70) drivers.push('significant population exposure')
  if (factors.vulnerability >= 70) drivers.push('elevated vulnerability')
  if (factors.infrastructureImpact >= 70) drivers.push('substantial infrastructure impact')
  if (factors.accessibilityRisk >= 50) drivers.push('limited accessibility')

  const fallbackDriver = Object.entries({
    'flood severity': factors.hazardSeverity,
    'population exposure': factors.populationExposure,
    vulnerability: factors.vulnerability,
    'infrastructure impact': factors.infrastructureImpact,
    'limited accessibility': factors.accessibilityRisk,
  }).sort(([, first], [, second]) => second - first)[0][0]

  const summary = drivers.length > 0 ? drivers.slice(0, 3).join(', ') : fallbackDriver
  return `${summary.charAt(0).toUpperCase()}${summary.slice(1)} makes this zone a ${priorityLevel.toLowerCase()}-priority response area.`
}

export function rankZonesByRisk(zones) {
  return zones
    .map((zone) => ({ ...zone, risk: calculateRisk(zone) }))
    .sort((first, second) => second.risk.riskScore - first.risk.riskScore)
}
