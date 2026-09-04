/* Page renderers — one function per route, returning an HTML string that
   the router drops into #app. */
import { I } from './icons.js';
import { LANG, t, khNote } from './i18n.js';
import { SERVICES, AUDIENCES, FAQ_GROUPS, NEWS, SC, svc, aud, news, PROVINCES, publicFacilities, HELPLINE_NUMBER } from './data.js';
import { tile, audTile, journeyWidget, newsCard, newsFeat, ctaBand } from './components.js';

/* ============ pages ============ */
export function pageHome(){return `
<section class="hero">
  <div class="hero-deco" aria-hidden="true">
    <span class="dots"></span>
    <svg class="r1" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.4">
      <circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="76"/><circle cx="100" cy="100" r="54"/><circle cx="100" cy="100" r="32"/>
    </svg>
    <svg class="r2" viewBox="0 0 160 120" fill="currentColor">
      <path d="M80 112c-30 0-50-16-50-30 12-7 24-4 32 3 7 6 13 14 18 27z" opacity=".5"/>
      <path d="M80 112c30 0 50-16 50-30-12-7-24-4-32 3-7 6-13 14-18 27z" opacity=".5"/>
      <path d="M80 112c-16-13-25-29-25-42 0-14 9-25 25-34 16 9 25 20 25 34 0 13-9 29-25 42z"/>
    </svg>
  </div>
  <div class="wrap grid">
    <div>
      <span class="hero-badge"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span class="kmb">ឥតគិតថ្លៃ</span> · ${t('hero_badge')}</span>
      <p class="kh${LANG?'':' km'}">${t('hero_kicker')}</p>
      <h1${LANG?' class="km"':''}>${LANG?'ការថែទាំដែលដើរតាមអ្នក ចាប់ពីមានផ្ទៃពោះ រហូតដល់កូនអាយុ ២ ឆ្នាំ។':'Care that follows her, from pregnancy to her child’s <em>second birthday.</em>'}</h1>
      <p class="lede${LANG?' km':''}">${t('hero_lede')}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#/app/join">${t('join')} ${I.arrow}</a>
        <a class="btn btn-ghost" href="#/services">${t('hero_cta2')}</a>
      </div>
      <div class="pill-row${LANG?' km':''}">
        <span>${I.check} ${t('pill1')}</span><span>${I.check} ${t('pill2')}</span><span>${I.check} ${t('pill3')}</span>
      </div>
    </div>
    <div class="art">
      <figure class="heroshot">
        <img src="assets/hero-mother-baby.png" alt="A mother holding her baby while reading a Mami Care message on her phone." fetchpriority="high" decoding="async">
      </figure>
      <div class="phone" aria-label="Example messages">
        <div class="bar"><span>MAMI CARE</span><span>08:12</span></div>
        <div class="thread">
          <div class="bubble"><span class="km">ផ្ទៃពោះ ២៨ សប្តាហ៍៖ សូមរៀបចំផែនការសម្រាល។</span><span class="en">28 weeks: time to make your birth plan.</span></div>
          <div class="bubble voice"><span class="wave" aria-hidden="true"><i style="height:5px"></i><i style="height:11px"></i><i style="height:16px"></i><i style="height:9px"></i><i style="height:14px"></i><i style="height:6px"></i></span><span>Khmer voice · 0:45</span></div>
          <div class="bubble sys">Reply ឈប់ / STOP any time</div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="krama"></div>

<section>
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">${t('eb_start')}</p><h2>${t('h_iam')}</h2><p>${t('p_iam')}</p></div>
    <div class="grid-c c4">${AUDIENCES.map(audTile).join('')}</div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">${t('eb_services')}</p><h2>${t('h_services')}</h2><p>${t('p_services')}</p></div>
    <div class="grid-c c3">${SERVICES.map(tile).join('')}</div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">${t('eb_how')}</p>
      <h2>${t('h_how')}</h2>
      <p>${t('p_how')}</p></div>
    <div class="flow">
      ${[1,2,3,4,5].map(i=>`<div class="fstep f${i}"><span class="fn">${i}</span><h3>${t('f'+i+'t')}</h3><p>${t('f'+i+'p')}</p><span class="tail">${t('f'+i+'s')}</span></div>`).join('')}
    </div>
    <div class="callout" style="margin-top:1.6rem"><p>${t('how_note')}</p></div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">${t('eb_journey')}</p><h2>${t('h_journey')}</h2><p>${t('p_journey')}</p></div>
    ${journeyWidget()}
  </div>
</section>

<div class="krama rose"></div>

<section>
  <div class="wrap">
    <div class="news-head">
      <span class="t"><span class="eyebrow">${t('eb_news')}</span>
        <h2 style="font-size:clamp(1.6rem,3.4vw,2.3rem)">${t('h_news')}</h2></span>
      <a class="btn btn-ghost btn-sm" href="#/news">${t('all_news')} ${I.arrow}</a>
    </div>
    ${newsFeat(NEWS[0])}
    <div class="grid-c c3" style="margin-top:1.1rem">${NEWS.slice(1,4).map(newsCard).join('')}</div>
  </div>
</section>

<section class="band">
  <div class="wrap split">
    <div>
      <div class="sec-head" style="margin-bottom:1rem"><p class="eyebrow">${t('eb_choices')}</p><h2>${t('h_choices')}</h2></div>
      <div>
        ${[[I.shield,'c1'],[I.moon,'c2'],[I.free,'c3'],[I.stop,'c4'],[I.lock,'c5'],[I.heart,'c6']]
          .map(c=>`<div class="choice"><span class="ci">${c[0]}</span><div><h3>${t(c[1]+'t')}</h3><p>${t(c[1]+'p')}</p></div></div>`).join('')}
      </div>
      <a class="btn btn-ghost" style="margin-top:1.3rem" href="#/privacy">${t('full_promise')}</a>
    </div>
    <div>
      <div class="sec-head" style="margin-bottom:1rem"><p class="eyebrow">${t('eb_reach')}</p><h2>${t('h_reach')}</h2></div>
      <div style="display:flex;flex-direction:column;gap:.7rem">
        ${[[I.sms,t('ch1'),t('ch1p')],[I.voice,t('ch2'),t('ch2p')],[I.app,t('ch3'),t('ch3p')],[I.qr,t('ch4'),t('ch4p')]]
          .map(c=>`<div style="display:grid;grid-template-columns:auto 1fr;gap:.8rem;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:.9rem 1rem">
            <span style="color:var(--brand);display:grid;place-items:center">${c[0]}</span>
            <span><b style="font-size:.95rem">${c[1]}</b><br><span class="small">${c[2]}</span></span></div>`).join('')}
      </div>
      <div class="callout"><p>${t('share_note')}</p></div>
    </div>
  </div>
</section>

${ctaBand()}`;}


export function pageServices(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Services</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">Services</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem)">${t('h_svc_page')}</h2>
      <p>${t('p_svc_page')}</p></div>
    <div class="grid-c c3">${SERVICES.map(tile).join('')}</div>
  </div>
</section>
${ctaBand()}`;}


export function pageWho(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Who it's for</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">Who it's for</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem)">${t('h_who_page')}</h2>
      <p>${t('p_who_page')}</p></div>
    <div class="grid-c c2">${AUDIENCES.map(audTile).join('')}</div>
  </div>
</section>
${ctaBand()}`;}


export function pageJourney(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Your journey</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">Your journey</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem)">${t('h_jr_page')}</h2>
      <p>${t('p_jr_page')}</p></div>
    ${journeyWidget()}
    <div class="callout" style="margin-top:1.6rem"><p><strong>You never have to update it manually.</strong> Your stage moves on its own from your due date or your child’s birthday. If something changes — a birth, a loss, or a break you need — one message to us is enough.</p></div>
  </div>
</section>
${ctaBand()}`;}


export function detailPage(item, kind){
  const rel = kind==='service' ? (item.aud||[]).map(aud).filter(Boolean) : (item.svc||[]).map(svc).filter(Boolean);
  const relTitle = kind==='service' ? 'Who this is for' : 'Services you would use';
  const back = kind==='service' ? ['#/services','Services'] : ['#/who',"Who it's for"];
  return `
<section style="padding-bottom:0">
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <a href="${back[0]}">${back[1]}</a> ${I.sep} <span>${item.name}</span></p>
    <div class="dhero">
      <div>
        <p class="kh km">${item.kh}</p>
        <h1>${item.name}</h1>
        <p>${item.lede}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${item.cta.route}">${item.cta.label} ${I.arrow}</a>
          ${item.cta2?`<a class="btn btn-ghost" href="${item.cta2.route}">${item.cta2.label}</a>`:''}
        </div>
      </div>
      <div class="dart" style="color:${kind==='service'?'var(--brand)':'var(--accent)'}">${item.icon}</div>
    </div>
  </div>
</section>

<div class="krama"></div>

<section>
  <div class="wrap split">
    <div>
      <h2 style="font-size:1.5rem;margin-bottom:1rem">What you get</h2>
      <ul class="plist">${item.what.map(w=>`<li>${I.check}<span>${w}</span></li>`).join('')}</ul>
      <div class="callout"><p>${item.note}</p></div>
    </div>
    <div>
      <div class="stepbox"><h3>How it works</h3><ol>${item.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol>
        <a class="btn btn-primary" style="width:100%;margin-top:1.2rem" href="${item.cta.route}">${item.cta.label}</a>
        <p class="small" style="text-align:center;margin-top:.7rem">Free · takes about 2 minutes</p>
      </div>
      <p class="eyebrow" style="margin-top:1.6rem;display:block">${relTitle}</p>
      <div class="chips">${rel.map(r=>`<a class="chip" href="#/${kind==='service'?'who':'services'}/${r.slug}">${r.name}</a>`).join('')}</div>
    </div>
  </div>
</section>
${ctaBand()}`;}


export function pageNews(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>News</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">News</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem)">${t('h_news_page')}</h2>
      <p>${t('p_news_page')}</p>${khNote()}</div>
    ${newsFeat(NEWS[0])}
    <div class="grid-c c3" style="margin-top:1.1rem">${NEWS.slice(1).map(newsCard).join('')}</div>
  </div>
</section>
${ctaBand()}`;}


export function pageArticle(n){
  const others = NEWS.filter(x=>x.slug!==n.slug).slice(0,3);
  return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <a href="#/news">News</a> ${I.sep} <span>${n.cat}</span></p>
    <div style="max-width:820px;margin-top:1rem">
      <span class="news-meta" style="margin-bottom:.8rem"><span class="cat">${n.cat}</span><span>·</span><span>${n.date}</span></span>
      <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);margin:.5rem 0 1.4rem">${n.title}</h1>${khNote()}
    </div>
    <div class="news-hero"><span class="ph">${SC[n.img]}</span></div>
    <div class="split" style="align-items:start">
      <div class="article">${n.body.map(p=>`<p>${p}</p>`).join('')}</div>
      <div>
        <div class="stepbox"><h3>Join the service</h3>
          <ol>
            <li><span><b>Ask a midwife</b><br><span class="small">At your next antenatal or child visit.</span></span></li>
            <li><span><b>Scan the poster</b><br><span class="small">At your health centre.</span></span></li>
            <li><span><b>Send one text</b><br><span class="small">To the Mami Care short code.</span></span></li>
          </ol>
          <a class="btn btn-primary" style="width:100%;margin-top:1.2rem" href="#/app/join">Join free</a>
        </div>
      </div>
    </div>
    <p class="eyebrow" style="margin:2.4rem 0 1rem;display:block">More news</p>
    <div class="grid-c c3">${others.map(newsCard).join('')}</div>
  </div>
</section>
${ctaBand()}`;}


export function pageFaq(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Common questions</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">Common questions</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem)">${t('h_faq_page')}</h2>
      <p>${t('p_faq_page')}</p>${khNote()}</div>
    <div class="split" style="align-items:start">
      <div>
        ${FAQ_GROUPS.map(g=>`<h3 style="font-size:1.15rem;margin:1.8rem 0 .8rem">${g[0]}</h3>
          ${g[1].map(q=>`<details class="faq"><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('')}`).join('')}
      </div>
      <div>
        <div class="stepbox"><h3>Still stuck?</h3>
          <ol>
            <li><span><b>Reply to any message</b><br><span class="small">Send your question in Khmer.</span></span></li>
            <li><span><b>Call the free helpline</b><br><span class="small">07:00–19:00, seven days a week.</span></span></li>
            <li><span><b>Ask at your health centre</b><br><span class="small">Any midwife can look up your enrolment.</span></span></li>
          </ol>
          <a class="btn btn-primary" style="width:100%;margin-top:1.2rem" href="#/help">Contact the helpdesk</a>
        </div>
        <div class="callout" style="border-left-color:var(--urgent)"><p><strong>This is not an emergency service.</strong> Heavy bleeding, severe pain, fever, fits or trouble breathing — go to your nearest health centre now.</p></div>
      </div>
    </div>
  </div>
</section>
${ctaBand()}`;}


export function pageAbout(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>About us</span></p>
    <div class="sec-head" style="margin-top:1rem;max-width:56ch"><p class="eyebrow">About us</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.8rem)">${t('h_about_page')}</h2>
      <p>${t('p_about_page')}</p>${khNote()}</div>

    <div class="split">
      <div>
        <h3 style="font-size:1.35rem;margin-bottom:.8rem">Why it exists</h3>
        <p style="color:var(--ink-2)">Most women in Cambodia reach a health centre at least once. What often breaks down is everything between the visits — knowing when to come back, what is normal, what is a warning sign, and who to ask at ten o'clock at night.</p>
        <p style="color:var(--ink-2);margin-top:.8rem">Mami Care fills that gap. It follows one mother through one continuous journey, from her first antenatal visit to her child's second birthday, and brings her back to a midwife whenever she needs one.</p>

        <h3 style="font-size:1.35rem;margin:2rem 0 .8rem">What we do, and what we do not</h3>
        <div class="grid-c c2">
          <div style="background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;padding:1.15rem">
            <p class="eyebrow" style="color:var(--accent);display:block;margin-bottom:.6rem">We do</p>
            <ul class="plist">
              <li>${I.check}<span>Send guidance and reminders timed to your stage</span></li>
              <li>${I.check}<span>Answer your questions, in Khmer, at any hour</span></li>
              <li>${I.check}<span>Point you to the right facility and tell them you are coming</span></li>
              <li>${I.check}<span>Check that a referral was completed and closed</span></li>
            </ul>
          </div>
          <div style="background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--muted);border-radius:12px;padding:1.15rem">
            <p class="eyebrow" style="color:var(--muted);display:block;margin-bottom:.6rem">We do not</p>
            <ul class="plist" style="color:var(--muted)">
              <li>${I.dot}<span>Replace your antenatal book or your clinic file</span></li>
              <li>${I.dot}<span>Diagnose you, prescribe anything, or grade your risk</span></li>
              <li>${I.dot}<span>Contact you without your permission</span></li>
              <li>${I.dot}<span>Handle emergencies — that is your health centre</span></li>
            </ul>
          </div>
        </div>

        <h3 style="font-size:1.35rem;margin:2rem 0 .8rem">What we promise</h3>
        <div class="choice"><span class="ci">${I.shield}</span><div><h3>Consent first, always</h3><p>Nothing reaches you until you have said yes, and every permission can be taken back on its own.</p></div></div>
        <div class="choice"><span class="ci">${I.heart}</span><div><h3>Care in the hardest moments</h3><p>After a loss, everything stops within a minute and nothing celebratory can ever reach you again.</p></div></div>
        <div class="choice"><span class="ci">${I.free}</span><div><h3>Free, for everyone</h3><p>No charge on any network, on any handset, in every province.</p></div></div>
      </div>

      <div>
        <div class="stepbox"><h3>Who is behind it</h3>
          <ol>
            <li><span style="display:flex;gap:.8rem;align-items:flex-start"><img src="assets/emblem-mowa-lg.png" alt="Emblem of the Ministry of Women’s Affairs, Kingdom of Cambodia" style="width:62px;height:auto;flex:0 0 auto;margin-top:.1rem"><span><b>Ministry of Women's Affairs</b><br><span class="small">Programme owner, and guardian of the promises we make to women.</span></span></span></li>
            <li><span><b>Ministry of Health</b><br><span class="small">Approves every piece of health guidance we send.</span></span></li>
            <li><span><b>Health centres and referral hospitals</b><br><span class="small">Where care actually happens. They hold your medical record.</span></span></li>
            <li><span><b>Midwives and community volunteers</b><br><span class="small">They enrol you, and follow you up in person.</span></span></li>
          </ol>
        </div>
        <div class="callout"><p><strong>Reaching every province.</strong> Mami Care is rolled out together with health centres across the country, starting with pilot operational districts and expanding province by province.</p></div>
        <div class="callout"><p><strong>Questions about the programme?</strong> <a href="#/help" style="color:var(--brand);font-weight:600">Contact us ${I.arrow}</a></p></div>
      </div>
    </div>
  </div>
</section>
${ctaBand()}`;}


/* ============ facility search — public, no account needed ============
   Searchable by name/area/province rather than GPS: precise location is
   never collected or stored (privacy rule), so this is a directory, not
   a live map. Each card links out to a map by place name for directions,
   and only ever shows the fields safe for the public (no enrolment or
   referral-volume figures — those never appear outside the CMS). */
function facilityCard(f){
  const mapsQuery = encodeURIComponent(`${f.name}, ${f.area}, ${f.province}, Cambodia`);
  return `<div class="fac-card" data-province="${f.province}" data-type="${f.type}">
    <div class="fac-head"><span class="ci" style="background:var(--accent-soft);color:var(--accent)">${I.pin}</span>
      <div><h3 style="font-size:1rem">${f.name}</h3><span class="small">${f.type} · ${f.area}, ${f.province}</span></div></div>
    <div class="chips" style="margin-top:.7rem">${f.services.map(s=>`<span class="chip" style="cursor:default">${s}</span>`).join('')}</div>
    <p class="small" style="margin-top:.7rem">${I.clock} ${f.hours}</p>
    <div class="cta-row" style="margin-top:.8rem">
      <a class="btn btn-ghost btn-sm" href="tel:${f.phone.replace(/\s+/g,'')}">${I.phone} ${f.phone}</a>
      <a class="btn btn-ghost btn-sm" href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" rel="noopener">${I.pin} ${LANG?'បើកក្នុងផែនទី':'Open in Maps'} ↗</a>
    </div>
  </div>`;
}
export function pageFacilities(){
  const all = publicFacilities();
  return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Find a health centre</span></p>
    <div class="sec-head" style="margin-top:1rem"><p class="eyebrow">${LANG?'ស្វែងរកសេវាថែទាំ':'Find care near you'}</p>
      <h2 style="font-size:clamp(1.8rem,4vw,2.5rem)">${LANG?'ស្វែងរកមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យបញ្ជូនបន្ត។':'Search for a health centre or referral hospital.'}</h2>
      <p>${LANG?'យើងមិនប្រើទីតាំង GPS ត្រឹមត្រូវទេ — ស្វែងរកតាមខេត្ត ឬឈ្មោះ ហើយបើកក្នុងផែនទីសម្រាប់ទិសដៅ។'
        :'We never store your precise location — search by province or name, then open a result in Maps for directions.'}</p></div>
    <div class="cms-filters" style="margin-bottom:1.4rem">
      <select id="facProvince" style="font:inherit;font-size:.86rem;padding:.5rem .8rem;border-radius:8px;border:1.5px solid var(--line);background:var(--surface)">
        <option value="">${LANG?'គ្រប់ខេត្ត':'All provinces'}</option>
        ${PROVINCES.map(p=>`<option value="${p}">${p}</option>`).join('')}
      </select>
      <div class="segs" data-group="fac-type">
        <button type="button" class="seg" data-v="" aria-pressed="true">${LANG?'ទាំងអស់':'All types'}</button>
        <button type="button" class="seg" data-v="Health Centre" aria-pressed="false">${LANG?'មណ្ឌលសុខភាព':'Health Centre'}</button>
        <button type="button" class="seg" data-v="Referral Hospital" aria-pressed="false">${LANG?'មន្ទីរពេទ្យបញ្ជូនបន្ត':'Referral Hospital'}</button>
      </div>
    </div>
    <div id="facResults" class="grid-c c2">${all.map(facilityCard).join('')}</div>
    <p id="facEmpty" class="small" hidden style="margin-top:1rem">${LANG?'រកមិនឃើញមណ្ឌលសុខភាពដែលត្រូវនឹងលក្ខខណ្ឌនេះទេ។ សូមទាក់ទងខ្សែជំនួយ។':'No facilities match that search. Try the free helpline instead.'}</p>
    <div class="callout" style="margin-top:1.6rem"><p>${LANG?'រកមិនឃើញនៅទីនេះ?':'Can’t find it here?'} <a href="tel:${HELPLINE_NUMBER.replace(/\s+/g,'')}" style="color:var(--brand);font-weight:600">${LANG?'ហៅខ្សែជំនួយឥតគិតថ្លៃ':'Call the free helpline'}</a> ${LANG?`(${HELPLINE_NUMBER})`:`(${HELPLINE_NUMBER})`}</p></div>
  </div>
</section>
${ctaBand()}`;
}

export function pageHelp(){
  const faqs=FAQ_GROUPS[1][1].slice(0,3).concat(FAQ_GROUPS[2][1].slice(0,2),FAQ_GROUPS[3][1].slice(1,2));
  return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Help</span></p>
    <div class="split" style="margin-top:1.2rem;align-items:start">
      <div>
        <div class="sec-head"><p class="eyebrow">Help</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem)">How to reach us.</h2><p>Most things can be sorted out in one message or one call.</p></div>
        ${faqs.map(f=>`<details class="faq"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}
        <a class="btn btn-ghost" style="margin-top:1.1rem" href="#/faq">See all questions ${I.arrow}</a>
      </div>
      <div>
        <div class="stepbox"><h3>Talk to us</h3>
          <ol>
            <li><span><b>Reply to any message</b><br><span class="small">Send your question in Khmer. Most get an answer straight away.</span></span></li>
            <li><span><b>Call the free helpline</b><br><span class="small">Open 07:00–19:00, seven days. The toll-free number is sent to you when you join.</span></span></li>
            <li><span><b>Ask at your health centre</b><br><span class="small">Any midwife or volunteer can look up your enrolment.</span></span></li>
          </ol>
          <a class="btn btn-primary" style="width:100%;margin-top:1.2rem" href="#/app/join">Join free</a>
        </div>
        <div class="callout" style="border-left-color:var(--urgent)"><p><strong>This is not an emergency service.</strong> If you or your baby has heavy bleeding, severe pain, fever, fits or trouble breathing, go to your nearest health centre or hospital now.</p></div>
      </div>
    </div>
  </div>
</section>`;}


export function pagePrivacy(){return `
<section>
  <div class="wrap">
    <p class="crumb"><a href="#/">${t('nav_home')}</a> ${I.sep} <span>Your privacy &amp; consent</span></p>
    <div class="sec-head" style="margin-top:1rem;max-width:52ch"><p class="eyebrow">Our promise</p>
      <h2 style="font-size:clamp(1.9rem,4vw,2.6rem)">Six promises we make to every person who joins.</h2></div>
    <div class="split">
      <div>
        <div class="choice"><span class="ci">${I.shield}</span><div><h3>Nothing without your yes</h3><p>Having your number in a health register is not permission. We contact you only after you agree, and each permission stands on its own.</p></div></div>
        <div class="choice"><span class="ci">${I.lock}</span><div><h3>Your number is protected</h3><p>Stored encrypted, never sold, never shown to anyone who does not need it for your care.</p></div></div>
        <div class="choice"><span class="ci">${I.moon}</span><div><h3>We respect your time</h3><p>Never between 9pm and 6am. Never more than four messages a week.</p></div></div>
        <div class="choice"><span class="ci">${I.stop}</span><div><h3>Leaving is easy</h3><p>One word stops everything. We never restart it on our own — only you can.</p></div></div>
        <div class="choice"><span class="ci">${I.heart}</span><div><h3>We stop when it would hurt</h3><p>After a pregnancy loss or the death of a baby, everything stops within a minute, and no celebratory message can ever reach you again.</p></div></div>
        <div class="choice"><span class="ci">${I.free}</span><div><h3>We are not your medical record</h3><p>Mami Care never stores a diagnosis, a prescription or a risk score. That belongs to your health centre.</p></div></div>
      </div>
      <div>
        <div class="stepbox"><h3>Permissions you hold</h3>
          <ol>
            <li><span><b>Health guidance</b><br><span class="small">The messages themselves.</span></span></li>
            <li><span><b>Voice calls</b><br><span class="small">Khmer audio instead of, or as well as, text.</span></span></li>
            <li><span><b>Sharing for a referral</b><br><span class="small">Only what the facility needs, only when you are referred.</span></span></li>
            <li><span><b>A family supporter</b><br><span class="small">A second number you choose, which you can remove.</span></span></li>
          </ol>
          <p class="small" style="margin-top:1rem">Turning one off never turns the others off.</p>
        </div>
        <div class="callout"><p><strong>Want to check or change your permissions?</strong> <a href="#/app/login" style="color:var(--brand);font-weight:600">Log in</a> or ask the helpdesk — they can do it while you are on the call.</p></div>
      </div>
    </div>
  </div>
</section>
${ctaBand()}`;}


export function pageMissing(){return `
<section><div class="wrap" style="text-align:center;padding-block:3rem">
  <h1 style="font-size:2rem">We could not find that page</h1>
  <p style="color:var(--ink-2);margin-top:.7rem">It may have moved. Try the services list or go back home.</p>
  <div class="cta-row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn-primary" href="#/services">All services</a><a class="btn btn-ghost" href="#/">Home</a></div>
</div></section>`;}

