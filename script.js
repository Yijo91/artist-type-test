// 4개 파: cubism(입체), impression(인상), surreal(초현실), construct(구성)
const questions = [
  {
    text: "나는 노을을 볼 때 색보다 구조가 먼저 보인다.",
    yes: { cubism:4, construct:3, impression:1, surreal:2 },
    mid: { cubism:2, construct:2, impression:2, surreal:2 },
    no:  { cubism:1, construct:1, impression:4, surreal:3 }
  },
  {
    text: "그림은 설명 없이도 전달되어야 한다고 생각한다.",
    yes: { impression:4, surreal:3, cubism:1, construct:1 },
    mid: { impression:2, surreal:2, cubism:2, construct:2 },
    no:  { construct:4, cubism:3, surreal:1, impression:1 }
  },
  {
    text: "나는 작품을 만들 때 우연을 환영한다.",
    yes: { surreal:4, impression:3, cubism:2, construct:1 },
    mid: { surreal:2, impression:2, cubism:2, construct:2 },
    no:  { construct:4, cubism:3, impression:1, surreal:1 }
  },
  {
    text: "하나의 대상을 여러 각도에서 보는 것이 흥미롭다.",
    yes: { cubism:4, construct:3, surreal:2, impression:1 },
    mid: { cubism:2, construct:2, surreal:2, impression:2 },
    no:  { impression:4, surreal:3, construct:1, cubism:1 }
  },
  {
    text: "감정은 정리되지 않아도 가치가 있다.",
    yes: { impression:4, surreal:3, cubism:1, construct:1 },
    mid: { impression:2, surreal:2, cubism:2, construct:2 },
    no:  { construct:4, cubism:3, impression:1, surreal:1 }
  },
  {
    text: "나는 규칙을 만든 뒤 깨는 편이다.",
    yes: { cubism:3, surreal:4, construct:2, impression:1 },
    mid: { cubism:2, surreal:2, construct:2, impression:2 },
    no:  { construct:4, impression:3, cubism:1, surreal:1 }
  },
  {
    text: "작품은 현실과 닮지 않아도 된다고 생각한다.",
    yes: { surreal:4, construct:3, cubism:2, impression:1 },
    mid: { surreal:2, construct:2, cubism:2, impression:2 },
    no:  { impression:4, cubism:3, construct:1, surreal:1 }
  },
  {
    text: "나는 감각보다 개념에 더 흥미를 느낀다.",
    yes: { cubism:4, construct:3, surreal:2, impression:1 },
    mid: { cubism:2, construct:2, surreal:2, impression:2 },
    no:  { impression:4, surreal:3, cubism:1, construct:1 }
  },
  {
    text: "즉흥적인 낙서가 완성작보다 좋을 때가 있다.",
    yes: { impression:4, surreal:3, cubism:2, construct:1 },
    mid: { impression:2, surreal:2, cubism:2, construct:2 },
    no:  { construct:4, cubism:3, impression:1, surreal:1 }
  },
  {
    text: "나는 ‘왜 이렇게 만들었는지’ 설명하는 걸 싫어한다.",
    yes: { impression:4, surreal:3, cubism:1, construct:1 },
    mid: { impression:2, surreal:2, cubism:2, construct:2 },
    no:  { construct:4, cubism:3, surreal:1, impression:1 }
  }
];

const results = {
  cubism: {
    title: "입체파 (Picasso 계열)",
    desc: "감정보다 구조를 먼저 만지십니다. 대상을 분해하고 재조합해 ‘다른 진실’을 만들어내는 타입입니다.",
    tip: "팁: 한 대상을 3개의 각도로 쪼개 스케치한 뒤, 한 화면에 합쳐보십시오."
  },
  impression: {
    title: "인상파 (Van Gogh 계열)",
    desc: "순간의 공기와 감정 밀도를 색으로 기억하십니다. ‘설명’보다 ‘체감’이 우선인 타입입니다.",
    tip: "팁: 같은 장면을 10분 간격으로 3장 그려 색의 변화만 잡아보십시오."
  },
  surreal: {
    title: "초현실주의 (Dalí 계열)",
    desc: "논리 밖에서 더 정확한 감각을 찾으십니다. 상징과 꿈, 이상함을 ‘재료’로 쓰는 타입입니다.",
    tip: "팁: 꿈에서 본 물체 3개를 적고, 그 3개를 한 생물로 합성해보십시오."
  },
  construct: {
    title: "추상·구성주의 (Mondrian 계열)",
    desc: "아름다움을 ‘정리’하고 ‘통제’해내는 타입입니다. 규칙을 만들수록 더 자유로워지십니다.",
    tip: "팁: 제한을 걸어보십시오(색 2개, 선 6개). 그 안에서만 완성해보시면 됩니다."
  }
};

let idx = 0;
const score = { cubism:0, impression:0, surreal:0, construct:0 };

const $q = document.getElementById("question");
const $p = document.getElementById("progress");
const $r = document.getElementById("result");

function render() {
  $p.textContent = `${idx + 1} / ${questions.length}`;
  $q.textContent = questions[idx].text;
}

function addScore(choiceKey) {
  const add = questions[idx][choiceKey];
  Object.keys(score).forEach(k => score[k] += (add[k] || 0));
}

function finish() {
  // 1위/2위 뽑기
  const entries = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  const [topKey, topVal] = entries[0];
  const [subKey, subVal] = entries[1];

  const top = results[topKey];
  const sub = results[subKey];

  $r.classList.remove("hidden");
  $r.innerHTML = `
    <div>
      <span class="tag">최종</span><strong>${top.title}</strong> <span style="opacity:.7">(${topVal}점)</span>
    </div>
    <p style="margin:10px 0 8px; line-height:1.55;">${top.desc}</p>
    <div class="small">${top.tip}</div>
    <hr style="border:none;border-top:1px solid #2b3342; margin:14px 0;">
    <div class="small"><span class="tag">2순위</span><strong>${sub.title}</strong> <span style="opacity:.7">(${subVal}점)</span></div>
    <div class="small" style="margin-top:8px; opacity:.75;">(2순위는 ‘잠재 성향’으로 같이 뜨게 해두면 공유할 때 더 그럴싸해집니다.)</div>
    <button class="btn" id="restart" style="margin-top:14px; width:100%;">다시 하기</button>
  `;

  document.querySelector(".qbox").classList.add("hidden");
  document.getElementById("progress").textContent = "완료";

  document.getElementById("restart").onclick = () => location.reload();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-choice]");
  if (!btn) return;

  const choice = btn.dataset.choice; // yes/mid/no
  addScore(choice);

  idx++;
  if (idx >= questions.length) finish();
  else render();
});

render();
