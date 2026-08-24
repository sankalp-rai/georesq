const STATUS_STYLES = {
  safe: {
    label: 'Green',
    dot: 'bg-status-safe',
    text: 'text-status-safe',
    bg: 'bg-status-safe-soft',
  },
  watch: {
    label: 'Yellow',
    dot: 'bg-status-watch',
    text: 'text-status-watch',
    bg: 'bg-status-watch-soft',
  },
  warning: {
    label: 'Orange',
    dot: 'bg-status-warning',
    text: 'text-status-warning',
    bg: 'bg-status-warning-soft',
  },
  severe: {
    label: 'Red',
    dot: 'bg-status-severe',
    text: 'text-status-severe',
    bg: 'bg-status-severe-soft',
  },
}

/**
 * Severity badge following the IMD (India Meteorological Department)
 * flood-warning colour convention: Green / Yellow / Orange / Red.
 * `level` = safe | watch | warning | severe
 */
export default function StatusBadge({ level = 'safe', children }) {
  const s = STATUS_STYLES[level] ?? STATUS_STYLES.safe
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-line px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wide ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {children ?? s.label}
    </span>
  )
}
