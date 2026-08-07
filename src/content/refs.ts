const T = (s: string) => s.trim().split(/\s+/).filter(Boolean)
const J = (x: any) => String(x)
const lines = (arr: any[]) => arr.join('\n')

function prime(n: number): string {
  if (n < 2) return 'not prime'
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return 'not prime'
  return 'prime'
}
function fib(n: number): number {
  let a = 0, b = 1
  for (let i = 0; i < n; i++) { const c = a + b; a = b; b = c }
  return a
}
function maxSub(nums: number[]): number {
  let best = -Infinity, cur = 0
  for (const x of nums) { cur = Math.max(x, cur + x); best = Math.max(best, cur) }
  return best
}
function minCoins(amount: number, d: number[]): number {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i <= amount; i++) for (const c of d) if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1)
  return dp[amount] === Infinity ? -1 : dp[amount]
}
function longest(s: string): number {
  const seen = new Map<string, number>()
  let best = 0, start = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (seen.has(c) && seen.get(c)! >= start) start = seen.get(c)! + 1
    seen.set(c, i)
    best = Math.max(best, i - start + 1)
  }
  return best
}
function components(tk: string[]): number {
  const n = +tk[0], m = +tk[1]
  const p = Array.from({ length: n + 1 }, (_, i) => i)
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])))
  for (let i = 0; i < m; i++) {
    const a = +tk[2 + i * 2], b = +tk[3 + i * 2]
    const ra = f(a), rb = f(b)
    if (ra !== rb) p[ra] = rb
  }
  return new Set(Array.from({ length: n }, (_, i) => f(i + 1))).size
}

export const refs: Record<string, (raw: string) => string> = {
  hello: () => 'Hello, Coder!',
  sum2: raw => { const t = T(raw); return J(+t[0] + +t[1]) },
  sum1toN: raw => { const n = +T(raw)[0]; return J((n * (n + 1)) / 2) },
  maxIn: raw => { const t = T(raw); const a = t.slice(1).map(Number); return J(Math.max(...a)) },
  minIn: raw => { const t = T(raw); const a = t.slice(1).map(Number); return J(Math.min(...a)) },
  countEven: raw => { const t = T(raw); return J(t.slice(1).filter(x => +x % 2 === 0).length) },
  reverseList: raw => { const t = T(raw); return t.slice(1).reverse().join(' ') },
  vowel: raw => { const s = T(raw)[0]; return J((s.match(/[aeiou]/gi) ?? []).length) },
  isPalindrome: raw => { const s = T(raw)[0]; return s === [...s].reverse().join('') ? 'yes' : 'no' },
  fibN: raw => J(fib(+T(raw)[0])),
  isPrime: raw => prime(+T(raw)[0]),
  fizzbuzz: raw => {
    const n = +T(raw)[0]
    return lines(Array.from({ length: n }, (_, i) => {
      const x = i + 1
      return x % 15 === 0 ? 'FizzBuzz' : x % 3 === 0 ? 'Fizz' : x % 5 === 0 ? 'Buzz' : J(x)
    }))
  },
  timesTable: raw => {
    const n = +T(raw)[0]
    return lines(Array.from({ length: 10 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`))
  },
  triangle: raw => { const n = +T(raw)[0]; return lines(Array.from({ length: n }, (_, i) => '*'.repeat(i + 1))) },
  evenOdd: raw => { const n = +T(raw)[0]; return n % 2 === 0 ? 'even' : 'odd' },
  maybeEvenOdd: raw => { const n = +T(raw)[0]; return n % 2 === 0 ? 'even' : 'odd' },
  binarySearch: raw => {
    const t = T(raw)
    const n = +t[0]
    const a = t.slice(1, 1 + n).map(Number)
    const q = +t[1 + n]
    let lo = 0, hi = n - 1, ans = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (a[mid] === q) { ans = mid; break }
      if (a[mid] < q) lo = mid + 1; else hi = mid - 1
    }
    return J(ans)
  },
  twoSum: raw => {
    const t = T(raw)
    const n = +t[0], a = t.slice(1, 1 + n).map(Number), tar = +t[1 + n]
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
      if (a[i] + a[j] === tar) return `${i} ${j}`
    return '-1'
  },
  mergeSorted: raw => {
    const t = T(raw)
    const n = +t[0], a = t.slice(1, 1 + n).map(Number)
    const off = 1 + n
    const m = +t[off], b = t.slice(off + 1, off + 1 + m).map(Number)
    return [...a, ...b].sort((x, y) => x - y).join(' ')
  },
  anagram: raw => {
    const t = T(raw)
    return [...t[0]].sort().join('') === [...t[1]].sort().join('') ? 'yes' : 'no'
  },
  kadane: raw => { const t = T(raw); return J(maxSub(t.slice(1).map(Number))) },
  coins: raw => {
    const t = T(raw)
    const amount = +t[0], k = +t[1]
    return J(minCoins(amount, t.slice(2, 2 + k).map(Number)))
  },
  longest: raw => J(longest(T(raw)[0])),
  components: raw => J(components(T(raw))),
  lcs: raw => {
    const t = T(raw)
    const a = t[0], b = t[1]
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    return J(dp[a.length][b.length])
  },
}

export type RefKey = keyof typeof refs