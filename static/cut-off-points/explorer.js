const YEARS = [];
for (let y = 2014; y <= 2026; y++) YEARS.push(y);

function cell(v) {
  if (v == null || v === "") return "—";
  return String(v);
}

function matches(row, q, kind) {
  if (kind !== "all" && row.kind !== kind) return false;
  if (!q) return true;
  const hay = `${row.institution} ${row.course} ${row.code || ""} ${row.stream || ""}`.toLowerCase();
  return hay.includes(q);
}

function render(rows) {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const kind = document.getElementById("kind").value;
  const filtered = rows.filter((r) => matches(r, q, kind));
  document.getElementById("count").textContent = `${filtered.length} courses`;
  document.getElementById("head").innerHTML = `<tr>
    <th>Pathway</th><th>Institution</th><th>Course</th><th>Code</th><th>Type</th>
    ${YEARS.map((y) => `<th>${y}</th>`).join("")}
  </tr>`;
  document.getElementById("body").innerHTML = filtered
    .map((r) => `<tr>
      <td>${r.kind.toUpperCase()}</td>
      <td>${r.institution}</td>
      <td>${r.course}</td>
      <td>${r.code || "—"}</td>
      <td>${r.aggregate || r.stream || "—"}</td>
      ${YEARS.map((y) => `<td>${cell(r.cop?.[y] ?? r.cop?.[String(y)])}</td>`).join("")}
    </tr>`)
    .join("");
}

fetch("/data/higher-ed-cutoffs.json")
  .then((r) => r.json())
  .then((data) => {
    const order = { jc: 0, poly: 1, ite: 2 };
    const rows = (data.courses || data).slice().sort((a, b) => {
      const k = (order[a.kind] ?? 9) - (order[b.kind] ?? 9);
      if (k) return k;
      const i = String(a.institution).localeCompare(b.institution);
      if (i) return i;
      return String(a.course).localeCompare(b.course);
    });
    const redraw = () => render(rows);
    document.getElementById("q").addEventListener("input", redraw);
    document.getElementById("kind").addEventListener("change", redraw);
    redraw();
  })
  .catch(() => {
    document.getElementById("count").textContent = "Could not load cut-off data.";
  });
