/* Builds every `<div data-quiz='[...]'>` (emitted by hooks/fences.py's
 * ```quiz fence) into a self-graded multiple-choice block.
 */
(function () {
  "use strict";

  function buildQuiz(host) {
    var items;
    try { items = JSON.parse(host.getAttribute("data-quiz")); }
    catch (e) { console.error("bad quiz config", e); return; }
    if (!Array.isArray(items) || !items.length) return;

    var wrap = document.createElement("div");
    var answered = {}, correct = 0;

    var scoreEl = document.createElement("div");
    scoreEl.className = "quiz-score";

    items.forEach(function (item, qi) {
      var block = document.createElement("div");
      block.className = "quiz-block";
      var html = '<p class="qt">' + (qi + 1) + ". " + item.q + '</p><div class="quiz-opts">';
      (item.options || []).forEach(function (opt, oi) {
        html += '<label class="quiz-opt" data-o="' + oi + '">' +
                '<input type="radio" name="' + host.id + "-q" + qi + '">' +
                "<span>" + opt + "</span></label>";
      });
      html += '</div><p class="quiz-verdict"></p>';
      block.innerHTML = html;
      wrap.appendChild(block);

      var verdict = block.querySelector(".quiz-verdict");
      block.querySelectorAll(".quiz-opt").forEach(function (lab) {
        lab.addEventListener("click", function () {
          if (answered[qi]) return;
          answered[qi] = true;
          var chosen = Number(lab.dataset.o);
          var right = chosen === item.answer;
          if (right) correct++;
          block.querySelectorAll(".quiz-opt").forEach(function (l) {
            var oi = Number(l.dataset.o);
            if (oi === item.answer) l.classList.add("right");
            else if (oi === chosen) l.classList.add("wrong");
            l.querySelector("input").disabled = true;
          });
          verdict.innerHTML = right
            ? '<b style="color:var(--olive)">Correct.</b> ' + (item.why || "")
            : '<b style="color:var(--crimson)">Not this one.</b> ' + (item.why || "");
          verdict.classList.add("show");
          var done = Object.keys(answered).length;
          scoreEl.textContent = "Answered " + done + " of " + items.length + " — " + correct + " correct.";
        });
      });
    });

    wrap.appendChild(scoreEl);
    host.replaceWith(wrap);
  }

  function init() {
    document.querySelectorAll("[data-quiz]").forEach(function (el, i) {
      if (!el.id) el.id = "quiz-" + i;
      buildQuiz(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
