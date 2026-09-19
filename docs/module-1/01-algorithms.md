<div class="hero" markdown>
<span class="eyebrow">Lesson 1 of 3</span>
# Algorithms: the recipe before the cooking
<p class="lede">Before a computer can help you with anything, somebody has to write down the steps. That written-down list of steps is called an *algorithm* — and you have been making them your whole life without calling them that.</p>
</div>

!!! life "How the code boxes work"
    Every grey-and-dark box below is a real Python program. Press **Run** and Python starts up inside your browser. The first Run on this page takes about 10–20 seconds while Python downloads; after that it's instant. Change the code, press Run again — you cannot break anything.

## Two kinds of problems

Not every problem in life can be handed to a computer. The lecture splits problems into two families.

<div class="cols two" markdown>
<div class="card" markdown>
#### Algorithmic problems ✓
You can solve them with a **fixed series of actions**. Baking a cake. Putting 10,000 names in alphabetical order. Calculating the salary of every employee.

*This is what computers are built for.*
</div>
<div class="card" markdown>
#### Heuristic problems
They need **judgement, experience, and trial and error**. Which stock should I buy? Should we open a new branch in Alexandria?

*Humans are still better here.*
</div>
</div>

!!! sowhat "So what?"
    The lecture puts it bluntly: **the I.Q. of a computer is zero.** It has no intelligence and no thinking power — it does exactly what it is told, in exactly the order it is told. So if your program gives a wrong answer, the machine is almost never the problem. **Your steps were wrong.** Beginners waste hours blaming Python; experienced people go straight back and re-read their own steps.

## Where the word comes from

The word *algorithm* is not a modern English invention. It comes from **Muhammad ibn Musa al-Khwarizmi** (c. 780–850 CE), the mathematician who introduced the Hindu-Arabic numerals and the decimal system to the world, and who wrote *Al-Jabr* — the book that gave us the word *algebra*.

When his book was translated into Latin, his name appeared as **Algoritmi**. That became "algorithm." So every time you say the word, you are saying his name.

## You already write algorithms every day

An algorithm is any sequence of steps that reaches a goal. Look at these — they are all from the lecture:

| Everyday task | The algorithm |
|---|---|
| Making a cup of tea | Boil kettle → put tea in cup → pour boiling water into cup |
| Using an ATM | Insert card → enter PIN → choose withdrawal → enter amount → receive cash → take card |
| Cooking pasta | Boil water → add pasta → cook 10 minutes → drain → serve |
| Doing laundry | Sort clothes → put in washer → add detergent → set timer → dry clothes |
| Morning routine | Wake up → brush teeth → eat breakfast → get dressed → go to college |

Notice the ATM: swap two steps — *enter PIN* before *insert card* — and the whole thing fails. **Order is part of the answer**, not just decoration.

Here is the tea algorithm as an actual Python program.

```runpy
title: The tea algorithm
sub: three steps, in order
---
# An algorithm is just steps, written in order.
# print() means: show this on the screen.

print("Step 1: Boil the kettle")
print("Step 2: Put the tea in the cup")
print("Step 3: Pour the boiling water into the cup")

# Try it: swap step 3 and step 1, then press Run again.
# Python will obey you - even when the result makes no sense.
```

## The three questions every algorithm answers

The lecture gives three design steps. Underneath them sits one idea that carries you through this whole course:

<p style="font-family:var(--serif); font-size:1.5rem; text-align:center; margin:1.6rem 0; color:var(--crimson)" markdown>
INPUT &nbsp;→&nbsp; PROCESS &nbsp;→&nbsp; OUTPUT
</p>

1. **Identify the input.** What am I given from outside? (the three marks, the salary, the number N)
2. **Identify the processing.** What calculations turn that input into the answer?
3. **Identify the output.** What must come out at the end? Every algorithm produces at least one result.

!!! life "Think of a juice shop"
    **Input** = the oranges you hand over. **Process** = the machine squeezing them. **Output** = the glass of juice. If you hand over onions, the machine will still squeeze — and hand you onion juice. Same in programming: *wrong input, confident wrong output.*

## Construct 1 — Sequence

Every algorithm, no matter how complicated, is built from only **three building blocks**: **sequence**, **selection**, and **iteration**. That is the whole toolbox.

**Sequence** means: do this, then this, then this. No choices, no repeating. Straight line.

### Example 1 — the average of three numbers <span class="slidetag">Lecture 1_2, Ex. 1</span>

Straight from the slide:

1. Read the numbers a, b, c
2. Compute the sum of a, b and c
3. Divide the sum by 3
4. Store the result in variable d
5. Print the value of d
6. End

Now the same six steps in Python. The **Inputs** box below is where you put the numbers the program will "read" — one per line, exactly like typing them on a keyboard.

```runpy
title: Average of three numbers
sub: sequence
inputs:
  - 12
  - 8
  - 13
input_hint: a, then b, then c — one number per line
---
# Step 1: Read the numbers a, b, c
a = float(input("Enter a: "))
b = float(input("Enter b: "))
c = float(input("Enter c: "))

# Steps 2, 3 and 4: add them, divide by 3, store in d
d = (a + b + c) / 3

# Step 5: Print the value of d
print("The average is", d)
```

!!! trap "Why float() and not just input()?"
    Whatever the user types arrives as **text**, not as a number. Text "12" plus text "8" gives you "128", not 20. `float()` converts the text into a number you can do arithmetic with. Forget it once and your averages turn into nonsense — quietly, with no error message.

### Example 2 — simple interest <span class="slidetag">Lecture 1_2, Ex. 2</span>

Formula from the slide: `Simple interest = P × N × (R / 100)`, where P is the principal amount, N the number of years, R the rate of interest.

```runpy
title: Simple interest
sub: sequence · a real bank formula
inputs:
  - 50000
  - 3
  - 12
input_hint: P (EGP), then N (years), then R (rate %)
---
# Step 1: Read P, N and R
P = float(input("Principal amount in EGP: "))
N = float(input("Number of years: "))
R = float(input("Rate of interest %: "))

# Step 2: Calculate simple interest
simple_interest = P * N * (R / 100)

# Step 3: Print it
print("Simple interest =", simple_interest, "EGP")
print("Total you get back =", P + simple_interest, "EGP")
```

### Your turn — perimeter and area <span class="slidetag">Lecture 1_2, Ex. 4</span>

The slide asks for an algorithm that reads a rectangle's **length** and **width**, then prints both the perimeter `2 × (length + width)` and the area `length × width`. Fix the two placeholder lines and Run.

```runpy
title: "Rectangle: perimeter and area"
sub: you write the two calculation lines
inputs:
  - 7
  - 4
input_hint: length, then width
solution: |
  perimeter = 2 * (length + width)
  area      = length * width
---
length = float(input("Length: "))
width  = float(input("Width: "))

# Write the two formulas here:
perimeter = 0    # <-- fix me
area      = 0    # <-- fix me

print("Perimeter =", perimeter)
print("Area      =", area)
```

## Construct 2 — Selection

**Selection** means the algorithm reaches a fork in the road and picks a path based on a condition. In everyday language: *if* it rains, take the umbrella, *otherwise* don't.

### Example 5 — the largest of three numbers <span class="slidetag">Lecture 1_2, Ex. 5</span>

1. Read the numbers X, Y, Z
2. if (X > Y) then Big = X, else Big = Y
3. if (Big < Z) then Big = Z
4. Print the largest number, Big

The trick worth noticing: we keep a variable called **Big** that holds "the winner so far," and we keep challenging it. That one idea scales from three numbers to three million.

```runpy
title: Largest of three numbers
sub: selection
inputs:
  - 12
  - 45
  - 30
input_hint: X, then Y, then Z
---
X = float(input("X = "))
Y = float(input("Y = "))
Z = float(input("Z = "))

# Step 2: the first challenge
if X > Y:
    Big = X
else:
    Big = Y

# Step 3: the second challenge
if Big < Z:
    Big = Z

print("The largest number is", Big)
```

!!! trap "Two things Python is strict about"
    **The colon.** Every `if` and `else` line ends with `:`. Delete one and Python refuses to run at all.

    **The indentation.** The lines *inside* the `if` are pushed in by four spaces. That space is not decoration — it is how Python knows which lines belong to the `if`. In other languages curly brackets do this job; in Python, it is the spacing.

The lecture then asks: find the largest among **five** integers — A, B, C, D, E. You assume `max = A`, then compare each of the rest against `max`. And then it asks the question that opens the next door:

<p style="font-family:var(--serif); font-size:1.3rem; color:var(--crimson); text-align:center; margin:1.5rem 0">
"What if I have a million numbers instead of five?"
</p>

You are not going to write a million `if` lines. You need the third construct.

## Construct 3 — Iteration (loops)

A **loop** repeats a set of instructions until a condition is satisfied, so you don't have to copy the same line over and over.

<div class="cols two" markdown>
<div class="card" markdown>
#### FOR loop
Used when you **know in advance** how many repetitions you need.
*"Grade all 40 students in this class."*
</div>
<div class="card" markdown>
#### WHILE loop
Used when you **don't know** how many. It keeps going while a condition stays true.
*"Keep serving customers until the shop closes."*
</div>
</div>

### The four parts of every loop <span class="slidetag">Lecture 1_1, slide 29</span>

The lecture's "Hello Feps" example labels them clearly. Memorise these four — every loop bug you will ever have is one of them going missing.

| Part | In the example | If you forget it |
|---|---|---|
| Initialise the control variable | `I = 1` | Python doesn't know what `I` is → error |
| Test the loop condition | `while I <= 100:` | The loop never knows when to stop |
| The statement(s) to repeat | `print("Hello Feps")` | The loop spins doing nothing |
| Update the control variable | `I = I + 1` | **Infinite loop** — the classic beginner bug |

```runpy
title: Hello Feps
sub: the four parts of a while loop
---
I = 1                          # 1. initialise the control variable

while I <= 5:                  # 2. test the condition
    print("Hello Feps")        # 3. the statement to repeat
    I = I + 1                  # 4. update the control variable

print("Done. I ended at", I)

# The lecture asks for 100 times. Change 5 to 100 and Run.
# Then try deleting the line "I = I + 1" - this page will stop
# you after a while and tell you your loop never ends.
```

### Example 7 — factorial <span class="slidetag">Lecture 1_2, Ex. 7</span>

Factorial of N means `N! = 1 × 2 × 3 × … × N`. The lecture's algorithm:

- Step 1: Read N · Step 2: PROD = 1 · Step 3: I = 2
- Step 4: While (I ≤ N) do → PROD = PROD × I, then I = I + 1
- Step 7: Write "Factorial of", N, "is", PROD

#### Tracing: checking the algorithm by hand for N = 4

Before running anything, good programmers **trace** — they walk through the steps on paper with real values. This is the single most useful habit in this whole course.

| Check | I ≤ N ? | PROD becomes | I becomes |
|---|---|---|---|
| start | — | 1 | 2 |
| pass 1 | 2 ≤ 4 → Yes | 1 × 2 = 2 | 3 |
| pass 2 | 3 ≤ 4 → Yes | 2 × 3 = 6 | 4 |
| pass 3 | 4 ≤ 4 → Yes | 6 × 4 = 24 | 5 |
| pass 4 | 5 ≤ 4 → **No** | stop | — |

Result: **Factorial of 4 is 24.** The algorithm works. Now let Python do the same trace out loud.

```runpy
title: "Factorial, with its own trace printed"
sub: iteration
inputs:
  - 4
input_hint: one number, N
---
N = int(input("N = "))

PROD = 1
I = 2

while I <= N:
    PROD = PROD * I
    print("   I =", I, "  ->  PROD =", PROD)   # the trace line
    I = I + 1

print("Factorial of", N, "is", PROD)

# Try N = 10. Then try N = 0 - does the algorithm still
# give a sensible answer? (It should: 0! = 1)
```

### Example 9 — summing until a negative number appears <span class="slidetag">Lecture 1_2, Ex. 9</span>

This one shows why `while` exists. You do **not** know how many numbers the user will type. They stop by entering a negative value — a "sentinel." Very common in real data entry.

```runpy
title: Add numbers until a negative one arrives
sub: iteration with a sentinel
inputs:
  - 5
  - 10
  - 7
  - -1
input_hint: any numbers, then a negative one to stop
---
SUM = 0
NEW_VALUE = float(input("Value: "))

while NEW_VALUE >= 0:
    SUM = SUM + NEW_VALUE
    NEW_VALUE = float(input("Value: "))

print("The sum is", SUM)
```

!!! life "Where you'll meet this for real"
    A cashier scanning items at Carrefour has no idea how many things are in the trolley. The till adds item after item *while* there are still items, and stops when the cashier presses "Total." Same loop, same sentinel idea.

### Example 8 — reversing the digits of a number <span class="slidetag">Lecture 1_2, Ex. 8</span>

Input 1234, output 4321. It uses two operators worth knowing now:

- `%` **modulus** — the remainder. `17 % 5 = 2` (17 ÷ 5 is 3, remainder 2). So `n % 10` always hands you the **last digit**.
- `//` **floor division** — the quotient with no remainder. `17 // 5 = 3`. So `n // 10` **chops the last digit off**.

```runpy
title: Reverse the digits
sub: iteration · % and //
inputs:
  - 1234
input_hint: a whole number
---
n = int(input("Number: "))
rev = 0

while n > 0:
    digit = n % 10          # grab the last digit
    rev = rev * 10 + digit  # stick it onto the reversed number
    n = n // 10             # chop the last digit off
    print("   digit =", digit, "  rev =", rev, "  n left =", n)

print("Reversed:", rev)
```

## What makes an algorithm a *good* algorithm

More than one algorithm can solve the same problem. The lecture lists five properties that separate a real algorithm from a vague wish.

| Property | Means | Broken version |
|---|---|---|
| **Finiteness** | It must end after a finite number of steps. | "Keep adding 1 forever." |
| **Definiteness** | Every step is clear and unambiguous. | "Add some salt." |
| **Effectiveness** | Every step is basic enough to actually be done. | "Guess the winning lottery number." |
| **Input / Output** | Takes zero or more inputs, produces at least one output. | A program that calculates and tells you nothing. |
| **Generality** | Works for *any* valid input of that type, not one special case. | `print(20*21/2)` to "sum 1 to n." |

??? question "The three-student scenario from the lecture — can you judge them?"
    **The task:** sum the first n natural numbers.

    **Student A:** "Read n. Start with total = 0. Add 1, then 2, then 3 … up to n. Return the total."
    **Student B:** "Read n. Use the formula n(n+1)/2."
    **Student C:** "print 20\*21/2"

    **Which property do A and B both satisfy?** Correctness — both give the right answer.
    **What does B have more of than A?** <span style="color:var(--olive); font-weight:600">Efficiency</span> — B finishes in one calculation; A needs n additions. With n = 1,000,000 that difference is enormous.
    **What does C violate?** <span style="color:var(--crimson); font-weight:600">Generality</span> — it only ever works for 20. Change the question and C is useless.

!!! sowhat "So what?"
    This is the difference between a student who passes and an analyst who gets hired. Both write code that "works." Only one writes code that still works when the dataset grows from 20 rows to 2 million, and when somebody else has to read it next year.

---

Next: [**Flowcharts**](02-flowcharts.md) — the same three constructs, drawn.
