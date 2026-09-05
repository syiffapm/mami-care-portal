/* Hash router, page chrome (nav/footer text, language toggle, mobile drawer)
   and the interactive bits used on the marketing pages and the #/app/*
   client-portal demo: enrolment wizard, ask-a-question, preferences,
   consent centre, referrals. */
import { I } from './icons.js';
import { LANG, t, toggleLang, setLang } from './i18n.js';
import { SERVICES, AUDIENCES, svc, aud, news, SUGGESTED_QUESTIONS, DEMO_PROFILE } from './data.js';
import { renderJourney } from './components.js';
import { ENROLL, enrollCode, gestationalWeeks } from './enroll-state.js';
import { startAskCase, markHelpful, markNotHelpful, deliverOperatorReply, continueCase } from './ask-state.js';
import {
  pageHome, pageServices, pageWho, pageJourney, detailPage,
  pageNews, pageArticle, pageFaq, pageAbout, pageHelp,
  pagePrivacy, pageMissing, pageFacilities
} from './pages.js';
import {
  pageAppToday, pageAppLibrary, pageAppTopic, pageAppContent, pageAppAsk, pageAppAskThread,
  pageAppUrgent, pageAppReferrals, pageAppReferralDetail, pageAppMe, pageAppCallback, pageAppCalling,
  pageAppPreferences, pageAppConsent, pageAppData, pageAppPhone, pageAppMissing, pageAppFacilities,
  pageAppJoin, pageAppLogin, pageAppOnboarding
} from './pages-app.js';
import { CMS, setCmsRole, setCmsLoggedIn, cmsSignOut } from './cms-state.js';
import {
  pageCmsCredentials, pageCmsDashboard, pageCmsContent, pageCmsContentNew, pageCmsContentDetail,
  pageCmsClients, pageCmsHelpdesk, pageCmsMasterFacilities, pageCmsMasterLists, pageCmsStaff,
  pageCmsIntegration, pageCmsReportsCoverage, pageCmsReportsReach, pageCmsReportsReferrals, pageCmsReportsAudit,
  pageCmsConfig,
  cmsSetContentStatus, cmsSetCaseStatus, cmsSetStaffRole, cmsToggleStaffStatus,
  cmsCreateContent, cmsInviteStaff, cmsAddListValue, cmsRemoveListValue
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
  else if(p[0]==='facilities'){html=pageFacilities();top='/facilities';}
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

/* Routes under #/app/* — the logged-in client-portal demo (BRD-01).
   join/login/onboarding live here too: the marketing site only ever
   previews the app, so entering it always goes through one of these. */
function routeApp(p){
  const sub = p[1];
  if(sub==='join') return pageAppJoin(p[2]);
  if(sub==='login') return pageAppLogin();
  if(sub==='onboarding') return pageAppOnboarding(p[2]);
  if(!sub || sub==='today') return pageAppToday();
  if(sub==='library' && p[2] && p[3]) return pageAppContent(p[2], p[3]);
  if(sub==='library' && p[2]) return pageAppTopic(p[2]);
  if(sub==='library') return pageAppLibrary();
  if(sub==='ask' && p[2]) return pageAppAskThread(p[2]);
  if(sub==='ask') return pageAppAsk();
  if(sub==='callback') return pageAppCallback();
  if(sub==='calling') return pageAppCalling();
  if(sub==='facilities') return pageAppFacilities();
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

/* Routes under #/cms/* — one internal tool for content, clients, the
   helpdesk queue, master data, users, integration, reports/audit and
   configuration; sections are shown or hidden by CMS.role rather than
   split into separate systems. Sign-in, then a role picker, both gate
   everything else (simulated — see cms-state.js). */
function routeCms(p){
  if(!CMS.loggedIn || p[1]==='login') return pageCmsCredentials();
  if(!CMS.role) setCmsRole('admin'); // signing in always lands on the full view
  const sub = p[1];
  if(!sub || sub==='dashboard') return pageCmsDashboard(CMS.role);
  if(sub==='content' && p[2]==='new') return pageCmsContentNew(CMS.role);
  if(sub==='content' && p[2]) return pageCmsContentDetail(CMS.role, p[2]);
  if(sub==='content') return pageCmsContent(CMS.role);
  if(sub==='clients') return pageCmsClients(CMS.role);
  if(sub==='helpdesk') return pageCmsHelpdesk(CMS.role);
  if(sub==='master' && p[2]==='lists') return pageCmsMasterLists(CMS.role);
  if(sub==='master') return pageCmsMasterFacilities(CMS.role);
  if(sub==='users') return pageCmsStaff(CMS.role);
  if(sub==='integration') return pageCmsIntegration(CMS.role);
  if(sub==='reports' && p[2]==='reach') return pageCmsReportsReach(CMS.role);
  if(sub==='reports' && p[2]==='referrals') return pageCmsReportsReferrals(CMS.role);
  if(sub==='reports' && p[2]==='audit') return pageCmsReportsAudit(CMS.role);
  if(sub==='reports') return pageCmsReportsCoverage(CMS.role);
  if(sub==='config') return pageCmsConfig(CMS.role);
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
  wireAskThread();
  wireCallbackForm();
  wireCallingScreen();
  wireFacilitySearch();
  wirePreferences();
  wireConsentCentre();
  wireDataPage();
  wirePhonePage();
  wireReferralActions();
  wireHelpfulLinks();
  wireCms();
}

/* ---------- enrolment wizard (#/app/join/1..5) ---------- */
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
    location.hash = '#/app/join/3';
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
      location.hash = '#/app/join/4';
    });
  }

  const stageInp = document.getElementById('stageDate');
  if(stageInp){ stageInp.addEventListener('input', updateStageCalc); updateStageCalc(); }
  const next4 = document.getElementById('regStep4Next');
  if(next4) next4.addEventListener('click', ()=>{
    if(stageInp) ENROLL.stageDate = stageInp.value;
    location.hash = '#/app/join/5';
  });
}

/* ---------- login demo → bridges into the #/app dashboard ---------- */
function wireLogin(){
  const lf=document.getElementById('loginForm');
  if(lf) lf.addEventListener('submit',e=>{e.preventDefault();lf.hidden=true;document.getElementById('loginOk').hidden=false;});
  const cont = document.getElementById('loginContinue');
  if(cont) cont.addEventListener('click', ()=>{ location.hash = '#/app/today'; });
}

/* ---------- ask a question (#/app/ask, #/app/ask/:id) ----------
   L1 (automated, approved-answer-only) → L2 (human) escalation. The
   actual matching/escalation logic lives in ask-state.js; this just
   wires the composer, the suggested-question chips, and the thread
   page's feedback buttons, then navigates to the case thread. */
function wireAskAPage(){
  const form = document.getElementById('askForm');
  if(form) form.addEventListener('submit', e=>{
    e.preventDefault();
    const val = document.getElementById('askText').value.trim();
    if(!val) return;
    const c = startAskCase(val);
    if(c) location.hash = '#/app/ask/'+c.id;
  });
  document.querySelectorAll('.askq').forEach(b=>{
    b.addEventListener('click', ()=>{
      const q = SUGGESTED_QUESTIONS[+b.dataset.q];
      const c = startAskCase(q[0]);
      if(c) location.hash = '#/app/ask/'+c.id;
    });
  });
}

let askOperatorTimer = null;
function wireAskThread(){
  const meta = document.getElementById('askThreadMeta');
  const waitingEl = document.getElementById('askWaiting');
  clearTimeout(askOperatorTimer);
  if((meta || waitingEl)){
    const id = meta ? meta.dataset.case : null;
    const stillWaiting = meta ? meta.dataset.awaiting==='true' : !!waitingEl;
    if(id && stillWaiting){
      askOperatorTimer = setTimeout(()=>{
        deliverOperatorReply(id);
        if(location.hash === '#/app/ask/'+id) route();
      }, 1600);
    }
  }
  document.querySelectorAll('[data-ask-action]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.case;
      if(b.dataset.askAction==='helpful') markHelpful(id);
      else markNotHelpful(id);
      route();
    });
  });

  const replyForm = document.getElementById('askReplyForm');
  if(replyForm) replyForm.addEventListener('submit', e=>{
    e.preventDefault();
    const input = document.getElementById('askReplyText');
    const val = input.value.trim();
    if(!val) return;
    continueCase(replyForm.dataset.case, val);
    route();
  });
}

/* ---------- talk to a person: request a call back (#/app/callback) ---------- */
function wireCallbackForm(){
  const f = document.getElementById('callbackForm');
  if(!f) return;
  f.addEventListener('submit', e=>{ e.preventDefault(); f.hidden=true; document.getElementById('callbackOk').hidden=false; });
}

/* ---------- simulated phone call (#/app/calling) ----------
   A tel: link does nothing visible in a desktop browser with no paired
   phone, so the call is played out on-screen instead: ringing, then
   connected with a running timer, until "end call" sends you back. */
let callTimers = [];
function clearCallTimers(){ callTimers.forEach(clearTimeout); callTimers.forEach(clearInterval); callTimers=[]; }
function wireCallingScreen(){
  clearCallTimers();
  const status = document.getElementById('callStatus');
  const timerEl = document.getElementById('callTimer');
  const endBtn = document.getElementById('endCallBtn');
  if(!status || !endBtn) return;
  callTimers.push(setTimeout(()=>{
    status.textContent = LANG?'បានភ្ជាប់':'Connected';
    timerEl.hidden = false;
    let secs = 0;
    timerEl.textContent = '00:00';
    callTimers.push(setInterval(()=>{
      secs++;
      const m = String(Math.floor(secs/60)).padStart(2,'0'), s = String(secs%60).padStart(2,'0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000));
  }, 1800));
  endBtn.addEventListener('click', ()=>{
    clearCallTimers();
    location.hash = '#/app/callback';
  });
}

/* ---------- public facility search (#/facilities, #/app/facilities) ---------- */
function wireFacilitySearch(){
  const provinceSel = document.getElementById('facProvince');
  const results = document.getElementById('facResults');
  if(!results) return;
  const applyFilter = ()=>{
    const province = provinceSel ? provinceSel.value : '';
    const typeBtn = document.querySelector('.segs[data-group="fac-type"] .seg[aria-pressed="true"]');
    const type = typeBtn ? typeBtn.dataset.v : '';
    let shown = 0;
    results.querySelectorAll('.fac-card').forEach(card=>{
      const match = (!province || card.dataset.province===province) && (!type || card.dataset.type===type);
      card.hidden = !match;
      if(match) shown++;
    });
    const empty = document.getElementById('facEmpty');
    if(empty) empty.hidden = shown>0;
  };
  if(provinceSel) provinceSel.addEventListener('change', applyFilter);
  document.querySelectorAll('.segs[data-group="fac-type"] .seg').forEach(b=>{
    b.addEventListener('click', ()=>setTimeout(applyFilter, 0)); // after the generic .seg handler sets aria-pressed
  });
}

/* ---------- preferences, consent centre, my data, phone change ---------- */
function wirePreferences(){
  const pf = document.getElementById('prefForm');
  if(!pf) return;
  pf.addEventListener('submit', e=>{
    e.preventDefault();
    const pressedLabel = grp => { const b=pf.querySelector(`.segs[data-group="${grp}"] .seg[aria-pressed="true"]`); return b?b.textContent:''; };
    const pressedLabels = grp => [...pf.querySelectorAll(`.segs[data-group="${grp}"] .seg[aria-pressed="true"]`)].map(b=>b.textContent);
    const pressedValues = grp => [...pf.querySelectorAll(`.segs[data-group="${grp}"] .seg[aria-pressed="true"]`)].map(b=>b.dataset.v);

    /* Actually persist the change — Today/Me/My data all read DEMO_PROFILE,
       so a saved preference is visible everywhere immediately, not just
       on this form. */
    const chanValues = pressedValues('pref-channel');
    if(chanValues.length) DEMO_PROFILE.channel = chanValues;
    const timeValues = pressedValues('pref-time');
    if(timeValues[0]) DEMO_PROFILE.timeWindow = timeValues[0];
    const freqValues = pressedValues('pref-freq');
    if(freqValues[0]) DEMO_PROFILE.frequency = freqValues[0];
    DEMO_PROFILE.safeContact = document.getElementById('safeContact').checked;
    const newLang = pressedValues('pref-lang')[0];
    const langChanged = newLang && (newLang==='km' ? 1 : 0) !== LANG;
    if(newLang) DEMO_PROFILE.language = newLang;

    const chanLabel = pressedLabels('pref-channel').join(' + ') || 'SMS', timeLabel = pressedLabel('pref-time');
    if(langChanged){
      /* Language is a site-wide setting, not just an app preference —
         changing it here actually re-renders everything in the new
         language, same as the header toggle. */
      setLang(newLang==='km' ? 1 : 0);
      route();
      return;
    }
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
  const loginForm = document.getElementById('cmsLoginForm');
  if(loginForm) loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    setCmsLoggedIn(true);
    setCmsRole('admin'); // straight into the full view; switch role anytime from the sidebar
    location.hash = '#/cms/dashboard';
  });

  const exitBtn = document.querySelector('.cms-exit');
  if(exitBtn) exitBtn.addEventListener('click', ()=>{ cmsSignOut(); });

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

  /* Unmasking always asks why first, and every reveal is logged —
     the point isn't the reveal, it's that it can never be silent. */
  document.querySelectorAll('[data-unmask]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const reason = prompt(LANG?'ហេតុអ្វីបានជាអ្នកត្រូវការមើលទំនាក់ទំនងនេះ?':'Why do you need to see this contact detail?');
      if(!reason) return;
      const cell = b.closest('.pii-cell');
      cell.innerHTML = `<b>${cell.dataset.real}</b>`;
      const log = document.getElementById('unmaskLog');
      if(log) log.insertAdjacentHTML('afterbegin',
        `<p class="small">${new Date().toLocaleTimeString()} — ${LANG?'បង្ហាញដោយ':'unmasked by'} ${(cmsRoleName())} — ${LANG?'ហេតុផល':'reason'}: “${reason}”</p>`);
    });
  });

  const configForm = document.getElementById('configForm');
  if(configForm) configForm.addEventListener('submit', e=>{
    e.preventDefault();
    document.getElementById('configOk').hidden = false;
  });

  /* ---- create: new content item ---- */
  const contentNewForm = document.getElementById('cmsContentNewForm');
  if(contentNewForm) contentNewForm.addEventListener('submit', e=>{
    e.preventDefault();
    const item = cmsCreateContent({
      title: document.getElementById('ccnTitle').value.trim(),
      topic: document.getElementById('ccnTopic').value,
      minutes: document.getElementById('ccnMinutes').value,
      summary: document.getElementById('ccnSummary').value.trim(),
      body: document.getElementById('ccnBody').value
    });
    location.hash = '#/cms/content/'+item.slug;
  });

  /* ---- create: invite a user ---- */
  const inviteToggle = document.getElementById('cmsInviteToggle');
  const inviteForm = document.getElementById('cmsInviteForm');
  if(inviteToggle && inviteForm) inviteToggle.addEventListener('click', ()=>{ inviteForm.hidden = !inviteForm.hidden; });
  if(inviteForm) inviteForm.addEventListener('submit', e=>{
    e.preventDefault();
    cmsInviteStaff({
      name: document.getElementById('ciName').value.trim(),
      org: document.getElementById('ciOrg').value.trim(),
      role: document.getElementById('ciRole').value
    });
    route();
  });

  /* ---- controlled lists: add / remove a value ---- */
  document.querySelectorAll('.cms-list-add').forEach(f=>{
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const input = f.querySelector('input');
      cmsAddListValue(+f.dataset.list, input.value.trim());
      route();
    });
  });
  document.querySelectorAll('[data-list-remove]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const [li, vi] = b.dataset.listRemove.split(':').map(Number);
      cmsRemoveListValue(li, vi);
      route();
    });
  });
}

function cmsRoleName(){
  const r = CMS.role;
  return r ? r.charAt(0).toUpperCase()+r.slice(1) : 'you';
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
         <a class="btn btn-ghost" href="#/app/login">${t('login')}</a>
         <a class="btn btn-primary" href="#/app/join">${t('join')}</a>
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
