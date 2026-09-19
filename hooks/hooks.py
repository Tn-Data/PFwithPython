"""MkDocs lifecycle hook.

Loaded via the `hooks:` key in mkdocs.yml, which MkDocs imports directly
by file path — this deliberately avoids relying on `sys.path`/package
imports, so it works the same locally and in CI.

It registers two custom fenced-code-block types with pymdownx.superfences
so lecturers can write:

    ```runpy
    ...
    ```

    ```quiz
    ...
    ```

directly in Markdown. See the syntax notes on format_runpy / format_quiz
below, and the "Adding a new lesson page" section of the README.
"""
import json
import re
import uuid

import yaml

_ESCAPES = (("&", "&amp;"), ("'", "&#39;"), ("<", "&lt;"), (">", "&gt;"))


def _attr_safe(obj) -> str:
    """JSON-encode obj so it can sit inside a single-quoted HTML attribute."""
    payload = json.dumps(obj, ensure_ascii=False)
    for old, new in _ESCAPES:
        payload = payload.replace(old, new)
    return payload


def _split_frontmatter(source: str):
    """Split a fence body on a lone '---' line into (meta_yaml, rest)."""
    parts = re.split(r"(?m)^---\s*$", source, maxsplit=1)
    if len(parts) == 2:
        return parts[0], parts[1].lstrip("\n")
    return "", source


def format_runpy(source, language, css_class, options, md, **kwargs):
    """Render a ```runpy fence into an interactive Python cell.

    Syntax:

        ```runpy
        title: My cell               # shown in the cell header
        sub: optional subtitle       # small grey text after the title
        inputs:                      # optional: adds an "Inputs" box.
          - 12                       # one value per line, fed to input()
          - 8
        input_hint: a, then b        # optional hint text above the box
        packages: [pandas]           # optional: Pyodide packages to load
                                     #   first (pandas, numpy, matplotlib...)
        guard: false                 # optional: turn OFF the infinite-loop
                                     #   guard. It is off automatically
                                     #   whenever `packages` is used, because
                                     #   library code trips the step counter.
        solution: |                  # optional: "Show one answer" button
          perimeter = 2 * (length + width)
        ---
        # everything below the --- is the actual Python code
        print("hello")
        ```

    Cells that request `matplotlib` get any figures they draw rendered
    as images underneath the text output, and every cell gets a
    `DATA_URL` global pointing at the site's `docs/data/` folder.
    """
    header_src, code = _split_frontmatter(source)
    meta = yaml.safe_load(header_src) if header_src.strip() else None
    meta = meta or {}

    cfg = {
        "id": "c-" + uuid.uuid4().hex[:8],
        "title": meta.get("title", "Python"),
        "code": code.rstrip("\n"),
    }
    if meta.get("sub"):
        cfg["sub"] = meta["sub"]
    if meta.get("inputs") is not None:
        vals = meta["inputs"]
        if isinstance(vals, (list, tuple)):
            vals = "\n".join(str(v) for v in vals)
        cfg["inputs"] = str(vals)
        cfg["inputHint"] = meta.get("input_hint", "one value per line")
    if meta.get("solution"):
        cfg["solution"] = meta["solution"].rstrip("\n")

    pkgs = meta.get("packages")
    if pkgs:
        if isinstance(pkgs, str):
            pkgs = [pkgs]
        cfg["packages"] = [str(p) for p in pkgs]

    # The loop guard uses sys.settrace, which library code (pandas in
    # particular) trips almost immediately and which slows execution a lot.
    # Off by default whenever packages are loaded; `guard:` overrides.
    if meta.get("guard") is not None:
        cfg["guard"] = bool(meta["guard"])

    return f"<div data-cell='{_attr_safe(cfg)}'></div>"


def format_quiz(source, language, css_class, options, md, **kwargs):
    """Render a ```quiz fence into a self-graded multiple-choice block.

    Syntax (a plain YAML list — add as many questions as you like):

        ```quiz
        - q: Which of these is an <strong>algorithmic</strong> problem?
          options:
            - Deciding which stock to buy
            - Putting 10,000 names in alphabetical order
          answer: 1        # zero-based index of the correct option
          why: It is solved by a fixed series of actions.
        ```
    """
    items = yaml.safe_load(source) or []
    return f'<div class="quiz" data-quiz=\'{_attr_safe(items)}\'></div>'


def on_config(config, **kwargs):
    """Register the runpy/quiz fences with pymdownx.superfences.

    Done here (rather than as `!!python/name:` entries in mkdocs.yml)
    because this hook file is guaranteed importable — a YAML
    `!!python/name:` reference to a module in this repo would need the
    repo root on sys.path, which MkDocs does not add for you.
    """
    mdx = config.mdx_configs.setdefault("pymdownx.superfences", {})
    fences = mdx.setdefault("custom_fences", [])
    fences.append({"name": "runpy", "class": "runpy-fence", "format": format_runpy})
    fences.append({"name": "quiz", "class": "quiz-fence", "format": format_quiz})
    return config
