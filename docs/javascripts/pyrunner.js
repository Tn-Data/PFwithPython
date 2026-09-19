/* Builds every `<div data-cell='{...}'>` (emitted by hooks/fences.py's
 * ```runpy fence) into an interactive, runnable Python cell using Pyodide.
 * Pyodide itself loads lazily, on the first click of any Run button.
 */
(function () {
  "use strict";

  var Py = { ready: false, loading: false, obj: null, waiters: [], out: null };
  Py.write = function (s) { if (Py.out) Py.out(s); };

  function loadPyodideRuntime(onProgress) {
    if (Py.ready) return Promise.resolve(Py.obj);
    if (Py.loading) return new Promise(function (res) { Py.waiters.push(res); });
    Py.loading = true;
    onProgress("Starting Python (first run only, a few seconds)…");
    return window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" })
      .then(function (py) {
        py.setStdout({ batched: function (t) { Py.write(t + "\n"); } });
        py.setStderr({ batched: function (t) { Py.write(t + "\n"); } });
        Py.obj = py; Py.ready = true; Py.loading = false;
        Py.waiters.forEach(function (w) { w(py); }); Py.waiters = [];
        return py;
      })
      .catch(function (err) { Py.loading = false; throw err; });
  }

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

  function tidyError(msg) {
    var lines = String(msg).split("\n").filter(function (l) { return l.trim() !== ""; });
    var keep = lines.filter(function (l) {
      return l.indexOf("/lib/python") === -1 && l.indexOf("pyodide") === -1;
    });
    if (!keep.length) keep = lines;
    return keep.slice(-8).join("\n");
  }

  function buildCell(host) {
    var cfg;
    try { cfg = JSON.parse(host.getAttribute("data-cell")); }
    catch (e) { console.error("bad runpy cell config", e); return; }

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

    cell.innerHTML =
      '<div class="cell-head">' +
        '<span class="cell-title">' + cfg.title + (cfg.sub ? " <em>— " + cfg.sub + "</em>" : "") + "</span>" +
        '<span class="status" id="' + cfg.id + '-st"></span>' +
        (cfg.solution ? '<button class="btn ghost" id="' + cfg.id + '-sol">Show one answer</button>' : "") +
        '<button class="btn ghost" id="' + cfg.id + '-rs">Reset</button>' +
        '<button class="btn run" id="' + cfg.id + '-go">▶ Run</button>' +
      "</div>" +
      ioHtml +
      '<div class="editor"><textarea id="' + cfg.id + '-code" rows="' + (cfg.code.split("\n").length + 1) +
        '" spellcheck="false" aria-label="Python code: ' + cfg.title + '"></textarea></div>' +
      '<div class="out" id="' + cfg.id + '-out"><div class="out-t">Output</div><pre></pre></div>';

    host.replaceWith(cell);

    var codeEl = cell.querySelector("#" + cfg.id + "-code");
    var inEl = cell.querySelector("#" + cfg.id + "-in");
    var outBox = cell.querySelector("#" + cfg.id + "-out");
    var outPre = outBox.querySelector("pre");
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
      status("Getting Python ready…", "busy");

      loadPyodideRuntime(function (msg) { status(msg, "busy"); })
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
            py.runPython(GUARD);
            ns = py.runPython("dict(__name__='__main__')");
            py.runPython(codeEl.value, { globals: ns });
            if (buf === "") outPre.textContent = "(The program ran with no errors, but it did not print anything.)";
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
