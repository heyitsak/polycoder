import { TRACKS } from '../src/content/index.ts'

const WB = 'https://wandbox.org/api/compile.json'
const COMPILER: Record<string, string> = {
  c: 'gcc-10.5.0-c',
  cpp: 'gcc-12.3.0',
  java: 'openjdk-jdk-21+35',
  python: 'cpython-3.11.10',
  js: 'nodejs-18.20.4',
}

interface WB {
  status: number
  compiler_message?: string
  program_output?: string
  signal?: string
}

async function exec(lang: string, code: string, stdin: string): Promise<{ out: string; err: string }> {
  const res = await fetch(WB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compiler: COMPILER[lang], code, stdin }),
    signal: AbortSignal.timeout(45000),
  })
  const d = (await res.json()) as WB
  if (d.status !== 0) return { out: d.program_output ?? '', err: d.compiler_message ?? 'compile failed' }
  if (d.signal) return { out: d.program_output ?? '', err: d.signal }
  return { out: d.program_output ?? '', err: '' }
}

const norm = (s: string) => s.replace(/\s+$/g, '').trimEnd()

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

let pass = 0, fail = 0, skip = 0, fatal = 0
const failures: string[] = []

for (const track of TRACKS) {
  if (track.kind === 'sql') continue
  const lang = track.pistonLanguage ?? 'python'
  const comp = COMPILER[lang]
  if (!comp) { console.log(`skip  ${track.id} (no compiler for ${lang})`); skip++; continue }
  for (const lvl of track.levels) {
    if (lvl.type !== 'code' && lvl.type !== 'boss') continue
    const tests = [...lvl.sampleTests, ...lvl.hiddenTests]
    let ok = true
    let ran = 0
    for (const t of tests) {
      const r = await exec(lang, lvl.modelSolution, t.input)
      ran++
      await sleep(120)
      if (r.err) {
        console.log(`FAIL ${lvl.id} (${lang}) → ${r.err}`)
        ok = false
        break
      }
      if (norm(r.out) !== norm(t.expected)) {
        console.log(`FAIL ${lvl.id} (${lang})\n  in=${JSON.stringify(t.input)}\n  expected=${JSON.stringify(norm(t.expected))}\n  got     =${JSON.stringify(norm(r.out))}`)
        ok = false
        break
      }
    }
    if (ok) { pass++; console.log(`ok   ${lvl.id}`) }
    else fail++
  }
  await sleep(500)
}
console.log(`\nCODE check: ${pass} passed, ${fail} failed, ${fatal} fatal, ${skip} skipped`)
if (failures.length) console.log(failures.join('\n'))