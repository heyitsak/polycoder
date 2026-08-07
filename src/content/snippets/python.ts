import type { Template } from '../lib'

type B = (p: any) => Template

function w(program: string): Template {
  return { starter: program.replace('//__SOLVE__', '# TODO: solve it!'), solution: program }
}

const intRead = (arr = 'arr') => `n = int(input())\n${arr} = list(map(int, input().split()))\n`

export const pySnips: Record<string, B> = {
  hello: () => w(`print("Hello, Coder!")`),

  sum2: () => w(`a, b = map(int, input().split())
print(a + b)`),

  sum1toN: () => w(`n = int(input())
print(sum(range(1, n + 1)))`),

  maxIn: () => w(intRead() + `print(max(arr))`),
  minIn: () => w(intRead() + `print(min(arr))`),
  countEven: () => w(intRead() + `print(sum(1 for x in arr if x % 2 == 0))`),
  reverseList: () => w(intRead() + `print(' '.join(map(str, reversed(arr))))`),

  vowel: () => w(`s = input()
print(sum(1 for ch in s if ch in "aeiouAEIOU"))`),

  isPalindrome: () => w(`s = input()
print("yes" if s == s[::-1] else "no")`),

  fibN: () => w(`n = int(input())
a, b = 0, 1
for _ in range(n):
    a, b = b, a + b
print(a)`),

  isPrime: () => w(`n = int(input())
if n < 2:
    print("not prime")
else:
    ok = True
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            ok = False
            break
    print("prime" if ok else "not prime")`),

  fizzbuzz: () => w(`n = int(input())
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`),

  timesTable: () => w(`n = int(input())
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`),

  triangle: () => w(`n = int(input())
for i in range(1, n + 1):
    print("*" * i)`),

  evenOdd: () => w(`n = int(input())
print("even" if n % 2 == 0 else "odd")`),

  binarySearch: () => w(`def binary_search(a, q):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == q:
            return mid
        if a[mid] < q:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

n = int(input())
a = list(map(int, input().split()))
q = int(input())
print(binary_search(a, q))`),

  mergeSorted: () => w(`n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))
print(' '.join(map(str, sorted(a + b))))`),

  anagram: () => w(`s1 = input()
s2 = input()
print("yes" if sorted(s1) == sorted(s2) else "no")`),

  kadane: () => w(`n = int(input())
a = list(map(int, input().split()))
best = a[0]
cur = 0
for x in a:
    cur = max(x, cur + x)
    best = max(best, cur)
print(best)`),

  coins: () => w(`amt = int(input())
k = int(input())
coins = list(map(int, input().split()))
INF = float('inf')
dp = [INF] * (amt + 1)
dp[0] = 0
for i in range(1, amt + 1):
    for c in coins:
        if i >= c:
            dp[i] = min(dp[i], dp[i - c] + 1)
print(-1 if dp[amt] == INF else dp[amt])`),

  longest: () => w(`s = input()
seen = {}
best = 0
start = 0
for i, ch in enumerate(s):
    if ch in seen and seen[ch] >= start:
        start = seen[ch] + 1
    seen[ch] = i
    best = max(best, i - start + 1)
print(best)`),

  components: () => w(`n, m = map(int, input().split())
parent = list(range(n + 1))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
for _ in range(m):
    u, v = map(int, input().split())
    ru, rv = find(u), find(v)
    if ru != rv:
        parent[ru] = rv
roots = set(find(i) for i in range(1, n + 1))
print(len(roots))`),

  lcs: () => w(`s1 = input()
s2 = input()
dp = [[0] * (len(s2) + 1) for _ in range(len(s1) + 1)]
for i in range(1, len(s1) + 1):
    for j in range(1, len(s2) + 1):
        if s1[i - 1] == s2[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
print(dp[len(s1)][len(s2)])`),

  twoSum: () => w(`def two_sum(a, t):
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if a[i] + a[j] == t:
                return i, j
    return -1, -1

n = int(input())
a = list(map(int, input().split()))
t = int(input())
i, j = two_sum(a, t)
print("-1" if i == -1 else f"{i} {j}")`),
}