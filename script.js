(async function () {
  const $q = document.getElementById("question");
  const $p = document.getElementById("progress");
  const $r = document.getElementById("result");
  const $quiz = document.getElementById("quiz");

  function showFatal(msg){
    $quiz.innerHTML = `
      <div style="color:#b00020; font-weight:700;">데이터를 불러오지 못했습니다.</div>
      <div class="small" style="margin-top:8px; white-space:pre-wrap;">${msg}</div>
    `;
  }

  let data;
  try{
    const res = await fetch("./data.json", { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    data = await res.json();
  }catch(e){
    showFatal(String(e));
    return;
  }

  const questions = data.questions;
  const results = data.results;

  let idx = 0;
  const score = {};
  Object.keys(results).forEach(k => score[k] = 0);

  function render() {
    $p.textContent = `${idx + 1} / ${questions.length}`;
    $q.textContent = questions[idx].text;
  }

  function addScore(choice) {
    const add = questions[idx][choice];
    Object.keys(score).forEach(k => score[k] += (add[k] || 0));
  }

function finish() {
  // 질문 카드 숨기기 (여기서만!)
  $quiz.style.display = "none";

  const sorted = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  const [topKey, topVal] = sorted[0];

  const top = results[topKey];

  $r.classList.remove("hidden");

  const img = top.image
    ? `<img src="${encodeURI(top.image)}" class="result-img" alt="${top.title}">`
    : "";

  $r.innerHTML = `
    <div><span class="pill">결과</span> <b>${top.title}</b></div>
    ${img}
    <p>${top.desc}</p>
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

  if (!Array.isArray(questions) || questions.length === 0) {
    showFatal("data.json 안의 questions가 비어있습니다.");
    return;
  }

  render();
})();
