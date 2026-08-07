import type { Template } from '../lib'

type B = (p: any) => Template

function w(solution: string, skeleton?: string): Template {
  return { starter: skeleton ?? solution, solution }
}

const nArr = `        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
`
const MAIN = `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
`

export const javaSnips: Record<string, B> = {
  hello: () => w(`import java.util.*;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Coder!");
    }
}`),

  sum2: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
    `${MAIN}        int a = sc.nextInt(), b = sc.nextInt();
        // TODO: print a + b
    }
}`,
  ),

  sum1toN: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) sum += i;
        System.out.println(sum);
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print the sum 1 + 2 + ... + n
    }
}`,
  ),

  maxIn: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        int m = arr[0];
        for (int v : arr) if (v > m) m = v;
        System.out.println(m);
    }
}`,
    `${MAIN}${nArr}        // TODO: print the largest value in arr
    }
}`,
  ),

  minIn: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        int m = arr[0];
        for (int v : arr) if (v < m) m = v;
        System.out.println(m);
    }
}`,
    `${MAIN}${nArr}        // TODO: print the smallest value in arr
    }
}`,
  ),

  countEven: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        int c = 0;
        for (int v : arr) if (v % 2 == 0) c++;
        System.out.println(c);
    }
}`,
    `${MAIN}${nArr}        // TODO: print how many values in arr are even
    }
}`,
  ),

  reverseList: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        StringBuilder sb = new StringBuilder();
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) sb.append(' ');
            sb.append(arr[i]);
        }
        System.out.println(sb);
    }
}`,
    `${MAIN}${nArr}        // TODO: print arr in reverse order, space-separated
    }
}`,
  ),

  vowel: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int c = 0;
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if ("aeiouAEIOU".indexOf(ch) >= 0) c++;
        }
        System.out.println(c);
    }
}`,
    `${MAIN}        String s = sc.next();
        // TODO: print the number of vowels (a, e, i, o, u) in s
    }
}`,
  ),

  isPalindrome: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println(s.equals(rev) ? "yes" : "no");
    }
}`,
    `${MAIN}        String s = sc.next();
        // TODO: print "yes" if s reads the same backwards, else "no"
    }
}`,
  ),

  fibN: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) { long c = a + b; a = b; b = c; }
        System.out.println(a);
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print the n-th Fibonacci number (0, 1, 1, 2, 3, ...)
    }
}`,
  ),

  isPrime: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 2) { System.out.println("not prime"); return; }
        boolean ok = true;
        for (int d = 2; d * d <= n; d++) if (n % d == 0) { ok = false; break; }
        System.out.println(ok ? "prime" : "not prime");
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print "prime" if n is prime, else "not prime"
    }
}`,
  ),

  fizzbuzz: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: for each i in 1..n print FizzBuzz / Fizz / Buzz / i
    }
}`,
  ),

  timesTable: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= 10; i++) System.out.println(n + " x " + i + " = " + n * i);
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print the 1..10 times table for n
    }
}`,
  ),

  triangle: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print n rows of stars (a right triangle)
    }
}`,
  ),

  evenOdd: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n % 2 == 0 ? "even" : "odd");
    }
}`,
    `${MAIN}        int n = sc.nextInt();
        // TODO: print "even" or "odd"
    }
}`,
  ),

  binarySearch: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        int q = sc.nextInt();
        int lo = 0, hi = n - 1, ans = -1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] == q) { ans = mid; break; }
            if (arr[mid] < q) lo = mid + 1; else hi = mid - 1;
        }
        System.out.println(ans);
    }
}`,
    `${MAIN}${nArr}        int q = sc.nextInt();
        // TODO: binary search arr for q, print its index or -1
    }
}`,
  ),

  twoSum: () => w(
    `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${nArr}        int t = sc.nextInt();
        boolean found = false;
        for (int i = 0; i < n && !found; i++) {
            for (int j = i + 1; j < n && !found; j++) {
                if (arr[i] + arr[j] == t) {
                    System.out.println(i + " " + j);
                    found = true;
                }
            }
        }
        if (!found) System.out.println("-1");
    }
}`,
    `${MAIN}${nArr}        int t = sc.nextInt();
        // TODO: find i < j with arr[i] + arr[j] == t, print "i j" or -1
    }
}`,
  ),
}