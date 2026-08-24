 import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useScenario } from '../../context/useScenario'

export default function ScenarioSelector() {
  const [open, setOpen] = useState(false)
  const { scenarios, selectedScenario, selectScenario } = useScenario()

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-w-40 items-center gap-2 rounded-sm border border-line bg-panel-raised px-2.5 py-1.5 text-left hover:border-accent-soft"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-text-faint">Active scenario</span>
          <span className="block truncate text-xs font-medium text-text-primary">{selectedScenario.name}</span>
        </span>
        <ChevronDown size={14} className={`shrink-0 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-sm border border-line bg-panel p-1 shadow-xl" role="listbox" aria-label="Select scenario">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              role="option"
              aria-selected={scenario.id === selectedScenario.id}
              onClick={() => {
                selectScenario(scenario.id)
                setOpen(false)
              }}
              className="flex w-full items-start gap-2 rounded-sm px-2.5 py-2 text-left hover:bg-panel-raised"
            >
              <span className="mt-0.5 w-4 shrink-0 text-accent">
                {scenario.id === selectedScenario.id && <Check size={14} />}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-text-primary">{scenario.name}</span>
                <span className="block text-[10px] text-text-faint">{scenario.disasterType} · {scenario.status}{!scenario.hasDemoData ? ' · Demo data not available' : ''}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
