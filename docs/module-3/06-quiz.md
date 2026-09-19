<div class="hero" markdown>
<span class="eyebrow">Check yourself</span>
# Ten questions on data science and pandas
<p class="lede">The concept questions come from the lecture's own "Test your knowledge" slides; the pandas ones from the code you've been running.</p>
</div>

```quiz
- q: Which three fields form the interdisciplinary foundation of <strong>data science</strong>?
  options:
    - Robotics, expert systems, and statistics
    - Statistics, computer science, and domain expertise
    - Advanced analytics, data preparation, and ethics
    - Python, visualisation, and modelling
  answer: 1
  why: Statistics supplies the methods, computer science the tools, and domain expertise the meaning. As social scientists, the third one is what you bring — and it is the hardest of the three to hire.

- q: What is the primary focus of traditional <strong>statistics</strong> compared with data science?
  options:
    - Prediction and automation
    - Building large neural networks
    - Inference and explaining relationships within data
    - Analysing only unstructured data
  answer: 2
  why: "Statistics is model-driven and asks *why*. Data science is data-driven and asks *what will happen next*. Neither is better — they answer different questions."

- q: Which correctly describes the relationship between AI and machine learning?
  options:
    - ML is a subset of AI
    - AI is a subset of ML
    - They are two names for the same thing
    - ML is an older field than AI
  answer: 0
  why: All machine learning is AI, but not all AI is machine learning. An expert system following pre-written IF/THEN rules is AI that does not learn from data at all.

- q: In machine learning, what does the term <strong>pattern</strong> mean?
  options:
    - A single random data point or outlier
    - A coin-flip probability
    - An explicit rule written by the programmer
    - A reliable relationship between different variables
  answer: 3
  why: "Something like 'high bill + low usage → likely to cancel'. Crucially it is *discovered* from historical data, not written down in advance by a programmer."

- q: Which pandas command should you run first on any new dataset?
  options:
    - <code>df.describe()</code>
    - <code>df.info()</code>
    - <code>df.plot()</code>
    - <code>df.corr()</code>
  answer: 1
  why: "info() tells you the number of rows, every column name, the data type of each, and — most importantly — the non-null count per column, which is how you spot missing data before it quietly ruins an average."

- q: What does <code>df.drop(columns='Country')</code> do to <code>df</code>?
  options:
    - Removes the column from <code>df</code>
    - Nothing — it returns a modified copy and leaves <code>df</code> unchanged
    - Raises an error
    - Removes the column and returns it
  answer: 1
  why: "This is the most common pandas confusion. You need either df = df.drop(...) or df.drop(..., inplace=True). It is the same distinction as sorted() versus .sort() from Module 2."

- q: What is the difference between <code>loc</code> and <code>iloc</code>?
  options:
    - <code>loc</code> accesses by label; <code>iloc</code> accesses by integer position
    - <code>loc</code> is for rows; <code>iloc</code> is for columns
    - <code>loc</code> returns a copy; <code>iloc</code> returns the original
    - They are identical
  answer: 0
  why: "iloc is *integer* location — df.iloc[0] is the first row whatever it's called. loc uses the labels — df.loc['a'] finds the row indexed 'a'. With a default 0,1,2 index they look the same, which is exactly why people get caught out later."

- q: <code>df.groupby('Department')['Salary'].mean()</code> follows which strategy?
  options:
    - Sort, filter, display
    - Split, apply, combine
    - Merge, join, concatenate
    - Read, clean, write
  answer: 1
  why: "Split the rows into groups by department, apply mean() to each group's salaries, then combine the results into one table."

- q: You run <code>df.dropna()</code> and your dataset goes from 891 rows to 670. What is the most important thing to do next?
  options:
    - Nothing, the data is clean now
    - Ask whether the removed rows differ systematically from the ones you kept, and report it
    - Run <code>dropna()</code> again to be safe
    - Delete the original file
  answer: 1
  why: Missing values are rarely random. On the Titanic, age was recorded less often for third-class passengers — the group with the lowest survival rate. Dropping them changes who your analysis is actually about, and that belongs in your write-up.

- q: You want to show how the values of a single numerical variable are spread out. Which chart?
  options:
    - Pie chart
    - Histogram
    - Scatter plot
    - Line chart
  answer: 1
  why: "A histogram shows *distribution*. Pie is for composition, scatter for the relationship between two numerical variables, and line for trends over an ordered sequence such as time."
```

## You've finished the course

Look at what you can do now that you couldn't three modules ago:

**Module 1 — you learned to think.** Break any problem into input, process, and output. Build it from the only three constructs there are: sequence, selection, iteration. Draw it, trace it by hand, and check it before writing a line of code.

**Module 2 — you learned to write.** Variables, conditionals, loops, functions, and the containers that hold data. And you learned to read an error message instead of fearing it.

**Module 3 — you learned to analyse.** Load real data, clean it honestly, summarise it, group it, chart it, and say what it means.

!!! sowhat "The part that isn't about Python"
    The most valuable habit in these three modules isn't a piece of syntax. It's the instinct to ask **"how would I know if this were wrong?"** — trace the algorithm, check the boundary case, print the group sizes next to the group rates, and ask who the missing rows were.

    Software will keep changing. That question won't.

<p style="font-family:var(--serif); font-size:1.3rem; text-align:center; margin:2rem 0; color:var(--crimson)">
You are now ready to turn raw code into real analysis.
</p>
