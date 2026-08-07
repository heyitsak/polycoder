import { Link } from 'react-router-dom'
import { TRACKS } from '../content'
import { useStore } from '../lib/store'
import Heatmap from '../components/Heatmap'
import { Btn, MiniBar } from '../components/ui'

const ACHIEVEMENTS: Record<string, { name: string; icon: string; desc: string }> = {
  first_blood: { name: 'First Blood', icon: '🩸', desc: 'Complete your first level' },
  ten_levels: { name: 'Double Digits', icon: '🔟', desc: 'Complete 10 levels' },
  fifty_levels: { name: 'Fifty Strong', icon: '💪', desc: 'Complete 50 levels' },
  hundred_levels: { name: 'Century', icon: '💯', desc: 'Complete 100 levels' },
  quarter_k: { name: 'Quarter K', icon: '⚔️', desc: 'Complete 250 levels' },
  half_k: { name: 'Half Grandmaster', icon: '🏆', desc: 'Complete 500 levels' },
  streak_3: { name: 'Three in a Row', icon: '🔥', desc: '3-day streak' },
  streak_7: { name: 'Week of Fire', icon: '🔥', desc: '7-day streak' },
  streak_30: { name: 'Unstoppable', icon: '🔥', desc: '30-day streak' },
  streak_100: { name: 'Centennial', icon: '🔥', desc: '100-day streak' },
  perfectionist: { name: 'Perfectionist', icon: '✨', desc: '10 first-try passes' },
  rich: { name: 'Gem Keeper', icon: '💎', desc: 'Hold 100 gems' },
  gem_hoarder: { name: 'Gem Hoarder', icon: '💎', desc: 'Hold 300 gems' },
  persistent: { name: 'Persistent', icon: '🧗', desc: '3 levels in review queue' },
  night_owl: { name: 'Night Owl', icon: '🦉', desc: 'Code between 10pm-4am' },
  early_bird: { name: 'Early Bird', icon: '🐦', desc: 'Code between 4am-9am' },
  boss_slayer: { name: 'Boss Slayer', icon: '👑', desc: 'Defeat a boss level' },
}

export default function Dashboard() {
  const store = useStore()
  const s = store.state
  const weeklyGoal = s.goals.daysPerWeek
  const weeklyCount = s.weeklyActive.filter(d => {
    const daysAgo = (Date.now() - new Date(d + 'T00:00:00Z').getTime()) / 86400000
    return daysAgo < 7
  }).length

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Your Journey</h1>
          <p className="text-slate-500 mt-1">Consistency beats intensity. Small steps, every day.</p>
        </div>
        <Btn variant="danger" onClick={() => { if (confirm('Reset ALL progress?')) store.resetAll() }}>Reset progress</Btn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total XP" value={s.xp} icon="⚡" />
        <Stat label="Streak" value={`${s.streak} day${s.streak === 1 ? '' : 's'}`} icon="🔥" />
        <Stat label="Gems" value={s.gems} icon="💎" />
        <Stat label="Levels passed" value={s.levelHistory.length} icon="✅" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-night-900 p-5">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-semibold text-white">Weekly goal — {weeklyCount}/{weeklyGoal} days</span>
          <span className="text-slate-500">you set this promise</span>
        </div>
        <MiniBar pct={(weeklyCount / weeklyGoal) * 100} />
        <div className="mt-4 overflow-x-auto">
          <Heatmap data={s.heatmap} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-night-900 p-5">
          <h2 className="font-bold text-white mb-3">Tracks</h2>
          <div className="space-y-3">
            {TRACKS.map(t => {
              const tp = store.trackProg(t.id)
              const done = t.levels.filter(l => tp.stats[l.id]?.status).length
              const rank = store.rankOf(t)
              return (
                <Link key={t.id} to={`/track/${t.id}`} className="flex items-center justify-between text-sm rounded-lg px-3 py-2 hover:bg-night-800">
                  <span className="flex items-center gap-2"><span>{t.icon}</span><span className="text-slate-200 font-medium">{t.name}</span></span>
                  <span className="text-slate-500">{done}/{t.levels.length} · <span style={{ color: t.color }}>{rank < t.rankNames.length ? t.rankNames[rank] : '★ GM'}</span></span>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-900 p-5">
          <h2 className="font-bold text-white mb-3">Achievements <span className="text-slate-500 font-normal text-xs">({s.achievements.length}/{Object.keys(ACHIEVEMENTS).length})</span></h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
              const got = s.achievements.includes(id)
              return (
                <div key={id} className={`rounded-lg border p-2.5 text-xs ${got ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 opacity-40'}`}>
                  <div className="font-semibold text-white">{a.icon} {a.name}</div>
                  <div className="text-slate-500 mt-0.5">{a.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-night-900 p-5">
        <h2 className="font-bold text-white mb-3">Certificates</h2>
        {Object.values(s.trackMeta).flatMap(tp => tp.certs).length === 0 ? (
          <p className="text-sm text-slate-500">Finish every level of a topic to earn a rank certificate.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {TRACKS.map(t => {
              const tp = store.trackProg(t.id)
              return tp.certs.map(certId => {
                const topicId = certId.split(':')[1]
                const topic = t.topics.find(x => x.id === topicId)
                const rankName = t.rankNames[t.topics.findIndex(x => x.id === topicId)]
                return (
                  <div key={certId} className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                    <div className="text-lg">🏅</div>
                    <div className="font-bold text-amber-200 text-sm">{t.name} — {rankName}</div>
                    <div className="text-xs text-slate-500">{topic?.name}</div>
                  </div>
                )
              })
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-night-900 p-5">
        <h2 className="font-bold text-white mb-3">Review queue <span className="text-slate-500 font-normal text-xs">({s.reviews.length} due)</span></h2>
        {s.reviews.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing due. Failed levels come back after 3 days — spaced repetition makes knowledge stick.</p>
        ) : (
          <div className="space-y-2">
            {s.reviews.map(r => {
              for (const t of TRACKS) {
                const lvl = t.levels.find(l => l.id === r.levelId)
                if (lvl) return (
                  <div key={r.levelId} className="flex items-center justify-between rounded-lg bg-night-800 px-4 py-2.5 text-sm">
                    <span><span className="text-slate-300">{t.icon} {lvl.title}</span> <span className="text-slate-600 text-xs ml-1">({r.fails} fails)</span></span>
                    <div className="flex gap-2">
                      <Link to={`/track/${t.id}/level/${lvl.id}`} className="text-cyan-400 hover:text-cyan-300 font-semibold">Replay</Link>
                      <button onClick={() => store.settleReview(r.levelId)} className="text-slate-500 hover:text-slate-300">✕</button>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-night-900 p-4">
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-black text-white mt-1">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}