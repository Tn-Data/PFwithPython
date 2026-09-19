/* Builds every `<div data-cell='{...}'>` (emitted by hooks/hooks.py's
 * ```runpy fence) into an interactive, runnable Python cell using Pyodide.
 *
 * Pyodide itself loads lazily, on the first click of any Run button.
 * Extra packages (pandas, numpy, matplotlib) load lazily too, the first
 * time a cell that asks for them is run, and are then cached for the
 * rest of the page.
 */
(function () {
  "use strict";

  var PYODIDE_VERSION = "0.26.4";
  var PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/";

  var Py = { ready: false, loading: false, obj: null, waiters: [], out: null, loaded: {} };
  Py.write = function (s) { if (Py.out) Py.out(s); };

  /* ---------- site data folder (docs/data/) -----------------------------
   * Derived from the stylesheet URL so it is correct whether the site is
   * served from the domain root or from a GitHub Pages project subpath.
   */
  function siteDataUrl() {
    var link = document.querySelector('link[rel="stylesheet"][href*="stylesheets/extra.css"]');
    if (link) return link.href.replace(/stylesheets\/extra\.css.*$/, "data/");
    return new URL("data/", document.baseURI).href;
  }

  /* ---------- runtime ---------------------------------------------------- */
  function loadPyodideRuntime(onProgress) {
    if (Py.ready) return Promise.resolve(Py.obj);
    if (Py.loading) return new Promise(function (res) { Py.waiters.push(res); });
    Py.loading = true;
    onProgress("Starting Python (first run only, this takes a few seconds)…");
    return window.loadPyodide({ indexURL: PYODIDE_INDEX })
      .then(function (py) {
        py.setStdout({ batched: function (t) { Py.write(t + "\n"); } });
        py.setStderr({ batched: function (t) { Py.write(t + "\n"); } });
        py.globals.set("DATA_URL", siteDataUrl());
        Py.obj = py; Py.ready = true; Py.loading = false;
        Py.waiters.forEach(function (w) { w(py); }); Py.waiters = [];
        return py;
      })
      .catch(function (err) { Py.loading = false; throw err; });
  }

  function ensurePackages(py, pkgs, onProgress) {
    if (!pkgs || !pkgs.length) return Promise.resolve();
    var needed = pkgs.filter(function (p) { return !Py.loaded[p]; });
    if (!needed.length) return Promise.resolve();
    onProgress("Downloading " + needed.join(", ") + " (first time only, this is a big one)…");
    return py.loadPackage(needed).then(function () {
      needed.forEach(function (p) { Py.loaded[p] = true; });
      // Libraries emit housekeeping warnings on import (pandas' pyarrow notice,
      // for one) that would bury a student's actual output. Silence them before
      // the cell's own imports run.
      py.runPython([
        "import warnings",
        "warnings.filterwarnings('ignore', category=DeprecationWarning)",
        "warnings.filterwarnings('ignore', category=FutureWarning)",
        "warnings.filterwarnings('ignore', category=UserWarning)"
      ].join("\n"));
      if (needed.indexOf("matplotlib") !== -1) {
        // Render figures to an in-memory buffer; we capture them as PNGs below.
        py.runPython("import matplotlib\nmatplotlib.use('AGG')");
      }
    });
  }

  /* ---------- infinite-loop guard ---------------------------------------
   * Counts executed lines and stops runaway loops with a friendly message.
   * Deliberately skipped for cells that load packages: library internals
   * blow past any sane threshold and settrace slows them to a crawl.
   */
  var GUARD = [
    "import sys as _sys",
    "def _mk_guard():",
    "    box = [0]",
    "    def g(frame, event, arg):",
    "        box[0] += 1",
    "        if box[0] > 400000:",
    '            raise RuntimeError("Your program ran too long. This almost always means a loop that never ends - check the line that updates your counter variable.")',
    "        return g",
    "    return g",
    "_sys.settrace(_mk_guard())"
  ].join("\n");

  /* ---------- input() shim ------------------------------------------------ */
  function makeInputShim(py, lines) {
    py.globals.set("_feed_js", lines);
    py.runPython([
      "import builtins",
      "_queue = [str(x) for x in _feed_js]",
      'def _input(prompt=""):',
      "    if prompt:",
      '        print(prompt, end="")',
      "    if not _queue:",
      '        raise EOFError("The program asked for another input, but the Inputs box is empty. Add one more line above and press Run again.")',
      "    v = _queue.pop(0)",
      "    print(v)",
      "    return v",
      "builtins.input = _input"
    ].join("\n"));
  }

  /* ---------- matplotlib figure capture ----------------------------------- */
  var CAPTURE_FIGS = [
    "def _grab_figs():",
    "    import sys",
    "    if 'matplotlib' not in sys.modules:",
    "        return []",
    "    import io, base64",
    "    import matplotlib.pyplot as plt",
    "    out = []",
    "    for num in plt.get_fignums():",
    "        fig = plt.figure(num)",
    "        buf = io.BytesIO()",
    "        fig.savefig(buf, format='png', dpi=110, bbox_inches='tight')",
    "        out.append(base64.b64encode(buf.getvalue()).decode())",
    "    plt.close('all')",
    "    return out",
    "_grab_figs()"
  ].join("\n");

  function tidyError(msg) {
    var lines = String(msg).split("\n").filter(function (l) { return l.trim() !== ""; });
    var keep = lines.filter(function (l) {
      return l.indexOf("/lib/python") === -1 && l.indexOf("pyodide") === -1;
    });
    if (!keep.length) keep = lines;
    return keep.slice(-8).join("\n");
  }

  /* ---------- cell construction -------------------------------------------- */
  function buildCell(host) {
    var cfg;
    try { cfg = JSON.parse(host.getAttribute("data-cell")); }
    catch (e) { console.error("bad runpy cell config", e); return; }

    var pkgs = cfg.packages || [];
    var useGuard = (cfg.guard !== undefined) ? cfg.guard : (pkgs.length === 0);

    var cell = document.createElement("div");
    cell.className = "cell";

    var ioHtml = "";
    if (typeof cfg.inputs === "string") {
      var rows = Math.max(2, Math.min(5, cfg.inputs.split("\n").length));
      ioHtml =
        '<div class="io">' +
          '<label for="' + cfg.id + '-in">Inputs' +
            '<span class="hint">' + (cfg.inputHint || "one value per line") + "</span>" +
          "</label>" +
          '<textarea id="' + cfg.id + '-in" rows="' + rows + '" spellcheck="false"></textarea>' +
        "</div>";
    }

    var pkgBadge = pkgs.length
      ? '<span class="pkgs" title="This cell downloads these libraries the first time you run it">' +
        pkgs.join(" · ") + "</span>"
      : "";

    cell.innerHTML =
      '<div class="cell-head">' +
        '<span class="cell-title">' + cfg.title + (cfg.sub ? " <em>— " + cfg.sub + "</em>" : "") + "</span>" +
        pkgBadge +
        '<span class="status" id="' + cfg.id + '-st"></span>' +
        (cfg.solution ? '<button class="btn ghost" id="' + cfg.id + '-sol">Show one answer</button>' : "") +
        '<button class="btn ghost" id="' + cfg.id + '-rs">Reset</button>' +
        '<button class="btn run" id="' + cfg.id + '-go">▶ Run</button>' +
      "</div>" +
      ioHtml +
      '<div class="editor"><textarea id="' + cfg.id + '-code" rows="' + (cfg.code.split("\n").length + 1) +
        '" spellcheck="false" aria-label="Python code: ' + cfg.title + '"></textarea></div>' +
      '<div class="out" id="' + cfg.id + '-out"><div class="out-t">Output</div><pre></pre>' +
        '<div class="figs"></div></div>';

    host.replaceWith(cell);

    var codeEl = cell.querySelector("#" + cfg.id + "-code");
    var inEl = cell.querySelector("#" + cfg.id + "-in");
    var outBox = cell.querySelector("#" + cfg.id + "-out");
    var outPre = outBox.querySelector("pre");
    var figBox = outBox.querySelector(".figs");
    var runBtn = cell.querySelector("#" + cfg.id + "-go");
    var rstBtn = cell.querySelector("#" + cfg.id + "-rs");
    var solBtn = cell.querySelector("#" + cfg.id + "-sol");
    var stEl = cell.querySelector("#" + cfg.id + "-st");

    function fit() {
      codeEl.style.height = "auto";
      var h = codeEl.scrollHeight;
      if (h > 0) codeEl.style.height = (h + 4) + "px";
    }
    codeEl.value = cfg.code;
    if (inEl) inEl.value = cfg.inputs;
    fit();
    codeEl.addEventListener("input", fit);
    window.addEventListener("resize", fit);

    codeEl.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = codeEl.selectionStart, en = codeEl.selectionEnd;
        codeEl.value = codeEl.value.slice(0, s) + "    " + codeEl.value.slice(en);
        codeEl.selectionStart = codeEl.selectionEnd = s + 4;
        fit();
      }
    });

    rstBtn.addEventListener("click", function () {
      codeEl.value = cfg.code;
      if (inEl) inEl.value = cfg.inputs;
      outBox.classList.remove("show");
      figBox.innerHTML = "";
      stEl.innerHTML = "";
      fit();
    });

    if (solBtn) {
      solBtn.addEventListener("click", function () {
        outBox.classList.add("show");
        outPre.className = "";
        outPre.textContent = "One correct way to write this:\n\n" + cfg.solution;
      });
    }

    function status(txt, cls) {
      stEl.innerHTML = txt ? '<span class="dot ' + (cls || "") + '"></span>' + txt : "";
    }

    runBtn.addEventListener("click", function () {
      runBtn.disabled = true;
      outBox.classList.add("show");
      outPre.className = "";
      outPre.textContent = "";
      figBox.innerHTML = "";
      status("Getting Python ready…", "busy");

      loadPyodideRuntime(function (msg) { status(msg, "busy"); })
        .then(function (py) {
          return ensurePackages(py, pkgs, function (msg) { status(msg, "busy"); })
            .then(function () { return py; });
        })
        .then(function (py) {
          status("Running…", "busy");
          var buf = "";
          Py.out = function (t) { buf += t; outPre.textContent = buf; };

          var lines = inEl ? inEl.value.split("\n").filter(function (l, i, a) {
            return !(l === "" && i === a.length - 1);
          }) : [];

          var ns = null;
          try {
            makeInputShim(py, lines);
            if (useGuard) py.runPython(GUARD);
            ns = py.runPython("dict(__name__='__main__', DATA_URL=DATA_URL)");
            py.runPython(codeEl.value, { globals: ns });
            if (useGuard) py.runPython("import sys as _s; _s.settrace(None)");

            // Render any matplotlib figures the cell produced.
            var figs = [];
            try {
              var res = py.runPython(CAPTURE_FIGS);
              if (res) { figs = res.toJs ? res.toJs() : res; if (res.destroy) res.destroy(); }
            } catch (e) { /* no matplotlib in this cell */ }

            figs.forEach(function (b64) {
              var img = document.createElement("img");
              img.src = "data:image/png;base64," + b64;
              img.alt = "Chart produced by this code";
              figBox.appendChild(img);
            });

            if (buf === "" && !figs.length) {
              outPre.textContent = "(The program ran with no errors, but it did not print anything.)";
            }
            status("Finished", "ok");
          } catch (err) {
            outPre.className = "err";
            outPre.textContent = (buf ? buf + "\n" : "") + tidyError(err && err.message ? err.message : err);
            status("Stopped by an error", "");
          } finally {
            try { py.runPython("import sys as _s; _s.settrace(None)"); } catch (e) {}
            if (ns && ns.destroy) { try { ns.destroy(); } catch (e) {} }
            Py.out = null;
            runBtn.disabled = false;
          }
        })
        .catch(function (err) {
          outPre.className = "err";
          outPre.textContent = (err && err.message) || String(err);
          status("Could not start Python", "");
          runBtn.disabled = false;
        });
    });
  }

  function init() {
    document.querySelectorAll("[data-cell]").forEach(buildCell);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
