/* Page renderers for the logged-in client-app demo under #/app/*.
   This is the "Mom App" from BRD-01: a preview of what a mother sees once
   she has joined — her stage, the library, ask-a-question, referrals and
   her own preference/consent/data controls. One sample profile stands in
   for "you"; nothing here is a real account. */
import { I } from './icons.js';
import { LANG, t, khNote } from './i18n.js';
import {
  DEMO_PROFILE, LIBRARY_TOPICS, LIBRARY_ITEMS, libraryTopic, libraryItem, itemsInTopic,
  SUGGESTED_QUESTIONS, URGENT_SIGNS, REFERRALS, referral, CONSENT_TYPES,
  HELPLINE_NUMBER, HELPLINE_HOURS, SC, PROVINCES, publicFacilities, JOURNEY
} from './data.js';
import { appShell, contentRow, statusPill, referralStepper, stepProgress, notifPreview } from './components.js';
import { MY_CASES, getCase } from './ask-state.js';
import { ENROLL, enrollCode, applyEnrollToProfile } from './enroll-state.js';
import { facilityCard } from './pages.js';

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
    <a class="chip" href="#/app/messages" style="margin-top:1rem;display:inline-flex">${I.sms} ${LANG?'មើលគំរូការជូនដំណឹង':'See how a reminder looks on your phone'}</a>
    <p class="small" style="text-align:center;margin-top:1.6rem">${LANG?'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ · ឥឡូវនេះ':'Last updated · just now'}</p>
  `;
  return appShell({active:'today', title: LANG?'ថ្ងៃនេះ':'Today', back:'#/', inner});
}

/* ============ notification preview (§6.4 safe-contact preview, applied
   client-side) — a lock-screen simulation, not real message history.
   Shows exactly what a reminder looks like as it arrives, and how that
   changes the moment the handset is marked shared. */
export function pageAppMessages(){
  const p = DEMO_PROFILE;
  const sample = JOURNEY[1]; // a representative mid-pregnancy reminder
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'នេះជាគំរូតែប៉ុណ្ណោះ — មិនមែនប្រវត្តិសារពិតទេ។ សូមសាកល្បងចុចប៊ូតុងខាងក្រោម។'
      :'This is a demonstration, not real message history. Tap the button below to try it.'}</p>

    <div class="notif-demo-frame">
      <div class="notif-demo-clock">9:41</div>
      <div class="notif-demo-slot" id="notifSlot"></div>
    </div>

    <button class="btn btn-primary" id="simulateMsgBtn" type="button" style="width:100%;margin-top:1.1rem">
      ${I.sms} ${LANG?'សាកល្បងទទួលសារ':'Simulate an incoming message'}</button>

    <label class="cons" style="margin-top:1.1rem">
      <input type="checkbox" id="notifSafeToggle" ${p.safeContact?'checked':''}>
      <span><b>${LANG?'ទូរស័ព្ទនេះជារបស់រួម (Safe contact)':'This handset is shared (Safe contact)'}</b>
        <span>${LANG?'ពេលបើក ការជូនដំណឹងលាក់ខ្លឹមសារទាំងអស់ និងឈ្មោះអ្នកផ្ញើ។':'When on, the notification hides the message content and the sender name entirely.'}</span></span>
    </label>

    <div id="openedMessage" hidden style="margin-top:1.5rem">
      <p class="eyebrow" style="display:block;margin-bottom:.6rem">${LANG?'សារដែលបានបើក':'Opened message'}</p>
      <div class="bubble"><span class="km">${sample.msg}</span><span class="en">${sample.en}</span></div>
      <p class="small" style="margin-top:.7rem">${LANG
        ?'ឆ្លើយតប STOP ឬ ឈប់ ដើម្បីឈប់ទទួលសារនៅពេលណាក៏បាន — មិនចាំបាច់ជាមួយហេតុផលទេ។'
        :'Reply STOP at any time to stop receiving messages — no reason needed.'}</p>
    </div>
  `;
  return appShell({active:'today', title: LANG?'គំរូការជូនដំណឹង':'Notification preview', back:'#/app/today', inner});
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

/* ============ Ask a question — a small chat with an automated
   Level-1 layer that hands off to a real person (Level 2) ============ */
const ASK_STATUS_LABEL = {
  answered_auto:['Waiting on your feedback','កំពុងរង់ចាំមតិកែលម្អ'],
  escalated:['With a helpdesk operator','កំពុងឆ្លងកាត់បុគ្គលិកជំនួយ'],
  answered:['Answered','បានឆ្លើយ'],
  closed:['Closed','បានបិទ']
};
function askStatusPill(status){
  const tone = {answered_auto:'brand', escalated:'warn', answered:'ok', closed:''}[status] || '';
  const label = ASK_STATUS_LABEL[status] || ['—','—'];
  return `<span class="pill${tone?' pill-'+tone:''}">${LANG?label[1]:label[0]}</span>`;
}

export function pageAppAsk(){
  const recent = MY_CASES.slice(0, 6);
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG?'សរសេរសំណួររបស់អ្នក ឬជ្រើសរើសសំណួរខាងក្រោម។ ចម្លើយភ្លាមៗគឺមកពីព័ត៌មានសុខភាពដែលបានអនុម័តតែប៉ុណ្ណោះ។'
      :'Type your question, or pick one below. Instant answers only ever come from approved health information — anything else goes to a person.'}</p>
    <form id="askForm" style="display:flex;flex-direction:column;gap:.7rem;margin-bottom:1.3rem">
      <textarea id="askText" rows="3" maxlength="500" placeholder="${LANG?'សរសេរនៅទីនេះ…':'Type your question here…'}"
        style="font:inherit;font-size:.95rem;padding:.8rem;border:1.5px solid var(--line);border-radius:10px;resize:vertical;width:100%"></textarea>
      <button class="btn btn-primary" type="submit">${LANG?'ផ្ញើសំណួរ':'Send question'} ${I.arrow}</button>
    </form>
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'សំណួរដែលគេសួរញឹកញាប់':'Suggested questions'}</p>
    <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem">
      ${SUGGESTED_QUESTIONS.map((q,i)=>`<button type="button" class="chip askq" data-q="${i}"
        style="text-align:left;justify-content:flex-start;width:100%">${q[0]}</button>`).join('')}
    </div>
    ${recent.length ? `
    <p class="eyebrow" style="display:block;margin-bottom:.8rem">${LANG?'ការសន្ទនាថ្មីៗ':'Recent conversations'}</p>
    <div style="display:flex;flex-direction:column;gap:.6rem">
      ${recent.map(c=>`<a class="ccard" href="#/app/ask/${c.id}">
        <span class="playdot" style="color:var(--accent)">${I.ask}</span>
        <span class="cbody"><b>${c.question}</b><span class="small">${c.id}</span></span>
        ${askStatusPill(c.status)}</a>`).join('')}
    </div>` : ''}
    <div class="callout" style="margin-top:1.4rem"><p>${LANG?'ចង់និយាយជាមួយមនុស្សផ្ទាល់?':'Would rather talk to someone directly?'}
      <a href="#/app/callback" style="color:var(--brand);font-weight:600">${LANG?'ស្នើសុំការហៅត្រឡប់':'Request a call back'} ${I.arrow}</a></p></div>
  `;
  return appShell({active:'ask', title: LANG?'សួរសំណួរ':'Ask a question', back:'#/app/today', inner});
}

/* Render one message of the thread. Sentinel text values (set in
   ask-state.js) are translated to copy here, in the UI layer. */
function askBubble(msg){
  if(msg.from==='me'){
    return `<div class="askrow me"><div class="askbubble">${msg.text}</div></div>`;
  }
  if(msg.from==='system'){
    const copy = {
      connecting: LANG?'កំពុងភ្ជាប់អ្នកទៅកាន់បុគ្គលិកជំនួយ…':'Connecting you to a helpdesk operator…',
      no_match: LANG?'យើងមិនទាន់មានចម្លើយដែលបានអនុម័តសម្រាប់សំណួរនេះទេ។':'We don’t have an approved answer for that yet.',
      glad_helped: LANG?'រីករាយដែលបានជួយ!':'Glad that helped!'
    }[msg.text] || '';
    return `<p class="asksys">${copy}</p>`;
  }
  if(msg.from==='bot' && msg.text==='urgent_protocol'){
    return `<div class="askrow bot"><div class="askbubble" style="background:color-mix(in srgb,var(--urgent) 10%,var(--surface));border-color:color-mix(in srgb,var(--urgent) 30%,transparent)">
      <span class="asklabel" style="color:var(--urgent)">${LANG?'សញ្ញាបន្ទាន់':'Urgent'}</span>
      ${LANG?'នេះស្តាប់ទៅដូចជាបន្ទាន់។ សូមទៅមណ្ឌលសុខភាពជិតបំផុតឥឡូវនេះ — កុំរង់ចាំចម្លើយនៅទីនេះ។'
             :'This sounds urgent. Please go to your nearest health centre now — don’t wait for a reply here.'}
      <br><a href="#/app/urgent" style="color:var(--urgent);font-weight:600">${LANG?'មើលការណែនាំបន្ទាន់':'See urgent guidance'} ${I.arrow}</a>
    </div></div>`;
  }
  if(msg.from==='bot'){
    return `<div class="askrow bot"><div class="askbubble">
      <span class="asklabel">${LANG?'ចម្លើយស្វ័យប្រវត្តិ ពីព័ត៌មានដែលបានអនុម័ត':'Automatic answer, from approved information'}</span>
      ${msg.text}</div></div>`;
  }
  if(msg.from==='operator'){
    return `<div class="askrow operator"><div class="askbubble">
      <span class="asklabel">${LANG?'បុគ្គលិកជំនួយ':'Helpdesk operator'}</span>
      ${LANG?'សូមអភ័យទោសដែលឆ្លើយយឺត! សំណួររបស់អ្នកបានឆ្លងកាត់ការត្រួតពិនិត្យរួចហើយ — យើងអាចជួយបាន។ បើវាបន្ទាន់ជាងនេះ សូមទៅមណ្ឌលសុខភាព ឬហៅខ្សែជំនួយ។'
             :'Thanks for your patience — I’ve read your question. A member of our team will follow up here shortly with next steps. If anything feels urgent in the meantime, go to your nearest health centre or call the helpline.'}</div></div>`;
  }
  return '';
}

export function pageAppAskThread(id){
  const c = getCase(id);
  if(!c) return pageAppMissing();
  const showHelpful = c.status==='answered_auto';
  const closed = c.status==='closed';
  const inner = `
    <div class="askthread">${c.thread.map(askBubble).join('')}</div>
    ${c.awaitingOperator ? `<p class="asksys" id="askWaiting">${LANG?'បុគ្គលិកជំនួយកំពុងអានសំណួររបស់អ្នក…':'A helpdesk operator is reading your question…'}</p>` : ''}
    ${showHelpful ? `<div class="cta-row" style="justify-content:center;margin-top:.6rem">
      <button class="btn btn-ghost" data-ask-action="helpful" data-case="${c.id}">${LANG?'វាមានប្រយោជន៍':'That helped'}</button>
      <button class="btn btn-ghost" data-ask-action="not-helpful" data-case="${c.id}">${LANG?'ទេ, ត្រូវការជំនួយបន្ថែម':'No, I need more help'}</button>
    </div>
    <p class="small" style="text-align:center;margin-top:.9rem">${LANG?'ឬ':'or'}
      <a href="#/app/callback" style="color:var(--brand);font-weight:600">${LANG?'ស្នើសុំការហៅត្រឡប់ជំនួសវិញ':'request a call back instead'}</a></p>` : ''}
    <div id="askThreadMeta" data-case="${c.id}" data-awaiting="${c.awaitingOperator}" style="text-align:center;margin:1.2rem 0 .9rem">${askStatusPill(c.status)}</div>
    ${closed
      ? `<a class="btn btn-ghost" style="width:100%" href="#/app/ask">${LANG?'សួរសំណួរថ្មី':'Ask a new question'} ${I.arrow}</a>`
      : `<form id="askReplyForm" data-case="${c.id}" style="display:flex;gap:.6rem">
           <input type="text" id="askReplyText" placeholder="${LANG?'សរសេរសារ…':'Type a message…'}" autocomplete="off"
             style="flex:1;font:inherit;font-size:.92rem;padding:.7rem 1rem;border-radius:99px;border:1.5px solid var(--line)">
           <button class="btn btn-primary" type="submit" aria-label="${LANG?'ផ្ញើ':'Send'}" style="border-radius:99px;width:46px;padding:0;flex:0 0 auto">${I.arrow}</button>
         </form>`}
  `;
  return appShell({active:'ask', title: c.id, back:'#/app/ask', inner});
}

/* ============ Talk to a person — call now, or request a call back ============ */
export function pageAppCallback(){
  const inner = `
    <div class="stepbox" style="margin-bottom:1.2rem">
      <h3>${LANG?'ហៅឥឡូវនេះ':'Call now'}</h3>
      <p style="font-size:.92rem;color:var(--ink-2);margin-bottom:.9rem">${LANG?`ខ្សែជំនួយឥតគិតថ្លៃ បើកម៉ោង ${HELPLINE_HOURS}។`:`Free from any network, open ${HELPLINE_HOURS}.`}</p>
      <a class="btn btn-primary" style="width:100%" href="#/app/calling">${I.phone} ${HELPLINE_NUMBER}</a>
    </div>
    <p class="eyebrow" style="display:block;margin-bottom:.7rem">${LANG?'ឬស្នើសុំឱ្យគេហៅមកអ្នក':'Or ask us to call you'}</p>
    <form id="callbackForm" style="display:flex;flex-direction:column;gap:1rem">
      <div class="field full">
        <label>${LANG?'ពេលវេលាដែលអ្នកចង់ឱ្យហៅ':'When should we call?'}</label>
        <div class="segs" data-group="cb-time">
          <button type="button" class="seg" data-v="morning" aria-pressed="true">${LANG?'ព្រឹក':'Morning'}</button>
          <button type="button" class="seg" data-v="afternoon" aria-pressed="false">${LANG?'រសៀល':'Afternoon'}</button>
          <button type="button" class="seg" data-v="evening" aria-pressed="false">${LANG?'ល្ងាច':'Evening'}</button>
        </div>
      </div>
      <div class="field full">
        <label for="cbReason">${LANG?'អ្វីទាក់ទងនឹងបញ្ហានេះ? (មិនចាំបាច់)':'What is it about? (optional)'}</label>
        <input id="cbReason" type="text" placeholder="${LANG?'ឧ. ចង់ប្តូរចំណូលចិត្ត':'e.g. want to change my preferences'}">
      </div>
      <button class="btn btn-primary" type="submit">${LANG?'ស្នើសុំការហៅត្រឡប់':'Request a call back'}</button>
    </form>
    <div id="callbackOk" hidden style="margin-top:1.1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានស្នើសុំរួចហើយ':'Request sent'}</h3>
        <p>${LANG?'បុគ្គលិកនិយាយភាសាខ្មែរនឹងហៅទៅអ្នកក្នុងអំឡុងពេលដែលអ្នកបានជ្រើសរើស ក្នុងរយៈពេល ២៤ ម៉ោង។ ឥតគិតថ្លៃ។'
                  :'A Khmer-speaking operator will call you in your chosen window, within 24 hours. Free of charge.'}</p></div></div>
    </div>
    <div class="callout" style="border-left-color:var(--urgent);margin-top:1.3rem"><p><strong>${LANG?'នេះមិនមែនជាសេវាសង្គ្រោះបន្ទាន់ទេ':'This is not an emergency service'}</strong>${LANG?'។ ចំពោះសញ្ញាបន្ទាន់ សូមទៅមណ្ឌលសុខភាពឥឡូវនេះ។':'. For urgent signs, go to your nearest health centre now.'}</p></div>
  `;
  return appShell({active:'ask', title: LANG?'ជំនួយពីបុគ្គលិក':'Talk to a person', back:'#/app/ask', inner});
}

/* Simulates what tapping the helpline button actually does — a tel:
   link is invisible in a desktop browser with no paired phone, so the
   call itself is played out on-screen instead: ringing, then
   connected with a running timer, then hang up. */
export function pageAppCalling(){
  const inner = `
    <div style="text-align:center">
      <div class="call-avatar">${I.phone}</div>
      <h1 style="font-size:1.3rem">${LANG?'ខ្សែជំនួយ Mami Care':'Mami Care Helpline'}</h1>
      <p class="small" style="margin-top:.3rem;font-family:var(--font-mono)">${HELPLINE_NUMBER}</p>
      <p id="callStatus" style="margin-top:1.6rem;color:var(--ink-2);font-size:.95rem">${LANG?'កំពុងហៅ…':'Calling…'}</p>
      <p id="callTimer" class="small" style="margin-top:.3rem;font-family:var(--font-mono)" hidden>00:00</p>
    </div>
    <button id="endCallBtn" class="call-hangup" aria-label="${LANG?'ដាក់ចុះ':'End call'}">${I.phone}</button>
    <p class="small" style="text-align:center;margin-top:1rem">${LANG?'ការសាកល្បង — គ្មានការហៅពិតប្រាកដទេ':'Simulated — no real call is placed'}</p>
  `;
  return appShell({tabs:false, back:'#/app/callback', title:'', inner});
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
      <p style="font-size:.92rem;color:var(--ink-2)">${LANG?`ខ្សែជំនួយឥតគិតថ្លៃ បើកម៉ោង ${HELPLINE_HOURS}។`:`Free from any network, open ${HELPLINE_HOURS}.`}</p>
      <a class="btn btn-primary" style="width:100%;margin-top:.9rem" href="#/app/calling">${I.phone} ${HELPLINE_NUMBER}</a>
    </div>
  `;
  return appShell({active:'', title: LANG?'ការណែនាំបន្ទាន់':'Urgent guidance', back:'#/app/today', inner});
}

/* ============ Referrals ============ */
export function pageAppReferrals(){
  const list = REFERRALS.length ? REFERRALS.map(r=>`
    <a class="ccard" href="#/app/referrals/${r.id}">
      <span class="playdot" style="color:var(--accent)">${I.ref}</span>
      <span class="cbody"><b${LANG?' class="km"':''}>${LANG?r.reasonKh:r.reason}</b>
        <span class="small">${r.facility} · ${r.when}</span></span>
      ${statusPill(r.status)}
    </a>`).join('') : `<p class="small">${LANG?'អ្នកមិនទាន់មានការបញ្ជូនបន្តទេ':'You have no referrals yet.'}</p>`;
  const inner = `${list}
    <a class="chip" href="#/app/facilities" style="margin-top:.9rem;display:inline-flex">${I.pin} ${LANG?'ស្វែងរកមណ្ឌលសុខភាពផ្សេងទៀត':'Search other facilities'} ${I.arrow}</a>`;
  return appShell({active:'', title: LANG?'ការបញ្ជូនបន្ត':'My referrals', back:'#/app/today', inner});
}

/* ============ Find care near you — inside the app, same directory the
   public site uses (facilityCard from pages.js), so results never drift
   between the two surfaces. ============ */
export function pageAppFacilities(){
  const all = publicFacilities();
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'យើងមិនប្រើទីតាំង GPS ត្រឹមត្រូវទេ — ស្វែងរកតាមខេត្ត ឬឈ្មោះ ហើយបើកក្នុងផែនទីសម្រាប់ទិសដៅ។'
      :'We never store your precise location — search by province, then open a result in Maps for directions.'}</p>
    <select id="facProvince" style="width:100%;font:inherit;font-size:.9rem;padding:.6rem .8rem;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);margin-bottom:.7rem">
      <option value="">${LANG?'គ្រប់ខេត្ត':'All provinces'}</option>
      ${PROVINCES.map(p=>`<option value="${p}">${p}</option>`).join('')}
    </select>
    <div class="segs" data-group="fac-type" style="margin-bottom:1.1rem">
      <button type="button" class="seg" data-v="" aria-pressed="true">${LANG?'ទាំងអស់':'All types'}</button>
      <button type="button" class="seg" data-v="Health Centre" aria-pressed="false">${LANG?'មណ្ឌលសុខភាព':'Health Centre'}</button>
      <button type="button" class="seg" data-v="Referral Hospital" aria-pressed="false">${LANG?'មន្ទីរពេទ្យបញ្ជូនបន្ត':'Referral Hospital'}</button>
    </div>
    <div id="facResults" style="display:flex;flex-direction:column;gap:.9rem">${all.map(facilityCard).join('')}</div>
    <p id="facEmpty" class="small" hidden style="margin-top:1rem">${LANG?'រកមិនឃើញមណ្ឌលសុខភាពដែលត្រូវនឹងលក្ខខណ្ឌនេះទេ។':'No facilities match that search.'}</p>
  `;
  return appShell({active:'', title: LANG?'ស្វែងរកសេវាថែទាំ':'Find care near you', back:'#/app/today', inner});
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
    ${link('#/app/facilities', I.pin, 'Find care near you','ស្វែងរកសេវាថែទាំ','Search health centres and referral hospitals by province.')}
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
        <div class="segs" data-group="pref-channel" data-multi="1">
          <button type="button" class="seg" data-v="sms" aria-pressed="${p.channel.includes('sms')}">SMS</button>
          <button type="button" class="seg" data-v="voice" aria-pressed="${p.channel.includes('voice')}">${LANG?'ការហៅជាសំឡេង':'Voice call'}</button>
          <button type="button" class="seg" data-v="app" aria-pressed="${p.channel.includes('app')}">${LANG?'កម្មវិធី':'The app'}</button>
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

const CHANNEL_LABEL = { sms:['SMS','SMS'], voice:['Voice call','ការហៅជាសំឡេង'], app:['The app','កម្មវិធី'] };
const TIME_LABEL = { morning:['Morning','ព្រឹក'], afternoon:['Afternoon','រសៀល'], evening:['Evening','ល្ងាច'] };
export function pageAppData(){
  const p = DEMO_PROFILE;
  const profileRows = [
    [LANG?'លេខទូរស័ព្ទ':'Phone number', p.phoneMasked],
    [LANG?'ភាសា':'Language', p.language==='km'?'ភាសាខ្មែរ':'English'],
    [LANG?'មធ្យោបាយទំនាក់ទំនង':'Contact channel', p.channel.map(c=>LANG?CHANNEL_LABEL[c][1]:CHANNEL_LABEL[c][0]).join(', ')],
    [LANG?'ពេលវេលា':'Time window', LANG?TIME_LABEL[p.timeWindow][1]:TIME_LABEL[p.timeWindow][0]],
    [LANG?'ដំណាក់កាល':'Stage', LANG?p.stageKh:p.stageLabel],
    [LANG?'ការផ្ទៀងផ្ទាត់':'Verification', p.status==='verified' ? (LANG?'បានផ្ទៀងផ្ទាត់':'Verified') : (LANG?'បណ្តោះអាសន្ន':'Provisional')],
    [LANG?'មណ្ឌលសុខភាព':'Linked facility', p.facility || (LANG?'មិនទាន់ភ្ជាប់':'Not linked yet')]
  ];
  const fields = [
    [LANG?'ប្រវត្តិការយល់ព្រម':'Consent history', LANG?'អ្វីដែលអ្នកបានយល់ព្រម និងពេលណា':'What you agreed to, and when'],
    [LANG?'សង្ខេបប្រវត្តិសារ':'Message history summary', LANG?'ចំនួន និងកាលបរិច្ឆេទផ្ញើ':'Counts and dates only, not content re-shown here'],
    [LANG?'ករណីជំនួយ':'Helpdesk cases', LANG?'សំណួរដែលអ្នកបានសួរ':'Questions you have asked'],
    [LANG?'ការបញ្ជូនបន្ត':'Referrals', LANG?'ការណែនាំដែលអ្នកបានទទួល':'Suggestions you have received']
  ];
  const inner = `
    <p class="eyebrow" style="display:block;margin-bottom:.7rem">${LANG?'ប្រវត្តិរូបរបស់អ្នក':'Your profile'}</p>
    <div style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:0 1.1rem;margin-bottom:1.4rem">
      ${profileRows.map((r,i)=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.75rem 0;${i<profileRows.length-1?'border-bottom:1px solid var(--line-soft)':''}">
        <span class="small">${r[0]}</span><span style="font-weight:600;text-align:right">${r[1]}</span>
      </div>`).join('')}
    </div>
    <p class="eyebrow" style="display:block;margin-bottom:.7rem">${LANG?'អ្វីទាំងអស់ដែលយើងរក្សាទុក':'Everything else we store'}</p>
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

/* ============================================================
   Join Mami Care — a five-step wizard, inside the phone shell.
   This IS the front door into the app: the marketing site only ever
   previews what is here; every interactive feature lives past this
   wizard (or past Log in, for a returning visitor). Explain → contact
   & preference → consent → stage → confirmation, following BRD-01
   §7.1. Each step is its own hash (#/app/join/2 …) so back/forward and
   reload behave sensibly; the values in between live in ENROLL
   (enroll-state.js) rather than in the DOM. No bottom tabs yet — there
   is no "you" to show tabs for until this finishes.
   ============================================================ */
function joinShell(step, total, label, back, inner){
  return appShell({tabs:false, back, title: LANG?'ចូលរួម Mami Care':'Join Mami Care', inner: `
    ${step && step<=3 ? stepProgress(step, total, label) : ''}
    ${inner}
  `});
}

function joinStep1(){
  const listen = title => `<span class="ci">${I.play}</span><div><h3>${title}</h3>`;
  return joinShell(0,3,'', undefined, `
    <h1 style="font-size:1.5rem">${LANG?'តើ Mami Care ជាអ្វី?':'What is Mami Care?'}</h1>
    <p class="km" style="color:var(--brand);font-weight:600;margin-top:.3rem">${LANG?'What is Mami Care?':'តើ Mami Care ជាអ្វី?'}</p>
    <div style="margin-top:1.2rem;display:flex;flex-direction:column;gap:0">
      <div class="choice">${listen(LANG?'អ្នកនឹងទទួលបានអ្វី':'What you get')}<p>${LANG?'ការណែនាំតាមដំណាក់កាល ២–៤ សារក្នុងមួយសប្តាហ៍ ចាប់ពីការពិនិត្យផ្ទៃពោះលើកដំបូង រហូតដល់ខួបកំណើតទី ២ របស់កូន។':'Stage-matched guidance, about 2–4 messages a week, from your first antenatal visit to your child’s second birthday.'}</p></div></div>
      <div class="choice">${listen(LANG?'ភាពញឹកញាប់':'How often')}<p>${LANG?'មិនដែលមានចន្លោះម៉ោង ៩យប់ ដល់ ៦ព្រឹកទេ ហើយអ្នកជ្រើសរើសពេលព្រឹក រសៀល ឬល្ងាច។':'Never between 9pm and 6am, and you choose morning, afternoon or evening.'}</p></div></div>
      <div class="choice">${listen(LANG?'របៀបបញ្ឈប់':'How to stop')}<p>${LANG?'ឆ្លើយតបពាក្យ ឈប់ ឬ STOP ចំពោះសារណាមួយ គ្រប់ពេល។ អ្វីៗនឹងឈប់ក្នុងរយៈពេលមួយនាទី។':'Reply ឈប់ or STOP to any message, any time. Everything stops within a minute.'}</p></div></div>
    </div>
    <a class="btn btn-primary" style="width:100%;margin-top:1.3rem" href="#/app/join/2">${LANG?'ចាប់ផ្តើម':'Get started'} ${I.arrow}</a>
    <p class="small" style="text-align:center;margin-top:.9rem">${LANG?'ធ្លាប់ចូលរួមរួចហើយ?':'Already joined?'} <a href="#/app/login" style="color:var(--brand);font-weight:600">${LANG?'ចូលគណនី':'Log in'}</a></p>
  `);
}

function joinStep2(){
  const e = ENROLL;
  return joinShell(1,3,LANG?'ទំនាក់ទំនង និងចំណូលចិត្ត':'Contact & preference', '#/app/join', `
    <h1 style="font-size:1.4rem">${LANG?'តើយើងអាចទាក់ទងអ្នកតាមរបៀបណា?':'How can we reach you?'}</h1>
    <form id="regForm2" style="margin-top:1.2rem;display:flex;flex-direction:column;gap:1.1rem">
      <div class="field"><label for="rph">${LANG?'លេខទូរស័ព្ទ':'Mobile number'}</label>
        <input id="rph" type="tel" inputmode="tel" placeholder="0XX XXX XXX" value="${e.phone}" required>
        <span class="hint">${LANG?'បណ្តាញទូរស័ព្ទណាមួយក៏បាន':'Any Cambodian network.'}</span></div>
      <div class="field full">
        <label>${LANG?'ភាសា':'Language'}</label>
        <div class="segs" data-group="reg-lang">
          <button type="button" class="seg" data-v="km" aria-pressed="${e.language==='km'}">ភាសាខ្មែរ</button>
          <button type="button" class="seg" data-v="en" aria-pressed="${e.language==='en'}">English</button>
        </div>
      </div>
      <div class="field full">
        <label>${LANG?'តើគួរទាក់ទងអ្នកតាមមធ្យោបាយណា? (ជ្រើសរើសមួយ ឬច្រើន)':'How should we contact you? (choose one or more)'}</label>
        <div class="segs" data-group="reg-chan" data-multi="1">
          <button type="button" class="seg" data-v="sms" aria-pressed="${e.channel.includes('sms')}">SMS</button>
          <button type="button" class="seg" data-v="voice" aria-pressed="${e.channel.includes('voice')}">${LANG?'ការហៅជាសំឡេង':'Khmer voice call'}</button>
          <button type="button" class="seg" data-v="app" aria-pressed="${e.channel.includes('app')}">${LANG?'កម្មវិធី':'The app'}</button>
        </div>
      </div>
      <div class="field full">
        <label>${LANG?'ពេលវេលាដែលអ្នកចង់ទទួល':'Preferred time window'}</label>
        <div class="segs" data-group="reg-time">
          <button type="button" class="seg" data-v="morning" aria-pressed="${e.timeWindow==='morning'}">${LANG?'ព្រឹក':'Morning'}</button>
          <button type="button" class="seg" data-v="afternoon" aria-pressed="${e.timeWindow==='afternoon'}">${LANG?'រសៀល':'Afternoon'}</button>
          <button type="button" class="seg" data-v="evening" aria-pressed="${e.timeWindow==='evening'}">${LANG?'ល្ងាច':'Evening'}</button>
        </div>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">${LANG?'បន្ត':'Continue'} ${I.arrow}</button>
    </form>
  `);
}

function joinStep3(){
  const c = ENROLL.consents;
  /* Every consent — including the required one — starts Off and stays a
     real, clickable choice. "Required" only means the wizard blocks moving
     on until it is ticked (BR-01-01); it must never be pre-checked or
     locked, or there is nothing left for the visitor to actually consent to. */
  const row = (key, name, desc, required) => `
    <label class="cons">
      <input type="checkbox" data-consent="${key}" ${c[key]?'checked':''}>
      <span><b>${name}${required?(LANG?' · ចាំបាច់':' · required'):''}</b><span>${desc}</span></span>
    </label>`;
  return joinShell(2,3,LANG?'ការយល់ព្រម':'Consent', '#/app/join/2', `
    <h1 style="font-size:1.4rem">${LANG?'តើអ្នកយល់ព្រមអ្វីខ្លះ?':'What do you agree to?'}</h1>
    <p style="color:var(--ink-2);font-size:.9rem;margin-top:.4rem">${LANG?'ការអនុញ្ញាតនីមួយៗជាជម្រើសដាច់ដោយឡែក។ អ្នកអាចដកវិញបានគ្រប់ពេល។':'Each permission is its own choice. You can withdraw any of them later, at any time.'}</p>
    <div class="consents" style="margin-top:1.1rem">
      ${row('engagement', LANG?'ការណែនាំសុខភាព និងការរំលឹក':'Health guidance & reminders', LANG?'សារតាមដំណាក់កាល ប្រហែល ២–៤ ដងក្នុងមួយសប្តាហ៍ រហូតដល់កូនអាយុ ២ឆ្នាំ។ នេះជាការអនុញ្ញាតតែមួយគត់ដែលសេវានេះត្រូវការ។':'Messages timed to your stage, about 2–4 a week, until your child turns two. This is the one permission the service needs to run at all.', true)}
      ${row('voice', LANG?'ការហៅជាសំឡេង':'Voice calls', LANG?'ការហៅជាសំឡេងខ្មែរដោយស្វ័យប្រវត្តិ ជំនួស ឬបន្ថែមលើអត្ថបទ។':'Automated Khmer voice calls, instead of or alongside text, at most twice a week.', false)}
      ${row('referral', LANG?'ការចែករំលែកសម្រាប់ការបញ្ជូនបន្ត':'Sharing for a referral', LANG?'ប្រាប់ឱ្យមណ្ឌលសុខភាពដឹងថាអ្នកនឹងទៅ។ សួរម្តងទៀតដាច់ដោយឡែកជារៀងរាល់ពេល។':'Tell a health centre you are coming when you accept a referral. Asked again, separately, each time.', false)}
      ${row('alt', LANG?'លេខទំនាក់ទំនងបន្ថែម':'An alternate contact', LANG?'អនុញ្ញាតឱ្យសាកល្បងលេខទីពីរ ប្រសិនបើមិនអាចទាក់ទងលេខទីមួយបាន។':'Let us try a second number if we cannot reach you on your first one.', false)}
      ${row('research', LANG?'ការស្រាវជ្រាវកម្មវិធីដោយអនាមិក':'Anonymous programme research', LANG?'ប្រើប្រាស់ព័ត៌មានដោយដកឈ្មោះ និងលេខទូរស័ព្ទចេញ ដើម្បីជួយកែលម្អកម្មវិធី។':'Use information with your name and number removed to help improve the programme.', false)}
    </div>
    <p id="consentError" class="small" style="color:var(--urgent);margin-top:.8rem" hidden>${LANG?'ការណែនាំសុខភាពត្រូវការចាំបាច់ដើម្បីបន្ត — អ្វីផ្សេងទៀតជាជម្រើស។':'Health guidance is required to continue — everything else is optional.'}</p>
    <button class="btn btn-primary" id="regStep3Next" style="width:100%;margin-top:1.1rem">${LANG?'បន្ត':'Continue'} ${I.arrow}</button>
  `);
}

function joinStep4(){
  const e = ENROLL;
  return joinShell(3,3,LANG?'ដំណាក់កាលរបស់អ្នក':'Your stage', '#/app/join/3', `
    <h1 style="font-size:1.4rem">${LANG?'តើអ្នកកំពុងស្ថិតនៅដំណាក់កាលណា?':'Where are you right now?'}</h1>
    <p style="color:var(--ink-2);font-size:.9rem;margin-top:.4rem">${LANG?'ជ្រើសរើសអ្វីដែលអ្នកដឹង។ ឆ្មបអាចកែតម្រូវពេលក្រោយ — យើងមិនដែលទាយកាលបរិច្ឆេទឱ្យអ្នកទេ។':'Pick whichever you know. A midwife can correct this later — we never guess a date for you.'}</p>
    <div class="segs" data-group="reg-stagemode" style="margin-top:1rem">
      <button type="button" class="seg" data-v="edd" aria-pressed="${e.stageMode==='edd'}">${LANG?'ថ្ងៃកំណត់សម្រាល':'Expected due date'}</button>
      <button type="button" class="seg" data-v="lmp" aria-pressed="${e.stageMode==='lmp'}">${LANG?'រដូវចុងក្រោយ':'Last period'}</button>
      <button type="button" class="seg" data-v="dob" aria-pressed="${e.stageMode==='dob'}">${LANG?'ថ្ងៃកំណើតកូន':'Child’s birthday'}</button>
      <button type="button" class="seg" data-v="unknown" aria-pressed="${e.stageMode==='unknown'}">${LANG?'មិនដឹង':'I don’t know'}</button>
    </div>
    <div id="stageDateWrap" class="field" style="margin-top:1rem;${e.stageMode==='unknown'?'display:none':''}">
      <label for="stageDate">${LANG?'កាលបរិច្ឆេទ':'Date'}</label>
      <input id="stageDate" type="date" value="${e.stageDate}">
      <p id="stageCalc" class="small" style="margin-top:.4rem"></p>
    </div>
    <p id="stageUnknownNote" class="small" style="margin-top:.6rem;${e.stageMode==='unknown'?'':'display:none'}">
      ${LANG?'មិនអីទេ — អ្នកនឹងទទួលបានការណែនាំដើមផ្ទៃពោះទូទៅ ហើយយើងនឹងសួរម្តងទៀតក្នុងមួយសប្តាហ៍។':'That’s fine — you’ll get general early-pregnancy guidance, and we’ll ask again in a week.'}</p>
    <button class="btn btn-primary" id="regStep4Next" style="width:100%;margin-top:1.2rem">${LANG?'បន្ត':'Continue'} ${I.arrow}</button>
  `);
}

function joinStep5(){
  const code = enrollCode();
  applyEnrollToProfile();
  return joinShell(0,3,'', undefined, `
    <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
      <div><h3>${LANG?'អ្នកបានចុះឈ្មោះជាបណ្តោះអាសន្នរួចហើយ':'You’re provisionally enrolled'}</h3>
      <p>${LANG?`សារស្វាគមន៍កំពុងផ្ញើទៅអ្នកតាម ${ENROLL.channel.join(' + ')||'SMS'}។ បង្ហាញលេខកូដនេះទៅឆ្មប នៅពេលពិនិត្យលើកក្រោយ ដើម្បីទទួលបានការរំលឹកចំពោះមណ្ឌលសុខភាព។`
                :`Your welcome message is on its way by ${ENROLL.channel.join(' + ')||'SMS'}. Show this code to a midwife at your next visit to unlock facility reminders and referrals.`}</p></div>
    </div>
    <div class="stepbox" style="margin-top:1.2rem;text-align:center">
      <h3 style="letter-spacing:.15em">${LANG?'លេខកូដផ្ទៀងផ្ទាត់របស់អ្នក':'Your verification code'}</h3>
      <p style="font-family:var(--font-mono);font-size:1.6rem;font-weight:600;letter-spacing:.15em;margin-top:.3rem">${code}</p>
    </div>
    <a class="btn btn-primary" style="width:100%;margin-top:1.3rem" href="#/app/onboarding">${LANG?'បន្តទៅកម្មវិធីរបស់អ្នក':'Continue to your app'} ${I.arrow}</a>
    <p class="small" style="text-align:center;margin-top:1rem">${LANG?'ដោយចូលរួម អ្នកយល់ព្រមតាម':'By joining you accept our'} <a href="#/privacy" style="color:var(--brand)">${LANG?'ការសន្យាភាពឯកជនរបស់យើង':'privacy promise'}</a>${LANG?'។ អ្នកអាចចាកចេញបានគ្រប់ពេលដោយឆ្លើយតបពាក្យ STOP។':'. You can leave at any time by replying STOP.'}</p>
  `);
}

export function pageAppJoin(step){
  const n = Math.min(5, Math.max(1, parseInt(step,10) || 1));
  return [joinStep1, joinStep2, joinStep3, joinStep4, joinStep5][n-1]();
}

/* ============================================================
   Log in — a returning visitor. No onboarding after this: they
   already know their way around.
   ============================================================ */
export function pageAppLogin(){
  const inner = `
    <h1 style="font-size:1.5rem">${LANG?'ចូលគណនី':'Log in'}</h1>
    <p style="color:var(--ink-2);margin-top:.5rem;font-size:.92rem">${LANG?'បញ្ចូលលេខទូរស័ព្ទដែលអ្នកបានចុះឈ្មោះ។ យើងនឹងផ្ញើលេខកូដ ៦ខ្ទង់ជូនអ្នក។':'Enter the number you joined with. We will text you a six-digit code.'}</p>
    <form id="loginForm" style="margin-top:1.3rem;display:flex;flex-direction:column;gap:1rem">
      <div class="field"><label for="lph">${LANG?'លេខទូរស័ព្ទ':'Mobile number'}</label><input id="lph" type="tel" inputmode="tel" placeholder="0XX XXX XXX" required></div>
      <button class="btn btn-primary" type="submit" style="width:100%">${LANG?'ផ្ញើលេខកូដ':'Send me a code'}</button>
    </form>
    <div id="loginOk" hidden style="margin-top:1.2rem;display:flex;flex-direction:column;gap:1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span><div><h3>${LANG?'បានផ្ញើលេខកូដ':'Code sent'}</h3><p>${LANG?'បញ្ចូលលេខ ៦ខ្ទង់ដែលទើបនឹងផ្ញើទៅអ្នក។':'Enter the six digits we just texted you.'}</p></div></div>
      <div class="field"><label for="otp">${LANG?'លេខកូដ ៦ខ្ទង់':'Six-digit code'}</label><input id="otp" inputmode="numeric" maxlength="6" placeholder="––––––" style="letter-spacing:.5em;text-align:center;font-family:var(--font-mono)"></div>
      <button class="btn btn-primary" id="loginContinue" style="width:100%">${LANG?'បន្ត':'Continue'}</button>
    </div>
    <p class="small" style="margin-top:1.1rem;text-align:center">${LANG?'មិនទាន់មានគណនី?':'No account yet?'} <a href="#/app/join" style="color:var(--brand);font-weight:600">${LANG?'ចូលរួមឥតគិតថ្លៃ':'Join free'}</a></p>
    <div class="callout" style="margin-top:1.2rem"><p><strong>${LANG?'មិនអាចទទួលបានលេខកូដ?':'Cannot get the code?'}</strong> <a href="#/app/calling" style="color:var(--brand);font-weight:600">${LANG?'ហៅខ្សែជំនួយ':'Call the helpline'}</a> — ${LANG?'ពួកគេអាចផ្ទៀងផ្ទាត់អ្នកតាមវិធីផ្សេង។':'they can verify you another way.'}</p></div>
  `;
  return appShell({tabs:false, back:'#/', title: LANG?'ចូលគណនី':'Log in', inner});
}

/* ============================================================
   Onboarding — three short screens shown once, right after joining,
   so the app itself never has to be figured out by trial and error:
   what the four tabs are for, how asking/getting help works, and
   that the visitor stays in control throughout. A returning user who
   just logged in skips straight to Today instead.
   ============================================================ */
const ONBOARD_SCREENS = [
  {
    img:'belly',
    title:{en:'You’re in. Here’s your app.', km:'អ្នកបានចូលរួចហើយ។ នេះជាកម្មវិធីរបស់អ្នក។'},
    body:{en:'Four tabs, always at the bottom: Today for what matters this week, Library to browse anything yourself, Ask for questions, and Me for your settings.',
          km:'ផ្ទាំងទាំង ៤ នៅខាងក្រោមជានិច្ច៖ ថ្ងៃនេះ សម្រាប់អ្វីសំខាន់ក្នុងសប្តាហ៍នេះ បណ្ណាល័យ សម្រាប់អានដោយខ្លួនឯង សួរ សម្រាប់សំណួរ និង ខ្ញុំ សម្រាប់ការកំណត់របស់អ្នក។'}
  },
  {
    img:'midwife',
    title:{en:'Ask anytime, talk to a person when you need to.', km:'សួរបានគ្រប់ពេល និយាយជាមួយមនុស្សនៅពេលត្រូវការ។'},
    body:{en:'The Ask tab answers common questions instantly and connects you to a real, Khmer-speaking operator for anything else — free, and never a diagnosis. The shield in the top corner always opens urgent guidance, no matter where you are.',
          km:'ផ្ទាំង សួរ ឆ្លើយសំណួរធម្មតាភ្លាមៗ ហើយភ្ជាប់អ្នកទៅបុគ្គលិកជាមនុស្សពិត និយាយភាសាខ្មែរ សម្រាប់អ្វីផ្សេងទៀត — ឥតគិតថ្លៃ។ សញ្ញាខែលនៅជ្រុងខាងលើបើកការណែនាំបន្ទាន់បានគ្រប់ពេល។'}
  },
  {
    img:'village',
    title:{en:'You stay in control of every message.', km:'អ្នកគ្រប់គ្រងគ្រប់សារទាំងអស់។'},
    body:{en:'Change your channel, language or quiet hours anytime in Me → Preferences. Review or withdraw any permission in the Consent centre. Leave whenever you want — nothing here is permanent.',
          km:'ប្តូរឆានែល ភាសា ឬម៉ោងស្ងាត់បានគ្រប់ពេលនៅ ខ្ញុំ → ចំណូលចិត្ត។ ពិនិត្យ ឬដកការអនុញ្ញាតនៅមជ្ឈមណ្ឌលការយល់ព្រម។ ចាកចេញបានពេលណាក៏បាន — គ្មានអ្វីនៅទីនេះជាអចិន្ត្រៃយ៍ទេ។'}
  }
];
export function pageAppOnboarding(step){
  const n = Math.min(ONBOARD_SCREENS.length, Math.max(1, parseInt(step,10) || 1));
  const s = ONBOARD_SCREENS[n-1];
  const isLast = n===ONBOARD_SCREENS.length;
  const inner = `
    <a class="onb-skip" href="#/app/today">${LANG?'រំលង':'Skip'}</a>
    <div style="text-align:center;padding-top:1.5rem">
      <div class="onb-art" style="border-radius:16px;overflow:hidden">${SC[s.img]}</div>
      <h1 style="font-size:1.35rem">${LANG?s.title.km:s.title.en}</h1>
      <p style="color:var(--ink-2);font-size:.92rem;margin-top:.8rem;text-align:left">${LANG?s.body.km:s.body.en}</p>
      <div class="onb-dots">${ONBOARD_SCREENS.map((_,i)=>`<span class="${i===n-1?'on':''}"></span>`).join('')}</div>
      <a class="btn btn-primary" style="width:100%" href="${isLast?'#/app/today':'#/app/onboarding/'+(n+1)}">
        ${isLast ? (LANG?'ចាប់ផ្តើមប្រើប្រាស់':'Get started') : (LANG?'បន្ត':'Next')} ${I.arrow}
      </a>
    </div>
  `;
  return appShell({tabs:false, back: n>1 ? '#/app/onboarding/'+(n-1) : undefined, title:'Mami Care', inner});
}
