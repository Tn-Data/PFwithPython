<div class="hero" markdown>
<span class="eyebrow">Lesson 4 of 6 · Lecture 2_3</span>
# Functions and modules
<p class="lede">A function is a block of code with a name, that does one job. You write it once and call it whenever you need it — which is how programs stop being long and start being organised.</p>
</div>

## Two kinds of function

<div class="cols two" markdown>
<div class="card" markdown>
#### Built-in functions
Already defined inside Python. Call them directly — `print()`, `len()`, `sum()`, `round()`.
</div>
<div class="card" markdown>
#### User-defined functions
The ones you write yourself, to do something specific to your problem.
</div>
</div>

### The built-ins worth knowing now

| Function | Does |
|---|---|
| `abs()` | absolute value of a number |
| `input()` | reads what the user types |
| `int()` / `float()` / `str()` | convert between types |
| `len()` | length of an object |
| `max()` / `min()` | largest / smallest item |
| `pow()` | x to the power of y |
| `print()` | display on screen |
| `range()` | a sequence of numbers |
| `round()` | round a number |
| `sorted()` | return a sorted list |
| `sum()` | add up the items |
| `type()` | what type is this? |

```runpy
title: Built-in functions on a list
sub: six of them, one line each
---
numbers = [10, 20, 30, 40, 70, 90, 85, 55]

print(len(numbers))       # how many items
print(sum(numbers))       # add them all
print(max(numbers))       # the largest
print(min(numbers))       # the smallest
print(sorted(numbers))    # a new sorted list
print(type(numbers))      # what kind of thing is it
```

!!! trap "Treat built-in names as reserved"
    You *can* write `max = 5`, and Python will let you. But `max()` is now broken for the rest of your program, because you've replaced the function with the number 5. Never use `max`, `min`, `sum`, `len`, `list`, `str`, `type`, or `input` as variable names.

## Writing your own

```text
def function_name(list of parameters):
    """
    Docstring: what the function does, what it takes, what it returns.
    """
    body of the function
    return values
```

- **`def`** is the keyword that declares a function.
- **Function names** follow the same rules as variable names.
- **Parameters** are optional — use empty `()` if there aren't any.
- **`return`** is optional too — a function may hand a value back, or not.
- **Defining a function produces no output.** It only runs when you **call** it.

```runpy
title: Your first function
sub: define it, then call it
---
def print_hello():
    print("Good Morning FEPS")

# Nothing has happened yet. The function is defined, not called.
# Now call it three times:
print_hello()
print_hello()
print_hello()
```

```runpy
title: Parameters and a return value
sub: the add function from the lecture
---
def add(a, b):
    s = a + b
    return s

r = add(5, 7)
print("Sum =", r)

# You can also use the returned value directly:
print("Sum =", add(20, 30))
```

!!! life "The vending machine"
    A function is a vending machine. The **parameters** are the coins you put in. The **body** is the machinery you can't see. The **return value** is what drops into the tray. You don't need to know how the machine works to use it — and that's exactly the point.

### `print` is not `return`

This trips up almost everyone, so it gets its own cell:

```runpy
title: print vs return
sub: the difference that matters
---
def shows(x):
    print(x * 2)        # displays it, hands back nothing

def gives(x):
    return x * 2        # hands the value back to whoever called

a = shows(5)            # prints 10 ... and a is None
b = gives(5)            # prints nothing ... but b is 10

print("a is", a)
print("b is", b)

# Only the returned value can be used in further calculations:
print("b + 1 =", b + 1)
# print("a + 1 =", a + 1)   # <- uncomment this: TypeError
```

**`print` shows a human. `return` hands a value to the rest of your program.** A function that only prints is a dead end.

## Worked examples from the lecture

```runpy
title: Average of two numbers, and of a whole list
sub: two versions of my_avg
---
# Version 1: two numbers
def my_avg(x, y):
    return (x + y) / 2

print(my_avg(10, 20))
print(my_avg(100, 200))

# Version 2: a list of any length
def my_avg_list(L):
    s = 0
    for i in L:
        s = s + i
    return s / len(L)

scores = [10, 20, 30, 40, 50]
print("Average using your function =", my_avg_list(scores))
print("Average using built-ins     =", sum(scores) / len(scores))
```

```runpy
title: Currency converter
sub: a function that returns a rounded value
---
def currency_converter(amount, exchange_rate):
    """Convert an amount of money using the given exchange rate."""
    converted_amount = amount * exchange_rate
    return round(converted_amount, 2)

print("Converted amount:", currency_converter(100, 1.2))
print("Converted amount:", currency_converter(2500, 48.7))
```

```runpy
title: Monthly loan payment
sub: a real formula, with a guard clause
---
def loan_payment(principal, annual_rate, years):
    months = years * 12
    if annual_rate == 0:            # divide equally if there's no interest
        return principal / months
    monthly_rate = annual_rate / (100 * 12)
    R = (1 + monthly_rate) ** months
    payment = (principal * monthly_rate * R) / (R - 1)
    return round(payment, 2)

print(loan_payment(10000, 5, 3), "per month")
print(loan_payment(10000, 0, 3), "per month  (interest-free)")
```

!!! sowhat "That `if annual_rate == 0` line"
    Without it, a zero interest rate makes `R` equal 1, so `R - 1` is 0, and you get a `ZeroDivisionError` — a crash, in front of a user. Checking for the impossible case *before* the maths is called a **guard clause**, and professional code is full of them. Thinking "what's the input that breaks this?" is a habit worth building now.

## Different ways to pass parameters

```runpy
title: Default parameters and named arguments
sub: four ways to call one function
---
def generate_full_name(first_name='Arwa', last_name='Mohammed'):
    return first_name + ' ' + last_name

print(generate_full_name())                        # both defaults
print(generate_full_name('Mona', 'Saber'))         # both given, in order
print(generate_full_name(last_name="Saber"))       # name the one you want
print(generate_full_name(first_name="Mona"))       # the other one
```

**Default parameters** give a parameter a fallback value. **Named arguments** let you skip the order entirely and say which one you mean — much clearer when a function takes several options.

```runpy
title: Dynamic parameters with *
sub: when you don't know how many arguments
---
def sum_all_nums(*nums):
    total = 0
    for i in nums:
        total += i
    return total

print("Sum =", sum_all_nums(2, 3, 5))
print("Sum =", sum_all_nums(2, 3, 5, 10, 20))

# One fixed parameter, then as many extras as you like
def generate_groups(team, *args):
    print(team)
    j = 0
    for i in args:
        j += 1
        print(f"  Member {j}: {i}")

generate_groups('Team-1', 'Ana', 'Mohammed', 'Mona', 'Saber')
generate_groups('Team-2', 'Ahmed', 'Nagi')
```

## Variable scope

**Where** a variable exists determines who can see it.

- A **local variable** is created inside a function. It only exists inside that function. Use it outside and you get a `NameError`.
- A **global variable** is created in the main program, outside every function. Any function can read it.
- To *change* a global variable from inside a function, you must declare it with the `global` keyword.

```runpy
title: Local and global variables
sub: who can see what
---
def print_var():
    y = 10              # local - exists only in here
    z = x * 4           # we CAN read x, because x is global
    print(f"Inside the function:  x = {x}, y = {y}, z = {z}")

x = 5                   # global - created in the main program
print_var()
print("Outside the function: x =", x)

# print("Outside the function: y =", y)   # <- uncomment: NameError
```

```runpy
title: Changing a global from inside
sub: the global keyword
---
def print_var():
    y = 70              # a LOCAL y - the global y is untouched
    global x            # now x refers to the global x
    x = -60
    print(f"Inside the function:        x = {x} and y = {y}")

x = 5
y = 10
print(f"Before calling the function: x = {x} and y = {y}")
print_var()
print(f"After calling the function:  x = {x} and y = {y}")
```

!!! trap "Use `global` rarely"
    It works, but a function that reaches out and changes variables elsewhere is hard to reason about — you can no longer understand the function by reading only the function. Prefer passing values **in** as parameters and handing results **out** with `return`. That is what makes a function testable on its own.

## Recursion

A function can call itself. That's **recursion**.

```runpy
title: Countdown
sub: a function that calls itself
---
def countdown(n):
    print(n)
    if n > 0:
        countdown(n - 1)

countdown(4)
```

```runpy
title: Factorial, recursively
sub: compare this with the loop version from Module 1
---
def fact(n):
    if n <= 1:          # the base case - where the recursion stops
        return 1
    else:
        return n * fact(n - 1)

print("4! =", fact(4))
print("6! =", fact(6))

# The trace:
#   fact(4) -> 4 * fact(3)
#   fact(3) -> 3 * fact(2)
#   fact(2) -> 2 * fact(1)
#   fact(1) -> base case, returns 1
#   so 4 * 3 * 2 * 1 = 24
```

!!! trap "Every recursion needs a base case"
    `if n <= 1: return 1` is the line that stops it. Without a base case, the function calls itself forever and Python gives up with a `RecursionError`. It is the infinite loop of the function world, and the fix is the same idea: something must change each time, and there must be a point where you stop.

## Why functions matter

The lecture lists five reasons, and they're worth reading as a list of things that go wrong *without* functions:

1. **Modularity** — break a program into small pieces you can build and test one at a time.
2. **Abstraction** — use a function without knowing how it works inside.
3. **Reusability** — write it once, call it many times. No copy-paste duplication.
4. **Readability and maintainability** — a well-named function tells the reader what a block does.
5. **Testing and debugging** — a bug lives inside one small function instead of somewhere in 300 lines.

### Clean code

```runpy
title: The same function, badly and well named
sub: self-documenting code
---
# Bad: what are x and y?
def process_1(x, y):
    if x >= y:
        return "approved"
    return "declined"

# Good: the names ARE the documentation
def process_transaction(user_balance, transaction_amount):
    if user_balance >= transaction_amount:
        return "approved"
    return "declined"

print(process_1(500, 300))
print(process_transaction(500, 300))
# Identical behaviour. Only one of them can be understood at a glance.
```

The lecture's rule: **use meaningful names, write small focused functions, and use comments wisely.** A comment that just restates the code is noise; a comment explaining *why* is gold.

## Putting it together: growth_model

Remember the four near-identical loops from Lesson 3? Here they are as **one function, called four times**:

```runpy
title: growth_model
sub: Sheet 3, Ex 8 — one function, four problems
---
def growth_model(label, start_value=10000, growth_rate=0.05, n=5):
    year = 1
    value = start_value
    print(f"Initial {label}: {value}")
    while year <= n:
        value += value * growth_rate
        print("  Year", year, ":", round(value, 2))
        year += 1
    print(f"After {n} years, the {label} = {round(value, 2)}\n")
    return value

growth_model("Population Growth", 1000, 0.02, 10)
growth_model("Price Inflation", growth_rate=0.08)
growth_model("Deposit with Compound Interest")
growth_model("Money Depreciation", 1000, -0.15, n=3)
```

!!! sowhat "This is the whole argument for functions"
    One function. Four completely different questions — demography, macroeconomics, personal finance, asset depreciation — answered by changing the arguments. Without it you'd have four copies of the same loop, and a bug fix would need applying four times, in four places, one of which you'd miss.

## Modules

A **module** is a single `.py` file containing Python definitions. It groups related code so you can reuse it in other programs.

Create `Module_test.py`:

```python
# Module_test.py
def generate_full_name(firstname, lastname):
    return firstname + ' ' + lastname

def sum_two_nums(num1, num2):
    return num1 + num2

Interest_rate = 0.25
```

Then in `main.py`, import from it:

```python
# main.py - three ways to import
import Module_test
print(Module_test.generate_full_name("Mona", "Ahmed"))

# or import specific names directly
from Module_test import generate_full_name, sum_two_nums, Interest_rate
print(generate_full_name("Ameer", "Kamal"))

# or rename while importing
from Module_test import generate_full_name as fullname, Interest_rate as IR
print(fullname("Ameer", "Kamal"))
```

!!! trap "These cells can't run here"
    The examples above need two real files side by side on your computer, which a browser can't provide. Copy them into two files in the same folder and run `main.py` to see it work. Everything else on this page runs fine.

### Built-in modules

Python ships with a large standard library. These run right here:

```runpy
title: The math and statistics modules
sub: import, then use
---
import statistics as st

ages = [20, 20, 4, 24, 25, 22, 26, 20, 23, 22, 26]
print("mean  :", round(st.mean(ages), 2))
print("median:", st.median(ages))
print("mode  :", st.mode(ages))
print("stdev :", round(st.stdev(ages), 2))

print()
import math
print("pi        :", math.pi)
print("sqrt(2)   :", math.sqrt(2))
print("log10(100):", math.log10(100))
print("factorial(4):", math.factorial(4))
print("floor(9.81):", math.floor(9.81))
print("ceil(9.81) :", math.ceil(9.81))
```

```runpy
title: Random numbers
sub: run it more than once
---
from random import random, randint, choice

print("A random number between 0 and 1:", round(random(), 4))
print("A random integer from 5 to 20  :", randint(5, 20))
print("A random pick from a list      :", choice(['Cairo', 'Giza', 'Luxor', 'Aswan']))

# Press Run again - you get different numbers every time.
```

## Packages

A **package** is a folder of related modules. You install one with `pip install <name>`, and import it with an alias by convention:

```python
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
```

The three families a data person cares about:

| Category | Packages | What for |
|---|---|---|
| **Operational** | pandas, numpy | load, clean, merge, and prepare data |
| **Visualisation** | matplotlib, seaborn, plotly | plots and charts |
| **Machine learning** | scikit-learn | build and evaluate predictive models |

!!! life "The hierarchy, smallest to largest"
    A **function** is one job. A **module** is a file of related functions. A **package** is a folder of related modules. A **library** is a broad collection of packages. You've now built the first, and Module 3 puts you to work with the last.

---

Next: [**Lists and strings**](05-lists.md) — somewhere to put all this data.
