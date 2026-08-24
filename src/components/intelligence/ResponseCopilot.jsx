import { useState } from 'react'
import { Bot, RefreshCw, Sparkles } from 'lucide-react'
import { generateResponsePlan } from '../../services/aiService'
import { RESPONSE_SECTIONS } from '../../utils/responseGenerator'

export default function ResponseCopilot({ context }) {
  const [status, setStatus] = useState('idle')
  const [brief, setBrief] = useState(null)
  const [error, setError] = useState('')

  async function generateBrief() {
    setStatus('generating')
    setError('')
    const result = await generateResponsePlan(context)
    setBrief(result.response)
    if (result.error) {
      setError('AI service unavailable. Showing deterministic response.')
      setStatus('error')
    } else {
      setStatus(result.mode === 'ai' ? 'success' : 'fallback')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-sm border border-line-soft bg-panel-raised/30 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-hydro/40 bg-hydro/10 text-hydro"><Bot size={18} /></span>
          <div><p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Selected zone</p><p className="text-sm font-semibold text-text-primary">{context.priorityZone.name} <span className="ml-1 font-mono text-xs text-status-severe">{context.priorityZone.priority.toUpperCase()}</span></p></div>
        </div>
        <button type="button" onClick={generateBrief} disabled={status === 'generating'} className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-wait disabled:opacity-70">
          {status === 'generating' ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {status === 'generating' ? 'Generating…' : brief ? 'Regenerate response plan' : 'Generate response plan'}
        </button>
      </div>

      {error && <p className="mt-3 rounded-sm border border-status-warning/30 bg-status-warning-soft px-3 py-2 text-xs text-status-warning">{error}</p>}

      {brief && (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {RESPONSE_SECTIONS.map(([key, title]) => (
            <section key={key} className={`rounded-sm border border-line-soft bg-panel-raised/40 p-3 ${key === 'dataLimitations' ? 'lg:col-span-2' : ''}`}>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-faint">{title}</h3>
              {key === 'immediateActions' ? (
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-text-secondary">{brief[key].map((action) => <li key={action}>{action}</li>)}</ol>
              ) : <p className="mt-2 text-xs leading-relaxed text-text-secondary">{brief[key]}</p>}
            </section>
          ))}
        </div>
      )}

      {brief && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-text-faint"><span>Generated from: GeoResQ deterministic analysis</span><span>Scenario: {context.scenario.name}</span><span>Data status: Prototype / Illustrative Data</span><span>{status === 'success' ? 'AI-assisted response' : 'Deterministic response mode'}</span></div>}
    </div>
  )
}
