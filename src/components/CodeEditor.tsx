import { useEffect, useRef } from 'react'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { sql } from '@codemirror/lang-sql'

const langs: Record<string, () => import('@codemirror/language').LanguageSupport> = {
  c: () => cpp(),
  cpp: () => cpp(),
  java: () => java(),
  python: () => python(),
  js: () => javascript(),
  sql: () => sql(),
}

export default function CodeEditor({ value, onChange, lang }: {
  value: string
  onChange: (v: string) => void
  lang: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!host.current) return
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        oneDark,
        (langs[lang] ?? langs.js)(),
        EditorView.updateListener.of(u => {
          if (u.docChanged) onChangeRef.current(u.state.doc.toString())
        }),
        EditorView.theme({ '&': { height: '100%', fontSize: '14px' }, '.cm-scroller': { fontFamily: 'JetBrains Mono, Consolas, monospace' } }),
      ],
    })
    const view = new EditorView({ state, parent: host.current })
    viewRef.current = view
    return () => view.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => {
    const v = viewRef.current
    if (!v) return
    const cur = v.state.doc.toString()
    if (cur !== value) {
      v.dispatch({ changes: { from: 0, to: cur.length, insert: value } })
    }
  }, [value])

  return <div className="h-full"><div ref={host} className="h-full" /></div>
}