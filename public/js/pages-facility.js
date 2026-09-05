/* Facility Portal (§6.2 of the Implementation Blueprint) — the
   midwife-facing surface, and the one the blueprint calls "adoption
   make-or-break". Hard constraint: median enrolment ≤ 90 seconds,
   on a shared, sometimes-offline device. This did not exist in the
   demo before; it is deliberately not styled like the citizen
   phone-frame — a work tool, not a consumer app. Every screen here
   is still simulated: there is no offline storage or real sync. */
import { I } from './icons.js';
import { LANG } from './i18n.js';
import { FACILITY_WORKLIST, FACILITY_NAME, CONSENT_TYPES } from './data.js';
import { facilityShell } from './components.js';

export function pageFacilityLogin(){
  return `
<section>
  <div class="wrap" style="max-width:420px">
    <div class="formcard" style="margin-top:2rem;text-align:center">
      <span style="display:inline-grid;place-items:center;width:56px;height:56px;border-radius:14px;
        background:var(--gov);color:var(--gov-ink);margin:0 auto 1rem">${I.shield}</span>
      <h1 style="font-size:1.35rem">${LANG?'ចូលកម្មវិធីមណ្ឌលសុខភាព':'Facility Portal sign-in'}</h1>
      <p class="small" style="margin-top:.6rem">${LANG
        ?`ឧបករណ៍នេះបានចុះឈ្មោះជាមួយ ${FACILITY_NAME}។`
        :`This device is registered to ${FACILITY_NAME}.`}</p>
      <button class="btn btn-primary" id="facSignIn" type="button" style="width:100%;margin-top:1.3rem">
        ${LANG?'បន្តជាបុគ្គលិកសុខាភិបាល':'Continue as health worker'} ${I.arrow}</button>
      <p class="small" style="margin-top:1rem">${LANG
        ?'សម្រាប់បុគ្គលិកមណ្ឌលសុខភាពដែលមានលិខិតបញ្ជាក់ប៉ុណ្ណោះ។'
        :'For credentialed facility staff only.'}</p>
    </div>
  </div>
</section>`;
}

export function pageFacilityToday(){
  const inner = `
    <p class="small" style="margin-bottom:1.1rem">${LANG
      ?'តារាងកិច្ចការថ្ងៃនេះ — មិនមែនទិន្នន័យគ្លីនិកទេ សញ្ញាសម្រាប់ការតាមដានប៉ុណ្ណោះ។'
      :'Today’s worklist — no clinical data, just signals to follow up on.'}</p>
    ${FACILITY_WORKLIST.map(w=>`
      <div class="fac-worklist-card ${w.tone}">
        <span>${LANG?w.kh:w.label}</span><b>${w.count}</b>
      </div>`).join('')}
    <a class="btn btn-primary" style="width:100%;margin-top:1.4rem" href="#/facility/enroll">
      ${I.check} ${LANG?'ចុះឈ្មោះអតិថិជន':'Enrol a client'}</a>
    <div class="cta-row" style="margin-top:.8rem">
      <a class="btn btn-ghost" style="flex:1" href="#/facility/sync">${LANG?'ស្ថានភាពសមកាលកម្ម':'Sync status'}</a>
      <a class="btn btn-ghost" style="flex:1" href="#/">${LANG?'ចាកចេញ':'Exit'}</a>
    </div>
  `;
  return facilityShell({title: LANG?'កិច្ចការថ្ងៃនេះ':'Today’s worklist', inner});
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
