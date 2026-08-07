import type { Template } from '../lib'

type B = (p: any) => Template

function w(solution: string, skeleton?: string): Template {
  return { starter: skeleton ?? solution, solution }
}

const nArr = `    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
`
const MAIN = `#include <stdio.h>

int main() {
`
const END = `    return 0;
}`

export const cSnips: Record<string, B> = {
  hello: () => w(`#include <stdio.h>

int main() {
    printf("Hello, Coder!\\n");
    return 0;
}`),

  sum2: () => w(
    `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
    `${MAIN}    int a, b;
    scanf("%d %d", &a, &b);
    // TODO: print a + b
${END}`,
  ),

  sum1toN: () => w(
    `#include <stdio.h>

int main() {
    int n, sum = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) sum += i;
    printf("%d\\n", sum);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print the sum 1 + 2 + ... + n
${END}`,
  ),

  maxIn: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
${nArr}    int m = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > m) m = arr[i];
    printf("%d\\n", m);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
${nArr}    // TODO: print the largest value in arr
${END}`,
  ),

  minIn: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
${nArr}    int m = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] < m) m = arr[i];
    printf("%d\\n", m);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
${nArr}    // TODO: print the smallest value in arr
${END}`,
  ),

  countEven: () => w(
    `#include <stdio.h>

int main() {
    int n, c = 0;
    scanf("%d", &n);
${nArr}    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) c++;
    printf("%d\\n", c);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
${nArr}    // TODO: print how many values in arr are even
${END}`,
  ),

  reverseList: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
${nArr}    for (int i = n - 1; i >= 0; i--) {
        if (i < n - 1) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
${nArr}    // TODO: print arr in reverse order, space-separated
${END}`,
  ),

  vowel: () => w(
    `#include <stdio.h>

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
    `${MAIN}    char s[100];
    int c = 0;
    scanf("%s", s);
    // TODO: print the number of vowels (a, e, i, o, u) in s
${END}`,
  ),

  isPalindrome: () => w(
    `#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    int n = strlen(s), ok = 1;
    for (int i = 0; i < n / 2; i++)
        if (s[i] != s[n - 1 - i]) { ok = 0; break; }
    printf("%s\\n", ok ? "yes" : "no");
    return 0;
}`,
    `#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    // TODO: print "yes" if s reads the same backwards, else "no"
    return 0;
}`,
  ),

  fibN: () => w(
    `#include <stdio.h>

int main() {
    int n;
    long long a = 0, b = 1;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { long long c = a + b; a = b; b = c; }
    printf("%lld\\n", a);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print the n-th Fibonacci number (0, 1, 1, 2, 3, ...)
${END}`,
  ),

  isPrime: () => w(
    `#include <stdio.h>

int main() {
    int n, ok = 1;
    scanf("%d", &n);
    if (n < 2) ok = 0;
    for (int d = 2; ok && d * d <= n; d++)
        if (n % d == 0) ok = 0;
    printf("%s\\n", ok ? "prime" : "not prime");
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print "prime" if n is prime, else "not prime"
${END}`,
  ),

  fizzbuzz: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) printf("FizzBuzz\\n");
        else if (i % 3 == 0) printf("Fizz\\n");
        else if (i % 5 == 0) printf("Buzz\\n");
        else printf("%d\\n", i);
    }
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: for each i in 1..n print FizzBuzz / Fizz / Buzz / i
${END}`,
  ),

  timesTable: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= 10; i++) printf("%d x %d = %d\\n", n, i, n * i);
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print the 1..10 times table for n
${END}`,
  ),

  triangle: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) printf("*");
        printf("\\n");
    }
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print n rows of stars (a right triangle)
${END}`,
  ),

  evenOdd: () => w(
    `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%s\\n", n % 2 == 0 ? "even" : "odd");
    return 0;
}`,
    `${MAIN}    int n;
    scanf("%d", &n);
    // TODO: print "even" or "odd"
${END}`,
  ),

  binarySearch: () => w(
    `#include <stdio.h>

int main() {
    int n, q;
    scanf("%d", &n);
${nArr}    scanf("%d", &q);
    int lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == q) { ans = mid; break; }
        if (arr[mid] < q) lo = mid + 1; else hi = mid - 1;
    }
    printf("%d\\n", ans);
    return 0;
}`,
    `${MAIN}    int n, q;
    scanf("%d", &n);
${nArr}    scanf("%d", &q);
    // TODO: binary search arr for q, print its index or -1
${END}`,
  ),

  twoSum: () => w(
    `#include <stdio.h>

int main() {
    int n, t, found = 0;
    scanf("%d", &n);
${nArr}    scanf("%d", &t);
    for (int i = 0; i < n && !found; i++)
        for (int j = i + 1; j < n && !found; j++)
            if (arr[i] + arr[j] == t) {
                printf("%d %d\\n", i, j);
                found = 1;
            }
    if (!found) printf("-1\\n");
    return 0;
}`,
    `${MAIN}    int n, t, found = 0;
    scanf("%d", &n);
${nArr}    scanf("%d", &t);
    // TODO: find i < j with arr[i] + arr[j] == t, print "i j" or -1
${END}`,
  ),
}