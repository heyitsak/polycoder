import { level } from '../factory'
import type { Level } from '../../types'

const lang = 'python' as const
const L = (o: any) => level({ lang, ...o })

const ARR = [
  'Arrays are the workhorse of algorithms: index into them, slice them, sum them.',
  'When you scan an array, count how many passes your logic needs — one pass is usually enough.',
  'Watch boundaries: index 0 to len-1, empty arrays, and single-element arrays.',
]
const STR = [
  'Strings are sequences of characters — everything you know about arrays applies.',
  'Sorting a string, mapping characters, and sliding windows are core string moves.',
  'Case matters unless you normalize with .lower().',
]
const SEARCH = [
  'Searching sorted data is where the magic happens: binary search halves the space.',
  'O(log n) beats O(n) astronomically: for a billion items, log2 is only ~30 steps.',
  'Two-pointer thinking turns nested loops into one pass.',
]
const GREEDY = [
  'Greedy means: make the locally best choice at every step, hoping it is globally best.',
  'Not everything is greedy — but coin change with standard denominations often is.',
  'Proof by counterexample: always test greedy ideas against tricky inputs.',
]
const GRAPH = [
  'A graph is nodes + edges. Union-Find answers "are these two nodes connected?" fast.',
  'Components = maximal sets of mutually reachable nodes.',
  'Counting components is the classic first graph problem.',
]
const DP = [
  'Dynamic programming = reuse answers: solve small cases, build bigger ones from them.',
  'The Fibonacci sequence IS dynamic programming: f(n) = f(n-1) + f(n-2).',
  'Write the recurrence on paper before coding. The table fills itself.',
]
const BOSS = [
  'Champion mode: everything combined, under time pressure.',
  'Read the problem twice. Decide the complexity first — then write the code.',
  'Edge cases: empty input, negative numbers, duplicates, single elements.',
]

export const dsaLevels: Level[] = [
  L({ archetype: 'mergeSorted', topic: 'arrays', title: 'Merge Two Sorted Lists',
    story: 'Two sorted lists merge into one sorted list.',
    samples: ['3\n1 3 5\n3\n2 4 6'], hidden: ['2\n1 2\n2\n3 4', '1\n5\n1\n1', '3\n1 1 1\n2\n1 2', '4\n-3 -1 2 9\n3\n-2 0 10'],
    diff: 'medium', minutes: 10, theory: ARR, complexity: 'O(n log n)' }),
  L({ archetype: 'kadane', topic: 'arrays', title: 'Maximum Subarray',
    story: 'Find the contiguous slice with the biggest sum. Kadane\'s algorithm — one pass.',
    samples: ['9\n-2 1 -3 4 -1 2 1 -5 4'], hidden: ['5\n-1 -2 -3 -4 -5', '1\n7', '6\n5 4 -1 7 8 -10', '4\n1 2 3 4'],
    diff: 'medium', minutes: 12, theory: ARR, complexity: 'O(n)' }),

  L({ archetype: 'anagram', topic: 'strings', title: 'Anagram?',
    story: 'Two words are anagrams if sorting makes them equal.',
    samples: ['listen silent'], hidden: ['abc cab', 'a a', 'hello world', 'ab baa'],
    diff: 'easy', minutes: 8, theory: STR, complexity: 'O(n log n)' }),
  L({ archetype: 'longest', topic: 'strings', title: 'Longest Unique Substring',
    story: 'Sliding window: the longest substring with no repeated character.',
    samples: ['abcabcbb'], hidden: ['bbbbb', 'pwwkew', 'abcdef', 'abba'],
    diff: 'hard', minutes: 15, theory: STR, complexity: 'O(n)' }),

  L({ archetype: 'binarySearch', topic: 'search', title: 'Binary Search',
    story: 'Find the index of q in a sorted list. Halve it every step.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1', '8\n1 2 3 4 5 6 7 8\n8'],
    diff: 'medium', minutes: 10, theory: SEARCH, complexity: 'O(log n)' }),
  L({ archetype: 'twoSum', topic: 'search', title: 'Two Sum',
    story: 'Indexes of two numbers that add to t. O(n^2) first, O(n) with a hash map.',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'medium', minutes: 12, theory: SEARCH, complexity: 'O(n)' }),

  L({ archetype: 'coins', topic: 'greedy', title: 'Coin Change',
    story: 'Minimum coins to reach an amount. Standard denominations — greedy or DP both work.',
    samples: ['11\n3\n1 5 10'], hidden: ['7\n3\n1 3 4', '0\n3\n1 5 10', '3\n2\n2 5', '100\n4\n1 10 25 50'],
    diff: 'hard', minutes: 15, theory: GREEDY, complexity: 'O(amount * k)' }),

  L({ archetype: 'components', topic: 'graph', title: 'Graph Components',
    story: 'Count connected components of a graph with union-find.',
    samples: ['4 2\n1 2\n3 4'], hidden: ['5 4\n1 2\n2 3\n4 5\n5 1', '3 0', '6 5\n1 2\n2 3\n4 5\n5 6\n1 6', '2 1\n1 2'],
    diff: 'hard', minutes: 15, theory: GRAPH, complexity: 'O(n α(n))' }),

  L({ archetype: 'lcs', topic: 'dp', title: 'Longest Common Subsequence',
    story: 'The DP classic: match characters and grow the table.',
    samples: ['abcde ace'], hidden: ['abc abc', 'abc def', 'aaaa bbb', 'axbycz abc'],
    diff: 'hard', minutes: 15, theory: DP, complexity: 'O(n*m)' }),

  L({ archetype: 'kadane', topic: 'boss', title: 'BOSS: Subarray Gauntlet',
    story: 'Maximum subarray — but the inputs fight back: negatives, singles, huge lists. Speed matters.',
    samples: ['5\n-2 1 -3 4 -1'], hidden: ['10\n-2 1 -3 4 -1 2 1 -5 4 3', '1\n-5', '7\n1 -2 3 -4 5 -6 7', '4\n0 0 0 0', '3\n-1 -1 -1'],
    diff: 'hard', minutes: 20, xp: 30, boss: true, limitMs: 1500, theory: BOSS, complexity: 'O(n)' }),
]

export const dsaTopics = [
  { id: 'arrays', name: 'Arrays', blurb: 'Scan & transform' },
  { id: 'strings', name: 'Strings', blurb: 'Text tricks' },
  { id: 'search', name: 'Search', blurb: 'Find it fast' },
  { id: 'greedy', name: 'Greedy', blurb: 'Local best' },
  { id: 'graph', name: 'Graphs', blurb: 'Networks' },
  { id: 'dp', name: 'Dynamic Programming', blurb: 'Reuse answers' },
  { id: 'boss', name: 'Grandmaster', blurb: 'Pressure test' },
]