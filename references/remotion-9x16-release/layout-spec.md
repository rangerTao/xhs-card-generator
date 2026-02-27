# Layout Spec

## Frame

- Aspect ratio: `9:16`
- Render size: `1080x1920`
- FPS: `30`

## Safe Area

- Content safe area height: `66.666%` of frame.
- Top margin: `16.6667%`
- Bottom margin: `16.6667%`
- Inside safe area, center content vertically and horizontally.

## Colors

- Prefer premium gradients instead of flat fills.
- Recommended unified theme (default):
  - Gradient start: `#12295A`
  - Gradient end: `#080E2A`
  - Glow A: `#67AEFF`
  - Glow B: `#C5A7E8`
- Optional scene-rotation themes:
  - `#8E1010 -> #420506` (gold + rose glow)
  - `#133E35 -> #071F1A` (teal + amber glow)
  - `#2B1E52 -> #130B2A` (violet + coral glow)
- Card background: `#F3EEEE`
- Title red: `#A80000`
- Body text: `#2A2A2A`
- Accent yellow (cover highlights): `#FFD84A`

## Typography

- Use bold sans-serif CJK-friendly stack.
- Cover main title: very large and heavy.
- Section title: prominent, single line preferred.
- Bullet text: 3-5 lines max, one idea per line.

## Motion

- Entrance: content visible from frame 0, slight upward movement allowed.
- Exit: quick fade-out.
- Avoid complex timelines, 3D moves, and heavy effects.

## Text Readability

- Use bullet mini-cards (rounded rectangle) instead of plain list rows.
- Keep 3-5 items, one idea per line.
- Font should favor mobile readability (larger size, tighter but clear line-height).
- Optionally highlight mixed English tokens inside Chinese lines for scannability.

## Default Timing

- 5 scenes x 120 frames = 600 frames (~20s).
- Each scene keeps similar pacing for predictable rhythm.
