import { level, traceLevel, fixLevel } from '../factory'
import type { Level } from '../../types'

const lang = 'java' as const
const samples = ['']
const L = (o: any) => level({ lang, ...o })
const Tr = (o: any) => traceLevel({ lang: 'java', ...o })
const Fx = (o: any) => fixLevel({ lang, ...o })

export const javaLevels: Level[] = [
  L({ archetype: 'hello', topic: 'foundations', title: 'Hello, Coder!',
    story: 'First Java program inside the Main class.',
    samples: samples, hidden: [''] }),
  L({ archetype: 'sum2', topic: 'foundations', title: 'Sum Two Ints',
    story: 'Scanner + System.out. The Java way.',
    samples: ['5 7', '100 250'], hidden: ['0 0', '-5 9', '999999 1'] }),
  Tr({ topic: 'foundations', title: 'Trace: operator order',
    code: 'int a = 4, b = 2;\nSystem.out.println(a + b * 3);',
    choices: ['18', '10', '12', '24'], answerIndex: 1,
    explain: 'Multiply first: 2*3=6, then 4+6=10.' }),

  L({ archetype: 'sum1toN', topic: 'variables', title: 'Sum 1..n',
    story: 'Gauss would be proud. 1+2+...+n.',
    samples: ['5', '10'], hidden: ['1', '100', '0', '1000'], minutes: 6 }),
  L({ archetype: 'evenOdd', topic: 'variables', title: 'Even or Odd',
    story: 'The % operator decides parity.',
    samples: ['4'], hidden: ['0', '7', '-3', '100000'] }),
  Tr({ topic: 'variables', title: 'Trace: temp swap',
    code: 'int a = 5, b = 10, t;\nt = a; a = b; b = t;\nSystem.out.println(a + " " + b);',
    choices: ['5 10', '10 5', '10 10', '5 5'], answerIndex: 1,
    explain: 'The temp holds 5; b travels into a; 5 travels into b.' }),

  L({ archetype: 'isPrime', topic: 'conditions', title: 'Prime Checker',
    story: 'Divisibility test up to the square root.',
    samples: ['7', '10'], hidden: ['2', '1', '0', '97', '1000000'], minutes: 8 }),
  L({ archetype: 'fizzbuzz', topic: 'conditions', title: 'FizzBuzz',
    story: 'Good manners: say Fizz / Buzz / FizzBuzz.',
    samples: ['15'], hidden: ['1', '3', '5', '20'], minutes: 8 }),
  Fx({ archetype: 'isPrime', topic: 'conditions', title: 'Fix: prime test',
    story: 'A colleague\'s prime checker lies about 1s and primes.',
    buggy: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean ok = true;
        if (n == 1) ok = true;
        for (int d = 2; d < n; d++)
            if (n % d == 0) ok = false;
        System.out.println(ok ? "prime" : "not prime");
    }
}`,
    bugs: ['n=1 wrongly reported prime', 'loop should stop at sqrt(n)', 'break after a divisor is found'],
    solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 2) { System.out.println("not prime"); return; }
        boolean ok = true;
        for (int d = 2; d * d <= n; d++)
            if (n % d == 0) { ok = false; break; }
        System.out.println(ok ? "prime" : "not prime");
    }
}`,
    hidden: ['1', '2', '97'], minutes: 10 }),

  L({ archetype: 'triangle', topic: 'loops', title: 'Star Triangle',
    story: 'Print n rows of stars via nested loops.',
    samples: ['4'], hidden: ['1', '7'], minutes: 6 }),
  L({ archetype: 'fibN', topic: 'loops', title: 'Fibonacci',
    story: 'n-th Fibonacci using long to avoid overflow.',
    samples: ['5', '10'], hidden: ['0', '1', '25'], minutes: 8 }),
  Tr({ topic: 'loops', title: 'Trace: loop sum',
    code: 'int s = 0;\nfor (int i = 1; i < 5; i++) s += i;\nSystem.out.println(s);',
    choices: ['15', '10', '4', '5'], answerIndex: 1,
    explain: 'i = 1,2,3,4 => sum 10.' }),

  L({ archetype: 'maxIn', topic: 'arrays', title: 'Max in Array',
    story: 'Scan an int[] for the greatest value.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n42', '6\n-1 -5 -2 -9 -3 -7', '4\n10 10 10 10'], minutes: 6 }),
  L({ archetype: 'countEven', topic: 'arrays', title: 'Count Evens',
    story: 'Count how many are even.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n1', '4\n2 4 6 8', '3\n1 3 5'], minutes: 6 }),
  L({ archetype: 'reverseList', topic: 'arrays', title: 'Reverse Array',
    story: 'Print values from last to first.',
    samples: ['4\n1 2 3 4'], hidden: ['1\n9', '5\n-1 0 5 6 -2'], minutes: 6 }),
  Tr({ topic: 'arrays', title: 'Trace: array index',
    code: 'int[] a = {10, 20, 30};\nSystem.out.println(a[2]);',
    choices: ['20', '30', '10', 'error'], answerIndex: 1,
    explain: 'Index 2 is the third element: 30.' }),

  L({ archetype: 'vowel', topic: 'strings', title: 'Vowel Count',
    story: 'Count vowels including capitals.',
    samples: ['hello'], hidden: ['python', 'AEIOU', 'xyz', 'programming'], minutes: 6 }),
  L({ archetype: 'isPalindrome', topic: 'strings', title: 'Palindrome',
    story: 'Use StringBuilder.reverse() for a one-liner.',
    samples: ['racecar'], hidden: ['level', 'python', 'a', 'abba'], minutes: 6 }),
  Fx({ archetype: 'vowel', topic: 'strings', title: 'Fix: vowel counter',
    story: 'Misses capitals and the last character.',
    buggy: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int c = 0;
        for (int i = 0; i < s.length() - 1; i++) {
            if ("aeiou".indexOf(s.charAt(i)) >= 0) c++;
        }
        System.out.println(c);
    }
}`,
    bugs: ['lower-case check only', 'loop ends one early'],
    solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int c = 0;
        for (int i = 0; i < s.length(); i++) {
            if ("aeiouAEIOU".indexOf(s.charAt(i)) >= 0) c++;
        }
        System.out.println(c);
    }
}`,
    samples: ['hello'], hidden: ['AEIOU', 'Python', 'xyz'], minutes: 10 }),

  L({ archetype: 'binarySearch', topic: 'advanced', title: 'Binary Search',
    story: 'Find q in a sorted array — halves each step.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '5\n1 3 5 7 9\n1', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1'],
    complexity: 'O(log n)', minutes: 10, diff: 'medium' }),
  L({ archetype: 'twoSum', topic: 'advanced', title: 'Boss: Two Sum',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'hard', minutes: 15, xp: 30, boss: true, limitMs: 2000 }),
  Tr({ topic: 'strings', title: 'Trace: string pool equality',
    code: "String s1 = 'java';\\nString s2 = 'java';\\nString s3 = new String('java');\\nSystem.out.println((s1 == s2) + ' ' + (s1 == s3));",
    choices: ["true false", "true true", "false false", "false true"], answerIndex: 0,
    explain: "s1 and s2 refer to the same literal in the String pool (== true). s3 is a new heap object (== false)." }),
  Tr({ topic: 'arrays', title: 'Trace: array length attribute',
    code: "int[] arr = new int[4];\\nString s = 'code';\\nSystem.out.println(arr.length + ' ' + s.length());",
    choices: ["4 4", "4 5", "3 4", "3 3"], answerIndex: 0,
    explain: "Java arrays use the .length property, while String uses the .length() method. Both are 4." }),
]