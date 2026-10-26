import { level, traceLevel, fixLevel } from '../factory'
import type { Level } from '../../types'

const lang = 'python' as const
const L = (o: any) => level({ lang, ...o })
const Tr = (o: any) => traceLevel({ lang: 'python', ...o })
const Fx = (o: any) => fixLevel({ lang, ...o })

export const pythonLevels: Level[] = [
  // --- Foundations ---
  L({ archetype: 'hello', topic: 'foundations', title: 'Hello, Coder!',
    story: 'Your first line of code. Every legend starts here.',
    samples: [''], hidden: [''] }),
  L({ archetype: 'sum2', topic: 'foundations', title: 'The Cash Register',
    story: 'A shopkeeper types two prices and the total bill must appear. Add them.',
    samples: ['5 7', '100 250'], hidden: ['0 0', '-5 9', '999999 1'] }),
  Tr({ topic: 'foundations', title: 'Trace: operator order',
    code: 'a = 4\nb = 2\nprint(a + b * 3)',
    choices: ['18', '10', '12', '24'], answerIndex: 1,
    explain: 'Multiplication binds tighter than addition: 2*3=6, then 4+6=10.' }),

  // --- Variables & Math ---
  L({ archetype: 'sum1toN', topic: 'variables', title: 'Gauss & 1..n',
    story: 'The school legend: sum all integers from 1 to n.',
    samples: ['5', '10'], hidden: ['1', '100', '0', '1000'], minutes: 6 }),
  L({ archetype: 'evenOdd', topic: 'variables', title: 'Even or Odd?',
    story: 'A game decides who starts first by drawing a number.',
    samples: ['4'], hidden: ['0', '7', '-3', '100000'] }),
  L({ archetype: 'timesTable', topic: 'variables', title: 'Times Table Bot',
    story: 'Print the classic multiplication table for n, from 1 x to 10 x.',
    samples: ['5'], hidden: ['2', '9'], minutes: 6 }),
  Tr({ topic: 'variables', title: 'Trace: swapping',
    code: 'a = 5\nb = 10\na, b = b, a\nprint(a, b)',
    choices: ['5 10', '10 5', '10 10', '5 5'], answerIndex: 1,
    explain: 'a, b = b, a swaps both values in one step in Python.' }),

  // --- Conditions ---
  L({ archetype: 'isPrime', topic: 'conditions', title: 'Prime or Not',
    story: 'A vault opens only for prime numbers. Check divisibility up to the square root.',
    samples: ['7', '10'], hidden: ['2', '1', '0', '97', '1000000'], minutes: 8 }),
  L({ archetype: 'fizzbuzz', topic: 'conditions', title: 'FizzBuzz',
    story: 'The interview classic: for 1..n print Fizz (x3), Buzz (x5), FizzBuzz (x15), else the number.',
    samples: ['15'], hidden: ['1', '3', '5', '20'], minutes: 8 }),
  Fx({ archetype: 'isPrime', topic: 'conditions', title: 'Fix: the broken prime test',
    story: 'Your friend wrote a prime checker with 3 sneaky bugs. Find and fix them.',
    buggy: `n = int(input())
ok = True
if n == 1:
    ok = True
for d in range(2, n + 1):
    if n % d == 0:
        ok = False
print("prime" if ok else "not prime")`,
    bugs: ['"1" must be "not prime"', 'loop should stop at sqrt(n)', 'a divisor found should break early'],
    solution: `n = int(input())
if n < 2:
    print("not prime")
else:
    ok = True
    d = 2
    while d * d <= n and ok:
        if n % d == 0:
            ok = False
        d += 1
    print("prime" if ok else "not prime")`,
    samples: ['5', '9'], hidden: ['1', '2', '97'], minutes: 10 }),

  // --- Loops ---
  L({ archetype: 'triangle', topic: 'loops', title: 'Star Triangle',
    story: 'Print a right-angled triangle of stars, n rows tall.',
    samples: ['4'], hidden: ['1', '7'], minutes: 6 }),
  L({ archetype: 'fibN', topic: 'loops', title: 'Fibonacci Machine',
    story: 'The rabbit problem: 0, 1, 1, 2, 3, 5... print the n-th Fibonacci number.',
    samples: ['5', '10'], hidden: ['0', '1', '25'], minutes: 8 }),
  Tr({ topic: 'loops', title: 'Trace: loop counting',
    code: 's = 0\nfor i in range(1, 5):\n    s += i\nprint(s)',
    choices: ['15', '10', '4', '5'], answerIndex: 1,
    explain: 'range(1,5) is 1,2,3,4. Their sum is 10.' }),

  // --- Arrays ---
  L({ archetype: 'maxIn', topic: 'arrays', title: 'Find the Maximum',
    story: 'A scout reports the scores of a quiz team. Find the highest.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n42', '6\n-1 -5 -2 -9 -3 -7', '4\n10 10 10 10'], minutes: 6 }),
  L({ archetype: 'countEven', topic: 'arrays', title: 'Even Counters',
    story: 'Count how many numbers in the list are even.',
    samples: ['5\n3 7 2 9 4'], hidden: ['4\n2 4 6 8', '3\n1 3 5', '1\n0'], minutes: 6 }),
  L({ archetype: 'reverseList', topic: 'arrays', title: 'Mirror the List',
    story: 'Print the list backwards — the mirror effect.',
    samples: ['4\n1 2 3 4'], hidden: ['1\n9', '5\n-1 0 5 6 -2'], minutes: 6 }),
  Tr({ topic: 'arrays', title: 'Trace: indexes',
    code: 'a = [10, 20, 30, 40]\nprint(a[1], a[-1])',
    choices: ['20 40', '10 40', '20 30', '30 40'], answerIndex: 0,
    explain: 'a[1] is the second element (20). a[-1] is the last (40).' }),

  // --- Strings ---
  L({ archetype: 'vowel', topic: 'strings', title: 'Vowel Counter',
    story: 'Count the vowels in a word for a spelling game.',
    samples: ['hello'], hidden: ['python', 'AEIOU', 'xyz', 'programming'], minutes: 6 }),
  L({ archetype: 'isPalindrome', topic: 'strings', title: 'Palindrome Checker',
    story: 'Is the word the same forwards and backwards? racecar yes, coding no.',
    samples: ['racecar'], hidden: ['level', 'python', 'a', 'abba'], minutes: 6 }),
  Fx({ archetype: 'vowel', topic: 'strings', title: 'Fix: vowel counter bugs',
    story: 'This counter misses some vowels. Find the 2 bugs.',
    buggy: `s = input()
c = 0
for ch in s:
    if ch in "aeiou":
        c = c + 1
print(c - 1)`,
    bugs: ['uppercase vowels are skipped', 'a mysterious -1 at the end'],
    solution: `s = input()
c = 0
for ch in s:
    if ch in "aeiouAEIOU":
        c += 1
print(c)`,
    samples: ['hello'], hidden: ['AEIOU', 'Python', 'xyz'], minutes: 10 }),

  // --- Advanced + Boss ---
  L({ archetype: 'binarySearch', topic: 'advanced', title: 'Binary Search',
    story: 'Find the index of q in a sorted list. Halve the search each step — exponentially faster than scanning.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '5\n1 3 5 7 9\n1', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1'],
    complexity: 'O(log n)', minutes: 10, diff: 'medium' }),
  L({ archetype: 'twoSum', topic: 'advanced', title: 'Boss: Two Sum',
    story: 'GRAND CHALLENGE: find two numbers in the list that add up to t and print their indexes.',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'hard', minutes: 15, xp: 30, boss: true, limitMs: 2000 }),
  Tr({ topic: 'strings', title: 'Trace: string step slicing',
    code: "s = 'ABCDEF'\\nprint(s[::2])",
    choices: ["ACE", "BDF", "ABC", "FED"], answerIndex: 0,
    explain: "A step of 2 picks every second character starting at index 0: A, C, E." }),
  Tr({ topic: 'arrays', title: 'Trace: list comprehension filtering',
    code: "nums = [1, 2, 3, 4, 5, 6]\\nev = [x * 2 for x in nums if x % 2 == 0]\\nprint(ev)",
    choices: ["[4, 8, 12]", "[2, 4, 6]", "[4, 6, 8]", "[2, 8, 12]"], answerIndex: 0,
    explain: "The if condition keeps even numbers (2, 4, 6), and x * 2 multiplies them by 2 yielding [4, 8, 12]." }),
  Tr({ topic: 'variables', title: 'Trace: dictionary get with default',
    code: "d = {'a': 1, 'b': 2}\\nprint(d.get('c', 0) + d.get('a', 0))",
    choices: ["1", "0", "3", "Error"], answerIndex: 0,
    explain: "d.get('c', 0) returns 0 since 'c' is absent, and d.get('a', 0) returns 1. 0 + 1 = 1." }),
  Tr({ topic: 'advanced', title: 'Trace: recursion base case',
    code: "def f(n):\\n    if n <= 1:\\n        return 1\\n    return n + f(n - 2)\\nprint(f(5))",
    choices: ["9", "15", "8", "10"], answerIndex: 0,
    explain: "f(5) = 5 + f(3) = 5 + 3 + f(1) = 5 + 3 + 1 = 9." }),
]

export const pythonTopics = [
  { id: 'foundations', name: 'Foundations', blurb: 'First program' },
  { id: 'variables', name: 'Variables & Math', blurb: 'Store and compute' },
  { id: 'conditions', name: 'Conditions', blurb: 'Make decisions' },
  { id: 'loops', name: 'Loops', blurb: 'Repeat work' },
  { id: 'arrays', name: 'Arrays & Lists', blurb: 'Many values' },
  { id: 'strings', name: 'Strings', blurb: 'Words as data' },
  { id: 'advanced', name: 'Advanced', blurb: 'Think fast' },
]