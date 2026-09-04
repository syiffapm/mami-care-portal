# Mami Care — concept portal

Static single-page app (no build step, no dependencies, no bundler). It's a
hash-routed SPA split into ordinary files the way a normal front-end project
is organised, and served as-is. Three products share one codebase:

- **Marketing site** (`#/…`) — public pages: home, services, who it's for,
  the journey, news, FAQ, about, join/log in.
- **Client app demo** (`#/app/…`) — BRD-01's "Mom App": Today, Library, Ask
  a question, Urgent guidance, Referrals, and a Me section (preferences,
  consent centre, my data, change phone). Reached by finishing "Join Mami
  Care" or "Log in".
- **CMS** (`#/cms/…`) — one internal tool for content, the helpdesk queue,
  the facility directory, staff access and programme analytics/M&E, rather
  than separate admin, gov and analytics systems. What a signed-in person
  sees is driven by role (Programme Admin, Clinical Reviewer, Content
  Editor, M&E Analyst) — reached from the footer's "Staff & partner sign-in".
  Publishing or withdrawing an item here is reflected immediately in the
  client app's Library, in the same browser session.

None of this is backed by a real server — enrolment, login, consent, the
CMS role picker and every workflow action are simulated in memory so the
whole thing works as a clickable prototype with no backend.

```
public/
  index.html          shell only: head, gov bar, masthead, footer, <main id="app">
  css/
    styles.css        all styles, incl. the #/app phone-shell chrome and the #/cms admin layout
  js/
    icons.js           inline SVG icon library
    i18n.js             English/Khmer copy, language state, t()/khNote()
    data.js             services, audiences, journey, FAQ, news, library content,
                         referrals, CMS roles/KPIs/helpdesk/facilities/staff
    components.js       shared render bits: tiles, journey widget, news cards,
                         CTA band, the #/app shell + tabs, the #/cms shell + sidebar
    pages.js            marketing pages + the 5-step "Join Mami Care" wizard
    pages-app.js        the #/app client-app-demo pages
    pages-cms.js        the #/cms pages + content/case/staff mutators
    enroll-state.js      shared in-memory state for the join wizard
    cms-state.js         which CMS role is currently selected
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
