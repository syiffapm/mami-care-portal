# Mami Care — concept portal

Static single-page app (no build step, no dependencies, no bundler). It's a
hash-routed SPA split into ordinary files the way a normal front-end project
is organised, and served as-is. Three products share one codebase:

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
  build spec's Admin Console lists: Dashboard (with real charts — a donut
  of clients by stage, a bar chart of enrolment by province, headline
  stats, and the programme KPIs), Content (with a "New content item"
  create flow), Clients & data, Helpdesk queue, Master data (Facilities /
  Controlled lists, the latter with add/remove — both sidebar sub-pages,
  not cards on a page), Users & access (with an "Invite user" create
  flow), Integration, Reports & audit (Coverage & enrolment / Reach &
  communication / Referrals / Audit log — also sidebar sub-pages), and
  Configuration. A simulated sign-in (any email/password) lands straight
  on the full Programme Admin view — the sidebar's "Switch role" control
  (Programme Admin, Clinical Reviewer, Content Editor, M&E Analyst) is
  this demo's way of trying the other views, no second login needed.
  Reached from the small "Staff" link in the top government strip on
  marketing pages, or the footer. Publishing content, or a client's
  question escalating to a helpdesk case, is reflected
  immediately on the app side, in the same browser session — one shared
  in-memory model standing in for what would be separate services.

None of this is backed by a real server — enrolment, login, consent, the
CMS sign-in/role picker and every workflow action are simulated in memory
so the whole thing works as a clickable prototype with no backend.

```
public/
  index.html          shell only: head, gov bar (+ small Staff/CMS link),
                       masthead, footer, <main id="app">
  css/
    styles.css        all styles: marketing site, the #/app phone-frame
                       shell, the #/cms admin layout, and chart primitives
  js/
    icons.js           inline SVG icon library
    i18n.js             English/Khmer copy, language state, t()/khNote()
    data.js             services, audiences, journey, FAQ, news, library
                         content, referrals, dashboard analytics (stage/
                         province breakdowns), and all CMS reference data
    components.js       shared render bits: tiles, journey widget, news
                         cards, CTA band, the #/app phone-frame shell +
                         tabs, the #/cms shell + nested sidebar, and the
                         hbar/donut chart primitives
    pages.js            marketing pages + the public facility search
    pages-app.js        #/app pages: join wizard, login, onboarding, and
                         the client-app-demo screens
    pages-cms.js        the #/cms pages (9 sections, some with sub-pages)
                         + their mutators
    enroll-state.js      shared in-memory state for the join wizard
    ask-state.js          L1→L2 ask-a-question logic (data layer, no UI)
    cms-state.js          CMS sign-in state + which role is selected
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
