export type LevelType = 'code' | 'fixbug' | 'trace' | 'boss'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TestCase {
  input: string
  expected: string
  query?: string // SQL only: model query whose result must match the user's
}

export interface TraceSpec {
  code: string
  choices: string[]
  answerIndex: number
  explain: string
}

export interface FixSpec {
  buggy: string
  bugCount: number
  bugs: string[]
}

export interface Level {
  id: string
  topic: string
  type: LevelType
  title: string
  difficulty: Difficulty
  minutes: number
  xp: number
  story?: string
  theory: string[]
  example?: string
  starterCode: string
  modelSolution: string
  hints: [string, string, string]
  sampleTests: TestCase[]
  hiddenTests: TestCase[]
  timeLimitMs?: number
  complexity?: string
  trace?: TraceSpec
  fix?: FixSpec
  pre?: string // prerequisite topic id
  sqlSchema?: string // SQL tracks: read-only schema shown with the level
}

export interface Topic {
  id: string
  name: string
  blurb: string
}

export interface Track {
  id: string
  name: string
  tagline: string
  color: string
  icon: string
  kind: 'code' | 'sql' | 'dsa'
  pistonLanguage?: string
  sql?: boolean
  rankNames: string[]
  topics: Topic[]
  levels: Level[]
}

export type GradingMode = 'code' | 'sql'

export interface RunnerRequest {
  lang: string
  code: string
  stdin: string
  timeLimitMs?: number
}

export interface RunnerResult {
  ok: boolean
  stdout: string
  stderr: string
  combined: string
  code?: number
  timedOut?: boolean
  timeMs?: number
  compileTimeMs?: number
  fatal?: string
}