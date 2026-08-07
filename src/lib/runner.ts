import type { RunnerRequest, RunnerResult } from '../types'

/**
 * Execution backends.
 * - `wandbox` (default): free public compiler API, no key.
 * - Own Piston instance: public emkc API is whitelist-only since 2026-02-15,
 *   so self-host one and point VITE_RUNNER=piston + VITE_RUNNER at it.
 */
const WB_ENDPOINT = 'https://wandbox.org/api/compile.json'
const PISTON_URL = (import.meta.env.VITE_PISTON_URL as string | undefined) ?? ''

const WB_COMPILERS: Record<string, string> = {
  c: 'gcc-10.5.0-c',
  cpp: 'gcc-12.3.0',
  java: 'openjdk-jdk-21+35',
  python: 'cpython-3.11.10',
  js: 'nodejs-18.20.4',
}

const PISTON_FILES: Record<string, string> = {
  c: 'main.c',
  cpp: 'main.cpp',
  java: 'Main.java',
  python: 'main.py',
  js: 'main.js',
}

function abort(ms: number): AbortSignal {
  return AbortSignal.timeout(Math.max(2000, ms))
}

interface WandboxResult {
  status: number
  compiler_message?: string
  program_output?: string
  program_error?: string
  signal?: string
}

async function runWandbox(req: RunnerRequest): Promise<RunnerResult> {
  const compiler = WB_COMPILERS[req.lang]
  const limitMs = req.timeLimitMs ?? 3000
  const t0 = performance.now()
  try {
    const res = await fetch(WB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler, code: req.code, stdin: req.stdin ?? '' }),
      signal: abort(Math.max(20000, limitMs + 10000)),
    })
    const elapsed = performance.now() - t0
    if (!res.ok) {
      return { ok: false, stdout: '', stderr: `HTTP ${res.status} from code runner`, combined: '', fatal: 'runner_http' }
    }
    const d = (await res.json()) as WandboxResult
    if (d.status !== 0) {
      return { ok: false, stdout: d.program_output ?? '', stderr: d.compiler_message ?? `status ${d.status}`, combined: d.compiler_message ?? '', fatal: 'compile' }
    }
    const stdout = d.program_output ?? ''
    const stderr = (d.program_error ?? '') + (d.signal ? `\n[${d.signal}]` : '')
    return {
      ok: !d.signal,
      stdout,
      stderr,
      combined: stdout + '\n' + stderr,
      timedOut: d.signal === 'SIGKILL',
      timeMs: elapsed,
    }
  } catch (e: any) {
    return {
      ok: false,
      stdout: '',
      stderr: e?.name === 'TimeoutError' ? '⏱ timed out (execution limit)' : `Network error: ${e?.message ?? e}`,
      combined: '',
      timedOut: e?.name === 'TimeoutError',
      fatal: 'network',
    }
  }
}

async function runPiston(req: RunnerRequest): Promise<RunnerResult> {
  const langMap: Record<string, string> = { js: 'javascript', cpp: 'c++', python: 'python', c: 'c', java: 'java' }
  const lang = langMap[req.lang] ?? req.lang
  const filename = PISTON_FILES[req.lang] ?? 'main.txt'
  const limitMs = req.timeLimitMs ?? 3000
  const t0 = performance.now()
  try {
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        files: [{ name: filename, content: req.code }],
        stdin: req.stdin ?? '',
        run_timeout: limitMs,
      }),
      signal: abort(16000),
    })
    const elapsed = performance.now() - t0
    if (!res.ok) {
      return { ok: false, stdout: '', stderr: `HTTP ${res.status} from code runner`, combined: '', fatal: 'runner_http' }
    }
    const data = await res.json()
    if (data.message) return { ok: false, stdout: '', stderr: String(data.message), combined: '', fatal: 'runner_http' }
    const run = data.run ?? {}
    const compile = data.compile ?? {}
    const stdout = run.stdout ?? ''
    const stderr = (run.stderr ?? '') + (compile.stderr ?? '')
    return {
      ok: run.code === 0 && stderr.trim() === '',
      stdout,
      stderr,
      combined: stdout + '\n' + stderr,
      code: run.code,
      timedOut: run.signal === 'SIGKILL',
      timeMs: elapsed,
    }
  } catch (e: any) {
    return {
      ok: false,
      stdout: '',
      stderr: e?.name === 'TimeoutError' ? 'NETWORK TIMEOUT' : `Network error: ${e?.message ?? e}`,
      combined: '',
      fatal: 'network',
    }
  }
}

export async function runCode(req: RunnerRequest): Promise<RunnerResult> {
  const backend = (import.meta.env.VITE_RUNNER ?? 'wandbox') as 'wandbox' | 'piston'
  return backend === 'piston' && PISTON_URL ? runPiston(req) : runWandbox(req)
}