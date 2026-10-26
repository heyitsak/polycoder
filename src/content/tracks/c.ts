import { level, traceLevel, fixLevel } from '../factory'
import type { Level } from '../../types'

const lang = 'c' as const
const L = (o: any) => level({ lang, ...o })
const Tr = (o: any) => traceLevel({ lang: 'c', ...o })
const Fx = (o: any) => fixLevel({ lang, ...o })

export const cLevels: Level[] = [
  L({ archetype: 'hello', topic: 'foundations', title: 'Hello, Coder!',
    story: 'Your first C program. The printf ritual begins.',
    samples: [''], hidden: [''] }),
  L({ archetype: 'sum2', topic: 'foundations', title: 'Two Numbers, One Bill',
    story: 'Add two prices with scanf and printf.',
    samples: ['5 7', '100 250'], hidden: ['0 0', '-5 9', '999999 1'] }),
  Tr({ topic: 'foundations', title: 'Trace: operator order',
    code: 'int a = 4, b = 2;\nprintf("%d", a + b * 3);',
    choices: ['18', '10', '12', '24'], answerIndex: 1,
    explain: '* binds before +: 2*3=6, then 4+6=10.' }),

  L({ archetype: 'sum1toN', topic: 'variables', title: 'Sum 1 to n',
    story: 'Sum every integer from 1 to n the way Gauss did.',
    samples: ['5', '10'], hidden: ['1', '100', '0', '1000'], minutes: 6 }),
  L({ archetype: 'evenOdd', topic: 'variables', title: 'Odd or Even',
    story: 'A referee decides a coin toss with a number.',
    samples: ['4'], hidden: ['0', '7', '-3', '100000'] }),
  Tr({ topic: 'variables', title: 'Trace: swap with a temp',
    code: 'int a = 5, b = 10, t;\nt = a; a = b; b = t;\nprintf("%d %d", a, b);',
    choices: ['5 10', '10 5', '10 10', '5 5'], answerIndex: 1,
    explain: 'The temp variable t holds 5 while b (10) goes into a; then t (5) goes into b.' }),

  L({ archetype: 'isPrime', topic: 'conditions', title: 'Prime Vault',
    story: 'The vault opens for primes only. Check divisors up to the square root.',
    samples: ['7', '10'], hidden: ['2', '1', '0', '97', '1000000'], minutes: 8 }),
  L({ archetype: 'fizzbuzz', topic: 'conditions', title: 'FizzBuzz in C',
    story: 'The hiring manager\'s favourite. Print Fizz, Buzz, FizzBuzz.',
    samples: ['15'], hidden: ['1', '3', '5', '20'], minutes: 8 }),
  Fx({ archetype: 'isPrime', topic: 'conditions', title: 'Fix: prime check',
    story: 'Find the 3 bugs that make this prime checker lie.',
    buggy: `#include <stdio.h>

int main() {
    int n, ok = 1;
    scanf("%d", &n);
    if (n == 1) ok = 1;
    for (int d = 2; d < n; d++)
        if (n % d == 0) ok = 0;
    printf("%s\\n", ok ? "prime" : "not prime");
    return 0;
}`,
    bugs: ['n=1 must be "not prime"', 'loop should stop at sqrt(n)', 'add an early break after a divisor is found'],
    solution: `#include <stdio.h>

int main() {
    int n, ok = 1;
    scanf("%d", &n);
    if (n < 2) ok = 0;
    for (int d = 2; ok && d * d <= n; d++)
        if (n % d == 0) ok = 0;
    printf("%s\\n", ok ? "prime" : "not prime");
    return 0;
}`,
    samples: ['5', '9'], hidden: ['1', '2', '97'], minutes: 10 }),

  L({ archetype: 'triangle', topic: 'loops', title: 'Star Triangle',
    story: 'Build a right-aligned triangle from stars, n rows.',
    samples: ['4'], hidden: ['1', '7'], minutes: 6 }),
  L({ archetype: 'fibN', topic: 'loops', title: 'Fibonacci in C',
    story: 'The n-th Fibonacci number — watch for overflow with long long.',
    samples: ['5', '10'], hidden: ['0', '1', '25'], minutes: 8 }),
  Tr({ topic: 'loops', title: 'Trace: for-loop sum',
    code: 'int s = 0;\nfor (int i = 1; i < 5; i++) s += i;\nprintf("%d", s);',
    choices: ['15', '10', '4', '5'], answerIndex: 1,
    explain: 'i runs 1,2,3,4; sum = 10. The condition i<5 stops at 4.' }),

  L({ archetype: 'maxIn', topic: 'arrays', title: 'Max of the Class',
    story: 'Find the highest score in a class of n students.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n42', '6\n-1 -5 -2 -9 -3 -7', '4\n10 10 10 10'], minutes: 6 }),
  L({ archetype: 'countEven', topic: 'arrays', title: 'Even Scouts',
    story: 'How many scores are even? Count them.',
    samples: ['5\n3 7 2 9 4'], hidden: ['4\n2 4 6 8', '2\n1 3', '1\n0'], minutes: 6 }),
  L({ archetype: 'reverseList', topic: 'arrays', title: 'Reverse the Row',
    story: 'Print the array backwards.',
    samples: ['4\n1 2 3 4'], hidden: ['1\n9', '5\n-1 0 5 6 -2'], minutes: 6 }),
  Tr({ topic: 'arrays', title: 'Trace: array indexing',
    code: 'int a[4] = {10, 20, 30, 40};\nprintf("%d", a[1]);',
    choices: ['10', '20', '30', '40'], answerIndex: 1,
    explain: 'Indexes start at 0, so a[1] is the second element: 20.' }),

  L({ archetype: 'vowel', topic: 'strings', title: 'Vowel Count',
    story: 'Count vowels in a word (watch uppercase!).',
    samples: ['hello'], hidden: ['python', 'AEIOU', 'xyz', 'programming'], minutes: 6 }),
  L({ archetype: 'isPalindrome', topic: 'strings', title: 'Palindrome in C',
    story: 'Is racecar the same backwards? yes. coding? no.',
    samples: ['racecar'], hidden: ['level', 'python', 'a', 'abba'], minutes: 6 }),
  Fx({ archetype: 'vowel', topic: 'strings', title: 'Fix: vowel counter',
    story: 'Two bugs hide here. One misses capital letters.',
    buggy: `#include <stdio.h>

int main() {
    char s[100];
    int c = 0;
    scanf("%s", s);
    for (int i = 0; i < 100; i++)
        if (s[i] == 'a' || s[i] == 'e' || s[i] == 'i' || s[i] == 'o' || s[i] == 'u')
            c++;
    printf("%d\\n", c - 1);
    return 0;
}`,
    bugs: ['loop reads past the string end', 'uppercase vowels are skipped', 'a mysterious -1'],
    solution: `#include <stdio.h>

int main() {
    char s[100];
    int c = 0;
    scanf("%s", s);
    for (int i = 0; s[i]; i++) {
        char ch = s[i];
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ||
            ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U') c++;
    }
    printf("%d\\n", c);
    return 0;
}`,
    samples: ['hello'], hidden: ['AEIOU', 'Python', 'xyz'], minutes: 10 }),

  L({ archetype: 'binarySearch', topic: 'advanced', title: 'Binary Search',
    story: 'Index of q in sorted array. Halve it every step.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '5\n1 3 5 7 9\n1', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1'],
    complexity: 'O(log n)', minutes: 10, diff: 'medium' }),
  L({ archetype: 'twoSum', topic: 'advanced', title: 'Boss: Two Sum',
    story: 'GRAND CHALLENGE: print the indexes of two numbers summing to t.',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'hard', minutes: 15, xp: 30, boss: true, limitMs: 2000 }),
  Tr({ topic: 'variables', title: 'Trace: pointer arithmetic',
    code: "int arr[] = {10, 20, 30, 40};\\nint *p = arr;\\nprintf('%d %d', *p, *(p + 2));",
    choices: ["10 30", "10 20", "20 30", "10 40"], answerIndex: 0,
    explain: "*p is arr[0] (10). *(p + 2) shifts two elements ahead to arr[2] (30)." }),
]