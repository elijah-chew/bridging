import fs from "node:fs";
import path from "node:path";

const root = path.resolve("static");
const exts = new Set([".html", ".js", ".css", ".json"]);
const EM = "\u2014";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules") continue;
      walk(p, out);
    } else if (exts.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

function fix(s) {
  let t = s;
  t = t.replace(/BRIDGING \u2014/g, "BRIDGING |");
  t = t.replace(/students\u2014topic/g, "students, topic");
  t = t.replace(/ \u2014 /g, ", ");
  t = t.replace(/\u2014/g, "-");
  return t;
}

let count = 0;
for (const f of walk(root)) {
  const s = fs.readFileSync(f, "utf8");
  if (!s.includes(EM)) continue;
  const t = fix(s);
  if (t !== s) {
    fs.writeFileSync(f, t);
    count++;
    console.log(path.relative(root, f));
  }
}
console.log("updated", count, "files");
