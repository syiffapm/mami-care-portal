/* Static content: services, audiences, the journey timeline, FAQ copy,
   inline scene illustrations and news posts. No UI logic lives here. */
import { I } from './icons.js';

/* ============ services (public only) ============ */
export const SERVICES = [
  { slug:'join', icon:I.join, name:'Join &amp; consent', kh:'ចុះឈ្មោះ និងការយល់ព្រម',
    short:'Sign up free in about two minutes, and choose exactly what you agree to receive.',
    lede:'Registration is free, works on any phone, and nothing is sent to you until you have said yes.',
    what:['A midwife can enrol you at your antenatal visit — or join yourself by text or QR poster','Choose Khmer or English, and how you want to be contacted','Tick only the permissions you are comfortable with','Change your mind, pause, or leave at any time'],
    steps:['Enter your phone number','Tell us your due date or your child’s birthday','Pick SMS, voice call or the app','Confirm the welcome message'],
    aud:['pregnant','postpartum','parent','family'],
    note:'<strong>Being in a health register is not the same as joining.</strong> We only contact you after you have agreed, and each permission can be withdrawn on its own.',
    cta:{label:'Join free',route:'#/app/join'}, cta2:{label:'Already joined? Log in',route:'#/app/login'} },

  { slug:'guidance', icon:I.guide, name:'Guidance for your week', kh:'ការណែនាំតាមសប្តាហ៍',
    short:'Advice that matches the week you are actually in — from early pregnancy to your child turning two.',
    lede:'Instead of a general newsletter, Mami Care follows your due date and your child’s age, and sends only what is useful right now.',
    what:['Weekly pregnancy guidance in plain Khmer','Reminders before antenatal, delivery and postnatal visits','Immunisation reminders for your baby','Feeding, growth and play guidance up to age two'],
    steps:['We start from your due date or your child’s birthday','Real events — the birth, a check-up, a vaccination — move you to the next stage','Messages arrive at the time you chose','It ends gently at your child’s second birthday'],
    aud:['pregnant','postpartum','parent'],
    note:'All content is written and approved by the Ministry of Health. We never give a diagnosis — for anything urgent, go to your health centre.',
    cta:{label:'See the full journey',route:'#/journey'}, cta2:{label:'Join free',route:'#/app/join'} },

  { slug:'channels', icon:I.chan, name:'Messages your way', kh:'តាមរបៀបដែលអ្នកចូលចិត្ត',
    short:'SMS, a Khmer voice call, or the app. Any handset works — you do not need the internet.',
    lede:'Not everyone has data, and not everyone reads long text comfortably. You pick the door that suits you and you can switch any time.',
    what:['SMS on any phone, including a shared handset','Khmer voice messages you can replay as often as you like','The app for pictures, saved content and offline reading','Neutral previews, so a shared screen never gives anything away'],
    steps:['Choose your channel when you join','Change it by replying to any message','Ask for a voice call instead of text','Add a second trusted number if you want'],
    aud:['pregnant','postpartum','parent','family'],
    note:'Nothing arrives between <strong>9pm and 6am</strong>, and never more than four messages in a week.',
    cta:{label:'Join free',route:'#/app/join'}, cta2:{label:'How we protect you',route:'#/privacy'} },

  { slug:'ask', icon:I.ask, name:'Ask a question', kh:'សួរសំណួរ',
    short:'Send a question in Khmer at any hour and get an approved answer back.',
    lede:'This page is a preview — asking a question happens inside the Mami Care app, once you have joined. Common questions are answered instantly there; anything else goes to a real person the same day.',
    what:['Lives inside the app, under the Ask tab','Available 24 hours, every day, once you have joined','Answers reviewed by Ministry of Health clinicians','Ask by SMS, voice or in the app — whichever you joined with'],
    steps:['Join free (about two minutes)','Open the Ask tab in your app','Send your question in Khmer','Get an approved answer, or a person follows up the same day'],
    aud:['pregnant','postpartum','parent','family'],
    note:'This is not an emergency line. If you or your baby has a danger sign, go to your nearest health centre straight away.',
    cta:{label:'Join free to ask',route:'#/app/join'}, cta2:{label:'Already joined? Log in',route:'#/app/login'} },

  { slug:'helpdesk', icon:I.desk, name:'Talk to a person', kh:'ជំនួយពីបុគ្គលិក',
    short:'A Khmer-speaking operator, seven days a week, free from any network.',
    lede:'This page is a preview — calling or requesting a call-back happens inside the app, once you have joined. It is always free; there is never a charge for any of this.',
    what:['Free to call — the toll-free number appears in your app once you join','Or request a call back at a time that suits you, from the app','Help with joining, stopping, or changing your details','Escalation to a health professional when it is needed'],
    steps:['Join free (about two minutes)','Open Ask → Talk to a person in your app','Call the free number, or request a call back','An operator answers in Khmer and follows up'],
    aud:['pregnant','postpartum','parent','family'],
    note:'Everything you tell the helpdesk stays confidential and is never shared without your permission.',
    cta:{label:'Join free to call',route:'#/app/join'}, cta2:{label:'Common questions',route:'#/faq'} },

  { slug:'referral', icon:I.ref, name:'Find care near you', kh:'ស្វែងរកសេវាថែទាំ',
    short:'Your nearest health centre, and a warm hand-off when you need to be seen.',
    lede:'Knowing where to go is half the problem. Mami Care points you to the right place and can tell them you are coming.',
    what:['Find your nearest health centre or referral hospital','Ask to be referred, with only what is needed shared','See that the facility received it, and that it was closed','Reminders so a follow-up visit is not forgotten'],
    steps:['Tell us your village or health centre','We show you where to go','With your permission, we tell the facility you are coming','They confirm you were seen, and the referral is closed'],
    aud:['pregnant','postpartum','parent'],
    note:'Nothing about you is shared with a facility unless you have given permission for that specific referral.',
    cta:{label:'Search facilities now',route:'#/facilities'}, cta2:{label:'Join free',route:'#/app/join'} }
];

/* ============ audiences (roles, not names) ============ */
export const AUDIENCES = [
  { slug:'pregnant', icon:I.preg, name:'Pregnant', kh:'មានផ្ទៃពោះ',
    short:'From your first missed period to the day you give birth.',
    lede:'Guidance that keeps pace with your pregnancy, week by week, and reminds you before every check-up.',
    what:['Weekly guidance matched to your due date','Reminders before each antenatal visit','Warning signs explained simply, in Khmer','Help preparing for the birth and where to go'],
    steps:['Join with your due date','Get your first message the same day','Guidance follows your weeks automatically','Tell us when your baby arrives'],
    svc:['guidance','channels','ask','referral'],
    note:'Do not know your due date? A midwife can set it at your first visit, or the helpdesk can help you estimate it.',
    cta:{label:'Join as pregnant',route:'#/app/join'} },

  { slug:'postpartum', icon:I.pp, name:'New mother', kh:'ក្រោយសម្រាល',
    short:'The first six weeks after birth — for you as much as for the baby.',
    lede:'Recovery, feeding and rest matter as much as the newborn checks. This stage sends fewer, gentler messages.',
    what:['Your own recovery, not only the baby’s','Feeding support and what to do when it is hard','Reminders for postnatal checks for both of you','Newborn warning signs, in plain words'],
    steps:['Report the birth by SMS, voice or at the clinic','Messages switch to postnatal care','A check-in on how you are feeling','You move on to baby guidance at six weeks'],
    svc:['guidance','helpdesk','ask','referral'],
    note:'If your pregnancy ended in a loss, tell us or the helpdesk. Messages stop immediately and nothing celebratory will ever reach you.',
    cta:{label:'Join as a new mother',route:'#/app/join'} },

  { slug:'parent', icon:I.child, name:'Parent of a young child', kh:'ឪពុកម្តាយកូនតូច',
    short:'From birth to your child’s second birthday.',
    lede:'Immunisation reminders, feeding at each age, and simple things you can do at home to help your child grow.',
    what:['Immunisation reminders on the national schedule','What to feed, and when to start solid food','Growth and development, month by month','Play and talking ideas that cost nothing'],
    steps:['Add your child’s date of birth','Guidance follows their age','Reminders arrive before each vaccination','It ends at their second birthday'],
    svc:['guidance','ask','referral','channels'],
    note:'Fathers, grandmothers and other carers can be added as a second contact, with the mother’s permission.',
    cta:{label:'Join as a parent',route:'#/app/join'} },

  { slug:'family', icon:I.fam, name:'Family supporter', kh:'សមាជិកគ្រួសារ',
    short:'Husbands, grandmothers and carers who help look after her.',
    lede:'You can receive your own guidance on how to support her — but only if she has said yes.',
    what:['Practical ways to support during pregnancy and after birth','How to spot warning signs and act early','Reminders so an appointment is not missed','Your own separate messages, never a copy of hers'],
    steps:['She adds your number as a trusted contact','You confirm on your own phone','You receive supporter guidance','She can remove you at any time'],
    svc:['guidance','ask','helpdesk'],
    note:'A supporter never sees her private messages, her helpdesk conversations, or her health details.',
    cta:{label:'Ask her to add you',route:'#/app/join'} }
];

/* ============ journey ============ */
export const JOURNEY = [
  { k:'a', lb:'Early pregnancy', wk:'to 16 weeks', ic:I.preg, kh:'ដើមផ្ទៃពោះ',
    get:['Confirm your due date','Your first antenatal visit','Foods and iron supplements','What to expect this trimester'],
    msg:'សូមទៅពិនិត្យផ្ទៃពោះលើកទីមួយ នៅមណ្ឌលសុខភាព។', en:'Time for your first antenatal check at the health centre.' },
  { k:'a', lb:'Mid pregnancy', wk:'16–27 weeks', ic:I.preg, kh:'ពាក់កណ្តាលផ្ទៃពោះ',
    get:['Your next two antenatal visits','Iron and nutrition reminders','Warning signs to watch for','Rest and work advice'],
    msg:'ត្រូវលេបថ្នាំបំប៉នជាតិដែក រាល់ថ្ងៃ។', en:'Take your iron supplement every day.' },
  { k:'a', lb:'Late pregnancy', wk:'28 weeks to birth', ic:I.preg, kh:'ចុងផ្ទៃពោះ',
    get:['Making your birth plan','Getting to the facility in time','Labour signs explained','What to pack'],
    msg:'ផ្ទៃពោះ ២៨ សប្តាហ៍៖ សូមរៀបចំផែនការសម្រាល។', en:'28 weeks: time to make your birth plan.' },
  { k:'b', lb:'Birth', wk:'around delivery', ic:I.heart, kh:'ពេលសម្រាល',
    get:['Tell us when your baby arrives','First checks for you and the baby','Skin-to-skin and first feed','Messages pause while you rest'],
    msg:'សូមទៅពិនិត្យសុខភាពក្រោយសម្រាល។', en:'Please go for your postnatal check-up.' },
  { k:'b', lb:'First 6 weeks', wk:'0–6 weeks after', ic:I.pp, kh:'៦ សប្តាហ៍ដំបូង',
    get:['Your own recovery','Feeding support','Postnatal checks for both of you','Newborn danger signs'],
    msg:'សូមបំបៅដោះកូន តែមួយមុខ រហូតដល់ ៦ ខែ។', en:'Feed your baby only breastmilk until six months.' },
  { k:'c', lb:'Baby 0–6 months', wk:'0–6 months', ic:I.child, kh:'ទារក ០–៦ ខែ',
    get:['Immunisation reminders','Exclusive breastfeeding support','Growth monitoring visits','Sleep and crying'],
    msg:'កុមារត្រូវចាក់វ៉ាក់សាំង តាមកាលវិភាគ។', en:'Your child needs their vaccination on schedule.' },
  { k:'c', lb:'Baby 6–12 months', wk:'6–12 months', ic:I.child, kh:'ទារក ៦–១២ ខែ',
    get:['Starting solid food safely','Remaining vaccinations','Signs of illness','First words and movement'],
    msg:'ចាប់ផ្តើមឱ្យអាហារបំប៉ន ចាប់ពី ៦ ខែ។', en:'Start complementary food from six months.' },
  { k:'c', lb:'Child 1–2 years', wk:'12–24 months', ic:I.child, kh:'កុមារ ១–២ ឆ្នាំ',
    get:['Family food and portions','Play and language at home','Growth checks','Family planning information if you want it'],
    msg:'លេង និងនិយាយជាមួយកូន រាល់ថ្ងៃ។', en:'Play and talk with your child every day.' },
  { k:'c', lb:'Graduation', wk:'2nd birthday', ic:I.check, kh:'បញ្ចប់កម្មវិធី',
    get:['A summary of what you covered','Where to go next for child health','You can stay for a new pregnancy','Or leave with one message'],
    msg:'អរគុណសម្រាប់ការចូលរួម ជាមួយ Mami Care។', en:'Thank you for being part of Mami Care.' }
];

/* ============ lookup helpers ============ */
export const svc = s => SERVICES.find(x=>x.slug===s);
export const aud = s => AUDIENCES.find(x=>x.slug===s);

/* ============ frequently asked questions ============ */
export const FAQ_GROUPS=[
  ['Joining',[
    ['Who can join Mami Care?','Anyone who is pregnant, has given birth in the last two years, or cares for a child under two. Family members can join as supporters if the mother adds them.'],
    ['How do I join?','Three ways: a midwife enrols you at your antenatal visit, you scan the QR poster at your health centre, or you send one text to the Mami Care short code.'],
    ['Do I need a smartphone?','No. SMS and Khmer voice calls work on any handset. The app is optional.'],
    ['I do not know my due date. Can I still join?','Yes. Join anyway and a midwife will confirm your due date at your next visit. Until then you receive general guidance.'],
    ['Can I join after my baby is born?','Yes. Add your child’s date of birth and you will get guidance and immunisation reminders up to their second birthday.']
  ]],
  ['Messages and cost',[
    ['Does it cost anything?','No. Messages, voice calls and the helpline are free on every Cambodian network. You never pay to receive or to reply.'],
    ['How often will you contact me?','At most four messages a week, and at most two voice calls. Never between 9pm and 6am.'],
    ['Can I get voice instead of text?','Yes. Ask for Khmer voice when you join, or reply to any message to switch. You can replay a voice message as many times as you want.'],
    ['How do I stop the messages?','Reply ឈប់ or STOP to any message, or tell the helpdesk. Everything stops within a minute. You can also pause instead of leaving.'],
    ['I changed my number. What do I do?','Tell the helpdesk or any midwife. They will move your enrolment to the new number so you do not lose your place in the journey.']
  ]],
  ['Privacy and consent',[
    ['I share a phone with my husband. Is that safe?','Yes. Previews are written so nothing personal shows on the lock screen, and health details are never put in a message someone could read at a glance.'],
    ['Who can see my information?','Only the people who need it for your care. Your number is stored encrypted and is never sold, published, or shown to anyone else.'],
    ['Can my mother or husband get messages too?','Yes, if you add them as a family supporter. They receive their own guidance on how to support you — never a copy of your messages.'],
    ['Can I change what I agreed to?','At any time. Each permission stands on its own, so turning off voice calls does not stop your health guidance.'],
    ['Is this my medical record?','No. Mami Care sends guidance and reminders. Your medical record stays with your health centre and the Ministry of Health.']
  ]],
  ['Health and safety',[
    ['Can Mami Care tell me what is wrong with me?','No. We give general guidance approved by the Ministry of Health. Only a midwife or doctor can examine you and tell you what is happening.'],
    ['What if I have an emergency?','Go to your nearest health centre or hospital immediately. Do not wait for a reply from us — Mami Care is not an emergency service.'],
    ['I lost my pregnancy. What happens?','Tell us or the helpdesk. All messages stop immediately, nothing celebratory will ever reach you again, and only a health professional can restart anything.'],
    ['I missed my appointment. Will you keep reminding me?','You get one gentle reminder. Once your health centre confirms you were seen, the reminders stop.']
  ]]
];

/* ============ scene illustrations (people, not abstractions) ============ */
export const SC = {
  belly:'<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A pregnant woman resting her hands on her belly."><rect width="400" height="260" fill="#F7EAF0"/><rect x="28" y="30" width="92" height="112" rx="8" fill="#FFFFFF" opacity=".75"/><path d="M74 30v112M28 86h92" stroke="#E9D5DE" stroke-width="4"/><circle cx="322" cy="60" r="40" fill="#FBDEE8"/><rect y="214" width="400" height="46" fill="#E9DCD2"/><rect x="330" y="176" width="46" height="40" rx="5" fill="#D3A98C"/><path d="M353 176c-18-6-28-21-30-38 16 2 27 11 30 25 4-14 15-23 31-25-2 17-13 32-31 38z" fill="#3E8F72"/><path d="M152 260l10-84q0-34 36-34t36 34l4 30 8 54z" fill="#C9628B"/><circle cx="234" cy="196" r="44" fill="#C9628B"/><rect x="186" y="106" width="22" height="24" rx="10" fill="#D89C78"/><circle cx="197" cy="84" r="31" fill="#E9B48F"/><path d="M197 51c19 0 31 13 31 30 0 8-2 12-4 12s-1-6-3-11c-3-9-11-13-24-13s-21 4-24 13c-2 5-1 11-3 11s-4-4-4-12c0-17 12-30 31-30z" fill="#2B2119"/><circle cx="229" cy="76" r="12" fill="#2B2119"/><path d="M188 84c2-2 5-2 7 0M204 84c2-2 5-2 7 0" stroke="#2B2119" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M191 96c4 4 10 4 14 0" stroke="#2B2119" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="177" cy="92" r="6" fill="#E08CA6" opacity=".5"/><circle cx="217" cy="92" r="6" fill="#E08CA6" opacity=".5"/><path d="M172 152c4 30 26 50 60 52" stroke="#E9B48F" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M176 136c8 22 28 34 56 34" stroke="#D89C78" stroke-width="16" fill="none" stroke-linecap="round"/></svg>',

  baby:'<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A mother holding her newborn baby."><rect width="400" height="260" fill="#EDF3F0"/><circle cx="86" cy="66" r="44" fill="#DCEBE4"/><rect y="212" width="400" height="48" fill="#E4DAD0"/><rect x="36" y="150" width="56" height="62" rx="6" fill="#D3A98C"/><path d="M64 150c-20-7-32-24-34-43 18 3 30 13 34 28 4-15 17-26 35-28-2 19-15 36-35 43z" fill="#3E8F72"/><path d="M156 260l8-92q0-36 40-36t40 36l8 92z" fill="#2E7D6B"/><rect x="192" y="98" width="22" height="24" rx="10" fill="#C98B69"/><circle cx="203" cy="76" r="31" fill="#DDA07C"/><path d="M203 43c20 0 32 14 32 32 0 6-2 9-4 6-3-9-11-14-28-14-9 0-16 2-20 6-3 3-4 8-6 6-2-3-3-6-3-10 0-16 11-26 29-26z" fill="#241B15"/><path d="M194 76c2-2 5-2 7 0M210 76c2-2 5-2 7 0" stroke="#241B15" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M197 88c4 4 10 4 14 0" stroke="#241B15" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M232 156c22 6 34 24 30 46l-52 8-8-40z" fill="#F3E7DA"/><circle cx="216" cy="176" r="24" fill="#EFC0A0"/><path d="M216 152c11 0 19 7 20 16-5-5-12-7-20-7s-15 2-20 7c1-9 9-16 20-16z" fill="#241B15"/><path d="M209 176c1.4-1.4 4-1.4 5.4 0M221 176c1.4-1.4 4-1.4 5.4 0" stroke="#241B15" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M211 186c3 3 8 3 11 0" stroke="#241B15" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M172 150c-8 22-2 44 18 54" stroke="#DDA07C" stroke-width="17" fill="none" stroke-linecap="round"/></svg>',

  midwife:'<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A midwife with a tablet talking to a pregnant woman at a health centre."><rect width="400" height="260" fill="#F4F0EA"/><rect x="0" y="0" width="400" height="150" fill="#EFEAE2"/><rect x="252" y="26" width="112" height="76" rx="6" fill="#FFFFFF"/><path d="M262 68l22-22 18 20 14-12 26 26z" fill="#CFE0D8"/><circle cx="284" cy="44" r="8" fill="#F0D9A6"/><rect y="212" width="400" height="48" fill="#DED3C6"/><path d="M60 260l8-96q0-34 36-34t36 34l8 96z" fill="#C9628B"/><circle cx="128" cy="206" r="36" fill="#C9628B"/><rect x="93" y="98" width="22" height="24" rx="10" fill="#C98B69"/><circle cx="104" cy="76" r="29" fill="#DDA07C"/><path d="M104 45c19 0 30 13 30 30 0 6-2 9-4 6-3-8-11-13-26-13s-23 5-26 13c-2 3-4 0-4-6 0-17 11-30 30-30z" fill="#2B2119"/><path d="M96 76c2-2 5-2 7 0M112 76c2-2 5-2 7 0" stroke="#2B2119" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M99 88c3 4 9 4 12 0" stroke="#2B2119" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M76 158c4 26 22 42 50 44" stroke="#DDA07C" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M232 260l8-98q0-32 34-32t34 32l8 98z" fill="#FFFFFF"/><path d="M258 132h8l8 22 8-22h8l-10 30h-12z" fill="#E7EEEA"/><rect x="263" y="98" width="22" height="24" rx="10" fill="#C98B69"/><circle cx="274" cy="76" r="29" fill="#E9B48F"/><path d="M274 45c19 0 30 13 30 31 0 5-2 7-4 5-2-7-4-12-8-13-8 4-20 5-30 2-3 4-4 8-6 11-2 3-5 1-5-5 0-18 6-31 23-31z" fill="#2B2119"/><path d="M266 76c2-2 5-2 7 0M282 76c2-2 5-2 7 0" stroke="#2B2119" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M269 88c3 4 9 4 12 0" stroke="#2B2119" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M240 168c-6 22 2 40 22 46" stroke="#E9B48F" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="188" y="176" width="56" height="40" rx="5" fill="#3E8F72" transform="rotate(-9 188 176)"/><rect x="194" y="182" width="44" height="28" rx="3" fill="#D8EAE2" transform="rotate(-9 194 182)"/></svg>',

  village:'<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Three women sitting together during a community health visit."><rect width="400" height="260" fill="#EEF3EC"/><circle cx="330" cy="52" r="38" fill="#DCEAD8"/><path d="M0 200c60-14 110-10 160 0s110 12 240-4v64H0z" fill="#DCD0BE"/><g><path d="M40 260l8-72q0-26 28-26t28 26l8 72z" fill="#2E7D6B"/><rect x="66" y="128" width="20" height="22" rx="9" fill="#C98B69"/><circle cx="76" cy="108" r="26" fill="#DDA07C"/><path d="M76 82c17 0 27 12 27 27 0 5-2 7-4 5-2-8-9-12-23-12s-21 4-23 12c-2 2-4 0-4-5 0-15 10-27 27-27z" fill="#2B2119"/><path d="M69 108c2-2 4-2 6 0M83 108c2-2 4-2 6 0" stroke="#2B2119" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M71 119c3 3 8 3 11 0" stroke="#2B2119" stroke-width="2.3" fill="none" stroke-linecap="round"/></g><g><path d="M156 260l8-80q0-28 30-28t30 28l8 80z" fill="#C9628B"/><circle cx="216" cy="216" r="30" fill="#C9628B"/><rect x="184" y="116" width="20" height="22" rx="9" fill="#D89C78"/><circle cx="194" cy="96" r="27" fill="#E9B48F"/><path d="M194 69c18 0 28 13 28 28 0 5-2 7-4 5-2-8-9-13-24-13s-22 5-24 13c-2 2-4 0-4-5 0-15 10-28 28-28z" fill="#2B2119"/><circle cx="220" cy="90" r="10" fill="#2B2119"/><path d="M187 96c2-2 4-2 6 0M201 96c2-2 4-2 6 0" stroke="#2B2119" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M189 107c3 3 8 3 11 0" stroke="#2B2119" stroke-width="2.3" fill="none" stroke-linecap="round"/></g><g><path d="M280 260l8-76q0-26 28-26t28 26l8 76z" fill="#B9556F"/><rect x="306" y="124" width="20" height="22" rx="9" fill="#B87A58"/><circle cx="316" cy="104" r="26" fill="#C98B69"/><path d="M316 78c17 0 27 12 27 28 0 4-2 6-4 4-2-7-6-11-9-12-7 3-18 4-27 2-3 3-5 7-6 10-2 2-4 0-4-4 0-16 6-28 23-28z" fill="#241B15"/><path d="M309 104c2-2 4-2 6 0M323 104c2-2 4-2 6 0" stroke="#241B15" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M311 115c3 3 8 3 11 0" stroke="#241B15" stroke-width="2.3" fill="none" stroke-linecap="round"/></g></svg>'
};


/* ============ news ============ */
/* Kept honest to the actual programme stage (Implementation Blueprint
   v1.1 §11: Phase A, pre-Gate-1 — the pilot has not started, and four of
   the nine MoH decisions in §16 are still open). Earlier drafts of this
   section described a service already live at national scale (provinces
   opened, midwives trained, a helpline already answering calls, pilot
   results) — dated *before* the blueprint's own document date. That
   directly contradicted both the blueprint (§0.1) and this site's own
   footer disclaimer ("Concept portal — not a live public service"), so
   every item below was rewritten to describe real Phase A build/design
   activity instead of invented rollout milestones. None of this has
   reached a real family yet — the rest of this site is a preview of
   what the finished experience will feel like, not a live service. */
export const NEWS = [
  { slug:'first-districts-chosen', date:'28 August 2026', cat:'Programme update', img:'midwife',
    title:'The first two districts for the Mami Care pilot have been chosen',
    sum:'Two operational districts will run the first pilot, once enrolment, messages and the helpline have each passed a set of safety checks.',
    body:['Mami Care is being built and tested before it reaches any family. The programme has chosen two operational districts to run the first pilot, based on how ready each district’s health centres and facility records are to take part.',
      'Before enrolment opens there, the enrolment tool, the message content and the helpline all have to pass safety checks — including proof that a message can never reach someone who has opted out, and that a support call is always answered by a real Khmer-speaking person.',
      'This site previews what the finished service will look like and how it will work. Nothing on it has been sent to a real family yet.'] },

  { slug:'voices-in-review', date:'19 August 2026', cat:'Getting ready', img:'belly',
    title:'Recording a Khmer voice version of every message, before a single one is sent',
    sum:'Reading a screen is hard for many mothers, so every piece of guidance is being recorded as audio too — checked before anything can go live.',
    body:['Many mothers would rather listen than read, especially on a small screen or with low literacy. So every piece of pregnancy and childcare guidance being written for Mami Care is also being recorded as a short Khmer voice message.',
      'Each recording goes through the same clinical review as its text version before either is approved for use. Nothing is scheduled to reach a phone until both versions have been signed off.',
      'When the pilot starts, anyone enrolling will be able to choose voice, text, or both — and change their mind at any time.'] },

  { slug:'helpline-in-design', date:'6 August 2026', cat:'Getting ready', img:'midwife',
    title:'Designing a helpline that always has a real person behind it',
    sum:'A Khmer-speaking helpline is being planned and staffed ahead of the pilot — able to fix an enrolment, change a preference, and hand anything clinical to a health professional.',
    body:['A message alone is never enough — people need somewhere to ask a question or fix something in person. Mami Care’s helpline is being designed and staffed now, ahead of the pilot, not built after people start joining.',
      'Operators are being trained to handle enrolment changes, preferences and referrals themselves, and to pass anything that sounds clinical straight to a health professional rather than answering it themselves.',
      'The helpline will never be an emergency service. Anyone with a danger sign will always be told to go straight to their nearest health centre.'] },

  { slug:'midwife-codesign', date:'24 July 2026', cat:'Getting ready', img:'midwife',
    title:'Working with midwives to keep enrolment under 90 seconds',
    sum:'Midwives from the chosen pilot districts are helping shape an enrolment flow that asks for two details and does not slow down a busy antenatal clinic.',
    body:['A busy health centre cannot afford an enrolment form that takes five minutes. Midwives from the districts chosen for the pilot are helping test and refine a version that asks for a phone number and one date, and defaults everything else.',
      'A large part of the work is the consent conversation itself: making sure the Khmer script a midwife reads aloud is clear enough that a mother knows exactly what she is agreeing to, and can decline any part of it without losing the rest.',
      'This design work uses sample data only, at this stage — not a real mother’s details.'] },

  { slug:'first-guidance-in-review', date:'11 July 2026', cat:'Getting ready', img:'baby',
    title:'The first batch of pregnancy and after-birth guidance is in clinical review',
    sum:'Around 60–80 messages covering the middle of pregnancy through the first six weeks after birth are being written, translated and checked by a clinician before anything is approved.',
    body:['Every message a family will eventually receive starts as a written draft, is translated into Khmer, and is only approved once a clinician has checked it against national guidance — for every channel it will be sent on, separately.',
      'The first batch — covering the middle of pregnancy through the first six weeks after birth — is being prioritised because it covers the pilot’s first six months. Nothing in it reaches anyone until it is formally approved and versioned.',
      'A sample of what an approved message could look like is in the Library section of this preview — it is an example, not something a real person has received.'] },

  { slug:'family-supporter-design', date:'30 June 2026', cat:'Design', img:'village',
    title:'How a family supporter will work, once the service is live',
    sum:'A husband, mother-in-law or carer will be addable as a second contact — with her permission, seeing only what is written for them, and removable at any time.',
    body:['Many mothers want a partner or family member involved without handing over her own messages or her helpdesk conversations. So the design lets her add one supporter, who receives separate guidance written for them.',
      'A supporter will never see her messages, her health details, or anything she has told the helpdesk. She will be able to add or remove them at any time, and adding one will always need her confirmation first.',
      'This is how the feature is designed to work once the service launches — you can try the design in this preview under Join, using sample data.'] }
];


export const news = sl => NEWS.find(n=>n.slug===sl);

/* ============================================================
   The rest of this file backs the "your account" demo (#/app/…):
   a logged-in preview of the Mami Care client app described in
   BRD-01. There is no real account behind it — one sample profile
   stands in for "you" so the screens can be tried end to end.
   ============================================================ */

/* ============ demo profile ============ */
/* The default demo persona shown before anyone has actually joined
   (e.g. navigating straight to #/app/today). The instant the join
   wizard finishes, enroll-state.js's applyEnrollToProfile() overwrites
   these fields in place with what was actually entered — Today, Me,
   Preferences and My data all read from this one mutable object, so
   the app never shows a "person" unrelated to what you just did. */
export const DEMO_PROFILE = {
  status:'provisional',                 /* provisional | verified */
  code:'MC-DEMO',                       /* the reference code shown at Join step 5 — a midwife
                                            enters this on the Facility Portal to verify you */
  stageLabel:'Pregnant · week 22',
  stageKh:'មានផ្ទៃពោះ · សប្តាហ៍ទី ២២',
  dueLabel:'Baby due around 3 December 2026',
  facility:null,                        /* set once a midwife verifies you */
  phoneMasked:'012 xxx x45',
  language:'km',                        /* km | en */
  channel:['sms'],                      /* one or more of: sms, voice, app */
  timeWindow:'evening',                 /* morning | afternoon | evening */
  frequency:'normal',                   /* normal | reduced */
  safeContact:false,
  altContact:false
};

/* ============ library: topics ============ */
export const LIBRARY_TOPICS = [
  { slug:'anc', icon:I.preg, name:'Antenatal care', kh:'ការថែទាំមុនពេលសម្រាល',
    blurb:'What each check-up is for, and why it matters even when you feel fine.' },
  { slug:'nutrition', icon:I.nutri, name:'Eating well', kh:'ការញ៉ាំអាហារបានល្អ',
    blurb:'Good food on an ordinary budget, for you and your baby.' },
  { slug:'delivery', icon:I.heart, name:'Getting ready for birth', kh:'ការត្រៀមខ្លួនសម្រាប់ថ្ងៃសម្រាល',
    blurb:'A simple plan for the day itself: where to go, what to bring, who to call.' },
  { slug:'pnc', icon:I.pp, name:'After the birth', kh:'ក្រោយពេលសម្រាល',
    blurb:'Your own recovery, and the checks that matter in the first six weeks.' },
  { slug:'breastfeeding', icon:I.child, name:'Breastfeeding', kh:'ការបំបៅដោះកូន',
    blurb:'Getting started, keeping going, and what to do when it is hard.' },
  { slug:'immunization', icon:I.shield, name:'Vaccination', kh:'ការចាក់វ៉ាក់សាំង',
    blurb:'What is on the national schedule, and what to expect after a shot.' },
  { slug:'family-planning', icon:I.fam, name:'Family planning', kh:'ការធ្វើផែនការគ្រួសារ',
    blurb:'Your choices for spacing or preventing a future pregnancy, explained plainly.' },
  { slug:'child-dev', icon:I.grow, name:'Your child’s growth', kh:'ការលូតលាស់របស់កូន',
    blurb:'Talking, playing and simple milestones from birth to two years.' }
];

/* ============ library: content items ============ */
export const LIBRARY_ITEMS = [
  { slug:'first-anc-visit', topic:'anc', status:'published', minutes:2, reviewed:'12 Aug 2026',
    title:'Your first antenatal visit',
    summary:'What happens at ANC1, and why going as early as possible helps.',
    body:[
      'Your first antenatal visit is about starting your record, not about finding something wrong. A midwife will check your general health, confirm roughly how many weeks pregnant you are, and give you your antenatal book.',
      'Going early — ideally before 12 weeks — gives more time to catch anything that needs attention and to plan the rest of your visits around your due date.',
      'Bring your ID if you have one, but not having it will never turn you away. There is nothing to prepare beyond showing up.'] },
  { slug:'iron-tablets', topic:'anc', status:'published', minutes:2, reviewed:'3 Aug 2026',
    title:'Iron and folic acid: why every tablet counts',
    summary:'A short, plain explanation of what the daily tablet is doing for you and your baby.',
    body:[
      'Your body needs more iron during pregnancy than at any other time. The daily tablet your health centre gives you helps prevent the tiredness and complications that come with low iron.',
      'Taking it with food and a source of vitamin C, like a bit of fruit, helps your body absorb it better. Taking it with tea or coffee makes it harder to absorb, so leave a gap if you can.',
      'If it upsets your stomach, do not stop on your own — tell your midwife. There is usually a simple change that helps.'] },
  { slug:'eating-on-a-budget', topic:'nutrition', status:'published', minutes:3, reviewed:'19 Aug 2026',
    title:'Eating well on a small budget',
    summary:'You do not need special or expensive food — just a bit more of what you already eat.',
    body:[
      'A good pregnancy diet is mostly your normal Cambodian meals, with a bit more variety: rice or noodles, a source of protein like fish, eggs or beans, and vegetables at most meals.',
      'Cheap, widely available foods like small fish (eaten with the bones), eggs, morning glory and pumpkin are excellent choices — you do not need imported or packaged food.',
      'Eating a little more often, in smaller amounts, can help if you feel full quickly or have nausea.'] },
  { slug:'foods-to-limit', topic:'nutrition', status:'pending_review', minutes:2, reviewed:'19 Aug 2026',
    title:'A few foods to go easy on',
    summary:'Short, practical guidance — not a long list of forbidden foods.',
    body:[
      'Raw or undercooked meat and fish, unpasteurised dairy, and alcohol are best avoided during pregnancy.',
      'Coffee and tea are fine in moderate amounts — try to keep it to a cup or two a day, and not right after your iron tablet.',
      'Beyond this, there is no need to cut out foods you enjoy. A varied, mostly home-cooked diet is the goal, not a strict rulebook.'] },
  { slug:'birth-plan', topic:'delivery', status:'published', minutes:3, reviewed:'25 Jul 2026',
    title:'Making your birth plan',
    summary:'Four questions to answer with your family before 36 weeks.',
    body:[
      'A birth plan is simply an answer to four questions, agreed with your family in advance: which facility you will go to, how you will get there, who will come with you, and who to call if labour starts at night.',
      'Your midwife can help you choose a facility if you are unsure, based on your due date and any risk factors noted in your record.',
      'Write the plan down, or save it in this app, so it is easy to act on quickly when the time comes — this is not a moment to be figuring things out for the first time.'] },
  { slug:'what-to-pack', topic:'delivery', status:'published', minutes:2, reviewed:'25 Jul 2026',
    title:'What to pack for the health centre',
    summary:'A short bag list, prepared by 36 weeks.',
    body:[
      'Pack: your antenatal book and ID if you have one, a change of clothes for you and the baby, a krama or blanket, sanitary pads, and a small amount of cash for transport.',
      'Keep the bag somewhere easy to grab — by the door, not at the bottom of a cupboard.',
      'If you go into labour without your bag, that is fine too. Facilities keep basic supplies; the bag is for comfort, not a requirement.'] },
  { slug:'six-week-check', topic:'pnc', status:'published', minutes:2, reviewed:'2 Jul 2026',
    title:'Your six-week recovery check',
    summary:'Why this visit is for you, not only the baby.',
    body:[
      'At six weeks, your health centre checks your recovery — healing, bleeding, mood, and feeding — alongside your baby’s growth. Both checks happen at the same visit.',
      'It is normal to feel tired and to still be adjusting. Bring up anything that worries you, including how you are feeling emotionally; this is a normal and expected part of the visit.',
      'This check also confirms your baby’s first vaccinations are on track.'] },
  { slug:'pnc-warning-signs', topic:'pnc', status:'published', minutes:2, reviewed:'2 Jul 2026',
    title:'Warning signs after delivery',
    summary:'What should send you to the health centre straight away, in plain language.',
    body:[
      'Go to your nearest health centre immediately for: heavy bleeding (soaking a pad in under an hour), a fever, severe headache or blurred vision, or a foul-smelling discharge.',
      'For your baby: difficulty feeding, unusual sleepiness, a fever, fast or difficult breathing, or a yellow tinge to the skin or eyes are all reasons to be seen the same day.',
      'When in doubt, go — a wasted trip costs far less than waiting on something that needed attention.'] },
  { slug:'good-latch', topic:'breastfeeding', status:'published', minutes:2, reviewed:'14 Jun 2026',
    title:'Getting breastfeeding off to a good start',
    summary:'What a comfortable latch looks and feels like in the first days.',
    body:[
      'A good latch takes in not just the nipple but much of the darker skin around it, and should not hurt once your baby settles into feeding.',
      'Skin-to-skin contact right after birth, and feeding on demand rather than a strict schedule, both help breastfeeding get established.',
      'If it is painful throughout a feed, ask a midwife or the helpdesk to check the latch — this is common and usually fixable, not something to push through alone.'] },
  { slug:'exclusive-six-months', topic:'breastfeeding', status:'withdrawn', minutes:2, reviewed:'14 Jun 2026',
    title:'Breastmilk only, for six months',
    summary:'What "exclusive" breastfeeding means in practice.',
    body:[
      'For the first six months, breastmilk alone — no water, rice porridge, or other food — gives your baby everything they need, including enough fluid, even in hot weather.',
      'Feeding often, including at night, is what keeps your milk supply matching your baby’s needs.',
      'If you are separated from your baby, or breastfeeding is not possible, ask your health centre about safe alternatives rather than deciding alone.'] },
  { slug:'vaccination-schedule', topic:'immunization', status:'published', minutes:3, reviewed:'8 Aug 2026',
    title:'Your child’s vaccination schedule',
    summary:'What is given, and roughly when, on the national programme.',
    body:[
      'Cambodia’s national schedule protects against diseases like tuberculosis, hepatitis B, polio, diphtheria, tetanus, whooping cough and measles, given in a series of visits from birth to around 18 months.',
      'Vaccination reminders in this app follow your child’s date of birth automatically — you do not need to track the schedule yourself.',
      'If a visit is missed, it is almost always safe to catch up rather than start over. Ask your health centre for a catch-up plan.'] },
  { slug:'after-vaccination', topic:'immunization', status:'pending_review', minutes:1, reviewed:'8 Aug 2026',
    title:'What to expect after a vaccination',
    summary:'Common, mild reactions — and the rarer signs to act on.',
    body:[
      'A mild fever, fussiness, or soreness where the injection was given are common and usually pass within a day or two.',
      'You can offer extra breastmilk or fluids and dress your baby lightly if they feel warm.',
      'Go to the health centre if a fever is high or lasts more than two days, or if your baby seems unusually unwell — these are uncommon, but worth checking.'] },
  { slug:'choosing-a-method', topic:'family-planning', status:'published', minutes:3, reviewed:'20 May 2026',
    title:'Choosing what is right for your family',
    summary:'An overview of the options available free through your health centre.',
    body:[
      'Cambodian health centres offer several free family planning methods, from short-acting options like the pill and injectable to longer-acting ones like implants and IUDs, plus permanent options for those who want them.',
      'The right choice depends on your health, whether you are breastfeeding, and how soon you might want another child — a midwife or counsellor can talk through the options with you, with no pressure either way.',
      'This is entirely your decision. Nothing here replaces a conversation with a health worker about what suits you.'] },
  { slug:'after-a-birth', topic:'family-planning', status:'draft', minutes:2, reviewed:'20 May 2026',
    title:'When you can start again',
    summary:'A simple explanation of birth spacing and why it is recommended.',
    body:[
      'Waiting at least two years between the birth of one child and the next pregnancy gives your body time to recover and is linked to healthier outcomes for both children.',
      'Some family planning methods are safe to start very soon after birth, even while breastfeeding — ask at your six-week check.',
      'Spacing is a choice you make for your family, not a rule imposed on you.'] },
  { slug:'talking-and-playing', topic:'child-dev', status:'published', minutes:2, reviewed:'11 Jun 2026',
    title:'Talking and playing from day one',
    summary:'Simple, free things you can do every day that help your child’s development.',
    body:[
      'Talking to your baby, even before they can answer, and responding to their sounds and expressions, builds the connections their brain needs.',
      'You do not need toys — a wooden spoon, a bit of cloth, or simply your face and voice are enough for a young baby.',
      'A few minutes of focused play and talk, several times a day, matters more than any single expensive toy.'] },
  { slug:'first-two-years', topic:'child-dev', status:'published', minutes:3, reviewed:'11 Jun 2026',
    title:'Milestones in the first two years',
    summary:'A loose guide to what most children do, and when to ask about a delay.',
    body:[
      'Most babies smile by two months, sit without help by around eight months, and take first steps somewhere between ten and eighteen months — but this range is wide, and normal, healthy children vary a lot.',
      'By two years, most children can say some words and short phrases and understand simple instructions.',
      'If your child is not doing things other children their age are doing, mention it at any check-up. Early conversations lead to earlier support if it is ever needed.'] }
];

export const libraryTopic = s => LIBRARY_TOPICS.find(x=>x.slug===s);
/* Consumer-facing lookups only ever surface the published read-model
   (BRD-01 IR-01-02) — a draft or a withdrawn item is never fetched from
   here, matching a real CMS/app split even though both live in one demo. */
export const libraryItem = s => LIBRARY_ITEMS.find(x=>x.slug===s);
export const itemsInTopic = s => LIBRARY_ITEMS.filter(x=>x.topic===s && x.status==='published');
/* The CMS content queue needs every status, regardless of topic. */
export const allLibraryItems = () => LIBRARY_ITEMS;

/* ============ ask a question: suggested + automated answers ============ */
/* Reuses the public FAQ copy so the automated layer only ever answers from
   an already-approved source — never a novel, generated answer. */
export const SUGGESTED_QUESTIONS = [
  ...FAQ_GROUPS[0][1].slice(0,2),
  ...FAQ_GROUPS[1][1].slice(0,3),
  ...FAQ_GROUPS[2][1].slice(0,2),
  ...FAQ_GROUPS[3][1].slice(0,1)
];

/* Keywords that skip the automated answer and go straight to a person,
   marked urgent. Kept short and plain — this is a demo, not the real list. */
export const URGENT_KEYWORDS = ['bleeding','ឈាមហូរ','pain','ឈឺខ្លាំង','breathe','ដកដង្ហើម','fits','convulsion'];

/* ============ urgent guidance ============ */
export const URGENT_SIGNS = {
  pregnancy: [
    'Heavy vaginal bleeding, or bleeding with pain',
    'Severe headache, blurred vision, or swelling of the face and hands',
    'A fever, or waters breaking before labour starts',
    'Reduced or no movement from the baby',
    'Severe abdominal pain'
  ],
  postpartum: [
    'Heavy bleeding — soaking a pad in under an hour',
    'A fever, severe headache, or foul-smelling discharge',
    'Thoughts of harming yourself, or feeling unable to cope'
  ],
  baby: [
    'Difficulty feeding, or refusing to feed',
    'Fast or difficult breathing, or blue lips',
    'A fever, unusual sleepiness, or a yellow tinge to the skin or eyes',
    'Fits or convulsions'
  ]
};

/* ============ referrals (sample, for the demo dashboard) ============ */
export const REFERRAL_STATUS_STEPS = ['suggested','accepted','contacted','attended','closed'];
export const REFERRALS = [
  { id:'anc-checkup', reason:'A follow-up blood pressure check', reasonKh:'ការត្រួតពិនិត្យសម្ពាធឈាមតាមដាន',
    facility:'Chbar Ampov Health Centre', address:'Chbar Ampov, Phnom Penh', phone:'023 xxx xxx',
    when:'Within 3 days', status:'accepted',
    history:[
      {status:'suggested', date:'1 Sep 2026', note:'Suggested after your last antenatal visit.'},
      {status:'accepted', date:'1 Sep 2026', note:'You confirmed you would go.'}
    ] },
  { id:'newborn-vax', reason:'Your baby’s next vaccination', reasonKh:'ការចាក់វ៉ាក់សាំងបន្ទាប់របស់ទារក',
    facility:'Ta Khmau Referral Hospital', address:'Ta Khmau, Kandal', phone:'024 xxx xxx',
    when:'At your next scheduled visit', status:'attended',
    history:[
      {status:'suggested', date:'10 Aug 2026', note:'Scheduled on the national immunisation calendar.'},
      {status:'accepted', date:'10 Aug 2026', note:'You confirmed you would go.'},
      {status:'attended', date:'14 Aug 2026', note:'The health centre confirmed your visit.'}
    ] },
  { id:'pnc-mood-checkin', reason:'A check-in on how you have been feeling', reasonKh:'ការសាកសួរអំពីអារម្មណ៍របស់អ្នក',
    facility:'Ou Char Health Centre', address:'Ou Char, Battambang', phone:'053 xxx xxx',
    when:'At your next visit', status:'suggested',
    history:[
      {status:'suggested', date:'29 Aug 2026', note:'Suggested by the helpdesk after a conversation with you.'}
    ] }
];
export const referral = id => REFERRALS.find(r=>r.id===id);

/* ============ consent centre ============ */
export const CONSENT_TYPES = [
  { key:'engagement', name:'Health guidance & reminders', kh:'ការណែនាំសុខភាព និងការរំលឹក', required:true, granted:true,
    date:'12 Jun 2026', desc:'Messages timed to your stage, about 2–4 a week, until your child turns two. This is the one permission the service needs to run at all.' },
  { key:'voice', name:'Voice calls', kh:'ការហៅជាសំឡេង', required:false, granted:false,
    date:null, desc:'Automated Khmer voice calls, instead of or alongside text, at most twice a week.' },
  { key:'referral', name:'Sharing for a referral', kh:'ការចែករំលែកសម្រាប់ការបញ្ជូនបន្ត', required:false, granted:true,
    date:'12 Jun 2026', desc:'Let us tell a health centre you are coming when you accept a referral. Asked again, separately, each time.' },
  { key:'alt', name:'An alternate contact', kh:'លេខទំនាក់ទំនងបន្ថែម', required:false, granted:false,
    date:null, desc:'Let us try a second number if we cannot reach you on your first one.' },
  { key:'research', name:'Anonymous programme research', kh:'ការស្រាវជ្រាវកម្មវិធីដោយអនាមិក', required:false, granted:false,
    date:null, desc:'Use information with your name and number removed to help improve the programme. Never shared outside it.' }
];

/* ============================================================
   The rest of this file backs the internal CMS demo (#/cms/…):
   one tool for content, the helpdesk queue, the facility directory,
   staff access and programme analytics/M&E — shown or hidden per
   role rather than split into separate admin/gov and analytics
   systems. Everything below is internal, staff-facing data (not a
   subscriber's personal information), so unlike the rest of this
   file it is fine to show real-looking names.
   ============================================================ */

/* ============ roles ============ */
export const CMS_ROLES = [
  { key:'admin', name:'Programme Admin', kh:'អ្នកគ្រប់គ្រងកម្មវិធី',
    blurb:'MoWA/MoH programme staff. Full access: content, helpdesk, facilities, staff and analytics.' },
  { key:'reviewer', name:'Clinical Reviewer', kh:'អ្នកត្រួតពិនិត្យផ្នែកវេជ្ជសាស្ត្រ',
    blurb:'Ministry of Health. Approves or sends back content before it can publish.' },
  { key:'editor', name:'Content Editor', kh:'អ្នកកែសម្រួលមាតិកា',
    blurb:'Drafts and updates guidance content, and submits it for clinical review.' },
  { key:'analyst', name:'M&E Analyst', kh:'អ្នកវិភាគត្រួតពិនិត្យ និងវាយតម្លៃ',
    blurb:'Programme performance and reporting. Read-only across the board.' }
];
export const cmsRole = key => CMS_ROLES.find(r=>r.key===key);

/* Which sidebar sections each role can see. One CMS, access differs. */
export const CMS_ACCESS = {
  admin:    ['dashboard','content','clients','helpdesk','master','users','integration','reports','orchestration','config'],
  reviewer: ['dashboard','content'],
  editor:   ['dashboard','content'],
  analyst:  ['dashboard','reports']
};

/* Who can move a content item between which states. */
export const CMS_CAN_EDIT   = ['admin','editor'];
export const CMS_CAN_REVIEW = ['admin','reviewer'];

/* ============ content status labels (shared with the content queue) ============ */
export const CONTENT_STATUS_LABEL = {
  published:['Published','បានផ្សព្វផ្សាយ'],
  pending_review:['Pending review','កំពុងរង់ចាំការត្រួតពិនិត្យ'],
  draft:['Draft','សេចក្តីព្រាង'],
  withdrawn:['Withdrawn','បានដកចេញ']
};

/* ============ programme KPIs — the exact measures from BRD-01 §2.2 ============ */
export const KPIS = [
  { key:'enroll_complete', label:'Enrollment completion rate', def:'Started enrollment → consent captured',
    target:'≥ 85%', current:'88%', pct:100, tone:'ok' },
  { key:'consent_anc', label:'Consent capture rate at ANC', def:'Active ENGAGEMENT consent, of enrolled',
    target:'≥ 90% of enrolled', current:'91%', pct:100, tone:'ok' },
  { key:'contact_30d', label:'Successful contact rate (30-day)', def:'≥1 delivered/answered communication',
    target:'≥ 70%', current:'74%', pct:100, tone:'ok' },
  { key:'sessions', label:'On-demand sessions / active user / month', def:'App and QR library sessions',
    target:'≥ 1.5', current:'1.8', pct:100, tone:'ok' },
  { key:'questions', label:'Question submission rate', def:'Users who ask ≥1 question this month',
    target:'8–20% monthly', current:'14%', pct:75, tone:'ok' },
  { key:'optout', label:'Opt-out rate (cumulative, 6 months)', def:'OPTED_OUT ÷ enrolled',
    target:'< 5%', current:'3.2%', pct:64, tone:'ok' },
  { key:'pref_change', label:'Preference change usage', def:'Users who change channel/time at least once',
    target:'≥ 15%', current:'11%', pct:73, tone:'warn' },
  { key:'referral_accept', label:'Referral acceptance rate', def:'User confirms intent, of suggested',
    target:'≥ 50% of suggested', current:'47%', pct:94, tone:'warn' },
  { key:'optout_time', label:'Time to opt-out effect', def:'Event → suppression, across all channels',
    target:'≤ 60 seconds', current:'38s', pct:100, tone:'ok' }
];

/* ============ helpdesk queue (sample cases) ============ */
export const HELPDESK_CASES = [
  { id:'CASE-4822', question:'I have heavy bleeding, what should I do?', from:'Enrolled mother · Kandal',
    channel:'App', priority:'urgent', status:'open', received:'4 Sep 2026' },
  { id:'CASE-4815', question:'My baby is not feeding well — is this urgent?', from:'Enrolled mother · Siem Reap',
    channel:'SMS', priority:'urgent', status:'answered', received:'2 Sep 2026' },
  { id:'CASE-4821', question:'Is it normal to feel very tired at 20 weeks?', from:'Enrolled mother · Kampong Cham',
    channel:'SMS', priority:'normal', status:'answered', received:'3 Sep 2026' },
  { id:'CASE-4790', question:'How do I add my husband as a family supporter?', from:'Enrolled mother · Pursat',
    channel:'App', priority:'normal', status:'open', received:'1 Sep 2026' },
  { id:'CASE-4809', question:'Can I change my contact number?', from:'Enrolled mother · Battambang',
    channel:'Voice', priority:'normal', status:'closed', received:'29 Aug 2026' },
  { id:'CASE-4770', question:'I lost my pregnancy — please stop all messages.', from:'Enrolled mother · Prey Veng',
    channel:'SMS', priority:'urgent', status:'closed', received:'27 Aug 2026' }
];

/* ============ facility directory (read-only, from the shared facility master) ============
   `enrolled` and `referrals30d` are internal operational numbers — CMS-only.
   The public-facing search (publicFacilities()) never exposes them: the spec
   explicitly rules out publishing per-facility performance (NG-07 / BR-125). */
export const FACILITIES = [
  { code:'PP-CHBA-01', name:'Chbar Ampov Health Centre', province:'Phnom Penh', area:'Chbar Ampov', type:'Health Centre',
    services:['Antenatal care','Delivery','Postnatal care','Immunisation','Family planning'], hours:'Mon–Sat 07:00–17:00',
    enrolled:1240, referrals30d:38, phone:'023 890 111' },
  { code:'KD-TAKH-01', name:'Ta Khmau Referral Hospital', province:'Kandal', area:'Ta Khmau', type:'Referral Hospital',
    services:['Delivery','Emergency obstetric care','Postnatal care','Immunisation'], hours:'Open 24 hours',
    enrolled:2110, referrals30d:64, phone:'024 890 222' },
  { code:'BB-OUCH-01', name:'Ou Char Health Centre', province:'Battambang', area:'Ou Char', type:'Health Centre',
    services:['Antenatal care','Postnatal care','Immunisation'], hours:'Mon–Sat 07:00–17:00',
    enrolled:860, referrals30d:21, phone:'053 890 333' },
  { code:'SR-SLKR-01', name:'Slor Kram Health Centre', province:'Siem Reap', area:'Slor Kram', type:'Health Centre',
    services:['Antenatal care','Delivery','Family planning'], hours:'Mon–Sat 07:00–17:00',
    enrolled:975, referrals30d:29, phone:'063 890 444' },
  { code:'RK-BANL-01', name:'Banlung Referral Hospital', province:'Ratanakiri', area:'Banlung', type:'Referral Hospital',
    services:['Delivery','Emergency obstetric care','Immunisation'], hours:'Open 24 hours',
    enrolled:410, referrals30d:12, phone:'075 890 555' },
  { code:'PV-PREY-01', name:'Prey Veng Health Centre', province:'Prey Veng', area:'Prey Veng town', type:'Health Centre',
    services:['Antenatal care','Postnatal care','Family planning'], hours:'Mon–Sat 07:00–17:00',
    enrolled:730, referrals30d:18, phone:'043 890 666' }
];
export const PROVINCES = [...new Set(FACILITIES.map(f=>f.province))].sort();
/* Safe subset for T0 (public, no login) facility search — never enrolment
   counts or referral volume, per NG-07 and BR-125. */
export const publicFacilities = () => FACILITIES.map(({code,name,province,area,type,services,hours,phone})=>
  ({code,name,province,area,type,services,hours,phone}));

export const HELPLINE_NUMBER = '1800 12 3456';
export const HELPLINE_HOURS = '07:00–19:00, every day including weekends';

/* ============ CMS staff & access ============ */
export const STAFF = [
  { name:'Sok Dara', role:'admin', org:'MoWA', status:'active' },
  { name:'Chan Sopheak', role:'reviewer', org:'MoH clinical unit', status:'active' },
  { name:'Ly Sreymom', role:'editor', org:'MoH content team', status:'active' },
  { name:'Heng Vibol', role:'editor', org:'MoH content team', status:'active' },
  { name:'Pich Rathana', role:'analyst', org:'MoWA M&E unit', status:'active' },
  { name:'Chea Sovann', role:'admin', org:'MoH', status:'suspended' }
];

/* ============ WS-2 Client & Operational Data (pseudonymised sample) ============
   Real subscriber names and numbers are never shown in this tool — a
   service_ref stands in, and the phone stays masked until someone gives a
   reason to unmask it. Each unmask is meant to be logged (see AUDIT_SAMPLE). */
export const CLIENT_SAMPLE = [
  { ref:'MC-7QK2', stage:'Pregnant · week 22', facility:'Chbar Ampov Health Centre', verification:'verified', consent:'active', phoneMasked:'012 xxx x45' },
  { ref:'MC-3PL9', stage:'Postpartum · week 3', facility:'Ta Khmau Referral Hospital', verification:'verified', consent:'active', phoneMasked:'098 xxx x12' },
  { ref:'MC-9DF4', stage:'Child · 6 months', facility:'Ou Char Health Centre', verification:'verified', consent:'active', phoneMasked:'077 xxx x88' },
  { ref:'MC-1XN7', stage:'Pregnant · week 9', facility:'—', verification:'provisional', consent:'active', phoneMasked:'016 xxx x33' },
  { ref:'MC-5TR2', stage:'Child · 18 months', facility:'Slor Kram Health Centre', verification:'verified', consent:'paused', phoneMasked:'070 xxx x21' },
  { ref:'MC-8WY6', stage:'Pregnant · week 31', facility:'Banlung Referral Hospital', verification:'verified', consent:'active', phoneMasked:'011 xxx x64' }
];

/* ============ WS-3 Master Data: controlled value lists (a sample) ============ */
export const CONTROLLED_LISTS = [
  { name:'Referral reason category (non-diagnostic)', values:['Routine antenatal check','Blood pressure follow-up','Nutrition follow-up','Delivery preparation','Postnatal check','Immunisation'] },
  { name:'Missed-appointment reason', values:['Transport','Cost','Time / work','Unaware','Served elsewhere','Other'] },
  { name:'Support referral category', values:['Protection','Psychosocial','Child protection','Socioeconomic','Legal / family','Disability'] },
  { name:'Content topic', values:['ANC','Nutrition','Delivery preparation','PNC','Breastfeeding','Immunisation','Family planning','Child development'] }
];

/* ============ WS-5 Integration & Data Quality (status, no live systems yet) ============ */
export const INTEGRATIONS = [
  { id:'API-01', name:'Facility Master Sync', direction:'in', level:0, status:'connected', lastSync:'4 Sep 2026, 06:00' },
  { id:'API-02', name:'Referral Directory Sync', direction:'in', level:0, status:'connected', lastSync:'4 Sep 2026, 06:00' },
  { id:'API-03', name:'Aggregate Denominator Extract', direction:'in', level:1, status:'pending', lastSync:'—' },
  { id:'API-05', name:'ANC Event', direction:'in', level:2, status:'not_configured', lastSync:'—' },
  { id:'API-06', name:'Delivery Event', direction:'in', level:2, status:'not_configured', lastSync:'—' },
  { id:'API-08', name:'Immunization Event', direction:'in', level:2, status:'not_configured', lastSync:'—' },
  { id:'API-10', name:'Channel Gateway (SMS/IVR)', direction:'in/out', level:0, status:'connected', lastSync:'4 Sep 2026, 14:02' }
];
export const INTEGRATION_QUEUE = { queued:6, deadLetter:0, reconciliation:2 };

/* ============ WS-6 Reports & Audit ============ */
export const REPORT_CATEGORIES = [
  'Coverage & enrolment','Reach & communication','Appointments','Content',
  'Helpdesk & quality','Referrals','Lifecycle','Equity & cost','Data quality'
];
export const AUDIT_SAMPLE = [
  { at:'4 Sep 2026 14:02', actor:'Sok Dara (admin)', action:'CNT-APPROVE', subject:'after-a-birth v1', note:'Approved & published' },
  { at:'4 Sep 2026 09:41', actor:'system', action:'MSG-SUPPRESS', subject:'MC-5TR2', note:'Quiet hours (21:00–07:00)' },
  { at:'3 Sep 2026 18:20', actor:'Helpdesk operator', action:'CASE-ESCALATE', subject:'CASE-4822', note:'Danger-sign keyword detected' },
  { at:'3 Sep 2026 11:05', actor:'Chan Sopheak (reviewer)', action:'CNT-REJECT', subject:'foods-to-limit v2', note:'Sent back to draft' },
  { at:'2 Sep 2026 08:30', actor:'Pich Rathana (analyst)', action:'RPT-RUN', subject:'Coverage & enrolment', note:'Monthly export requested' }
];

/* ============ WS-7 Configuration — parameters editable without a code release ============ */
export const CONFIG_PARAMS = [
  { key:'quiet_hours', label:'Quiet hours', value:'21:00–07:00' },
  { key:'freq_cap', label:'Frequency cap (routine, combined across episodes)', value:'3 messages / week' },
  { key:'freq_cap_supporter', label:'Frequency cap (family supporter)', value:'1 message / week' },
  { key:'reminder_offsets', label:'Appointment reminder offsets', value:'H-7, H-1, H-0' },
  { key:'missed_grace', label:'Missed-appointment grace period', value:'14 days' },
  { key:'max_channel_attempts', label:'Max attempts per channel before fallback', value:'3' },
  { key:'nonresponse_threshold', label:'Non-response threshold to reduce frequency', value:'4 in a row' },
  { key:'dup_suppress', label:'Cross-channel duplicate suppression window', value:'24 hours' },
  { key:'ivr_target', label:'Target outbound IVR call length', value:'90 seconds' },
  { key:'helpdesk_first_response', label:'Helpdesk first-response SLA', value:'1 business day' },
  { key:'helpdesk_resolution', label:'Helpdesk resolution SLA', value:'5 business days' },
  { key:'urgent_referral_sla', label:'Urgent referral time to "contacted"', value:'24 hours' },
  { key:'cert_validity', label:'Staff certification validity', value:'12 months' },
  { key:'invite_expiry', label:'Account invitation expiry', value:'72 hours' },
  { key:'max_pause', label:'Maximum client-requested pause', value:'8 weeks' },
  { key:'max_supporters', label:'Max active family supporters per client', value:'2' },
  { key:'public_cell_min', label:'Minimum cell size on public outputs', value:'10' }
];

/* ============ Dashboard analytics: headline numbers, by stage, by province ============
   These tie together everywhere the CMS talks about "how many users":
   the Dashboard, Clients & Data, and Reports & Audit all read from the
   same two arrays, so the story stays consistent page to page. */
export const STAGE_COUNTS = [
  { key:'pregnant', label:'Pregnant', kh:'មានផ្ទៃពោះ', count:1840 },
  { key:'postpartum', label:'Postpartum (0–6 weeks)', kh:'ក្រោយសម្រាល', count:410 },
  { key:'baby_0_6', label:'Baby 0–6 months', kh:'ទារក ០–៦ ខែ', count:960 },
  { key:'baby_6_12', label:'Baby 6–12 months', kh:'ទារក ៦–១២ ខែ', count:870 },
  { key:'child_1_2', label:'Child 1–2 years', kh:'កុមារ ១–២ ឆ្នាំ', count:1310 },
  { key:'graduated', label:'Graduated', kh:'បញ្ចប់កម្មវិធី', count:2140 }
];
export const TOTAL_CLIENTS = STAGE_COUNTS.reduce((a,s)=>a+s.count, 0);

export const ENROLLMENT_BY_PROVINCE = [
  { province:'Phnom Penh', count:2380 },
  { province:'Kandal', count:1560 },
  { province:'Kampong Cham', count:1190 },
  { province:'Battambang', count:980 },
  { province:'Siem Reap', count:870 },
  { province:'Prey Veng', count:640 },
  { province:'Takeo', count:590 },
  { province:'Ratanakiri', count:220 }
];

export const CHANNEL_MIX = [
  { channel:'SMS', pct:58 },
  { channel:'Voice / IVR', pct:24 },
  { channel:'App', pct:18 }
];

export const ENROLMENT_ROUTES = [
  { route:'Facility (midwife)', pct:64 },
  { route:'Self-enrolment (QR/SMS)', pct:22 },
  { route:'Community (VHSG)', pct:10 },
  { route:'Postpartum', pct:4 }
];

/* ============================================================
   The rest of this file aligns the demo with the End-to-End
   Implementation Blueprint (5 Sep 2026), which supersedes the
   earlier BRD/system-build-spec documents as the reference. It adds
   the Orchestration console's suppression registry (§5.2), evidence
   classes for every analytics figure (§6.7), and the Facility Portal
   (§6.2) — a surface that did not exist in this demo before.
   ============================================================ */

/* ============ orchestrator: suppression registry (§5.2) ============
   The exact table from the blueprint — codes are frozen vocabulary,
   never paraphrased, because they are what an operator or an auditor
   greps for in a real incident. */
export const SUPPRESSION_REGISTRY = [
  { code:'OPT_OUT', condition:'Subscriber opted out', override:'None' },
  { code:'SENSITIVE_SUPPRESSED', condition:'Episode flagged (loss, stillbirth, infant death)', override:'Clinical review only' },
  { code:'PAUSED', condition:'User or helpdesk pause', override:'Auto-resume at end date' },
  { code:'CONSENT_MISSING', condition:'No active consent of the required type', override:'None' },
  { code:'CHANNEL_CONSENT_MISSING', condition:'e.g. IVR job without VOICE_CALL consent', override:'Falls back to a consented channel' },
  { code:'QUIET_HOURS', condition:'Outside 06:00–21:00 ICT', override:'URGENT_PROTOCOL only' },
  { code:'FREQUENCY_CAP', condition:'4 routine/week, 2 IVR/week, 2/day, 4h minimum gap', override:'Urgent exempt' },
  { code:'DUPLICATE_CONTENT', condition:'Same content_id already delivered on any channel in window', override:'None' },
  { code:'EVENT_RESOLVED', condition:'The service event the reminder targets has been recorded', override:'None' },
  { code:'STAGE_TRANSITIONED', condition:'Subscriber left the rule’s stage after scheduling', override:'None' },
  { code:'CONTENT_UNAVAILABLE', condition:'Content held, withdrawn, or audio stale for that channel', override:'None' },
  { code:'NO_VALID_CONTACT', condition:'Repeated hard failures', override:'Helpdesk correction' },
  { code:'BUDGET_GUARDRAIL', condition:'Channel budget exhausted', override:'Routine only; important and urgent continue' }
];
/* A day's worth of sample suppression events — every suppression is
   counted and reported, never silent (§5.2). */
export const SUPPRESSION_EVENTS_TODAY = [
  { code:'QUIET_HOURS', count:412 },
  { code:'FREQUENCY_CAP', count:96 },
  { code:'EVENT_RESOLVED', count:58 },
  { code:'DUPLICATE_CONTENT', count:21 },
  { code:'STAGE_TRANSITIONED', count:14 },
  { code:'OPT_OUT', count:6 },
  { code:'SENSITIVE_SUPPRESSED', count:1 }
];

/* ============ analytics: evidence class per figure (§6.7) ============
   "Every figure carries a denominator, a source, and an evidence
   class. A figure without all three does not render." */
export const EVIDENCE_CLASS = {
  administrative: { en:'Administrative count', km:'ចំនួនរដ្ឋបាល', tone:'solid',
    note:{en:'Verified MoH/facility activity', km:'សកម្មភាពដែលបានផ្ទៀងផ្ទាត់ពីមណ្ឌលសុខភាព/MoH'} },
  captured: { en:'Captured indicator', km:'សូចនាករដែលបានចាប់យក', tone:'amber',
    note:{en:'In HIS — absolute figure not yet supplied (DPHI extract required)', km:'នៅក្នុង HIS — តួលេខពិតប្រាកដមិនទាន់ផ្តល់ (ត្រូវការទិន្នន័យពី DPHI)'} },
  projection: { en:'Population projection', km:'ការព្យាករណ៍ចំនួនប្រជាជន', tone:'striped',
    note:{en:'Projection, not service activity', km:'ការព្យាករណ៍ មិនមែនសកម្មភាពសេវាទេ'} },
  engagement: { en:'Engagement metric', km:'សូចនាករការចូលរួម', tone:'standard',
    note:{en:'Produced by Mami Care', km:'ផលិតដោយ Mami Care'} }
};
/* Every existing programme KPI is an engagement metric — produced by
   Mami Care itself, over its own denominator. */
export const KPI_EVIDENCE = {
  enroll_complete:{evidence:'engagement', denominator:'Started enrolment, this OD', source:'Mami Care core'},
  consent_anc:{evidence:'engagement', denominator:'Enrolled at ANC, this OD', source:'Mami Care consent ledger'},
  contact_30d:{evidence:'engagement', denominator:'Active subscribers, 30-day window', source:'Mami Care orchestrator'},
  sessions:{evidence:'engagement', denominator:'Active users this month', source:'Mami Care client app'},
  questions:{evidence:'engagement', denominator:'Enrolled subscribers this month', source:'Mami Care helpdesk'},
  optout:{evidence:'engagement', denominator:'Ever-enrolled, 6-month cohort', source:'Mami Care consent ledger'},
  pref_change:{evidence:'engagement', denominator:'Enrolled subscribers, 6-month cohort', source:'Mami Care core'},
  referral_accept:{evidence:'engagement', denominator:'Referrals suggested this OD', source:'Mami Care referral service'},
  optout_time:{evidence:'engagement', denominator:'Opt-out events, this OD', source:'Mami Care orchestrator'}
};
/* Two figures that are deliberately NOT engagement metrics, to show
   the distinction the evidence-class rule exists to make. */
export const HEADLINE_FIGURES = [
  { key:'anc1_projected', label:'Eligible population (2026 ANC1 projection)', value:'354,238',
    evidence:'projection', denominator:'National, 2026 planning estimate', source:'MoH demographic projection' },
  { key:'anc1_verified', label:'Verified ANC1 registrations (facility-reported)', value:'—',
    evidence:'captured', denominator:'Facility master, this OD', source:'DPHI facility-month extract (not yet supplied)' },
  { key:'enrolled_total', label:'Enrolled in Mami Care', value:String(TOTAL_CLIENTS),
    evidence:'engagement', denominator:'Cumulative, this OD', source:'Mami Care core' }
];

/* The funnel is the analytics landing view (§6.7): eligible → reachable
   → consented → enrolled → delivered → engaged → referred → service
   completion → continuity. Figures fall off at each stage; that is
   the point of a funnel, not a defect. */
export const FUNNEL = [
  { stage:'Eligible', value:100, note:'ANC1 projection for this OD' },
  { stage:'Reachable', value:88, note:'Has a working contact channel' },
  { stage:'Consented', value:74, note:'Active ENGAGEMENT consent' },
  { stage:'Enrolled', value:71, note:'Provisional + verified' },
  { stage:'Delivered', value:66, note:'≥1 message successfully delivered' },
  { stage:'Engaged', value:52, note:'Opened, listened to, or replied' },
  { stage:'Referred', value:19, note:'A referral was suggested' },
  { stage:'Service completion', value:12, note:'Referral closed as attended' },
  { stage:'Continuity', value:9, note:'Still active at next stage transition' }
];

/* ============ cost model (§10) — placeholders, replace with telco quotes ============ */
export const COST_MODEL = {
  rates: [
    { channel:'SMS, Khmer (UCS-2)', unit:'per 70-char segment', rate:'$0.0091' },
    { channel:'SMS, English (GSM-7)', unit:'per 160-char segment', rate:'$0.0091' },
    { channel:'IVR', unit:'per 30 seconds', rate:'$0.0240' },
    { channel:'IP messaging', unit:'per message', rate:'$0.0012' },
    { channel:'Web / QR content', unit:'per session', rate:'~$0.0000' }
  ],
  /* Blueprint v1.1 §0.1 correction: v1.0 claimed IVR was "~30% of cost
     for ~6% of contacts" — recomputing from the model's own assumptions
     (2.5 msgs/week × ~104 weeks, 70/30 SMS·IP split, 2 segments per
     Khmer SMS, 6 IVR calls/year at 60s) gives ~$3.98 total per
     subscriber over 24 months (~$3.31 SMS, ~$0.09 IP, ~$0.58 IVR) and
     an IVR share of ~15% of cost for ~4% of contacts (12 IVR calls out
     of ~272 total contacts) — not 30%/6%. The policy point survives:
     IVR is still 3–4× overrepresented in cost relative to how often
     it's used, just not at the originally claimed magnitude. */
  perSubscriber24mo: '$3.90–$4.60',
  ivrShareOfCost: '~15%',
  ivrShareOfContacts: '~4%',
  /* The worked example behind the figures above (§10.2): one subscriber,
     24 months, ~$3.98 total. */
  assumptions: [
    { label:'Routine messages per week', value:'2.5 (after caps and suppression)' },
    { label:'Weeks of engagement', value:'~104' },
    { label:'Average segments per Khmer SMS', value:'2' },
    { label:'Share delivered on SMS vs IP', value:'70% / 30%' },
    { label:'IVR calls per subscriber per year', value:'6, averaging 60 seconds' }
  ],
  breakdown: [
    { channel:'SMS', cost:'~$3.31' },
    { channel:'IP messaging', cost:'~$0.09' },
    { channel:'IVR', cost:'~$0.58' }
  ],
  scenarios: [
    { scale:'Pilot', subscribers:'15,000–40,000', note:'2 ODs, mixed urban/rural' },
    { scale:'Provincial', subscribers:'150,000', note:'' },
    { scale:'National', subscribers:'400,000', note:'Roughly the annual ANC1 cohort' }
  ]
};

/* ============ SMS/IVR channel-variant authoring helpers (§6.4) ============
   "Live Khmer segment counter — 70 chars per UCS-2 segment, with cost
   per 100,000 sends shown at authoring time" and "IVR duration
   estimate — live, as the script is typed." Used by the CMS content
   composer (live, on every keystroke) and rendered once, statically,
   wherever a saved variant is displayed. */
export const SMS_SEGMENT_CHARS = 70; // UCS-2 (Khmer) — §6.4, §10.1
export const IVR_CHARS_PER_SECOND = 12; // rough Khmer read-aloud pace — placeholder, replace with a real TTS timing check before use
export const IVR_ROUTINE_CAP_SECONDS = 90; // §5.3 — routine IVR calls are hard-capped here

export function smsSegments(text){
  const len = (text||'').trim().length;
  return len ? Math.ceil(len / SMS_SEGMENT_CHARS) : 0;
}
export function smsCostPer100k(text){
  const entry = COST_MODEL.rates.find(r=>r.channel==='SMS, Khmer (UCS-2)');
  const rate = entry ? parseFloat(entry.rate.replace('$','')) : 0.0091;
  return smsSegments(text) * rate * 100000;
}
export function ivrDurationSeconds(text){
  const len = (text||'').trim().length;
  return len ? Math.ceil(len / IVR_CHARS_PER_SECOND) : 0;
}
export function formatDuration(totalSeconds){
  const s = Math.max(0, totalSeconds|0);
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}

/* ============ Facility Portal (§6.2) — a surface that did not exist
   in this demo before. Midwife-facing, offline-first, hard 90-second
   enrolment budget. Kept separate from the CMS: it is a categorically
   different, operational surface, not an admin console. ============ */
/* Worklist categories only — no `count` here any more. Each count is
   derived live from the sample rows below (or, for 'provisional', from
   those rows plus whichever profile this browser session is currently
   acting as), so the badge on Today never drifts from what the list
   page actually shows. */
export const FACILITY_WORKLIST = [
  { key:'provisional', label:'Provisional, awaiting verification', kh:'បណ្តោះអាសន្ន រង់ចាំផ្ទៀងផ្ទាត់', tone:'brand' },
  { key:'edd_passed', label:'EDD passed without a report', kh:'ហួសកាលបរិច្ឆេទ គ្មានរបាយការណ៍', tone:'warn' },
  { key:'missed', label:'Missed appointments', kh:'ខកខានការណាត់ជួប', tone:'warn' },
  { key:'referrals_open', label:'Referrals open more than 7 days', kh:'ការបញ្ជូនបន្តបើកលើសពី ៧ថ្ងៃ', tone:'warn' }
];
export const FACILITY_NAME = 'Chbar Ampov Health Centre';
export const FACILITY_CODE = 'PP-CHBA-01';

/* ============ Facility Portal worklist detail (§6.2) — masked sample
   rows behind each worklist count, scoped to this one facility. Same
   masking rule as everywhere else in this demo: a reference code, a
   masked phone number, and just enough context to recognise the right
   person standing in front of you — never a name, never a full number,
   never a clinical fact. `verified`/`followedUp` are mutated in place
   as the midwife works through the list, same pattern as the CMS
   helpdesk queue. */
export const FACILITY_PROVISIONAL_SAMPLE = [
  { ref:'MC-7F2Q', phoneMasked:'092 xxx x14', stage:'Pregnant · week 10', enrolledVia:'Self-enrolment (SMS)', daysWaiting:2, verified:false },
  { ref:'MC-4KD8', phoneMasked:'016 xxx x77', stage:'Pregnant · week 6', enrolledVia:'Self-enrolment (QR)', daysWaiting:5, verified:false },
  { ref:'MC-1PX3', phoneMasked:'070 xxx x02', stage:'Postpartum · week 1', enrolledVia:'Self-enrolment (SMS)', daysWaiting:1, verified:false }
];
export const FACILITY_EDD_PASSED = [
  { ref:'MC-2RT5', phoneMasked:'098 xxx x41', stage:'Pregnant · EDD was 3 Sep 2026', daysOverdue:3, followedUp:false },
  { ref:'MC-6LB9', phoneMasked:'077 xxx x28', stage:'Pregnant · EDD was 30 Aug 2026', daysOverdue:7, followedUp:false }
];
export const FACILITY_MISSED = [
  { ref:'MC-3HN1', phoneMasked:'012 xxx x90', stage:'Pregnant · week 26', appointment:'Routine antenatal check', daysMissed:2, followedUp:false },
  { ref:'MC-8QF4', phoneMasked:'096 xxx x36', stage:'Child · 9 months', appointment:'Immunisation', daysMissed:6, followedUp:false },
  { ref:'MC-5VC7', phoneMasked:'015 xxx x63', stage:'Postpartum · week 4', appointment:'Postnatal check', daysMissed:1, followedUp:false }
];
export const FACILITY_REFERRALS_OPEN = [
  { ref:'MC-4DJ2', phoneMasked:'089 xxx x17', stage:'Pregnant · week 33', reason:'Delivery preparation', daysOpen:9, followedUp:false }
];

/* ============ Facility Portal: clients already enrolled here ============
   The "history" view — read-only, masked, this facility only. No
   unmask control here (unlike the CMS): a shared clinic device gets
   less access than a programme admin, not the same access. */
export const FACILITY_CLIENTS = [
  { ref:'MC-7QK2', phoneMasked:'012 xxx x45', stage:'Pregnant · week 22', verification:'verified', consent:'active', enrolled:'18 Jul 2026' },
  { ref:'MC-2NB6', phoneMasked:'081 xxx x23', stage:'Postpartum · week 5', verification:'verified', consent:'active', enrolled:'2 Jun 2026' },
  { ref:'MC-9YT1', phoneMasked:'093 xxx x88', stage:'Child · 4 months', verification:'verified', consent:'active', enrolled:'14 Apr 2026' },
  { ref:'MC-5MC4', phoneMasked:'068 xxx x50', stage:'Pregnant · week 15', verification:'verified', consent:'paused', enrolled:'9 Aug 2026' }
];

/* ============ Facility Portal: the credentialed user of this device ============
   Sign-in is simulated (facility-state.js), but the worklist and the
   verify flow both read as though a specific named, credentialed
   midwife is at the wheel — because on a real shared device, one
   always is. */
export const FACILITY_STAFF = { name:'Sok Ratana', role:'Midwife', staffCode:'MW-1042' };

/* ============ helpdesk composer safety gate (§6.3) ============
   An operator may send only an approved item, an approved macro, or
   free text containing no health instruction. This lexicon stands in
   for the real check: medication names, dosage patterns and
   diagnostic phrasing are blocked before send, with no self-override. */
export const FORBIDDEN_HEALTH_TERMS = [
  'paracetamol','ibuprofen','amoxicillin','antibiotic','mg','milligram','dose','dosage','tablet twice',
  'you have','diagnosed with','it is likely','this means you','take this medicine','stop taking'
];

/* ============ the nine MoH/DPHI decisions (§16) ============
   Blueprint v1.1 §0.1 correction #3: v1.0 lumped decisions 1, 2, 7 and 8
   together as things that "block the pilot build," but the guidance for
   7 and 8 describes how to keep building without waiting for them — so
   `blocks` distinguishes what each decision actually gates: 'build'
   (there is no clinical authority to publish against, or no facility
   master to enrol against, without it), 'launch' (the engineering can
   and should proceed now; only going live with real subjects waits),
   or 'integration' (Level 2 only — never a pilot dependency). */
export const PROGRAMME_DECISIONS = [
  { n:1, decision:'Service owner and clinical content authority', unblocks:'Content approval, orchestration rule approval',
    meanwhile:'Draft content against WHO/MoH published guidance; nominate a candidate owner', blocks:'build' },
  { n:2, decision:'Official facility master and stable codes', unblocks:'Facility portal, admin, analytics, gateway',
    meanwhile:'Build the sync mechanism against a sample file', blocks:'build' },
  { n:3, decision:'ANC enrolment minimum field set', unblocks:'Facility portal',
    meanwhile:'Build the wizard against the 7-field set now; it is designed to shrink, not grow', blocks:'launch' },
  { n:4, decision:'Person-level digitisation of ANC/delivery/PNC registers', unblocks:'Integration Level 2',
    meanwhile:'Build Level 0 fully. Do not wait.', blocks:'integration' },
  { n:5, decision:'Mother and child identifiers', unblocks:'Integration Level 2, dedup',
    meanwhile:'Use internal UUID + msisdn_hash; the design already assumes no MoH identifier', blocks:'integration' },
  { n:6, decision:'Service event access and latency', unblocks:'Event-driven suppression',
    meanwhile:'Use self-report and facility-report events; sufficient for the pilot', blocks:'integration' },
  { n:7, decision:'Consent and notice legal basis', unblocks:'Pilot launch readiness',
    meanwhile:'Build to the strictest reading now — the ledger design does not change with the answer, only going live with real subjects waits', blocks:'launch' },
  { n:8, decision:'Referral directory and closure ownership', unblocks:'Pilot launch readiness',
    meanwhile:'Build the directory structure with freshness thresholds now; closure cannot run live until ownership is assigned', blocks:'launch' },
  { n:9, decision:'2023–2025 + 2026 YTD facility-month extracts', unblocks:'Analytics denominators, sizing',
    meanwhile:'Submit the request now — the highest-leverage single action available', blocks:'launch' }
];
export const DECISION_BLOCK_LABEL = {
  build: { en:'Blocks the build', km:'ទប់ស្កាត់ការសាងសង់ប្រព័ន្ធ', tone:'urgent' },
  launch: { en:'Blocks pilot launch only', km:'ទប់ស្កាត់តែការចាប់ផ្តើមសាកល្បង', tone:'warn' },
  integration: { en:'Blocks integration only — never a pilot dependency', km:'ទប់ស្កាត់តែការធ្វើសមាហរណកម្ម', tone:'ok' }
};
