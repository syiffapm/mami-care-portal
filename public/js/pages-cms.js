/* Page renderers for the internal CMS demo under #/cms/*. One tool for
   content, the helpdesk queue, the facility directory, staff access and
   programme analytics/M&E — the same pages exist for everyone, but the
   sidebar and the actions on a page differ by role. There is no real
   login: picking a role on the entry screen is enough to try each view. */
import { I } from './icons.js';
import { LANG } from './i18n.js';
import {
  CMS_ROLES, CMS_ACCESS, CMS_CAN_EDIT, CMS_CAN_REVIEW, CONTENT_STATUS_LABEL,
  KPIS, HELPDESK_CASES, FACILITIES, STAFF, allLibraryItems, libraryTopic
} from './data.js';
import { cmsShell } from './components.js';

const canSee = (role, section) => (CMS_ACCESS[role]||[]).includes(section);

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

/* ============ entry: pick a role (there is no real login) ============ */
export function pageCmsLogin(){
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
      <h1 style="font-size:1.6rem">Mami Care CMS</h1>
      <p style="color:var(--ink-2);margin-top:.4rem;font-size:.95rem">${LANG
        ?'ជ្រើសរើសតួនាទីរបស់អ្នក ដើម្បីមើលអ្វីដែលអ្នកនឹងឃើញ។ នេះជាការសាកល្បង — គ្មានការចូលគណនីពិតប្រាកដទេ។'
        :'Pick a role to see what that person would see. This is a demo — there is no real login behind it.'}</p>
      <div id="cmsRoleCards" style="margin-top:1.3rem">${cards}</div>
    </div>
  </div>
</section>`;
}

/* ============ dashboard — full KPI set for admin/analyst,
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
    <div class="kpi-grid">
      ${KPIS.map(k=>`
        <div class="kpi-card ${k.tone}">
          <div class="klabel">${k.label}</div>
          <div class="kval">${k.current}</div>
          <div class="ktarget">${LANG?'គោលដៅ':'target'} ${k.target}</div>
          <div class="kpi-bar"><span style="width:${k.pct}%"></span></div>
        </div>`).join('')}
    </div>
    <div class="callout"><p>${LANG
      ?'នេះជាការវាស់វែងកម្មវិធីដូចគ្នាដែលកំណត់ក្នុងឯកសារតម្រូវការអាជីវកម្ម (BRD-01 §2.2)។ ពណ៌លឿងបង្ហាញពីចំណុចដែលនៅក្រោមគោលដៅ។'
      :'These are the exact programme measures defined in the business requirements (BRD-01 §2.2). Amber means below target — not a fault, just where to look next.'}</p></div>
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
      ?'សំណួរបន្ទាន់ត្រូវបានឆ្លងកាត់ការឆ្លើយឆ្លងស្វ័យប្រវត្តិ ហើយមកដល់ទីនេះភ្លាមៗ។'
      :'Urgent questions skip the automated answer and land here immediately.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'ករណី':'Case'}</th><th>${LANG?'សំណួរ':'Question'}</th><th>${LANG?'ពី':'From'}</th><th>${LANG?'ឆានែល':'Channel'}</th><th>${LANG?'អាទិភាព':'Priority'}</th><th>${LANG?'ស្ថានភាព':'Status'}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'helpdesk', title: LANG?'ជួរជំនួយ':'Helpdesk queue', inner});
}

/* ============ facility directory (read-only) ============ */
export function pageCmsFacilities(role){
  if(!canSee(role,'facilities')) return pageCmsDashboard(role);
  const rows = FACILITIES.map(f=>`
    <tr><td><b>${f.name}</b><br><span class="small">${f.code}</span></td><td>${f.province}</td><td>${f.type}</td>
      <td>${f.enrolled.toLocaleString()}</td><td>${f.referrals30d}</td><td>${f.phone}</td></tr>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'បញ្ជីនេះអានបានតែប៉ុណ្ណោះ — វាមកពីទីតាំងកណ្តាលរួម មិនមែនកែសម្រួលនៅទីនេះទេ។'
      :'This directory is read-only here — it comes from the shared facility master, not edited in this tool.'}</p>
    <div class="cms-table-wrap"><table class="cms-table">
      <thead><tr><th>${LANG?'មណ្ឌលសុខភាព':'Facility'}</th><th>${LANG?'ខេត្ត':'Province'}</th><th>${LANG?'ប្រភេទ':'Type'}</th><th>${LANG?'ចុះឈ្មោះ':'Enrolled'}</th><th>${LANG?'ការបញ្ជូនបន្ត (៣០ថ្ងៃ)':'Referrals (30d)'}</th><th>${LANG?'ទូរស័ព្ទ':'Phone'}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
  return cmsShell({role, active:'facilities', title: LANG?'មណ្ឌលសុខភាព':'Facilities', inner});
}

/* ============ staff & access ============ */
export function pageCmsStaff(role){
  if(!canSee(role,'staff')) return pageCmsDashboard(role);
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
  return cmsShell({role, active:'staff', title: LANG?'បុគ្គលិក និងសិទ្ធិ':'Staff & access', inner});
}
