/* Page renderers for the logged-in client-app demo under #/app/*.
   This is the "Mom App" from BRD-01: a preview of what a mother sees once
   she has joined — her stage, the library, ask-a-question, referrals and
   her own preference/consent/data controls. One sample profile stands in
   for "you"; nothing here is a real account. */
import { I } from './icons.js';
import { LANG, t, khNote } from './i18n.js';
import {
  DEMO_PROFILE, LIBRARY_TOPICS, LIBRARY_ITEMS, libraryTopic, libraryItem, itemsInTopic,
  SUGGESTED_QUESTIONS, URGENT_SIGNS, REFERRALS, referral, CONSENT_TYPES
} from './data.js';
import { appShell, contentRow, statusPill, referralStepper } from './components.js';

/* Small 404 that stays inside the app shell rather than dropping back to
   the marketing "page not found" screen. */
export function pageAppMissing(){
  const inner = `<div style="text-align:center;padding-block:2rem">
    <h1 style="font-size:1.4rem">${LANG?'រកមិនឃើញទំព័រនេះទេ':'We could not find that'}</h1>
    <p class="small" style="margin-top:.5rem">${LANG?'សូមត្រឡប់ទៅទំព័រថ្ងៃនេះ។':'Try going back to Today.'}</p>
    <a class="btn btn-primary" style="margin-top:1rem" href="#/app/today">${LANG?'ត្រឡប់ទៅថ្ងៃនេះ':'Back to Today'}</a>
  </div>`;
  return appShell({active:'', title:'Mami Care', back:'#/app/today', inner});
}

/* ============ Today — the stage-aware home screen ============ */
export function pageAppToday(){
  const p = DEMO_PROFILE;
  const next = REFERRALS[0];
  const inner = `
    ${p.status==='provisional' ? `
    <div class="vbanner"><span class="vi">${I.shield}</span>
      <div><b>${LANG?'គណនីរបស់អ្នកមិនទាន់បញ្ជាក់':'Your account is not verified yet'}</b>
        <p>${LANG?'បង្ហាញលេខកូដនេះទៅឆ្មប នៅពេលពិនិត្យលើកក្រោយ ដើម្បីទទួលបានការរំលឹកចំពោះមណ្ឌលសុខភាព។'
                  :'Show your code to a midwife at your next visit to unlock facility reminders and referrals.'}</p></div>
    </div>` : ''}
    <div class="stagecard">
      <span class="eyebrow">${LANG?'ដំណាក់កាលរបស់អ្នក':'Your stage'}</span>
      <h1${LANG?' class="km"':''}>${LANG?p.stageKh:p.stageLabel}</h1>
      <p>${p.dueLabel}</p>
    </div>
    <a class="actioncard" href="#/app/referrals/${next.id}" style="text-decoration:none;color:inherit">
      <span class="ai">${I.ref}</span>
      <div><b${LANG?' class="km"':''}>${LANG?'ការណែនាំបន្ទាប់របស់អ្នក':'Your next suggested visit'}</b>
      <span>${LANG?next.reasonKh:next.reason} · ${next.when}</span></div>
    </a>
    <p class="eyebrow" style="display:block;margin:1.5rem 0 .8rem">${LANG?'សម្រាប់សប្តាហ៍នេះ':'This week for you'}</p>
    ${LIBRARY_ITEMS.filter(x=>x.status==='published').slice(0,3).map(contentRow).join('')}
    <a class="chip" href="#/app/library" style="margin-top:.2rem;display:inline-flex">${LANG?'មើលបណ្ណាល័យទាំងមូល':'Browse the full library'} ${I.arrow}</a>
    <div class="choice" style="margin-top:1.6rem;border-top:1px solid var(--line-soft);padding-top:1.1rem">
      <span class="ci">${I.ask}</span>
      <div><h3>${LANG?'មានសំណួរទេ?':'Have a question?'}</h3><p>${LANG?'សួរបានគ្រប់ពេល ជាភាសាខ្មែរ។':'Ask anything, any time, in Khmer.'}</p></div>
    </div>
    <a class="btn btn-primary" style="width:100%;margin-top:.6rem" href="#/app/ask">${LANG?'សួរសំណួរ':'Ask a question'}</a>
    <p class="small" style="text-align:center;margin-top:1.6rem">${LANG?'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ · ឥឡូវនេះ':'Last updated · just now'}</p>
  `;
  return appShell({active:'today', title: LANG?'ថ្ងៃនេះ':'Today', back:'#/', inner});
}

/* ============ Library ============ */
export function pageAppLibrary(){
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${LANG?'រកមើលតាមប្រធានបទ។ អានបានដោយមិនចាំបាច់ចុះឈ្មោះទេ។'
      :'Browse by topic — you do not need an account to read any of this.'}</p>
    <div class="grid-c c2">${LIBRARY_TOPICS.map(topic=>`
      <a class="tile" href="#/app/library/${topic.slug}">
        <span class="ic">${topic.icon}</span>
        <h3${LANG?' class="km"':''}>${LANG?topic.kh:topic.name}</h3>
        <p>${topic.blurb}</p>
        <span class="go">${t('learn')} ${I.arrow}</span>
      </a>`).join('')}
    </div>`;
  return appShell({active:'library', title: LANG?'បណ្ណាល័យ':'Library', back:'#/app/today', inner});
}

export function pageAppTopic(slug){
  const topic = libraryTopic(slug);
  if(!topic) return pageAppMissing();
  const items = itemsInTopic(slug);
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${topic.blurb}</p>
    ${items.map(contentRow).join('') || `<p class="small">${LANG?'មិនទាន់មានអត្ថបទនៅឡើយទេ':'No items here yet.'}</p>`}`;
  return appShell({active:'library', title: LANG?topic.kh:topic.name, back:'#/app/library', inner});
}

export function pageAppContent(topicSlug, itemSlug){
  const item = libraryItem(itemSlug);
  if(!item || item.topic!==topicSlug) return pageAppMissing();
  const topic = libraryTopic(item.topic);
  /* A link to a draft or a withdrawn item never 404s and never shows the
     old text either — a neutral notice instead, per BRD-01 BR-01-03. */
  if(item.status!=='published'){
    const inner = `<div style="text-align:center;padding-block:2rem">
      <h1 style="font-size:1.3rem">${LANG?'ព័ត៌មាននេះត្រូវបានធ្វើបច្ចុប្បន្នភាព':'This information has been updated'}</h1>
      <p class="small" style="margin-top:.6rem">${LANG?'អត្ថបទដែលអ្នកកំពុងស្វែងរកលែងមាននៅទីនេះទៀតហើយ។':'The article you were looking for is no longer here.'}</p>
      <a class="btn btn-primary" style="margin-top:1.1rem" href="#/app/library/${topicSlug}">${LANG?'ត្រឡប់ទៅបណ្ណាល័យ':'Back to the library'}</a>
    </div>`;
    return appShell({active:'library', title: LANG?topic?.kh:topic?.name, back:'#/app/library/'+topicSlug, inner});
  }
  const inner = `
    <div style="display:flex;align-items:center;gap:.9rem;margin-bottom:1.2rem">
      <span class="playdot" style="width:56px;height:56px;background:var(--brand-soft);border-radius:99px">${I.play}</span>
      <span class="cmeta">${item.minutes} ${LANG?'នាទី':'min'} · ${LANG?'ត្រួតពិនិត្យចុងក្រោយ':'last reviewed'} ${item.reviewed}</span>
    </div>
    <p class="eyebrow">${LANG?topic?.kh:topic?.name}</p>
    <h1 style="font-size:1.5rem;margin:.3rem 0 1rem">${item.title}</h1>
    ${khNote()}
    <div class="article">${item.body.map(par=>`<p>${par}</p>`).join('')}</div>
    <div class="callout" style="margin-top:1.3rem">
      <p>${LANG?'តើព័ត៌មាននេះមានប្រយោជន៍ទេ?':'Was this helpful?'}
        <a href="#" class="helpful" data-v="y" style="color:var(--brand);font-weight:600">${LANG?'បាទ/ចាស':'Yes'}</a> ·
        <a href="#" class="helpful" data-v="n" style="color:var(--brand);font-weight:600">${LANG?'ទេ':'No'}</a></p>
    </div>
    <p class="eyebrow" style="display:block;margin:1.6rem 0 .8rem">${LANG?'ប្រធានបទដទៃទៀត':'More in this topic'}</p>
    ${itemsInTopic(item.topic).filter(x=>x.slug!==item.slug).slice(0,2).map(contentRow).join('')}
  `;
  return appShell({active:'library', title: LANG?'អត្ថបទ':'Article', back:'#/app/library/'+item.topic, inner});
}

/* ============ Ask a question ============ */
export function pageAppAsk(){
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG?'សរសេរសំណួររបស់អ្នក ឬជ្រើសរើសសំណួរខាងក្រោម។':'Type your question, or pick one below.'}</p>
    <form id="askForm" style="display:flex;flex-direction:column;gap:.7rem;margin-bottom:1.3rem">
      <textarea id="askText" rows="3" maxlength="500" placeholder="${LANG?'សរសេរនៅទីនេះ…':'Type your question here…'}"
        style="font:inherit;font-size:.95rem;padding:.8rem;border:1.5px solid var(--line);border-radius:10px;resize:vertical;width:100%"></textarea>
      <button class="btn btn-primary" type="submit">${LANG?'ផ្ញើសំណួរ':'Send question'} ${I.arrow}</button>
    </form>
    <div id="askAnswer"></div>
    <p class="eyebrow" style="display:block;margin:1.4rem 0 .8rem">${LANG?'សំណួរដែលគេសួរញឹកញាប់':'Suggested questions'}</p>
    <div style="display:flex;flex-direction:column;gap:.5rem">
      ${SUGGESTED_QUESTIONS.map((q,i)=>`<button type="button" class="chip askq" data-q="${i}"
        style="text-align:left;justify-content:flex-start;width:100%">${q[0]}</button>`).join('')}
    </div>
  `;
  return appShell({active:'ask', title: LANG?'សួរសំណួរ':'Ask a question', back:'#/app/today', inner});
}

/* ============ Urgent guidance — reachable from every app screen ============ */
export function pageAppUrgent(){
  const group = (title, kh, signs) => `
    <p class="eyebrow" style="display:block;margin:1.2rem 0 .6rem">${LANG?kh:title}</p>
    <ul class="plist">${signs.map(s=>`<li>${I.check}<span>${s}</span></li>`).join('')}</ul>`;
  const inner = `
    <div class="callout" style="border-left-color:var(--urgent);margin-bottom:.4rem">
      <p><strong>${LANG?'នេះមិនមែនជាសេវាសង្គ្រោះបន្ទាន់ទេ':'This is not an emergency service'}</strong>${LANG?'។ ':'. '}
      ${LANG?'ប្រសិនបើអ្នក ឬទារកមានសញ្ញាណាមួយខាងក្រោម សូមទៅមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យជិតបំផុតឥឡូវនេះ។'
             :'If you or your baby has any of these signs, go to your nearest health centre or hospital now — do not wait for a reply here.'}</p>
    </div>
    ${group('If you are pregnant','ពេលមានផ្ទៃពោះ', URGENT_SIGNS.pregnancy)}
    ${group('After the birth','ក្រោយសម្រាល', URGENT_SIGNS.postpartum)}
    ${group('For your baby','សម្រាប់ទារក', URGENT_SIGNS.baby)}
    <div class="stepbox" style="margin-top:1.5rem">
      <h3>${LANG?'ត្រូវការនរណាម្នាក់ឥឡូវនេះ?':'Need someone right now?'}</h3>
      <p style="font-size:.92rem;color:var(--ink-2)">${LANG?'ខ្សែជំនួយឥតគិតថ្លៃ បើកចាប់ពី ០៧:០០ ដល់ ១៩:០០ រៀងរាល់ថ្ងៃ។'
        :'The free helpline is open 07:00–19:00, every day including weekends.'}</p>
      <a class="btn btn-primary" style="width:100%;margin-top:.9rem" href="#/help">${LANG?'ទាក់ទងខ្សែជំនួយ':'Contact the helpline'}</a>
    </div>
  `;
  return appShell({active:'', title: LANG?'ការណែនាំបន្ទាន់':'Urgent guidance', back:'#/app/today', inner});
}

/* ============ Referrals ============ */
export function pageAppReferrals(){
  const inner = REFERRALS.length ? REFERRALS.map(r=>`
    <a class="ccard" href="#/app/referrals/${r.id}">
      <span class="playdot" style="color:var(--accent)">${I.ref}</span>
      <span class="cbody"><b${LANG?' class="km"':''}>${LANG?r.reasonKh:r.reason}</b>
        <span class="small">${r.facility} · ${r.when}</span></span>
      ${statusPill(r.status)}
    </a>`).join('') : `<p class="small">${LANG?'អ្នកមិនទាន់មានការបញ្ជូនបន្តទេ':'You have no referrals yet.'}</p>`;
  return appShell({active:'', title: LANG?'ការបញ្ជូនបន្ត':'My referrals', back:'#/app/today', inner});
}

export function pageAppReferralDetail(id){
  const r = referral(id);
  if(!r) return pageAppMissing();
  const inner = `
    <p class="kh km">${r.reasonKh}</p>
    <h1 style="font-size:1.4rem;margin:.2rem 0 .6rem">${r.reason}</h1>
    ${statusPill(r.status)}
    <div class="stepbox" style="margin-top:1.2rem">
      <h3>${LANG?'ទីតាំង':'Where to go'}</h3>
      <p style="font-size:.95rem;color:var(--ink-2)"><b style="color:var(--ink)">${r.facility}</b><br>${r.address}<br>${r.phone}</p>
    </div>
    <p class="eyebrow" style="display:block;margin:1.4rem 0 .3rem">${LANG?'ដំណើរការ':'Status'}</p>
    ${referralStepper(r.status)}
    <div id="refActionArea">
      <div class="cta-row" style="margin-top:.4rem">
        <button class="btn btn-primary" data-ref-action="going" data-ref="${r.id}">${LANG?'ខ្ញុំនឹងទៅ':'I will go'}</button>
        <button class="btn btn-ghost" data-ref-action="help" data-ref="${r.id}">${LANG?'ត្រូវការជំនួយធ្វើដំណើរ':'I need help getting there'}</button>
        <button class="btn btn-ghost" data-ref-action="went" data-ref="${r.id}">${LANG?'ខ្ញុំបានទៅរួច':'I already went'}</button>
      </div>
    </div>
    <p class="eyebrow" style="display:block;margin:1.5rem 0 .6rem">${LANG?'កំណត់ហេតុ':'History'}</p>
    <ul class="plist">${r.history.map(h=>`<li>${I.dot}<span><b>${h.date}</b> — ${h.note}</span></li>`).join('')}</ul>
  `;
  return appShell({active:'', title: LANG?'ការបញ្ជូនបន្ត':'Referral', back:'#/app/referrals', inner});
}

/* ============ Me — profile hub ============ */
export function pageAppMe(){
  const p = DEMO_PROFILE;
  const link = (href, icon, title, kh, desc) => `
    <a class="choice" href="${href}" style="text-decoration:none;color:inherit;cursor:pointer">
      <span class="ci">${icon}</span>
      <div><h3${LANG?' class="km"':''}>${LANG?kh:title}</h3><p>${desc}</p></div>
    </a>`;
  const inner = `
    <div class="stagecard" style="text-align:center">
      <span style="display:inline-grid;place-items:center;width:60px;height:60px;border-radius:99px;
        background:var(--brand-soft);color:var(--brand);margin:0 auto .7rem">${I.user}</span>
      <p style="font-size:.95rem;font-weight:600">${LANG?p.stageKh:p.stageLabel}</p>
      <span class="pill${p.status==='verified'?' pill-ok':''}" style="margin-top:.5rem">
        ${p.status==='verified' ? (LANG?'បានបញ្ជាក់':'Verified') : (LANG?'មិនទាន់បញ្ជាក់':'Provisional')}</span>
    </div>
    ${link('#/app/me/preferences', I.chan, 'How we contact you','របៀបដែលយើងទាក់ទងអ្នក','Channel, language, time window and frequency.')}
    ${link('#/app/me/consent', I.shield, 'Consent centre','មជ្ឈមណ្ឌលការយល់ព្រម','See and change what you have agreed to.')}
    ${link('#/app/me/data', I.lock, 'My data','ទិន្នន័យរបស់ខ្ញុំ','What we store, and how to request or delete it.')}
    ${link('#/app/me/phone', I.sms, 'Change phone number','ប្តូរលេខទូរស័ព្ទ','Move your account to a new number.')}
    <a class="btn btn-ghost" style="width:100%;margin-top:1.6rem" href="#/">${LANG?'ចាកចេញពីការសាកល្បង':'Exit the demo'}</a>
  `;
  return appShell({active:'me', title: LANG?'ខ្ញុំ':'Me', back:'#/app/today', inner});
}

export function pageAppPreferences(){
  const p = DEMO_PROFILE;
  const inner = `
    <form id="prefForm" style="display:flex;flex-direction:column;gap:1.3rem">
      <div class="field full">
        <label>${LANG?'តើគួរទាក់ទងអ្នកតាមមធ្យោបាយណា?':'How should we contact you?'}</label>
        <div class="segs" data-group="pref-channel">
          <button type="button" class="seg" data-v="sms" aria-pressed="${p.channel==='sms'}">SMS</button>
          <button type="button" class="seg" data-v="voice" aria-pressed="${p.channel==='voice'}">${LANG?'ការហៅជាសំឡេង':'Voice call'}</button>
          <button type="button" class="seg" data-v="app" aria-pressed="${p.channel==='app'}">${LANG?'កម្មវិធី':'The app'}</button>
        </div>
      </div>
      <div class="field full">
        <label>${LANG?'ពេលវេលាដែលអ្នកចង់ទទួល':'Preferred time window'}</label>
        <div class="segs" data-group="pref-time">
          <button type="button" class="seg" data-v="morning" aria-pressed="${p.timeWindow==='morning'}">${LANG?'ព្រឹក':'Morning'}</button>
          <button type="button" class="seg" data-v="afternoon" aria-pressed="${p.timeWindow==='afternoon'}">${LANG?'រសៀល':'Afternoon'}</button>
          <button type="button" class="seg" data-v="evening" aria-pressed="${p.timeWindow==='evening'}">${LANG?'ល្ងាច':'Evening'}</button>
        </div>
      </div>
      <div class="field full">
        <label>${LANG?'ភាសា':'Language'}</label>
        <div class="segs" data-group="pref-lang">
          <button type="button" class="seg" data-v="km" aria-pressed="${p.language==='km'}">ភាសាខ្មែរ</button>
          <button type="button" class="seg" data-v="en" aria-pressed="${p.language==='en'}">English</button>
        </div>
      </div>
      <div class="field full">
        <label>${LANG?'ភាពញឹកញាប់':'Frequency'}</label>
        <div class="segs" data-group="pref-freq">
          <button type="button" class="seg" data-v="normal" aria-pressed="${p.frequency==='normal'}">${LANG?'ធម្មតា':'Normal'}</button>
          <button type="button" class="seg" data-v="reduced" aria-pressed="${p.frequency==='reduced'}">${LANG?'ត្រឹមតែសំខាន់':'Reduced — essential only'}</button>
        </div>
      </div>
      <label class="cons">
        <input type="checkbox" id="safeContact" ${p.safeContact?'checked':''}>
        <span><b>${LANG?'របៀបទូរស័ព្ទរួម':'Safe contact for a shared phone'}</b>
          <span>${LANG?'ឈ្មោះអ្នកផ្ញើសារជាកណ្តាល គ្មានមាតិកានៅលើអេក្រង់ចាក់សោ គ្មានការហៅជាសំឡេង។'
                        :'Neutral sender name, no content in the lock-screen preview, no voice calls.'}</span></span>
      </label>
      <button class="btn btn-primary" type="submit">${LANG?'រក្សាទុកការផ្លាស់ប្តូរ':'Save changes'}</button>
    </form>
    <div id="prefOk" hidden style="margin-top:1.1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានរក្សាទុក':'Saved'}</h3>
        <p id="prefOkText">${LANG?'ការកំណត់របស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។':'Your preferences have been updated.'}</p></div></div>
    </div>
  `;
  return appShell({active:'me', title: LANG?'ចំណូលចិត្ត':'Preferences', back:'#/app/me', inner});
}

export function pageAppConsent(){
  const rows = CONSENT_TYPES.map(c=>`
    <label class="cons${c.required?' locked':''}">
      <input type="checkbox" ${c.granted?'checked':''} ${c.required?'disabled':''} data-consent="${c.key}">
      <span><b${LANG?' class="km"':''}>${LANG?c.kh:c.name}${c.required?` · ${LANG?'ចាំបាច់':'required'}`:''}</b>
        <span>${c.desc}</span>
        ${c.date?`<span class="small" style="display:block;margin-top:.2rem">${LANG?'ផ្តល់ជូននៅ':'Granted'} ${c.date}</span>`:''}
      </span>
    </label>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG?'ការបិទចំណុចមួយ មិនប៉ះពាល់ដល់ចំណុចផ្សេងទៀតទេ។'
      :'Turning one permission off never turns the others off.'}</p>
    <div class="consents">${rows}</div>
    <button class="btn btn-primary" id="consentSave" style="width:100%;margin-top:1.2rem">${LANG?'រក្សាទុក':'Save changes'}</button>
    <div id="consentOk" hidden style="margin-top:1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានធ្វើបច្ចុប្បន្នភាព':'Updated'}</h3>
        <p>${LANG?'ការយល់ព្រមរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។':'Your consent choices have been updated.'}</p></div></div>
    </div>
    <div class="callout" style="margin-top:1.3rem"><p>${LANG?'ចង់បញ្ឈប់ទាំងស្រុង?':'Want to stop everything?'} <a href="#/app/me/data" style="color:var(--brand);font-weight:600">${LANG?'ស្នើសុំលុបទិន្នន័យ':'Request full deletion'}</a> ${LANG?'ឬឆ្លើយតបពាក្យ STOP ចំពោះសារណាមួយ។':'or reply STOP to any message.'}</p></div>
  `;
  return appShell({active:'me', title: LANG?'ការយល់ព្រម':'Consent centre', back:'#/app/me', inner});
}

export function pageAppData(){
  const fields = [
    [LANG?'ព័ត៌មានទំនាក់ទំនង':'Contact details', LANG?'លេខទូរស័ព្ទ ភាសា មធ្យោបាយ':'Phone number, language, channel'],
    [LANG?'កាលបរិច្ឆេទដំណាក់កាល':'Stage dates', LANG?'ថ្ងៃកំណត់សម្រាល ឬថ្ងៃកំណើតកូន':'Due date or child’s date of birth'],
    [LANG?'មណ្ឌលសុខភាព':'Linked facility', DEMO_PROFILE.facility || (LANG?'មិនទាន់ភ្ជាប់':'Not linked yet')],
    [LANG?'ប្រវត្តិការយល់ព្រម':'Consent history', LANG?'អ្វីដែលអ្នកបានយល់ព្រម និងពេលណា':'What you agreed to, and when'],
    [LANG?'សង្ខេបប្រវត្តិសារ':'Message history summary', LANG?'ចំនួន និងកាលបរិច្ឆេទផ្ញើ':'Counts and dates only, not content re-shown here'],
    [LANG?'ករណីជំនួយ':'Helpdesk cases', LANG?'សំណួរដែលអ្នកបានសួរ':'Questions you have asked'],
    [LANG?'ការបញ្ជូនបន្ត':'Referrals', LANG?'ការណែនាំដែលអ្នកបានទទួល':'Suggestions you have received']
  ];
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG?'នេះជាអ្វីទាំងអស់ដែលយើងរក្សាទុកអំពីអ្នកនៅក្នុងសេវានេះ។'
      :'This is everything this service stores about you.'}</p>
    <ul class="plist">${fields.map(f=>`<li>${I.dot}<span><b>${f[0]}</b><br><span class="small">${f[1]}</span></span></li>`).join('')}</ul>
    <div class="cta-row" style="margin-top:1.3rem">
      <button class="btn btn-ghost" id="dataRequest">${LANG?'ស្នើសុំទិន្នន័យរបស់ខ្ញុំ':'Request my data'}</button>
      <button class="btn btn-ghost" id="dataDelete" style="color:var(--urgent);border-color:color-mix(in srgb,var(--urgent) 40%,transparent)">${LANG?'ស្នើសុំលុប':'Request deletion'}</button>
    </div>
    <div id="dataOk" hidden style="margin-top:1.1rem"></div>
    <div class="callout" style="margin-top:1.3rem"><p>${LANG?'ការលុបមិនមែនភ្លាមៗទេ។ កំណត់ត្រាសវនកម្ម និងសុវត្ថិភាពត្រូវបានរក្សាទុកតាមគោលការណ៍។'
      :'Deletion is not instant. Audit and safety records are kept per policy — everything else is removed.'}</p></div>
  `;
  return appShell({active:'me', title: LANG?'ទិន្នន័យរបស់ខ្ញុំ':'My data', back:'#/app/me', inner});
}

export function pageAppPhone(){
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${LANG?'ការកំណត់ដំណាក់កាល និងការយល់ព្រមរបស់អ្នកទាំងអស់ នឹងផ្លាស់ទៅលេខថ្មី។'
      :'Everything about your stage and consent moves to the new number — nothing restarts.'}</p>
    <form id="phoneForm" style="display:flex;flex-direction:column;gap:1rem">
      <div class="field"><label for="newPhone">${LANG?'លេខទូរស័ព្ទថ្មី':'New mobile number'}</label>
        <input id="newPhone" type="tel" inputmode="tel" placeholder="0XX XXX XXX" required></div>
      <button class="btn btn-primary" type="submit">${LANG?'ផ្ញើលេខកូដបញ្ជាក់':'Send confirmation code'}</button>
    </form>
    <div id="phoneOk" hidden style="margin-top:1.1rem;display:flex;flex-direction:column;gap:1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានផ្ញើលេខកូដ':'Code sent'}</h3>
        <p>${LANG?'យើងក៏បានជូនដំណឹងទៅលេខចាស់របស់អ្នកផងដែរ សម្រាប់សុវត្ថិភាព។':'We also sent a notice to your old number, for your security.'}</p></div></div>
      <div class="field"><label for="phoneOtp">${LANG?'លេខកូដ ៦ខ្ទង់':'Six-digit code'}</label>
        <input id="phoneOtp" inputmode="numeric" maxlength="6" placeholder="––––––"
          style="letter-spacing:.5em;text-align:center;font-family:var(--font-mono)"></div>
      <button class="btn btn-primary" id="phoneConfirm">${LANG?'បញ្ជាក់':'Confirm'}</button>
    </div>
    <div id="phoneDone" hidden style="margin-top:1.1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានផ្លាស់ប្តូរលេខរួចរាល់':'Number updated'}</h3>
        <p>${LANG?'គណនីរបស់អ្នកឥឡូវប្រើលេខថ្មីរួចហើយ។':'Your account now uses the new number.'}</p></div></div>
    </div>
  `;
  return appShell({active:'me', title: LANG?'ប្តូរលេខទូរស័ព្ទ':'Change phone number', back:'#/app/me', inner});
}
