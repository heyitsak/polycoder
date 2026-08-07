import type { RunnerRequest, RunnerResult } from '../types'

const PISTON = 'https://emkc.org/api/v2/piston'

const FILE_NAMES: Record<string, string> = {
  c: 'main.c',
  cpp: 'main.cpp',
  java: 'Main.java',
  python: 'main.py',
  javascript: 'main.js',
  sql: 'main.sql',
}

let runtimesCache: Record<string, string> | null = null

export async function getRuntimes(force = false): Promise<Record<string, string>> {
  if (runtimesCache && !force) return runtimesCache
  try {
    const res = await fetch(`${PISTON}/runtimes`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error('bad')
    const list: { language: string; version: string }[] = await res.json()
    const want = ['python', 'javascript', 'java', 'c', 'c++']
    const map: Record<string, string> = {}
    for (const w of want) {
      const found = list.find(r => r.language === w)
      if (found) map[w] = found.version
    }
    runtimesCache = map
    return map
  } catch {
    runtimesCache = {
      c: '10.2.0',
      'c++': '10.2.0',
      java: '15.0.2',
      python: '3.10.0',
      javascript: '18.15.0',
    }
    return runtimesCache
  }
}

export function runtimeAlias(lang: string): string {
  if (lang === 'cpp') return 'c++'
  return lang
}

export function fileName(lang: string): string {
  return FILE_NAMES[lang] ?? 'main.txt'
}

export async function runCode(req: RunnerRequest): Promise<RunnerResult> {
  const lang = runtimeAlias(req.lang)
  const runtimes = await getRuntimes()
  const version = runtimes[lang]
  const limitMs = req.timeLimitMs ?? 3000
  const t0 = performance.now()
  let timedOut = false
  try {
    const res = await fetch(`${PISTON}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        version,
        files: [{ name: fileName(req.lang), content: req.code }],
        stdin: req.stdin,
        compile_timeout: limitMs,
        run_timeout: limitMs,
      }),
      signal: AbortSignal.timeout(16000),
    })
    const elapsed = performance.now() - t0
    if (!res.ok) {
      return { ok: false, stdout: '', stderr: `HTTP ${res.status} from code runner`, combined: '', fatal: 'runner_http' }
    }
    const data = await res.json()
    const run = data.run ?? {}
    const compile = data.compile ?? {}
    const stdout = run.stdout ?? ''
    let stderr = (run.stderr ?? '') + (compile.stderr ?? '')
    timedOut = run.signal === 'SIGKILL'
    return {
      ok: run.code === 0 && stderr.trim() === '',
      stdout,
      stderr,
      combined: stdout + '\n' + stderr,
      code: run.code,
      timedOut,
      timeMs: elapsed,
      compileTimeMs: compile.time ?? undefined,
    }
  } catch (e: any) {
    return { ok: false, stdout: '', stderr: e?.name === 'TimeoutError' ? 'NETWORK TIMEOUT' : `Network error: ${e?.message ?? e}`, combined: '', fatal: 'network' }
  }
}