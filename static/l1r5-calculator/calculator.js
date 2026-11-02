const SUBJECTS = [
  { name: "English", cat: "el" },
  { name: "Mother Tongue", cat: "mtl" },
  { name: "Elementary Mathematics", cat: "math" },
  { name: "Additional Mathematics", cat: "math" },
  { name: "Combined Humanities", cat: "hum" },
  { name: "Combined Science", cat: "sci" },
  { name: "Physics", cat: "sci" },
];

const CATS = [
  ["el", "English"],
  ["mtl", "Mother Tongue"],
  ["hum", "Humanities"],
  ["math", "Mathematics"],
  ["sci", "Science"],
  ["poa", "POA"],
];

const HUM = new Set(["hum"]);
const MATHSCI = new Set(["math", "sci"]);
const ITE_R2 = new Set(["sci"]);
const ELR2 = {
  A: { r1: new Set(["hum"]), r2: new Set(["hum", "math", "sci", "poa", "mtl"]) },
  B: { r1: new Set(["math"]), r2: new Set(["hum", "poa", "mtl"]) },
  C: { r1: new Set(["math"]), r2: new Set(["sci"]) },
  D: { r1: new Set(["math"]), r2: new Set(["hum", "poa"]) },
};

const G3_LABELS = ["A1", "A2", "B3", "B4", "C5", "C6", "D7", "E8", "9"];
const G1_LABELS = ["A", "B", "C", "D", "E"];

function gradeLabel(s) {
  if (s.band === "g3") return G3_LABELS[s.grade - 1] || String(s.grade);
  if (s.band === "g1") return G1_LABELS[s.grade - 1] || String(s.grade);
  return String(s.grade);
}

function g3ToG2(g) {
  if (g <= 3) return 1;
  if (g <= 6) return 2;
  if (g === 7) return 3;
  if (g === 8) return 4;
  return 5;
}

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

function isSec() {
  return document.getElementById("system").value === "sec";
}

function fillGrades(select, band, keep) {
  select.innerHTML = "";
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "–";
  select.appendChild(blank);
  const opts = band === "g1"
    ? G1_LABELS.map((label, i) => [String(i + 1), label])
    : band === "g2"
      ? [1, 2, 3, 4, 5, 6].map((n) => [String(n), String(n)])
      : G3_LABELS.map((label, i) => [String(i + 1), label]);
  for (const [value, label] of opts) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    select.appendChild(o);
  }
  const keepStr = keep == null || keep === "" ? "" : String(keep);
  select.value = keepStr && opts.some(([v]) => v === keepStr) ? keepStr : "";
}

function restOf(subjects, used, usedHmtl) {
  return subjects.filter((s) => !used.includes(s) && !(usedHmtl && s.cat === "mtl"));
}

function parseRows() {
  return [...document.querySelectorAll(".subject-row")].map((row) => ({
    name: row.querySelector(".name").value.trim(),
    cat: row.querySelector(".cat").value,
    band: row.querySelector(".band").value,
    grade: Number(row.querySelector(".grade").value),
  })).filter((s) => s.name && s.grade >= 1);
}

function g3Only(subjects) {
  return subjects.filter((s) => s.band === "g3");
}

function asG2(s) {
  if (s.band === "g2") return s.grade;
  if (s.band === "g3") return g3ToG2(s.grade);
  return null;
}

function labelPts(s, pts) {
  const band = s.band === "g1" ? "G1" : s.band === "g2" ? "G2" : "G3";
  return `${s.name} ${band} ${pts}`;
}

function bestL1R5(subjects) {
  const pool = g3Only(subjects);
  const l1s = pool.filter((s) => s.cat === "el");
  let best = null;
  for (const l1 of l1s) {
    const rest = restOf(pool, [l1], false);
    if (rest.length < 5) continue;
    for (const five of combinations(rest, 5)) {
      if (!five.some((s) => HUM.has(s.cat)) || !five.some((s) => MATHSCI.has(s.cat))) continue;
      const gross = l1.grade + five.reduce((a, s) => a + s.grade, 0);
      if (!best || gross < best.gross) best = { gross, parts: [l1, ...five] };
    }
  }
  return best;
}

function bestL1R4(subjects, mode2028) {
  const pool = g3Only(subjects);
  const l1s = pool.filter((s) => s.cat === "el");
  let best = null;
  for (const l1 of l1s) {
    const rest = restOf(pool, [l1], false);
    if (mode2028) {
      const r1 = rest.filter((s) => HUM.has(s.cat)).sort((a, b) => a.grade - b.grade)[0];
      const r2 = rest.filter((s) => MATHSCI.has(s.cat) && s !== r1).sort((a, b) => a.grade - b.grade)[0];
      if (!r1 || !r2) continue;
      const rem = rest.filter((s) => s !== r1 && s !== r2);
      const r3 = rem.filter((s) => HUM.has(s.cat) || MATHSCI.has(s.cat)).sort((a, b) => a.grade - b.grade)[0];
      const r4 = rem.filter((s) => s !== r3).sort((a, b) => a.grade - b.grade)[0];
      if (!r3 || !r4) continue;
      const parts = [l1, r1, r2, r3, r4];
      const gross = parts.reduce((a, s) => a + s.grade, 0);
      if (!best || gross < best.gross) best = { gross, parts };
    } else {
      if (rest.length < 4) continue;
      for (const four of combinations(rest, 4)) {
        if (!four.some((s) => HUM.has(s.cat)) || !four.some((s) => MATHSCI.has(s.cat))) continue;
        const gross = l1.grade + four.reduce((a, s) => a + s.grade, 0);
        if (!best || gross < best.gross) best = { gross, parts: [l1, ...four] };
      }
    }
  }
  return best;
}

function bestELR2B2(subjects, type, for2028) {
  const el = g3Only(subjects).filter((s) => s.cat === "el").sort((a, b) => a.grade - b.grade)[0];
  if (!el) return null;
  const { r1: r1set, r2: r2set } = ELR2[type];
  const g3rest = restOf(g3Only(subjects), [el], false);
  let best = null;
  for (const r1 of g3rest.filter((s) => r1set.has(s.cat))) {
    for (const r2 of g3rest.filter((s) => s !== r1 && r2set.has(s.cat))) {
      const othersG3 = g3rest.filter((s) => s !== r1 && s !== r2).sort((a, b) => a.grade - b.grade);
      if (for2028) {
        if (!othersG3.length) continue;
        const b1 = othersG3[0];
        const b2pool = subjects.filter((s) => s !== el && s !== r1 && s !== r2 && s !== b1);
        let b2Best = null;
        for (const cand of b2pool) {
          if (cand.band === "g1") continue;
          let pts = null;
          if (cand.band === "g2") {
            if (cand.grade <= 4) pts = cand.grade;
          } else if (cand.band === "g3" && cand.grade <= 8) {
            pts = g3ToG2(cand.grade);
          }
          if (pts == null) continue;
          if (!b2Best || pts < b2Best.pts) b2Best = { sub: cand, pts };
        }
        if (!b2Best) continue;
        const gross = el.grade + r1.grade + r2.grade + b1.grade + b2Best.pts;
        if (!best || gross < best.gross) {
          best = { gross, parts: [el, r1, r2, b1, b2Best.sub], mapped: { [b2Best.sub.name]: b2Best.pts } };
        }
      } else {
        if (othersG3.length < 2) continue;
        const b1 = othersG3[0];
        const b2 = othersG3[1];
        const gross = el.grade + r1.grade + r2.grade + b1.grade + b2.grade;
        if (!best || gross < best.gross) best = { gross, parts: [el, r1, r2, b1, b2] };
      }
    }
  }
  return best;
}

function bestELB4(subjects) {
  const el = g3Only(subjects).filter((s) => s.cat === "el").sort((a, b) => a.grade - b.grade)[0];
  if (!el) return null;
  const rest = restOf(g3Only(subjects), [el], false).sort((a, b) => a.grade - b.grade);
  if (rest.length < 4) return null;
  const four = rest.slice(0, 4);
  return { gross: el.grade + four.reduce((a, s) => a + s.grade, 0), parts: [el, ...four] };
}

function bestELR1B3(subjects) {
  const el = g3Only(subjects).filter((s) => s.cat === "el").sort((a, b) => a.grade - b.grade)[0];
  if (!el) return null;
  const rest = restOf(g3Only(subjects), [el], false);
  let best = null;
  for (const r1 of rest.filter((s) => s.cat === "math" || s.cat === "poa")) {
    const others = rest.filter((s) => s !== r1).sort((a, b) => a.grade - b.grade);
    if (others.length < 3) continue;
    const three = others.slice(0, 3);
    const gross = el.grade + r1.grade + three.reduce((a, s) => a + s.grade, 0);
    if (!best || gross < best.gross) best = { gross, parts: [el, r1, ...three] };
  }
  return best;
}

function bestITEC(subjects) {
  const el = g3Only(subjects).filter((s) => s.cat === "el").sort((a, b) => a.grade - b.grade)[0];
  if (!el) return null;
  const rest = restOf(g3Only(subjects), [el], false);
  let best = null;
  for (const r1 of rest.filter((s) => s.cat === "math")) {
    for (const r2 of rest.filter((s) => s !== r1 && ITE_R2.has(s.cat))) {
      const others = rest.filter((s) => s !== r1 && s !== r2).sort((a, b) => a.grade - b.grade);
      if (others.length < 2) continue;
      const two = others.slice(0, 2);
      const gross = el.grade + r1.grade + r2.grade + two.reduce((a, s) => a + s.grade, 0);
      if (!best || gross < best.gross) best = { gross, parts: [el, r1, r2, ...two] };
    }
  }
  return best;
}

function bestELMAB3(subjects) {
  const scored = subjects.map((s) => ({ s, pts: asG2(s) })).filter((x) => x.pts != null);
  const el = scored.filter((x) => x.s.cat === "el").sort((a, b) => a.pts - b.pts)[0];
  const ma = scored.filter((x) => x.s.cat === "math" && x !== el).sort((a, b) => a.pts - b.pts)[0];
  if (!el || !ma) return null;
  const others = scored.filter((x) => x !== el && x !== ma).sort((a, b) => a.pts - b.pts);
  if (others.length < 3) return null;
  const three = others.slice(0, 3);
  const parts = [el, ma, ...three];
  return {
    gross: parts.reduce((a, x) => a + x.pts, 0),
    parts: parts.map((x) => x.s),
    mapped: Object.fromEntries(parts.map((x) => [x.s.name, x.pts])),
  };
}

function jcBonus(cca, hmtl, affiliated, lep, cap) {
  return Math.min(cap, cca + (hmtl ? 2 : 0) + (affiliated ? 2 : 0)) + (lep ? 2 : 0);
}

function breakdown(sel) {
  if (!sel) return "";
  return sel.parts.map((s) => {
    const mapped = sel.mapped?.[s.name];
    if (mapped != null) return labelPts(s, mapped);
    const band = s.band === "g1" ? "G1" : s.band === "g2" ? "G2" : "G3";
    return `${s.name} ${band} ${gradeLabel(s)}`;
  }).join(" · ");
}

function status(net, limit, okText, miss) {
  if (net == null) return miss;
  return net <= limit ? okText : `Above limit of ${limit}`;
}

function renderTable(rows) {
  return `<div class="table-wrap score-table"><table>
    <thead><tr><th>Aggregate</th><th>Net</th><th>Gross</th><th>Bonus</th><th>Guide</th></tr></thead>
    <tbody>${rows.map((r) => `<tr>
      <td><strong>${r.name}</strong><div class="meta">${breakdown(r.sel)}</div></td>
      <td class="num">${r.net == null ? "—" : r.net}</td>
      <td class="num">${r.sel ? r.sel.gross : "—"}</td>
      <td class="num">−${r.bonus}</td>
      <td>${r.guide}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
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
  cat.value = preset?.cat || "sci";
  const band = document.createElement("select");
  band.className = "band";
  for (const [value, label] of [
    ["g3", "G3"],
    ["g2", "G2"],
    ["g1", "G1"],
  ]) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    band.appendChild(o);
  }
  band.value = "g3";
  const grade = document.createElement("select");
  grade.className = "grade";
  fillGrades(grade, "g3", "");
  band.addEventListener("change", () => {
    fillGrades(grade, band.value, grade.value);
    compute();
  });
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "ghost row-remove";
  remove.textContent = "×";
  remove.setAttribute("aria-label", "Remove subject");
  remove.addEventListener("click", () => {
    row.remove();
    compute();
  });
  row.append(name, cat, band, grade, remove);
  row.addEventListener("change", compute);
  row.addEventListener("input", compute);
  document.getElementById("subjects").appendChild(row);
  syncBands();
}

function syncBands() {
  document.querySelectorAll(".band").forEach((el) => {
    el.hidden = false;
    el.disabled = false;
  });
}

function compute() {
  syncBands();
  const subjects = parseRows();
  const cca = Number(document.getElementById("cca").value);
  const hmtl = document.getElementById("hmtl-pass").checked;
  const affiliated = document.getElementById("affiliated").checked;
  const lep = document.getElementById("lep").checked;
  const bonusJc = jcBonus(cca, hmtl, affiliated, lep, 4);
  const bonus28 = jcBonus(cca, hmtl, affiliated, lep, 3);
  const bonusCca = Math.min(2, cca);
  const sec = isSec();

  const l1r5 = bestL1R5(subjects);
  const l1r4 = bestL1R4(subjects, false);
  const l1r428 = bestL1R4(subjects, true);
  const poly = ["A", "B", "C", "D"].map((t) => [t, bestELR2B2(subjects, t, sec)]);
  const elb4 = bestELB4(subjects);
  const elr1 = bestELR1B3(subjects);
  const itec = bestITEC(subjects);
  const elmab3 = bestELMAB3(subjects);

  const jcRows = sec
    ? [
        row("L1R4 · JC from 2028", l1r428, bonus28, status(l1r428 ? l1r428.gross - bonus28 : null, 16, "JC-eligible (≤ 16)", "Need G3 English, humanities, math/science")),
        row("L1R4 · MI from 2028", l1r428, bonus28, status(l1r428 ? l1r428.gross - bonus28 : null, 20, "MI-eligible (≤ 20)", "Need G3 English, humanities, math/science")),
      ]
    : [
        row("L1R5 · JC today", l1r5, bonusJc, status(l1r5 ? l1r5.gross - bonusJc : null, 20, "JC-eligible (≤ 20)", "Need English + 5 G3 subjects")),
        row("L1R4 · MI today", l1r4, bonusJc, status(l1r4 ? l1r4.gross - bonusJc : null, 20, "MI-eligible (≤ 20)", "Need 4 G3 relevant subjects")),
      ];

  const polyRows = poly.map(([t, sel]) => {
    const limit = sec ? 22 : 26;
    const nursing = t === "C" ? (sec ? " · Nursing ≤ 24" : " · Nursing ≤ 28") : "";
    return row(
      `ELR2B2-${t}`,
      sel,
      bonusCca,
      status(sel ? sel.gross - bonusCca : null, limit, `Within poly limit${nursing}`, "Need G3 English and relevant subjects")
    );
  });
  polyRows.push(
    row(
      "ELMAB3 · PFP",
      elmab3,
      bonusCca,
      status(elmab3 ? elmab3.gross - bonusCca : null, 12, "PFP uses ELMAB3 on the G2 scale", "Need English, Math, and 3 other subjects")
    )
  );

  const iteRows = [
    row("ELB4-A", elb4, bonusCca, status(elb4 ? elb4.gross - bonusCca : null, 26, "ITE type A (current JAE)", "Need English + 4 other G3 subjects")),
    row("ELR1B3-B", elr1, bonusCca, status(elr1 ? elr1.gross - bonusCca : null, 26, "ITE type B (current JAE)", "Need English, Math or POA, + 3 others")),
    row("ELR2B2-C", itec, bonusCca, status(itec ? itec.gross - bonusCca : null, 26, "ITE type C (current JAE)", "Need English, Math, a science-related subject, + 2 others")),
    row(
      "ELMAB3 · Higher Nitec from 2028",
      elmab3,
      bonusCca,
      status(elmab3 ? elmab3.gross - bonusCca : null, 19, "Within 2028 ITE limit (≤ 19)", "Need English, Math, and 3 other G2/G3 subjects")
    ),
  ];

  document.getElementById("results").innerHTML = `
    <section><h2>JC / MI</h2>${renderTable(jcRows)}</section>
    <section><h2>Polytechnic</h2>${renderTable(polyRows)}</section>
    <section><h2>ITE</h2>${renderTable(iteRows)}</section>`;

  function row(name, sel, bonus, guide) {
    return { name, sel, bonus, net: sel ? sel.gross - bonus : null, guide };
  }
}

document.getElementById("add-subject").addEventListener("click", () => {
  addRow();
  compute();
});
["cca", "hmtl-pass", "affiliated", "lep", "system"].forEach((id) => {
  document.getElementById(id).addEventListener("change", compute);
});

SUBJECTS.forEach((s) => addRow(s));
compute();
