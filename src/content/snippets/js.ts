import type { Template } from '../lib'

type B = (p: any) => Template

function w(solution: string, skeleton?: string): Template {
  return { starter: skeleton ?? solution, solution }
}

const read = `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
`
const nArr = () => `const n = +t[0];
const arr = t.slice(1, 1 + n).map(Number);
`
const TODO = '// TODO'

export const jsSnips: Record<string, B> = {
  hello: () => w(`console.log("Hello, Coder!");`),

  sum2: () => w(
    read + `const a = +t[0], b = +t[1];
console.log(a + b);`,
    read + `// TODO: print a + b
`,
  ),

  sum1toN: () => w(
    read + `const n = +t[0];
let s = 0;
for (let i = 1; i <= n; i++) s += i;
console.log(s);`,
    read + `const n = +t[0];
// TODO: print the sum 1 + 2 + ... + n
`
  ),

  maxIn: () => w(
    read + nArr() + `console.log(Math.max(...arr));`,
    read + nArr() + `${TODO}: print the largest value in arr
`
  ),
  minIn: () => w(
    read + nArr() + `console.log(Math.min(...arr));`,
    read + nArr() + `${TODO}: print the smallest value in arr
`
  ),
  countEven: () => w(
    read + nArr() + `console.log(arr.filter(x => x % 2 === 0).length);`,
    read + nArr() + `${TODO}: print how many numbers in arr are even
`
  ),
  reverseList: () => w(
    read + nArr() + `console.log(arr.reverse().join(' '));`,
    read + nArr() + `${TODO}: print arr in reverse order, space-separated
`
  ),

  vowel: () => w(
    read + `const s = t[0];
let c = 0;
for (const ch of s) if ('aeiouAEIOU'.includes(ch)) c++;
console.log(c);`,
    read + `const s = t[0];
${TODO}: print the number of vowels (a, e, i, o, u) in s
`
  ),

  isPalindrome: () => w(
    read + `const s = t[0];
console.log(s === s.split('').reverse().join('') ? 'yes' : 'no');`,
    read + `const s = t[0];
${TODO}: print "yes" if s reads the same backwards, else "no"
`
  ),

  fibN: () => w(
    read + `const n = +t[0];
let a = 0, b = 1;
for (let i = 0; i < n; i++) { const c = a + b; a = b; b = c; }
console.log(a);`,
    read + `const n = +t[0];
${TODO}: print the n-th Fibonacci number (0, 1, 1, 2, 3, ...)
`
  ),

  isPrime: () => w(
    read + `const n = +t[0];
if (n < 2) { console.log('not prime'); }
else {
  let ok = true;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) { ok = false; break; }
  console.log(ok ? 'prime' : 'not prime');
}`,
    read + `const n = +t[0];
${TODO}: print "prime" if n is prime, else "not prime"
`
  ),

  fizzbuzz: () => w(
    read + `const n = +t[0];
for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}`,
    read + `const n = +t[0];
${TODO}: for each i in 1..n print FizzBuzz / Fizz / Buzz / i
`
  ),

  timesTable: () => w(
    read + `const n = +t[0];
for (let i = 1; i <= 10; i++) console.log(n + ' x ' + i + ' = ' + n * i);`,
    read + `const n = +t[0];
${TODO}: print the 1..10 times table for n
`
  ),

  triangle: () => w(
    read + `const n = +t[0];
for (let i = 1; i <= n; i++) console.log('*'.repeat(i));`,
    read + `const n = +t[0];
${TODO}: print n rows of stars (a right triangle)
`
  ),

  evenOdd: () => w(
    read + `const n = +t[0];
console.log(n % 2 === 0 ? 'even' : 'odd');`,
    read + `const n = +t[0];
${TODO}: print "even" or "odd"
`
  ),

  binarySearch: () => w(
    read + nArr() + `const q = +t[1 + n];
let lo = 0, hi = arr.length - 1, ans = -1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (arr[mid] === q) { ans = mid; break; }
  if (arr[mid] < q) lo = mid + 1; else hi = mid - 1;
}
console.log(ans);`,
    read + nArr() + `const q = +t[1 + n];
${TODO}: binary search arr for q, print its index or -1
`
  ),

  twoSum: () => w(
    read + nArr() + `const t2 = +t[1 + n];
let found = -1;
for (let i = 0; i < n && found === -1; i++) {
  for (let j = i + 1; j < n && found === -1; j++) {
    if (arr[i] + arr[j] === t2) {
      console.log(i + ' ' + j);
      found = 1;
    }
  }
}
if (found === -1) console.log('-1');`,
    read + nArr() + `const t2 = +t[1 + n];
${TODO}: find i < j with arr[i] + arr[j] === t2, print "i j" or -1
`
  ),
}