import type { Level, TestCase } from '../types'
import { runCode } from './runner'
import { formatSqlResult, runSql, sqlEqual } from './sqlRunner'

export interface SingleResult {
  label: string
  input?: string
  expected: string
  actual: string
  pass: boolean
  timedOut: boolean
  timeMs: number
  error?: string
}

export interface GradeResult {
  total: number
  passed: number
  results: SingleResult[]
  ok: boolean
  timeouts: number
}

function norm(s: string): string {
  return s.replace(/\s+$/g, '').trimEnd()
}

export async function gradeTests(
  lang: string | null,
  level: Level,
  code: string,
  tests: TestCase[],
  opts: { expose?: boolean } = {},
): Promise<GradeResult> {
  const results: SingleResult[] = []
  let timeouts = 0

  for (let i = 0; i < tests.length; i++) {
    const tc = tests[i]
    const label = opts.expose ? `Sample #${i + 1}` : `Test #${i + 1}`

    if (lang === null) {
      const setup = level.sqlSchema ?? ''
      const user = await runSql(setup, code)
      if (user.error) {
        results.push({ label, expected: '', actual: user.error, pass: false, timedOut: false, timeMs: user.timeMs, error: user.error })
        continue
      }
      if (!tc.query) {
        results.push({ label, expected: '', actual: 'no reference query', pass: false, timedOut: false, timeMs: user.timeMs })
        continue
      }
      const ref = await runSql(setup, level.modelSolution || tc.query)
      const pass = sqlEqual(user, ref)
      results.push({
        label,
        expected: formatSqlResult(ref),
        actual: formatSqlResult(user),
        pass,
        timedOut: false,
        timeMs: user.timeMs,
      })
      continue
    }

    const r = await runCode({
      lang,
      code,
      stdin: tc.input,
      timeLimitMs: level.timeLimitMs,
    })
    const pass = r.ok && norm(r.stdout) === norm(tc.expected)
    if (r.timedOut) timeouts++
    results.push({
      label,
      input: opts.expose ? tc.input : undefined,
      expected: tc.expected,
      actual: r.stdout,
      pass,
      timedOut: !!r.timedOut,
      timeMs: r.timeMs ?? 0,
      error: r.stderr,
    })
  }

  return {
    total: results.length,
    passed: results.filter(r => r.pass).length,
    results,
    ok: results.every(r => r.pass),
    timeouts,
  }
}