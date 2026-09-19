<div class="hero" markdown>
<span class="eyebrow">Lesson 2 of 6 · Lecture 2_1</span>
# Making decisions: if, elif, else
<p class="lede">By default Python runs your statements top to bottom, one after another. Conditional execution is the first way to break that line — run a block of code only *if* something is true.</p>
</div>

## Two ways to alter the flow

The lecture is precise about this. Sequential top-to-bottom execution can be changed in exactly two ways:

- **Conditional execution** — a block runs only if a certain condition is true. *(this lesson)*
- **Repetitive execution** — a block runs over and over while a condition stays true. *(next lesson)*

That's the selection and iteration you drew as flowcharts in Module 1. Here they get real syntax.

## The simple if

```text
if condition:
    this part of the code runs when the condition is True
else:
    this part runs when the condition is False
```

Two things carry all the meaning, and both are easy to forget:

- The **colon** `:` at the end of the `if` line.
- The **indentation** of the lines underneath it. Python's standard is **four spaces**. The indentation is not decoration — it is how Python knows which lines belong inside the `if`.

```runpy
title: Is the number positive?
sub: an if with no else
inputs:
  - 7
input_hint: any number
---
x = input("Enter a numeric number: ")
x = int(x)

if x > 0:
    print(x, 'is a positive number')

print("Done.")   # this line is NOT indented, so it always runs

# Try entering -3. The first message disappears, but "Done." stays.
```

```runpy
title: Even or odd
sub: if ... else
inputs:
  - 12
input_hint: any whole number
---
x = input("Enter a numeric number: ")
x = int(x)

if (x % 2 == 0):
    print(x, 'is an even number')
else:
    print(x, 'is an odd number')
```

!!! trap "The three ways this line goes wrong"
    - `if x % 2 = 0:` — one equals sign. That's assignment, not comparison. **SyntaxError.**
    - `if x % 2 == 0` — no colon. **SyntaxError.**
    - Forgetting to indent the line under the `if`. **IndentationError.**

    All three stop the program before it runs a single line. Annoying, but far kinder than a wrong answer with no warning.

## Chained conditions: elif

Sometimes there are more than two possibilities. A **chained conditional** handles as many branches as you like:

```text
if condition:
    code
elif another_condition:
    code
else:
    code
```

`elif` is short for "else if". Python checks each condition **in order** and runs the **first** one that's true — then skips the rest entirely.

```runpy
title: Which number is bigger?
sub: three possible outcomes
inputs:
  - 15
  - 15
input_hint: two numbers
---
x = float(input("Enter the first number: "))
y = float(input("Enter the second number: "))

if (x > y):
    print(x, 'is greater than', y)
elif (y > x):
    print(y, 'is greater than', x)
else:
    print('The two numbers are equal')
```

### Compound conditions

You can combine the logical operators from the last lesson into each branch:

```runpy
title: Classify a number five ways
sub: compound chained conditions
inputs:
  - -6
input_hint: try -6, then 7, then 0
---
a = float(input("Enter a numeric number: "))

if a > 0 and a % 2 == 0:
    print('A is an even positive number')
elif a > 0 and a % 2 != 0:
    print('A is an odd positive number')
elif a == 0:
    print('A is zero')
elif a < 0 and a % 2 == 0:
    print('A is an even negative number')
else:
    print('A is an odd negative number')
```

!!! sowhat "Order matters, and it's silent"
    Because Python stops at the **first** true branch, putting a broad condition before a narrow one means the narrow one never runs. If you wrote `elif a > 0:` before `elif a > 0 and a % 2 != 0:`, the second line would be unreachable forever — and Python would never warn you. When your `elif` chain "ignores" a case, check the order before you check anything else.

## Nested conditions

One conditional can live inside another:

```runpy
title: Nested if
sub: a decision inside a decision
inputs:
  - 4
  - 9
input_hint: two numbers
---
x = float(input("Enter the first number: "))
y = float(input("Enter the second number: "))

if (x == y):
    print('The two numbers are equal')
else:
    if (x < y):
        print(x, 'is less than', y)
    else:
        print(y, 'is less than', x)
```

Nesting works, but it gets hard to read fast. As a rule: if you find yourself three levels deep, an `elif` chain or a function (Lesson 4) will usually express the same logic more clearly.

## The exercises from Sheet 2

These three are the lecture's own exercises. Try each one before opening the answer.

### 1. Leap years

A year is a leap year if it is **divisible by 400**, or **divisible by 4 but not by 100**.

```runpy
title: "Exercise 1: is it a leap year?"
sub: one condition, carefully built
inputs:
  - 2000
input_hint: a year — try 2000, 1900, 2024, 2023
solution: |
  if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
      print("The given year is a Leap Year")
  else:
      print("The given year is not a Leap Year")
---
year = int(input("Enter your birth year: "))

# Write the condition here:
if False:      # <-- fix me
    print("The given year is a Leap Year")
else:
    print("The given year is not a Leap Year")
```

!!! life "Why the rule is so strange"
    A year is really 365.2422 days, not 365.25. Adding a leap day every 4 years over-corrects slightly, so we skip the leap day in century years — except every 400 years, when we put it back. 1900 was *not* a leap year; 2000 *was*. Software that got this wrong is a genuine historical category of bug.

### 2. Loan eligibility

An applicant qualifies if they are **at least 21** **and** earn **at least 25,000** per year.

```runpy
title: "Exercise 2: loan eligibility"
sub: two conditions joined with and
inputs:
  - 24
  - 30000
input_hint: age, then annual income
---
age = int(input("Enter your age: "))
income = float(input("Enter your annual income: "))

if age >= 21 and income >= 25000:
    print("The applicant is qualified for the loan.")
else:
    print("The applicant is not qualified for the loan.")

# Try age 21 exactly, and income exactly 25000.
# "At least" means >= , not > . Change one and see who gets rejected.
```

### 3. The electricity bill

A banded tariff — the kind every utility in the world uses:

| Units consumed | Rate per unit |
|---|---|
| Up to 100 | 0.10 |
| 101 to 300 | 0.15 |
| 301 to 500 | 0.20 |
| Above 500 | 0.25 |

```runpy
title: "Exercise 3: electricity bill"
sub: a banded tariff with elif
inputs:
  - 250
input_hint: units consumed — try 50, 250, 400, 800
---
units = float(input("Enter the number of units consumed: "))
bill = 0

if units <= 100:
    bill = units * 0.10
elif units <= 300:
    bill = units * 0.15
elif units <= 500:
    bill = units * 0.20
else:
    bill = units * 0.25

print(f"The total electricity bill is: {bill}")
```

!!! trap "Look closely at why `elif units <= 300` works"
    It reads as "up to 300" but actually means "between 101 and 300" — because if the units were 100 or fewer, the **first** branch would already have caught them and we'd never get here. Each `elif` silently inherits "and none of the above were true."

    That's what makes the chain short and readable. It's also what makes reordering the branches so dangerous.

---

Next: [**Loops**](03-loops.md) — the other way to break the straight line.
