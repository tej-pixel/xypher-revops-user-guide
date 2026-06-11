/* ===== Shared data for all pages ===== */
const ORG="https://xypher--saascend.sandbox.lightning.force.com";
const rec=(o,id)=>ORG+"/lightning/r/"+o+"/"+id+"/view";

const GLOSSARY=[
 ["ICP","Ideal Customer Profile","How well a lead/account matches your best-fit customer. Graded A–D by firmographics, persona, tech-stack and behaviour."],
 ["BANT","Budget · Authority · Need · Timeline","A 0–100 qualification score: is there money, a decision-maker, a real need, and a timeframe?"],
 ["MEDDPICC","Metrics, Economic buyer, Decision criteria/process, Paper process, Identify pain, Champion, Competition","A deal-qualification framework. Each dimension scores 0/6.25/12.5 → a 0–100 deal-health score with a RAG status."],
 ["MQL","Marketing Qualified Lead","A lead engaged enough that marketing hands it to sales."],
 ["SAL","Sales Accepted Lead","A lead sales has formally accepted to work."],
 ["SQL","Sales Qualified Lead","A lead qualified enough to become an opportunity."],
 ["Lifecycle","Lifecycle record","The spine that tracks a person's journey (Inquiry → Engaged → MQL → SAL → SQL) with stamped dates and SLAs."],
 ["ARR","Annual Recurring Revenue","Yearly value of a subscription. ARR = MRR × 12."],
 ["MRR","Monthly Recurring Revenue","Monthly subscription value. MRR = Recurring Revenue ÷ contract term in months."],
 ["ACV","Annual Contract Value","The annualised value of a contract."],
 ["TCV","Total Contract Value","The full value of a contract across its whole term."],
 ["Attribution","Attribution credit","A record crediting the campaign/source/meeting that influenced a lead or deal — feeds target attainment."],
 ["Record Type","Record Type","A variant of an object (e.g. New Business vs Renewal opportunity) with its own picklists, page layout and automation rules."],
 ["Forecast Category","Forecast Category","Where a deal sits in the forecast: Pipeline, Best Case, Commit, Closed or Omitted."],
 ["SLA","Service Level Agreement","A time target — e.g. an MQL must be worked within 2 days, tracked automatically."],
 ["Weighted Forecast","Weighted Forecast Value","Deal amount × its stage win-probability — a realistic pipeline number."],
 ["Stage Velocity","Stage Velocity","How long a deal spends in each stage, timed automatically to flag stalls."]
];

const STAGES=[
 {id:"awareness",num:1,side:"acq",roles:["SalesLeadership"],name:"Awareness",color:["#0a1f3c","#1a3f70"],
  purpose:"A new lead enters your world. Your only job is to capture who they are — the system immediately starts a tracked <span class='gl-term'>Lifecycle</span> and credits the source.",
  you:["Create or own a new lead — web form, event list, or manual entry.","Fill the essentials: <b>name, company, title, lead source</b>.","That's it — no manual staging or scoring."],
  system:[{n:"Set Default Lifecycle Stage",d:"Stamps the lead at <b>“1 – Inquiry”</b> automatically."},
          {n:"Lifecycle — Create &amp; Link",d:"Spins up a Lifecycle record and links it — the spine for every stage date from here on."},
          {n:"Firmographic Banding",d:"Turns raw employee count into a clean Employee Band."},
          {n:"Scorecard Auto-Assignment",d:"Attaches the active ICP scorecard so grading can run."},
          {n:"Lead Attribution Engine",d:"Creates an <span class='gl-term'>Attribution</span> record crediting the source campaign."}],
  fields:[["Lead Source","you","Where the lead came from — drives all attribution. Never leave blank."],
          ["Company / Title","you","Used to grade firmographic & persona fit."],
          ["Lifecycle Stage","sys","Auto-set to ‘1 – Inquiry’."],
          ["Employee Band","sys","Auto-banded from employee count."]],
  mistakes:["Leaving <b>Lead Source</b> blank — it silently breaks attribution.","Manually typing a lifecycle stage — let the automation own it."],
  shot:{src:"01-lead.png",cap:"Dana Whitfield enters as a Webinar lead — firmographics captured, lifecycle started.",o:"Lead",id:"00QPt00000OOX8tMAH"},
  quiz:{q:"What sets the lead's lifecycle stage to “1 – Inquiry”?",opts:["You type it in","The Set Default Lifecycle Stage flow","Your manager"],a:1,explain:"A before-save flow stamps it the moment the lead is created — you never set it by hand."}},

 {id:"education",num:2,side:"acq",roles:["SalesLeadership"],name:"Education",color:["#13315c","#1e5391"],
  purpose:"The lead is nurtured and continuously scored. The system tells you how good a fit (<span class='gl-term'>ICP</span>) and how engaged (<span class='gl-term'>BANT</span>) — so you spend time on the right people.",
  you:["Log activities, calls and emails as you nurture.","Read the <span class='gl-term'>ICP</span> Grade and <span class='gl-term'>BANT</span> Score to prioritise.","Advance the lead to <span class='gl-term'>MQL</span> when marketing-qualified."],
  system:[{n:"ICP Firmographic / Persona / Technographic Grade",d:"Grades fit A–D across each dimension."},
          {n:"ICP Composite &amp; Scorecard Grade",d:"Blends sub-grades into one ICP Grade + label (e.g. “Hot ICP”)."},
          {n:"BANT Score Calculation",d:"Weighs Budget·Authority·Need·Timeline into 0–100."},
          {n:"Lifecycle Stage Engine + SLA Start",tag:["sched","scheduled support"],d:"Stamps milestone dates and starts a 2-day SLA at MQL."},
          {n:"Behavioural &amp; Grade Recalculation",tag:["sched","nightly"],d:"Re-scores engagement every night so grades never go stale."}],
  fields:[["BANT inputs","you","Budget/Authority/Need/Timeline flags drive the BANT score."],
          ["ICP Grade","sys","Computed A–D from fit."],["BANT Score","sys","0–100 from your inputs."],
          ["Lifecycle SLA","sys","2-day clock starts at MQL."]],
  mistakes:["Expecting grades to change the instant you edit — they recalc on the relevant field change or overnight.","Ignoring a <b>D / Weak Fit</b> grade and burning time on a poor match."],
  shot:{src:"02-lead-icp-bant.png",cap:"The ICP Grading & BANT sections on Dana's lead — every value written by automation, not typed.",o:"Lead",id:"00QPt00000OOX8tMAH"},
  extra:`<div class="panel" style="margin-top:14px"><div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--good);margin-bottom:12px">📊 What the scoring produced for Dana</div>
    <div class="scorecards"><div class="score a"><div class="k">ICP Grade</div><div class="v">A</div><div class="s">Hot ICP</div></div>
    <div class="score blue"><div class="k">BANT</div><div class="v">100</div><div class="s">Fully Qualified</div></div>
    <div class="score cyan"><div class="k">Lifecycle</div><div class="v">MQL</div><div class="s">SLA running</div></div></div></div>`,
  quiz:{q:"You set all four BANT flags. What BANT score does the system compute?",opts:["50","100","It stays 0 until a manager approves"],a:1,explain:"Budget 30 + Authority 30 + Need 25 + Timeline 15 = 100 → “Fully Qualified”."}},

 {id:"selection",num:3,side:"acq",roles:["AE","SalesLeadership"],name:"Selection",color:["#1b4b85","#2569ad"],
  purpose:"Sales accepts the hand-off and qualifies the deal. The lead converts to an Opportunity and the system carries every scrap of context across so nothing is re-typed.",
  you:["Accept the <span class='gl-term'>SQL</span> hand-off and convert the lead.","Use the <b>“New Opportunity”</b> guided button.","Run discovery; fill <span class='gl-term'>MEDDPICC</span> and set the Next Step."],
  system:[{n:"BDR → AE Hand-off Notification",tag:["sched","async"],d:"Emails the AE on SQL and sets an acceptance-due date."},
          {n:"New Opportunity Intake",tag:["screen","guided flow"],d:"Resolves the account, creates contacts and links roles in one screen."},
          {n:"Conversion Data Stamping + Lifecycle Sync",d:"Copies source, BANT and lineage onto the new Contact & Opportunity."},
          {n:"Opportunity Name Stamp",d:"Auto-builds a structured name from Account/Type/Product/Region/Quarter."},
          {n:"MEDDPICC + BANT Score & Carry-Over",d:"Scores qualification and carries the lead's BANT into the deal."},
          {n:"Pipeline Entry & Stage Velocity Stamp",d:"Marks pipeline entry and starts timing each stage."}],
  fields:[["MEDDPICC statuses","you","Set each dimension Not Started / In Progress / Complete."],
          ["Next Step","you","What happens next + due date."],
          ["Opportunity Name","sys","Auto-stamped — don't fight it."],
          ["Contact Roles","sys","Created from Champion / Decision-Maker / Economic Buyer."]],
  mistakes:["Creating opportunities from scratch instead of the <b>New Opportunity</b> button.","Renaming the opp by hand — the name re-stamps from its fields."],
  shot:{src:"03-opp-live.png",cap:"The live deal — deal-health cards, contact roles and £180k commercials.",o:"Opportunity",id:"006Pt00002D2rR9IAJ"},
  extra:`<div class="panel" style="margin-top:14px"><div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--good);margin-bottom:10px">🎯 MEDDPICC — 87.5 / 100 🟢</div>
   <div class="meddpicc">
    <div class="md"><div class="t">Metrics</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Econ. Buyer</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Decision Crit.</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Decision Proc.</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Paper Process</div><div class="st p">In Progress</div></div>
    <div class="md"><div class="t">Identify Pain</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Champion</div><div class="st c">Complete</div></div>
    <div class="md"><div class="t">Competition</div><div class="st p">In Progress</div></div></div></div>`,
  quiz:{q:"Who creates the Opportunity's structured name?",opts:["You type it","The Name Stamp flow, from the deal's fields","It's left blank"],a:1,explain:"The Name Stamp flow assembles Account – Type – Product – Region – Quarter automatically."}},

 {id:"commit",num:4,side:"acq",roles:["AE","SalesLeadership","Executives"],name:"Commit",color:["#1593cf","#13c6f7"],
  purpose:"The decisive stage of the bowtie. You drive the deal to close — the system handles commercial maths, governance, forecasting and commission so the win is clean and auditable.",
  you:["Advance through <b>Negotiation → Commit</b>, keeping Next Steps current.","Confirm the commercials (Recurring Revenue, term).","Close the deal <b>Won</b> — and pick a <b>Closed Reason</b>."],
  system:[{n:"Stage Change Governance",d:"Blocks stage advance until that stage's required fields are complete."},
          {n:"Deal Amount Validation + Populate ARR",d:"Derives <span class='gl-term'>MRR·ARR·ACV·TCV</span> from recurring revenue & term."},
          {n:"Weighted Forecast + Forecast Submission",tag:["sched","nightly rollup"],d:"Calculates weighted value and rolls deals into the forecast."},
          {n:"Close-Won Velocity Freeze",d:"Stamps the true Actual Close Date the instant you win."},
          {n:"Sales Commission Calculator",d:"On Closed Won, computes commission (12% for deals over £100k) and logs a record."},
          {n:"Deal Approval",tag:["apex","Apex"],d:"Routes approvals and rolls the win up to the Account."}],
  fields:[["Stage","you","Advance it; governance enforces required fields."],
          ["Recurring Revenue / Term","you","Drives the ARR/MRR maths."],
          ["Closed Reason","you","<b>Required</b> to close a deal."],
          ["ARR / MRR / Commission","sys","All computed for you."]],
  mistakes:["Trying to close without a <b>Closed Reason</b> — the save is blocked.","Skipping the <b>Next Step Date</b> — governance won't let you advance."],
  shot:{src:"04-opp-won.png",cap:"Closed Won at £120k — “Great work! You've closed a successful deal.”",o:"Opportunity",id:"006Pt00002D2xGPIAZ"},
  extra:`<div class="panel" style="margin-top:14px"><div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--good);margin-bottom:10px">💷 Generated automatically by the win</div>
   <div class="scorecards"><div class="score a"><div class="k">Won ARR</div><div class="v">£120k</div><div class="s">MRR £10k · 12-mo</div></div>
   <div class="score amber"><div class="k">Commission</div><div class="v">£14.4k</div><div class="s">12% tier · Pending</div></div>
   <div class="score cyan"><div class="k">Account roll-up</div><div class="v">+1</div><div class="s">Won deal counted</div></div></div></div>`,
  quiz:{q:"What must you set before a deal can be saved as Closed Won?",opts:["Nothing — it just closes","A Closed Reason","The commission amount"],a:1,explain:"A validation rule requires a Closed Reason; the commission is then calculated for you."}},

 {id:"onboard",num:5,side:"ret",roles:["AE"],name:"Onboard",color:["#13a3df","#16b9ec"],
  purpose:"The prospect is now a customer. The system rolls the win up to the account and seeds the renewal, so the relationship starts on a clean, measurable footing.",
  you:["Hand off to delivery / Customer Success.","Run the onboarding kickoff (your Next Step is set from the win).","Confirm the account reads cleanly for the CS team."],
  system:[{n:"Create Renewal on Close Won",d:"Generates the next-term <b>Renewal</b> opportunity automatically."},
          {n:"Account Deal Summary Roll-up",tag:["apex","Apex"],d:"Aggregates won deals, amounts and dates onto the Account in one bulk-safe pass."},
          {n:"Target Account Record Management",d:"Stamps start dates & syncs the summary for strategic accounts."}],
  fields:[["Account roll-ups","sys","First/Last/Won opportunity dates & counts."],
          ["Renewal opportunity","sys","Auto-created, dated a term out."]],
  mistakes:["Manually creating a renewal — one already exists (you'd duplicate it).","Forgetting to set the customer up for the CS hand-off."],
  shot:{src:"05-account.png",cap:"The Northwind account — Dana linked, roll-ups now populated.",o:"Account",id:"001Pt00000e9WhhIAE"},
  quiz:{q:"Where does the renewal opportunity come from?",opts:["You create it manually","Auto-created the moment the deal is Closed Won","CS creates it later"],a:1,explain:"The Create-Renewal flow fires on Closed Won and pre-dates the renewal a full term out."}},

 {id:"impact",num:6,side:"ret",roles:["SalesLeadership","Executives"],name:"Impact",color:["#13b0e6","#13c6f7"],
  purpose:"The customer realises value. The system measures engagement and attainment against targets, turning every meeting into a tracked, attributed signal of health.",
  you:["Review attainment, win-ratio and pipeline-coverage on the dashboards.","Inspect stalled deals, SLA breaches and stage velocity across the team.","Ensure meetings &amp; outcomes are logged so health data stays clean."],
  system:[{n:"Activity Attribution Engine",d:"Matches meetings to active Targets and credits Meetings-Booked/Held KPIs."},
          {n:"Target Scorecard Status Engine",tag:["apex","Apex"],d:"Recalculates attainment vs target and sets a RAG status."},
          {n:"Recalculate Velocity Benchmarks",tag:["sched","nightly"],d:"Refreshes win-rate & cycle-time benchmarks."},
          {n:"Meeting Enrichment & Data Quality",d:"Defaults and validates meeting fields so engagement data stays clean."}],
  fields:[["Meeting type / outcome","you","Log it or the data-quality flow flags the event."],
          ["Attribution","sys","Each meeting becomes a Target Attribution record."],
          ["Target attainment","sys","RAG status vs quota."]],
  mistakes:["Logging a meeting without a <b>type/outcome</b> — it gets flagged as incomplete.","Ignoring a target sliding to <b>Red</b> attainment."],
  shot:{src:"exec-dashboard.png",cap:"The Executive Dashboard — quota vs bookings, win ratio, pipeline coverage and forecast, all fed by the automations.",o:"Dashboard",id:"01ZPt00000Bj8j4MAB"},
  quiz:{q:"What turns a logged meeting into a tracked KPI?",opts:["Nothing, meetings aren't tracked","The Activity Attribution Engine","You email your manager"],a:1,explain:"It matches the meeting to active Targets and credits the Meetings-Held KPI automatically."}},

 {id:"grow",num:7,side:"ret",roles:["AE","Executives"],name:"Grow",color:["#15bdf0","#0bd0ff"],
  purpose:"Expand and renew. The renewal the system seeded at the win is waiting; expansion deals link back so revenue is never double-counted.",
  you:["Work the <b>auto-created Renewal</b> ahead of term.","Raise <b>expansion</b> deals via the New Opportunity button.","Run the renewal QBR; present expansion modules."],
  system:[{n:"Create Renewal on Close Won",d:"The renewal opp already exists — pre-dated and ready to forecast."},
          {n:"Link Expansion to Renewal",d:"Ties expansions to the renewal so forward revenue stays coherent."},
          {n:"Update Renewal ARR on Expansion Close",d:"Bumps the renewal's ARR when an expansion closes."},
          {n:"Renewal Duplicate Guard",d:"Stops two renewals being created for the same term."}],
  fields:[["Renewal / Expansion opps","you","Work them ahead of term."],
          ["Renewal ARR","sys","Updates as expansions close."]],
  mistakes:["Starting the renewal late — it already exists, work it early.","Creating a standalone expansion that isn't linked to the renewal."],
  shot:{src:"07-renewal.png",cap:"“Northwind Logistics – Renewal – FY27” at £132k — auto-generated the moment the deal was won.",o:"Opportunity",id:"006Pt00002D2xYAIAZ"},
  quiz:{q:"When should you start working the renewal?",opts:["After it expires","Early — it's auto-created at the win, dated a term out","Renewals aren't tracked"],a:1,explain:"The renewal is created on Closed Won and dated a full term ahead, so it's ready to work immediately."}}
];

const PILLARS=[
 {n:"01",t:"Lead-to-Revenue Lifecycle",
  blurb:"One governed lifecycle across Lead, Contact, Opportunity &amp; Account — synced, staged and SLA-tracked.",
  stages:["awareness","education","selection","onboard"],
  how:"When Dana enters as a lead, <b>Lifecycle — Create &amp; Link</b> spins up a Lifecycle record and links it. The <b>Lifecycle Stage Engine</b> stamps Inquiry → Engaged → MQL with a dated milestone at each step, and <b>SLA Start</b> drops a 2-day clock at MQL. On conversion, <b>Lead Conversion Sync</b> carries the whole history onto the Contact, and the <b>Account roll-up</b> summarises every won deal — one governed thread running Lead → Contact → Opportunity → Account."},
 {n:"02",t:"ICP Scoring &amp; Prioritisation",
  blurb:"Firmographic, persona and composite grades auto-assigned and recalculated nightly.",
  stages:["awareness","education"],
  how:"Dana's industry, size and tech-stack score <b>Firmographic A</b> and <b>Technographic A</b>; her VP-Operations title maps to <b>Persona A</b>; engagement gives <b>Behavioural B</b>. The composite flow blends them into <b>ICP Grade A — “Hot ICP.”</b> The nightly recalculation jobs re-score every lead and contact, so a grade is never stale."},
 {n:"03",t:"Multi-Touch Attribution",
  blurb:"Lead, opportunity and activity attribution rolled up to targets and scorecards.",
  stages:["awareness","impact"],
  how:"The Q2 webinar that generated Dana is credited by the <b>Lead Attribution Engine</b> as a Target Attribution record. Later, every QBR logged against the account is matched to active Targets by the <b>Activity Attribution Engine</b>. The <b>Target Scorecard Status Engine</b> rolls all of it up to quota attainment with a RAG status — credit from first touch to renewal."},
 {n:"04",t:"Forecasting &amp; Analytics",
  blurb:"Weighted forecasts, quota-vs-attainment, and decision-ready dashboards.",
  stages:["commit","impact"],
  how:"Northwind's £180k deal at Negotiation gets a <b>Weighted Forecast Value</b> (amount × stage probability). <b>Sync Forecast Submission</b> rolls every rep's deals into a period forecast, and the <b>nightly Aggregate Rollup</b> totals them per manager against quota. The <b>Executive Dashboard</b> then surfaces quota-vs-bookings, win ratio and pipeline coverage — decision-ready, no spreadsheets."},
 {n:"05",t:"Pipeline Hygiene &amp; Velocity",
  blurb:"Stage governance, velocity stamps, next-step discipline and renewal automation.",
  stages:["selection","commit","grow"],
  how:"<b>Pipeline Entry</b> and <b>Stage Velocity</b> stamps time how long Northwind sits in each stage and flag stalls. <b>Stage Change Governance</b> won't let it advance to Commit without a Next Step Date; <b>Next-Step Pipeline Hygiene</b> raises a task the moment a step goes overdue. On the win, <b>Create Renewal on Close Won</b> seeds the FY27 renewal automatically — pipeline that maintains itself."},
 {n:"06",t:"Deal Governance &amp; Approvals",
  blurb:"MEDDPICC / BANT scoring, deal-amount validation and discount approvals.",
  stages:["selection","commit"],
  how:"As the rep fills the qualification fields, Northwind scores <b>MEDDPICC 87.5 🟢</b> and <b>BANT 100</b>. <b>Deal Amount Validation</b> derives MRR / ARR / ACV from recurring revenue and term, the <b>Deal Approval</b> Apex routes discount &amp; terms sign-off, and a <b>Closed Reason</b> is required before the deal can be marked Won — governance baked into every save."}
];

const FAQ=[
 ["Why didn't my ICP grade update when I edited the lead?","Grades recalc when the relevant field changes, and a nightly job re-scores everyone. If you changed something unrelated, the grade waits for its trigger or the overnight run."],
 ["Why won't Salesforce let me save my stage change?","The Stage Change Governance flow requires certain fields for that stage — e.g. a <b>Next Step Date</b> before Commit, or a <b>Closed Reason</b> to close. Fill the field it names and save again."],
 ["There's a renewal opportunity I didn't create — where did it come from?","It's created automatically the moment a New Business deal is Closed Won, dated a full term out. Work it, don't delete it."],
 ["Why can't I pick a particular Record Type?","Record Types are granted per profile. If one's missing, ask your admin to assign it to your profile."],
 ["My commission looks off / there are two records.","Commission is calculated on Closed Won. If a deal is re-saved as won, the flow can log a second record — your admin is aware and can add a duplicate guard."],
 ["Where do I find all my deals?","The <b>Opportunities</b> tab → pick a list view like “My Open Opportunities”. Use global search for a specific record."]
];

const ROLE_LABELS={AE:"AE",SalesLeadership:"Sales Leadership",Executives:"Executive"};
const CHECKLISTS={
 AE:["Open your live opportunity and review the deal-health cards","Complete the MEDDPICC dimensions","Set a Next Step + due date","Advance the stage and close Won with a Closed Reason","Work the auto-created renewal ahead of term"],
 SalesLeadership:["Open the Executive / Pipeline dashboard and review coverage","Check the forecast roll-up for the current period","Inspect your team's MEDDPICC scores & open next steps","Review SLA breaches and stage-velocity on stalled deals"],
 Executives:["Open the Executive Dashboard","Review quota vs bookings and win ratio","Check pipeline coverage and forecast by category","Review the renewal & expansion pipeline for retention"]
};

const TOUR=[
 ["Click “New Opportunity”","On any Account, hit the <b>New Opportunity</b> button. A guided screen opens — no blank record to figure out."],
 ["Fill the opportunity details","Name, Stage, Amount, Close Date, Type. Stage and Forecast Category default sensibly — you can just keep going."],
 ["Add the champion","Enter the main contact. The flow <b>creates the contact and links the contact role</b> for you — no separate steps."],
 ["Hit Next, then Finish","The opp is created, named automatically, and the scoring/stamping automations fire on save. You're in pipeline."]
];

const HOT=[
 [46,16,"Highlights & stage path","The bar across the top shows the deal's key fields and a clickable <b>stage path</b> — your progress from Qualification to Closed Won."],
 [40,20,"Action buttons","<b>Edit, Change Stage, Mark Stage as Complete</b> — the main actions for this record live here, top-right."],
 [33,32,"Insight cards","These cards (<b>Deal Health, Stage Movement, Activity</b>) are live components summarising the record at a glance."],
 [26,46,"Details tabs","<b>Details</b> shows all the fields in sections; <b>History</b> tracks every change. Click the pencil ✎ to inline-edit a field."],
 [9,34,"Related lists (sidebar)","<b>Contact Roles, Products, Stage Histories</b> — related records linked to this one, shown alongside."],
 [85,30,"Activity & Files","The right rail logs <b>emails, tasks and meetings</b> (the activity timeline) and attached files."]
];

const MOCK=[["Lifecycle Stage","1 – Inquiry"],["ICP Grade","A — Hot ICP"],["BANT Score","100"],["Employee Band","1000+"],["Attribution","Webinar campaign"]];
const SNAME=Object.fromEntries(STAGES.map(s=>[s.id,s.name]));
const GLMAP=Object.fromEntries(GLOSSARY.map(g=>[g[0],g[2]]));
