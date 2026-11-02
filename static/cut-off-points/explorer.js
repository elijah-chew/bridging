const ALL_YEARS = [];
for (let y = 2026; y >= 2014; y--) ALL_YEARS.push(y);
const RECENT = [2026, 2025, 2024, 2023];

function cell(v) {
  if (v == null || v === "") return "—";
  return String(v);
}

function yearsShown() {
  const btn = document.getElementById("expand-years");
  return btn.getAttribute("aria-pressed") === "true" ? ALL_YEARS : RECENT;
}

function matches(row, q, kind, school) {
  if (kind !== "all" && row.kind !== kind) return false;
  if (school && row.institution !== school) return false;
  if (!q) return true;
  const hay = `${row.institution} ${row.course} ${row.code || ""} ${row.stream || ""} ${row.aggregate || ""}`.toLowerCase();
  return hay.includes(q);
}

function groupBySchool(rows) {
  const groups = [];
  const map = new Map();
  for (const row of rows) {
    const key = `${row.kind}|${row.institution}`;
    if (!map.has(key)) {
      const g = { kind: row.kind, institution: row.institution, courses: [] };
      map.set(key, g);
      groups.push(g);
    }
    map.get(key).courses.push(row);
  }
  return groups;
}

function fillSchools(rows, kind) {
  const select = document.getElementById("school");
  const current = select.value;
  const names = [...new Set(rows.filter((r) => kind === "all" || r.kind === kind).map((r) => r.institution))].sort();
  select.innerHTML = `<option value="">All schools</option>` + names.map((n) => `<option value="${n.replace(/"/g, "&quot;")}">${n}</option>`).join("");
  if (names.includes(current)) select.value = current;
}

function render(allRows) {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const kind = document.getElementById("kind").value;
  const school = document.getElementById("school").value;
  const years = yearsShown();
  const filtered = allRows.filter((r) => matches(r, q, kind, school));
  const groups = groupBySchool(filtered);
  const nSchools = groups.length;
  document.getElementById("count").textContent = `${filtered.length} courses · ${nSchools} ${nSchools === 1 ? "school" : "schools"}`;

  const yearHeads = years.map((y) => `<th class="yr">${y}</th>`).join("");
  const colCount = 3 + years.length;
  document.getElementById("head").innerHTML = `<tr>
    <th class="course">Course</th><th>Code</th><th>Type</th>${yearHeads}
  </tr>`;

  document.getElementById("body").innerHTML = groups
    .map((g) => {
      const label = g.kind === "jc" ? "JC / MI" : g.kind === "poly" ? "Polytechnic" : "ITE";
      const head = `<tr class="school-row"><td colspan="${colCount}"><span class="badge">${label}</span> ${g.institution}</td></tr>`;
      const lines = g.courses
        .map(
          (r) => `<tr>
            <td class="course">${r.course}${r.stream && r.stream !== r.course ? ` <span class="meta">(${r.stream})</span>` : ""}</td>
            <td>${r.code || "—"}</td>
            <td>${r.aggregate || "—"}</td>
            ${years.map((y) => `<td class="yr">${cell(r.cop?.[y] ?? r.cop?.[String(y)])}</td>`).join("")}
          </tr>`
        )
        .join("");
      return head + lines;
    })
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
    fillSchools(rows, "all");
    document.getElementById("q").addEventListener("input", redraw);
    document.getElementById("kind").addEventListener("change", () => {
      fillSchools(rows, document.getElementById("kind").value);
      redraw();
    });
    document.getElementById("school").addEventListener("change", redraw);
    document.getElementById("expand-years").addEventListener("click", () => {
      const btn = document.getElementById("expand-years");
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Show 2026–2023 only" : "Show 2014–2022";
      redraw();
    });
    redraw();
  })
  .catch(() => {
    document.getElementById("count").textContent = "Could not load cut-off data.";
  });
