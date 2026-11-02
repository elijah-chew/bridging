/* Rebuilds the "How it Works", "FAQ" and "Get Started" sections of the
   WeWeb landing export so they share the hero / Higher Education aesthetic.
   Only the inner .section-base of each section is replaced; the section
   wrapper and its hash anchor stay, so nav links keep working. */
(function landingSections() {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;

  var HIW = "35fa4ab0-66a8-4da6-b8ff-6cdb71aed16b";
  var FAQ = "f9d9c27b-da5f-4e1d-b868-17a802ad6161";
  var CTA = "f5866d6b-4108-4ae6-9ac6-92df26c2f29b";
  var FLAG = "data-bridging-rebuilt";

  /* ------------------------------------------------------------------ CSS */
  var css = [
    ".bl{position:relative;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#0a0a0a;-webkit-font-smoothing:antialiased}",
    ".bl *{box-sizing:border-box}",
    ".bl .bl-wrap{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:96px 36px}",
    ".bl .bl-glow{position:absolute;pointer-events:none;border-radius:50%;z-index:0}",
    ".bl .bl-glow.a{width:520px;height:520px;left:-220px;top:40px;background:rgba(59,130,246,.14);filter:blur(90px)}",
    ".bl .bl-glow.b{width:600px;height:600px;right:-260px;top:38%;background:rgba(6,182,212,.11);filter:blur(120px)}",
    ".bl .bl-glow.c{width:520px;height:520px;left:-200px;bottom:-160px;background:rgba(47,98,253,.10);filter:blur(110px)}",
    ".bl .bl-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:9999px;background:#fbfbfb;border:1px solid rgba(0,0,0,.06);font:500 13px/18px Inter,sans-serif;letter-spacing:-.02em;text-transform:uppercase;color:#6b6b6b;margin:0 0 18px}",
    ".bl .bl-eyebrow:before{content:'';width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}",
    ".bl h2{margin:0;font:600 clamp(32px,4.4vw,48px)/1.06 Inter,sans-serif;letter-spacing:-.06em;color:#0a0a0a}",
    ".bl h2 em,.bl h3 em{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600;letter-spacing:-.07em}",
    ".bl .bl-sub{margin:18px 0 0;max-width:560px;font:400 17px/1.55 Inter,sans-serif;color:#6b6b6b;letter-spacing:-.01em}",
    ".bl .bl-head{text-align:center;display:flex;flex-direction:column;align-items:center}",
    ".bl .bl-head h2{max-width:720px}",
    ".bl .bl-head .bl-sub{margin-left:auto;margin-right:auto}",
    ".bl .bl-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 28px;border-radius:9999px;background:#0a0a0a;color:#fff;font:600 15px/1 Inter,sans-serif;letter-spacing:-.01em;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}",
    ".bl .bl-btn:hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(10,10,10,.22)}",
    ".bl .bl-btn.ghost{background:#fff;color:#0a0a0a;border:1px solid rgba(0,0,0,.1)}",
    ".bl .bl-btn.ghost:hover{box-shadow:0 12px 30px rgba(15,23,42,.08)}",

    /* How it works */
    "#bl-hiw .bl-steps{display:flex;flex-direction:column;gap:88px;margin-top:88px}",
    "#bl-hiw .bl-step{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}",
    "#bl-hiw .bl-step.flip .bl-copy{order:-1}",
    "#bl-hiw .bl-num{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:9999px;background:rgba(59,130,246,.08);border:1px solid rgba(47,98,253,.12);font:600 13px/1 Inter,sans-serif;letter-spacing:.02em;color:#3b82f6}",
    "#bl-hiw .bl-num b{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600;font-size:15px}",
    "#bl-hiw h3{margin:18px 0 12px;font:600 clamp(26px,2.6vw,32px)/1.1 Inter,sans-serif;letter-spacing:-.045em}",
    "#bl-hiw .bl-copy p{margin:0;font:400 16px/1.6 Inter,sans-serif;color:#6b6b6b;max-width:440px}",
    "#bl-hiw .bl-copy ul{margin:18px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}",
    "#bl-hiw .bl-copy li{display:flex;align-items:center;gap:10px;font:500 14px/1.4 Inter,sans-serif;color:#0a0a0a;letter-spacing:-.01em}",
    "#bl-hiw .bl-copy li:before{content:'';width:16px;height:16px;border-radius:50%;flex:none;background:#0a0a0a url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5'/%3E%3C/svg%3E\") center/10px no-repeat}",
    /* mock cards */
    ".bl .mock{position:relative;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.04),0 1px 0 rgba(255,255,255,.6) inset;padding:22px 24px;transition:transform .25s ease,box-shadow .25s ease}",
    ".bl .mock:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(15,23,42,.10)}",
    ".bl .mock-top{display:flex;align-items:center;justify-content:space-between;gap:12px}",
    ".bl .mock-title{display:flex;align-items:center;gap:8px;font:600 14px/1 Inter,sans-serif;letter-spacing:-.02em;color:#0f172a}",
    ".bl .mock-title i{width:8px;height:8px;border-radius:50%;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.16)}",
    ".bl .chip{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:9999px;font:500 12px/1.2 Inter,sans-serif;letter-spacing:-.01em;background:#f4f6f9;color:#64748b;white-space:nowrap}",
    ".bl .chip.up{background:rgba(5,150,105,.1);color:#059669}",
    ".bl .chip.blue{background:rgba(59,130,246,.1);color:#2f62fd}",
    ".bl .chip.amber{background:rgba(217,119,6,.1);color:#b45309}",
    ".bl .mono{font-feature-settings:'tnum' 1,'cv11' 1;font-variant-numeric:tabular-nums}",
    /* 1 diagnostic */
    ".bl .diag{display:grid;grid-template-columns:auto 1fr;gap:22px;align-items:center;margin:20px 0 18px}",
    ".bl .ring{position:relative;width:118px;height:118px;border-radius:50%;background:conic-gradient(#3b82f6 0 72%,#e8edf3 72% 100%)}",
    ".bl .ring:before{content:'';position:absolute;inset:9px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04) inset}",
    ".bl .ring span{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 30px/1 Inter,sans-serif;letter-spacing:-.05em;color:#0f172a}",
    ".bl .ring span small{font:500 11px/1 Inter,sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#94a3b8;margin-top:5px}",
    ".bl .grade{display:flex;flex-direction:column;gap:10px}",
    ".bl .grade .row{display:flex;align-items:baseline;gap:10px}",
    ".bl .grade .big{font:700 40px/1 Inter,sans-serif;letter-spacing:-.06em;color:#0f172a}",
    ".bl .grade .arrow{font:500 15px/1 Inter,sans-serif;color:#94a3b8}",
    ".bl .grade .tgt{font:700 22px/1 'Source Serif 4',Georgia,serif;font-style:italic;color:#3b82f6}",
    ".bl .grade .lbl{font:500 12px/1 Inter,sans-serif;color:#94a3b8;letter-spacing:.02em;text-transform:uppercase}",
    ".bl .bars{display:flex;flex-direction:column;gap:12px}",
    ".bl .bar{display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center}",
    ".bl .bar .l{font:500 13px/1 Inter,sans-serif;color:#0f172a;letter-spacing:-.01em}",
    ".bl .bar .v{font:600 13px/1 Inter,sans-serif;color:#64748b}",
    ".bl .bar .t{grid-column:1/-1;height:6px;border-radius:9999px;background:#eef2f6;overflow:hidden}",
    ".bl .bar .t i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2f62fd,#3b82f6 60%,#06b6d4)}",
    ".bl .bar.weak .t i{background:linear-gradient(90deg,#f59e0b,#fbbf24)}",
    ".bl .note{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;padding:11px 14px;border-radius:12px;background:rgba(217,119,6,.08);font:500 13px/1.2 Inter,sans-serif;color:#92400e}",
    ".bl .note a{font-weight:600;color:#b45309;text-decoration:none}",
    /* 2 plan */
    ".bl .days{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:18px 0}",
    ".bl .day{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 0;border-radius:12px;font:500 12px/1 Inter,sans-serif;color:#94a3b8}",
    ".bl .day i{width:5px;height:5px;border-radius:50%;background:#cbd5e1}",
    ".bl .day.done i{background:#3b82f6}",
    ".bl .day.now{background:#0a0a0a;color:#fff;font-weight:600}",
    ".bl .day.now i{background:#06b6d4}",
    ".bl .tasks{display:flex;flex-direction:column;gap:8px}",
    ".bl .task{display:grid;grid-template-columns:4px 1fr auto;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;border:1px solid rgba(0,0,0,.06);background:#fff}",
    ".bl .task.done{background:rgba(5,150,105,.06);border-color:rgba(5,150,105,.12)}",
    ".bl .task .k{width:4px;height:34px;border-radius:9999px;background:#3b82f6}",
    ".bl .task.rev .k{background:#f43f5e}",
    ".bl .task.les .k{background:#06b6d4}",
    ".bl .task .t1{font:500 11px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8}",
    ".bl .task .t2{margin-top:4px;font:600 14px/1.2 Inter,sans-serif;letter-spacing:-.02em;color:#0f172a}",
    ".bl .task .m{font:500 12px/1 Inter,sans-serif;color:#94a3b8;white-space:nowrap}",
    ".bl .task.done .m{color:#059669;font-weight:600}",
    ".bl .prog{display:flex;align-items:center;gap:12px;margin-top:16px;font:500 12px/1 Inter,sans-serif;color:#64748b}",
    ".bl .prog .t{flex:1;height:6px;border-radius:9999px;background:#eef2f6;overflow:hidden}",
    ".bl .prog .t i{display:block;width:58%;height:100%;background:linear-gradient(90deg,#2f62fd,#06b6d4);border-radius:inherit}",
    /* 3 practice */
    ".bl .q{margin:18px 0 14px;padding:16px 16px 14px;border-radius:14px;border:1px solid rgba(0,0,0,.06);background:linear-gradient(180deg,#fbfcfe,#fff)}",
    ".bl .q .qh{display:flex;justify-content:space-between;align-items:center;font:500 12px/1 Inter,sans-serif;color:#94a3b8;letter-spacing:.02em}",
    ".bl .q .qm{margin:12px 0 14px;font:500 22px/1.2 'Source Serif 4',Georgia,serif;font-style:italic;color:#0f172a;letter-spacing:-.01em}",
    ".bl .q .qm sup{font-size:.6em;font-style:normal;font-family:Inter,sans-serif;font-weight:600;vertical-align:.6em}",
    ".bl .opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".bl .opt{display:flex;align-items:center;gap:8px;padding:9px 11px;border-radius:10px;border:1px solid rgba(0,0,0,.07);font:500 13px/1 Inter,sans-serif;color:#334155;background:#fff}",
    ".bl .opt b{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:6px;background:#f1f5f9;font:600 10px/1 Inter,sans-serif;color:#64748b}",
    ".bl .opt.ok{border-color:rgba(5,150,105,.35);background:rgba(5,150,105,.07);color:#065f46}",
    ".bl .opt.ok b{background:#059669;color:#fff}",
    ".bl .mast{display:flex;flex-direction:column;gap:9px}",
    ".bl .mrow{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font:500 13px/1 Inter,sans-serif;color:#0f172a;letter-spacing:-.01em}",
    ".bl .cells{display:flex;gap:4px}",
    ".bl .cells i{width:14px;height:8px;border-radius:3px;background:#e8edf3}",
    ".bl .cells i.f{background:#3b82f6}",
    ".bl .cells i.h{background:#06b6d4}",
    ".bl .cells i.w{background:#fbbf24}",
    ".bl .cta-row{display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding:11px 14px;border-radius:12px;background:rgba(59,130,246,.08);font:600 13px/1.2 Inter,sans-serif;color:#2f62fd}",

    /* FAQ */
    "#bl-faq .bl-faq{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}",
    "#bl-faq .bl-faq-head{position:sticky;top:96px}",
    "#bl-faq .bl-more{margin-top:28px;display:inline-flex;align-items:center;gap:8px;font:500 14px/1 Inter,sans-serif;color:#0a0a0a;text-decoration:none;border-bottom:1px solid rgba(0,0,0,.2);padding-bottom:4px}",
    "#bl-faq .bl-more:hover{border-color:#0a0a0a}",
    "#bl-faq .bl-acc{display:flex;flex-direction:column;gap:12px}",
    "#bl-faq details{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.04);overflow:hidden;transition:box-shadow .25s ease}",
    "#bl-faq details[open]{box-shadow:0 18px 48px rgba(15,23,42,.08)}",
    "#bl-faq summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px;font:600 17px/1.3 Inter,sans-serif;letter-spacing:-.03em;color:#0a0a0a}",
    "#bl-faq summary::-webkit-details-marker{display:none}",
    "#bl-faq summary i{flex:none;width:28px;height:28px;border-radius:50%;border:1px solid rgba(0,0,0,.1);position:relative;transition:transform .3s ease,background .3s ease,border-color .3s ease}",
    "#bl-faq summary i:before,#bl-faq summary i:after{content:'';position:absolute;left:50%;top:50%;width:11px;height:1.5px;background:#0a0a0a;transform:translate(-50%,-50%)}",
    "#bl-faq summary i:after{transform:translate(-50%,-50%) rotate(90deg)}",
    "#bl-faq details[open] summary i{transform:rotate(45deg);background:#0a0a0a;border-color:#0a0a0a}",
    "#bl-faq details[open] summary i:before,#bl-faq details[open] summary i:after{background:#fff}",
    "#bl-faq .bl-a{padding:0 24px 24px;font:400 16px/1.6 Inter,sans-serif;color:#6b6b6b;max-width:560px}",
    "#bl-faq .bl-a p{margin:0}",

    /* Get started */
    "#bl-cta .bl-wrap{padding-top:40px;padding-bottom:120px}",
    "#bl-cta .bl-card{position:relative;overflow:hidden;border-radius:28px;background:#0a0a0a;color:#fff;padding:88px 48px;text-align:center;display:flex;flex-direction:column;align-items:center;box-shadow:0 30px 80px rgba(10,10,10,.25)}",
    "#bl-cta .bl-card .g{position:absolute;pointer-events:none;border-radius:50%}",
    "#bl-cta .bl-card .g1{width:620px;height:620px;left:-200px;top:-260px;background:rgba(59,130,246,.32);filter:blur(110px)}",
    "#bl-cta .bl-card .g2{width:560px;height:560px;right:-200px;bottom:-280px;background:rgba(6,182,212,.22);filter:blur(120px)}",
    "#bl-cta .bl-card .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%);mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%)}",
    "#bl-cta .bl-card>*{position:relative}",
    "#bl-cta .bl-eyebrow{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#cbd5e1}",
    "#bl-cta .bl-eyebrow:before{background:#06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.25)}",
    "#bl-cta h2{color:#fff;max-width:720px}",
    "#bl-cta h2 em{color:#8fb5ff;white-space:nowrap}",
    "#bl-cta .bl-sub{color:#a3adbd;max-width:520px}",
    "#bl-cta .bl-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:34px}",
    "#bl-cta .bl-btn{background:#fff;color:#0a0a0a}",
    "#bl-cta .bl-btn:hover{box-shadow:0 16px 40px rgba(255,255,255,.18)}",
    "#bl-cta .bl-btn.ghost{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.16)}",
    "#bl-cta .bl-fine{margin-top:26px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 22px;font:500 13px/1 Inter,sans-serif;color:#7c8798;letter-spacing:-.01em}",
    "#bl-cta .bl-fine span{display:inline-flex;align-items:center;gap:8px}",
    "#bl-cta .bl-fine span:before{content:'';width:4px;height:4px;border-radius:50%;background:#3b82f6}",

    "@media (max-width:900px){#bl-hiw .bl-step{grid-template-columns:1fr;gap:28px}#bl-hiw .bl-step .bl-copy,#bl-hiw .bl-step.flip .bl-copy{order:-1}#bl-faq .bl-faq{grid-template-columns:1fr;gap:36px}#bl-faq .bl-faq-head{position:static}}",
    "@media (max-width:760px){.bl .bl-wrap{padding:72px 20px}.bl .bl-glow.b{display:none}#bl-hiw .bl-steps{gap:64px;margin-top:56px}.bl .mock{padding:18px}.bl .diag{grid-template-columns:1fr;justify-items:start}.bl .opts{grid-template-columns:1fr}#bl-cta .bl-card{padding:64px 24px;border-radius:24px}#bl-cta .bl-wrap{padding-bottom:80px}}"
  ].join("");

  /* ----------------------------------------------------------------- HTML */
  var glows = '<div class="bl-glow a" aria-hidden="true"></div><div class="bl-glow b" aria-hidden="true"></div><div class="bl-glow c" aria-hidden="true"></div>';

  var hiwHTML = glows + '<div class="bl-wrap">' +
    '<div class="bl-head"><p class="bl-eyebrow">How it works</p>' +
    '<h2>From your first score to O-Level day, <em>in one loop</em>.</h2>' +
    '<p class="bl-sub">No generic topic lists. Every step is driven by where you actually stand in E-Math.</p></div>' +
    '<div class="bl-steps">' +

    /* step 1 */
    '<div class="bl-step"><div class="mock" aria-hidden="true">' +
      '<div class="mock-top"><span class="mock-title"><i></i>Diagnostic</span><span class="chip up">+12 pts this week</span></div>' +
      '<div class="diag"><div class="ring"><span class="mono">72%<small>ready</small></span></div>' +
      '<div class="grade"><div><div class="lbl">Projected</div><div class="row"><span class="big mono">B3</span><span class="arrow">to</span><span class="tgt">A2</span></div></div>' +
      '<div class="lbl">Target set for Oct 2026</div></div></div>' +
      '<div class="bars">' +
        '<div class="bar weak"><span class="l">Algebra</span><span class="v mono">58%</span><span class="t"><i style="width:58%"></i></span></div>' +
        '<div class="bar"><span class="l">Geometry &amp; Measurement</span><span class="v mono">74%</span><span class="t"><i style="width:74%"></i></span></div>' +
        '<div class="bar"><span class="l">Statistics &amp; Probability</span><span class="v mono">68%</span><span class="t"><i style="width:68%"></i></span></div>' +
      '</div>' +
      '<div class="note"><span>Weakest topic: Algebra</span><a>Fix it first &rarr;</a></div>' +
    '</div>' +
    '<div class="bl-copy"><span class="bl-num"><b>01</b> Diagnose</span>' +
      '<h3>Start from your <em>real</em> baseline.</h3>' +
      '<p>A short adaptive diagnostic, built from past O-Level papers, returns a readiness score and the exact topics costing you marks.</p>' +
      '<ul><li>20 questions, about 15 minutes</li><li>Projected grade, not a vague percentage</li></ul>' +
    '</div></div>' +

    /* step 2 */
    '<div class="bl-step flip"><div class="mock" aria-hidden="true">' +
      '<div class="mock-top"><span class="mock-title"><i></i>This week</span><span class="chip">Week 3 of 8</span></div>' +
      '<div class="days"><span class="day done">Mon<i></i></span><span class="day done">Tue<i></i></span><span class="day now">Wed<i></i></span><span class="day">Thu<i></i></span><span class="day">Fri<i></i></span><span class="day">Sat<i></i></span><span class="day">Sun<i></i></span></div>' +
      '<div class="tasks">' +
        '<div class="task done"><span class="k"></span><span><div class="t1">Practice</div><div class="t2">Algebra drill</div></span><span class="m">Done</span></div>' +
        '<div class="task rev"><span class="k"></span><span><div class="t1">Review</div><div class="t2">Yesterday&rsquo;s misses</div></span><span class="m">8 Q &middot; 10 min</span></div>' +
        '<div class="task les"><span class="k"></span><span><div class="t1">Lesson</div><div class="t2">Quadratic equations refresher</div></span><span class="m">12 min</span></div>' +
      '</div>' +
      '<div class="prog"><span>14 of 24 sessions</span><span class="t"><i></i></span><span class="mono">58%</span></div>' +
    '</div>' +
    '<div class="bl-copy"><span class="bl-num"><b>02</b> Plan</span>' +
      '<h3>A plan that bends <em>around you</em>.</h3>' +
      '<p>Set a target grade and exam date. We schedule practice, review and full papers week by week, and rebalance the moment your accuracy shifts.</p>' +
      '<ul><li>Short sessions that fit a school week</li><li>Re-planned automatically after every attempt</li></ul>' +
    '</div></div>' +

    /* step 3 */
    '<div class="bl-step"><div class="mock" aria-hidden="true">' +
      '<div class="mock-top"><span class="mock-title"><i></i>Question bank</span><span class="chip blue">Past prelim papers</span></div>' +
      '<div class="q"><div class="qh"><span>Q7 &middot; Quadratic equations</span><span>Medium</span></div>' +
      '<div class="qm">Solve 2x<sup>2</sup> &minus; 5x &minus; 3 = 0</div>' +
      '<div class="opts"><span class="opt"><b>A</b> x = &minus;3 or x = &frac12;</span><span class="opt ok"><b>B</b> x = 3 or x = &minus;&frac12;</span><span class="opt"><b>C</b> x = 3 or x = &frac12;</span><span class="opt"><b>D</b> x = &minus;3 or x = &minus;&frac12;</span></div></div>' +
      '<div class="mast">' +
        '<div class="mrow"><span>Quadratic equations</span><span class="cells"><i class="w"></i><i class="w"></i><i></i><i></i><i></i></span></div>' +
        '<div class="mrow"><span>Indices &amp; standard form</span><span class="cells"><i class="f"></i><i class="f"></i><i class="f"></i><i class="h"></i><i></i></span></div>' +
        '<div class="mrow"><span>Trigonometry</span><span class="cells"><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="h"></i></span></div>' +
      '</div>' +
      '<div class="cta-row"><span>Next up: Quadratic equations, 6 questions</span><span>&rarr;</span></div>' +
    '</div>' +
    '<div class="bl-copy"><span class="bl-num"><b>03</b> Practise</span>' +
      '<h3>Practice that <em>moves</em> the grade.</h3>' +
      '<p>Hundreds of SEAB-aligned questions sorted by topic and difficulty. Weak spots come first, so no minute goes to what you already know.</p>' +
      '<ul><li>Worked solutions on every question</li><li>Mastery tracked per topic, not per paper</li></ul>' +
    '</div></div>' +

    '</div></div>';

  var faqHTML = glows + '<div class="bl-wrap"><div class="bl-faq">' +
    '<div class="bl-faq-head"><p class="bl-eyebrow">FAQ</p>' +
    '<h2>Common questions, <em>honest answers</em>.</h2>' +
    '<p class="bl-sub">Short and straight. If something is missing, the About page has the full story.</p>' +
    '<a class="bl-more" href="/about">Read about Bridging &rarr;</a></div>' +
    '<div class="bl-acc">' +
    '<details open><summary>Is Bridging really free?<i></i></summary><div class="bl-a"><p>Yes. Every feature is free with nothing locked behind a tier. Bridging was built for Singapore students who deserve premium revision tools without the tuition-centre price tag.</p></div></details>' +
    '<details><summary>Is it aligned with the latest SEAB syllabus?<i></i></summary><div class="bl-a"><p>Yes. Every question and diagnostic maps to the SEAB 4048 E-Math syllabus and is drawn from school prelim papers. Bridging is designed to build strong foundations first, not for brute-force drilling.</p></div></details>' +
    '<details><summary>Why was Bridging built?<i></i></summary><div class="bl-a"><p>I was a secondary school student who struggled to find free, high-quality resources for building a solid base in math. After graduating in 2025, I built the tool I wished I had: a simple, reliable set of questions and lessons that help students learn faster.</p></div></details>' +
    '</div></div></div>';

  var ctaHTML = '<div class="bl-wrap"><div class="bl-card">' +
    '<div class="grid" aria-hidden="true"></div><div class="g g1" aria-hidden="true"></div><div class="g g2" aria-hidden="true"></div>' +
    '<p class="bl-eyebrow">Get started</p>' +
    '<h2>Ready to bridge your <em>math gaps</em>?</h2>' +
    '<p class="bl-sub">Take the diagnostic, see your projected grade, and get a plan for the weeks that matter. Free for every Singapore student.</p>' +
    '<div class="bl-actions"><a class="bl-btn" href="/signup">Start revising free &rarr;</a><a class="bl-btn ghost" href="/today">Try today&rsquo;s question</a></div>' +
    '<div class="bl-fine"><span>No credit card</span><span>No locked features</span><span>Aligned to SEAB 4048</span></div>' +
    '</div></div>';

  /* ---------------------------------------------------------------- apply */
  var targets = [
    { uid: HIW, id: "bl-hiw", html: hiwHTML },
    { uid: FAQ, id: "bl-faq", html: faqHTML },
    { uid: CTA, id: "bl-cta", html: ctaHTML }
  ];

  function rebuild(t) {
    var sec = document.querySelector('[data-section-uid="' + t.uid + '"]');
    if (!sec || sec.getAttribute(FLAG)) return !!sec;
    var base = sec.querySelector(".section-base") || sec;
    if (!base.querySelector("h2")) return false; // WeWeb content not mounted yet
    base.innerHTML = t.html;
    base.id = t.id;
    base.classList.add("bl");
    base.style.cssText = "padding:0;background:transparent";
    sec.style.overflow = "hidden";
    sec.setAttribute(FLAG, "1");
    return true;
  }

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  if (!document.querySelector('link[href*="Source+Serif+4"]')) {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@1,600&display=swap";
    document.head.appendChild(font);
  }

  function tryAll() {
    var done = true;
    for (var i = 0; i < targets.length; i++) if (!rebuild(targets[i])) done = false;
    return done;
  }

  if (tryAll()) return;
  var obs = new MutationObserver(function () {
    if (tryAll()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); }, 20000);
})();
