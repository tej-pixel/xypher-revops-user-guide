/* ===== Shared script for all pages (guarded by element presence) ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sideCls=s=>s==="acq"?"badge-acq":"badge-ret";
function toast(m){const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("on");clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove("on"),2600);}

/* ---------- SHARED CHROME (every page) ---------- */
// theme
function setTheme(t){document.documentElement.dataset.theme=t;const b=$("#themeBtn");if(b)b.textContent=t==="dark"?"☀️":"🌙";localStorage.setItem("xv-theme",t);}
setTheme(localStorage.getItem("xv-theme")||"light");
if($("#themeBtn"))$("#themeBtn").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));

// scroll progress bar
if($("#scrollbar"))addEventListener("scroll",()=>{const h=document.documentElement;$("#scrollbar").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%";});

// lightbox
const lb=$("#lb"),lbimg=$("#lbimg");
if(lb){document.addEventListener("click",e=>{const z=e.target.closest("[data-zoom]");if(z){lbimg.src=z.dataset.zoom;lb.classList.add("open");}});
  lb.addEventListener("click",()=>lb.classList.remove("open"));}

// role lens (persists; dims .stage on journey)
function applyRole(r){
  $$("#lens button").forEach(b=>b.classList.toggle("on",b.dataset.role===r));
  $$(".stage").forEach(st=>{const roles=st.dataset.roles.split(",");st.classList.toggle("dim",r!=="all"&&!roles.includes(r));});
  localStorage.setItem("xv-role",r);
}
$$("#lens button").forEach(b=>b.addEventListener("click",()=>applyRole(b.dataset.role)));

// progress ring (reads journey completion on every page)
function refreshProgress(){
  let done=0;STAGES.forEach(s=>{if(localStorage.getItem("xv-done-"+s.id)==="1"){done++;
    const btn=document.querySelector(`[data-done="${s.id}"]`);if(btn){btn.classList.add("done");btn.textContent="✓ Complete";}}});
  if($("#ringpct"))$("#ringpct").textContent=done;
  if($("#ringfill"))$("#ringfill").style.strokeDashoffset=88-(88*done/STAGES.length);
}

// glossary tooltips on any dotted term
function glossarize(){$$(".gl-term").forEach(el=>{if(el.title)return;const k=el.textContent.trim();
  let def=GLMAP[k];if(!def){const hit=Object.keys(GLMAP).find(kk=>k.includes(kk));if(hit)def=GLMAP[hit];}
  if(def)el.title=def;});}

// command palette (cross-page)
const PItems=[...STAGES.map(s=>({k:"Stage",l:s.name,url:"journey.html#"+s.id})),
 {k:"Page",l:"Home",url:"index.html"},{k:"Page",l:"Start here",url:"start.html"},
 {k:"Page",l:"First task",url:"start.html#firsttask"},{k:"Page",l:"Score simulator",url:"start.html#sim"},
 {k:"Page",l:"Capability pillars",url:"capabilities.html"},{k:"Page",l:"FAQ",url:"reference.html#faq"},
 {k:"Page",l:"Automation reference",url:"reference.html"},
 ...PILLARS.map(p=>({k:"Pillar",l:p.n+" — "+p.t.replace(/&amp;/g,'&'),url:"capabilities.html#pillar-"+p.n})),
 ...GLOSSARY.map(g=>({k:"Term",l:g[0]+" — "+g[1],url:"start.html#glossary"}))];
const pal=$("#pal");
if(pal){const palInput=$("#palInput"),palRes=$("#palRes");let pSel=0,pFiltered=[];
 function openPal(){pal.classList.add("open");palInput.value="";renderPal("");palInput.focus();}
 function closePal(){pal.classList.remove("open");}
 function renderPal(q){pFiltered=PItems.filter(i=>i.l.toLowerCase().includes(q.toLowerCase())).slice(0,8);pSel=0;
   palRes.innerHTML=pFiltered.map((i,x)=>`<button class="${x===0?'sel':''}" data-url="${i.url}"><span>${i.l}</span><span class="kind">${i.k}</span></button>`).join("")||`<button disabled style="color:var(--muted)">No matches</button>`;}
 palInput.addEventListener("input",e=>renderPal(e.target.value));
 palInput.addEventListener("keydown",e=>{
   if(e.key==="ArrowDown")pSel=Math.min(pSel+1,pFiltered.length-1);
   else if(e.key==="ArrowUp")pSel=Math.max(pSel-1,0);
   else if(e.key==="Enter"){if(pFiltered[pSel])location.href=pFiltered[pSel].url;return;}
   else return;
   palRes.querySelectorAll("button").forEach((b,x)=>b.classList.toggle("sel",x===pSel));});
 palRes.addEventListener("click",e=>{const b=e.target.closest("button[data-url]");if(b)location.href=b.dataset.url;});
 pal.addEventListener("click",e=>{if(e.target===pal)closePal();});
 if($("#palBtn"))$("#palBtn").addEventListener("click",openPal);
 addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();openPal();}
   if(e.key==="Escape"){closePal();if(lb)lb.classList.remove("open");}});
}

/* ---------- HOME ---------- */
if($("#stageLabels")){
  $("#stageLabels").innerHTML=STAGES.map(s=>`<button data-go="${s.id}">${s.name}</button>`).join("");
  $$("#stageLabels button").forEach(b=>b.addEventListener("click",()=>location.href="journey.html#"+b.dataset.go));
  $$('.bowtie-svg polygon').forEach(p=>p.addEventListener("click",()=>location.href="journey.html#"+(p.dataset.seg==="acq"?"awareness":"grow")));
  const bt=$("#bowtip");
  const SEGINFO={acq:"<b>Acquisition</b><br>4 stages · ~40 automations<br>Awareness → Commit",ret:"<b>Retention & Growth</b><br>3 stages · ~12 automations<br>Onboard → Grow"};
  if(bt)$$('.bowtie-svg polygon').forEach(p=>{
    p.addEventListener("mousemove",e=>{bt.innerHTML=SEGINFO[p.dataset.seg];bt.style.left=Math.min(e.clientX+14,innerWidth-250)+"px";bt.style.top=(e.clientY+14)+"px";bt.style.opacity=1;});
    p.addEventListener("mouseleave",()=>bt.style.opacity=0);});
}
// persona (home)
if($(".persona-bar")){
  function pickPersona(p){
    $$(".persona-bar button").forEach(b=>b.classList.toggle("on",b.dataset.p===p));
    const box=$("#checklistBox");
    if(p==="all"){box.classList.add("hidden");applyRole("all");localStorage.setItem("xv-persona","all");return;}
    applyRole(p);box.classList.remove("hidden");
    box.innerHTML=`<h3 style="font-size:15px;margin:0 0 4px">Your day-one checklist — ${ROLE_LABELS[p]||p}</h3>
     <div class="checklist">${CHECKLISTS[p].map((c,i)=>`<label><input type="checkbox" data-ck="${p}-${i}">${c}</label>`).join("")}</div>`;
    box.querySelectorAll("input").forEach(i=>{i.checked=localStorage.getItem("xv-ck-"+i.dataset.ck)==="1";
      i.addEventListener("change",()=>localStorage.setItem("xv-ck-"+i.dataset.ck,i.checked?"1":"0"));});
    localStorage.setItem("xv-persona",p);
  }
  $$(".persona-bar button").forEach(b=>b.addEventListener("click",()=>pickPersona(b.dataset.p)));
  const savedP=localStorage.getItem("xv-persona");if(savedP&&savedP!=="all")pickPersona(savedP);
}

/* ---------- START PAGE ---------- */
if($("#glossaryGrid"))
  $("#glossaryGrid").innerHTML=GLOSSARY.map(g=>`<div class="gl-card"><div class="t">${g[0]} <span class="ab">${g[1]}</span></div><div class="d">${g[2]}</div></div>`).join("");
// anatomy hotspots
if($("#anat")){const anat=$("#anat");
  HOT.forEach((h,i)=>{const d=document.createElement("div");d.className="hot";d.textContent=i+1;d.style.left=h[0]+"%";d.style.top=h[1]+"%";
    d.addEventListener("click",()=>{$$("#anat .hot").forEach(x=>x.classList.remove("sel"));d.classList.add("sel");
      $("#anatInfo").innerHTML=`<b>${i+1}. ${h[2]}</b><br>${h[3]}`;});anat.appendChild(d);});}
// tour
if($("#tourSteps")){let ti=0;
  function renderTour(){
    $("#tourSteps").innerHTML=TOUR.map((s,i)=>`<div class="step ${i===ti?'on':''}"><span class="badge">Step ${i+1} of ${TOUR.length}</span><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join("");
    $("#tourDots").innerHTML=TOUR.map((_,i)=>`<i class="${i===ti?'on':''}"></i>`).join("");
    $("#tourPrev").disabled=ti===0;$("#tourNext").textContent=ti===TOUR.length-1?"Done ✓":"Next ›";}
  $("#tourPrev").addEventListener("click",()=>{if(ti>0){ti--;renderTour();}});
  $("#tourNext").addEventListener("click",()=>{if(ti<TOUR.length-1){ti++;renderTour();}else{ti=0;renderTour();}});
  renderTour();}
// before/after
if($("#mockrec")){
  function renderMock(after){
    $("#mockrec").innerHTML=`<div class="mh">Lead · Dana Whitfield`+(after?` <span style="float:right;font-weight:600;color:var(--good);font-size:12px">✓ saved — automation ran</span>`:` <span style="float:right;font-weight:600;color:var(--muted);font-size:12px">just entered</span>`)+`</div>`+
     MOCK.map(m=>`<div class="mf"><span class="k">${m[0]}</span><span class="v ${after?'fill':'empty'}">${after?m[1]:'— blank —'}</span></div>`).join("");}
  renderMock(false);
  $("#baToggle").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    $$("#baToggle button").forEach(x=>x.classList.toggle("on",x===b));renderMock(b.dataset.ba==="after");});}
// simulator
if($("#bantNum")){
  function bant(){let s=0;$$(".bant").forEach(c=>{if(c.checked)s+=+c.dataset.w;});
    $("#bantNum").textContent=s;$("#bantBar").style.width=s+"%";
    const lab=s>=80?["Fully Qualified","var(--good)"]:s>=50?["Partially Qualified","var(--warn)"]:["Unqualified","var(--muted)"];
    $("#bantLab").textContent=lab[0];$("#bantLab").style.color=lab[1];$("#bantNum").style.color=lab[1];$("#bantBar").style.background=lab[1];}
  $$(".bant").forEach(c=>c.addEventListener("change",bant));}
if($("#medOpts")){const MED=["Metrics","Economic Buyer","Decision Criteria","Decision Process","Paper Process","Identify Pain","Champion","Competition"];
  $("#medOpts").innerHTML=MED.map((m,i)=>`<div class="opt">${m}<select class="med" data-i="${i}"><option value="0">Not Started</option><option value="6.25">In Progress</option><option value="12.5">Complete</option></select></div>`).join("");
  function med(){let s=0;$$(".med").forEach(x=>s+=parseFloat(x.value));s=Math.round(s*10)/10;
    $("#medNum").textContent=s;$("#medBar").style.width=s+"%";
    const lab=s>=75?["🟢 Green","var(--good)"]:s>=40?["🟡 Amber","var(--warn)"]:["🔴 Red","var(--bad)"];
    $("#medLab").textContent=lab[0];$("#medNum").style.color=lab[1];$("#medBar").style.background=lab[1];}
  $$(".med").forEach(x=>x.addEventListener("change",med));med();}

/* ---------- JOURNEY PAGE ---------- */
if($("#stages")){
  $("#stages").innerHTML=STAGES.map(s=>{
   const autos=s.system.map(a=>`<div class="auto"><div class="n">${a.n} ${a.tag?`<span class="tag ${a.tag[0]}">${a.tag[1]}</span>`:""}</div><div class="d">${a.d}</div></div>`).join("");
   const flds=s.fields.map(f=>`<div class="fld"><span class="who ${f[1]}">${f[1]==="you"?"You":"System"}</span><div><b>${f[0]}</b> — <span class="fd">${f[2]}</span></div></div>`).join("");
   const mis=s.mistakes.map(m=>`<div class="mistake"><span class="x">✕</span><div>${m}</div></div>`).join("");
   const you=s.you.map(y=>`<li>${y}</li>`).join("");
   const shot=s.shot?`<figure><div class="shot" data-zoom="assets/${s.shot.src}"><img src="assets/${s.shot.src}" alt="${s.name}"></div><figcaption>${s.shot.cap}</figcaption><a class="openorg" target="_blank" href="${rec(s.shot.o,s.shot.id)}">Open this record in Salesforce ↗</a></figure>`:"";
   const caps=PILLARS.filter(p=>p.stages.includes(s.id)).map(p=>`<a class="capchip" href="capabilities.html#pillar-${p.n}"><b>${p.n}</b> ${p.t}</a>`).join("");
   return `<section class="stage" id="${s.id}" data-roles="${s.roles.join(",")}">
    <div class="stage-head">
      <div class="stage-num" style="background:linear-gradient(135deg,${s.color[0]},${s.color[1]})">${s.num}</div>
      <div><span class="badge-side ${sideCls(s.side)}">${s.side==="acq"?"Acquisition":"Retention & Growth"}</span>
        ${s.roles.map(r=>`<span class="rolechip">${ROLE_LABELS[r]||r}</span>`).join(" ")}
        <h2 style="margin-top:6px">${s.name}</h2></div>
      <button class="markdone" data-done="${s.id}">○ Mark complete</button>
    </div>
    <p class="purpose">${s.purpose}</p>
    <div class="capchips"><span class="lbl">Capability pillars ›</span>${caps}</div>
    <div class="cols2">
      <div>
        <div class="tabs" data-tabs="${s.id}">
          <button class="on" data-t="you">You do</button><button data-t="sys">System does</button>
          <button data-t="fld">Fields</button><button data-t="mis">Watch out</button>
        </div>
        <div class="tabpane on" data-p="${s.id}-you"><ul class="clean">${you}</ul></div>
        <div class="tabpane" data-p="${s.id}-sys">${autos}</div>
        <div class="tabpane" data-p="${s.id}-fld">${flds}</div>
        <div class="tabpane" data-p="${s.id}-mis">${mis}</div>
      </div>
      <div>${shot}${s.extra||""}
        <div class="quiz" data-quiz="${s.id}"><div class="q"><span class="ck">✓ Quick check</span>${s.quiz.q}</div>
          ${s.quiz.opts.map((o,i)=>`<button class="qopt" data-i="${i}" data-correct="${s.quiz.a}">${o}</button>`).join("")}
          <div class="explain">${s.quiz.explain}</div></div>
      </div>
    </div></section>`;
  }).join("");
  // pill strip
  if($("#jpills"))$("#jpills").innerHTML=STAGES.map(s=>`<a href="#${s.id}" data-pill-go="${s.id}">${s.num}·${s.name}</a>`).join("");
  // tabs
  $$(".tabs").forEach(tb=>tb.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    const id=tb.dataset.tabs;tb.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
    $$(`[data-p^="${id}-"]`).forEach(p=>p.classList.toggle("on",p.dataset.p===id+"-"+b.dataset.t));}));
  // quizzes
  $$(".quiz").forEach(q=>q.addEventListener("click",e=>{const b=e.target.closest(".qopt");if(!b)return;
    const correct=+b.dataset.correct, picked=+b.dataset.i;
    q.querySelectorAll(".qopt").forEach(o=>{o.classList.remove("right","wrong");if(+o.dataset.i===correct)o.classList.add("right");});
    if(picked!==correct)b.classList.add("wrong");q.querySelector(".explain").classList.add("on");}));
  // mark done
  document.addEventListener("click",e=>{const b=e.target.closest(".markdone");if(!b)return;
    const id=b.dataset.done,now=localStorage.getItem("xv-done-"+id)==="1"?"0":"1";localStorage.setItem("xv-done-"+id,now);
    if(now==="1"){b.classList.add("done");b.textContent="✓ Complete";toast("Stage complete! 🎉 "+(STAGES.filter(s=>localStorage.getItem("xv-done-"+s.id)==="1").length)+"/7 done");}
    else{b.classList.remove("done");b.textContent="○ Mark complete";}
    refreshProgress();});
  // scrollspy for pill strip
  const pills=$$("#jpills a");
  if(pills.length){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)pills.forEach(a=>a.classList.toggle("active",a.dataset.pillGo===e.target.id))}),{rootMargin:"-30% 0px -60% 0px"});
    STAGES.forEach(s=>obs.observe(document.getElementById(s.id)));}
}

/* ---------- CAPABILITIES PAGE ---------- */
if($("#pillarsGrid")){
  $("#pillarsGrid").innerHTML=PILLARS.map(p=>`<div class="pillar" id="pillar-${p.n}">
    <div class="ptop"><div class="pnum">${p.n}</div><h4>${p.t}</h4></div>
    <div class="blurb">${p.blurb}</div>
    <div class="howlbl">⚙ How it works</div><div class="how">${p.how}</div>
    <div class="pstages">${p.stages.map(id=>`<a class="pchip" href="journey.html#${id}">${SNAME[id]}</a>`).join("")}</div></div>`).join("");
  // flash a pillar if arrived via #pillar-NN
  if(location.hash.startsWith("#pillar-")){const el=document.querySelector(location.hash);
    if(el)setTimeout(()=>{el.style.transition="box-shadow .3s";el.style.boxShadow="0 0 0 3px var(--pillar)";setTimeout(()=>el.style.boxShadow="",1600);},300);}
}

/* ---------- REFERENCE PAGE ---------- */
if($("#faqList"))$("#faqList").innerHTML=FAQ.map(f=>`<details><summary>${f[0]}</summary><div class="a">${f[1]}</div></details>`).join("");
if($("#refBody")){
  $("#refBody").innerHTML=STAGES.map(s=>`<tr data-row="${s.name} ${s.system.map(a=>a.n).join(" ")}"><td><span class="stagetag ${sideCls(s.side)}">${s.num} ${s.name}</span></td><td>${s.system.map(a=>a.n).join(" · ")}</td></tr>`).join("");
  if($("#autosearch"))$("#autosearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();
    $$("#refBody tr").forEach(r=>r.style.display=r.dataset.row.toLowerCase().includes(q)?"":"none");});
}

// feedback (footer, any page)
$$(".feedback button").forEach(b=>b.addEventListener("click",()=>toast(b.dataset.fb==="yes"?"Thanks for the feedback! 🙌":"Thanks — we'll keep improving it.")));

/* ---------- finalise ---------- */
glossarize();
applyRole(localStorage.getItem("xv-role")||"all");
refreshProgress();
