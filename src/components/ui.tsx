import { useEffect, useState } from 'react'

const COLORS = ['#22d3ee', '#fbbf24', '#f472b6', '#34d399', '#a78bfa', '#f87171']

export function ConfettiBurst({ trigger, count = 90 }: { trigger: number; count?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger === 0) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 2600)
    return () => clearTimeout(t)
  }, [trigger])

  if (!show) return null
  const pieces = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 0.25
    const dur = 1.4 + Math.random() * 1.4
    const size = 6 + Math.random() * 7
    const color = COLORS[i % COLORS.length]
    const spin = Math.random() > 0.5 ? 'rotate(360deg)' : 'rotate(-360deg)'
    return (
      <div key={i} className="confetti-piece"
        style={{ left: `${left}%`, width: size, height: size, background: color, animationDuration: `${dur}s`, animationDelay: `${delay}s`, '--spin': spin } as any} />
    )
  })
  return <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">{pieces}</div>
}

export function ProgressRing({ pct, size = 56, stroke = 5, color = '#22d3ee', label }: {
  pct: number; size?: number; stroke?: number; color?: string; label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.min(100, Math.max(0, pct)) / 100)
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div className="absolute text-[10px] font-bold text-white">{label ?? `${Math.round(pct)}%`}</div>
    </div>
  )
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}

export function Btn({ children, onClick, variant = 'primary', disabled = false, className = '', title }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'gold' | 'danger' | 'success'; disabled?: boolean; className?: string; title?: string
}) {
  const v = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-night-950',
    ghost: 'bg-night-700 hover:bg-night-600 text-slate-200',
    gold: 'bg-amber-500 hover:bg-amber-400 text-night-950',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-400 text-night-950',
  }[variant]
  return (
    <button disabled={disabled} title={title} onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${v} ${className}`}>
      {children}
    </button>
  )
}

export function DiffText({ a, b }: { a: string; b: string }) {
  const A = a.trim().split('\n')
  const B = b.trim().split('\n')
  const max = Math.max(A.length, B.length)
  const rows = Array.from({ length: max }, (_, i) => ({ a: A[i] ?? '', b: B[i] ?? '' }))
  return (
    <div className="font-mono text-xs space-y-0.5">
      {rows.map((r, i) => {
        const same = r.a === r.b
        return (
          <div key={i} className="flex gap-4">
            <span className={`flex-1 whitespace-pre-wrap ${same ? 'text-slate-300' : 'text-rose-400'}`}>{r.a || '␤'}</span>
            <span className={`flex-1 whitespace-pre-wrap ${same ? 'text-slate-300' : 'text-emerald-400'}`}>{r.b || '␤'}</span>
          </div>
        )
      })}
    </div>
  )
}

export function MiniBar({ pct, className = '' }: { pct: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-full bg-white/10 overflow-hidden ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  )
}