import { createRequire } from 'node:module'
import initSqlJs from 'sql.js'
import { sqlLevels } from '../src/content/tracks/sql.ts'

const require = createRequire(import.meta.url)
const sql = await initSqlJs({ locateFile: () => require.resolve('sql.js/dist/sql-wasm.wasm') })

function cell(v: unknown): string {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(+v.toFixed(6))
  if (v instanceof Uint8Array) return new TextDecoder().decode(v)
  return String(v)
}

type Run = { cols: string[]; rows: unknown[][] }

function run(db: any, q: string): Run {
  const st = db.prepare(q)
  const cols: string[] = st.getColumnNames()
  const rows: unknown[][] = []
  while (st.step()) rows.push(st.get())
  st.free()
  return { cols, rows }
}

function same(a: Run, b: Run): boolean {
  if (a.cols.length !== b.cols.length) return false
  if (a.rows.length !== b.rows.length) return false
  const key = (r: unknown[]) => r.map(cell).join('|')
  const colsMatch = a.cols.every((c, i) => c === b.cols[i])
  if (!colsMatch) return false
  return a.rows.map(key).sort().join('\n') === b.rows.map(key).sort().join('\n')
}

let pass = 0, fail = 0
for (const lvl of sqlLevels) {
  const db = new sql.Database()
  const errors: string[] = []
  try {
    if (lvl.sqlSchema) db.run(lvl.sqlSchema)
    const sol = run(db, lvl.modelSolution)
    let seen = 0
    for (const t of [...(lvl.sampleTests ?? []), ...(lvl.hiddenTests ?? [])]) {
      const q = (t as { query: string }).query
      try {
        const got = run(db, q)
        seen++
        if (!same(sol, got)) errors.push(`result differs from solution: ${q}`)
      } catch (e: any) {
        errors.push(`query threw: ${q} — ${String(e?.message ?? e)}`)
      }
    }
    if (seen === 0) errors.push('no tests defined')
  } catch (e: any) {
    errors.push(`level threw: ${String(e?.message ?? e)}`)
  }
  db.close()
  if (errors.length) {
    fail++
    console.log(`FAIL ${lvl.id}`)
    for (const e of errors) console.log('   ', e)
  } else {
    pass++
    console.log(`ok   ${lvl.id}`)
  }
}
console.log(`\nSQL track: ${pass} passed, ${fail} failed (${sqlLevels.length} levels)`)