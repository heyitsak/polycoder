import { NavLink, Route, Routes } from 'react-router-dom'
import { useStore } from './lib/store'
import TracksHub from './pages/TracksHub'
import TrackMap from './pages/TrackMap'
import LevelScreen from './pages/LevelScreen'
import SemesterMap from './pages/SemesterMap'
import Dashboard from './pages/Dashboard'

const nav = [
  { to: '/semesters', label: '🗺️ Semester Map' },
  { to: '/tracks', label: '🎯 Tracks' },
  { to: '/dashboard', label: '📊 Progress' },
]

export default function App() {
  const store = useStore()
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-night-950)] text-slate-200">
      <aside className="w-56 shrink-0 border-r border-white/10 bg-[var(--color-night-900)] flex flex-col">
        <div className="px-5 py-5">
          <div className="text-xl font-black tracking-tight text-white">Poly<span className="text-cyan-400">Coder</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Zero → Grandmaster</div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-night-800 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>🔥 Streak</span><span className="text-amber-400 font-bold">{store.state.streak} days</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>⚡ XP</span><span className="text-cyan-300 font-bold">{store.state.xp}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>💎 Gems</span><span className="text-pink-300 font-bold">{store.state.gems}</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<TracksHub />} />
          <Route path="/semesters" element={<SemesterMap />} />
          <Route path="/tracks" element={<TracksHub />} />
          <Route path="/track/:trackId" element={<TrackMap />} />
          <Route path="/track/:trackId/level/:levelId" element={<LevelScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}