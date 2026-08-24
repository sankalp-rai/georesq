import { useMemo, useState } from 'react'
import { defaultScenarioId, scenarios } from '../data/scenarios'
import { ScenarioContext } from './scenarioStore'

export function ScenarioProvider({ children }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(defaultScenarioId)
  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0]

  const value = useMemo(() => ({
    scenarios,
    selectedScenario,
    selectScenario: setSelectedScenarioId,
  }), [selectedScenario])

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
}
