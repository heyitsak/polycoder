export interface TranslateRule {
  pattern: string
  text: string
  fix: string
}

const SHARED: TranslateRule[] = [
  { pattern: 'syntax error', text: 'The compiler spotted a typo or misplaced symbol.', fix: 'Check the failing line (and the one above it): are you missing a ; or { } ( ) or " quotes?' },
  { pattern: 'expected', text: 'The parser expected one symbol but found a different one.', fix: 'Look for a missing ; { } ) ] and pairs of quotes that do not match.' },
  { pattern: 'undeclared identifier', text: 'You used a name that was never declared.', fix: 'Declare the variable with its type before using it (e.g. int x = 5;).' },
  { pattern: 'out of bounds', text: 'You tried to read past the end of an array/string/list.', fix: 'Indexes start at 0, so the last valid index is length-1. Check your loop boundary.' },
  { pattern: 'timeout', text: 'Your program did not finish in the allowed time.', fix: 'You likely have an infinite loop or an algorithm that is too slow. Trace your loop conditions.' },
]

const BY_LANG: Record<string, TranslateRule[]> = {
  c: [
    { pattern: 'implicit declaration', text: 'You called a function without declaring it first.', fix: 'Add the function prototype above main(), or #include the correct header.' },
    { pattern: 'segmentation fault', text: 'The program read/wrote memory it is not allowed to touch.', fix: 'Classic causes: NULL pointer, uninitialized pointer, or stepping past the end of an array.' },
    { pattern: 'conflicting types', text: 'A function/var was declared twice with different shapes.', fix: 'Only declare it once; keep the signature identical everywhere.' },
    { pattern: 'format', text: 'printf or scanf has a type mismatch.', fix: 'Use %d for int, %.1f for float/double, %c for char, %s for strings — and match the argument type.' },
  ],
  cpp: [
    { pattern: 'no matching function', text: 'There is no function overload that accepts those arguments.', fix: 'Check argument count and types; you may need to convert or include <string>/<vector>.' },
    { pattern: 'does not name a type', text: 'You referenced the a type/class from a header you did not include.', fix: 'Add #include or using declarations for std names.' },
    { pattern: 'segmentation fault', text: 'The program touched memory it must not.', fix: 'Check NULL pointers, vector indices, and dereferenced iterators.' },
  ],
  java: [
    { pattern: 'cannot find symbol', text: 'Used a variable or method that does not exist in scope.', fix: 'Check spelling, scope, and that you passed the right arguments.' },
    { pattern: 'incompatible types', text: 'Two values of different types were mixed.', fix: 'Cast with (int), or read the right type with nextInt()/nextDouble().' },
    { pattern: 'possible lossy conversion', text: 'You assigned a double into an int.', fix: 'Use an int expression or cast: (int) value.' },
    { pattern: 'Exception in thread', text: 'The program threw a runtime error.', fix: 'The very next line tells you which (ArrayIndexOutOfBounds, NumberFormatException...).' },
    { pattern: 'ArrayIndexOutOfBounds', text: 'An index went past the array end.', fix: 'Valid indexes are 0..length-1. Check the boundary against arr.length.' },
    { pattern: 'NumberFormatException', text: 'You tried to parse text that is not a number.', fix: 'Ensure the input has no extra characters or empty lines before parsing.' },
    { pattern: 'needs to be static', text: 'A method you call without an object must be marked static.', fix: 'Add the static keyword to methods you call directly from main.' },
  ],
  java_a: [],
  python: [
    { pattern: 'nameerror', text: 'A variable name is not defined yet.', fix: 'Check spelling — Python is case sensitive. Assign the variable before using it.' },
    { pattern: 'indentationerror', text: 'Python block indentation is wrong.', fix: 'Use 4 spaces consistently inside each block; never mix tabs and spaces.' },
    { pattern: 'typeerror', text: 'You performed an operation between incompatible types.', fix: 'e.g. you tried to + a string and a number, or call a non-function. Convert with int() / str().' },
    { pattern: 'valueerror', text: 'A value has the right type but an illegal value.', fix: 'e.g. int(\"abc\") — the string is not a number.' },
    { pattern: 'zerodivisionerror', text: 'You divided by zero.', fix: 'Guard the division: check the denominator first.' },
    { pattern: 'keyerror', text: 'The key does not exist in the dictionary.', fix: 'Check membership with in or use .get(key).' },
    { pattern: 'attributeerror', text: 'You called something that this object does not have.', fix: 'A string has .upper(), a list has .append(). Mixing them breaks.' },
    { pattern: 'indexerror', text: 'List index is outside the list.', fix: 'Valid indexes are 0..len(list)-1; also watch negative slicing.' },
  ],
  javascript: [
    { pattern: 'referenceerror', text: 'A variable or function name is not defined.', fix: 'Check spelling + that you declared it with let/const before use.' },
    { pattern: 'is not a function', text: 'You called something that is not callable.', fix: 'typeof value is not a function — check the name and that it is defined.' },
    { pattern: 'cannot read properties of undefined', text: 'You accessed a property on undefined/null.', fix: 'Check whether the value was set, and the array index exists.' },
    { pattern: 'maximum call stack', text: 'Infinite recursion overfilled the stack.', fix: 'Add a base case that stops recursion.' },
    { pattern: 'nan', text: 'A number operation produced NaN (Not a Number).', fix: 'e.g. multiplying a string — convert with Number(...) first.' },
  ],
  sql: [
    { pattern: 'no such column', text: 'That column does not exist in this table.', fix: 'Check the column names in the CREATE TABLE statement — spelling and case matter.' },
    { pattern: 'no such table', text: 'That table was not created.', fix: 'Check the schema: tables are created in the setup.' },
    { pattern: 'near', text: 'SQL syntax error near that keyword.', fix: 'Order matters: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ...' },
  ],
}

export function translateError(lang: string, msg: string): { text: string; fix: string }[] {
  const rules = [...SHARED, ...(BY_LANG[lang] ?? []), ...(BY_LANG.base ?? [])]
  const out: { text: string; fix: string }[] = []
  for (const r of rules) {
    if (msg.toLowerCase().includes(r.pattern.toLowerCase())) {
      out.push({ text: r.text, fix: r.fix })
    }
  }
  if (out.length === 0) {
    out.push({
      text: 'The runner rejected your code — usually a compilation error or a crash.',
      fix: 'Copy the error into a search engine, then compare with what the error line really does.',
    })
  }
  return dedupe(out)
}

function dedupe(rs: { text: string; fix: string }[]) {
  const seen = new Set<string>()
  return rs.filter(r => {
    const k = r.text
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}