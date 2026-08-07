import type { Template } from '../lib'

type B = (p: any) => Template

function w(solution: string, skeleton?: string): Template {
  return { starter: skeleton ?? solution, solution }
}

const nArr = `    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
`
const MAIN = `#include <iostream>
using namespace std;

int main() {
`
const END = `    return 0;
}`

export const cppSnips: Record<string, B> = {
  hello: () => w(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Coder!" << endl;
    return 0;
}`),

  sum2: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    `${MAIN}    int a, b;
    cin >> a >> b;
    // TODO: print a + b
${END}`,
  ),

  sum1toN: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) sum += i;
    cout << sum << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: print the sum 1 + 2 + ... + n
${END}`,
  ),

  maxIn: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
${nArr}    int m = arr[0];
    for (int v : arr) if (v > m) m = v;
    cout << m << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
${nArr}    // TODO: print the largest value in arr
${END}`,
  ),

  minIn: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
${nArr}    int m = arr[0];
    for (int v : arr) if (v < m) m = v;
    cout << m << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
${nArr}    // TODO: print the smallest value in arr
${END}`,
  ),

  countEven: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, c = 0;
    cin >> n;
${nArr}    for (int v : arr) if (v % 2 == 0) c++;
    cout << c << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
${nArr}    // TODO: print how many values in arr are even
${END}`,
  ),

  reverseList: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
${nArr}    for (int i = n - 1; i >= 0; i--) {
        if (i < n - 1) cout << " ";
        cout << arr[i];
    }
    cout << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
${nArr}    // TODO: print arr in reverse order, space-separated
${END}`,
  ),

  vowel: () => w(
    `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int c = 0;
    for (char ch : s)
        if (string("aeiouAEIOU").find(ch) != string::npos) c++;
    cout << c << endl;
    return 0;
}`,
    `${MAIN}    string s;
    cin >> s;
    // TODO: print the number of vowels (a, e, i, o, u) in s
${END}`,
  ),

  isPalindrome: () => w(
    `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int n = s.size(), ok = 1;
    for (int i = 0; i < n / 2; i++)
        if (s[i] != s[n - 1 - i]) { ok = 0; break; }
    cout << (ok ? "yes" : "no") << endl;
    return 0;
}`,
    `${MAIN}    string s;
    cin >> s;
    // TODO: print "yes" if s reads the same backwards, else "no"
${END}`,
  ),

  fibN: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n;
    long long a = 0, b = 1;
    cin >> n;
    for (int i = 0; i < n; i++) { long long c = a + b; a = b; b = c; }
    cout << a << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: print the n-th Fibonacci number (0, 1, 1, 2, 3, ...)
${END}`,
  ),

  isPrime: () => w(
    `#include <iostream>
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
    `${MAIN}    int n;
    cin >> n;
    // TODO: print "prime" if n is prime, else "not prime"
${END}`,
  ),

  fizzbuzz: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) cout << "FizzBuzz" << endl;
        else if (i % 3 == 0) cout << "Fizz" << endl;
        else if (i % 5 == 0) cout << "Buzz" << endl;
        else cout << i << endl;
    }
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: for each i in 1..n print FizzBuzz / Fizz / Buzz / i
${END}`,
  ),

  timesTable: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 10; i++) cout << n << " x " << i << " = " << n * i << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: print the 1..10 times table for n
${END}`,
  ),

  triangle: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) cout << "*";
        cout << endl;
    }
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: print n rows of stars (a right triangle)
${END}`,
  ),

  evenOdd: () => w(
    `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << (n % 2 == 0 ? "even" : "odd") << endl;
    return 0;
}`,
    `${MAIN}    int n;
    cin >> n;
    // TODO: print "even" or "odd"
${END}`,
  ),

  binarySearch: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, q;
    cin >> n;
${nArr}    cin >> q;
    int lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == q) { ans = mid; break; }
        if (arr[mid] < q) lo = mid + 1; else hi = mid - 1;
    }
    cout << ans << endl;
    return 0;
}`,
    `${MAIN}    int n, q;
    cin >> n;
${nArr}    cin >> q;
    // TODO: binary search arr for q, print its index or -1
${END}`,
  ),

  twoSum: () => w(
    `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, t, found = 0;
    cin >> n;
${nArr}    cin >> t;
    for (int i = 0; i < n && !found; i++)
        for (int j = i + 1; j < n && !found; j++)
            if (arr[i] + arr[j] == t) {
                cout << i << " " << j << endl;
                found = 1;
            }
    if (!found) cout << -1 << endl;
    return 0;
}`,
    `${MAIN}    int n, t, found = 0;
    cin >> n;
${nArr}    cin >> t;
    // TODO: find i < j with arr[i] + arr[j] == t, print "i j" or -1
${END}`,
  ),
}