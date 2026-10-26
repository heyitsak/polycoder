import { level, traceLevel, fixLevel } from '../factory'
import type { Level } from '../../types'

const lang = 'js' as const
const L = (o: any) => level({ lang, ...o })
const Tr = (o: any) => traceLevel({ lang: 'js', ...o })
const Fx = (o: any) => fixLevel({ lang, ...o })

export const jsLevels: Level[] = [
  L({ archetype: 'hello', topic: 'foundations', title: 'Hello, Coder!',
    story: 'Node.js greets you with console.log.',
    samples: [''], hidden: [''] }),
  L({ archetype: 'sum2', topic: 'foundations', title: 'Add Two Numbers',
    story: 't[0] and t[1] are strings — convert with +.',
    samples: ['5 7', '100 250'], hidden: ['0 0', '-5 9', '999999 1'] }),
  Tr({ topic: 'foundations', title: 'Trace: operator order',
    code: 'const a = 4, b = 2;\nconsole.log(a + b * 3);',
    choices: ['18', '10', '12', '24'], answerIndex: 1,
    explain: '* first: 2*3=6, then 4+6=10.' }),

  L({ archetype: 'sum1toN', topic: 'variables', title: 'Sum 1..n',
    story: 'Loop and add from 1 to n.',
    samples: ['5', '10'], hidden: ['1', '100', '0', '1000'], minutes: 6 }),
  L({ archetype: 'evenOdd', topic: 'variables', title: 'Even or Odd',
    story: 'n % 2 tells the truth.',
    samples: ['4'], hidden: ['0', '7', '-3', '100000'] }),
  Tr({ topic: 'variables', title: 'Trace: destructuring swap',
    code: 'let a = 5, b = 10;\n[a, b] = [b, a];\nconsole.log(a, b);',
    choices: ['5 10', '10 5', '10 10', '5 5'], answerIndex: 1,
    explain: '[a, b] = [b, a] swaps in place.' }),

  L({ archetype: 'isPrime', topic: 'conditions', title: 'Prime Test',
    story: 'Divisibility up to sqrt(n).',
    samples: ['7', '10'], hidden: ['2', '1', '0', '97', '1000000'], minutes: 8 }),
  L({ archetype: 'fizzbuzz', topic: 'conditions', title: 'FizzBuzz',
    story: 'From 1 to n: the canonical interview problem.',
    samples: ['15'], hidden: ['1', '3', '5', '20'], minutes: 8 }),
  Fx({ archetype: 'isPrime', topic: 'conditions', title: 'Fix: prime test',
    story: 'Three bugs hide in this prime checker.',
    buggy: `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = +t[0];
let ok = true;
if (n === 1) ok = true;
for (let d = 2; d <= n; d++) {
  if (n % d === 0) ok = false;
}
console.log(ok ? 'prime' : 'not prime');`,
    bugs: ['n=1 wrongly prime', 'loop goes to n instead of sqrt(n)', 'no early break'],
    solution: `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = +t[0];
if (n < 2) { console.log('not prime'); }
else {
  let ok = true;
  for (let d = 2; ok && d * d <= n; d++) if (n % d === 0) ok = false;
  console.log(ok ? 'prime' : 'not prime');
}`,
    samples: ['5', '10'], hidden: ['1', '2', '97'], minutes: 10 }),

  L({ archetype: 'triangle', topic: 'loops', title: 'Star Triangle',
    story: 'n rows of stars using string repeat.',
    samples: ['4'], hidden: ['1', '7'], minutes: 6 }),
  L({ archetype: 'fibN', topic: 'loops', title: 'Fibonacci',
    story: 'n-th Fibonacci via the a,b bump.',
    samples: ['5', '10'], hidden: ['0', '1', '25'], minutes: 8 }),
  Tr({ topic: 'loops', title: 'Trace: loop sum',
    code: 'let s = 0;\nfor (let i = 1; i < 5; i++) s += i;\nconsole.log(s);',
    choices: ['15', '10', '4', '5'], answerIndex: 1,
    explain: 'i = 1,2,3,4 => sum 10.' }),

  L({ archetype: 'maxIn', topic: 'arrays', title: 'Max via Math',
    story: 'Math.max(...arr) spreads the array.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n42', '6\n-1 -5 -2 -9 -3 -7', '4\n10 10 10 10'], minutes: 6 }),
  L({ archetype: 'countEven', topic: 'arrays', title: 'Count Evens',
    story: 'arr.filter(...).length.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n1', '4\n2 4 6 8', '3\n1 3 5'], minutes: 6 }),
  L({ archetype: 'reverseList', topic: 'arrays', title: 'Reverse',
    story: 'arr.reverse() mutates; join with space.',
    samples: ['4\n1 2 3 4'], hidden: ['1\n9', '5\n-1 0 5 6 -2'], minutes: 6 }),
  Tr({ topic: 'arrays', title: 'Trace: array index',
    code: 'const a = [10, 20, 30];\nconsole.log(a[2]);',
    choices: ['20', '30', '10', 'error'], answerIndex: 1,
    explain: 'Index 2 is the third element: 30.' }),

  L({ archetype: 'vowel', topic: 'strings', title: 'Vowel Count',
    story: 'Count vowels including capitals.',
    samples: ['hello'], hidden: ['python', 'AEIOU', 'xyz', 'programming'], minutes: 6 }),
  L({ archetype: 'isPalindrome', topic: 'strings', title: 'Palindrome',
    story: 'split-reverse-join trick.',
    samples: ['racecar'], hidden: ['level', 'python', 'a', 'abba'], minutes: 6 }),
  Fx({ archetype: 'vowel', topic: 'strings', title: 'Fix: vowel counter',
    story: 'Misses capitals and adds a bonus -1.',
    buggy: `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
const s = t[0];
let c = 0;
for (const ch of s) {
  if ('aeiou'.includes(ch)) c += 1;
}
console.log(c - 1);`,
    bugs: ['lower-case only', 'prints c - 1'],
    solution: `const t = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);
const s = t[0];
let c = 0;
for (const ch of s) {
  if ('aeiouAEIOU'.includes(ch)) c += 1;
}
console.log(c);`,
    samples: ['hello'], hidden: ['AEIOU', 'Python', 'xyz'], minutes: 10 }),

  L({ archetype: 'binarySearch', topic: 'advanced', title: 'Binary Search',
    story: 'Index of q in sorted array.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '5\n1 3 5 7 9\n1', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1'],
    complexity: 'O(log n)', minutes: 10, diff: 'medium' }),
  L({ archetype: 'twoSum', topic: 'advanced', title: 'Boss: Two Sum',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'hard', minutes: 15, xp: 30, boss: true, limitMs: 2000 }),
  Tr({ topic: 'arrays', title: 'Trace: array filter and map',
    code: "const nums = [1, 2, 3, 4];\\nconst res = nums.filter(n => n % 2 !== 0).map(n => n * 3);\\nconsole.log(res.join(' '));",
    choices: ["3 9", "6 12", "1 3", "3 6 9 12"], answerIndex: 0,
    explain: "filter keeps [1, 3], then map multiplies each by 3 yielding [3, 9]." }),
  Tr({ topic: 'variables', title: 'Trace: object spread overrides',
    code: "const a = { x: 1, y: 2 };\\nconst b = { ...a, y: 99, z: 3 };\\nconsole.log(b.x + b.y);",
    choices: ["100", "3", "102", "NaN"], answerIndex: 0,
    explain: "The spread sets y to 2, then y: 99 overwrites it with 99. b.x (1) + b.y (99) = 100." }),
  Tr({ topic: 'advanced', title: 'Trace: closure counter',
    code: "function makeCounter() {\\n  let c = 0;\\n  return () => ++c;\\n}\\nconst count = makeCounter();\\ncount();\\nconsole.log(count());",
    choices: ["2", "1", "0", "undefined"], answerIndex: 0,
    explain: "The enclosed variable c retains state: first call increments to 1, second increments to 2." }),
  Tr({ topic: 'conditions', title: 'Trace: nullish coalescing',
    code: "const val = 0 ?? 42;\\nconst fallback = null ?? 42;\\nconsole.log(val, fallback);",
    choices: ["0 42", "42 42", "0 null", "undefined 42"], answerIndex: 0,
    explain: "?? only triggers on null and undefined. 0 is defined, so 0 is kept, while null falls back to 42." }),
  Tr({ topic: 'arrays', title: 'Trace: array reduce sum',
    code: "const arr = [2, 4, 6];\\nconst sum = arr.reduce((acc, curr) => acc + curr, 10);\\nconsole.log(sum);",
    choices: ["22", "12", "10", "24"], answerIndex: 0,
    explain: "Initial accumulator is 10. Adding 2, 4, 6 gives 10 + 2 + 4 + 6 = 22." }),
  Tr({ topic: 'strings', title: 'Trace: template literal expression',
    code: "const name = 'JS';\\nconst score = 95;\\nconsole.log(`${name}:${score >= 90 ? 'A' : 'B'}`);",
    choices: ["JS:A", "JS:B", "JS:95", "name:A"], answerIndex: 0,
    explain: "The ternary expression evaluates to 'A' since 95 >= 90 is true." }),
  Tr({ topic: 'arrays', title: 'Trace: slice vs splice',
    code: "const a = [10, 20, 30, 40];\\nconst sub = a.slice(1, 3);\\nconsole.log(sub.length, a.length);",
    choices: ["2 4", "2 2", "3 4", "1 4"], answerIndex: 0,
    explain: "slice(1, 3) returns a new array with elements at index 1 and 2 (length 2) without mutating original a (length 4)." }),
]