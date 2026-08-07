import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTrack } from '../content'
import { useStore } from '../lib/store'
import { runCode } from '../lib/runner'
import { formatSqlResult, runSql } from '../lib/sqlRunner'
import { gradeTests, type SingleResult } from '../lib/grader'
import { translateError } from '../lib/errors'
import CodeEditor from '../components/CodeEditor'
import { Btn, ConfettiBurst, DiffText } from '../components/ui'

type Tab = 'console' | 'tests' | 'solution' | 'notes'

export default function LevelScreen() {
  const { trackId, levelId } = useParams()
  const store = useStore()
  const track = getTrack(trackId ?? '')
  const level = track?.levels.find(l => l.id === levelId)

  const [code, setCode] = useState<string>('')
  const [tab, setTab] = useState<Tab>('console')
  const [busy, setBusy] = useState<string | null>(null)
  const [consoleOut, setConsoleOut] = useState('')
  const [results, setResults] = useState<SingleResult[]>([])
  const [hintOpen, setHintOpen] = useState(0)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [confetti, setConfetti] = useState(0)
  const [traceSel, setTraceSel] = useState<number | null>(null)
  const [traceOk, setTraceOk] = useState(false)
  const [noGems, setNoGems] = useState(false)
  const start = useRef(Date.now())

  useEffect(() => {
    const saved = localStorage.getItem(`pc_code:${trackId}:${levelId}`) ?? level?.starterCode ?? ''
    setCode(saved)
    setTab('console')
    setConsoleOut('')
    setResults([])
    setHintOpen(0)
    setTraceSel(null)
    setTraceOk(false)
    setSolutionVisible(false)
    setNoGems(false)
    start.current = Date.now()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, levelId])

  useEffect(() => {
    if (level) localStorage.setItem(`pc_code:${trackId}:${levelId}`, code)
  }, [code, level, trackId, levelId])

  if (!track || !level) {
    return <div className="p-8 text-slate-400">Level not found. <Link className="text-cyan-400" to="/tracks">Back to tracks</Link></div>
  }

  const idx = track.levels.indexOf(level)
  const unlocked = store.isUnlocked(track, idx)
  const stat = store.getStat(track.id, level.id)
  const failedSubmits = stat?.failedSubmits ?? 0
  const lang = track.kind === 'sql' ? null : track.pistonLanguage ?? 'python'
  const elapsed = () => Date.now() - start.current

  const runNow = async (input?: string) => {
    setBusy('run')
    try {
      const stdin = input ?? level.sampleTests[0]?.input ?? ''
      setConsoleOut('Running…')
      if (lang === null) {
        const r = await runSql(level.sqlSchema ?? '', code)
        setConsoleOut(r.error ? `ERROR: ${r.error}` : formatSqlResult(r))
      } else {
        const r = await runCode({ lang, code, stdin, timeLimitMs: level.timeLimitMs })
        const out = (r.stdout || '') + (r.stderr ? `\n[stderr]\n${r.stderr}` : '') + (r.timedOut ? '\n⏱ TIMEOUT — too slow!' : '')
        setConsoleOut(out || '(no output)')
      }
    } finally {
      setBusy(null)
      setTab('console')
    }
  }

  const test = async () => {
    setBusy('test')
    try {
      const g = await gradeTests(lang, level, code, level.sampleTests, { expose: true })
      setResults(g.results)
      setTab('tests')
    } finally { setBusy(null) }
  }

  const submit = async () => {
    if (!unlocked) return
    setBusy('submit')
    try {
      const g = await gradeTests(lang, level, code, level.hiddenTests)
      setResults(g.results)
      setTab('tests')
      if (g.ok) {
        setSolutionVisible(true)
        setConfetti(x => x + 1)
        store.recordSubmit(track, level, { passed: true, timeMs: elapsed(), gemSpent: 0 })
      } else {
        store.recordSubmit(track, level, { passed: false, timeMs: elapsed(), gemSpent: 0 })
        setHintOpen(Math.max(1, hintOpen))
      }
    } finally { setBusy(null) }
  }

  const peek = () => {
    if (store.spendGems(15)) {
      setSolutionVisible(true)
      setTab('solution')
    } else setNoGems(true)
  }

  const pickTrace = (i: number) => {
    if (!level.trace || traceSel !== null) return
    setTraceSel(i)
    if (i === level.trace.answerIndex) {
      setTraceOk(true)
      setSolutionVisible(true)
      setConfetti(x => x + 1)
      store.recordSubmit(track, level, { passed: true, timeMs: elapsed(), gemSpent: 0 })
    }
  }

  const stderrAll = results.map(r => r.error ?? '').filter(Boolean).join('\n')
  const tips = stderrAll ? translateError(lang ?? 'sql', stderrAll) : []

  return (
    <div className="h-full flex flex-col">
      <ConfettiBurst trigger={confetti} />
      <div className="shrink-0 border-b border-white/10 bg-night-900 px-6 py-3 flex items-center gap-3 flex-wrap">
        <Link to={`/track/${track.id}`} className="text-xs text-cyan-400 hover:text-cyan-300">← track</Link>
        <span className="text-2xl">{lvlIcon(level.type)}</span>
        <div className="flex-1 min-w-[200px]">
          <div className="font-bold text-white text-sm leading-tight">{level.title}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{track.name} · {topicName(track, level.topic)}</span>
          </div>
        </div>
        <BadgeChip diff={level.difficulty} />
        {level.type === 'boss' && <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-xs font-bold">👑 BOSS</span>}
        <div className="ml-auto hidden sm:block text-right">
          <div className="text-xs text-slate-500">progress {Math.round((idx / track.levels.length) * 100)}%</div>
          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
            <div className="h-full bg-cyan-400" style={{ width: `${Math.round((idx / track.levels.length) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[380px_1fr]">
        <div className="border-r border-white/10 overflow-y-auto p-5 space-y-4 bg-night-900/40">
          {level.story && <p className="text-sm italic text-slate-300 border-l-2 border-cyan-500/60 pl-3">{level.story}</p>}
          {level.type === 'boss' && level.timeLimitMs && (
            <p className="text-xs text-rose-300">⏱ Time limit <b>{Math.round(level.timeLimitMs / 1000)}s</b> — slow code fails. {level.complexity && <>Target <b className="text-cyan-300">{level.complexity}</b></>}</p>
          )}
          {level.complexity && level.type !== 'boss' && <p className="text-xs text-slate-500">Complexity target: <b className="text-cyan-300">{level.complexity}</b></p>}
          <div className="space-y-2.5">
            {level.theory.map((p, i) => <p key={i} className="text-sm text-slate-300 leading-relaxed">{p}</p>)}
          </div>
          {level.example && (
            <div className="rounded-lg bg-night-950 border border-white/10 p-3 text-sm font-mono text-cyan-200 whitespace-pre-wrap">{level.example}</div>
          )}

          {level.type === 'fixbug' && level.fix && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
              <div className="text-xs font-bold text-rose-300 mb-1">🐛 {level.fix.bugCount} bugs hide in this code</div>
              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                {level.fix.bugs.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}

          {level.type === 'trace' && level.trace && (
            <div className="rounded-xl border border-white/10 bg-night-950 p-4">
              <div className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Trace — no running allowed</div>
              <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">{level.trace.code}</pre>
              <div className="text-xs text-slate-400 mt-3 mb-2">What does it print?</div>
              <div className="space-y-2">
                {level.trace.choices.map((c, ci) => {
                  let cls = 'border-white/10 hover:border-white/30'
                  if (traceSel !== null) {
                    if (ci === level.trace!.answerIndex) cls = 'border-emerald-500 text-emerald-300 bg-emerald-500/5'
                    else if (traceSel === ci) cls = 'border-rose-500 text-rose-300'
                    else cls = 'border-white/5 text-slate-500'
                  }
                  return (
                    <button key={ci} disabled={traceSel !== null} onClick={() => pickTrace(ci)} className={`w-full text-left rounded-lg border px-3 py-2 text-sm font-mono transition-colors ${cls}`}>
                      {c}
                    </button>
                  )
                })}
              </div>
              {traceSel !== null && (
                <p className="text-sm mt-3 text-slate-300">{traceOk ? '✓ Correct! ' : '✗ Not quite. '}{level.trace.explain}</p>
              )}
            </div>
          )}

          {level.type !== 'trace' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button onClick={() => setHintOpen(h => Math.min(level.hints.length, h + 1))} className="text-xs text-amber-300 hover:text-amber-200 font-semibold">💡 Hints ({hintOpen}/{level.hints.length})</button>
                {!solutionVisible && !(level.type === 'fixbug') && (
                  <button onClick={peek} className="text-xs text-pink-300 hover:text-pink-200 font-semibold">👀 Peek · 15 💎</button>
                )}
              </div>
              {level.hints.slice(0, hintOpen).map((h, i) => (
                <div key={i} className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-200">{i + 1}. {h}</div>
              ))}
              {noGems && <div className="text-xs text-rose-300">Not enough gems — keep solving to earn more 💎</div>}
            </div>
          )}
        </div>

        <div className="flex flex-col min-h-0">
          <div className="flex-1 min-h-[40%] border-b border-white/10">
            {level.type === 'trace' ? (
              <div className="p-6 text-center text-slate-500 text-sm">Answer in the left panel — trace levels need no code.</div>
            ) : (
              <CodeEditor value={code} onChange={setCode} lang={lang ?? 'sql'} />
            )}
          </div>

          <div className="shrink-0 flex flex-wrap gap-2 px-4 py-3 border-b border-white/10 bg-night-900/40">
            {level.type !== 'trace' && (
              <>
                <Btn variant="ghost" onClick={() => runNow()} disabled={!!busy || !unlocked}>▶ Run</Btn>
                <Btn variant="success" onClick={test} disabled={!!busy || !unlocked}>🧪 Test samples</Btn>
                <Btn variant="primary" onClick={submit} disabled={!!busy || !unlocked}>{busy === 'submit' ? 'Grading…' : 'Submit'}</Btn>
              </>
            )}
            <span className="text-xs text-slate-500 self-center ml-auto">
              {failedSubmits >= 2 ? '😅 Stuck more than once? The solution will teach you plenty.' : `Attempts: ${stat?.attempts ?? 0}`}
            </span>
          </div>

          <div className="flex-1 min-h-[30%] overflow-hidden flex flex-col">
            <div className="flex gap-1 px-4 pt-2 text-xs">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-t-lg font-semibold ${tab === t.id ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 bg-night-950 overflow-auto p-4 font-mono">
              {tab === 'console' && <pre className="whitespace-pre-wrap text-sm text-slate-200">{consoleOut || '— no output yet — press ▶ Run'}</pre>}
              {tab === 'tests' && (
                <div className="space-y-3">
                  <TestsGrid results={results} />
                  {tips.length > 0 && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 font-sans">
                      <div className="text-xs font-bold text-amber-300 mb-1">🔍 What your error means:</div>
                      {tips.map((t, i) => (
                        <div key={i} className="text-xs text-slate-300 mb-1.5">
                          <span className="font-semibold">{t.text}</span>
                          {t.fix && <span className="text-slate-400 block">{t.fix}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {tab === 'solution' && solutionVisible && (
                <div>
                  <div className="text-xs text-slate-500 mb-3 font-sans">Your code ← → model answer</div>
                  <DiffText a={code} b={level.modelSolution} />
                </div>
              )}
              {tab === 'solution' && !solutionVisible && <div className="text-sm text-slate-500">Solution unlocks after you pass — or peek with 💎.</div>}
              {tab === 'notes' && <Notes trackId={track.id} levelId={level.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'console', label: '🖥️ Console' },
  { id: 'tests', label: '🧪 Tests' },
  { id: 'solution', label: '✨ Solution' },
  { id: 'notes', label: '📒 Notes' },
] as const

function lvlIcon(type: string): string {
  return type === 'trace' ? '🧠' : type === 'fixbug' ? '🐛' : type === 'boss' ? '👑' : '📝'
}

function topicName(track: { topics: { id: string; name: string }[] }, id: string): string {
  return track.topics.find(t => t.id === id)?.name ?? id
}

function BadgeChip({ diff }: { diff: string }) {
  const map: Record<string, string> = {
    easy: 'bg-emerald-500/15 text-emerald-300',
    medium: 'bg-amber-500/15 text-amber-300',
    hard: 'bg-rose-500/15 text-rose-300',
  }
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${map[diff] ?? map.easy}`}>{diff}</span>
}

function TestsGrid({ results }: { results: SingleResult[] }) {
  if ((results?.length ?? 0) === 0) return <div className="text-sm text-slate-500">Run 🧪 Test samples or Submit to see results here.</div>
  return (
    <div className="space-y-2 text-sm">
      {results.map((r, i) => (
        <div key={i} className={`rounded-lg border px-3 py-2 ${r.pass ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">{r.pass ? '✓' : '✗'} {r.label}</span>
            <span className="text-xs text-slate-500">{r.timedOut ? '⏱ timed out' : `${Math.round(r.timeMs)}ms`}</span>
          </div>
          {r.input !== undefined && r.input !== '' && <pre className="text-xs text-slate-400 mt-1">in:  <b>{r.input}</b></pre>}
          {r.error ? (
            <pre className="text-xs text-rose-300 mt-1 whitespace-pre-wrap">{r.error}</pre>
          ) : (
            <div className="mt-1 text-xs">
              <div className="text-rose-300">expected: <b>{r.expected || '(empty)'}</b></div>
              <div className="text-emerald-300">got: <b>{r.actual || '(empty)'}</b></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Notes({ trackId, levelId }: { trackId: string; levelId: string }) {
  const store = useStore()
  const stat = store.getStat(trackId, levelId)
  const [text, setText] = useState(stat?.notes ?? '')
  useEffect(() => {
    setText(store.getStat(trackId, levelId)?.notes ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, levelId])
  return (
    <div>
      <div className="text-xs text-slate-500 mb-2">Your personal note for this level (kept forever, your revision notes).</div>
      <textarea value={text} onChange={e => { setText(e.target.value); store.addNote(trackId, levelId, e.target.value) }}
        className="w-full h-40 rounded-lg bg-night-900 border border-white/10 p-3 text-slate-200 text-sm outline-none focus:border-cyan-400" placeholder="What did you learn here? What would you do differently?" />
    </div>
  )
}