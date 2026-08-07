import type { Difficulty, Level, TestCase } from '../types'
import { refs, type RefKey } from './refs'
import { cSnips } from './snippets/c'
import { cppSnips } from './snippets/cpp'
import { javaSnips } from './snippets/java'
import { pySnips } from './snippets/python'
import { jsSnips } from './snippets/js'
import type { Template } from './lib'

export type LangKey = 'c' | 'cpp' | 'java' | 'python' | 'js'

const SNIP: Record<LangKey, Record<string, (p: any) => Template>> = {
  c: cSnips, cpp: cppSnips, java: javaSnips, python: pySnips, js: jsSnips,
}

export const LANG_NAME: Record<LangKey, string> = {
  c: 'C', cpp: 'C++', java: 'Java', python: 'Python', js: 'JavaScript',
}

const TOPIC_THEORY: Record<string, { name: string; blurb: string; body: string[] }> = {
  foundations: {
    name: 'Foundations',
    blurb: 'Your very first program',
    body: [
      'Every journey starts with the simplest program: one that prints text to the screen.',
      'A "statement" is one instruction. It ends with a newline (or in C-family languages, a semicolon).',
      'Run your code with the Run button to see its output in the console below.',
    ],
  },
  variables: {
    name: 'Variables & Math',
    blurb: 'Store data, do arithmetic',
    body: [
      'Variables are named boxes that store values. You create one, give it a value, then read it back.',
      'Arithmetic: + - * / work like a calculator. Watch out: integer division drops the remainder in C-family languages.',
      'Input comes from the keyboard. Your program reads numbers you type, then prints a result.',
    ],
  },
  conditions: {
    name: 'Conditions',
    blurb: 'Make decisions',
    body: [
      'Programs make decisions with if/else: "if this is true, do A, otherwise do B".',
      'The condition inside if(...) is a true/false question. == means "equal to", != means "not equal".',
      'You can chain several cases with else if.',
    ],
  },
  loops: {
    name: 'Loops',
    blurb: 'Repeat work for you',
    body: [
      'Loops repeat a block of code many times — the heart of automation.',
      'A for loop counts: start, condition, step. A while loop repeats while a condition stays true.',
      'Anything you would do by hand a thousand times, a loop does instantly.',
    ],
  },
  arrays: {
    name: 'Arrays & Lists',
    blurb: 'Many values in one box',
    body: [
      'An array (or list) stores many values in one variable, numbered from index 0.',
      'The first element is index 0, the last is length-1 — the classic off-by-one trap.',
      'Looping over an array lets you find the biggest, the smallest, the sum, or transform it.',
    ],
  },
  strings: {
    name: 'Strings & Text',
    blurb: 'Words are data too',
    body: [
      'A string is text. It is really a sequence of characters, so loops work on it too.',
      'You can reverse it, count its letters, and check it character by character.',
      'Beware case: "A" and "a" are different characters.',
    ],
  },
  advanced: {
    name: 'Advanced Thinking',
    blurb: 'Think like an engineer',
    body: [
      'Now you combine everything: loops, arrays, conditions and clean logic in one program.',
      'Binary search is the classic "fast" algorithm — it halves the search space each step.',
      'A great coder first reasons about correctness, then about speed (complexity).',
    ],
  },
}

const SYNTAX: Record<LangKey, Record<string, string>> = {
  python: {
    foundations: 'print("text") prints text. Python uses no semicolons — indentation defines blocks.',
    variables: 'x = 5 stores 5 in x. input() reads a line of text; int() turns it into a number.',
    conditions: 'if cond: block; elif cond: block; else: block. Indent 4 spaces inside each block.',
    loops: 'for i in range(n): repeats n times, i = 0..n-1.',
    arrays: 'a = [1,2,3]; a[0] is 1. len(a) gives the size. a.append(x) adds to the end.',
    strings: 's = "abc"; s[0] is "a"; s[::-1] reverses; ch in s checks membership.',
    advanced: 'Define functions with def name(...): . Keep them small and clear.',
  },
  js: {
    foundations: 'console.log("text") prints. Statements end with ;. { } group blocks.',
    variables: 'let x = 5 declares a variable. Numbers come from input as strings — use +t[0].',
    conditions: 'if (cond) { } else { }. === checks equality with type.',
    loops: 'for (let i = 0; i < n; i++) { } repeats n times.',
    arrays: 'const a = [...] ; a[0] is first; a.length is size; a.push(x) appends.',
    strings: 's = "abc"; s[i] is a char; s.split("") turns it into an array.',
    advanced: 'Functions: function name(p) { }. const is preferred for names that never change.',
  },
  java: {
    foundations: 'System.out.println("text") prints. Every program lives inside a class with a main method.',
    variables: 'int x = 5; declares a whole number. Scanner reads input: sc.nextInt().',
    conditions: 'if (cond) { } else { }. == compares numbers; ! means not.',
    loops: 'for (int i = 0; i < n; i++) { } repeats n times.',
    arrays: 'int[] a = new int[n]; a[0] is first; a.length is the size.',
    strings: 'String s = sc.next(); s.length() is size; s.charAt(i) is a character.',
    advanced: 'Methods: static int name(int x) { }. Declare the return type before the name.',
  },
  c: {
    foundations: 'printf("text\\n") prints. Every program needs #include <stdio.h> and a main() function.',
    variables: 'int x = 5; declares a whole number. scanf("%d", &x) reads one int into x.',
    conditions: 'if (cond) { } else { }. == compares; && is AND; || is OR.',
    loops: 'for (int i = 0; i < n; i++) { } repeats n times.',
    arrays: 'int a[100]; a[0] is first. C has no built-in length — track it yourself.',
    strings: 'char s[100]; scanf("%s", s); s[i] is a character; string.h gives strlen().',
    advanced: 'Functions: int name(int x) { } must be declared before use.',
  },
  cpp: {
    foundations: 'cout << "text" << endl; prints. #include <iostream> gives cin/cout.',
    variables: 'int x = 5; declares. cin >> x reads one value.',
    conditions: 'if (cond) { } else { }. == compares; && AND; || OR.',
    loops: 'for (int i = 0; i < n; i++) { } repeats n times.',
    arrays: 'vector<int> a(n); gives a dynamic array; a[0] first; a.size() is length.',
    strings: 'string s; cin >> s; s.size(); s[i] is a char.',
    advanced: 'Functions: int name(int x) { }. Prefer vector over raw arrays.',
  },
}

const HINT_TEMPLATE: [string, string, string] = [
  'Break the problem into steps: read the input, work it out, print the answer.',
  'Try it with a tiny example by hand first — pencil & paper beats guessing.',
  'Check the model solution under the solution tab if you are truly stuck.',
]

function testsFor(archetype: RefKey, inputs: string[]): TestCase[] {
  return inputs.map(i => ({ input: i, expected: refs[archetype](i) }))
}

export interface LevelSpec {
  lang: LangKey
  archetype: RefKey
  topic: string
  title: string
  story?: string
  theory?: string[]
  diff?: Difficulty
  minutes?: number
  xp?: number
  complexity?: string
  limitMs?: number
  samples: string[]
  hidden: string[]
  boss?: boolean
  note?: string
}

export function level(s: LevelSpec): Level {
  const tpl = SNIP[s.lang][s.archetype](s)
  const diff = s.diff ?? (s.boss ? 'hard' : 'easy')
  const minutes = s.minutes ?? 5
  const xp = s.xp ?? (s.boss ? 30 : diff === 'easy' ? 10 : diff === 'medium' ? 15 : 20)
  const id = `${s.lang}-${s.topic}-${s.archetype}-${slug(s.title)}`
  const theory = s.theory ?? TOPIC_THEORY[s.topic].body
  return {
    id,
    topic: s.topic,
    type: s.boss ? 'boss' : 'code',
    title: s.title,
    difficulty: diff,
    minutes,
    xp,
    story: s.story,
    theory,
    example: SYNTAX[s.lang][s.topic],
    starterCode: tpl.starter,
    modelSolution: tpl.solution,
    hints: HINT_TEMPLATE,
    sampleTests: testsFor(s.archetype, s.samples),
    hiddenTests: testsFor(s.archetype, s.hidden),
    timeLimitMs: s.limitMs,
    complexity: s.complexity,
  }
}

export interface TraceSpecInput {
  lang: LangKey
  topic: string
  title: string
  story?: string
  theory?: string[]
  code: string
  choices: string[]
  answerIndex: number
  explain: string
  diff?: Difficulty
  minutes?: number
  xp?: number
}

export function traceLevel(s: TraceSpecInput): Level {
  return {
    id: `${s.lang}-${s.topic}-trace-${slug(s.title)}`,
    topic: s.topic,
    type: 'trace',
    title: s.title,
    difficulty: s.diff ?? 'medium',
    minutes: s.minutes ?? 4,
    xp: s.xp ?? 15,
    story: s.story,
    theory: s.theory ?? TOPIC_THEORY[s.topic].body,
    example: SYNTAX[s.lang][s.topic],
    starterCode: '',
    modelSolution: '',
    hints: HINT_TEMPLATE,
    sampleTests: [],
    hiddenTests: [],
    trace: { code: s.code, choices: s.choices, answerIndex: s.answerIndex, explain: s.explain },
  }
}

export interface FixSpecInput {
  lang: LangKey
  archetype: RefKey
  topic: string
  title: string
  story?: string
  theory?: string[]
  buggy: string
  bugs: string[]
  solution: string
  diff?: Difficulty
  minutes?: number
  xp?: number
  samples: string[]
  hidden: string[]
}

export function fixLevel(s: FixSpecInput): Level {
  return {
    id: `${s.lang}-${s.topic}-fix-${slug(s.title)}`,
    topic: s.topic,
    type: 'fixbug',
    title: s.title,
    difficulty: s.diff ?? 'medium',
    minutes: s.minutes ?? 8,
    xp: s.xp ?? 20,
    story: s.story,
    theory: s.theory ?? TOPIC_THEORY[s.topic].body,
    example: SYNTAX[s.lang][s.topic],
    starterCode: s.buggy,
    modelSolution: s.solution,
    hints: HINT_TEMPLATE,
    sampleTests: testsFor(s.archetype, s.samples),
    hiddenTests: testsFor(s.archetype, s.hidden),
    fix: { buggy: s.buggy, bugCount: s.bugs.length, bugs: s.bugs },
  }
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}