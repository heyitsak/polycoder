import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTrack } from '../content'
import { useStore } from '../lib/store'
import { Badge, Btn } from '../components/ui'

const TYPE_ICON: Record<string, string> = { code: '⌨️', fixbug: '🐛', trace: '🧠', boss: '👑' }

export default function TrackMap() {
  const { trackId } = useParams()
  const track = getTrack(trackId ?? '')
  const store = useStore()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(false)

  if (!track) return <div className="p-8 text-slate-400">Track not found.</div>

  const tp = store.trackProg(track.id)
  const done = track.levels.filter(l => tp.stats[l.id]?.status).length
  const rank = store.rankOf(track)
  const dueReviews = store.state.reviews.filter(r => r.dueAt <= Date.now())
    .map(r => track.levels.find(l => l.id === r.levelId)).filter(Boolean)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/tracks" className="text-xs text-cyan-400 hover:text-cyan-300">← all tracks</Link>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{track.icon}</div>
          <div>
            <h1 className="text-3xl font-black text-white">{track.name}</h1>
            <p className="text-slate-500 text-sm">{track.tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: track.color }}>{rank < track.rankNames.length ? track.rankNames[rank] : '★ Grandmaster'}</div>
          <div className="text-xs text-slate-500">{done} / {track.levels.length} levels</div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 flex-wrap">
        {!tp.placementTaken && (
          <Btn variant="gold" onClick={() => setQuiz(true)}>📋 Placement test — skip what you know</Btn>
        )}
        {dueReviews.length > 0 && (
          <div className="w-full mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="text-amber-300 font-semibold text-sm mb-2">🔁 Review Day — {dueReviews.length} due</div>
            <div className="flex flex-wrap gap-2">
              {dueReviews.map(lvl => lvl && (
                <Link key={lvl.id} to={`/track/${track.id}/level/${lvl.id}`} className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-full px-3 py-1">
                  {lvl.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {track.topics.map((topic, ti) => {
          const levels = track.levels.filter(l => l.topic === topic.id)
          if (levels.length === 0) return null
          const tDone = levels.filter(l => tp.stats[l.id]?.status).length
          return (
            <div key={topic.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-night-950 mr-2" style={{ background: track.color }}>
                    {track.rankNames[ti]}
                  </span>
                  <span className="font-bold text-white">{topic.name}</span>
                  <span className="text-slate-500 text-xs ml-2">{topic.blurb}</span>
                </div>
                <span className="text-xs text-slate-500">{tDone}/{levels.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {levels.map(lvl => {
                  const idx = track.levels.indexOf(lvl)
                  const unlocked = store.isUnlocked(track, idx)
                  const st = tp.stats[lvl.id]
                  const status = st?.status
                  return (
                    <button key={lvl.id} disabled={!unlocked}
                      onClick={() => navigate(`/track/${track.id}/level/${lvl.id}`)}
                      className={`text-left rounded-xl border p-4 transition-all ${unlocked
                        ? 'border-white/10 bg-night-900 hover:border-white/30 hover:bg-night-800 cursor-pointer'
                        : 'border-white/5 bg-night-900/40 opacity-50 cursor-not-allowed'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{status === 'pass' ? '✅' : status === 'placed' ? '⏩' : TYPE_ICON[lvl.type] ?? '📄'}</span>
                        <Badge className={lvl.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-300' : lvl.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}>
                          {lvl.difficulty}
                        </Badge>
                      </div>
                      <div className="font-semibold text-white mt-2 text-sm">{lvl.title}</div>
                      <div className="text-xs text-slate-500 mt-1">⏱ ~{lvl.minutes} min · +{lvl.xp} XP</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {quiz && track && (
        <PlacementQuiz track={track} onClose={() => setQuiz(false)} />
      )}
    </div>
  )
}

const QUESTIONS_PER_TRACK: Record<string, { code: string; choices: string[]; answer: number; explain: string }[]> = {
  python: [
    { code: 'print("C" + "D")', choices: ['CD', 'C D', 'error', "'C' + 'D'"], answer: 0, explain: 'Strings concatenate with +.' },
    { code: 'x = 5\nprint(x * 2)', choices: ['52', '10', '25', 'error'], answer: 1, explain: '5*2 = 10.' },
    { code: 'print(3 > 2)', choices: ['2', 'True', '3', 'Yes'], answer: 1, explain: '3 > 2 is True.' },
    { code: "s = 'ab'\nprint(len(s))", choices: ['1', '2', 'ab', 'error'], answer: 1, explain: 'len counts characters.' },
    { code: 'print(8 % 3)', choices: ['2', '3', '5', '0.66'], answer: 0, explain: '% gives the remainder: 8%3 = 2.' },
  ],
  c: [
    { code: 'int x = 4;\nprintf("%d", x * 3);', choices: ['12', '43', '4', 'error'], answer: 0, explain: '4*3=12.' },
    { code: 'printf("%c", \'A\' + 1);', choices: ['B', 'A', '2', 'error'], answer: 0, explain: 'Character codes advance: A+1 = B.' },
    { code: 'int a = 5, b = 2;\nprintf("%d", a / b);', choices: ['2.5', '2', '3', 'error'], answer: 1, explain: 'Integer division drops the fraction: 2.' },
    { code: 'printf("%d", 10 % 4);', choices: ['2', '4', '6', '2.5'], answer: 0, explain: '10%4 = 2.' },
    { code: 'for (int i = 0; i < 3; i++) printf("*");', choices: ['***', '*', '**', 'none'], answer: 0, explain: 'Runs for i=0,1,2 — three stars.' },
  ],
}

function PlacementQuiz({ track, onClose }: { track: any; onClose: () => void }) {
  const qs = QUESTIONS_PER_TRACK[track.id] ?? QUESTIONS_PER_TRACK.python
  const store = useStore()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [wrong, setWrong] = useState<number | null>(null)

  const answer = (i: number) => {
    if (i === qs[idx].answer) {
      const s = score + 1
      setScore(s)
      if (idx + 1 >= qs.length) finish(s)
      else { setIdx(idx + 1); setWrong(null) }
    } else {
      setWrong(i)
    }
  }
  const finish = (s: number) => {
    setFinished(true)
    store.takePlacement(track.id, s)
    const skip = Math.max(0, s - 1)
    if (skip > 0) {
      const skipIds = track.levels.filter((l: any) => track.topics.slice(0, skip).some((t: any) => t.id === l.topic)).map((l: any) => l.id)
      store.placeLevels(track.id, skipIds)
    }
  }
  const q = qs[idx]
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-night-900 border border-white/10 p-6" onClick={e => e.stopPropagation()}>
        {!finished ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white">Placement test — {track.name}</h3>
              <span className="text-xs text-slate-500">{idx + 1}/{qs.length} · score {score}</span>
            </div>
            <pre className="rounded-lg bg-night-950 p-4 text-sm font-mono overflow-x-auto">{q.code}</pre>
            <blockquote className="text-xs text-slate-500 mt-2 mb-4">Without running it — what does this print?</blockquote>
            <div className="space-y-2">
              {q.choices.map((c, i) => (
                <button key={i} onClick={() => answer(i)}
                  className={`w-full text-left rounded-lg border px-4 py-2 text-sm font-mono transition-colors ${wrong === i ? 'border-rose-500 text-rose-300' : 'border-white/10 text-slate-200 hover:border-white/30'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl">{score >= 3 ? '🎉' : '💪'}</div>
            <h3 className="text-xl font-bold text-white mt-3">You scored {score}/{qs.length}</h3>
            <p className="text-sm text-slate-400 mt-2">
              {score >= 4 ? 'You know this language well!' : score === 3 ? 'Solid base — skipping the first two topics.' : score >= 1 ? 'Pick up the fundamentals level by level.' : 'We all start somewhere — every level helps.'}
            </p>
            {score >= 3 && <p className="text-xs text-amber-300 mt-1">Skipped the first {score - 1} topic{score - 1 === 1 ? '' : 's'} for you.</p>}
            <Btn className="mt-5" onClick={onClose}>Continue</Btn>
          </div>
        )}
      </div>
    </div>
  )
}