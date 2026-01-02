(async function () {
  const res = await fetch("./data.json");
  const data = await res.json();

  const questions = data.questions;
  const results = data.results;

  let idx = 0;
  const score = { cubism:0, impression:0, surreal:0, construct:0 };

  const $q = document.getElementById("question");
  const $p = document.getElementById("progress");
  const $r = document.getElementById("result");
  const $quiz = document.getElementById("quiz");

  function render() {
    $p.textContent = `${idx + 1} / ${questions.length}`;
    $q.textContent = questions[idx].text;
  }

  function addScore(choice) {
    const add = questions[idx][choice];
    Object.keys(score).forEach(k => score[k] += add[k] || 0);
  }

  function finish() {
    const sorted = Object.entries(score).sort((a,b)=>b[1]-a[1]);
    const [topKey] = sorted[0];
    const r = results[topKey];

    $quiz.classList.add("hidden");
    $r.classList.remove("hidden");

    $r.innerHTML = `
      <span class="pill">결과</span>
      <h2 style="margin-top:8px">${r.title}</h2>
      <img src="${r.image}" class="result-img" alt="">
      <p style="line-height:1.6">${r.desc}</p>
      <p class="small"><b>추천 자극</b><br>${r.tip}</p>
      <button class="btn" onclick="location.reload()">다시 하기</button>
    `;
  }

  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-choice]");
    if (!btn) return;

    addScore(btn.dataset.choice);
    idx++;

    if (idx >= questions.length) finish();
    else render();
  });

  render();
})();
