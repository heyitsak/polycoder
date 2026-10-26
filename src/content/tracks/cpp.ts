import { level, traceLevel, fixLevel } from '../factory'
import type { Level } from '../../types'

const lang = 'cpp' as const
const samples = ['']
const L = (o: any) => level({ lang, ...o })
const Tr = (o: any) => traceLevel({ lang: 'cpp', ...o })
const Fx = (o: any) => fixLevel({ lang, ...o })

export const cppLevels: Level[] = [
  L({ archetype: 'hello', topic: 'foundations', title: 'Hello, Coder!',
    story: 'cout enters the arena. Print your first line.',
    samples: samples, hidden: [''] }),
  L({ archetype: 'sum2', topic: 'foundations', title: 'Add Two Numbers',
    story: 'Read a and b, print their sum.',
    samples: ['5 7', '100 250'], hidden: ['0 0', '-5 9', '999999 1'] }),
  Tr({ topic: 'foundations', title: 'Trace: operator order',
    code: 'int a = 4, b = 2;\ncout << a + b * 3;',
    choices: ['18', '10', '12', '24'], answerIndex: 1,
    explain: '* binds before +: 2*3=6, then 4+6=10.' }),

  L({ archetype: 'sum1toN', topic: 'variables', title: 'Sum 1..n',
    story: 'Sum all integers from 1 to n.',
    samples: ['5', '10'], hidden: ['1', '100', '0', '1000'], minutes: 6 }),
  L({ archetype: 'evenOdd', topic: 'variables', title: 'Even or Odd?',
    story: 'Module operator % decides parity.',
    samples: ['4'], hidden: ['0', '7', '-3', '100000'] }),
  Tr({ topic: 'variables', title: 'Trace: temp swap',
    code: 'int a = 5, b = 10, t;\nt = a; a = b; b = t;\ncout << a << " " << b;',
    choices: ['5 10', '10 5', '10 10', '5 5'], answerIndex: 1,
    explain: 'The temp holds 5 while b travels to a; then 5 travels to b.' }),

  L({ archetype: 'isPrime', topic: 'conditions', title: 'Prime Test',
    story: 'Check primality by testing divisors up to the square root.',
    samples: ['7', '10'], hidden: ['2', '1', '0', '97', '1000000'], minutes: 8 }),
  L({ archetype: 'fizzbuzz', topic: 'conditions', title: 'FizzBuzz',
    story: 'The mutable classic. 15 is the magic number.',
    samples: ['15'], hidden: ['1', '3', '5', '20'], minutes: 8 }),
  Fx({ archetype: 'isPrime', topic: 'conditions', title: 'Fix: broken prime test',
    story: 'Three logical bugs make primes look fake.',
    buggy: `#include <iostream>
using namespace std;

int main() {
    int n, ok = 1;
    cin >> n;
    if (n == 1) ok = 1;
    for (int d = 2; d < n; d++)
        if (n % d == 0) ok = 0;
    cout << (ok ? "prime" : "not prime") << endl;
    return 0;
}`,
    bugs: ['n=1 must not be prime', 'loop should stop at sqrt(n)', 'break after first divisor'],
    solution: `#include <iostream>
using namespace std;

int main() {
    int n, ok = 1;
    cin >> n;
    if (n < 2) ok = 0;
    for (int d = 2; ok && d * d <= n; d++)
        if (n % d == 0) ok = 0;
    cout << (ok ? "prime" : "not prime") << endl;
    return 0;
}`,
    samples: ['5', '10'], hidden: ['1', '2', '97'], minutes: 10 }),

  L({ archetype: 'triangle', topic: 'loops', title: 'Star Triangle',
    story: 'Print n rows of stars growing by one each.',
    samples: ['4'], hidden: ['1', '7'], minutes: 6 }),
  L({ archetype: 'fibN', topic: 'loops', title: 'Fibonacci',
    story: 'Print the n-th Fibonacci number with long long.',
    samples: ['5', '10'], hidden: ['0', '1', '25'], minutes: 8 }),
  Tr({ topic: 'loops', title: 'Trace: loop sum',
    code: 'int s = 0;\nfor (int i = 1; i < 5; i++) s += i;\ncout << s;',
    choices: ['15', '10', '4', '5'], answerIndex: 1,
    explain: 'i = 1,2,3,4 => sum 10.' }),

  L({ archetype: 'maxIn', topic: 'arrays', title: 'Biggest Score',
    story: 'Find the maximum of the list.',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n42', '6\n-1 -5 -2 -9 -3 -7', '4\n10 10 10 10'], minutes: 6 }),
  L({ archetype: 'countEven', topic: 'arrays', title: 'Count Even',
    story: 'How many entries are even?',
    samples: ['5\n3 7 2 9 4'], hidden: ['1\n1', '4\n2 4 6 8', '3\n1 3 5'], minutes: 6 }),
  L({ archetype: 'reverseList', topic: 'arrays', title: 'Reverse',
    story: 'Print the vector backwards.',
    samples: ['4\n1 2 3 4'], hidden: ['1\n9', '5\n-1 0 5 6 -2'], minutes: 6 }),
  Tr({ topic: 'arrays', title: 'Trace: vector index',
    code: 'vector<int> a = {10, 20, 30};\ncout << a[2];',
    choices: ['20', '30', '10', 'error'], answerIndex: 1,
    explain: 'Index 2 is the third element: 30.' }),

  L({ archetype: 'vowel', topic: 'strings', title: 'Vowel Counter',
    story: 'Count vowels, case-insensitive.',
    samples: ['hello'], hidden: ['python', 'AEIOU', 'xyz', 'programming'], minutes: 6 }),
  L({ archetype: 'isPalindrome', topic: 'strings', title: 'Palindrome',
    story: 'Same forwards and backwards?',
    samples: ['racecar'], hidden: ['level', 'python', 'a', 'abba'], minutes: 6 }),
  Fx({ archetype: 'vowel', topic: 'strings', title: 'Fix: vowel counter',
    story: 'It misses capitals and counts past the string.',
    buggy: `#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;
    int c = 0;
    for (int i = 0; i < s.size() - 1; i++) {
        char ch = s[i];
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') c++;
    }
    cout << c << endl;
    return 0;
}`,
    bugs: ['uppercase vowels omitted', 'loop runs to size()-1, skipping the last char'],
    solution: `#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;
    int c = 0;
    for (int i = 0; i < s.size(); i++) {
        char ch = s[i];
        if (string("aeiouAEIOU").find(ch) != string::npos) c++;
    }
    cout << c << endl;
    return 0;
}`,
    samples: ['hello'], hidden: ['AEIOU', 'Python', 'xyz'], minutes: 10 }),

  L({ archetype: 'binarySearch', topic: 'advanced', title: 'Binary Search',
    story: 'Find q in a sorted vector. Halve it each step.',
    samples: ['5\n1 3 5 7 9\n7', '5\n1 3 5 7 9\n4'],
    hidden: ['1\n5\n5', '5\n1 3 5 7 9\n1', '6\n10 20 30 40 50 60\n60', '3\n2 4 6\n1'],
    complexity: 'O(log n)', minutes: 10, diff: 'medium' }),
  L({ archetype: 'twoSum', topic: 'advanced', title: 'Boss: Two Sum',
    story: 'GRAND CHALLENGE: indexes of two numbers that sum to t.',
    samples: ['4\n2 7 11 15\n9'], hidden: ['3\n3 2 4\n6', '2\n3 3\n6', '5\n1 2 3 4 5\n10', '4\n-1 0 1 2\n0'],
    diff: 'hard', minutes: 15, xp: 30, boss: true, limitMs: 2000 }),
  Tr({ topic: 'variables', title: 'Trace: pass by reference',
    code: "void inc(int &n) { n += 5; }\\nint main() {\\n    int x = 10;\\n    inc(x);\\n    cout << x << endl;\\n}",
    choices: ["15", "10", "5", "0"], answerIndex: 0,
    explain: "Because int &n is a reference parameter, changes directly affect the caller argument x." }),
  Tr({ topic: 'variables', title: 'Trace: pointer dereferencing',
    code: "int a = 42;\\nint *p = &a;\\n*p = 100;\\ncout << a << endl;",
    choices: ["100", "42", "0", "Memory address"], answerIndex: 0,
    explain: "*p dereferences pointer p and mutates the memory location of a to 100." }),
  Tr({ topic: 'arrays', title: 'Trace: std::vector dynamic resizing',
    code: "vector<int> v = {1, 2, 3};\\nv.push_back(4);\\nv.pop_back();\\ncout << v.size() << ' ' << v.back();",
    choices: ["3 3", "4 4", "3 4", "4 3"], answerIndex: 0,
    explain: "push_back(4) makes size 4, pop_back() removes 4 returning size to 3. v.back() is now 3." }),
  Tr({ topic: 'foundations', title: 'Trace: integer division truncation',
    code: "int a = 7, b = 2;\\ncout << a / b << ' ' << a % b;",
    choices: ["3 1", "3.5 1", "3 0", "4 1"], answerIndex: 0,
    explain: "Integer division truncates decimals toward zero: 7 / 2 = 3. 7 % 2 remainder is 1." }),
  Tr({ topic: 'loops', title: 'Trace: pre vs post increment',
    code: "int a = 5, b = 5;\\nint x = ++a;\\nint y = b++;\\ncout << x << ' ' << y;",
    choices: ["6 5", "6 6", "5 5", "5 6"], answerIndex: 0,
    explain: "++a increments then yields 6. b++ yields current value 5 then increments." }),
  Tr({ topic: 'conditions', title: 'Trace: switch case fallthrough',
    code: "int n = 2, score = 0;\\nswitch(n) {\\n    case 1: score += 10; break;\\n    case 2: score += 20;\\n    case 3: score += 30; break;\\n    default: score += 5;\\n}\\ncout << score;",
    choices: ["50", "20", "30", "55"], answerIndex: 0,
    explain: "case 2 matches (+20) and falls through to case 3 (+30) because there is no break after case 2. Total is 50." }),
  Tr({ topic: 'strings', title: 'Trace: string substr indexing',
    code: "string s = 'HelloCpp';\\ncout << s.substr(5, 3);",
    choices: ["Cpp", "loC", "Hello", "Cpp0"], answerIndex: 0,
    explain: "substr(start, length): start index 5 is 'C', taking 3 characters yields 'Cpp'." }),
  Tr({ topic: 'advanced', title: 'Trace: std::pair access',
    code: "pair<int, string> p = {404, 'Not Found'};\\ncout << p.first << ': ' << p.second;",
    choices: ["404: Not Found", "Not Found: 404", "404", "Error"], answerIndex: 0,
    explain: "p.first accesses the integer member 404 and p.second accesses the string member 'Not Found'." }),
  Tr({ topic: 'arrays', title: 'Trace: vector auto range-for',
    code: "vector<int> v = {2, 3, 5};\\nint p = 1;\\nfor (int x : v) p *= x;\\ncout << p;",
    choices: ["30", "10", "25", "1"], answerIndex: 0,
    explain: "p accumulates product: 1 * 2 * 3 * 5 = 30." }),
  Tr({ topic: 'advanced', title: 'Trace: ternary nested evaluation',
    code: "int x = 12;\\nint res = (x > 20) ? 1 : (x > 10) ? 2 : 3;\\ncout << res;",
    choices: ["2", "1", "3", "0"], answerIndex: 0,
    explain: "x > 20 is false, so it checks (x > 10) which is true (12 > 10), yielding 2." }),
]