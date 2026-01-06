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
  const sorted = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  const [topKey, topVal] = sorted[0];

  const top = results[topKey];

  // 1️⃣ 질문 카드 완전히 제거
  $quiz.classList.add("hidden");

  // 2️⃣ 결과 카드 준비
  $r.className = "card";   // 🔥 hidden 제거 + card 부여를 한 번에
  
  const img = top.image
    ? `<img src="${encodeURI(top.image)}" class="result-img" alt="${top.title}">`
    : "";

  // 3️⃣ 내용 채우기
  $r.innerHTML = `
    <div><span class="pill">결과</span> <b style="font-size:18px;">${top.title}</b></div>
    ${img}
    <p>${top.desc}</p>
    ${top.rare ? `<p class="small">${top.rare}</p>` : ""}
    <p class="small"><b>추천 분야</b><br>${top.job}</p>

    <div class="cta-box">
      <p class="small">${top.cta}</p>
      <a class="cta-btn" href="${top.link}" target="_blank" rel="noopener">
        플래뮤 망원 바로가기
      </a>
    </div>

    <button class="btn" onclick="location.reload()" style="margin-top:14px;">
      다시 하기
    </button>
  `;
}


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
