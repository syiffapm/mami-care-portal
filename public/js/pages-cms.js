/* Page renderers for the internal CMS demo under #/cms/*. One tool for
   content, the helpdesk queue, the facility directory, staff access and
   programme analytics/M&E — the same pages exist for everyone, but the
   sidebar and the actions on a page differ by role. Sign-in and the role
   picker are both simulated: any email/password gets you in, and picking
   a role is just this demo's way of trying each view. */
import { I } from './icons.js';
import { LANG } from './i18n.js';
import {
  CMS_ROLES, CMS_ACCESS, CMS_CAN_EDIT, CMS_CAN_REVIEW, CONTENT_STATUS_LABEL,
  KPIS, HELPDESK_CASES, FACILITIES, STAFF, allLibraryItems, libraryTopic,
  CLIENT_SAMPLE, CONTROLLED_LISTS, INTEGRATIONS, INTEGRATION_QUEUE, AUDIT_SAMPLE, CONFIG_PARAMS,
  STAGE_COUNTS, TOTAL_CLIENTS, ENROLLMENT_BY_PROVINCE, CHANNEL_MIX, ENROLMENT_ROUTES,
  REFERRALS, REFERRAL_STATUS_STEPS
} from './data.js';
import { cmsShell, hbarChart, donutChart, statusPill } from './components.js';

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
export function cmsSetStaffRole(i, role){ if(STAFF[i]) STAFF[i].role = role; }
export function cmsToggleStaffStatus(i){
  if(STAFF[i]) STAFF[i].status = STAFF[i].status==='active' ? 'suspended' : 'active';
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
    return `<div class="kpi-card ${k.tone}">
      <div class="klabel">${k.label}</div>
      <div class="kval">${k.current}</div>
      <div class="ktarget">${LANG?'គោលដៅ':'target'} ${k.target}</div>
      <div class="kpi-bar"><span style="width:${k.pct}%"></span></div>
    </div>`;
  }).join('')}</div>`;
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

/* ============ role picker (there is no real per-role login) ============ */
export function pageCmsRolePicker(){
  const cards = CMS_ROLES.map(r=>`
    <button type="button" class="choice" data-role="${r.key}" style="width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:12px;cursor:pointer;margin-bottom:.7rem">
      <span class="ci">${I.user}</span>
      <div><h3${LANG?' class="km"':''}>${LANG?r.kh:r.name}</h3><p>${r.blurb}</p></div>
    </button>`).join('');
  return `
<section>
  <div class="wrap" style="max-width:640px">
    <p class="crumb"><a href="#/">${LANG?'ទំព័រដើម':'Home'}</a> ${I.sep} <span>Mami Care CMS</span></p>
    <div class="formcard" style="margin-top:1.2rem">
      <h1 style="font-size:1.5rem">${LANG?'អ្នកជាអ្នកណានៅថ្ងៃនេះ?':'Which hat are you wearing today?'}</h1>
      <p style="color:var(--ink-2);margin-top:.4rem;font-size:.9rem">${LANG
        ?'ជ្រើសរើសតួនាទីរបស់អ្នក ដើម្បីមើលអ្វីដែលអ្នកនឹងឃើញ។ អ្នកអាចប្តូរបានគ្រប់ពេលពីរបារចំហៀង។'
        :'Pick a role to see what that person would see. You can switch anytime from the sidebar.'}</p>
      <div id="cmsRoleCards" style="margin-top:1.3rem">${cards}</div>
    </div>
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
    <div class="stat-row">
      <div class="stat-card"><div class="slabel">${LANG?'ចំនួនអតិថិជនសរុប':'Total enrolled clients'}</div>
        <div class="sval">${TOTAL_CLIENTS.toLocaleString()}</div>
        <div class="ssub">${LANG?`ក្នុងចំណោម ${ENROLLMENT_BY_PROVINCE.length} ខេត្តកំពូល`:`across the ${ENROLLMENT_BY_PROVINCE.length} leading provinces`}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'បានទាក់ទងជោគជ័យ (៣០ថ្ងៃ)':'Successful contact (30-day)'}</div>
        <div class="sval">${kpi('contact_30d').current}</div>
        <div class="ssub">${LANG?'គោលដៅ':'target'} ${kpi('contact_30d').target}</div></div>
      <div class="stat-card"><div class="slabel">${LANG?'ខេត្តដែលបានទៅដល់':'Provinces reached'}</div>
        <div class="sval">${ENROLLMENT_BY_PROVINCE.length}</div>
        <div class="ssub">${LANG?'នៃ ២៥ ខេត្តទាំងអស់':'of 25 nationally'}</div></div>
    </div>

    <div class="chart-grid-2">
      <div class="chart-card"><h3>${LANG?'អតិថិជនតាមដំណាក់កាល':'Clients by stage'}</h3>
        ${donutChart(STAGE_COUNTS, {labelKey: LANG?'kh':'label', valueKey:'count'})}</div>
      <div class="chart-card"><h3>${LANG?'ការចុះឈ្មោះតាមខេត្ត (កំពូល ៨)':'Enrolment by province (top 8)'}</h3>
        ${hbarChart(ENROLLMENT_BY_PROVINCE, {labelKey:'province', valueKey:'count'})}</div>
    </div>

    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'ការវាស់វែងកម្មវិធី':'Programme KPIs'}</p>
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
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ការផ្សព្វផ្សាយត្រូវបានគ្រប់គ្រងនៅទីនេះ — កម្មវិធីសម្រាប់ម្តាយបង្ហាញតែមាតិកាដែលបានផ្សព្វផ្សាយប៉ុណ្ណោះ។'
      :'Publishing is controlled here — the mother-facing app only ever shows published items.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ចំណងជើង':'Title'}</th><th>${LANG?'ប្រធានបទ':'Topic'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th>${LANG?'ត្រួតពិនិត្យចុងក្រោយ':'Last reviewed'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'content', title: LANG?'មាតិកា':'Content', inner});
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
  `;
  return cmsShell({role, active:'content', title: LANG?'មាតិកា':'Content', inner});
}

/* ============ helpdesk queue ============ */
export function pageCmsHelpdesk(role){
  if(!canSee(role,'helpdesk')) return pageCmsDashboard(role);
  const rows = HELPDESK_CASES.map(c=>`
    <tr data-case="${c.id}">
      <td>${c.id}</td>
      <td style="max-width:26ch">${c.question}</td>
      <td>${c.from}</td>
      <td>${c.channel}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td class="case-status">${caseStatusBadge(c.status)}</td>
      <td class="cms-actions">
        ${c.status==='open' ? `<button class="btn btn-ghost" data-case-action="answer" data-case="${c.id}">${LANG?'សម្គាល់ថាបានឆ្លើយ':'Mark answered'}</button>` : ''}
        ${c.status==='answered' ? `<button class="btn btn-ghost" data-case-action="close" data-case="${c.id}">${LANG?'បិទករណី':'Close case'}</button>` : ''}
      </td>
    </tr>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'សំណួរបន្ទាន់ត្រូវបានឆ្លងកាត់ការឆ្លើយឆ្លងស្វ័យប្រវត្តិ ហើយមកដល់ទីនេះភ្លាមៗ។ សំណួរដែលបានសួរនៅក្នុងកម្មវិធីលេចឡើងទីនេះភ្លាមៗ។'
      :'Urgent questions skip the automated answer and land here immediately — as do any questions asked live in the app.'}</p>
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
      <td>${f.enrolled.toLocaleString()}</td><td>${f.referrals30d}</td><td>${f.phone}</td></tr>`).join('');
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
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ជម្រើសដែលបុគ្គលិកជ្រើសរើសពេលបំពេញទម្រង់ — មិនមែនអត្ថបទសេរីទេ ដើម្បីរក្សាទិន្នន័យស្អាត និងមិនធ្វើរោគវិនិច្ឆ័យ។'
      :'The options staff choose from when filling in a form — never free text, so data stays clean and non-diagnostic.'}</p>
    <div style="display:flex;flex-direction:column;gap:1rem">
      ${CONTROLLED_LISTS.map(l=>`
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1rem 1.15rem">
          <b style="font-size:.9rem">${l.name}</b>
          <div class="chips" style="margin-top:.6rem">${l.values.map(v=>`<span class="chip" style="cursor:default">${v}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
  `;
  return cmsShell({role, active:'master-lists', title: LANG?'បញ្ជីត្រួតពិនិត្យ':'Controlled lists', inner});
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
      ?`អតិថិជនសរុប ${TOTAL_CLIENTS.toLocaleString()} នាក់ត្រូវបានចុះឈ្មោះ។ ខាងក្រោមនេះជាគំរូតូចមួយប៉ុណ្ណោះ — គ្មានឈ្មោះ ឬលេខទូរស័ព្ទពេញលេញបង្ហាញនៅទីនេះទេ។`
      :`${TOTAL_CLIENTS.toLocaleString()} clients are enrolled in total. Below is a small sample — no real names appear anywhere, and contact details stay masked by default.`}</p>
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
      <div class="stat-card"><div class="slabel">${LANG?'ចុះឈ្មោះសរុប':'Total enrolled'}</div><div class="sval">${TOTAL_CLIENTS.toLocaleString()}</div></div>
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
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ការផ្លាស់ប្តូរតួនាទី ឬការផ្អាកគណនីមួយ មិនប៉ះពាល់ដល់អ្នកប្រើប្រាស់ផ្សេងទៀតឡើយ។'
      :'Changing one person’s role or access never affects anyone else’s.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ឈ្មោះ':'Name'}</th><th>${LANG?'អង្គភាព':'Organisation'}</th><th>${LANG?'តួនាទី':'Role'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'users', title: LANG?'អ្នកប្រើប្រាស់ និងសិទ្ធិ':'Users & access', inner});
}
