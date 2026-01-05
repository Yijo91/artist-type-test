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
    const [subKey, subVal] = sorted[1];

    const top = results[topKey];
    const sub = results[subKey];

    $quiz.classList.add("hidden");
    $r.classList.remove("hidden");

  const img = top.image
    ? `<img src="${encodeURI(top.image)}" class="result-img" alt="${top.title}">`
    : "";

  $r.innerHTML = `
  <div>
    <span class="pill">결과</span>
    <b style="font-size:18px;">${top.title}</b>
    <span style="opacity:.7">(${topVal}점)</span>
  </div>

  ${img}

  <p style="margin:10px 0 6px; line-height:1.6;">
    ${top.desc}
  </p>

  ${top.rare ? `
    <p class="small" style="margin:0 0 12px; line-height:1.6;">
      ${top.rare}
    </p>
  ` : ""}

  ${top.job ? `
    <p class="small" style="margin:12px 0;">
      <b>${top.job}</b>
    </p>
  ` : ""}

  ${top.cta ? `
    <div class="cta-box" style="margin:16px 0; padding:14px; background:#f3f0ea; border-radius:10px;">
      <p style="margin:0 0 8px; line-height:1.6;">
        ${top.cta}
      </p>
      <a href="${top.link}" target="_blank"
         style="display:inline-block; margin-top:6px; font-weight:700; text-decoration:underline;">
        플래뮤 망원 네이버 플레이스로 바로가기
      </a>
    </div>
  ` : ""}

  <button class="btn" onclick="location.reload()" style="margin-top:14px;">
    다시 하기
  </button>
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
