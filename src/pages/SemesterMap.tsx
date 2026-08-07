import { Link } from 'react-router-dom'
import { getTrack, SEMESTERS } from '../content'

const TYPE_STYLE: Record<string, string> = {
  code: 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400',
  theory: 'border-slate-500/20 bg-slate-500/5',
  core: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-400',
}

export default function SemesterMap() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-white">🗺️ Polytechnic Roadmap</h1>
      <p className="text-slate-400 mt-1">Your CSE diploma subjects, semester by semester. Coding subjects link straight into their track.</p>
      <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SEMESTERS.map((sem, i) => (
          <div key={sem.sem} className={`rounded-2xl border p-5 ${i % 3 === 0 ? 'border-white/10 bg-night-900' : 'border-white/10 bg-night-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white text-lg">{i === 0 ? 'First Semester' : sem.name}</h2>
              <span className="text-xs font-bold rounded-full px-2.5 py-1 bg-white/5 text-cyan-300 border border-white/10">Sem {sem.sem}</span>
            </div>
            <div className="space-y-2">
              {sem.subjects.map(sub => {
                const track = sub.trackId ? getTrack(sub.trackId) : undefined
                const body = (
                  <div className={`rounded-xl border p-3 transition-colors ${TYPE_STYLE[sub.type]} ${sub.trackId ? 'cursor-pointer' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{sub.name}</span>
                      {sub.trackId && track && <span className="text-sm">{track.icon}</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{sub.blurb}</div>
                  </div>
                )
                return sub.trackId && track ? (
                  <Link key={sub.id} to={`/track/${track.id}`}>{body}</Link>
                ) : (
                  <div key={sub.id}>{body}</div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5 text-sm text-slate-300">
        <span className="font-bold text-amber-300">💡 Master plan:</span> match your college syllabus with the semester grid — add or rename subjects in <code className="text-cyan-300">src/content/index.ts</code>.
      </div>
    </div>
  )
}