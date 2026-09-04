/* Language state (0 = English, 1 = Khmer) and copy dictionary. */

export let LANG = 0;                      /* 0 = English, 1 = ភាសាខ្មែរ */

export function setLang(v){ LANG = v; }
export function toggleLang(){ LANG = LANG ? 0 : 1; }

export const T = {
  nav_home:['Home','ទំព័រដើម'],
  nav_services:['Services','សេវាកម្ម'],
  nav_who:["Who it's for",'សម្រាប់អ្នកណា'],
  nav_journey:['Your journey','ដំណើររបស់អ្នក'],
  nav_news:['News','ព័ត៌មាន'],
  nav_faq:['Questions','សំណួរ'],
  nav_about:['About us','អំពីយើង'],
  login:['Log in','ចូលគណនី'],
  join:['Join free','ចុះឈ្មោះឥតគិតថ្លៃ'],
  menu:['Menu','ម៉ឺនុយ'],
  close:['Close','បិទ'],

  hero_badge:['A free national service','សេវាជាតិ ឥតគិតថ្លៃ'],
  hero_kicker:['ការថែទាំម្តាយ ដែលដើរតាមអ្នកគ្រប់ពេល','Care that follows her, from pregnancy to her child’s second birthday.'],
  hero_lede:['Free guidance in Khmer, on any phone. You choose what arrives, and you can stop with one word.',
             'ការណែនាំឥតគិតថ្លៃ ជាភាសាខ្មែរ លើទូរស័ព្ទគ្រប់ប្រភេទ។ អ្នកជ្រើសរើសអ្វីដែលចង់ទទួល ហើយឈប់បានគ្រប់ពេល។'],
  hero_cta2:['Explore services','មើលសេវាកម្ម'],
  pill1:['Always free','ឥតគិតថ្លៃជានិច្ច'],
  pill2:['Works on a basic phone','ប្រើបានលើទូរស័ព្ទធម្មតា'],
  pill3:['Khmer voice available','មានសំឡេងជាភាសាខ្មែរ'],

  eb_start:['Start here','ចាប់ផ្តើមទីនេះ'],
  h_iam:['I am…','ខ្ញុំគឺជា…'],
  p_iam:['Pick the one that fits you today. You can change it whenever your situation changes.',
         'ជ្រើសរើសមួយដែលត្រូវនឹងអ្នកថ្ងៃនេះ។ អ្នកអាចប្តូរបានគ្រប់ពេល។'],
  eb_services:['Services','សេវាកម្ម'],
  h_services:['Six things Mami Care does for you.','សេវាកម្មទាំង ៦ សម្រាប់អ្នក'],
  p_services:['All free, all in Khmer, all optional.','ទាំងអស់ឥតគិតថ្លៃ ជាភាសាខ្មែរ និងតាមការស្ម័គ្រចិត្ត។'],
  eb_how:['How it works','របៀបដំណើរការ'],
  h_how:['One continuous journey — not another app to fill in.','ដំណើរតែមួយជាប់លាប់ មិនមែនកម្មវិធីថ្មីមួយទៀតទេ។'],
  p_how:['Mami Care connects you to the care you already use. It never replaces your antenatal book or your clinic file.',
         'Mami Care ភ្ជាប់អ្នកទៅសេវាសុខភាពដែលអ្នកប្រើស្រាប់។ វាមិនជំនួសសៀវភៅពិនិត្យផ្ទៃពោះរបស់អ្នកទេ។'],
  eb_journey:['Your journey','ដំណើររបស់អ្នក'],
  h_journey:['Tap a stage to see what arrives.','ចុចដំណាក់កាលមួយ ដើម្បីមើលអ្វីដែលនឹងមកដល់។'],
  p_journey:['Mami Care follows your due date and your child’s age — you never have to keep track yourself.',
             'Mami Care តាមដានថ្ងៃកំណត់សម្រាល និងអាយុកូនរបស់អ្នក — អ្នកមិនចាំបាច់តាមដានដោយខ្លួនឯងទេ។'],
  eb_news:['News','ព័ត៌មាន'],
  h_news:['What is happening with Mami Care.','មានអ្វីកើតឡើងជាមួយ Mami Care។'],
  all_news:['All news','ព័ត៌មានទាំងអស់'],
  eb_choices:['Your choices','ជម្រើសរបស់អ្នក'],
  h_choices:['You are in control of every message.','អ្នកគ្រប់គ្រងគ្រប់សារទាំងអស់។'],
  full_promise:['Read the full promise','អានការសន្យាពេញលេញ'],
  eb_reach:['How we reach you','របៀបដែលយើងទាក់ទងអ្នក'],
  h_reach:['Four ways in.','មធ្យោបាយទាំង ៤'],

  f1t:['You join','អ្នកចុះឈ្មោះ'],
  f1p:['A midwife enrols you at your antenatal visit, or you scan a poster, or you send one text.',
       'ឆ្មបចុះឈ្មោះឱ្យអ្នកនៅពេលពិនិត្យផ្ទៃពោះ ឬអ្នកស្កេនផ្ទាំងរូបភាព ឬផ្ញើសារតែមួយ។'],
  f1s:['About 2 minutes','ប្រហែល ២ នាទី'],
  f2t:['Real events move you along','ព្រឹត្តិការណ៍ពិតជំរុញដំណើររបស់អ្នក'],
  f2p:['Your due date, the birth, a postnatal check or a vaccination — each one updates what reaches you next.',
       'ថ្ងៃកំណត់សម្រាល ការសម្រាល ការពិនិត្យក្រោយសម្រាល ឬការចាក់វ៉ាក់សាំង — នីមួយៗប្តូរអ្វីដែលនឹងមកដល់បន្ទាប់។'],
  f2s:['You never update it yourself','អ្នកមិនចាំបាច់ធ្វើដោយខ្លួនឯងទេ'],
  f3t:['You ask, we answer','អ្នកសួរ យើងឆ្លើយ'],
  f3p:['Send a question any time. Common ones are answered straight away; the rest go to a Khmer-speaking operator.',
       'ផ្ញើសំណួរបានគ្រប់ពេល។ សំណួរធម្មតាទទួលចម្លើយភ្លាមៗ ឯសំណួរផ្សេងទៀតបញ្ជូនទៅបុគ្គលិកនិយាយភាសាខ្មែរ។'],
  f3s:['Free, seven days a week','ឥតគិតថ្លៃ ៧ ថ្ងៃក្នុងមួយសប្តាហ៍'],
  f4t:['We point you to care','យើងណែនាំកន្លែងព្យាបាល'],
  f4p:['When you need to be seen we show you where to go, and — only with your permission — let the facility know you are coming.',
       'ពេលអ្នកត្រូវការពិនិត្យ យើងបង្ហាញកន្លែងត្រូវទៅ ហើយ — ដោយមានការអនុញ្ញាតពីអ្នកប៉ុណ្ណោះ — ជូនដំណឹងដល់មណ្ឌលសុខភាព។'],
  f4s:['You decide what is shared','អ្នកសម្រេចថាចែករំលែកអ្វី'],
  f5t:['The health centre confirms','មណ្ឌលសុខភាពបញ្ជាក់'],
  f5p:['Your health centre confirms you were seen, so nobody chases you about a visit you already made.',
       'មណ្ឌលសុខភាពបញ្ជាក់ថាអ្នកបានមកពិនិត្យ ដូច្នេះគ្មាននរណារំលឹកអ្នកអំពីការណាត់ដែលអ្នកបានទៅរួចទេ។'],
  f5s:['Your record stays with them','កំណត់ត្រារបស់អ្នកនៅជាមួយពួកគេ'],
  how_note:['<strong>Mami Care is not a medical record.</strong> Your antenatal book, your clinic file and your health history stay with your health centre and the Ministry of Health, exactly as they are today. Mami Care keeps you connected to them — with guidance, reminders, someone to ask, and a way back to care.',
            '<strong>Mami Care មិនមែនជាកំណត់ត្រាវេជ្ជសាស្ត្រទេ។</strong> សៀវភៅពិនិត្យផ្ទៃពោះ ឯកសារនៅមណ្ឌលសុខភាព និងប្រវត្តិសុខភាពរបស់អ្នក នៅជាមួយមណ្ឌលសុខភាព និងក្រសួងសុខាភិបាលដដែល។ Mami Care គ្រាន់តែភ្ជាប់អ្នកទៅពួកគេ។'],

  c1t:['You choose what you get','អ្នកជ្រើសរើសអ្វីដែលអ្នកទទួល'],
  c1p:['Health guidance, voice calls, sharing with your clinic — each is a separate yes, and each can be taken back.',
       'ការណែនាំសុខភាព ការហៅជាសំឡេង ការចែករំលែកទៅមណ្ឌលសុខភាព — នីមួយៗជាការយល់ព្រមដាច់ដោយឡែក ហើយអាចដកវិញបាន។'],
  c2t:['Nothing at night','គ្មានសារពេលយប់'],
  c2p:['No message or call between 9pm and 6am.','គ្មានសារ ឬការហៅ ចន្លោះម៉ោង ៩ យប់ ដល់ ៦ ព្រឹក។'],
  c3t:['Never a cost to you','មិនអស់លុយ'],
  c3p:['Messages and helpline calls are free on every network.','សារ និងការហៅទៅខ្សែជំនួយ ឥតគិតថ្លៃលើគ្រប់បណ្តាញ។'],
  c4t:['Leave with one word','ឈប់ដោយពាក្យតែមួយ'],
  c4p:['Reply ឈប់ or STOP and everything stops. Coming back is your decision alone.',
       'ឆ្លើយតបពាក្យ ឈប់ ឬ STOP នោះអ្វីៗនឹងឈប់ទាំងអស់។ ការត្រឡប់មកវិញជាការសម្រេចរបស់អ្នកតែម្នាក់។'],
  c5t:['Your number stays private','លេខទូរស័ព្ទរបស់អ្នកជាការសម្ងាត់'],
  c5p:['It is stored encrypted and never shown to anyone who does not need it.',
       'វាត្រូវបានរក្សាទុកដោយអ៊ិនគ្រីប ហើយមិនបង្ហាញដល់អ្នកដែលមិនចាំបាច់ទេ។'],
  c6t:['Handled with care when it hurts','ការថែទាំពេលមានរឿងសោកសៅ'],
  c6p:['If you lose a pregnancy or a baby, tell us or the helpdesk. Everything stops within a minute, and nothing celebratory will reach you.',
       'បើអ្នកបាត់បង់ផ្ទៃពោះ ឬកូន សូមប្រាប់យើង ឬខ្សែជំនួយ។ អ្វីៗនឹងឈប់ក្នុងរយៈពេលមួយនាទី ហើយគ្មានសារអបអរណាមួយមកដល់អ្នកទេ។'],

  ch1:['SMS','សារ SMS'], ch1p:['On any handset, no internet needed.','លើទូរស័ព្ទគ្រប់ប្រភេទ មិនត្រូវការអ៊ីនធឺណិត។'],
  ch2:['Voice call','ការហៅជាសំឡេង'], ch2p:['Khmer audio you can replay.','សំឡេងខ្មែរ ដែលអ្នកអាចស្តាប់ឡើងវិញ។'],
  ch3:['Mami Care app','កម្មវិធី Mami Care'], ch3p:['Pictures, library, works offline.','រូបភាព បណ្ណាល័យ និងប្រើបានពេលគ្មានអ៊ីនធឺណិត។'],
  ch4:['QR poster','ផ្ទាំង QR'], ch4p:['Scan at your health centre and join on the spot.','ស្កេននៅមណ្ឌលសុខភាព ហើយចុះឈ្មោះភ្លាម។'],
  share_note:['<strong>Sharing a phone?</strong> Message previews are written so nothing personal shows on the lock screen.',
              '<strong>ប្រើទូរស័ព្ទរួមគ្នា?</strong> សាររបស់យើងសរសេរឡើងដើម្បីកុំឱ្យរឿងផ្ទាល់ខ្លួនបង្ហាញនៅលើអេក្រង់។'],

  cta_h:['Joining takes about two minutes.','ការចុះឈ្មោះចំណាយពេលប្រហែល ២ នាទី។'],
  cta_p:['Free, in Khmer, on the phone you already have. Leave whenever you want.',
         'ឥតគិតថ្លៃ ជាភាសាខ្មែរ លើទូរស័ព្ទដែលអ្នកមានស្រាប់។ ឈប់បានពេលណាក៏បាន។'],
  cta_ask:['Ask a question','សួរសំណួរ'],

  learn:['Learn more','ស្វែងយល់បន្ថែម'],
  read:['Read more','អានបន្ថែម'],
  read_update:['Read the update','អានព័ត៌មាននេះ'],

  h_svc_page:['Everything Mami Care offers you.','អ្វីៗគ្រប់យ៉ាងដែល Mami Care ផ្តល់ជូនអ្នក'],
  p_svc_page:['Six free services for mothers, parents and the people who support them. Pick any one to see how it works.',
              'សេវាកម្មឥតគិតថ្លៃទាំង ៦ សម្រាប់ម្តាយ ឪពុកម្តាយ និងអ្នកគាំទ្រ។ ចុចមួយណាក៏បាន ដើម្បីមើលរបៀបដំណើរការ។'],
  h_who_page:['Mami Care is for four groups of people.','Mami Care សម្រាប់មនុស្សបួនក្រុម'],
  p_who_page:['Each one gets different guidance. Choose yours to see exactly what you would receive.',
              'ក្រុមនីមួយៗទទួលការណែនាំខុសគ្នា។ ជ្រើសរើសក្រុមរបស់អ្នក ដើម្បីមើលអ្វីដែលអ្នកនឹងទទួល។'],
  h_jr_page:['Nine stages, from your first check-up to their second birthday.',
             'ដំណាក់កាលទាំង ៩ ចាប់ពីការពិនិត្យលើកដំបូង រហូតដល់ខួបកំណើតទី ២ របស់កូន'],
  p_jr_page:['Tap any stage to see what arrives and an example of a real message.',
             'ចុចដំណាក់កាលណាមួយ ដើម្បីមើលអ្វីដែលនឹងមកដល់ និងគំរូសារពិត។'],
  h_news_page:['What is happening with Mami Care.','មានអ្វីកើតឡើងជាមួយ Mami Care។'],
  p_news_page:['Where the service has opened, what has changed, and what we are learning.',
               'កន្លែងណាសេវាបានបើក អ្វីដែលបានផ្លាស់ប្តូរ និងអ្វីដែលយើងកំពុងរៀន។'],
  h_faq_page:['Questions people ask us most.','សំណួរដែលមនុស្សសួរយើងច្រើនជាងគេ'],
  p_faq_page:['Cannot find yours? The helpdesk answers in Khmer, seven days a week.',
              'រកមិនឃើញសំណួររបស់អ្នក? ខ្សែជំនួយឆ្លើយជាភាសាខ្មែរ ៧ ថ្ងៃក្នុងមួយសប្តាហ៍។'],
  h_about_page:['A national service that keeps mothers connected to the care that already exists.',
                'សេវាជាតិដែលភ្ជាប់ម្តាយទៅនឹងសេវាថែទាំដែលមានស្រាប់'],
  p_about_page:["Mami Care is run by the Ministry of Women's Affairs and the Ministry of Health. It is free, it is in Khmer, and it is for every family in Cambodia.",
                'Mami Care ដំណើរការដោយក្រសួងកិច្ចការនារី និងក្រសួងសុខាភិបាល។ វាឥតគិតថ្លៃ ជាភាសាខ្មែរ សម្រាប់គ្រួសារទាំងអស់នៅកម្ពុជា។'],

  foot_services:['Services','សេវាកម្ម'],
  foot_who:["Who it's for",'សម្រាប់អ្នកណា'],
  foot_support:['Support','ជំនួយ'],
  foot_tag:['Free maternal and child guidance for every family in Cambodia. Join on any phone, leave whenever you want.',
            'ការណែនាំសុខភាពម្តាយ និងកុមារ ឥតគិតថ្លៃ សម្រាប់គ្រួសារទាំងអស់នៅកម្ពុជា។'],

  kh_notice:['','អត្ថបទវែងនៅតែជាភាសាអង់គ្លេស។ ការបកប្រែជាភាសាខ្មែរកំពុងរង់ចាំការត្រួតពិនិត្យពីក្រសួងសុខាភិបាល។ · Longer articles are still in English while the Khmer translation is under Ministry of Health review.']
};

export const t = k => (T[k] || ['',''])[LANG];

/* Short Khmer descriptions, keyed by slug. */
export const KH_SVC = {
  join:'ចុះឈ្មោះឥតគិតថ្លៃក្នុងរយៈពេលប្រហែល ២ នាទី ហើយជ្រើសរើសអ្វីដែលអ្នកយល់ព្រមទទួល។',
  guidance:'ការណែនាំដែលត្រូវនឹងសប្តាហ៍ដែលអ្នកកំពុងស្ថិតនៅ រហូតដល់កូនអាយុ ២ ឆ្នាំ។',
  channels:'សារ SMS សំឡេងខ្មែរ ឬកម្មវិធី។ ប្រើបានលើទូរស័ព្ទគ្រប់ប្រភេទ។',
  ask:'ផ្ញើសំណួរជាភាសាខ្មែរបានគ្រប់ពេល ហើយទទួលចម្លើយដែលបានអនុម័ត។',
  helpdesk:'បុគ្គលិកនិយាយភាសាខ្មែរ ៧ ថ្ងៃក្នុងមួយសប្តាហ៍ ឥតគិតថ្លៃ។',
  referral:'មណ្ឌលសុខភាពជិតបំផុត និងការបញ្ជូនបន្តពេលអ្នកត្រូវការពិនិត្យ។'
};

export const KH_AUD = {
  pregnant:'ចាប់ពីដឹងថាមានផ្ទៃពោះ រហូតដល់ថ្ងៃសម្រាល។',
  postpartum:'៦ សប្តាហ៍ដំបូងក្រោយសម្រាល សម្រាប់អ្នក និងទារក។',
  parent:'ចាប់ពីកំណើត រហូតដល់កូនអាយុ ២ ឆ្នាំ។',
  family:'ប្តី ជីដូន និងអ្នកថែទាំដែលជួយមើលថែនាង។'
};

export const KH_WK = ['រហូតដល់ ១៦ សប្តាហ៍','១៦–២៧ សប្តាហ៍','២៨ សប្តាហ៍ ដល់ថ្ងៃសម្រាល','ពេលសម្រាល','០–៦ សប្តាហ៍ក្រោយសម្រាល','០–៦ ខែ','៦–១២ ខែ','១២–២៤ ខែ','ខួបកំណើតទី ២'];

export function khNote(){ return LANG ? `<p class="kh-notice km">${t('kh_notice')}</p>` : ''; }
