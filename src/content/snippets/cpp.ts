import type { Template } from '../lib'

type B = (p: any) => Template

function w(program: string): Template {
  return {
    starter: program.replace('//__SOLVE__', '    // TODO: solve it!'),
    solution: program,
  }
}

const nArr = `    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
`

export const cppSnips: Record<string, B> = {
  hello: () => w(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Coder!" << endl;
    return 0;
}`),

  sum2: () => w(`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`),

  sum1toN: () => w(`#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) sum += i;
    cout << sum << endl;
    return 0;
}`),

  maxIn: () => w(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
${nArr}    int m = arr[0];
    for (int v : arr) if (v > m) m = v;
    cout << m << endl;
    return 0;
}`),

  minIn: () => w(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
${nArr}    int m = arr[0];
    for (int v : arr) if (v < m) m = v;
    cout << m << endl;
    return 0;
}`),

  countEven: () => w(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, c = 0;
    cin >> n;
${nArr}    for (int v : arr) if (v % 2 == 0) c++;
    cout << c << endl;
    return 0;
}`),

  reverseList: () => w(`#include <iostream>
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
}`),

  vowel: () => w(`#include <iostream>
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
}`),

  isPalindrome: () => w(`#include <iostream>
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
}`),

  fibN: () => w(`#include <iostream>
using namespace std;

int main() {
    int n;
    long long a = 0, b = 1;
    cin >> n;
    for (int i = 0; i < n; i++) { long long c = a + b; a = b; b = c; }
    cout << a << endl;
    return 0;
}`),

  isPrime: () => w(`#include <iostream>
using namespace std;

int main() {
    int n, ok = 1;
    cin >> n;
    if (n < 2) ok = 0;
    for (int d = 2; ok && d * d <= n; d++)
        if (n % d == 0) ok = 0;
    cout << (ok ? "prime" : "not prime") << endl;
    return 0;
}`),

  fizzbuzz: () => w(`#include <iostream>
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
}`),

  timesTable: () => w(`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 10; i++) cout << n << " x " << i << " = " << n * i << endl;
    return 0;
}`),

  triangle: () => w(`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) cout << "*";
        cout << endl;
    }
    return 0;
}`),

  evenOdd: () => w(`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << (n % 2 == 0 ? "even" : "odd") << endl;
    return 0;
}`),

  binarySearch: () => w(`#include <iostream>
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
}`),

  twoSum: () => w(`#include <iostream>
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
}`),
}