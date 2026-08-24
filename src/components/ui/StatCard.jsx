export default function StatCard({ label, value, unit, delta, deltaTone = 'neutral', icon: Icon }) {
  const toneClass =
    deltaTone === 'up'
      ? 'text-status-severe'
      : deltaTone === 'down'
        ? 'text-status-safe'
        : 'text-text-faint'

  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
          {label}
        </p>
        {Icon && <Icon size={14} className="text-text-faint" strokeWidth={1.75} />}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold text-text-primary">{value}</span>
        {unit && <span className="text-xs text-text-secondary">{unit}</span>}
      </div>
      {delta && <p className={`mt-1 text-xs font-mono ${toneClass}`}>{delta}</p>}
    </div>
  )
}
