<div class="hero" markdown>
<span class="eyebrow">Check yourself</span>
# Twelve questions on Python fundamentals
<p class="lede">Drawn from the Module 2 lectures and exercise sheets. Pick an answer and you get the reasoning straight away.</p>
</div>

```quiz
- q: Which of these is a <strong>valid</strong> Python variable name?
  options:
    - 1myVar
    - my-var
    - _myVar123
    - my var
  answer: 2
  why: Names may contain letters, numbers and underscores, and must start with a letter or an underscore. Hyphens and spaces are not allowed, and a name cannot start with a digit.

- q: What does <code>17 % 5</code> give you?
  options:
    - 3
    - 2
    - 3.4
    - 85
  answer: 1
  why: "% is the modulus operator: it returns the remainder. 17 ÷ 5 is 3 with 2 left over. (17 // 5 would give you the 3.)"

- q: What is the value of <code>8 + 2 ** 3 * 2</code>?
  options:
    - 24
    - 80
    - 1000
    - 48
  answer: 0
  why: Exponentiation runs first (2**3 = 8), then multiplication (8 × 2 = 16), then addition (8 + 16 = 24).

- q: In <code>if x = 10:</code>, what is wrong?
  options:
    - Nothing, this is correct
    - It should be <code>==</code>; a single <code>=</code> is assignment, not comparison
    - The colon should not be there
    - <code>x</code> must be declared first with a type
  answer: 1
  why: "= puts a value into a variable. == asks whether two things are equal. Writing = in a condition is a SyntaxError in Python — which is the lucky outcome, since some languages accept it silently."

- q: In an <code>if / elif / elif / else</code> chain, how many branches run?
  options:
    - All the ones whose condition is true
    - Only the first one whose condition is true
    - Always exactly two
    - The last one whose condition is true
  answer: 1
  why: Python checks the conditions in order and runs only the first true branch, skipping all the rest. This is why the order of your branches changes the meaning of the whole chain.

- q: <code>range(1, 5)</code> produces which numbers?
  options:
    - 1, 2, 3, 4, 5
    - 1, 2, 3, 4
    - 0, 1, 2, 3, 4
    - 2, 3, 4, 5
  answer: 1
  why: range starts at the first number and stops *before* the second. To include 5 you would need range(1, 6). This off-by-one is one of the most common bugs in programming.

- q: Which mistake causes an <strong>infinite loop</strong> in a <code>while</code> loop?
  options:
    - Forgetting to initialise the control variable
    - Forgetting to update the control variable inside the loop
    - Using <code>&lt;=</code> instead of <code>&lt;</code>
    - Forgetting the colon
  answer: 1
  why: If nothing inside the loop changes the variable the condition tests, the condition stays true forever. Forgetting to initialise gives a NameError instead, and a missing colon is a SyntaxError.

- q: What is the difference between <code>print</code> and <code>return</code> in a function?
  options:
    - They are two names for the same thing
    - <code>print</code> displays a value to the user; <code>return</code> hands a value back to the calling code
    - <code>return</code> displays a value; <code>print</code> stores it
    - <code>print</code> works only inside functions
  answer: 1
  why: A function that only prints is a dead end — its result cannot be used in any further calculation. Only a returned value can be stored in a variable or passed on.

- q: A variable created inside a function, without the <code>global</code> keyword, is…
  options:
    - Global, and visible everywhere
    - Local, and disappears when the function ends
    - Automatically saved to a file
    - Shared with every other function
  answer: 1
  why: It is a local variable. Trying to use it after the function has finished gives a NameError. This isolation is a feature — it is what lets you understand a function by reading only that function.

- q: After <code>y = [1, 2, 3]</code> and <code>x = y</code>, you run <code>x.append(4)</code>. What is <code>y</code>?
  options:
    - "[1, 2, 3]"
    - "[1, 2, 3, 4]"
    - "[4]"
    - An error
  answer: 1
  why: "x = y does not copy the list — it makes x a second name for the same object in memory, so both names see the change. Use x = y.copy() when you want an independent list."

- q: Which is true of <code>sorted(x)</code> compared with <code>x.sort()</code>?
  options:
    - They are identical
    - <code>sorted(x)</code> returns a new sorted list and leaves <code>x</code> unchanged; <code>x.sort()</code> rearranges <code>x</code> itself
    - <code>sorted(x)</code> changes <code>x</code>; <code>x.sort()</code> returns a copy
    - <code>x.sort()</code> only works on numbers
  answer: 1
  why: "sorted() is a built-in function that hands back a new list. .sort() is a method that modifies the original in place and returns nothing. Getting them backwards either loses your result or destroys your original."

- q: You need to store fixed historical inflation rates that must never be modified. Which container?
  options:
    - A list
    - A tuple
    - A dictionary
    - A string
  answer: 1
  why: A tuple is immutable, so an accidental attempt to overwrite a value raises an error instead of silently corrupting your data. That safety is exactly why tuples exist.
```

## Where you are now

You can now write real Python programs:

- **Variables and operators** — and you know the precedence order, `Arithmetic → Comparison → Logical`.
- **Decisions** — `if` / `elif` / `else`, chained and nested, with compound conditions.
- **Loops** — `for` when you know how many, `while` when you don't.
- **Functions** — with parameters, defaults, return values, and an understanding of scope.
- **Containers** — lists for data that changes, tuples for data that must not, dictionaries for lookup by name.

Module 3 takes the last of those — the list of dictionaries that looked so much like a table — and hands it to **pandas**, where one line does what a loop used to.

[**Start Module 3 →**](../module-3/index.md)
