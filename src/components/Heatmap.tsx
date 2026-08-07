import { useMemo } from 'react'

export default function Heatmap({ data }: { data: Record<string, number> }) {
  const cells = useMemo(() => {
    const now = new Date()
    const out: { date: string; count: number }[] = []
    for (let i = 363; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      out.push({ date: key, count: data[key] ?? 0 })
    }
    return out
  }, [data])

  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const color = (c: number) => {
    if (c === 0) return '#1a2030'
    if (c === 1) return '#14532d'
    if (c <= 3) return '#166534'
    if (c <= 6) return '#16a34a'
    return '#4ade80'
  }

  return (
    <div className="flex gap-[3px]">
      {weeks.map((w, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {w.map((c, ci) => (
            <div key={ci} title={`${c.date}: ${c.count} level${c.count === 1 ? '' : 's'}`}
              className="w-3 h-3 rounded-[3px]" style={{ background: color(c.count) }} />
          ))}
        </div>
      ))}
    </div>
  )
}