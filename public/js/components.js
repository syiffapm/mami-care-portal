/* Small reusable render functions shared by multiple pages: cards, tiles,
   the journey timeline widget, news cards and the closing CTA band. */
import { I } from './icons.js';
import { LANG, t, KH_SVC, KH_AUD, KH_WK } from './i18n.js';
import {
  JOURNEY, SC, REFERRAL_STATUS_STEPS, CMS_ROLES, CMS_ACCESS, cmsRole,
  HELPDESK_CASES, allLibraryItems, EVIDENCE_CLASS, FACILITY_NAME, FACILITY_CODE
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
    <a class="btn btn-primary" style="margin-top:1.2rem" href="#/app/join">Join at this stage ${I.arrow}</a>
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
      <a class="btn btn-rose" href="#/app/join">${t('join')} ${I.arrow}</a>
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

/* A phone device frame around every #/app screen — on a real phone it
   collapses to plain full-bleed (see the max-width:640px rule), but on a
   desktop or tablet it reads unmistakably as "this is a phone app", not
   a responsive website. `tabs:false` is used for join/login/onboarding,
   before there is a "you" to show tabs for; the urgent-guidance shortcut
   stays reachable even then. */
export function appShell({active, title, back, inner, tabs=true}){
  return `<div class="phoneframe">
    <div class="phone-statusbar"><span>9:41</span><span class="phone-status-icons">••• LTE 🔋</span></div>
    <div class="phonescreen">
      <div class="appbar">
        ${back ? `<a class="appback" href="${back}" aria-label="${LANG?'ត្រឡប់ក្រោយ':'Back'}">${I.back}</a>`
               : `<span class="appback" style="visibility:hidden">${I.back}</span>`}
        <span class="apptitle${LANG?' km':''}">${title}</span>
        <a class="appurgent" href="#/app/urgent" aria-label="${LANG?'ការណែនាំបន្ទាន់':'Urgent guidance'}">${I.shield}</a>
      </div>
      <div class="appbody">${inner}</div>
      ${tabs ? `<nav class="apptabs" aria-label="App sections">
        ${APP_TABS.map(tb=>`<a href="${tb.href}" class="${active===tb.key?'on':''}">${tb.icon}<span>${LANG?tb.kh:tb.en}</span></a>`).join('')}
      </nav>` : `<div class="apptabs-spacer"></div>`}
    </div>
  </div>`;
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
/* Groups with `children` render as a non-clickable label followed by an
   always-visible indented sub-list in the sidebar — sub-pages are never
   shown as cards inside a page (Master Data, Reports & Audit). */
export const CMS_NAV = [
  { key:'dashboard',   href:'#/cms/dashboard',   icon:I.dash,  en:'Dashboard',      kh:'ផ្ទាំងគ្រប់គ្រង' },
  { key:'content',     href:'#/cms/content',     icon:I.guide, en:'Content',        kh:'មាតិកា' },
  { key:'clients',     href:'#/cms/clients',     icon:I.table, en:'Clients & data', kh:'ទិន្នន័យអតិថិជន' },
  { key:'helpdesk',    href:'#/cms/helpdesk',    icon:I.desk,  en:'Helpdesk queue', kh:'ជួរជំនួយ' },
  { key:'master', icon:I.ref, en:'Master data', kh:'ទិន្នន័យមេ', children:[
      { key:'master-facilities', href:'#/cms/master/facilities', en:'Facilities',        kh:'មណ្ឌលសុខភាព' },
      { key:'master-lists',      href:'#/cms/master/lists',      en:'Controlled lists',  kh:'បញ្ជីត្រួតពិនិត្យ' }
  ]},
  { key:'users',       href:'#/cms/users',       icon:I.user,    en:'Users & access', kh:'អ្នកប្រើប្រាស់ និងសិទ្ធិ' },
  { key:'integration', href:'#/cms/integration', icon:I.plug,    en:'Integration',    kh:'ការធ្វើសមាហរណកម្ម' },
  { key:'reports', icon:I.chart, en:'Reports & audit', kh:'របាយការណ៍ និងសវនកម្ម', children:[
      { key:'reports-coverage',  href:'#/cms/reports/coverage',  en:'Coverage & enrolment',   kh:'ការគ្របដណ្តប់ និងចុះឈ្មោះ' },
      { key:'reports-reach',     href:'#/cms/reports/reach',     en:'Reach & communication',  kh:'ការទាក់ទង' },
      { key:'reports-referrals', href:'#/cms/reports/referrals', en:'Referrals',              kh:'ការបញ្ជូនបន្ត' },
      { key:'reports-audit',     href:'#/cms/reports/audit',     en:'Audit log',              kh:'កំណត់ហេតុសវនកម្ម' }
  ]},
  { key:'orchestration', href:'#/cms/orchestration', icon:I.shield, en:'Orchestration & safety', kh:'ការគ្រប់គ្រង និងសុវត្ថិភាព' },
  { key:'config', href:'#/cms/config', icon:I.sliders, en:'Configuration', kh:'ការកំណត់' }
];
/* A group is on-access if the role can see its key (parent gates all children). */
export const CMS_NAV_FLAT = CMS_NAV.flatMap(n=>n.children ? n.children : [n]);

export function cmsShell({role, active, title, inner}){
  const access = CMS_ACCESS[role] || [];
  const r = cmsRole(role);
  const badges = {
    content: allLibraryItems().filter(x=>x.status==='pending_review').length,
    helpdesk: HELPDESK_CASES.filter(c=>c.status==='open').length
  };
  const navHTML = CMS_NAV.filter(n=>access.includes(n.key)).map(n=>{
    if(n.children){
      const groupOn = n.children.some(c=>c.key===active);
      return `<div class="cms-navgroup${groupOn?' on':''}">${n.icon}<span>${LANG?n.kh:n.en}</span></div>
        <div class="cms-subnav">${n.children.map(c=>
          `<a href="${c.href}" class="${active===c.key?'on':''}">${LANG?c.kh:c.en}</a>`).join('')}</div>`;
    }
    const badge = badges[n.key];
    return `<a href="${n.href}" class="${active===n.key?'on':''}">${n.icon}<span>${LANG?n.kh:n.en}</span>${badge?`<b class="cms-badge">${badge}</b>`:''}</a>`;
  }).join('');
  return `<div class="cmsapp">
    <aside class="cms-sidebar">
      <div class="cms-org">
        <span class="cms-org-mark">${I.heart}</span>
        <div><b>Mami Care</b><span>${LANG?'ប្រព័ន្ធគ្រប់គ្រង · CMS':'Admin Portal · CMS'}</span></div>
      </div>
      <nav class="cms-nav">${navHTML}</nav>
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

/* ============================================================
   Chart primitives — plain CSS/SVG, no charting library. Used by
   the Dashboard and the Reports & Audit pages.
   ============================================================ */
const CHART_COLORS = ['brand','accent','third','warn','ok','muted'];

/** A horizontal bar list, e.g. "enrolment by province". */
export function hbarChart(rows, {labelKey='label', valueKey='value', formatValue}={}){
  const max = Math.max(1, ...rows.map(r=>r[valueKey]));
  const fmt = formatValue || (v=>v.toLocaleString('en-US'));
  return `<div class="hbar-list">${rows.map(r=>`
    <div class="hbar-row">
      <span class="hbar-label">${r[labelKey]}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${Math.round(r[valueKey]/max*100)}%"></span></span>
      <span class="hbar-value">${fmt(r[valueKey])}</span>
    </div>`).join('')}</div>`;
}

/** A donut chart with a legend, e.g. "clients by stage". */
export function donutChart(segments, {labelKey='label', valueKey='value', size=150, thickness=20}={}){
  const total = segments.reduce((a,s)=>a+s[valueKey], 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const arcs = segments.map((s,i)=>{
    const frac = s[valueKey] / total;
    const dash = frac * c;
    const arc = `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${thickness}"
      style="stroke:var(--${CHART_COLORS[i%CHART_COLORS.length]})"
      stroke-dasharray="${dash.toFixed(1)} ${(c-dash).toFixed(1)}" stroke-dashoffset="${(-acc).toFixed(1)}"
      transform="rotate(-90 ${size/2} ${size/2})"/>`;
    acc += dash;
    return arc;
  }).join('');
  const legend = segments.map((s,i)=>`
    <li><span class="donut-swatch" style="background:var(--${CHART_COLORS[i%CHART_COLORS.length]})"></span>
      ${s[labelKey]} <b>${Math.round(s[valueKey]/total*100)}%</b></li>`).join('');
  return `<div class="donut-row">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${arcs}</svg>
    <ul class="donut-legend">${legend}</ul>
  </div>`;
}

/* Evidence-class badge (§6.7) — every analytics figure gets one. */
export function evidenceBadge(evidenceKey){
  const e = EVIDENCE_CLASS[evidenceKey]; if(!e) return '';
  return `<span class="evbadge ${e.tone}">${LANG?e.km:e.en}</span>`;
}

/* ============================================================
   Facility Portal shell (§6.2) — a midwife-facing operational
   surface. Deliberately not the citizen phone-frame: a shared clinic
   device tool, not a consumer app.
   ============================================================ */
export function facilityShell({title, back, inner}){
  return `<div class="facscreen">
    <div class="facbar">
      <div>
        ${back ? `<a href="${back}" style="font-size:.8rem">← ${LANG?'ត្រឡប់':'Back'}</a>` : `<span class="fname">${FACILITY_NAME}</span>`}
      </div>
      <div style="text-align:right">
        <div class="fname">${title}</div>
        <div class="fcode">${FACILITY_CODE}</div>
      </div>
    </div>
    <div class="facbody">${inner}</div>
  </div>`;
}

