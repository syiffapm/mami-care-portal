# Mami Care — concept portal

Static single-page portal (no build step, no dependencies).
Everything — CSS, JS, the MoWA emblem and the hero photograph — is inlined in
`public/index.html`, so the whole site is one file.

## Deploy

    npx vercel --prod

## Notes

- `noindex, nofollow` is set in the page head **and** as an `X-Robots-Tag`
  response header. The page carries the real emblem of the Ministry of Women's
  Affairs, so it must not be indexed as though it were a live government
  service. Remove both only when the programme is genuinely launching.
- The footer carries "Concept portal — not a live public service". Keep it
  until MoH/MoWA sign-off.
