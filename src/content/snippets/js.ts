import type { Template } from '../lib'

type B = (p: any) => Template

function w(program: string): Template {
  return {
    starter: program.replace('//__SOLVE__', '// TODO: solve it!'),
    solution: program,
  }
}

const read = `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
`
const nArr = () => `const n = +t[0];
const arr = t.slice(1, 1 + n).map(Number);
`

export const jsSnips: Record<string, B> = {
  hello: () => w(`console.log("Hello, Coder!");`),

  sum2: () => w(read + `const a = +t[0], b = +t[1];
console.log(a + b);`),

  sum1toN: () => w(read + `const n = +t[0];
let s = 0;
for (let i = 1; i <= n; i++) s += i;
console.log(s);`),

  maxIn: () => w(read + nArr() + `console.log(Math.max(...arr));`),
  minIn: () => w(read + nArr() + `console.log(Math.min(...arr));`),
  countEven: () => w(read + nArr() + `console.log(arr.filter(x => x % 2 === 0).length);`),
  reverseList: () => w(read + nArr() + `console.log(arr.reverse().join(' '));`),

  vowel: () => w(read + `const s = t[0];
let c = 0;
for (const ch of s) if ('aeiouAEIOU'.includes(ch)) c++;
console.log(c);`),

  isPalindrome: () => w(read + `const s = t[0];
console.log(s === s.split('').reverse().join('') ? 'yes' : 'no');`),

  fibN: () => w(read + `const n = +t[0];
let a = 0, b = 1;
for (let i = 0; i < n; i++) { const c = a + b; a = b; b = c; }
console.log(a);`),

  isPrime: () => w(read + `const n = +t[0];
if (n < 2) { console.log('not prime'); }
else {
  let ok = true;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) { ok = false; break; }
  console.log(ok ? 'prime' : 'not prime');
}`),

  fizzbuzz: () => w(read + `const n = +t[0];
for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}`),

  timesTable: () => w(read + `const n = +t[0];
for (let i = 1; i <= 10; i++) console.log(n + ' x ' + i + ' = ' + n * i);`),

  triangle: () => w(read + `const n = +t[0];
for (let i = 1; i <= n; i++) console.log('*'.repeat(i));`),

  evenOdd: () => w(read + `const n = +t[0];
console.log(n % 2 === 0 ? 'even' : 'odd');`),

  binarySearch: () => w(read + nArr() + `const q = +t[1 + n];
let lo = 0, hi = arr.length - 1, ans = -1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (arr[mid] === q) { ans = mid; break; }
  if (arr[mid] < q) lo = mid + 1; else hi = mid - 1;
}
console.log(ans);`),

  twoSum: () => w(read + nArr() + `const t2 = +t[1 + n];
let found = -1;
for (let i = 0; i < n && found === -1; i++) {
  for (let j = i + 1; j < n && found === -1; j++) {
    if (arr[i] + arr[j] === t2) {
      console.log(i + ' ' + j);
      found = 1;
    }
  }
}
if (found === -1) console.log('-1');`),
}