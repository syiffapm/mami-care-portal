/* "Ask a question" — L1 (automated, approved-answer-only) → L2 (human
   helpdesk) escalation, per the build spec §9 F-07 and §6.1 /tanya.
   MY_CASES holds the chat thread for this device; escalated cases are
   also pushed into the shared HELPDESK_CASES queue so the CMS helpdesk
   view picks them up live, in the same session. */
import { SUGGESTED_QUESTIONS, URGENT_KEYWORDS, HELPDESK_CASES } from './data.js';

export const MY_CASES = [];

function newCaseId(){ return 'CASE-'+Math.floor(1000+Math.random()*9000); }

/* L1: match against the approved knowledge base only — never a generated
   answer. A loose substring match stands in for real intent-matching. */
export function findFaqMatch(text){
  const q = (text||'').trim().toLowerCase();
  if(!q) return null;
  return SUGGESTED_QUESTIONS.find(fq=>{
    const a = fq[0].toLowerCase();
    return a===q || a.includes(q) || q.includes(a.slice(0, Math.min(12, a.length)));
  }) || null;
}
export function isUrgent(text){
  const q = (text||'').toLowerCase();
  return URGENT_KEYWORDS.some(k=>q.includes(k.toLowerCase()));
}

function pushToHelpdeskQueue(c){
  HELPDESK_CASES.unshift({
    id:c.id, question:c.question, from:'You (this device)', channel:'App',
    priority:c.priority, status:'open', received:'Just now'
  });
}

/* Start a new case from a typed or tapped question. Returns the case;
   the thread already contains the L1 turn (bot answer or hand-off notice). */
export function startAskCase(question){
  const q = (question||'').trim();
  if(!q) return null;
  const id = newCaseId();
  const urgent = isUrgent(q);
  const match = !urgent ? findFaqMatch(q) : null;
  const thread = [{ from:'me', text:q }];
  let status, priority = urgent ? 'urgent' : 'normal', awaitingOperator = false;

  if(urgent){
    thread.push({ from:'bot', text:'urgent_protocol' }); // rendered specially by the page
    thread.push({ from:'system', text:'connecting' });
    status = 'escalated';
    awaitingOperator = true;
  } else if(match){
    thread.push({ from:'bot', text: match[1], approved:true });
    status = 'answered_auto';
  } else {
    thread.push({ from:'system', text:'no_match' });
    status = 'escalated';
    awaitingOperator = true;
  }

  const c = { id, question:q, status, priority, thread, awaitingOperator, createdAt:'Just now' };
  MY_CASES.unshift(c);
  if(status==='escalated') pushToHelpdeskQueue(c);
  return c;
}

export function getCase(id){ return MY_CASES.find(c=>c.id===id); }

/* "No" on a Level-1 answer escalates the same case rather than starting
   a new one, matching the spec's L1→L2 path. */
export function markNotHelpful(id){
  const c = getCase(id); if(!c) return;
  c.status = 'escalated';
  c.awaitingOperator = true;
  c.thread.push({ from:'system', text:'connecting' });
  pushToHelpdeskQueue(c);
}
export function markHelpful(id){
  const c = getCase(id); if(!c) return;
  c.status = 'closed';
  c.thread.push({ from:'system', text:'glad_helped' });
}

/* Explicit "talk to a person instead" — same escalation path. */
export function escalateToPerson(id){
  const c = getCase(id); if(!c) return;
  if(c.status==='escalated') return;
  c.status = 'escalated';
  c.awaitingOperator = true;
  c.thread.push({ from:'system', text:'connecting' });
  pushToHelpdeskQueue(c);
}

/* Fired once, after a short delay, by the page that's showing the thread —
   simulates the human reply that would really come from the helpdesk
   console (BR-88: within the approved scope, never a diagnosis). */
export function deliverOperatorReply(id){
  const c = getCase(id); if(!c || !c.awaitingOperator) return;
  c.awaitingOperator = false;
  c.status = 'answered';
  c.thread.push({ from:'operator', text:'reply' });
  const hc = HELPDESK_CASES.find(x=>x.id===id);
  if(hc) hc.status = 'answered';
}
