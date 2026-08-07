import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

let sql: SqlJsStatic | null = null

export async function initSql() {
  if (!sql) {
    sql = await initSqlJs({ locateFile: () => sqlWasmUrl })
  }
  return sql
}

export interface SqlResult {
  cols: string[]
  rows: (string | number | null)[][]
  error?: string
  timeMs: number
}

export async function runSql(setup: string, query: string): Promise<SqlResult> {
  const S = await initSql()
  const db: Database = new S.Database()
  const t0 = performance.now()
  try {
    if (setup.trim()) db.run(setup)
    const stmt = db.prepare(query)
    const cols = stmt.getColumnNames()
    const rows: (string | number | null)[][] = []
    while (stmt.step()) {
      rows.push(stmt.get() as unknown as (string | number | null)[])
    }
    stmt.free()
    return { cols, rows, timeMs: performance.now() - t0 }
  } catch (e: any) {
    return { cols: [], rows: [], error: String(e?.message ?? e), timeMs: performance.now() - t0 }
  } finally {
    db.close()
  }
}

export function cell(v: string | number | null): string {
  if (v === null) return 'NULL'
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(+v.toFixed(6))
  return String(v)
}

export function formatSqlResult(r: SqlResult): string {
  if (r.error) return `ERROR: ${r.error}`
  if (r.cols.length === 0) return '(empty result)'
  const widths = r.cols.map((c, i) =>
    Math.max(c.length, ...r.rows.map(row => cell(row[i]).length))
  )
  const sep = widths.map(w => '-'.repeat(w)).join('-+-')
  const line = (parts: string[]) => parts.map((p, i) => p.padEnd(widths[i])).join(' | ')
  return [line(r.cols), sep, ...r.rows.map(row => line(row.map(cell)))].join('\n')
}

export function sqlEqual(a: SqlResult, b: SqlResult): boolean {
  if (a.error || b.error) return false
  if (a.cols.length !== b.cols.length) return false
  if (a.rows.length !== b.rows.length) return false
  for (let i = 0; i < a.rows.length; i++) {
    if (a.rows[i].length !== b.rows[i].length) return false
    for (let j = 0; j < a.rows[i].length; j++) {
      if (cell(a.rows[i][j]) !== cell(b.rows[i][j])) return false
    }
  }
  return true
}