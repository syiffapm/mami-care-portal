/* Shared, in-memory state for the multi-step "Join Mami Care" wizard
   (BRD-01 §7.1). The hash router re-renders the whole page on every step
   change, so the entered values live here rather than in the DOM —
   pages.js reads it to redraw a step, router.js writes to it as the
   visitor fills the form in. Nothing here is persisted anywhere. */
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
