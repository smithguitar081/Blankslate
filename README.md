# BLANKSLATE Design System

**Brand:** BLANKSLATE (also stylized as BLNKSPCE, bl_nk_slate)  
**Company:** BSR Inc.  
**Tagline:** "The music of tomorrow, today."  
**Product:** Independent music label website — sells & streams original tracks.

---

## Sources

- **GitHub repo:** `https://github.com/smithguitar081/new-website` (main branch)
  - `index.html` — single-page website
  - `styles.css` — all styles
  - `glass-head.png` — hero background image (abstract glass sculpture)
  - `Blank Slate Label.jpg` — label artwork / brand image
  - Audio: `Dishitout.flac`, `Distress.m4a`, `Instrumental 2 sped.mp3`
- **Codebase:** `website.bbprojectd/` (BBEdit project — scratchpad only, no additional source)

---

## CONTENT FUNDAMENTALS

- **Voice:** Minimal, cool, mysterious. Short punchy phrases.
- **Tone:** Underground / indie music label energy. Not corporate, not hype.
- **Casing:** Mixed — brand name appears as BLANKSLATE (all-caps), BLNKSPCE (abbreviated, no vowels), and bl_nk_slate (lowercase with underscores replacing vowels). All three are valid stylizations.
- **Pronouns:** Third-person brand voice. No "we" or "you" on the site currently.
- **Emoji:** None. Zero emoji. Purely text and imagery.
- **Copy examples:**
  - `"The music of tomorrow, today."`
  - `"Buy MP3 – $1.00"`
  - `"© 2026 BSR Inc. All Rights Reserved."`
- **Nav labels:** About, Artists, Shop, Contact — all title case, single words.
- **Track labels:** "Track One", "Track Two" — written out, not numbered.
- **Vibe:** Sparse, restrained, a little cinematic. Less is always more.

---

## VISUAL FOUNDATIONS

### Colors
- **Background:** Pure black `#000000`
- **Foreground:** Pure white `#ffffff`
- **Muted text:** `#777777` (footer, secondary copy)
- **Subtle border:** `#333333`
- **Overlay:** `rgba(0,0,0,0.4)` — semi-transparent black over hero image
- **Hover link:** opacity 0.7 (not color change — fade only)
- **Buy button hover:** white bg + black text (inverted)
- No gradients. No color accents. Strict monochrome.

### Typography
- **Font:** Helvetica Neue, Helvetica, Arial, sans-serif — system stack, no web font loaded
- **Hero H1:** 3rem, default weight
- **Subtitle/tagline:** 1.2rem, `#ccc`
- **Nav logo:** 1.3rem, weight 600, letter-spacing 1px
- **Nav links:** 1rem
- **Footer:** 0.9rem, `#777`
- **Letter spacing:** Used on logo only (1px). Body text is default.
- **Text align:** Center across the board.
- No serif, no display fonts, no mono. Pure Helvetica.

### Spacing & Layout
- Fixed navbar: 70px tall, padded 40px horizontal
- Hero: 100vh, full-bleed background image
- Overlay padding: 40px
- Section padding: 40px 0
- Track margin: 20px 0
- Buy button: 10px 20px padding, 1px solid white border

### Backgrounds & Imagery
- **Hero:** Full-bleed, fixed parallax (`background-attachment: fixed`), centered — `glass-head.png` (abstract transparent glass head sculpture, B&W/cool tones)
- **Label image:** `Blank Slate Label.jpg` — standalone full-width image section
- No gradients, no textures, no patterns. Imagery is photographic/artistic.
- Color vibe of imagery: Cool, desaturated, glassy, abstract.

### Animations & Transitions
- Nav link hover: `opacity 0.7`, `transition: opacity 0.5s ease` (slow fade)
- Buy button hover: `background-color + color`, `transition: 0.3s`
- No scroll animations, no entrance effects, no bounces.

### Borders & Shadows
- Navbar: `box-shadow: 0 2px 10px rgba(0,0,0,0.4)` (subtle drop shadow on black bg)
- Buy button: `1px solid #fff` border
- Footer: `border-top: 1px solid #333`
- No card shadows. No rounded corners anywhere.
- Corner radius: **0** — sharp edges throughout.

### Cards & Components
- No card UI. Components are flat, borderless, or have 1px solid white borders.
- No rounded corners. Everything is sharp/squared.
- Buy button = inline-block, sharp corners, white outline, inverts on hover.

---

## ICONOGRAPHY

- **No icon system.** No icon fonts, no SVG icon sets, no emoji.
- Navigation is text-only.
- Audio is handled by native browser `<audio controls>` elements.
- Key assets:
  - `assets/glass-head.png` — hero background, abstract glass sculpture
  - `assets/Blank Slate Label.jpg` — label artwork

---

## FILE INDEX

```
README.md                  — This file
SKILL.md                   — Agent skill definition
colors_and_type.css        — CSS design tokens (colors + typography)
assets/
  glass-head.png           — Hero background image
  Blank Slate Label.jpg    — Label artwork
preview/
  colors-bg.html           — Background & surface color tokens
  colors-text.html         — Text & border color tokens
  colors-interactive.html  — Interactive / state colors
  type-scale.html          — Typography scale specimens
  type-styles.html         — Named type style specimens
  components-nav.html      — Navbar component
  components-button.html   — Buy button states
  brand-hero.html          — Hero section preview
  brand-label.html         — Label image asset
ui_kits/
  website/
    README.md              — Website UI kit notes
    index.html             — Interactive website prototype
    Nav.jsx                — Navbar component
    Hero.jsx               — Hero section
    MusicPlayer.jsx        — Track listing + audio
    Footer.jsx             — Footer
```
