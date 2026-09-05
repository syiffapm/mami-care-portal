/* Page renderers for the internal CMS demo under #/cms/*. One tool for
   content, the helpdesk queue, the facility directory, staff access and
   programme analytics/M&E — the same pages exist for everyone, but the
   sidebar and the actions on a page differ by role. Sign-in is simulated
   (any email/password gets you in) and lands on the full Programme Admin
   view; the sidebar's "Switch role" control is this demo's way of trying
   the other views without a second login. */
import { I } from './icons.js';
import { LANG } from './i18n.js';
import {
  CMS_ROLES, CMS_ACCESS, CMS_CAN_EDIT, CMS_CAN_REVIEW, CONTENT_STATUS_LABEL,
  KPIS, HELPDESK_CASES, FACILITIES, STAFF, allLibraryItems, libraryTopic, LIBRARY_TOPICS,
  CLIENT_SAMPLE, CONTROLLED_LISTS, INTEGRATIONS, INTEGRATION_QUEUE, AUDIT_SAMPLE, CONFIG_PARAMS,
  STAGE_COUNTS, TOTAL_CLIENTS, ENROLLMENT_BY_PROVINCE, CHANNEL_MIX, ENROLMENT_ROUTES,
  REFERRALS, REFERRAL_STATUS_STEPS,
  KPI_EVIDENCE, HEADLINE_FIGURES, FUNNEL, COST_MODEL,
  SUPPRESSION_REGISTRY, SUPPRESSION_EVENTS_TODAY, FORBIDDEN_HEALTH_TERMS,
  PROGRAMME_DECISIONS, DECISION_BLOCK_LABEL,
  SMS_SEGMENT_CHARS, IVR_ROUTINE_CAP_SECONDS,
  smsSegments, smsCostPer100k, ivrDurationSeconds, formatDuration
} from './data.js';
import { cmsShell, hbarChart, donutChart, statusPill, evidenceBadge, notifPreview } from './components.js';

/* Rendered once at page-load for whatever text a variant already has
   (empty string for a brand-new item); router.js re-renders these same
   inner fragments live, on every keystroke, via the exported ids below. */
export function smsMeter(text){
  const segs = smsSegments(text);
  const over = segs > 4; // a routine content item running to 5+ segments is a length-discipline smell, not a hard rule
  const html = `<span>${(text||'').trim().length} / ${SMS_SEGMENT_CHARS} ${LANG?'តួអក្សរ':'characters'} · ${segs} ${LANG?'ចម្រៀក':segs===1?'segment':'segments'}</span>
    <span>$${smsCostPer100k(text).toFixed(2)} ${LANG?'ក្នុងការផ្ញើ ១០០.០០០ដង':'per 100,000 sends'}</span>`;
  return { html, over };
}
export function ivrMeter(text){
  const secs = ivrDurationSeconds(text);
  const over = secs > IVR_ROUTINE_CAP_SECONDS;
  const html = `${LANG?'រយៈពេលប៉ាន់ស្មាន':'Estimated duration'}: ${formatDuration(secs)}${over
    ? ` — ${LANG?`លើសកម្រិតកំណត់ ${IVR_ROUTINE_CAP_SECONDS} វិនាទីសម្រាប់ការហៅធម្មតា`:`exceeds the ${IVR_ROUTINE_CAP_SECONDS}-second routine call cap`}`
    : ''}`;
  return { html, over };
}
export function variantPreviewRow(text){
  return `<div class="variant-preview-row">
    <div><div class="vp-label">${LANG?'ការមើលធម្មតា':'Normal preview'}</div>${notifPreview({body:text, safe:false})}</div>
    <div><div class="vp-label">${LANG?'ការមើលនៅពេលទូរស័ព្ទរួម (Safe contact)':'Safe-contact preview (shared handset)'}</div>${notifPreview({body:text, safe:true})}</div>
  </div>`;
}

/* Orchestration/Safe Mode is a session-only demo flag — a real one would
   live on the server side of the orchestrator (blueprint §5), not in a
   page module, but this is enough to show what the control does. */
const ORCH_STATE = { safeMode: false };

const canSee = (role, section) => (CMS_ACCESS[role]||[]).includes(section);
const kpi = key => KPIS.find(k=>k.key===key);

/* Mutators — the CMS and the mother-facing app both read the same
   in-memory arrays, so approving or withdrawing something here is
   visible over in #/app/library within the same session, exactly as
   the published/draft split is meant to behave. */
export function cmsSetContentStatus(slug, status){
  const item = allLibraryItems().find(x=>x.slug===slug);
  if(item) item.status = status;
}
export function cmsSetCaseStatus(id, status){
  const c = HELPDESK_CASES.find(x=>x.id===id);
  if(c) c.status = status;
}
/* Composer safety gate (§6.3): the lexicon blocks anything that reads
   as health instruction — dosage, medication names, diagnosis — with
   no self-override. A blocked reply is never sent, not even edited
   and resent by the same person; it has to go back through the
   clinical-review workflow instead. */
export function cmsCheckReplyText(text){
  const t = (text||'').toLowerCase();
  const hit = FORBIDDEN_HEALTH_TERMS.find(term => t.includes(term.toLowerCase()));
  return hit ? { blocked:true, term:hit } : { blocked:false };
}
export function cmsSendHelpdeskReply(id, text){
  const check = cmsCheckReplyText(text);
  if(check.blocked) return check;
  const c = HELPDESK_CASES.find(x=>x.id===id);
  if(c){ c.reply = text; c.status = 'answered'; }
  return check;
}
export function cmsSetStaffRole(i, role){ if(STAFF[i]) STAFF[i].role = role; }
export function cmsToggleStaffStatus(i){
  if(STAFF[i]) STAFF[i].status = STAFF[i].status==='active' ? 'suspended' : 'active';
}
export function cmsSetSafeMode(v){ ORCH_STATE.safeMode = v; }
export function cmsIsSafeMode(){ return ORCH_STATE.safeMode; }
/* A routine job would be suppressed by Safe Mode itself, or by whichever
   condition the console is simulating — the dry run just reports which
   one wins, never actually sends anything. */
export function cmsDryRun(code){
  if(ORCH_STATE.safeMode) return { suppressed:true, code:'SAFE_MODE', entry:{ code:'SAFE_MODE', condition:'Safe Mode is on', override:'URGENT_PROTOCOL only' } };
  if(!code) return { suppressed:false };
  const entry = SUPPRESSION_REGISTRY.find(s=>s.code===code);
  return { suppressed:true, code, entry };
}

function statusBadge(status){
  const tone = {published:'ok', pending_review:'brand', draft:'', withdrawn:'warn'}[status] || '';
  return `<span class="pill${tone?' pill-'+tone:''}">${LANG?CONTENT_STATUS_LABEL[status][1]:CONTENT_STATUS_LABEL[status][0]}</span>`;
}
function priorityBadge(p){
  return p==='urgent'
    ? `<span class="pill pill-warn">${LANG?'បន្ទាន់':'Urgent'}</span>`
    : `<span class="pill">${LANG?'ធម្មតា':'Normal'}</span>`;
}
function caseStatusBadge(s){
  const tone = {open:'warn', answered:'brand', closed:'ok'}[s] || '';
  const label = {open:['Open','កំពុងរង់ចាំ'], answered:['Answered','បានឆ្លើយ'], closed:['Closed','បានបិទ']}[s];
  return `<span class="pill${tone?' pill-'+tone:''}">${LANG?label[1]:label[0]}</span>`;
}
function kpiCards(keys){
  return `<div class="kpi-grid">${keys.map(kk=>{
    const k = kpi(kk); if(!k) return '';
    const ev = KPI_EVIDENCE[kk];
    return `<div class="kpi-card ${k.tone}">
      <div class="klabel">${k.label}</div>
      <div class="kval">${k.current}</div>
      <div class="ktarget">${LANG?'គោលដៅ':'target'} ${k.target}</div>
      <div class="kpi-bar"><span style="width:${k.pct}%"></span></div>
      ${ev ? `<div style="margin-top:.5rem">${evidenceBadge(ev.evidence)}</div>
        <p class="ev-note small">${LANG?'ភាគបែង':'Denominator'}: ${ev.denominator} · ${LANG?'ប្រភព':'source'}: ${ev.source}</p>` : ''}
    </div>`;
  }).join('')}</div>`;
}

/* Headline figures (blueprint §6.7) — each one is only ever shown with
   its evidence class, denominator and source attached, never as a bare
   number, so a projection can never be read back as a verified count. */
function headlineFiguresRow(){
  return `<div class="stat-row">${HEADLINE_FIGURES.map(f=>`
    <div class="stat-card">
      <div class="slabel">${f.label}</div>
      <div class="sval">${f.value}</div>
      <div style="margin:.5rem 0 .3rem">${evidenceBadge(f.evidence)}</div>
      <div class="ev-source small">${LANG?'ភាគបែង':'Denominator'}: ${f.denominator}</div>
      <div class="ev-source small">${LANG?'ប្រភព':'Source'}: ${f.source}</div>
    </div>`).join('')}</div>`;
}

function funnelSection(){
  return `<div class="chart-card">
    <h3>${LANG?'ខ្សែសង្វាក់ដំណើរការ (៩ដំណាក់កាល)':'Funnel — 9 stages, eligible to continuity'}</h3>
    <p class="small" style="margin-bottom:.8rem">${LANG
      ?'នីមួយៗគិតជាភាគរយនៃចំនួនសិទ្ធិទទួលបាន — មិនមែនជាការប្រៀបធៀបមណ្ឌលទេ។'
      :'Each stage is a share of the eligible population — this is a pipeline view, never a facility comparison.'}</p>
    ${hbarChart(FUNNEL, {labelKey:'stage', valueKey:'value', formatValue:v=>v+'%'})}
  </div>`;
}

function costModelPanel(){
  return `<div class="chart-card">
    <h3>${LANG?'គំរូការចំណាយ (§10)':'Cost model (§10)'}</h3>
    <p class="small" style="margin-bottom:.9rem">${LANG
      ?'តម្លៃប៉ាន់ស្មាន សម្រាប់ផែនការ — មិនមែនជាវិក្កយបត្រពិតប្រាកដទេ។'
      :'Planning estimates, not actuals — for budget conversations, not billing.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ឆានែល':'Channel'}</th><th>${LANG?'ឯកតា':'Unit'}</th><th>${LANG?'អត្រា':'Rate'}</th></tr></thead>
      <tbody>${COST_MODEL.rates.map(r=>`<tr><td>${r.channel}</td><td class="small">${r.unit}</td><td>${r.rate}</td></tr>`).join('')}</tbody>
    </table></div>
    <div class="stat-row" style="margin-top:1rem">
      <div class="stat-card"><div class="slabel">${LANG?'តម្លៃក្នុងមួយអតិថិជន (២៤ខែ)':'Per-subscriber cost (24mo)'}</div><div class="sval">${COST_MODEL.perSubscriber24mo}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'ចំណែក IVR ក្នុងតម្លៃ':'IVR share of cost'}</div><div class="sval">${COST_MODEL.ivrShareOfCost}</div>
        <div class="ssub">${LANG?`ប៉ុន្តែ ${COST_MODEL.ivrShareOfContacts} នៃការទាក់ទងប៉ុណ្ណោះ`:`for just ${COST_MODEL.ivrShareOfContacts} of contacts`}</div></div>
    </div>
    <p class="small" style="margin-top:.9rem">${LANG
      ?'សមាមាត្រនេះទើបជាចំណុចសំខាន់ — IVR មានតម្លៃខ្ពស់ជាង ៣–៤ដង ធៀបនឹងភាគរយនៃការប្រើប្រាស់ពិតរបស់វា។'
      :'It’s the ratio that matters, not the headline percentages — IVR still costs 3–4× more, proportionally, than how often it’s actually used.'}</p>

    <p class="eyebrow" style="display:block;margin:1.3rem 0 .6rem">${LANG?'ការបំបែកតម្លៃក្នុងមួយអតិថិជន (២៤ខែ)':'Per-subscriber cost breakdown (24mo)'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ឆានែល':'Channel'}</th><th>${LANG?'ចំណាយប៉ាន់ស្មាន':'Estimated cost'}</th></tr></thead>
      <tbody>${COST_MODEL.breakdown.map(b=>`<tr><td>${b.channel}</td><td>${b.cost}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="eyebrow" style="display:block;margin:1.3rem 0 .6rem">${LANG?'សម្មតិកម្មនៃការគណនា':'Assumptions behind this'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <tbody>${COST_MODEL.assumptions.map(a=>`<tr><td class="small">${a.label}</td><td>${a.value}</td></tr>`).join('')}</tbody>
    </table></div>

    <p class="eyebrow" style="display:block;margin:1.3rem 0 .6rem">${LANG?'សេណារីយ៉ូធ្វើមាត្រដ្ឋាន':'Scale scenarios'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ដំណាក់កាល':'Scale'}</th><th>${LANG?'ចំនួនអតិថិជន':'Subscribers'}</th><th>${LANG?'កំណត់ចំណាំ':'Note'}</th></tr></thead>
      <tbody>${COST_MODEL.scenarios.map(s=>`<tr><td>${s.scale}</td><td>${s.subscribers}</td><td class="small">${s.note}</td></tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

/* ============ sign-in (simulated) ============ */
export function pageCmsCredentials(){
  return `
<section>
  <div class="wrap" style="max-width:440px">
    <p class="crumb"><a href="#/">${LANG?'ទំព័រដើម':'Home'}</a> ${I.sep} <span>Mami Care CMS</span></p>
    <div class="formcard" style="margin-top:1.2rem">
      <h1 style="font-size:1.5rem">Mami Care CMS</h1>
      <p style="color:var(--ink-2);margin-top:.4rem;font-size:.9rem">${LANG
        ?'សម្រាប់បុគ្គលិក និងដៃគូប៉ុណ្ណោះ។ នេះជាការសាកល្បង — បញ្ចូលអ្វីក៏បានដើម្បីបន្ត។'
        :'For staff and partners only. This is a demo — any email and password will do.'}</p>
      <form id="cmsLoginForm" style="margin-top:1.3rem;display:flex;flex-direction:column;gap:1rem">
        <div class="field"><label for="cmsEmail">${LANG?'អ៊ីមែល':'Email'}</label>
          <input id="cmsEmail" type="email" placeholder="you@moh.gov.kh" required></div>
        <div class="field"><label for="cmsPassword">${LANG?'ពាក្យសម្ងាត់':'Password'}</label>
          <input id="cmsPassword" type="password" placeholder="••••••••" required></div>
        <button class="btn btn-primary" type="submit" style="width:100%">${LANG?'ចូល':'Sign in'} ${I.arrow}</button>
      </form>
      <p class="small" style="margin-top:1rem;text-align:center">${LANG
        ?'ត្រូវការគណនី? សូមស្នើសុំតាមរយៈអ្នកគ្រប់គ្រងកម្មវិធីរបស់អ្នក។'
        :'Need an account? Ask your programme administrator to invite you.'}</p>
    </div>
    <div class="callout" style="margin-top:1.2rem"><p>${LANG
      ?'ការចូលទាំងអស់ត្រូវការការផ្ទៀងផ្ទាត់ពីរជាន់ (MFA) ក្នុងប្រព័ន្ធពិត។ ការសាកល្បងនេះលោត MFA ដើម្បីភាពសាមញ្ញ។'
      :'Real sign-ins require MFA. This demo skips that step for simplicity.'}</p></div>
  </div>
</section>`;
}

/* ============ dashboard — full picture for admin/analyst,
   a content-focused summary for editor/reviewer ============ */
export function pageCmsDashboard(role){
  if(role==='editor' || role==='reviewer'){
    const items = allLibraryItems();
    const counts = items.reduce((a,x)=>{ a[x.status]=(a[x.status]||0)+1; return a; }, {});
    const mine = role==='editor' ? items.filter(x=>x.status==='draft') : items.filter(x=>x.status==='pending_review');
    const cards = [
      ['published','Published','ok'], ['pending_review','Pending review','brand'],
      ['draft','Draft',''], ['withdrawn','Withdrawn','warn']
    ];
    const inner = `
      <p class="small" style="margin-bottom:1.2rem">${role==='editor'
        ? (LANG?'ស្ថានភាពមាតិកាទាំងអស់ និងព្រាងរបស់អ្នកផ្ទាល់។':'Content status across the board, and the drafts that are yours to move forward.')
        : (LANG?'ស្ថានភាពមាតិកាទាំងអស់ និងអ្វីដែលកំពុងរង់ចាំការត្រួតពិនិត្យរបស់អ្នក។':'Content status across the board, and what is waiting on your clinical review.')}</p>
      <div class="kpi-grid">
        ${cards.map(([k,label,tone])=>`
          <div class="kpi-card${tone?' '+tone:''}">
            <div class="klabel">${label}</div>
            <div class="kval">${counts[k]||0}</div>
          </div>`).join('')}
      </div>
      <p class="eyebrow" style="display:block;margin-bottom:.8rem">${role==='editor'
        ? (LANG?'ព្រាងរបស់អ្នក':'Your drafts')
        : (LANG?'កំពុងរង់ចាំការត្រួតពិនិត្យរបស់អ្នក':'Waiting on your review')}</p>
      ${mine.length ? `<div class="cms-table-wrap"><table class="cms-table"><thead><tr><th>${LANG?'ចំណងជើង':'Title'}</th><th>${LANG?'ប្រធានបទ':'Topic'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th></th></tr></thead><tbody>
        ${mine.map(x=>`<tr><td>${x.title}</td><td>${libraryTopic(x.topic)?.name||x.topic}</td><td>${statusBadge(x.status)}</td>
          <td><a href="#/cms/content/${x.slug}">${LANG?'បើក':'Open'} ${I.arrow}</a></td></tr>`).join('')}
      </tbody></table></div>` : `<p class="small">${LANG?'គ្មានធាតុទេឥឡូវនេះ។':'Nothing here right now.'}</p>`}
    `;
    return cmsShell({role, active:'dashboard', title: LANG?'ផ្ទាំងគ្រប់គ្រង':'Dashboard', inner});
  }

  const inner = `
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'តួលេខសំខាន់ៗ':'Headline figures'}</p>
    ${headlineFiguresRow()}

    <div class="stat-row" style="margin-top:1.2rem">
      <div class="stat-card"><div class="slabel">${LANG?'ចំនួនអតិថិជនសរុប':'Total enrolled clients'}</div>
        <div class="sval">${TOTAL_CLIENTS.toLocaleString('en-US')}</div>
        <div class="ssub">${LANG?`ក្នុងចំណោម ${ENROLLMENT_BY_PROVINCE.length} ខេត្តកំពូល`:`across the ${ENROLLMENT_BY_PROVINCE.length} leading provinces`}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'បានទាក់ទងជោគជ័យ (៣០ថ្ងៃ)':'Successful contact (30-day)'}</div>
        <div class="sval">${kpi('contact_30d').current}</div>
        <div class="ssub">${LANG?'គោលដៅ':'target'} ${kpi('contact_30d').target}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'ខេត្តដែលបានទៅដល់':'Provinces reached'}</div>
        <div class="sval">${ENROLLMENT_BY_PROVINCE.length}</div>
        <div class="ssub">${LANG?'នៃ ២៥ ខេត្តទាំងអស់':'of 25 nationally'}</div></div>
    </div>

    <div class="chart-grid-2" style="margin-top:1.2rem">
      <div class="chart-card"><h3>${LANG?'អតិថិជនតាមដំណាក់កាល':'Clients by stage'}</h3>
        ${donutChart(STAGE_COUNTS, {labelKey: LANG?'kh':'label', valueKey:'count'})}</div>
      <div class="chart-card"><h3>${LANG?'ការចុះឈ្មោះតាមខេត្ត (កំពូល ៨)':'Enrolment by province (top 8)'}</h3>
        ${hbarChart(ENROLLMENT_BY_PROVINCE, {labelKey:'province', valueKey:'count'})}</div>
    </div>

    <p class="eyebrow" style="display:block;margin:1.4rem 0 .8rem">${LANG?'ខ្សែសង្វាក់ដំណើរការ':'Funnel'}</p>
    ${funnelSection()}

    <p class="eyebrow" style="display:block;margin:1.4rem 0 .8rem">${LANG?'ការវាស់វែងកម្មវិធី':'Programme KPIs'}</p>
    ${kpiCards(KPIS.map(k=>k.key))}
    <div class="callout" style="margin-top:1.4rem"><p>${LANG
      ?'នេះជាការវាស់វែងកម្មវិធីដូចគ្នាដែលកំណត់ក្នុងឯកសារតម្រូវការអាជីវកម្ម (BRD-01 §2.2)។ ពណ៌លឿងបង្ហាញពីចំណុចដែលនៅក្រោមគោលដៅ។ សម្រាប់ការវិភាគស៊ីជម្រៅ សូមមើល '
      :'These are the exact programme measures from the business requirements (BRD-01 §2.2). Amber means below target — not a fault, just where to look next. For deeper cuts, see '}<a href="#/cms/reports/coverage" style="color:var(--brand);font-weight:600">${LANG?'របាយការណ៍ និងសវនកម្ម':'Reports & audit'}</a>.</p></div>
  `;
  return cmsShell({role, active:'dashboard', title: LANG?'ផ្ទាំងគ្រប់គ្រង':'Dashboard', inner});
}

/* ============ content queue ============ */
export function pageCmsContent(role){
  if(!canSee(role,'content')) return pageCmsDashboard(role);
  const items = allLibraryItems();
  const rows = items.map(x=>`
    <tr>
      <td><a href="#/cms/content/${x.slug}">${x.title}</a></td>
      <td>${libraryTopic(x.topic)?.name || x.topic}</td>
      <td>${statusBadge(x.status)}</td>
      <td>${x.reviewed}</td>
    </tr>`).join('');
  const canCreate = CMS_CAN_EDIT.includes(role);
  const inner = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <p class="small" style="max-width:60ch">${LANG
        ?'ការផ្សព្វផ្សាយត្រូវបានគ្រប់គ្រងនៅទីនេះ — កម្មវិធីសម្រាប់ម្តាយបង្ហាញតែមាតិកាដែលបានផ្សព្វផ្សាយប៉ុណ្ណោះ។'
        :'Publishing is controlled here — the mother-facing app only ever shows published items.'}</p>
      ${canCreate ? `<a class="btn btn-primary btn-sm" href="#/cms/content/new">${I.check} ${LANG?'ធាតុថ្មី':'New content item'}</a>` : ''}
    </div>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ចំណងជើង':'Title'}</th><th>${LANG?'ប្រធានបទ':'Topic'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th>${LANG?'ត្រួតពិនិត្យចុងក្រោយ':'Last reviewed'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'content', title: LANG?'មាតិកា':'Content', inner});
}

/* Create — drafts land in the same queue, at CMS_CAN_EDIT roles only. */
export function pageCmsContentNew(role){
  if(!CMS_CAN_EDIT.includes(role)) return pageCmsContent(role);
  const inner = `
    <p class="crumb" style="margin-bottom:1.1rem"><a href="#/cms/content">${LANG?'មាតិកា':'Content'}</a> ${I.sep} <span>${LANG?'ធាតុថ្មី':'New content item'}</span></p>
    <form id="cmsContentNewForm" style="max-width:60ch;display:flex;flex-direction:column;gap:1rem">
      <div class="field"><label for="ccnTitle">${LANG?'ចំណងជើង':'Title'}</label><input id="ccnTitle" type="text" required placeholder="${LANG?'ឧ. ការគេងឱ្យបានល្អសម្រាប់ម្តាយថ្មី':'e.g. Getting enough sleep as a new mother'}"></div>
      <div class="field"><label for="ccnTopic">${LANG?'ប្រធានបទ':'Topic'}</label>
        <select id="ccnTopic">${LIBRARY_TOPICS.map(t=>`<option value="${t.slug}">${t.name}</option>`).join('')}</select></div>
      <div class="field"><label for="ccnMinutes">${LANG?'រយៈពេលអាន/ស្តាប់ (នាទី)':'Read/listen time (minutes)'}</label><input id="ccnMinutes" type="number" min="1" max="10" value="2"></div>
      <div class="field"><label for="ccnSummary">${LANG?'សេចក្តីសង្ខេប':'Summary'}</label><input id="ccnSummary" type="text" required placeholder="${LANG?'មួយប្រយោគ':'One sentence for the library card'}"></div>
      <div class="field"><label for="ccnBody">${LANG?'អត្ថបទ (សម្រាប់វិបសាយ/បណ្ណាល័យ)':'Body (web / library)'}</label>
        <textarea id="ccnBody" rows="5" required placeholder="${LANG?'ប្រយោគនីមួយៗ ជាបន្ទាត់ថ្មី':'One paragraph per line'}" style="font:inherit;font-size:.95rem;padding:.7rem .8rem;border-radius:10px;border:1.5px solid var(--line);resize:vertical"></textarea></div>

      <hr style="border:none;border-top:1px solid var(--line);margin:.2rem 0">
      <p class="eyebrow" style="display:block">${LANG?'ព្រែកតាមឆានែល (§6.4 — អនុម័តដាច់ដោយឡែកក្នុងភាសា និងឆានែលនីមួយៗ)':'Channel variants (§6.4 — approved separately per language and channel)'}</p>

      <div class="field">
        <label for="ccnSms">${LANG?'SMS (ខ្មែរ)':'SMS (Khmer)'}</label>
        <textarea id="ccnSms" rows="3" placeholder="${LANG?'អត្ថបទខ្លីសម្រាប់ផ្ញើតាម SMS':'Short text for SMS delivery'}" style="font:inherit;font-size:.9rem;padding:.6rem .75rem;border-radius:10px;border:1.5px solid var(--line);resize:vertical"></textarea>
        <div class="sms-meter" id="smsMeter">${smsMeter('').html}</div>
      </div>

      <div class="field">
        <label>${LANG?'ការមើលការជូនដំណឹង':'Notification preview'}</label>
        <p class="small" style="margin-bottom:.2rem">${LANG
          ?'របៀបដែលវាបង្ហាញនៅលើអេក្រង់ចាក់សោ — ធៀបជាមួយពេលទូរស័ព្ទត្រូវបានសម្គាល់ថារួម (Safe contact)។'
          :'How this looks as a lock-screen notification — next to what shows when the handset is marked shared (Safe contact).'}</p>
        <div id="smsPreviewRow">${variantPreviewRow('')}</div>
      </div>

      <div class="field">
        <label for="ccnIvr">${LANG?'ស្គ្រីប IVR (ខ្មែរ អានឮៗ)':'IVR script (Khmer, read aloud)'}</label>
        <textarea id="ccnIvr" rows="3" placeholder="${LANG?'អត្ថបទសម្រាប់ការហៅសំឡេងស្វ័យប្រវត្តិ':'Text for the automated voice call'}" style="font:inherit;font-size:.9rem;padding:.6rem .75rem;border-radius:10px;border:1.5px solid var(--line);resize:vertical"></textarea>
        <div class="ivr-meter" id="ivrMeter">${ivrMeter('').html}</div>
      </div>

      <div class="cta-row">
        <button class="btn btn-primary" type="submit">${LANG?'បង្កើតជាព្រាង':'Create draft'}</button>
        <a class="btn btn-ghost" href="#/cms/content">${LANG?'បោះបង់':'Cancel'}</a>
      </div>
    </form>
  `;
  return cmsShell({role, active:'content', title: LANG?'ធាតុថ្មី':'New content item', inner});
}
export function cmsCreateContent({title, topic, minutes, summary, body, smsKm, ivrScript}){
  const slug = (title||'untitled').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').slice(0,60) || 'untitled-'+Date.now();
  const item = {
    slug, topic, status:'draft', minutes: Math.max(1, parseInt(minutes,10)||2),
    reviewed: new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}),
    title, summary, body: (body||'').split('\n').map(s=>s.trim()).filter(Boolean),
    smsKm: (smsKm||'').trim(), ivrScript: (ivrScript||'').trim()
  };
  allLibraryItems().push(item);
  return item;
}
/* Add or revise the SMS/IVR variant on an item that already exists —
   channel variants can be drafted after the item itself, and revised
   independently, without touching its web/library body or status. */
export function cmsSetContentVariants(slug, {smsKm, ivrScript}){
  const item = allLibraryItems().find(x=>x.slug===slug);
  if(!item) return;
  if(smsKm !== undefined) item.smsKm = smsKm.trim();
  if(ivrScript !== undefined) item.ivrScript = ivrScript.trim();
}

export function pageCmsContentDetail(role, slug){
  if(!canSee(role,'content')) return pageCmsDashboard(role);
  const item = allLibraryItems().find(x=>x.slug===slug);
  if(!item) return pageCmsContent(role);
  const topic = libraryTopic(item.topic);
  const actions = [];
  if(CMS_CAN_EDIT.includes(role) && item.status==='draft')
    actions.push(`<button class="btn btn-primary" data-cms-action="submit" data-slug="${slug}">${LANG?'ដាក់ស្នើសម្រាប់ត្រួតពិនិត្យ':'Submit for review'}</button>`);
  if(CMS_CAN_REVIEW.includes(role) && item.status==='pending_review'){
    actions.push(`<button class="btn btn-primary" data-cms-action="approve" data-slug="${slug}">${LANG?'អនុម័ត និងផ្សព្វផ្សាយ':'Approve & publish'}</button>`);
    actions.push(`<button class="btn btn-ghost" data-cms-action="reject" data-slug="${slug}">${LANG?'ផ្ញើត្រឡប់':'Send back to draft'}</button>`);
  }
  if(role==='admin' && item.status==='published')
    actions.push(`<button class="btn btn-ghost" data-cms-action="withdraw" data-slug="${slug}" style="color:var(--urgent)">${LANG?'ដកចេញ':'Withdraw'}</button>`);
  if(role==='admin' && item.status==='withdrawn')
    actions.push(`<button class="btn btn-primary" data-cms-action="republish" data-slug="${slug}">${LANG?'ផ្សព្វផ្សាយឡើងវិញ':'Republish'}</button>`);

  const inner = `
    <p class="crumb" style="margin-bottom:1.1rem"><a href="#/cms/content">${LANG?'មាតិកា':'Content'}</a> ${I.sep} <span>${item.title}</span></p>
    <p class="eyebrow">${LANG?topic?.kh:topic?.name}</p>
    <h2 style="font-size:1.4rem;margin:.3rem 0 .5rem">${item.title}</h2>
    ${statusBadge(item.status)}
    <p class="small" style="margin-top:.8rem">${item.summary}</p>
    <div class="article" style="margin-top:1.1rem;max-width:64ch">${item.body.map(p=>`<p>${p}</p>`).join('')}</div>
    <div id="cmsActionArea" class="cms-actions" style="margin-top:1.4rem">
      ${actions.length ? actions.join('') : `<p class="small">${LANG?'តួនាទីរបស់អ្នកមានសិទ្ធិមើលតែប៉ុណ្ណោះ។':'Your role has read-only access here.'}</p>`}
    </div>

    <hr style="border:none;border-top:1px solid var(--line);margin:1.6rem 0">
    <p class="eyebrow" style="display:block;margin-bottom:.6rem">${LANG?'ព្រែកតាមឆានែល (§6.4)':'Channel variants (§6.4)'}</p>
    ${CMS_CAN_EDIT.includes(role) ? `
      <form id="cmsVariantForm" data-slug="${slug}" style="max-width:60ch;display:flex;flex-direction:column;gap:1rem">
        <div class="field">
          <label for="ccnSms">${LANG?'SMS (ខ្មែរ)':'SMS (Khmer)'}</label>
          <textarea id="ccnSms" rows="3" style="font:inherit;font-size:.9rem;padding:.6rem .75rem;border-radius:10px;border:1.5px solid var(--line);resize:vertical">${item.smsKm||''}</textarea>
          <div class="sms-meter${smsMeter(item.smsKm||'').over?' over':''}" id="smsMeter">${smsMeter(item.smsKm||'').html}</div>
        </div>
        <div class="field">
          <label>${LANG?'ការមើលការជូនដំណឹង':'Notification preview'}</label>
          <div id="smsPreviewRow">${variantPreviewRow(item.smsKm||'')}</div>
        </div>
        <div class="field">
          <label for="ccnIvr">${LANG?'ស្គ្រីប IVR (ខ្មែរ អានឮៗ)':'IVR script (Khmer, read aloud)'}</label>
          <textarea id="ccnIvr" rows="3" style="font:inherit;font-size:.9rem;padding:.6rem .75rem;border-radius:10px;border:1.5px solid var(--line);resize:vertical">${item.ivrScript||''}</textarea>
          <div class="ivr-meter${ivrMeter(item.ivrScript||'').over?' over':''}" id="ivrMeter">${ivrMeter(item.ivrScript||'').html}</div>
        </div>
        <button class="btn btn-primary btn-sm" type="submit" style="align-self:start">${LANG?'រក្សាទុកព្រែក':'Save variants'}</button>
        <p class="small" id="variantSaveOk" hidden style="color:var(--ok)">${LANG?'បានរក្សាទុក។':'Saved.'}</p>
      </form>
    ` : `
      <p class="small" style="margin-bottom:.6rem">${LANG?'SMS (ខ្មែរ)':'SMS (Khmer)'}: ${item.smsKm || `<em>${LANG?'មិនទាន់សរសេរ':'not yet drafted'}</em>`}</p>
      ${item.smsKm ? `<div class="sms-meter">${smsMeter(item.smsKm).html}</div>${variantPreviewRow(item.smsKm)}` : ''}
      <p class="small" style="margin:1rem 0 .3rem">${LANG?'ស្គ្រីប IVR':'IVR script'}: ${item.ivrScript || `<em>${LANG?'មិនទាន់សរសេរ':'not yet drafted'}</em>`}</p>
      ${item.ivrScript ? `<div class="ivr-meter">${ivrMeter(item.ivrScript).html}</div>` : ''}
    `}
  `;
  return cmsShell({role, active:'content', title: LANG?'មាតិកា':'Content', inner});
}

/* ============ helpdesk queue ============ */
export function pageCmsHelpdesk(role){
  if(!canSee(role,'helpdesk')) return pageCmsDashboard(role);
  const rows = HELPDESK_CASES.map(c=>{
    const composable = c.status==='open' || c.status==='answered';
    return `
    <tr data-case="${c.id}">
      <td>${c.id}</td>
      <td style="max-width:26ch">${c.question}</td>
      <td>${c.from}</td>
      <td>${c.channel}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td class="case-status">${caseStatusBadge(c.status)}</td>
      <td class="cms-actions">
        ${composable ? `<button class="btn btn-ghost" data-reply-toggle="${c.id}" type="button">${LANG?'ឆ្លើយតប':'Reply'}</button>` : ''}
        ${c.status==='open' ? `<button class="btn btn-ghost" data-case-action="answer" data-case="${c.id}">${LANG?'សម្គាល់ថាបានឆ្លើយ':'Mark answered'}</button>` : ''}
        ${c.status==='answered' ? `<button class="btn btn-ghost" data-case-action="close" data-case="${c.id}">${LANG?'បិទករណី':'Close case'}</button>` : ''}
      </td>
    </tr>
    ${composable ? `<tr class="helpdesk-reply-row" id="replyRow-${c.id}" hidden>
      <td colspan="7">
        ${c.reply ? `<p class="small" style="margin-bottom:.6rem"><b>${LANG?'ចម្លើយដែលបានផ្ញើ':'Sent reply'}:</b> ${c.reply}</p>` : ''}
        <form class="helpdesk-reply-form" data-case="${c.id}" style="display:flex;flex-direction:column;gap:.6rem;max-width:70ch">
          <textarea rows="3" placeholder="${LANG?'សរសេរចម្លើយនៅទីនេះ… ជៀសវាងណែនាំថ្នាំ ឬការធ្វើរោគវិនិច្ឆ័យ':'Write a reply… avoid medication, dosage, or diagnosis language'}"
            style="font:inherit;font-size:.88rem;padding:.6rem .75rem;border-radius:8px;border:1.5px solid var(--line);resize:vertical"></textarea>
          <div style="display:flex;gap:.6rem;align-items:center">
            <button class="btn btn-primary btn-sm" type="submit">${LANG?'ពិនិត្យ និងផ្ញើ':'Check &amp; send'}</button>
            <span class="small" style="color:var(--muted)">${LANG?'រាល់ចម្លើយត្រូវឆ្លងកាត់ការត្រួតពិនិត្យសុវត្ថិភាព':'Every reply is screened before it sends'}</span>
          </div>
          <p class="reply-blocked small" hidden style="color:var(--urgent)"></p>
        </form>
      </td>
    </tr>` : ''}`;
  }).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'សំណួរបន្ទាន់ត្រូវបានឆ្លងកាត់ការឆ្លើយឆ្លងស្វ័យប្រវត្តិ ហើយមកដល់ទីនេះភ្លាមៗ។ សំណួរដែលបានសួរនៅក្នុងកម្មវិធីលេចឡើងទីនេះភ្លាមៗ។'
      :'Urgent questions skip the automated answer and land here immediately — as do any questions asked live in the app.'}</p>
    <div class="callout" style="margin-bottom:1.2rem"><p><strong>${LANG?'ការការពារសុវត្ថិភាព':'Safety gate'}</strong>${LANG?'។ ':'. '}${LANG
      ?'ចម្លើយណាដែលមានពាក្យស្តីអំពីថ្នាំ ដូសថ្នាំ ឬការធ្វើរោគវិនិច្ឆ័យ នឹងត្រូវរារាំង — គ្មានវិធីបដិសេធដោយខ្លួនឯងទេ។'
      :'A reply that reads as medication, dosage, or diagnosis language is blocked outright — there is no self-override.'}</p></div>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ករណី':'Case'}</th><th>${LANG?'សំណួរ':'Question'}</th><th>${LANG?'ពី':'From'}</th><th>${LANG?'ឆានែល':'Channel'}</th><th>${LANG?'អាទិភាព':'Priority'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'helpdesk', title: LANG?'ជួរជំនួយ':'Helpdesk queue', inner});
}

/* ============ WS-3 Master Data ============ */
export function pageCmsMasterFacilities(role){
  if(!canSee(role,'master')) return pageCmsDashboard(role);
  const rows = FACILITIES.map(f=>`
    <tr><td><b>${f.name}</b><br><span class="small">${f.code}</span></td><td>${f.province}</td><td>${f.type}</td>
      <td>${f.enrolled.toLocaleString('en-US')}</td><td>${f.referrals30d}</td><td>${f.phone}</td></tr>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'អានបានតែប៉ុណ្ណោះ — មកពីទីតាំងកណ្តាលរួម។ លេខទាំងនេះមិនចេញផ្សាយជាសាធារណៈទេ (គ្មានការប្រៀបធៀបប្រតិបត្តិការរវាងមណ្ឌល)។'
      :'Read-only here — from the shared facility master. These figures never appear on the public site (no per-facility performance comparisons).'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'មណ្ឌលសុខភាព':'Facility'}</th><th>${LANG?'ខេត្ត':'Province'}</th><th>${LANG?'ប្រភេទ':'Type'}</th><th>${LANG?'ចុះឈ្មោះ':'Enrolled'}</th><th>${LANG?'ការបញ្ជូនបន្ត (៣០ថ្ងៃ)':'Referrals (30d)'}</th><th>${LANG?'ទូរស័ព្ទ':'Phone'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'master-facilities', title: LANG?'មណ្ឌលសុខភាព':'Facilities', inner});
}
export function pageCmsMasterLists(role){
  if(!canSee(role,'master')) return pageCmsDashboard(role);
  const canEdit = role==='admin';
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ជម្រើសដែលបុគ្គលិកជ្រើសរើសពេលបំពេញទម្រង់ — មិនមែនអត្ថបទសេរីទេ ដើម្បីរក្សាទិន្នន័យស្អាត និងមិនធ្វើរោគវិនិច្ឆ័យ។'
      :'The options staff choose from when filling in a form — never free text, so data stays clean and non-diagnostic.'}</p>
    <div style="display:flex;flex-direction:column;gap:1rem">
      ${CONTROLLED_LISTS.map((l,li)=>`
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1rem 1.15rem">
          <b style="font-size:.9rem">${l.name}</b>
          <div class="chips" style="margin-top:.6rem">${l.values.map((v,vi)=>`
            <span class="chip" style="cursor:default">${v}${canEdit?` <button type="button" data-list-remove="${li}:${vi}" aria-label="${LANG?'ដកចេញ':'Remove'} ${v}" style="border:0;background:none;color:var(--muted);cursor:pointer;padding:0 0 0 .3rem;font-weight:700">×</button>`:''}</span>`).join('')}
          </div>
          ${canEdit ? `<form class="cms-list-add" data-list="${li}" style="display:flex;gap:.5rem;margin-top:.8rem">
            <input type="text" placeholder="${LANG?'តម្លៃថ្មី…':'Add a value…'}" style="flex:1;font:inherit;font-size:.85rem;padding:.45rem .7rem;border-radius:8px;border:1.5px solid var(--line)">
            <button class="btn btn-ghost btn-sm" type="submit">${LANG?'បន្ថែម':'Add'}</button>
          </form>` : ''}
        </div>`).join('')}
    </div>
  `;
  return cmsShell({role, active:'master-lists', title: LANG?'បញ្ជីត្រួតពិនិត្យ':'Controlled lists', inner});
}
export function cmsAddListValue(listIndex, value){
  const l = CONTROLLED_LISTS[listIndex];
  if(l && value && !l.values.includes(value)) l.values.push(value);
}
export function cmsRemoveListValue(listIndex, valueIndex){
  const l = CONTROLLED_LISTS[listIndex];
  if(l) l.values.splice(valueIndex, 1);
}

/* ============ WS-2 Client & Operational Data (pseudonymised) ============ */
export function pageCmsClients(role){
  if(!canSee(role,'clients')) return pageCmsDashboard(role);
  const vTone = v=>v==='verified'?'ok':'';
  const cTone = c=>c==='active'?'ok':c==='paused'?'warn':'';
  const rows = CLIENT_SAMPLE.map((c,i)=>`
    <tr>
      <td><b>${c.ref}</b></td>
      <td>${c.stage}</td>
      <td>${c.facility}</td>
      <td><span class="pill${vTone(c.verification)?' pill-'+vTone(c.verification):''}">${c.verification}</span></td>
      <td><span class="pill${cTone(c.consent)?' pill-'+cTone(c.consent):''}">${c.consent}</span></td>
      <td class="pii-cell" data-masked="${c.phoneMasked}" data-real="${c.phoneMasked.replace('x','9')}">${c.phoneMasked}
        <button class="btn btn-ghost" data-unmask="${i}" style="padding:.25rem .55rem;font-size:.72rem;margin-left:.4rem">${LANG?'បង្ហាញ':'Unmask'}</button></td>
    </tr>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?`អតិថិជនសរុប ${TOTAL_CLIENTS.toLocaleString('en-US')} នាក់ត្រូវបានចុះឈ្មោះ។ ខាងក្រោមនេះជាគំរូតូចមួយប៉ុណ្ណោះ — គ្មានឈ្មោះ ឬលេខទូរស័ព្ទពេញលេញបង្ហាញនៅទីនេះទេ។`
      :`${TOTAL_CLIENTS.toLocaleString('en-US')} clients are enrolled in total. Below is a small sample — no real names appear anywhere, and contact details stay masked by default.`}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'លេខយោង':'Service ref'}</th><th>${LANG?'ដំណាក់កាល':'Stage'}</th><th>${LANG?'មណ្ឌលសុខភាព':'Facility'}</th><th>${LANG?'ការផ្ទៀងផ្ទាត់':'Verification'}</th><th>${LANG?'ការយល់ព្រម':'Consent'}</th><th>${LANG?'ទំនាក់ទំនង':'Contact'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div id="unmaskLog" style="margin-top:1.3rem"></div>
    <div class="callout" style="margin-top:1rem"><p><strong>${LANG?'ការបង្ហាញត្រូវការហេតុផល':'Unmasking needs a reason'}</strong>${LANG?'។ ':'. '}${LANG
      ?'រាល់ការបង្ហាញត្រូវបានកត់ត្រាជាមួយអ្នកមើល ពេលវេលា និងហេតុផល។':'Every unmask is logged with who looked, when, and why.'}</p></div>
  `;
  return cmsShell({role, active:'clients', title: LANG?'ទិន្នន័យអតិថិជន':'Clients & data', inner});
}

/* ============ WS-5 Integration & Data Quality ============ */
export function pageCmsIntegration(role){
  if(!canSee(role,'integration')) return pageCmsDashboard(role);
  const tone = s=>({connected:'ok', pending:'brand', not_configured:'warn'}[s]||'');
  const label = s=>({connected:['Connected','បានភ្ជាប់'], pending:['Pending','កំពុងរង់ចាំ'], not_configured:['Not configured','មិនទាន់កំណត់']}[s]);
  const rows = INTEGRATIONS.map(c=>`
    <tr><td><b>${c.id}</b></td><td>${c.name}</td><td>${c.direction}</td><td>${LANG?'កម្រិត':'Level'} ${c.level}</td>
      <td><span class="pill${tone(c.status)?' pill-'+tone(c.status):''}">${LANG?label(c.status)[1]:label(c.status)[0]}</span></td>
      <td class="small">${c.lastSync}</td></tr>`).join('');
  const inner = `
    <div class="kpi-grid">
      <div class="kpi-card"><div class="klabel">${LANG?'ព្រឹត្តិការណ៍កំពុងរង់ចាំ':'Events queued'}</div><div class="kval">${INTEGRATION_QUEUE.queued}</div></div>
      <div class="kpi-card ${INTEGRATION_QUEUE.deadLetter>0?'warn':'ok'}"><div class="klabel">${LANG?'បរាជ័យជាប់លាប់':'Dead letter'}</div><div class="kval">${INTEGRATION_QUEUE.deadLetter}</div></div>
      <div class="kpi-card"><div class="klabel">${LANG?'រង់ចាំផ្គូផ្គង':'Awaiting reconciliation'}</div><div class="kval">${INTEGRATION_QUEUE.reconciliation}</div></div>
    </div>
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ប្រព័ន្ធនេះដំណើរការពេញលេញនៅកម្រិត ០ (គ្មានការតភ្ជាប់ជាមួយប្រព័ន្ធកម្រិតបុគ្គល)។ ការតភ្ជាប់មិនមែនជាលក្ខខណ្ឌចាំបាច់សម្រាប់ដាក់ឱ្យប្រើប្រាស់ទេ។'
      :'The system runs fully at Level 0 (no individual-level system connected yet). Integration is never a launch dependency.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'លេខសម្គាល់':'ID'}</th><th>${LANG?'ការតភ្ជាប់':'Connection'}</th><th>${LANG?'ទិសដៅ':'Direction'}</th><th>${LANG?'កម្រិត':'Level'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th>${LANG?'សមកាលកម្មចុងក្រោយ':'Last sync'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'integration', title: LANG?'ការធ្វើសមាហរណកម្ម':'Integration', inner});
}

/* ============ WS-6 Reports & Audit ============ */
export function pageCmsReportsCoverage(role){
  if(!canSee(role,'reports')) return pageCmsDashboard(role);
  const inner = `
    <div class="stat-row">
      <div class="stat-card"><div class="slabel">${LANG?'ចុះឈ្មោះសរុប':'Total enrolled'}</div><div class="sval">${TOTAL_CLIENTS.toLocaleString('en-US')}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'អត្រាបញ្ចប់ការចុះឈ្មោះ':'Enrollment completion'}</div><div class="sval">${kpi('enroll_complete').current}</div><div class="ssub">${LANG?'គោលដៅ':'target'} ${kpi('enroll_complete').target}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'ការយល់ព្រមនៅ ANC':'Consent at ANC'}</div><div class="sval">${kpi('consent_anc').current}</div><div class="ssub">${LANG?'គោលដៅ':'target'} ${kpi('consent_anc').target}</div></div>
    </div>
    <div class="chart-grid-2">
      <div class="chart-card"><h3>${LANG?'ការចុះឈ្មោះតាមខេត្ត (កំពូល ៨)':'Enrolment by province (top 8)'}</h3>
        ${hbarChart(ENROLLMENT_BY_PROVINCE, {labelKey:'province', valueKey:'count'})}</div>
      <div class="chart-card"><h3>${LANG?'របៀបចូលរួម':'How people join'}</h3>
        ${donutChart(ENROLMENT_ROUTES, {labelKey:'route', valueKey:'pct'})}</div>
    </div>
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'អតិថិជនតាមដំណាក់កាល':'Clients by stage'}</p>
    ${hbarChart(STAGE_COUNTS, {labelKey:'label', valueKey:'count'})}

    <p class="eyebrow" style="display:block;margin:1.4rem 0 .8rem">${LANG?'ការគិតគូរថវិកា':'Programme economics'}</p>
    ${costModelPanel()}
  `;
  return cmsShell({role, active:'reports-coverage', title: LANG?'ការគ្របដណ្តប់ និងចុះឈ្មោះ':'Coverage & enrolment', inner});
}

export function pageCmsReportsReach(role){
  if(!canSee(role,'reports')) return pageCmsDashboard(role);
  const inner = `
    <div class="chart-grid-2">
      <div class="chart-card"><h3>${LANG?'សារតាមឆានែល':'Messages by channel'}</h3>
        ${donutChart(CHANNEL_MIX, {labelKey:'channel', valueKey:'pct'})}</div>
      <div class="chart-card"><h3>${LANG?'ការវាស់វែងទាក់ទង':'Reach measures'}</h3>
        ${hbarChart(KPIS.filter(k=>['contact_30d','sessions','questions','pref_change'].includes(k.key))
          .map(k=>({label:k.label, value:parseFloat(k.current)})), {labelKey:'label', valueKey:'value', formatValue:v=>v})}</div>
    </div>
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'ការវាស់វែងកម្មវិធីពាក់ព័ន្ធ':'Related programme KPIs'}</p>
    ${kpiCards(['contact_30d','sessions','questions','optout','pref_change','optout_time'])}
  `;
  return cmsShell({role, active:'reports-reach', title: LANG?'ការទាក់ទង':'Reach & communication', inner});
}

export function pageCmsReportsReferrals(role){
  if(!canSee(role,'reports')) return pageCmsDashboard(role);
  const counts = REFERRAL_STATUS_STEPS.map(s=>({
    label: {suggested:'Suggested', accepted:'Accepted', contacted:'Contacted', attended:'Attended', closed:'Closed'}[s],
    value: REFERRALS.filter(r=>r.status===s).length
  }));
  const rows = REFERRALS.map(r=>`
    <tr><td>${r.reason}</td><td>${r.facility}</td><td>${r.when}</td><td>${statusPill(r.status)}</td></tr>`).join('');
  const inner = `
    <div class="stat-row">
      <div class="stat-card"><div class="slabel">${LANG?'ការបញ្ជូនបន្តសរុប':'Total referrals'}</div><div class="sval">${REFERRALS.length}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'អត្រាទទួលយក':'Acceptance rate'}</div><div class="sval">${kpi('referral_accept').current}</div><div class="ssub">${LANG?'គោលដៅ':'target'} ${kpi('referral_accept').target}</div></div>
    </div>
    <div class="chart-card" style="margin-bottom:1.6rem"><h3>${LANG?'តាមស្ថានភាព':'By status'}</h3>${hbarChart(counts, {labelKey:'label', valueKey:'value'})}</div>
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'ការបញ្ជូនបន្តថ្មីៗ':'Recent referrals'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'មូលហេតុ':'Reason'}</th><th>${LANG?'មណ្ឌលសុខភាព':'Facility'}</th><th>${LANG?'ពេលវេលា':'When'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'reports-referrals', title: LANG?'ការបញ្ជូនបន្ត':'Referrals', inner});
}

export function pageCmsReportsAudit(role){
  if(!canSee(role,'reports')) return pageCmsDashboard(role);
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ឧបសម្ព័ន្ធតែប៉ុណ្ណោះ — គ្មានតួនាទីណាមួយ រួមទាំង Super Admin អាចកែប្រែ ឬលុបកំណត់ហេតុនេះបានទេ។'
      :'Append-only — no role, including Super Admin, can edit or delete this log.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ពេលវេលា':'When'}</th><th>${LANG?'អ្នកធ្វើសកម្មភាព':'Actor'}</th><th>${LANG?'សកម្មភាព':'Action'}</th><th>${LANG?'កម្មវត្ថុ':'Subject'}</th><th>${LANG?'កំណត់ចំណាំ':'Note'}</th></tr></thead>
      <tbody>${AUDIT_SAMPLE.map(a=>`<tr><td class="small">${a.at}</td><td>${a.actor}</td><td><span class="pill">${a.action}</span></td><td>${a.subject}</td><td class="small">${a.note}</td></tr>`).join('')}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'reports-audit', title: LANG?'កំណត់ហេតុសវនកម្ម':'Audit log', inner});
}

/* ============ Orchestration & safety (blueprint §5.2, §9) ============
   Admin-only. The real orchestrator/event-bus/suppression engine is a
   server-side system this static demo cannot run — this page previews
   its two visible controls instead: the frozen suppression vocabulary
   every subscriber-facing job checks before sending, and Safe Mode (a
   one-switch kill mechanism for anything outbound). */
export function pageCmsOrchestration(role){
  if(!canSee(role,'orchestration')) return pageCmsDashboard(role);
  const totalSuppressed = SUPPRESSION_EVENTS_TODAY.reduce((a,x)=>a+x.count,0);
  const inner = `
    <div class="safemode-card ${ORCH_STATE.safeMode?'on':''}" id="safeModeCard">
      <div>
        <h3>${LANG?'របៀបសុវត្ថិភាព':'Safe Mode'}</h3>
        <p class="small">${LANG
          ?'ពេលបើក សារទាំងអស់ត្រូវបានផ្អាក លើកលែងតែសារបន្ទាន់។ គ្មានការលុប គ្មានការបាត់បង់ទិន្នន័យទេ — គ្រាន់តែផ្អាកការផ្ញើប៉ុណ្ណោះ។'
          :'When on, every outbound job is held except URGENT_PROTOCOL. Nothing is deleted — sending is just paused until it’s switched off.'}</p>
      </div>
      <button type="button" class="safeswitch${ORCH_STATE.safeMode?' on':''}" id="safeModeToggle" role="switch" aria-checked="${ORCH_STATE.safeMode}" aria-label="${LANG?'របៀបសុវត្ថិភាព':'Safe Mode'}"></button>
    </div>

    <div class="chart-grid-2" style="margin-top:1.4rem">
      <div class="chart-card">
        <h3>${LANG?'ការផ្អាកសារថ្ងៃនេះ':'Suppressions today'}</h3>
        <p class="small" style="margin-bottom:.8rem">${LANG?`សរុប ${totalSuppressed} ព្រឹត្តិការណ៍ — គ្មានការផ្អាកណាមួយស្ងាត់ស្ងៀមទេ`:`${totalSuppressed} events in total — no suppression is ever silent`}</p>
        ${hbarChart(SUPPRESSION_EVENTS_TODAY, {labelKey:'code', valueKey:'count'})}
      </div>
      <div class="chart-card">
        <h3>${LANG?'សាកល្បងដំណើរការ (Dry run)':'Dry run simulator'}</h3>
        <p class="small" style="margin-bottom:.8rem">${LANG
          ?'ជ្រើសរើសលក្ខខណ្ឌ ដើម្បីមើលថាតើសារនឹងត្រូវផ្ញើ ឬត្រូវផ្អាក។'
          :'Pick a condition to see whether a routine job would send or be suppressed.'}</p>
        <select id="dryRunCode" style="width:100%;font:inherit;font-size:.85rem;padding:.55rem .7rem;border-radius:8px;border:1.5px solid var(--line);margin-bottom:.8rem">
          <option value="">${LANG?'— គ្មានលក្ខខណ្ឌ (នឹងផ្ញើ) —':'— no condition (would send) —'}</option>
          ${SUPPRESSION_REGISTRY.map(s=>`<option value="${s.code}">${s.code}</option>`).join('')}
        </select>
        <button class="btn btn-primary" id="dryRunBtn" type="button" style="width:100%">${LANG?'ដំណើរការសាកល្បង':'Run dry run'}</button>
        <div id="dryRunResult" hidden></div>
      </div>
    </div>

    <p class="eyebrow" style="display:block;margin:1.6rem 0 .8rem">${LANG?'បញ្ជីលក្ខខណ្ឌផ្អាកសារ (វាក្យសព្ទថេរ)':'Suppression registry (frozen vocabulary)'}</p>
    <p class="small" style="margin-bottom:.8rem">${LANG
      ?'គ្រប់កិច្ចការផ្ញើសារត្រូវពិនិត្យបញ្ជីនេះមុននឹងផ្ញើ។ លេខកូដទាំងនេះមិនអាចផ្លាស់ប្តូរដោយសេរីទេ — ត្រូវការសំណើផ្លាស់ប្តូរជាផ្លូវការ។'
      :'Every send job checks this list before dispatch. These codes are not free text — changing one needs a formal change request.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'លេខកូដ':'Code'}</th><th>${LANG?'លក្ខខណ្ឌ':'Condition'}</th><th>${LANG?'អាចបដិសេធបានទេ?':'Override'}</th></tr></thead>
      <tbody>${SUPPRESSION_REGISTRY.map(s=>`<tr><td><code>${s.code}</code></td><td>${s.condition}</td><td class="small">${s.override}</td></tr>`).join('')}</tbody>
    </table></div>

    <p class="eyebrow" style="display:block;margin:1.6rem 0 .8rem">${LANG?'ការសម្រេចចិត្តរបស់ក្រសួង (§16)':'Programme decisions (§16)'}</p>
    <p class="small" style="margin-bottom:.8rem">${LANG
      ?'ការសម្រេចចិត្តទាំង ៩ ដែលរង់ចាំពី MoH/DPHI ។ ការសម្រេចចិត្តទី ១ និង ២ ទប់ស្កាត់ការសាងសង់ផ្ទាល់ — គ្មានអាជ្ញាធរគ្លីនិកអនុម័តមាតិកា ឬបញ្ជីមណ្ឌលមេ។ ទី ៧ និង ៨ ទប់ស្កាត់តែការចាប់ផ្តើមសាកល្បងផ្ទាល់ — ការសាងសង់អាចបន្តទៅមុខបាន។ ទី ៤–៦ ទប់ស្កាត់តែការធ្វើសមាហរណកម្ម — មិនដែលជាលក្ខខណ្ឌចាំបាច់សម្រាប់ការសាកល្បងឡើយ។'
      :'The nine decisions still waiting on MoH/DPHI. Decisions 1 and 2 block the build itself — there is no clinical authority to publish content against, or facility master to enrol against, without them. Decisions 7 and 8 block pilot launch only — the engineering work proceeds now regardless. Decisions 4–6 block integration only, and integration is never a pilot dependency.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>#</th><th>${LANG?'ការសម្រេចចិត្តត្រូវការ':'Decision needed'}</th><th>${LANG?'ដោះសោអ្វី':'Unblocks'}</th><th>${LANG?'ធ្វើអ្វីចន្លោះពេលនេះ':'Do this meanwhile'}</th><th></th></tr></thead>
      <tbody>${PROGRAMME_DECISIONS.map(d=>{
        const b = DECISION_BLOCK_LABEL[d.blocks];
        return `<tr><td>${d.n}</td><td style="max-width:22ch">${d.decision}</td><td class="small" style="max-width:20ch">${d.unblocks}</td>
          <td class="small" style="max-width:30ch">${d.meanwhile}</td>
          <td><span class="pill pill-${b.tone}">${LANG?b.km:b.en}</span></td></tr>`;
      }).join('')}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'orchestration', title: LANG?'ការគ្រប់គ្រង និងសុវត្ថិភាព':'Orchestration & safety', inner});
}

/* ============ WS-7 Configuration ============ */
export function pageCmsConfig(role){
  if(!canSee(role,'config')) return pageCmsDashboard(role);
  const rows = CONFIG_PARAMS.map(p=>`
    <div class="field"><label>${p.label}</label><input type="text" value="${p.value}" data-config="${p.key}"></div>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1.2rem">${LANG
      ?'ប៉ារ៉ាម៉ែត្រទាំងនេះផ្លាស់ប្តូរបានដោយគ្មានការចេញផ្សាយកូដថ្មី។'
      :'These parameters can change without a new code release.'}</p>
    <form id="configForm"><div class="fgrid">${rows}</div>
      <button class="btn btn-primary" type="submit" style="margin-top:1.3rem">${LANG?'រក្សាទុកការផ្លាស់ប្តូរ':'Save changes'}</button>
    </form>
    <div id="configOk" hidden style="margin-top:1.1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានរក្សាទុក':'Saved'}</h3><p>${LANG?'ការផ្លាស់ប្តូរនឹងចូលជាធរមានលើកិច្ចការបន្ទាប់ ដោយមិនចាំបាច់ចេញផ្សាយកូដ។':'Changes take effect on the next job run — no code release needed.'}</p></div></div>
    </div>
  `;
  return cmsShell({role, active:'config', title: LANG?'ការកំណត់':'Configuration', inner});
}

/* ============ users & access ============ */
export function pageCmsStaff(role){
  if(!canSee(role,'users')) return pageCmsDashboard(role);
  const rows = STAFF.map((s,i)=>`
    <tr data-staff="${i}">
      <td>${s.name}</td><td>${s.org}</td>
      <td>
        <select class="cms-role-select" data-staff-role="${i}" ${s.status==='suspended'?'disabled':''}>
          ${CMS_ROLES.map(r=>`<option value="${r.key}" ${r.key===s.role?'selected':''}>${LANG?r.kh:r.name}</option>`).join('')}
        </select>
      </td>
      <td class="staff-status">${s.status==='active'
        ? `<span class="pill pill-ok">${LANG?'សកម្ម':'Active'}</span>`
        : `<span class="pill pill-warn">${LANG?'បានផ្អាក':'Suspended'}</span>`}</td>
      <td><button class="btn btn-ghost" data-staff-toggle="${i}" style="padding:.4rem .7rem;font-size:.78rem">
        ${s.status==='active' ? (LANG?'ផ្អាក':'Suspend') : (LANG?'ធ្វើឱ្យសកម្មឡើងវិញ':'Reactivate')}</button></td>
    </tr>`).join('');
  const inner = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <p class="small" style="max-width:60ch">${LANG
        ?'ការផ្លាស់ប្តូរតួនាទី ឬការផ្អាកគណនីមួយ មិនប៉ះពាល់ដល់អ្នកប្រើប្រាស់ផ្សេងទៀតឡើយ។'
        :'Changing one person’s role or access never affects anyone else’s.'}</p>
      <button class="btn btn-primary btn-sm" id="cmsInviteToggle" type="button">${I.check} ${LANG?'អញ្ជើញអ្នកប្រើប្រាស់':'Invite user'}</button>
    </div>
    <form id="cmsInviteForm" hidden style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.1rem 1.2rem;margin-bottom:1.2rem;display:flex;flex-wrap:wrap;gap:.9rem;align-items:end">
      <div class="field" style="flex:1 1 160px"><label for="ciName">${LANG?'ឈ្មោះ':'Name'}</label><input id="ciName" type="text" required></div>
      <div class="field" style="flex:1 1 160px"><label for="ciOrg">${LANG?'អង្គភាព':'Organisation'}</label><input id="ciOrg" type="text" required placeholder="MoH / MoWA / …"></div>
      <div class="field" style="flex:1 1 160px"><label for="ciRole">${LANG?'តួនាទី':'Role'}</label>
        <select id="ciRole">${CMS_ROLES.map(r=>`<option value="${r.key}">${LANG?r.kh:r.name}</option>`).join('')}</select></div>
      <button class="btn btn-primary" type="submit" style="flex:0 0 auto">${LANG?'ផ្ញើការអញ្ជើញ':'Send invite'}</button>
    </form>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ឈ្មោះ':'Name'}</th><th>${LANG?'អង្គភាព':'Organisation'}</th><th>${LANG?'តួនាទី':'Role'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'users', title: LANG?'អ្នកប្រើប្រាស់ និងសិទ្ធិ':'Users & access', inner});
}
export function cmsInviteStaff({name, org, role}){
  STAFF.push({ name, org, role, status:'active' });
}
