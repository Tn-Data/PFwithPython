# Modules 2 and 3 — what to copy where

Unzip this over your existing repo root. Everything keeps the same folder
structure, so you can drop the whole `docs/` and `hooks/` folders straight in.

## Files that REPLACE something you already have (4)

| File | Why it changed |
|---|---|
| `mkdocs.yml` | The `nav:` list now includes all 13 new pages. Nothing else changed — **if you already edited `repo_url` / `repo_name`, just copy the new `nav:` block instead of the whole file.** |
| `hooks/hooks.py` | The `runpy` fence accepts two new keys: `packages:` and `guard:`. |
| `docs/javascripts/pyrunner.js` | Loads Pyodide packages on demand, captures matplotlib charts as images, silences library import warnings, and exposes a `DATA_URL` variable to every cell. |
| `docs/stylesheets/extra.css` | Adds styling for the package badge on a cell header and for chart images. |
| `README.md` | Documents the new fence options. |

## Files that are NEW (17)

```
docs/module-2/index.md
docs/module-2/01-variables-operators.md
docs/module-2/02-conditionals.md
docs/module-2/03-loops.md
docs/module-2/04-functions.md
docs/module-2/05-lists.md
docs/module-2/06-tuples-dicts.md
docs/module-2/07-quiz.md

docs/module-3/index.md
docs/module-3/01-data-science.md
docs/module-3/02-pandas-basics.md
docs/module-3/03-analysis.md
docs/module-3/04-visualization.md
docs/module-3/05-titanic.md
docs/module-3/06-quiz.md

docs/data/titanic.csv          <- NEW FOLDER: docs/data/
```

`docs/module-2/index.md` and `docs/module-3/index.md` replace the two
placeholder stubs from the first version.

## The one gap you should know about

**Lecture 2_2 (Loops) was not among the PDFs you sent.** `docs/module-2/03-loops.md`
was written from the Module 2 outline in Lecture 2_1, the loop material in
Lectures 1_1 and 1_2, and the loop exercises referenced later in Lecture 2_3
(Sheet 3 Ex 8 `growth_model`, Ex 9 `analyze_list`; Sheet 2 Q18–Q21).

There's a comment at the top of that file saying the same thing. Send me the
real slides and I'll align it; the page structure should take the content with
no other changes.

## New fence options

A cell that needs a library:

````
```runpy
title: Reading a real CSV file
packages: [pandas, matplotlib]
---
import pandas as pd
from pyodide.http import open_url
df = pd.read_csv(open_url(DATA_URL + "titanic.csv"))
print(df.head())
```
````

- **`packages:`** downloads Pyodide libraries before the code runs, once per
  browser session. A badge on the cell header shows which ones.
- **`DATA_URL`** is set automatically in every cell and points at `docs/data/`.
  Files there are published with the site. A browser can't read local disk, so
  cells fetch over the web with `open_url()` — in Jupyter or Colab students use
  plain `pd.read_csv("titanic.csv")`, and the pages say so.
- **The infinite-loop guard turns itself off** whenever `packages:` is used —
  library internals execute far more than its 400,000-line threshold. Override
  with `guard: true` / `guard: false`.
- **matplotlib charts are captured automatically** and shown as images under the
  text output. No `plt.show()` needed.

## Verified before sending

- `mkdocs build --strict` passes.
- All **130** runnable cells across all three modules were executed; every one
  produces correct output. The three cells that raise errors on purpose (syntax
  error, runtime error, tuple immutability) fail exactly as intended.
- The pandas, CSV-loading, and matplotlib paths were tested end to end in a real
  browser against a real Pyodide runtime — including that the Titanic case study
  reproduces the lecture's own figures: **891 → 714 → 670 rows**, and the
  survival crosstabs (75% of women vs 22% of men; 66% / 50% / 25% by class).
