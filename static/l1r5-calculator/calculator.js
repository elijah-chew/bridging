const SUBJECTS = [
  { name: "English", cat: "el" },
  { name: "Higher Mother Tongue", cat: "hmtl" },
  { name: "Mother Tongue", cat: "mtl" },
  { name: "Elementary Mathematics", cat: "math" },
  { name: "Additional Mathematics", cat: "math" },
  { name: "Combined Humanities", cat: "hum" },
  { name: "History", cat: "hum" },
  { name: "Geography", cat: "hum" },
  { name: "Literature", cat: "hum" },
  { name: "Combined Science", cat: "sci" },
  { name: "Physics", cat: "sci" },
  { name: "Chemistry", cat: "sci" },
  { name: "Biology", cat: "sci" },
  { name: "Principles of Accounts", cat: "poa" },
  { name: "Computing", cat: "others" },
  { name: "Design & Technology", cat: "others" },
  { name: "Nutrition & Food Science", cat: "others" },
  { name: "Art", cat: "art" },
  { name: "Music", cat: "art" },
  { name: "Business Studies", cat: "hum" },
];

const CATS = [
  ["el", "English"],
  ["hmtl", "Higher MTL"],
  ["mtl", "Mother Tongue"],
  ["hum", "Humanities"],
  ["math", "Mathematics"],
  ["sci", "Science"],
  ["poa", "POA"],
  ["art", "Art / Music"],
  ["others", "Other"],
  ["rk", "Religious Knowledge (excluded)"],
];

const HUM = new Set(["hum", "art"]);
const MATHSCI = new Set(["math", "sci"]);
const ELR2 = {
  A: {
    r1: new Set(["hum", "art"]),
    r2: new Set(["hum", "art", "math", "sci", "poa", "others", "mtl", "hmtl"]),
  },
  B: {
    r1: new Set(["math"]),
    r2: new Set(["hum", "art", "poa", "others", "mtl", "hmtl"]),
  },
  C: {
    r1: new Set(["math"]),
    r2: new Set(["sci"]),
  },
  D: {
    r1: new Set(["math"]),
    r2: new Set(["art", "poa", "others"]),
  },
};

const GRADE_OPTS = Array.from({ length: 9 }, (_, i) => i + 1);

function combinations(arr, k) {
  const out = [];
  const n = arr.length;
  if (k > n || k <= 0) return out;
  const idx = Array.from({ length: k }, (_, i) => i);
  const take = () => idx.map((i) => arr[i]);
  out.push(take());
  while (true) {
    let i = k - 1;
    while (i >= 0 && idx[i] === n - k + i) i -= 1;
    if (i < 0) break;
    idx[i] += 1;
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
    out.push(take());
  }
  return out;
}

function parseRows() {
  return [...document.querySelectorAll(".subject-row")].map((row) => ({
    name: row.querySelector(".name").value.trim(),
    cat: row.querySelector(".cat").value,
    grade: Number(row.querySelector(".grade").value),
  })).filter((s) => s.name && s.grade >= 1 && s.grade <= 9 && s.cat !== "rk");
}

function withoutConflict(subjects, usedHmtl) {
  return subjects.filter((s) => {
    if (usedHmtl && s.cat === "mtl") return false;
    if (!usedHmtl && s.cat === "hmtl" && subjects.some((x) => x.cat === "mtl" && x !== s)) {
      return true;
    }
    return true;
  });
}

function bestL1R5(subjects) {
  const l1s = subjects.filter((s) => s.cat === "el" || s.cat === "hmtl");
  let best = null;
  for (const l1 of l1s) {
    const usedHmtl = l1.cat === "hmtl";
    const rest = subjects.filter((s) => s !== l1 && !(usedHmtl && s.cat === "mtl"));
    if (rest.length < 5) continue;
    for (const five of combinations(rest, 5)) {
      const hum = five.filter((s) => HUM.has(s.cat)).length;
      const ms = five.filter((s) => MATHSCI.has(s.cat)).length;
      if (hum < 1 || ms < 1) continue;
      const gross = l1.grade + five.reduce((a, s) => a + s.grade, 0);
      if (!best || gross < best.gross) {
        best = { gross, l1, relevant: five };
      }
    }
  }
  return best;
}

function bestL1R4(subjects, mode) {
  const l1s = subjects.filter((s) => s.cat === "el" || s.cat === "hmtl");
  let best = null;
  for (const l1 of l1s) {
    const usedHmtl = l1.cat === "hmtl";
    const rest = subjects.filter((s) => s !== l1 && !(usedHmtl && s.cat === "mtl"));
    if (mode === "2028") {
      const r1 = rest.filter((s) => HUM.has(s.cat)).sort((a, b) => a.grade - b.grade)[0];
      const r2 = rest.filter((s) => MATHSCI.has(s.cat) && s !== r1).sort((a, b) => a.grade - b.grade)[0];
      if (!r1 || !r2) continue;
      const rem = rest.filter((s) => s !== r1 && s !== r2);
      const r3 = rem.filter((s) => HUM.has(s.cat) || MATHSCI.has(s.cat)).sort((a, b) => a.grade - b.grade)[0];
      if (!r3) continue;
      const r4 = rem.filter((s) => s !== r3).sort((a, b) => a.grade - b.grade)[0];
      if (!r4) continue;
      const relevant = [r1, r2, r3, r4];
      const gross = l1.grade + relevant.reduce((a, s) => a + s.grade, 0);
      if (!best || gross < best.gross) best = { gross, l1, relevant };
    } else {
      if (rest.length < 4) continue;
      for (const four of combinations(rest, 4)) {
        const hum = four.filter((s) => HUM.has(s.cat)).length;
        const ms = four.filter((s) => MATHSCI.has(s.cat)).length;
        if (hum < 1 || ms < 1) continue;
        const gross = l1.grade + four.reduce((a, s) => a + s.grade, 0);
        if (!best || gross < best.gross) best = { gross, l1, relevant: four };
      }
    }
  }
  return best;
}

function bestELR2B2(subjects, type) {
  const el = subjects.filter((s) => s.cat === "el").sort((a, b) => a.grade - b.grade)[0];
  if (!el) return null;
  const rest = subjects.filter((s) => s !== el);
  const { r1: r1set, r2: r2set } = ELR2[type];
  let best = null;
  for (const r1 of rest.filter((s) => r1set.has(s.cat))) {
    for (const r2 of rest.filter((s) => s !== r1 && r2set.has(s.cat))) {
      const others = rest.filter((s) => s !== r1 && s !== r2).sort((a, b) => a.grade - b.grade);
      if (others.length < 2) continue;
      const b1 = others[0];
      const b2 = others[1];
      const gross = el.grade + r1.grade + r2.grade + b1.grade + b2.grade;
      if (!best || gross < best.gross) best = { gross, l1: el, relevant: [r1, r2, b1, b2] };
    }
  }
  return best;
}

function jcBonus(cca, hmtl, affiliated, lep, cap) {
  const base = Math.min(cap, cca + (hmtl ? 2 : 0) + (affiliated ? 2 : 0));
  return base + (lep ? 2 : 0);
}

function names(sel) {
  if (!sel) return "—";
  return [sel.l1, ...sel.relevant].map((s) => `${s.name} (${s.grade})`).join(" · ");
}

function resultCard(title, sel, bonus, capNote, eligible) {
  const net = sel ? sel.gross - bonus : null;
  return `<article class="result">
    <span class="badge">${title}</span>
    <strong>${net == null ? "—" : net}</strong>
    <div class="meta">Gross ${sel ? sel.gross : "—"} · bonus −${bonus}${capNote ? ` · ${capNote}` : ""}</div>
    <div class="meta">${eligible || ""}</div>
    <div class="meta">${names(sel)}</div>
  </article>`;
}

function addRow(preset) {
  const row = document.createElement("div");
  row.className = "subject-row";
  const name = document.createElement("input");
  name.className = "name grow";
  name.value = preset?.name || "";
  name.placeholder = "Subject";
  const cat = document.createElement("select");
  cat.className = "cat";
  for (const [value, label] of CATS) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    cat.appendChild(o);
  }
  cat.value = preset?.cat || "others";
  const grade = document.createElement("select");
  grade.className = "grade";
  for (const g of GRADE_OPTS) {
    const o = document.createElement("option");
    o.value = String(g);
    o.textContent = String(g);
    grade.appendChild(o);
  }
  grade.value = "4";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "ghost";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    row.remove();
    compute();
  });
  row.append(name, cat, grade, remove);
  row.addEventListener("change", compute);
  row.addEventListener("input", compute);
  document.getElementById("subjects").appendChild(row);
}

function compute() {
  const subjects = parseRows();
  const cca = Number(document.getElementById("cca").value);
  const hmtl = document.getElementById("hmtl-pass").checked;
  const affiliated = document.getElementById("affiliated").checked;
  const lep = document.getElementById("lep").checked;
  const l1r5 = bestL1R5(subjects);
  const l1r4 = bestL1R4(subjects, "current");
  const l1r4b = bestL1R4(subjects, "2028");
  const bonusJc = jcBonus(cca, hmtl, affiliated, lep, 4);
  const bonus28 = jcBonus(cca, hmtl, affiliated, lep, 3);
  const bonusPoly = Math.min(2, cca);
  const types = ["A", "B", "C", "D"].map((t) => [t, bestELR2B2(subjects, t)]);
  const elig5 = l1r5 ? (l1r5.gross - bonusJc <= 20 ? "Eligible for JC (net ≤ 20)" : "Above JC limit of 20") : "Need English or HMTL + 5 relevant subjects";
  const elig4 = l1r4 ? (l1r4.gross - bonusJc <= 20 ? "Eligible for MI (net ≤ 20)" : "Above MI limit of 20") : "Need 4 relevant subjects";
  const net28 = l1r4b ? l1r4b.gross - bonus28 : null;
  const elig28 = net28 == null
    ? "Need G3 English/HMTL, humanities, math/science"
    : net28 <= 16
      ? "Meets 2028 JC limit (≤ 16)"
      : net28 <= 20
        ? "Meets 2028 MI limit (≤ 20), above JC 16"
        : "Above 2028 MI limit of 20";
  document.getElementById("results").innerHTML = [
    resultCard("L1R5 · JC today", l1r5, bonusJc, "bonus cap 4", elig5),
    resultCard("L1R4 · MI today", l1r4, bonusJc, "bonus cap 4", elig4),
    resultCard("L1R4 · JC/MI from 2028", l1r4b, bonus28, "bonus cap 3", elig28),
    ...types.map(([t, sel]) =>
      resultCard(
        `ELR2B2-${t} · Poly`,
        sel,
        bonusPoly,
        "CCA cap 2",
        sel ? (sel.gross - bonusPoly <= 26 ? "Within current poly limit (≤ 26)" : "Above poly limit of 26") : "Missing relevant subjects for this type"
      )
    ),
  ].join("");
}

document.getElementById("add-subject").addEventListener("click", () => {
  addRow();
  compute();
});
["cca", "hmtl-pass", "affiliated", "lep", "system"].forEach((id) => {
  document.getElementById(id).addEventListener("change", compute);
});

["English", "Higher Mother Tongue", "Mother Tongue", "Elementary Mathematics", "Additional Mathematics", "Combined Humanities", "Combined Science", "Physics"].forEach((name) => {
  addRow(SUBJECTS.find((s) => s.name === name));
});
compute();
