/* Hash router, page chrome (nav/footer text, language toggle, mobile drawer)
   and the interactive bits used on the marketing pages and the #/app/*
   client-portal demo: enrolment wizard, ask-a-question, preferences,
   consent centre, referrals. */
import { I } from './icons.js';
import { LANG, t, toggleLang } from './i18n.js';
import { SERVICES, AUDIENCES, svc, aud, news, SUGGESTED_QUESTIONS, URGENT_KEYWORDS } from './data.js';
import { renderJourney } from './components.js';
import { ENROLL, enrollCode, gestationalWeeks } from './enroll-state.js';
import {
  pageHome, pageServices, pageWho, pageJourney, detailPage, pageRegister,
  pageLogin, pageNews, pageArticle, pageFaq, pageAbout, pageHelp,
  pagePrivacy, pageMissing
} from './pages.js';
import {
  pageAppToday, pageAppLibrary, pageAppTopic, pageAppContent, pageAppAsk,
  pageAppUrgent, pageAppReferrals, pageAppReferralDetail, pageAppMe,
  pageAppPreferences, pageAppConsent, pageAppData, pageAppPhone, pageAppMissing
} from './pages-app.js';
import { CMS, setCmsRole } from './cms-state.js';
import {
  pageCmsLogin, pageCmsDashboard, pageCmsContent, pageCmsContentDetail,
  pageCmsHelpdesk, pageCmsFacilities, pageCmsStaff,
  cmsSetContentStatus, cmsSetCaseStatus, cmsSetStaffRole, cmsToggleStaffStatus
} from './pages-cms.js';

/* ============ router ============ */
export function route(){
  const h=(location.hash||'#/').replace(/^#/,'');
  const p=h.split('/').filter(Boolean);
  const app=document.getElementById('app');
  let html, top='/';
  const isApp = p[0]==='app';
  const isCms = p[0]==='cms';
  if(p.length===0){html=pageHome();top='/';}
  else if(p[0]==='services'&&p[1]){const s=svc(p[1]);html=s?detailPage(s,'service'):pageMissing();top='/services';}
  else if(p[0]==='services'){html=pageServices();top='/services';}
  else if(p[0]==='who'&&p[1]){const a=aud(p[1]);html=a?detailPage(a,'audience'):pageMissing();top='/who';}
  else if(p[0]==='who'){html=pageWho();top='/who';}
  else if(p[0]==='journey'){html=pageJourney();top='/journey';}
  else if(p[0]==='help'){html=pageHelp();top='/help';}
  else if(p[0]==='faq'){html=pageFaq();top='/help';}
  else if(p[0]==='about'){html=pageAbout();top='/about';}
  else if(p[0]==='news'&&p[1]){const n=news(p[1]);html=n?pageArticle(n):pageMissing();top='/news';}
  else if(p[0]==='news'){html=pageNews();top='/news';}
  else if(p[0]==='privacy'){html=pagePrivacy();top='/help';}
  else if(p[0]==='register'){html=pageRegister(p[1]);}
  else if(p[0]==='login'){html=pageLogin();}
  else if(isApp){html=routeApp(p);}
  else if(isCms){html=routeCms(p);}
  else {html=pageMissing();}
  app.innerHTML=html;
  document.body.classList.toggle('app-mode', isApp);
  document.body.classList.toggle('cms-mode', isCms);
  paintChrome(top);
  closeDrawer();
  if(document.getElementById('jpanel')) renderJourney(2);
  wireForms();
  window.scrollTo({top:0,behavior:'instant'});
}

/* Routes under #/app/* — the logged-in client-portal demo (BRD-01). */
function routeApp(p){
  const sub = p[1];
  if(!sub || sub==='today') return pageAppToday();
  if(sub==='library' && p[2] && p[3]) return pageAppContent(p[2], p[3]);
  if(sub==='library' && p[2]) return pageAppTopic(p[2]);
  if(sub==='library') return pageAppLibrary();
  if(sub==='ask') return pageAppAsk();
  if(sub==='urgent') return pageAppUrgent();
  if(sub==='referrals' && p[2]) return pageAppReferralDetail(p[2]);
  if(sub==='referrals') return pageAppReferrals();
  if(sub==='me' && p[2]==='preferences') return pageAppPreferences();
  if(sub==='me' && p[2]==='consent') return pageAppConsent();
  if(sub==='me' && p[2]==='data') return pageAppData();
  if(sub==='me' && p[2]==='phone') return pageAppPhone();
  if(sub==='me') return pageAppMe();
  return pageAppMissing();
}

/* Routes under #/cms/* — one internal tool for content, the helpdesk
   queue, facilities, staff access and analytics/M&E; sections are shown
   or hidden by CMS.role rather than split into separate systems. */
function routeCms(p){
  if(!CMS.role || p[1]==='login') return pageCmsLogin();
  const sub = p[1];
  if(!sub || sub==='dashboard') return pageCmsDashboard(CMS.role);
  if(sub==='content' && p[2]) return pageCmsContentDetail(CMS.role, p[2]);
  if(sub==='content') return pageCmsContent(CMS.role);
  if(sub==='helpdesk') return pageCmsHelpdesk(CMS.role);
  if(sub==='facilities') return pageCmsFacilities(CMS.role);
  if(sub==='staff') return pageCmsStaff(CMS.role);
  return pageCmsDashboard(CMS.role);
}

function wireForms(){
  /* Generic segmented-control behaviour: single-select by default,
     multi-select when the group carries data-multi="1". A few groups
     also write straight into the shared ENROLL draft so later wizard
     steps (and the confirmation screen) see the latest choice. */
  document.querySelectorAll('.segs').forEach(g=>{
    g.addEventListener('click',e=>{
      const b=e.target.closest('.seg'); if(!b) return;
      const multi = g.dataset.multi==='1';
      if(multi){
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed')!=='true'));
      } else {
        g.querySelectorAll('.seg').forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
      }
      switch(g.dataset.group){
        case 'reg-lang': ENROLL.language = b.dataset.v; break;
        case 'reg-time': ENROLL.timeWindow = b.dataset.v; break;
        case 'reg-chan':
          ENROLL.channel = [...g.querySelectorAll('.seg[aria-pressed="true"]')].map(x=>x.dataset.v);
          break;
        case 'reg-stagemode': {
          ENROLL.stageMode = b.dataset.v;
          const wrap = document.getElementById('stageDateWrap');
          const note = document.getElementById('stageUnknownNote');
          if(wrap) wrap.style.display = b.dataset.v==='unknown' ? 'none' : '';
          if(note) note.style.display = b.dataset.v==='unknown' ? '' : 'none';
          updateStageCalc();
          break;
        }
        case 'pref-channel': case 'pref-time': case 'pref-lang': case 'pref-freq':
          /* visual only in this demo — read back on submit */
          break;
      }
    });
  });

  wireEnrolWizard();
  wireLogin();
  wireAskAPage();
  wirePreferences();
  wireConsentCentre();
  wireDataPage();
  wirePhonePage();
  wireReferralActions();
  wireHelpfulLinks();
  wireCms();
}

/* ---------- enrolment wizard (#/register/1..5) ---------- */
function updateStageCalc(){
  const inp = document.getElementById('stageDate');
  const out = document.getElementById('stageCalc');
  if(!inp || !out) return;
  ENROLL.stageDate = inp.value;
  if(ENROLL.stageMode==='dob'){
    out.textContent = inp.value ? (LANG?'អរគុណ — ការណែនាំនឹងផ្គូផ្គងតាមអាយុកូនរបស់អ្នក។':'Thanks — guidance will now match your child’s age.') : '';
    return;
  }
  if(ENROLL.stageMode==='unknown'){ out.textContent=''; return; }
  const w = gestationalWeeks(ENROLL.stageMode, inp.value);
  out.textContent = w!=null
    ? (LANG?`អ្នកមានផ្ទៃពោះប្រហែល ${w} សប្តាហ៍។ តើត្រឹមត្រូវទេ?`:`You are about ${w} weeks pregnant. Is that right?`)
    : '';
}

function wireEnrolWizard(){
  const f2 = document.getElementById('regForm2');
  if(f2) f2.addEventListener('submit', e=>{
    e.preventDefault();
    ENROLL.phone = document.getElementById('rph').value.trim();
    location.hash = '#/register/3';
  });

  const next3 = document.getElementById('regStep3Next');
  if(next3){
    document.querySelectorAll('[data-consent]').forEach(chk=>{
      chk.addEventListener('change', ()=>{ ENROLL.consents[chk.dataset.consent] = chk.checked; });
    });
    next3.addEventListener('click', ()=>{
      const engaged = document.querySelector('[data-consent="engagement"]');
      if(engaged) ENROLL.consents.engagement = engaged.checked;
      const err = document.getElementById('consentError');
      if(!ENROLL.consents.engagement){ if(err) err.hidden = false; return; }
      if(err) err.hidden = true;
      location.hash = '#/register/4';
    });
  }

  const stageInp = document.getElementById('stageDate');
  if(stageInp){ stageInp.addEventListener('input', updateStageCalc); updateStageCalc(); }
  const next4 = document.getElementById('regStep4Next');
  if(next4) next4.addEventListener('click', ()=>{
    if(stageInp) ENROLL.stageDate = stageInp.value;
    location.hash = '#/register/5';
  });
}

/* ---------- login demo → bridges into the #/app dashboard ---------- */
function wireLogin(){
  const lf=document.getElementById('loginForm');
  if(lf) lf.addEventListener('submit',e=>{e.preventDefault();lf.hidden=true;document.getElementById('loginOk').hidden=false;});
  const cont = document.getElementById('loginContinue');
  if(cont) cont.addEventListener('click', ()=>{ location.hash = '#/app/today'; });
}

/* ---------- ask a question (#/app/ask) ---------- */
function askAnswerHTML(question){
  const text = (question||'').toLowerCase();
  if(URGENT_KEYWORDS.some(k=>text.includes(k.toLowerCase()))){
    return `<div class="callout" style="border-left-color:var(--urgent)">
      <p><strong>${LANG?'នេះស្តាប់ទៅដូចជាបន្ទាន់':'This sounds urgent'}</strong>${LANG?'។ ':'. '}${LANG?'សូមទៅមណ្ឌលសុខភាពជិតបំផុតឥឡូវនេះ។ បុគ្គលិកជំនួយក៏ត្រូវបានជូនដំណឹងផងដែរ។':'Please go to your nearest health centre now. A helpdesk person has also been alerted.'}</p>
      <a class="btn btn-primary" style="margin-top:.7rem" href="#/app/urgent">${LANG?'មើលការណែនាំបន្ទាន់':'See urgent guidance'} ${I.arrow}</a></div>`;
  }
  const match = SUGGESTED_QUESTIONS.find(fq=>text && fq[0].toLowerCase().includes(text.slice(0,24).split(' ')[0]));
  const exact = SUGGESTED_QUESTIONS.find(fq=>fq[0].toLowerCase()===text);
  const found = exact || (text.length>6 ? match : null);
  if(found){
    return `<div class="callout"><p class="eyebrow" style="display:block;margin-bottom:.5rem">${LANG?'ចម្លើយស្វ័យប្រវត្តិ ពីព័ត៌មានសុខភាពដែលបានអនុម័ត':'Automatic answer from approved health information'}</p>
      <p>${found[1]}</p></div>
      <p class="small" style="margin-top:.7rem">${LANG?'តើចម្លើយនេះមានប្រយោជន៍ទេ?':'Was this helpful?'}
        <a href="#" style="color:var(--brand);font-weight:600">${LANG?'បាទ/ចាស':'Yes'}</a> ·
        <a href="#" style="color:var(--brand);font-weight:600">${LANG?'ទេ, ភ្ជាប់ទៅមនុស្ស':'No, connect me to a person'}</a></p>`;
  }
  const ref = 'CASE-'+Math.floor(1000+Math.random()*9000);
  return `<div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
    <div><h3>${LANG?'ភ្ជាប់ទៅបុគ្គលិកជំនួយ':'Connected to the helpdesk'}</h3>
    <p>${LANG?'យើងមិនទាន់មានចម្លើយដែលបានអនុម័តសម្រាប់សំណួរនេះទេ។ បុគ្គលិកនិយាយភាសាខ្មែរនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។ លេខយោង៖'
       :'We don’t have an approved answer for that yet. A Khmer-speaking person will reply within 24 hours. Reference:'} <b>${ref}</b></p></div></div>`;
}
function wireAskAPage(){
  const form = document.getElementById('askForm');
  if(!form) return;
  const box = document.getElementById('askAnswer');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const val = document.getElementById('askText').value.trim();
    if(!val) return;
    box.innerHTML = askAnswerHTML(val);
  });
  document.querySelectorAll('.askq').forEach(b=>{
    b.addEventListener('click', ()=>{
      const q = SUGGESTED_QUESTIONS[+b.dataset.q];
      document.getElementById('askText').value = q[0];
      box.innerHTML = askAnswerHTML(q[0]);
    });
  });
}

/* ---------- preferences, consent centre, my data, phone change ---------- */
function wirePreferences(){
  const pf = document.getElementById('prefForm');
  if(!pf) return;
  pf.addEventListener('submit', e=>{
    e.preventDefault();
    const pressed = grp => { const b=pf.querySelector(`.segs[data-group="${grp}"] .seg[aria-pressed="true"]`); return b?b.textContent:''; };
    const chanLabel = pressed('pref-channel'), timeLabel = pressed('pref-time');
    const txt = document.getElementById('prefOkText');
    if(txt) txt.textContent = LANG
      ? `អ្នកនឹងទទួលបានសារតាម ${chanLabel} ក្នុងអំឡុងពេល ${timeLabel}។`
      : `You will now receive messages by ${chanLabel}, in the ${timeLabel.toLowerCase()}.`;
    document.getElementById('prefOk').hidden = false;
  });
}
function wireConsentCentre(){
  const btn = document.getElementById('consentSave');
  if(!btn) return;
  btn.addEventListener('click', ()=>{ document.getElementById('consentOk').hidden = false; });
}
function wireDataPage(){
  const req = document.getElementById('dataRequest'), del = document.getElementById('dataDelete');
  const out = document.getElementById('dataOk');
  if(!out) return;
  const ref = () => 'REQ-'+Math.floor(1000+Math.random()*9000);
  if(req) req.addEventListener('click', ()=>{
    out.hidden = false;
    out.innerHTML = `<div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
      <div><h3>${LANG?'សំណើត្រូវបានទទួល':'Request received'}</h3>
      <p>${LANG?'យើងនឹងផ្ញើទិន្នន័យរបស់អ្នកមកកាន់លេខទូរស័ព្ទដែលបានចុះឈ្មោះ។ លេខយោង៖':'We will send your data to your registered number. Reference:'} <b>${ref()}</b></p></div></div>`;
  });
  if(del) del.addEventListener('click', ()=>{
    out.hidden = false;
    out.innerHTML = `<div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
      <div><h3>${LANG?'សំណើលុបត្រូវបានទទួល':'Deletion requested'}</h3>
      <p>${LANG?'បុគ្គលិកជំនួយនឹងបញ្ជាក់ជាមួយអ្នកមុននឹងលុប។ លេខយោង៖':'The helpdesk will confirm with you before anything is removed. Reference:'} <b>${ref()}</b></p></div></div>`;
  });
}
function wirePhonePage(){
  const pf = document.getElementById('phoneForm');
  if(!pf) return;
  pf.addEventListener('submit', e=>{ e.preventDefault(); pf.hidden=true; document.getElementById('phoneOk').hidden=false; });
  const confirm = document.getElementById('phoneConfirm');
  if(confirm) confirm.addEventListener('click', ()=>{
    document.getElementById('phoneOk').hidden = true;
    document.getElementById('phoneDone').hidden = false;
  });
}

/* ---------- referral actions (#/app/referrals/:id) ---------- */
function wireReferralActions(){
  const area = document.getElementById('refActionArea');
  if(!area) return;
  area.addEventListener('click', e=>{
    const b = e.target.closest('[data-ref-action]'); if(!b) return;
    const action = b.dataset.refAction;
    const msg = {
      going:  LANG?'អរគុណ — កត់ត្រាថាអ្នកនឹងទៅ។':'Thanks — noted that you’re going.',
      help:   LANG?'យើងបានជូនដំណឹងទៅបុគ្គលិកជំនួយ ដើម្បីទាក់ទងអ្នកអំពីការធ្វើដំណើរ។':'A helpdesk person has been asked to help you get there.',
      went:   LANG?'អរគុណ — កត់ត្រាថាអ្នកបានទៅរួច។':'Thanks — marked as attended.'
    }[action] || '';
    area.innerHTML = `<div class="okpanel"><span style="color:var(--ok)">${I.check}</span><div><p>${msg}</p></div></div>`;
  });
}

/* ---------- "was this helpful" links on a library article ---------- */
function wireHelpfulLinks(){
  document.querySelectorAll('.helpful').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const wrap = a.closest('.callout');
      if(wrap) wrap.innerHTML = `<p>${LANG?'អរគុណសម្រាប់មតិកែលម្អរបស់អ្នក។':'Thanks for the feedback.'}</p>`;
    });
  });
}

/* ---------- CMS: role picker, role switcher, content workflow,
   helpdesk queue actions, staff role/status changes ---------- */
function wireCms(){
  const roleCards = document.getElementById('cmsRoleCards');
  if(roleCards) roleCards.addEventListener('click', e=>{
    const b = e.target.closest('[data-role]'); if(!b) return;
    setCmsRole(b.dataset.role);
    location.hash = '#/cms/dashboard';
  });

  const roleSelect = document.getElementById('cmsRoleSelect');
  if(roleSelect) roleSelect.addEventListener('change', ()=>{
    setCmsRole(roleSelect.value);
    route();
  });

  const actionArea = document.getElementById('cmsActionArea');
  if(actionArea) actionArea.addEventListener('click', e=>{
    const b = e.target.closest('[data-cms-action]'); if(!b) return;
    const slug = b.dataset.slug;
    const next = { submit:'pending_review', approve:'published', reject:'draft', withdraw:'withdrawn', republish:'published' }[b.dataset.cmsAction];
    if(next){ cmsSetContentStatus(slug, next); route(); }
  });

  document.querySelectorAll('[data-case-action]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const next = b.dataset.caseAction==='answer' ? 'answered' : 'closed';
      cmsSetCaseStatus(b.dataset.case, next);
      route();
    });
  });

  document.querySelectorAll('[data-staff-role]').forEach(sel=>{
    sel.addEventListener('change', ()=>{ cmsSetStaffRole(+sel.dataset.staffRole, sel.value); route(); });
  });
  document.querySelectorAll('[data-staff-toggle]').forEach(b=>{
    b.addEventListener('click', ()=>{ cmsToggleStaffStatus(+b.dataset.staffToggle); route(); });
  });
}

document.addEventListener('click',e=>{
  const b=e.target.closest('.jstep'); if(b) renderJourney(+b.dataset.j);
});
window.addEventListener('hashchange',route);

/* ---------- navigation, drawer, language ---------- */
const NAVL=[['#/','/','nav_home'],['#/services','/services','nav_services'],['#/who','/who','nav_who'],
  ['#/journey','/journey','nav_journey'],['#/news','/news','nav_news'],['#/faq','/help','nav_faq'],['#/about','/about','nav_about']];


function paintChrome(top){
  document.body.classList.toggle('kh', !!LANG);
  document.documentElement.lang = LANG ? 'km' : 'en';
  document.getElementById('nav').innerHTML =
    NAVL.map(l=>`<a href="${l[0]}" data-r="${l[1]}"${l[1]===top?' aria-current="page"':''}>${t(l[2])}</a>`).join('');
  document.getElementById('mobnav').innerHTML =
    NAVL.map(l=>`<a class="ml" href="${l[0]}" data-r="${l[1]}"${l[1]===top?' aria-current="page"':''}>${t(l[2])} ${I.sep}</a>`).join('')
    + `<div class="macts">
         <a class="btn btn-ghost" href="#/login">${t('login')}</a>
         <a class="btn btn-primary" href="#/register">${t('join')}</a>
         <button class="langbtn" type="button" data-lang style="justify-content:center;min-height:46px">${LANG?'English':'ភាសាខ្មែរ'}</button>
       </div>`;
  document.getElementById('hdrLogin').textContent = t('login');
  document.getElementById('hdrJoin').textContent = t('join');
  document.getElementById('langLabel').textContent = LANG ? 'English' : 'ភាសាខ្មែរ';
  document.getElementById('langBtn').setAttribute('aria-label', LANG ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ');
  document.getElementById('burger').setAttribute('aria-label', t('menu'));
  document.getElementById('fhServices').textContent = t('foot_services');
  document.getElementById('fhWho').textContent = t('foot_who');
  document.getElementById('fhSupport').textContent = t('foot_support');
  document.getElementById('footTag').textContent = t('foot_tag');
  document.getElementById('footServices').innerHTML =
    SERVICES.map(x=>`<li><a href="#/services/${x.slug}">${LANG?x.kh:x.name}</a></li>`).join('');
  document.getElementById('footWho').innerHTML =
    AUDIENCES.map(x=>`<li><a href="#/who/${x.slug}">${LANG?x.kh:x.name}</a></li>`).join('');
}


function closeDrawer(){
  const d=document.getElementById('mobnav'), b=document.getElementById('burger');
  d.hidden=true; b.setAttribute('aria-expanded','false');
}
document.getElementById('burger').addEventListener('click',()=>{
  const d=document.getElementById('mobnav'), b=document.getElementById('burger');
  const open=d.hidden;
  d.hidden=!open; b.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click',e=>{
  if(e.target.closest('#mobnav a')) closeDrawer();
  const lb=e.target.closest('#langBtn,[data-lang]');
  if(lb){ toggleLang(); closeDrawer(); route(); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeDrawer(); });

/* footer links */
route();
