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
    // idx가 범위를 넘어가면 render하지 않고 finish로
    if (idx >= questions.length) {
      finish();
      return;
    }
    $p.textContent = `${idx + 1} / ${questions.length}`;
    $q.textContent = questions[idx].text;
  }

  function addScore(choice) {
    const add = questions[idx][choice];
    Object.keys(score).forEach(k => score[k] += (add[k] || 0));
  }

  function finish() {
    // 질문 카드 완전 제거
    $quiz.classList.add("hidden");
    // 혹시 hidden이 CSS에서 씹히는 경우 대비(보험)
    $quiz.style.display = "none";

    const sorted = Object.entries(score).sort((a,b)=>b[1]-a[1]);
    const [topKey, topVal] = sorted[0];
    const [subKey, subVal] = sorted[1] || [null, null];

    const top = results[topKey];
    const sub = subKey ? results[subKey] : null;

    // 결과 영역 보이게 + 카드 클래스 붙이기
    $r.classList.remove("hidden");
    $r.classList.add("card");

    const img = top.image
      ? `<img src="${encodeURI(top.image)}" class="result-img" alt="${top.title}">`
      : "";

    // (원하시면 2순위도 다시 붙여드릴게요. 일단 안정 버전)
    $r.innerHTML = `
      <div>
        <span class="pill">결과</span>
        <b style="font-size:18px;">${top.title}</b>
        <span style="opacity:.7;">(${topVal}점)</span>
      </div>
      ${img}
      <p style="margin:10px 0 6px; line-height:1.6;">${top.desc || ""}</p>
      ${top.rare ? `<p class="small" style="margin:0 0 10px;">${top.rare}</p>` : ""}
      ${top.job ? `<p class="small"><b>추천 분야</b><br>${top.job}</p>` : ""}
      ${
        top.cta && top.link
          ? `
            <div class="cta-box">
              <p class="small" style="margin:0;">${top.cta}</p>
              <a class="cta-btn" href="${top.link}" target="_blank" rel="noopener" style="margin-top:10px; display:inline-block;">
                플래뮤 망원 네이버플레이스 바로가기
              </a>
            </div>
          `
          : ""
      }
      <button class="btn" id="restart" style="margin-top:14px;">다시 하기</button>
    `;

    document.getElementById("restart").addEventListener("click", () => location.reload());
    $p.textContent = "완료";
  }

  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-choice]");
    if (!btn) return;

    addScore(btn.dataset.choice);
    idx++;
    render();
  });

  if (!Array.isArray(questions) || questions.length === 0) {
    showFatal("data.json 안의 questions가 비어있습니다.");
    return;
  }

  // 시작 상태 정리: 결과 숨김 확정, 질문 보임 확정
  $r.classList.add("hidden");
  $quiz.classList.remove("hidden");
  $quiz.style.display = "";

  render();
})();
