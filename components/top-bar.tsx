'use client'

export function TopBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(10,10,10,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--gt-border)',
      }}
    >
      {/* Dynamic Island / notch safe area */}
      <div style={{ height: 'env(safe-area-inset-top)' }} />

      {/* Bar content */}
      <div className="flex items-center justify-between px-5 h-11 max-w-lg mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--gt-lime)', boxShadow: '0 0 6px var(--gt-lime)' }}
          />
          <span className="font-heading font-black text-sm tracking-wide text-lime">
            GainTrack GT
          </span>
        </div>

        {/* Subtle version badge */}
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--gt-surface2)', color: 'var(--gt-text-dim)', border: '1px solid var(--gt-border)' }}
        >
          v1.0
        </span>
      </div>
    </div>
  )
}
