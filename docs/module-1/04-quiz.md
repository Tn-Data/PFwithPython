<div class="hero" markdown>
<span class="eyebrow">Check yourself</span>
# Ten questions before you move on
<p class="lede">All of these come from the exercise slides in Module 1. Pick an answer and it tells you straight away — and *why*.</p>
</div>

```quiz
- q: Which of these is an <strong>algorithmic</strong> problem — one a computer is built for?
  options:
    - Deciding which stock to buy next month
    - Putting 10,000 names in alphabetical order
    - Choosing whether to open a new branch
    - Judging whether a poem is good
  answer: 1
  why: It is solved by a fixed series of actions. The other three need judgement and experience — those are heuristic problems.

- q: An algorithm must end after a finite number of steps. Which property is that?
  options:
    - Definiteness
    - Generality
    - Finiteness
    - Effectiveness
  answer: 2
  why: Finiteness. An algorithm that never ends is not an algorithm — it is an infinite loop.

- q: A student writes <code>print(20*21/2)</code> as their algorithm for "sum the first n natural numbers." Which property does it violate?
  options:
    - Generality
    - Finiteness
    - Correctness
    - Definiteness
  answer: 0
  why: Generality. It gives the right answer only when n is 20. Change the input and it is useless.

- q: In a flowchart, which symbol is used for INPUT, READ and PRINT?
  options:
    - The oval
    - The diamond
    - The rectangle
    - The parallelogram
  answer: 3
  why: The parallelogram is the input/output symbol. Rectangles are for processing, diamonds for decisions, ovals for start and stop.

- q: A flowchart diamond always has…
  options:
    - One exit
    - Two exits
    - Three exits
    - As many exits as you like
  answer: 1
  why: Exactly two — Yes/No, or True/False. A question with only one answer is not a decision.

- q: Which of these would cause an <strong>infinite loop</strong>?
  options:
    - Forgetting to initialise the control variable
    - Forgetting to update the control variable
    - Forgetting the print statement
    - Using >= instead of >
  answer: 1
  why: If the counter never changes, the condition stays true forever. This is the single most common loop bug.

- q: What is a key difference between a compiler and an interpreter?
  options:
    - A compiler translates line by line; an interpreter translates everything at once
    - A compiler translates the entire code before execution; an interpreter translates line by line
    - A compiler only works with high-level languages
    - An interpreter needs no source code
  answer: 1
  why: The compiler does the whole job up front and produces an executable file. The interpreter translates and runs one line at a time.

- q: What is an advantage of using an interpreter?
  options:
    - Interpreted programs always run faster
    - It produces a standalone .exe file
    - It gives immediate feedback, which makes debugging easier
    - It only works with statically typed languages
  answer: 2
  why: You find out about a problem the moment that line runs. That is exactly why Python suits beginners.

- q: What happens when Python meets a <strong>syntax</strong> error?
  options:
    - The program runs but gives wrong results
    - The program crashes part-way through
    - The program does not execute at all
    - The interpreter quietly fixes it
  answer: 2
  why: Syntax is checked before execution begins. Not even the first line runs.

- q: Which type of error is the hardest to detect, because it does not stop the program?
  options:
    - Syntax error
    - Logic error
    - Runtime error
    - Indentation error
  answer: 1
  why: A logic error produces no message at all — the program runs happily and hands you a confident wrong answer. That is why you trace and test with known values.
```

## Where you are now

If those questions made sense, you have the whole of Module 1:

- You can tell an **algorithmic** problem from a **heuristic** one.
- You can break any task into **input → process → output**.
- You know the only three building blocks there are: **sequence, selection, iteration**.
- You can **draw** the logic and **trace** it by hand before writing a line.
- You can read a Python error and say which of the **four kinds** it is.

Module 2 takes the selection and iteration you drew here and turns them into proper Python: `if` / `elif` / `else`, functions, lists, dictionaries. Then Module 3 points all of it at real data with pandas.

*Module 1 — Programming Fundamentals · Socio-Computing Department, Faculty of Economics and Political Science, Cairo University.*
