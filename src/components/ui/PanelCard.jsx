export default function PanelCard({ title, eyebrow, action, children, className = '', bodyClassName = '' }) {
  return (
    <section
      className={`flex flex-col rounded-md border border-line bg-panel ${className}`}
    >
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-line-soft px-4 py-3">
          <div>
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={`flex-1 p-4 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
