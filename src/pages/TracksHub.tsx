import { Link } from 'react-router-dom'
import { TRACKS } from '../content'
import { useStore } from '../lib/store'
import { ProgressRing } from '../components/ui'

export default function TracksHub() {
  const store = useStore()
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-white">Choose your battlefield</h1>
      <p className="text-slate-400 mt-1">Seven tracks, each from zero to absolute grandmaster. They never mix — focus is power.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {TRACKS.map(t => {
          const tp = store.trackProg(t.id)
          const done = t.levels.filter(l => tp.stats[l.id]?.status === 'pass' || tp.stats[l.id]?.status === 'placed').length
          const pct = t.levels.length ? (done / t.levels.length) * 100 : 0
          const rank = store.rankOf(t)
          return (
            <Link key={t.id} to={`/track/${t.id}`}
              className="group rounded-2xl border border-white/10 bg-night-900 p-5 hover:border-white/25 hover:bg-night-800 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{t.icon}</div>
                  <div>
                    <div className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.tagline}</div>
                  </div>
                </div>
                <ProgressRing pct={pct} color={t.color} size={52} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  <span className="text-slate-200 font-semibold">{done}</span> / {t.levels.length} levels
                </span>
                <span className="rounded-full px-2 py-0.5 font-bold text-night-950" style={{ background: t.color }}>
                  {rank < t.rankNames.length ? t.rankNames[rank] : '★ Grandmaster'}
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: t.color }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}