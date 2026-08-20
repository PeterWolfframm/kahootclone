# Keypad Design System

Built from a brief only — no codebase, Figma file, or slide deck was attached. Everything here is originated from the written brief below; there is no external ground truth to cross-check against.

**Brief given:** "brutalistic, haptic, material-ish design system for a quiz app / general ux / ui for a website or apps. Inviting but not too playful. Minimal color except blue as primary — mostly white/black, high contrast. Animations on buttons and elements. Thicker-ish, round borders where sensible."

No brand name was given — the project is named **Keypad** (a quiz/haptic-input metaphor: pressing keys, getting instant feedback). Flag this to the user; rename easily if they have a real brand name.

## Sources
None attached. If you have a codebase, Figma file, deck, or brand guide, attach it and this system should be rebuilt/reconciled against it — treat everything below as a first draft, not ground truth.

## Index
- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — colors, typography, spacing, elevation (borders/shadows), motion, fonts
- `guidelines/` — foundation specimen cards (Design System tab: Colors, Type, Spacing, Motion, Brand groups)
- `components/`
  - `buttons/` — Button, IconButton
  - `forms/` — Input, Select, Checkbox, Radio, Switch
  - `surfaces/` — Card, Badge, Tag
  - `navigation/` — Tabs
  - `overlay/` — Dialog, Toast, Tooltip
- `ui_kits/quiz-app/` — quiz-taking product screens (start, question, results)
- `ui_kits/quiz-live/` — Kahoot-style live/hosted quiz: lobby, big-tile question with countdown, live reveal, podium
- `ui_kits/admin-dashboard/` — quiz-creator admin dashboard (sidebar, stats, quiz table)
- `ui_kits/website/` — marketing/general product screens (home, pricing)
- `assets/` — no logo was supplied; the wordmark "Keypad" in Space Grotesk stands in for a mark everywhere. Do not treat this as a real logo.
- `SKILL.md` — Claude Code-portable skill wrapper

## Content fundamentals
- **Voice:** direct, second-person ("you"), short sentences, verbs first. Instructional, not chatty — a quiz app needs zero ambiguity about what to do next.
- **Casing:** sentence case everywhere (buttons, headers, labels) — never Title Case, never ALL CAPS for body copy. All-caps is reserved for tiny metadata labels (eyebrow tags, timers, scores) at small size + wide letter-spacing, e.g. `QUESTION 3 OF 10`.
- **Tone:** confident and a little competitive, not silly. "Nice — 8 out of 10" not "Woohoo!! Amazing job!! 🎉". Encouragement is earned and specific, never generic hype.
- **Emoji:** not used. Feedback and status are carried by color, icon, and short copy instead.
- **Numbers:** always digits, never spelled out ("3 of 10", not "three of ten"). Scores/timers render in the monospace face to feel measured and mechanical.
- **Errors:** stated plainly, with the fix. "That answer's locked in — move to the next question." not "Oops! Something went wrong."
- **Examples:** Button labels — "Start quiz", "Next question", "See results", "Try again". Empty state — "No quizzes yet. Build your first one." Score copy — "7/10 — solid." / "3/10 — worth another go."

## Visual foundations
- **Color:** the palette is almost entirely black, white, and beige, with one accent color — a burnt-orange/brown (`--accent-primary`, `#C2621D`). The accent is used ONLY for primary actions, selected/active state, links, and focus rings — never as decoration. Beige (`--beige-*`, `--surface-warm`) softens section backgrounds and sunken surfaces so the system reads inviting, not clinical. Grey is neutral scaffolding (borders-subtle, secondary text), never a "second brand color." Red/green/amber exist only for correct/incorrect/warning feedback in the quiz flow.
- **Type:** Space Grotesk (display/headings — geometric, slightly technical, brutalist edge) + Inter (body/UI — neutral, highly legible) + JetBrains Mono (scores, timers, question counters, codes — gives numbers a measured, "readout" feel). Headings are tight-tracked and heavy; body text is roomy (1.45 line-height).
- **Spacing:** 4px base scale (4/8/12/16/24/32/48/64/96). Layouts run generous on whitespace throughout — between sections, around controls, inside cards and tab groups — tightening only within a single control (label sits close to its input).
- **Backgrounds:** flat white or flat black full-bleed sections only. No gradients, no photography-driven hero treatment, no texture/grain, no patterns. A black section is used sparingly as a "beat change" (e.g. a results screen) for contrast, not decoration.
- **Borders:** thick and load-bearing, not decorative. 2.5–3.5px solid black borders define almost every control and card edge — borders ARE the structure in a brutalist system, replacing soft drop-shadow-only cards. Focus/selected states swap the border color to blue rather than adding a glow.
- **Shadows — the "haptic" system:** hard-offset, zero-blur shadows (`5px 5px 0 black`) stand in for elevation — like a card is physically sitting above the page. On press, the shadow shrinks to `2px 2px 0` AND the element translates toward the shadow's origin, simulating a physical button being pushed into the surface. No soft/blurred shadows anywhere (that would read as "material" glow, not haptic click).
- **Corners:** rounded but restrained — 8px (small controls: tags, checkboxes), 14px (default: buttons, inputs), 20px (cards, dialogs), pill (switches, chips). Never fully square, never oversized "bubbly" radii — round enough to feel friendly, sharp enough to stay serious.
- **Animation:** fast and snappy (130–180ms), with a slight overshoot ease (`cubic-bezier(.34,1.56,.64,1)`) on entrances/selection — never a lazy fade. Buttons scale down (0.96) and drop their shadow on `:active`, springing back on release. Tab/toggle selection slides with the overshoot ease. No parallax, no slow reveals, nothing "cinematic" — every motion reads as an immediate physical response to a touch.
- **Hover:** darken by one step (accent → accent-600) or invert (black-on-white button becomes white-on-black) — never a lighten/opacity fade, which would feel too soft for this system.
- **Press:** shadow shrinks + element shifts 2px toward the shadow + scales to 0.96. This is the core "haptic" signature — repeat it identically across every interactive component.
- **Transparency/blur:** used only for the modal/dialog scrim (`rgba(black,.6)`, no blur) — never for glassmorphism panels or frosted surfaces; those don't fit a hard-edged brutalist system.
- **Cards:** white fill, 2.5px black border, 20px radius, hard 5px offset shadow. No inner shadow, no gradient fill.
- **Layout:** content is centered in a 1200px max-width column with 24px side padding; nothing fixed/sticky except the quiz progress bar during an active question.

## Iconography
No icon set was provided. Icons are substituted from **Lucide** (CDN, `unpkg.com/lucide-static` or `lucide-react`), chosen for its 2px stroke weight — it matches this system's border weight better than a filled/rounded icon set (e.g. Heroicons solid). This is a flagged substitution: swap in the brand's real icon set if one exists.
- Usage: navigation, form affordances (chevrons, check/x for correct/incorrect), and toolbar actions. Never emoji, never unicode symbols as icons.
- Icons sit inside `IconButton` at 20–24px, always with a visible hit target ≥44px.

## Intentional additions
No source defined a component inventory, so the standard primitive set was authored per the brief's needs: Button, IconButton, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Dialog, Toast, Tooltip.

## Caveats
- No brand name, logo, codebase, Figma file, or product copy was supplied — every color, type choice, and copy example above is originated to fit the brief, not sourced. Treat this as v0.
- Fonts are Google Fonts substitutes loaded via CDN `@import` (Space Grotesk, Inter, JetBrains Mono) — no real webfont files exist to self-host. Flagged; send real font files if the brand has them.
- Icons are Lucide (CDN), a substitution — flagged above.
