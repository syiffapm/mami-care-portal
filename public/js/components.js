/* Small reusable render functions shared by multiple pages: cards, tiles,
   the journey timeline widget, news cards and the closing CTA band. */
import { I } from './icons.js';
import { LANG, t, KH_SVC, KH_AUD, KH_WK } from './i18n.js';
import {
  JOURNEY, SC, REFERRAL_STATUS_STEPS, CMS_ROLES, CMS_ACCESS, cmsRole,
  HELPDESK_CASES, allLibraryItems
} from './data.js';

export function tile(s){return `<a class="tile" href="#/services/${s.slug}">
  <span class="ic">${s.icon}</span>
  <h3${LANG?' class="km"':''}>${LANG?s.kh:s.name}</h3><span class="khs${LANG?'':' km'}">${LANG?s.name:s.kh}</span>
  <p${LANG?' class="km"':''}>${LANG?KH_SVC[s.slug]:s.short}</p>
  <span class="go">${t('learn')} ${I.arrow}</span></a>`;}


export function audTile(a){return `<a class="aud" href="#/who/${a.slug}">
  <span style="width:44px;height:44px;color:var(--accent);flex:0 0 auto">${a.icon}</span>
  <span><h3${LANG?' class="km"':''}>${LANG?a.kh:a.name}</h3><span class="khs${LANG?'':' km'}">${LANG?a.name:a.kh}</span>
  <p${LANG?' class="km"':''}>${LANG?KH_AUD[a.slug]:a.short}</p></span></a>`;}


export function journeyWidget(){
  return `<div class="journey">
    <div class="jtrack"><div class="jrow" role="tablist" aria-label="Stages of the Mami Care journey">
      ${JOURNEY.map((s,i)=>`<button class="jstep ${s.k}" role="tab" data-j="${i}" aria-selected="${i===2}">
        <span class="node">${s.ic}</span><span class="lb${LANG?' km':''}">${LANG?s.kh:s.lb}</span><span class="wk${LANG?' km':''}">${LANG?KH_WK[i]:s.wk}</span></button>`).join('')}
    </div></div>
    <div class="jpanel" id="jpanel"></div>
  </div>`;
}

export function renderJourney(i){
  const s=JOURNEY[i], p=document.getElementById('jpanel');
  if(!p) return;
  p.innerHTML=`<div>
    <h3${LANG?' class="km"':''}>${LANG?s.kh:s.lb}</h3><p class="jk${LANG?'':' km'}">${LANG?s.lb+' · '+s.wk:s.kh+' · '+KH_WK[JOURNEY.indexOf(s)]}</p>
    <ul>${s.get.map(g=>`<li>${I.dot}<span>${g}</span></li>`).join('')}</ul>
    <a class="btn btn-primary" style="margin-top:1.2rem" href="#/register">Join at this stage ${I.arrow}</a>
  </div>
  <div class="jsample">
    <p class="cap">Example message</p>
    <div class="bubble" style="font-size:.86rem"><span class="km">${s.msg}</span><span class="en" style="font-size:.75rem">${s.en}</span></div>
    <p class="small" style="margin-top:.8rem">Sent at the time you chose, in Khmer, with a voice version if you asked for one.</p>
  </div>`;
  document.querySelectorAll('.jstep').forEach(b=>b.setAttribute('aria-selected', b.dataset.j==String(i)));
}


export function newsCard(n){return `<a class="news" href="#/news/${n.slug}">
  <span class="ph">${SC[n.img]}</span>
  <span class="nbody">
    <span class="news-meta"><span class="cat">${n.cat}</span><span>·</span><span>${n.date}</span></span>
    <h3>${n.title}</h3><p>${n.sum}</p>
    <span class="news-more">${t('read')} ${I.arrow}</span>
  </span></a>`;}


export function newsFeat(n){return `<a class="news-feat" href="#/news/${n.slug}">
  <span class="ph">${SC[n.img]}</span>
  <span class="fbody">
    <span class="news-meta"><span class="cat">${n.cat}</span><span>·</span><span>${n.date}</span></span>
    <h3>${n.title}</h3><p>${n.sum}</p>
    <span class="news-more">${t('read_update')} ${I.arrow}</span>
  </span></a>`;}


export function ctaBand(){return `
<section class="ctaband">
  <div class="wrap inner">
    <div><h2>${t('cta_h')}</h2><p>${t('cta_p')}</p></div>
    <div class="cta-row" style="margin:0">
      <a class="btn btn-rose" href="#/register">${t('join')} ${I.arrow}</a>
      <a class="btn btn-ghost" href="#/help">${t('cta_ask')}</a>
    </div>
  </div>
</section>`;}

/* ============================================================
   App shell — the logged-in client-app demo under #/app/*.
   A compact top bar (back · title · urgent) plus a four-tab bottom
   bar, matching the mobile layout described for the real app.
   ============================================================ */
export const APP_TABS = [
  { key:'today',   href:'#/app/today',   icon:I.home,  en:'Today',   kh:'ថ្ងៃនេះ' },
  { key:'library', href:'#/app/library', icon:I.guide, en:'Library', kh:'បណ្ណាល័យ' },
  { key:'ask',     href:'#/app/ask',     icon:I.ask,   en:'Ask',     kh:'សួរ' },
  { key:'me',      href:'#/app/me',      icon:I.user,  en:'Me',      kh:'ខ្ញុំ' }
];

export function appShell({active, title, back, inner}){
  return `<div class="appscreen">
    <div class="appbar">
      ${back ? `<a class="appback" href="${back}" aria-label="${LANG?'ត្រឡប់ក្រោយ':'Back'}">${I.back}</a>`
             : `<span class="appback" style="visibility:hidden">${I.back}</span>`}
      <span class="apptitle${LANG?' km':''}">${title}</span>
      <a class="appurgent" href="#/app/urgent" aria-label="${LANG?'ការណែនាំបន្ទាន់':'Urgent guidance'}">${I.shield}</a>
    </div>
    <div class="appbody">${inner}</div>
  </div>
  <nav class="apptabs" aria-label="App sections">
    ${APP_TABS.map(tb=>`<a href="${tb.href}" class="${active===tb.key?'on':''}">${tb.icon}<span>${LANG?tb.kh:tb.en}</span></a>`).join('')}
  </nav>`;
}

/* "Step 2 of 4" progress used on the enrolment wizard. */
export function stepProgress(step, total, label){
  return `<div class="eprog">
    <div class="eprog-bar"><span style="width:${Math.round(step/total*100)}%"></span></div>
    <p class="small">${LANG?`ជំហានទី ${step} នៃ ${total} — `:`Step ${step} of ${total} — `}${label}</p>
  </div>`;
}

/* A library item as a row with a big, tappable play affordance. */
export function contentRow(item){
  return `<a class="ccard" href="#/app/library/${item.topic}/${item.slug}">
    <span class="playdot">${I.play}</span>
    <span class="cbody">
      <b${LANG?' class="km"':''}>${item.title}</b>
      <span class="small">${item.summary}</span>
      <span class="cmeta">${item.minutes} min · ${LANG?'ត្រួតពិនិត្យចុងក្រោយ':'last reviewed'} ${item.reviewed}</span>
    </span>
    ${I.arrow}</a>`;
}

/* Plain-language labels for the referral pipeline (BRD-01 §7.6). */
export const STATUS_LABEL = {
  suggested:['Suggested','បានស្នើឡើង'],
  accepted:['You said you would go','អ្នកបានយល់ព្រមទៅ'],
  contacted:['Facility was told you are coming','មណ្ឌលបានទទួលដំណឹង'],
  attended:['You were seen','អ្នកបានទៅពិនិត្យ'],
  closed:['Closed','បានបិទ'],
  unable:['Could not confirm','មិនអាចបញ្ជាក់បាន']
};
export function statusPill(status){
  const tone = {suggested:'',accepted:'brand',contacted:'brand',attended:'ok',closed:'ok',unable:'warn'}[status]||'';
  return `<span class="pill${tone?' pill-'+tone:''}">${LANG?STATUS_LABEL[status][1]:STATUS_LABEL[status][0]}</span>`;
}
export function referralStepper(status){
  const idx = REFERRAL_STATUS_STEPS.indexOf(status);
  return `<div class="rstepper">${REFERRAL_STATUS_STEPS.map((s,i)=>
    `<div class="rstep${i<=idx?' done':''}"><span class="dot"></span><span class="lb">${LANG?STATUS_LABEL[s][1]:STATUS_LABEL[s][0]}</span></div>`
  ).join('')}</div>`;
}

/* ============================================================
   CMS shell — one internal tool for content, the helpdesk queue,
   facilities, staff access and analytics/M&E, under #/cms/*. A
   sidebar lists only the sections the current role can see, and a
   role switcher lets the demo be tried as each one.
   ============================================================ */
/* Every domain the build spec lists as needing an admin page (§11.2) is
   represented here as one flat, always-visible nav item — nothing is
   buried in a sub-menu — and CMS_ACCESS decides which ones a role sees. */
export const CMS_NAV = [
  { key:'dashboard',   href:'#/cms/dashboard',   icon:I.dash,    en:'Dashboard',        kh:'ផ្ទាំងគ្រប់គ្រង' },
  { key:'content',     href:'#/cms/content',     icon:I.guide,   en:'Content',          kh:'មាតិកា' },
  { key:'clients',     href:'#/cms/clients',     icon:I.table,   en:'Clients & data',   kh:'ទិន្នន័យអតិថិជន' },
  { key:'helpdesk',    href:'#/cms/helpdesk',    icon:I.desk,    en:'Helpdesk queue',   kh:'ជួរជំនួយ' },
  { key:'master',      href:'#/cms/master',      icon:I.ref,     en:'Master data',      kh:'ទិន្នន័យមេ' },
  { key:'users',       href:'#/cms/users',       icon:I.user,    en:'Users & access',   kh:'អ្នកប្រើប្រាស់ និងសិទ្ធិ' },
  { key:'integration', href:'#/cms/integration', icon:I.plug,    en:'Integration',      kh:'ការធ្វើសមាហរណកម្ម' },
  { key:'reports',     href:'#/cms/reports',     icon:I.chart,   en:'Reports & audit',  kh:'របាយការណ៍ និងសវនកម្ម' },
  { key:'config',      href:'#/cms/config',      icon:I.sliders, en:'Configuration',    kh:'ការកំណត់' }
];

export function cmsShell({role, active, title, inner}){
  const access = CMS_ACCESS[role] || [];
  const r = cmsRole(role);
  const badges = {
    content: allLibraryItems().filter(x=>x.status==='pending_review').length,
    helpdesk: HELPDESK_CASES.filter(c=>c.status==='open').length
  };
  return `<div class="cmsapp">
    <aside class="cms-sidebar">
      <div class="cms-org">
        <span class="cms-org-mark">${I.heart}</span>
        <div><b>Mami Care</b><span>${LANG?'ប្រព័ន្ធគ្រប់គ្រង · CMS':'Admin Portal · CMS'}</span></div>
      </div>
      <nav class="cms-nav">
        ${CMS_NAV.filter(n=>access.includes(n.key)).map(n=>{
          const badge = badges[n.key];
          return `<a href="${n.href}" class="${active===n.key?'on':''}">${n.icon}<span>${LANG?n.kh:n.en}</span>${badge?`<b class="cms-badge">${badge}</b>`:''}</a>`;
        }).join('')}
      </nav>
      <div class="cms-sidebar-foot">
        <div class="cms-profile">
          <span class="cms-avatar">${I.user}</span>
          <div><b>${r?(LANG?r.kh:r.name):role}</b><span>${LANG?'គណនីសាកល្បង':'Demo account'}</span></div>
        </div>
        <label class="cms-roleswitch"><span>${LANG?'ប្តូរតួនាទី':'Switch role'}</span>
          <select id="cmsRoleSelect">
            ${CMS_ROLES.map(x=>`<option value="${x.key}" ${x.key===role?'selected':''}>${LANG?x.kh:x.name}</option>`).join('')}
          </select>
        </label>
        <a class="cms-exit" href="#/">${I.back} ${LANG?'ចាកចេញពី CMS':'Exit the CMS'}</a>
      </div>
    </aside>
    <main class="cms-main">
      <div class="cms-topbar">
        <div><p class="eyebrow">Mami Care CMS</p><h1>${title}</h1></div>
        <span class="cms-live-pill">${LANG?'សម័យសាកល្បង':'Demo session'}</span>
      </div>
      <div class="cms-content">${inner}</div>
    </main>
  </div>`;
}

