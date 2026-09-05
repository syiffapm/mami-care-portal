/* Shared, in-memory state for the multi-step "Join Mami Care" wizard
   (BRD-01 §7.1). The hash router re-renders the whole page on every step
   change, so the entered values live here rather than in the DOM —
   pages.js reads it to redraw a step, router.js writes to it as the
   visitor fills the form in. Nothing here is persisted anywhere. */
import { DEMO_PROFILE } from './data.js';

export const ENROLL = {
  role:'pregnant',
  phone:'',
  language:'km',
  channel:['sms'],
  timeWindow:'evening',
  consents:{ engagement:false, voice:false, referral:false, alt:false, research:false },
  stageMode:'edd',       /* edd | lmp | dob | unknown */
  stageDate:'',
  code:null
};

export function enrollCode(){
  if(!ENROLL.code){
    const chars = 'ACDEFGHJKLMNPQRTUVWXY3479';
    let s = '';
    for(let i=0;i<4;i++) s += chars[Math.floor(Math.random()*chars.length)];
    ENROLL.code = 'MC-'+s;
  }
  return ENROLL.code;
}

/* Rough, plain-language gestational week from an EDD or an LMP date.
   Never shown as a clinical fact — only ever a friendly estimate the
   visitor is asked to confirm, exactly as BRD-01 §7.1 describes. */
export function gestationalWeeks(mode, dateStr){
  if(!dateStr) return null;
  const d = new Date(dateStr+'T00:00:00');
  if(isNaN(d)) return null;
  const now = new Date();
  const MS_WEEK = 7*24*60*60*1000;
  if(mode==='lmp'){
    const w = Math.floor((now-d)/MS_WEEK);
    return (w>=0 && w<=45) ? w : null;
  }
  if(mode==='edd'){
    const w = 40 - Math.round((d-now)/MS_WEEK);
    return (w>=0 && w<=45) ? w : null;
  }
  return null;
}

function monthsSince(dateStr){
  const d = new Date(dateStr+'T00:00:00');
  if(isNaN(d)) return null;
  const days = Math.floor((new Date()-d)/(24*60*60*1000));
  return days>=0 ? Math.floor(days/30.4) : null;
}
function maskPhone(phone){
  const digits = (phone||'').replace(/\D/g,'');
  if(digits.length<5) return phone || '—';
  return `${digits.slice(0,3)} xxx x${digits.slice(-2)}`;
}

/* A friendly stage description from whatever the visitor entered in
   step 4 — never a guess where they gave none. */
function describeStage(){
  const { stageMode, stageDate } = ENROLL;
  if(stageMode==='edd' || stageMode==='lmp'){
    const w = gestationalWeeks(stageMode, stageDate);
    return w!=null
      ? { en:`Pregnant · week ${w}`, km:`មានផ្ទៃពោះ · សប្តាហ៍ទី ${w}` }
      : { en:'Pregnant', km:'មានផ្ទៃពោះ' };
  }
  if(stageMode==='dob'){
    const m = monthsSince(stageDate);
    return m!=null
      ? { en:`Child · ${m} month${m===1?'':'s'} old`, km:`កូន · អាយុ ${m} ខែ` }
      : { en:'Parent of a young child', km:'ឪពុកម្តាយកូនតូច' };
  }
  return { en:'Pregnant · early stages', km:'មានផ្ទៃពោះ · ដំណាក់កាលដើម' };
}
function describeDue(){
  const { stageMode, stageDate } = ENROLL;
  if(stageMode==='edd' && stageDate){
    const d = new Date(stageDate+'T00:00:00');
    if(!isNaN(d)) return `Baby due around ${d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`;
  }
  if(stageMode==='dob' && stageDate){
    const d = new Date(stageDate+'T00:00:00');
    if(!isNaN(d)) return `Born ${d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`;
  }
  return 'A midwife can confirm your dates at your next visit.';
}

/* Called once, as the confirmation screen (step 5) renders — copies
   what was actually entered into the shared app profile, so Today,
   Me, Preferences and My data all show the same person who just
   joined, instead of an unrelated hardcoded demo persona. */
export function applyEnrollToProfile(){
  const stage = describeStage();
  DEMO_PROFILE.status = 'provisional';
  DEMO_PROFILE.code = enrollCode(); // the exact code shown on the confirmation screen — a midwife
                                     // on the Facility Portal verifies you by entering this
  DEMO_PROFILE.phoneMasked = maskPhone(ENROLL.phone);
  DEMO_PROFILE.language = ENROLL.language;
  DEMO_PROFILE.channel = ENROLL.channel.length ? [...ENROLL.channel] : ['sms'];
  DEMO_PROFILE.timeWindow = ENROLL.timeWindow;
  DEMO_PROFILE.stageLabel = stage.en;
  DEMO_PROFILE.stageKh = stage.km;
  DEMO_PROFILE.dueLabel = describeDue();
  DEMO_PROFILE.facility = null;
}
