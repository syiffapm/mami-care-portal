# Mami Care — concept portal

Static single-page app (no build step, no dependencies, no bundler). It's a
hash-routed SPA split into ordinary files the way a normal front-end project
is organised, and served as-is. Aligned to **MamiCare_E2E_Implementation
Blueprint v1.1** (5 Sep 2026, same-day revision of v1.0), which supersedes
BRD-00 through BRD-09 — see [Blueprint alignment](#blueprint-alignment)
below for what that means and what it deliberately does not mean for a
static, no-backend project. Four products share one codebase:

- **Marketing site** (`#/…`) — a *preview only*: home, services, who it's
  for, the journey, news, FAQ, about, and a public facility search
  (`#/facilities`, no account needed — searchable by province/name, not a
  live map, since precise location is never collected; each result links
  out to Maps by place name for directions). Every interactive feature
  (asking a question, talking to a person, the actual dashboard) lives
  behind "Join free" — the marketing copy says so up front rather than
  linking somewhere that doesn't work yet.
- **Client app demo** (`#/app/…`) — the "Mom App", rendered inside a phone
  device frame so it reads as a phone app even on a desktop browser (it
  collapses to plain full-bleed on an actual small screen). The front door
  is **Join** (`#/app/join`, a 5-step wizard) or **Log in** (`#/app/login`)
  for a returning visitor — both run inside the same phone frame, without
  the bottom tab bar (there's no "you" to show tabs for yet). Finishing
  Join leads into a 3-screen **onboarding** (`#/app/onboarding`) that
  orients a first-time visitor around the four tabs, Ask/Talk-to-a-person,
  and staying in control; logging back in skips straight to Today. Once
  in: Today, Library, Ask (a small L1→L2 chat — automated answers from the
  approved knowledge base, handed off to a simulated human operator when
  it can't help, a danger sign is detected, or asked for directly),
  Referrals, Talk to a person (`#/app/callback` — tap-to-call the free
  helpline, or request a scheduled call back), and Me (preferences,
  consent centre, my data, change phone).
- **CMS** (`#/cms/…`) — one internal tool covering every domain the system
  build spec's Admin Console lists: Dashboard (headline figures with
  evidence-class badges, a funnel, a donut of clients by stage, a bar
  chart of enrolment by province, and the programme KPIs — each KPI also
  carrying its evidence class, denominator and source per blueprint
  §6.7), Content (with a "New content item" create flow), Clients &
  data, Helpdesk queue (with a per-case reply composer gated by a
  medication/dosage/diagnosis-language safety filter — a blocked reply
  has no self-override, per §6.3), Master data (Facilities / Controlled
  lists, the latter with add/remove — both sidebar sub-pages, not cards
  on a page), Users & access (with an "Invite user" create flow),
  Integration, Reports & audit (Coverage & enrolment — including the
  cost model from §10 — / Reach & communication / Referrals / Audit
  log — also sidebar sub-pages), Orchestration & safety (the
  suppression registry's frozen vocabulary from §5.2, a Safe Mode
  switch, and a dry-run simulator — admin only), and Configuration. A
  simulated sign-in (any email/password) lands straight on the full
  Programme Admin view — the sidebar's "Switch role" control (Programme
  Admin, Clinical Reviewer, Content Editor, M&E Analyst) is this demo's
  way of trying the other views, no second login needed. Reached from
  the small "Staff" link in the top government strip on marketing
  pages, or the footer. Publishing content, or a client's question
  escalating to a helpdesk case, is reflected immediately on the app
  side, in the same browser session — one shared in-memory model
  standing in for what would be separate services.
- **Facility Portal** (`#/facility/…`) — the midwife-facing surface from
  §6.2, deliberately styled as a work tool on a shared clinic device
  rather than a citizen phone-frame: sign-in, a worklist (provisional
  clients, EDD passed, missed appointments, referrals open), a
  single-screen fast-enrolment form with a live elapsed-time counter
  against the blueprint's 90-second target (two typed fields — phone
  and one date — plus a consent script panel and a required read-aloud
  attestation), recording a visit (§4 `service_event.recorded` — a
  client, a non-diagnostic visit type from the controlled list, and a
  yes/no on whether it needs a follow-up; recording one for the demo's
  own profile sets what Today shows as "since your last visit" and, if
  a follow-up was needed, schedules and announces a next appointment by
  message), and an offline-sync status screen. Reached from the
  small "Facility" link next to "Staff" in the government strip, or the
  footer.

None of this is backed by a real server — enrolment, login, consent, the
CMS sign-in/role picker and every workflow action are simulated in memory
so the whole thing works as a clickable prototype with no backend.

## Blueprint alignment

The E2E Implementation Blueprint describes a real system: an orchestrator
and event bus, a consent ledger, an integration gateway, a suppression
engine that actually withholds sends, and a facility app that actually
works offline (§5, §9). **None of that server-side engine exists here, and
it cannot — this is a static HTML/CSS/JS project with no build step, no
database, and no server.** What this project does instead is preview the
*shape* of what those systems produce and enforce, using the same
vocabulary, so a reviewer can walk through the experience the blueprint
describes without mistaking it for the real thing:

- **Suppression registry** (`SUPPRESSION_REGISTRY` in `data.js`) — the
  exact frozen code list from §5.2, shown read-only in the Orchestration
  console; the Safe Mode switch and dry-run simulator there are in-memory
  toggles for this session only, not a real send pipeline.
- **Evidence classes** (`EVIDENCE_CLASS`, `KPI_EVIDENCE`,
  `HEADLINE_FIGURES` in `data.js`) — every headline figure and KPI on the
  Dashboard carries a badge (administrative / captured / projection /
  engagement), a denominator, and a source, per §6.7's rule that a figure
  without all three does not render.
- **Funnel and cost model** (`FUNNEL`, `COST_MODEL` in `data.js`) — the
  9-stage funnel and the §10 cost-per-channel/per-subscriber/scale-scenario
  figures are the exact placeholder numbers from the blueprint, not a
  live computation.
- **Facility Portal** — sign-in is a real account per credentialed
  worker (`FACILITY_STAFF_ROSTER` in `data.js`, two demo accounts, each
  with a `pin` and a facility assignment fixed at registration), not one
  shared persona: entering a PIN identifies *who* it is and shows a
  "Welcome back" screen naming their registered facility, and starting a
  shift is a second, separate, explicit step from there — identifying
  without starting a shift grants no access. In this demo, any non-empty
  PIN is accepted and lands on one of the two accounts *picked at
  random* (`facilityRandomStaff()`) — deliberately not tied to memorising
  which digits belong to which person, while every sign-in still lands
  on one specific, named account rather than a generic persona; only an
  empty submission is rejected. (Three iterations got here: first a
  single unconditional button with no field at all, then one PIN that
  had to match exactly, neither of which modelled "an account per
  worker" the way this does.) A real device would still authenticate
  against an identity provider (§13: "buy, never build"); a short PIN
  per worker is the
  realistic *shape* of a shared clinic tablet's sign-in, which is what
  this simulates. A top nav (Today / Clients / Profile) instead of
  a single dead-end screen: Today's four worklist cards each open a real
  masked list (not just a count), "Provisional, awaiting verification"
  lets a midwife verify straight from the list with one tap per row
  (§6.2's "verify provisional" requirement — manual reference-code entry
  at `#/facility/verify` is kept as the fallback for anyone not showing
  up in today's list), the other three categories get a lightweight
  "mark followed up," Clients shows this facility's enrolled clients
  (masked, read-only, no unmask control — a shared clinic device gets
  less access than a programme admin), and Profile shows which
  credentialed midwife the device is signed in as. Verifying the demo's
  own profile flips `DEMO_PROFILE.status` to `verified`, which the
  citizen side reads immediately, in the same session, so the "not
  verified yet" banner on Today actually clears. Also previews the
  90-second enrolment target and the two-field-plus-defaults shape, but
  the timer, the consent attestation, and "sync" are all simulated;
  there is no real offline storage.
- **Recording a visit** (`#/facility/record-visit`, §4
  `service_event.recorded`) — the event that closes the loop between a
  facility and a reminder: pick a client, a non-diagnostic visit type
  from the same controlled list a referral uses, and whether it needs a
  follow-up. Recording one for the demo's own profile is what actually
  triggers the message — `facilityRecordVisit()` writes
  `DEMO_PROFILE.lastVisit` (and `.nextAppointment` if a follow-up was
  requested) and the confirmation panel shows the exact message that
  would go out, using the same `notifPreview()` component as the CMS
  composer and the app's own notification-preview screen. On the
  citizen side, Today gains a "Since your last visit" card reading that
  same state, and `#/app/messages`'s simulated notification shows this
  real message — not a generic stage reminder — once one has been
  recorded, via a `appNotificationSample()` helper shared by the page
  and the router so the two never drift out of sync. Enrolling and
  recording a visit are also connected to each other, not two
  disconnected buttons: enrol → consult → record → suggest a next step
  → reminder is one visit for a real mother, so finishing "Enrol a
  client" remembers who was just enrolled
  (`FACILITY_SESSION.lastEnrolled`, set in `wireFacilityEnrollForm()`)
  and offers "Record today's consultation outcome" right on the
  confirmation screen — which pre-selects that same person on
  `#/facility/record-visit` instead of asking the midwife to find them
  again a moment later, and forgets them again once used.
- **Helpdesk safety gate** (`FORBIDDEN_HEALTH_TERMS` in `data.js`) — a
  small demo lexicon standing in for the real content-moderation service
  described in §6.3.
- **Programme decisions** (`PROGRAMME_DECISIONS` in `data.js`) — the nine
  decisions MoH/DPHI still owe (§16), shown read-only in the Orchestration
  console with the corrected v1.1 distinction: decisions 1–2 block the
  *build* itself, 7–9 block pilot *launch* only (the engineering proceeds
  regardless), and 4–6 block integration only and are never a pilot
  dependency.
- **SMS/IVR channel-variant authoring** (§6.4) — the CMS content
  composer (`#/cms/content/new` and any item's detail page) has a live
  Khmer segment counter (70 chars/UCS-2 segment) with a cost-per-100,000-
  sends estimate, a live IVR duration estimate flagged if it exceeds the
  90-second routine cap, and a side-by-side notification preview showing
  the normal view next to the safe-contact view (neutral sender, no
  content) — exactly the three "must exist" items in §6.4 that had no UI
  at all before. See `smsMeter`/`ivrMeter`/`variantPreviewRow` in
  `pages-cms.js` and `notifPreview` in `components.js`.
- **"How a reminder arrives" preview** (`#/app/messages`) — a citizen-
  facing screen that simulates a message landing as a lock-screen
  notification, then "opening" into the full bubble. The safe-contact
  toggle here is wired to the same `DEMO_PROFILE.safeContact` flag as
  Preferences, so flipping it live-updates the notification to show a
  neutral sender and no content — the actual behaviour §7.1 requires for
  a shared handset, not just a description of it.

### v1.0 → v1.1 corrections applied here

v1.1 corrected three numbers/claims in v1.0 (§0.1); all three are reflected
in this codebase, not just the source document:

1. **IVR cost share** — was shown as "~30% of cost for ~6% of contacts."
   Recomputed from the model's own assumptions, it's **~15% for ~4%**
   (`COST_MODEL` in `data.js`, rendered with a full per-channel breakdown
   and the underlying assumptions in Reports → Coverage & enrolment).
2. **The public-facing News section outran the programme's own stated
   stage** — it previously described a service already live at national
   scale (provinces opened, 1,200 midwives trained, a helpline already
   answering, pilot results) with dates *before* the blueprint's own
   document date, while §11 states the programme is Phase A/pre-Gate-1
   with the pilot not yet started. This is exactly the failure mode the
   blueprint names in its own risk register (§17: "public-facing material
   outruns actual build status"). Every News item was rewritten to
   describe real Phase A activity (content in clinical review, midwife
   co-design sessions, pilot-district selection) instead of invented
   rollout milestones — see `NEWS` in `data.js`.
3. **§16 decision-blocking language** — added as a new "Programme
   decisions" table in the Orchestration console (see above), using the
   corrected build-vs-launch-vs-integration distinction from the start
   rather than repeating v1.0's conflated wording.

Anti-scope compliance (§19 — "never build"): checked against bulk export,
campaign/health-attribute cohort targeting, facility performance ranking,
and "messages sent" as a headline KPI. None of those appear anywhere in
this project.

```
public/
  index.html          shell only: head, gov bar (+ small Facility/Staff
                       links), masthead, footer, <main id="app">
  css/
    styles.css        all styles: marketing site, the #/app phone-frame
                       shell, the #/cms admin layout, the #/facility work-
                       tool shell, chart primitives, and evidence badges
  js/
    icons.js           inline SVG icon library
    i18n.js             English/Khmer copy, language state, t()/khNote()
    data.js             services, audiences, journey, FAQ, news, library
                         content, referrals, dashboard analytics (stage/
                         province breakdowns), all CMS reference data, and
                         the blueprint-alignment data: suppression registry,
                         evidence classes, headline figures, funnel, cost
                         model, facility worklist, forbidden-terms lexicon
    components.js       shared render bits: tiles, journey widget, news
                         cards, CTA band, the #/app phone-frame shell +
                         tabs, the #/cms shell + nested sidebar, the
                         #/facility shell, the hbar/donut chart primitives,
                         and the evidence badge
    pages.js            marketing pages + the public facility search
    pages-app.js        #/app pages: join wizard, login, onboarding, and
                         the client-app-demo screens
    pages-cms.js        the #/cms pages (10 sections, some with sub-pages)
                         + their mutators
    pages-facility.js    #/facility pages: sign-in, worklist, fast
                          enrolment (with live timer), offline sync status
    enroll-state.js      shared in-memory state for the join wizard
    ask-state.js          L1→L2 ask-a-question logic (data layer, no UI)
    cms-state.js          CMS sign-in state + which role is selected
    facility-state.js      Facility Portal sign-in state
    router.js            hash router, page chrome, and all interactive wiring
  assets/
    emblem-mowa.png, emblem-mowa-lg.png, hero-mother-baby.png
  favicon.png
  robots.txt
```

`js/router.js` is loaded from `index.html` as `<script type="module">`; the
rest of the JS files import each other with plain ES module `import`/`export`
— no build step, so any static file server (including `vercel --prod`) works
unmodified.

Fonts: Latin text renders in **Inter**; Khmer script automatically falls
back to **Kantumruy Pro** / **Noto Sans Khmer** per character (Inter has no
Khmer glyphs), so the two never fight over the same run of text. Headings
stay on the **Fraunces** display serif; small caps/labels stay on
**IBM Plex Mono**. All four stacks are defined once, as CSS variables in
`styles.css` (`--font-sans`, `--font-khmer`, `--font-serif`, `--font-mono`).

## Deploy

    npx vercel --prod

## Local preview

    npx serve public
    # or: python3 -m http.server --directory public 8080

(Opening `index.html` directly via `file://` won't work — ES modules require
being served over http/https.)

## Notes

- `noindex, nofollow` is set in the page head **and** as an `X-Robots-Tag`
  response header. The page carries the real emblem of the Ministry of Women's
  Affairs, so it must not be indexed as though it were a live government
  service. Remove both only when the programme is genuinely launching.
- The footer carries "Concept portal — not a live public service". Keep it
  until MoH/MoWA sign-off.
