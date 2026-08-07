import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Level, Track } from '../types'

export interface LevelStat {
  status: 'pass' | 'placed' | 'none'
  attempts: number
  failedSubmits: number
  bestTimeMs: number
  passedAt: number
  gemsSpent: number
  firstTry: boolean
  notes: string
}

export interface ReviewItem {
  levelId: string
  dueAt: number
  fails: number
}

export interface TrackProgress {
  stats: Record<string, LevelStat>
  placementScore: number
  placementTaken: boolean
  certs: string[]
}

export interface GlobalState {
  xp: number
  gems: number
  streak: number
  lastDay: string | null
  weeklyActive: string[]
  heatmap: Record<string, number>
  reviews: ReviewItem[]
  achievements: string[]
  levelHistory: { levelId: string; track: string; ts: number; timeMs: number }[]
  trackMeta: Record<string, TrackProgress>
  goals: { daysPerWeek: number }
}

const KEY = 'polycoder:v1'

export function dayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

function empty(): GlobalState {
  return {
    xp: 0,
    gems: 30,
    streak: 0,
    lastDay: null,
    weeklyActive: [],
    heatmap: {},
    reviews: [],
    achievements: [],
    levelHistory: [],
    trackMeta: {},
    goals: { daysPerWeek: 3 },
  }
}

function load(): GlobalState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return { ...empty(), ...JSON.parse(raw) }
  } catch {
    return empty()
  }
}

export interface SubmitOptions {
  passed: boolean
  timeMs: number
  gemSpent: number
}

interface StoreApi {
  state: GlobalState
  trackProg: (trackId: string) => TrackProgress
  getStat: (trackId: string, levelId: string) => LevelStat | undefined
  isDone: (trackId: string, levelId: string) => boolean
  isUnlocked: (track: Track, index: number) => boolean
  rankOf: (track: Track) => number
  recordSubmit: (track: Track, level: Level, o: SubmitOptions) => void
  addNote: (trackId: string, levelId: string, note: string) => void
  settleReview: (levelId: string) => void
  takePlacement: (trackId: string, score: number) => void
  placeLevels: (trackId: string, levelIds: string[]) => void
  spendGems: (n: number) => boolean
  resetAll: () => void
}

const Ctx = createContext<StoreApi | null>(null)

function emptyStat(): LevelStat {
  return { status: 'none', attempts: 0, failedSubmits: 0, bestTimeMs: 0, passedAt: 0, gemsSpent: 0, firstTry: false, notes: '' }
}

function yesterday(d: string): string {
  const dt = new Date(d + 'T00:00:00Z')
  dt.setUTCDate(dt.getUTCDate() - 1)
  return dt.toISOString().slice(0, 10)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GlobalState>(load)

  const save = useCallback((s: GlobalState) => {
    localStorage.setItem(KEY, JSON.stringify(s))
    setState(s)
  }, [])

  const trackProg = (trackId: string): TrackProgress =>
    state.trackMeta[trackId] ?? { stats: {}, placementScore: 0, placementTaken: false, certs: [] }

  const getStat = (trackId: string, levelId: string) => trackProg(trackId).stats[levelId]

  const isDone = (trackId: string, levelId: string) =>
    trackProg(trackId).stats[levelId]?.status === 'pass' || trackProg(trackId).stats[levelId]?.status === 'placed'

  const isUnlocked = (track: Track, index: number): boolean => {
    if (index === 0) return true
    const prev = track.levels[index - 1]
    return isDone(track.id, prev.id)
  }

  const rankOf = (track: Track): number => {
    const p = trackProg(track.id)
    const doneTopics = new Set<string>()
    for (const [id, st] of Object.entries(p.stats)) {
      if (st.status === 'pass') {
        const lvl = track.levels.find(l => l.id === id)
        if (lvl) doneTopics.add(lvl.topic)
      }
    }
    return track.topics.filter(t => doneTopics.has(t.id)).length
  }

  const recordSubmit = (track: Track, level: Level, o: SubmitOptions) => {
    const s: GlobalState = JSON.parse(JSON.stringify(state))
    const tp = s.trackMeta[track.id] ?? { stats: {}, placementScore: 0, placementTaken: false, certs: [] }
    const prev = tp.stats[level.id]
    const st: LevelStat = prev ? { ...prev } : emptyStat()
    st.attempts += 1
    st.gemsSpent += o.gemSpent
    s.gems = Math.max(0, s.gems - o.gemSpent)

    if (!o.passed) {
      st.failedSubmits += 1
      s.gems = Math.max(0, s.gems - 5)
    } else {
      if (!st.bestTimeMs || o.timeMs < st.bestTimeMs) st.bestTimeMs = o.timeMs
      if (st.status !== 'pass') {
        st.status = 'pass'
        st.passedAt = Date.now()
        st.firstTry = st.attempts === 1 && st.failedSubmits === 0
        const xpGain = level.xp + (st.firstTry ? 5 : 0)
        s.xp += xpGain
        s.gems += 15

        const dk = dayStr()
        s.heatmap[dk] = (s.heatmap[dk] ?? 0) + 1
        if (s.lastDay === null) s.streak = 1
        else if (s.lastDay === dk) s.streak = Math.max(s.streak, 1)
        else if (s.lastDay === yesterday(dk)) s.streak += 1
        else s.streak = 1
        s.lastDay = dk
        if (!s.weeklyActive.includes(dk)) {
          s.weeklyActive.push(dk)
          if (s.weeklyActive.length > 14) s.weeklyActive = s.weeklyActive.slice(-14)
        }
        s.levelHistory.push({ levelId: level.id, track: track.id, ts: Date.now(), timeMs: o.timeMs })

        const topicDone = allTopicPassed(track, tp, level.topic)
        if (topicDone) {
          const certId = `${track.id}:${level.topic}`
          if (!tp.certs.includes(certId)) tp.certs.push(certId)
        }

        s.reviews = s.reviews.filter(r => r.levelId !== level.id)
        if (st.failedSubmits >= 2 && !alreadyReviewed(s, level.id)) {
          s.reviews.push({ levelId: level.id, dueAt: Date.now() + 3 * 86400000, fails: st.failedSubmits })
        }
      }
    }
    tp.stats[level.id] = st
    s.trackMeta[track.id] = tp
    unlockAchievements(s)
    save(s)
  }

  const addNote = (trackId: string, levelId: string, note: string) => {
    const s = JSON.parse(JSON.stringify(state)) as GlobalState
    const tp = s.trackMeta[trackId] ?? { stats: {}, placementScore: 0, placementTaken: false, certs: [] }
    const st = tp.stats[levelId] ?? emptyStat()
    st.notes = note
    tp.stats[levelId] = st
    s.trackMeta[trackId] = tp
    save(s)
  }

  const settleReview = (levelId: string) => {
    const s = JSON.parse(JSON.stringify(state)) as GlobalState
    s.reviews = s.reviews.filter(r => r.levelId !== levelId)
    save(s)
  }

  const takePlacement = (trackId: string, score: number) => {
    const s = JSON.parse(JSON.stringify(state)) as GlobalState
    const tp = s.trackMeta[trackId] ?? { stats: {}, placementScore: 0, placementTaken: false, certs: [] }
    tp.placementScore = score
    tp.placementTaken = true
    s.trackMeta[trackId] = tp
    save(s)
  }

  const placeLevels = (trackId: string, levelIds: string[]) => {
    const s = JSON.parse(JSON.stringify(state)) as GlobalState
    const tp = s.trackMeta[trackId] ?? { stats: {}, placementScore: 0, placementTaken: false, certs: [] }
    for (const id of levelIds) {
      if (!tp.stats[id]) tp.stats[id] = emptyStat()
      tp.stats[id].status = 'placed'
      tp.stats[id].passedAt = Date.now()
    }
    s.trackMeta[trackId] = tp
    save(s)
  }

  const spendGems = (n: number): boolean => {
    if (state.gems < n) return false
    const s = JSON.parse(JSON.stringify(state)) as GlobalState
    s.gems -= n
    save(s)
    return true
  }

  const resetAll = () => {
    localStorage.removeItem(KEY)
    setState(empty())
  }

  const store: StoreApi = {
    state, trackProg, getStat, isDone, isUnlocked, rankOf,
    recordSubmit, addNote, settleReview, takePlacement, placeLevels, spendGems, resetAll,
  }

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

function allTopicPassed(track: Track, tp: TrackProgress, topicId: string) {
  const lvls = track.levels.filter(l => l.topic === topicId)
  return lvls.every(l => tp.stats[l.id]?.status === 'pass')
}

function alreadyReviewed(s: GlobalState, levelId: string) {
  return s.reviews.some(r => r.levelId === levelId)
}

function unlockAchievements(s: GlobalState) {
  const add = (id: string) => {
    if (!s.achievements.includes(id)) s.achievements.push(id)
  }
  const n = s.levelHistory.length
  if (n >= 1) add('first_blood')
  if (n >= 10) add('ten_levels')
  if (n >= 50) add('fifty_levels')
  if (n >= 100) add('hundred_levels')
  if (n >= 250) add('quarter_k')
  if (n >= 500) add('half_k')
  if (s.streak >= 3) add('streak_3')
  if (s.streak >= 7) add('streak_7')
  if (s.streak >= 30) add('streak_30')
  if (s.streak >= 100) add('streak_100')
  if (s.gems >= 100) add('rich')
  if (s.gems >= 300) add('gem_hoarder')
  if (s.reviews.length >= 3) add('persistent')
  const h = new Date().getHours()
  if (h >= 22 || h < 4) add('night_owl')
  if (h >= 4 && h < 9) add('early_bird')
  const allStats = Object.values(s.trackMeta).flatMap(tp => Object.values(tp.stats))
  if (allStats.filter(st => st.status === 'pass' && st.firstTry).length >= 10) add('perfectionist')
}

export function useStore(): StoreApi {
  const c = useContext(Ctx)
  if (!c) throw new Error('store missing')
  return c
}