/* Facility Portal (§6.2 of the Implementation Blueprint) — the
   midwife-facing surface, and the one the blueprint calls "adoption
   make-or-break". Hard constraint: median enrolment ≤ 90 seconds,
   on a shared, sometimes-offline device. This did not exist in the
   demo before; it is deliberately not styled like the citizen
   phone-frame — a work tool, not a consumer app. Every screen here
   is still simulated: there is no offline storage or real sync. */
import { I } from './icons.js';
import { LANG } from './i18n.js';
import {
  FACILITY_WORKLIST, FACILITY_NAME, FACILITY_CODE, FACILITY_STAFF_ROSTER, CONSENT_TYPES, DEMO_PROFILE,
  FACILITY_PROVISIONAL_SAMPLE, FACILITY_EDD_PASSED, FACILITY_MISSED, FACILITY_REFERRALS_OPEN,
  FACILITY_CLIENTS
} from './data.js';
import { facilityShell } from './components.js';
import { FACILITY_SESSION } from './facility-state.js';

/* A real device authenticates against an identity provider (§13 — buy,
   never build). What a shared clinic tablet actually looks like day to
   day is a short PIN per registered worker, not a typed email/password,
   since several people rotate through the same device in a shift. This
   demo checks the PIN for real against the roster (facilityStaffByPin
   in data.js) rather than letting any tap through. */
export function pageFacilityLogin(){
  return `
<section>
  <div class="wrap" style="max-width:420px">
    <div class="formcard" style="margin-top:2rem;text-align:center">
      <span style="display:inline-grid;place-items:center;width:56px;height:56px;border-radius:14px;
        background:var(--gov);color:var(--gov-ink);margin:0 auto 1rem">${I.shield}</span>
      <h1 style="font-size:1.35rem">${LANG?'ចូលកម្មវិធីមណ្ឌលសុខភាព':'Facility Portal sign-in'}</h1>
      <p class="small" style="margin-top:.6rem">${LANG
        ?`ឧបករណ៍នេះបានចុះឈ្មោះជាមួយ ${FACILITY_NAME}។ បញ្ចូលកូដសម្ងាត់បុគ្គលិករបស់អ្នក ដើម្បីបន្ត។`
        :`This device is registered to ${FACILITY_NAME}. Enter your staff PIN to continue.`}</p>
      <form id="facLoginForm" style="margin-top:1.3rem;text-align:left">
        <div class="field">
          <label for="facPin">${LANG?'កូដសម្ងាត់បុគ្គលិក':'Staff PIN'}</label>
          <input id="facPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4"
            placeholder="••••" autocomplete="off" autofocus style="text-align:center;letter-spacing:.4em;font-size:1.2rem">
        </div>
        <p id="facLoginError" class="small" style="color:var(--urgent);margin-top:.6rem" hidden>${LANG
          ?'សូមបញ្ចូលកូដសម្ងាត់ដើម្បីបន្ត។'
          :'Enter a PIN to continue.'}</p>
        <button class="btn btn-primary" type="submit" style="width:100%;margin-top:1rem">
          ${LANG?'ចូល':'Sign in'} ${I.arrow}</button>
      </form>
      <p class="small" style="margin-top:1.1rem">${LANG
        ?'សម្រាប់បុគ្គលិកមណ្ឌលសុខភាពដែលមានលិខិតបញ្ជាក់ប៉ុណ្ណោះ។'
        :'For credentialed facility staff only.'}</p>
      <p class="small" style="margin-top:.4rem;color:var(--muted)">${LANG
        ?'(សាកល្បង៖ បញ្ចូលលេខណាមួយ — គណនីមួយក្នុងចំណោមបុគ្គលិកដែលបានចុះឈ្មោះនឹងត្រូវជ្រើសរើសដោយចៃដន្យ)'
        :'(Demo: any PIN works — you’ll be signed in as one of the credentialed accounts registered to this device, picked at random.)'}</p>
    </div>
  </div>
</section>`;
}

/* Identifying a PIN and starting a shift are kept as two separate acts
   (§ note in facility-state.js) — this screen is the second one. It
   also surfaces the one thing that's supposed to have been fixed back
   at registration, not asked again now: which facility this account is
   for. If a colleague's PIN ends up here by mistake, this is the
   confirmation moment before the worklist opens under their name. */
export function pageFacilityShiftStart(){
  const staff = FACILITY_SESSION.staff;
  const initials = staff ? staff.name.split(' ').map(w=>w[0]).join('') : '';
  const inner = `
    <div class="stepbox" style="text-align:center">
      <span style="display:inline-grid;place-items:center;width:56px;height:56px;border-radius:99px;
        background:var(--brand-soft);color:var(--brand);margin:0 auto 1rem;font-size:1.2rem;font-weight:700">${initials}</span>
      <h2 style="font-size:1.15rem">${LANG?'ស្វាគមន៍ត្រឡប់មកវិញ':'Welcome back'}, ${staff?.name}</h2>
      <p class="small">${staff?.role} · ${staff?.id}</p>
    </div>
    <div class="stepbox" style="margin-top:1rem">
      <p><b>${LANG?'ចុះឈ្មោះនៅ':'Registered to'}:</b> ${staff?.facility}</p>
      <p class="small" style="margin-top:.6rem">${LANG
        ?'នេះជាការចាត់តាំងតាំងពីការចុះឈ្មោះគណនីរបស់អ្នក — មិនមែនអ្វីដែលអ្នកជ្រើសរើសឥឡូវនេះទេ។'
        :'Fixed when this account was registered — not something you choose now.'}</p>
    </div>
    <button class="btn btn-primary" id="facStartShift" style="width:100%;margin-top:1.3rem">
      ${LANG?'ចាប់ផ្តើមវេន':'Start shift'} ${I.arrow}</button>
    <a href="#/facility/login" class="btn btn-ghost" style="width:100%;margin-top:.6rem;display:block;text-align:center">
      ${LANG?'មិនមែនអ្នក?':'Not you?'}</a>
  `;
  return facilityShell({title: LANG?'ចាប់ផ្តើមវេន':'Start your shift', back:'#/facility/login', inner});
}

/* The one "current subscriber" this demo can actually mutate
   (DEMO_PROFILE) is folded into the sample provisional list as its
   first row, always — so the worklist reads as one real, connected
   list rather than a static screen plus a disconnected code box.
   `verified` reflects her live status, so verifying her here (or via
   the manual code-entry fallback) shows up the same way either way. */
export function facilityProvisionalRows(){
  const rows = FACILITY_PROVISIONAL_SAMPLE.slice();
  if(DEMO_PROFILE.code){
    rows.unshift({
      ref: DEMO_PROFILE.code,
      phoneMasked: DEMO_PROFILE.phoneMasked,
      stage: LANG ? DEMO_PROFILE.stageKh : DEMO_PROFILE.stageLabel,
      enrolledVia: LANG?'ចុះឈ្មោះដោយខ្លួនឯង':'Self-enrolment',
      daysWaiting: 0,
      verified: DEMO_PROFILE.status === 'verified',
      isYou: true
    });
  }
  return rows;
}
const FAC_LIST_BY_KEY = { edd_passed: FACILITY_EDD_PASSED, missed: FACILITY_MISSED, referrals_open: FACILITY_REFERRALS_OPEN };

/* Live counts for the Today worklist badges — derived from the same
   rows the list pages render, so the number on Today can never drift
   from what actually shows when you tap into it. */
export function facilityWorklistCount(key){
  if(key === 'provisional') return facilityProvisionalRows().filter(r=>!r.verified).length;
  const list = FAC_LIST_BY_KEY[key];
  return list ? list.filter(r=>!r.followedUp).length : 0;
}

export function pageFacilityToday(){
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${LANG
      ?'តារាងកិច្ចការថ្ងៃនេះ — មិនមែនទិន្នន័យគ្លីនិកទេ សញ្ញាសម្រាប់ការតាមដានប៉ុណ្ណោះ។ ចុចមួយណាដើម្បីមើលបញ្ជី។'
      :'Today’s worklist — no clinical data, just signals to follow up on. Tap any one to see who’s on it.'}</p>
    ${FACILITY_WORKLIST.map(w=>`
      <a class="fac-worklist-card ${w.tone}" href="#/facility/worklist/${w.key}">
        <span>${LANG?w.kh:w.label}</span><b>${facilityWorklistCount(w.key)}</b>
      </a>`).join('')}
    <a class="btn btn-primary" style="width:100%;margin-top:1.4rem" href="#/facility/enroll">
      ${I.check} ${LANG?'ចុះឈ្មោះអតិថិជន':'Enrol a client'}</a>
    <a class="btn btn-ghost" style="width:100%;margin-top:.6rem" href="#/facility/sync">${LANG?'ស្ថានភាពសមកាលកម្ម':'Sync status'}</a>
  `;
  return facilityShell({title: LANG?'កិច្ចការថ្ងៃនេះ':'Today’s worklist', active:'today', inner});
}

/* One list per worklist key. "Provisional" gets its own richer layout
   (a Verify button per row, right where the count on Today pointed);
   the other three share a lighter "mark followed up" pattern — the
   blueprint is explicit these are signals to chase, not a workflow to
   run in the tool itself. */
export function pageFacilityWorklist(key){
  if(key === 'provisional') return pageFacilityProvisionalList();
  const cfg = {
    edd_passed: {
      title: LANG?'ហួសកាលបរិច្ឆេទ គ្មានរបាយការណ៍':'EDD passed without a report',
      meta: r => `${r.stage} · ${LANG?`ហួសកាលបរិច្ឆេទ ${r.daysOverdue} ថ្ងៃ`:`${r.daysOverdue} day${r.daysOverdue===1?'':'s'} overdue`}`
    },
    missed: {
      title: LANG?'ខកខានការណាត់ជួប':'Missed appointments',
      meta: r => `${r.appointment} · ${LANG?`ខកខានកាលពី ${r.daysMissed} ថ្ងៃ`:`missed ${r.daysMissed} day${r.daysMissed===1?'':'s'} ago`}`
    },
    referrals_open: {
      title: LANG?'ការបញ្ជូនបន្តបើកលើសពី ៧ថ្ងៃ':'Referrals open more than 7 days',
      meta: r => `${r.reason} · ${LANG?`បើករយៈពេល ${r.daysOpen} ថ្ងៃ`:`open ${r.daysOpen} days`}`
    }
  }[key];
  const list = FAC_LIST_BY_KEY[key];
  if(!cfg || !list) return pageFacilityToday();

  const rows = list.map(r=>`
    <div class="fac-list-row${r.followedUp?' done':''}">
      <div><b>${r.phoneMasked}</b><div class="flr-meta">${cfg.meta(r)}</div></div>
      ${r.followedUp
        ? `<span class="pill pill-ok">${LANG?'បានតាមដាន':'Followed up'}</span>`
        : `<button class="btn btn-ghost btn-sm" data-followup="${key}:${r.ref}">${LANG?'សម្គាល់ថាបានតាមដាន':'Mark followed up'}</button>`}
    </div>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'សញ្ញាតាមដានប៉ុណ្ណោះ — មិនមែនកំណត់ត្រាគ្លីនិកទេ។'
      :'A signal to follow up on, not a clinical record or a workflow to run here.'}</p>
    ${rows || `<p class="small">${LANG?'គ្មានធាតុទេឥឡូវនេះ។':'Nothing here right now.'}</p>`}
  `;
  return facilityShell({title: cfg.title, back:'#/facility/today', inner});
}

function pageFacilityProvisionalList(){
  const rows = facilityProvisionalRows();
  const rowsHTML = rows.map(r=>`
    <div class="fac-list-row${r.verified?' done':''}">
      <div><b>${r.phoneMasked}</b>${r.isYou?` <span class="pill pill-brand">${LANG?'ប្រវត្តិរូបសាកល្បង':'this demo’s profile'}</span>`:''}
        <div class="flr-meta">${r.stage} · ${r.enrolledVia} · ${LANG?`រង់ចាំ ${r.daysWaiting} ថ្ងៃ`:r.daysWaiting===0?'just now':`waiting ${r.daysWaiting} day${r.daysWaiting===1?'':'s'}`}</div></div>
      ${r.verified
        ? `<span class="pill pill-ok">${LANG?'បានផ្ទៀងផ្ទាត់':'Verified'}</span>`
        : `<button class="btn btn-primary btn-sm" data-verify-row="${r.ref}">${LANG?'ផ្ទៀងផ្ទាត់':'Verify'}</button>`}
    </div>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?'ផ្ទៀងផ្ទាត់ផ្ទាល់ពីបញ្ជីនេះ ពេលនាងនៅចំពោះមុខអ្នក — គ្មានការវាយបញ្ចូលកូដដោយខ្លួនឯងទេ លុះត្រាតែចាំបាច់។'
      :'Verify straight from this list while she’s standing in front of you — no need to type a code unless you have to.'}</p>
    ${rowsHTML || `<p class="small">${LANG?'គ្មានធាតុទេឥឡូវនេះ។':'Nothing waiting right now.'}</p>`}
    <p class="small" style="margin-top:1.4rem">${LANG
      ?'រកមិនឃើញនាងទេ? នាងអាចនឹងទើបតែចុះឈ្មោះ ឬចុះឈ្មោះនៅមណ្ឌលផ្សេង។'
      :'Can’t find her here? She may have just enrolled, or done so through a different facility.'}
      <a href="#/facility/verify" style="color:var(--brand);font-weight:600">${LANG?'បញ្ចូលកូដដោយផ្ទាល់':'Enter her code directly'} ${I.arrow}</a></p>
  `;
  return facilityShell({title: LANG?'បណ្តោះអាសន្ន រង់ចាំផ្ទៀងផ្ទាត់':'Provisional, awaiting verification', back:'#/facility/today', inner});
}

/* One screen, not a click-through wizard: the blueprint's own point
   is that only two fields are typed and everything else is defaulted
   or a toggle — a single screen is the faster, more honest shape for
   a 90-second target than five separate steps would be. */
export function pageFacilityEnroll(){
  const rows = CONSENT_TYPES.map(c=>`
    <label class="cons">
      <input type="checkbox" data-fac-consent="${c.key}">
      <span><b>${LANG?c.kh:c.name}${c.required?(LANG?' · ចាំបាច់':' · required'):''}</b><span>${c.desc}</span></span>
    </label>`).join('');
  const inner = `
    <div class="fac-timer" id="facTimer">
      <div class="tval" id="facTimerVal">0s</div>
      <div class="tlabel">${LANG?'វិនាទីកន្លងទៅ · គោលដៅ ៩០វិនាទី':'elapsed · target 90 seconds'}</div>
    </div>
    <form id="facEnrollForm" style="display:flex;flex-direction:column;gap:1.1rem">
      <div class="field"><label for="facPhone">${LANG?'លេខទូរស័ព្ទ':'Mobile number'}</label>
        <input id="facPhone" type="tel" inputmode="tel" placeholder="0XX XXX XXX" required autofocus></div>
      <div class="field full">
        <label>${LANG?'កាលបរិច្ឆេទនេះសម្រាប់អ្វី?':'What is this date for?'}</label>
        <div class="segs" data-group="fac-datekind">
          <button type="button" class="seg" data-v="edd" aria-pressed="true">${LANG?'ថ្ងៃកំណត់សម្រាល':'Expected due date'}</button>
          <button type="button" class="seg" data-v="dob" aria-pressed="false">${LANG?'ថ្ងៃកំណើតកូន':'Child’s birthday'}</button>
        </div>
      </div>
      <div class="field"><label for="facDate">${LANG?'កាលបរិច្ឆេទ':'Date'}</label><input id="facDate" type="date" required></div>
      <div class="field full">
        <label>${LANG?'ស្គ្រីបការយល់ព្រម — សូមអានឱ្យខ្លាំង':'Consent script — read aloud'}</label>
        <div class="consents">${rows}</div>
      </div>
      <label class="cons">
        <input type="checkbox" id="facAttest">
        <span><b>${LANG?'ខ្ញុំបានអានស្គ្រីបនេះឱ្យអតិថិជនស្តាប់ជាភាសាខ្មែរ':'I read this script aloud to the client, in Khmer'}</b>
          <span>${LANG?'ការចុះឈ្មោះមិនអាចបញ្ចប់បានទេ បើគ្មានការបញ្ជាក់នេះ។':'Enrolment cannot be completed without this attestation.'}</span></span>
      </label>
      <p id="facError" class="small" style="color:var(--urgent)" hidden>${LANG?'ត្រូវការការយល់ព្រម ការណែនាំសុខភាព និងការបញ្ជាក់របស់អ្នក។':'Health guidance consent and your attestation are both required.'}</p>
      <button class="btn btn-primary" type="submit" style="width:100%">${LANG?'បញ្ចប់ការចុះឈ្មោះ':'Complete enrolment'}</button>
    </form>
    <div id="facEnrollOk" hidden></div>
  `;
  return facilityShell({title: LANG?'ចុះឈ្មោះលឿន':'Fast enrolment', back:'#/facility/today', inner});
}

/* Verify a provisional enrolment (§6.2 "Must exist" — QR / reference
   code, masked data before verification). Kept as the manual fallback
   for whoever isn't in today's cached list; the list itself (above) is
   the primary path now. Only masked data is ever shown before the
   midwife commits — never a full phone number, never a name. */
export function pageFacilityVerify(){
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${LANG
      ?'សម្រាប់អ្នកមិននៅក្នុងបញ្ជីថ្ងៃនេះ — សុំកូដយោង (បង្ហាញនៅលើកម្មវិធីរបស់អតិថិជន ពេលចុះឈ្មោះ) រួចផ្ទៀងផ្ទាត់នៅទីនេះ។'
      :'For anyone not showing up in today’s list — ask for the reference code shown on her app when she enrolled, then confirm it here.'}</p>
    <form id="facVerifyForm" style="display:flex;gap:.6rem;align-items:end;flex-wrap:wrap">
      <div class="field" style="flex:1 1 200px"><label for="facVerifyCode">${LANG?'កូដយោង':'Reference code'}</label>
        <input id="facVerifyCode" type="text" placeholder="MC-XXXX" autocapitalize="characters" autofocus></div>
      <button class="btn btn-primary" type="submit">${LANG?'ស្វែងរក':'Look up'}</button>
    </form>
    <div id="facVerifyResult" style="margin-top:1.3rem"></div>
  `;
  return facilityShell({title: LANG?'បញ្ចូលកូដដោយផ្ទាល់':'Enter a code directly', back:'#/facility/worklist/provisional', inner});
}

/* Pure lookup — this demo has exactly one "current subscriber"
   (DEMO_PROFILE) standing in for whatever the real facility master
   would query by code. Returns null on no-match so the caller can show
   a clear miss rather than silently doing nothing. */
export function facilityLookupByCode(code){
  const c = (code||'').trim().toUpperCase();
  if(!c || c !== (DEMO_PROFILE.code||'').toUpperCase()) return null;
  return DEMO_PROFILE;
}
export function facilityConfirmVerification(){
  DEMO_PROFILE.status = 'verified';
  DEMO_PROFILE.facility = FACILITY_NAME;
}
/* Verify a specific row straight from a worklist list — "you" (the
   demo's live profile) goes through the real status flip so the
   citizen side updates too; any other sample row just flips its own
   local `verified` flag, since there's no second live profile behind
   it to update. */
export function facilityVerifyRow(ref){
  if(DEMO_PROFILE.code && ref === DEMO_PROFILE.code){
    facilityConfirmVerification();
    return;
  }
  const row = FACILITY_PROVISIONAL_SAMPLE.find(r=>r.ref===ref);
  if(row) row.verified = true;
}
export function facilityMarkFollowedUp(key, ref){
  const list = FAC_LIST_BY_KEY[key];
  const row = list && list.find(r=>r.ref===ref);
  if(row) row.followedUp = true;
}

export function pageFacilitySync(){
  const inner = `
    <div class="stepbox" style="margin-bottom:1.2rem">
      <h3>${LANG?'ស្ថានភាពសមកាលកម្មក្រៅបណ្តាញ':'Offline sync status'}</h3>
      <p class="small" style="margin-top:.3rem">${LANG
        ?'ធាតុដែលបានចុះឈ្មោះនៅពេលគ្មានសញ្ញា ត្រូវបានផ្ទុកទុកនៅលើឧបករណ៍ រហូតដល់មានសញ្ញាថ្មី។'
        :'Items enrolled while offline stay queued on this device until a connection is back.'}</p>
    </div>
    <div id="facQueueList" style="display:flex;flex-direction:column;gap:.6rem">
      <div class="ccard"><span class="playdot" style="color:var(--warn)">${I.stop}</span>
        <span class="cbody"><b>012 xxx x77</b><span class="small">${LANG?'រង់ចាំសមកាលកម្ម · បានចុះឈ្មោះម៉ោង ១០:៤២ព្រឹក':'Queued · enrolled 10:42am'}</span></span></div>
      <div class="ccard"><span class="playdot" style="color:var(--warn)">${I.stop}</span>
        <span class="cbody"><b>098 xxx x21</b><span class="small">${LANG?'រង់ចាំសមកាលកម្ម · បានចុះឈ្មោះម៉ោង ១១:០៥ព្រឹក':'Queued · enrolled 11:05am'}</span></span></div>
    </div>
    <button class="btn btn-primary" id="facSyncNow" style="width:100%;margin-top:1.2rem">${LANG?'សមកាលកម្មឥឡូវនេះ':'Sync now'}</button>
    <div id="facSyncOk" hidden style="margin-top:1rem">
      <div class="okpanel"><span style="color:var(--ok)">${I.check}</span>
        <div><h3>${LANG?'បានធ្វើសមកាលកម្មរួចរាល់':'Synced'}</h3>
        <p>${LANG?'ធាតុទាំង ២ បានផ្ញើទៅស្នូលកណ្តាល។ គ្មានការចម្លងស្ទួនទេ។':'Both items sent to core. No duplicates created.'}</p></div></div>
    </div>
  `;
  return facilityShell({title: LANG?'សមកាលកម្ម':'Sync', back:'#/facility/today', inner});
}

/* "History" — clients already enrolled at this facility. Read-only,
   masked, no unmask control: a shared clinic device gets less access
   than a programme admin, not the same access. */
export function pageFacilityClients(){
  const tone = v => v==='verified' || v==='active' ? 'ok' : v==='paused' ? 'warn' : '';
  const rows = FACILITY_CLIENTS.map(c=>`
    <div class="fac-list-row">
      <div><b>${c.phoneMasked}</b><div class="flr-meta">${c.stage} · ${LANG?'បានចុះឈ្មោះ':'enrolled'} ${c.enrolled}</div></div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;justify-content:flex-end">
        <span class="pill${tone(c.verification)?' pill-'+tone(c.verification):''}">${c.verification}</span>
        <span class="pill${tone(c.consent)?' pill-'+tone(c.consent):''}">${c.consent}</span>
      </div>
    </div>`).join('');
  const inner = `
    <p class="small" style="margin-bottom:1rem">${LANG
      ?`អតិថិជនដែលបានចុះឈ្មោះនៅ ${FACILITY_NAME}។ ទិន្នន័យលាក់ប៉ុណ្ណោះ — គ្មានឈ្មោះ គ្មានលេខទូរស័ព្ទពេញលេញ សូម្បីតែនៅទីនេះ។`
      :`Clients enrolled at ${FACILITY_NAME}. Masked data only — no names, no full phone numbers, even here.`}</p>
    ${rows || `<p class="small">${LANG?'គ្មានធាតុទេ':'Nothing here yet.'}</p>`}
  `;
  return facilityShell({title: LANG?'អតិថិជន':'Clients', active:'clients', inner});
}

/* The credentialed person actually holding the device — a shared
   clinic tablet is still always signed in as someone specific. */
function formatClock(d){
  if(!d) return '—';
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export function pageFacilityProfile(){
  const staff = FACILITY_SESSION.staff || {};
  const initials = (staff.name||'').split(' ').map(w=>w[0]).join('');
  const inner = `
    <div class="stepbox" style="text-align:center">
      <span style="display:inline-grid;place-items:center;width:56px;height:56px;border-radius:99px;
        background:var(--brand-soft);color:var(--brand);margin:0 auto 1rem;font-size:1.2rem;font-weight:700">${initials}</span>
      <h2 style="font-size:1.15rem">${staff.name}</h2>
      <p class="small">${staff.role} · ${staff.id}</p>
    </div>
    <div class="stepbox" style="margin-top:1rem">
      <p><b>${LANG?'ចុះឈ្មោះនៅ':'Registered to'}:</b> ${staff.facility}</p>
      <p style="margin-top:.4rem"><b>${LANG?'លេខកូដមណ្ឌល':'Facility code'}:</b> ${FACILITY_CODE}</p>
      <p style="margin-top:.4rem"><b>${LANG?'ចាប់ផ្តើមវេនម៉ោង':'Shift started'}:</b> ${formatClock(FACILITY_SESSION.shiftStartedAt)}</p>
      <p class="small" style="margin-top:.8rem">${LANG
        ?'ការចូលប្រើនៅទីនេះគឺជាការសាកល្បង សម្រាប់សម័យនេះប៉ុណ្ណោះ។'
        :'Sign-in here is simulated, for this browser session only.'}</p>
    </div>
    <button class="btn btn-ghost" id="facSignOut" style="width:100%;margin-top:1.3rem">${LANG?'បញ្ចប់វេន':'End shift'}</button>
  `;
  return facilityShell({title: LANG?'ប្រវត្តិរូប':'Profile', active:'profile', inner});
}
