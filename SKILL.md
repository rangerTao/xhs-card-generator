---
name: xhs-card-generator
description: Generate Xiaohongshu (小红书) style 9:16 assets from text blocks or URLs: note-card images and release-style short videos. Use when users want shareable XHS cards, key-point extraction, and optional webpage reading via Chrome DevTools Protocol (CDP) before rendering.
---

# XHS Card Generator

## Overview
Create 1 to multiple 9:16 note-style assets that look native to Xiaohongshu:
- image cards (single or multi-card)
- short release videos (Remotion)

When given a URL, open it via Chrome DevTools Protocol (CDP), extract the main content, summarize key points, then render.

## Workflow Decision Tree
- Input is URL: use CDP browser session to open, extract content, then continue.
- Input is plain text: skip browsing and continue.
- Need image cards: use a cover + key points sequence.
- Need short video: use Remotion 9:16 scene sequence (cover + section pages).

## Step 1: Ingest Source
- If input is a URL, connect to Chrome via CDP (not HTTP-only fetch).
- Wait for network idle and ensure visible body content is loaded.
- Extract title, headings, and main article text; ignore nav/ads/comments.
- Save a short source summary (2-4 sentences) for internal planning.
- If input is text, normalize whitespace and remove obvious noise.
- If CDP connection fails, provide configuration guidance (launch command, debug port, profile isolation), then retry.

Recommended command:

```bash
node scripts/extract_via_cdp.js --url "<URL>" --out /tmp/extracted.json
```

See `references/playwright_extraction.md` for a minimal, reliable extraction pattern.

## Step 2: Summarize and Outline
- Produce a short title (6-14 Chinese chars or concise bilingual).
- Produce 3-8 key points.
- Optional: 3-5 step list or checklist if the content is procedural.
- Identify 1-2 quotable highlights to emphasize in large type.
- Keep each card focused on a single idea; avoid dense paragraphs.

See `references/content_outline.md` for outline templates.

## Step 3: Card Plan
- Decide card count based on density:
- Short content: 1-2 cards.
- Medium: 3-5 cards.
- Long: 6-8 cards (cap at 9 unless asked).
- Use a consistent sequence:
- Card 1: cover/title + subtitle + 1-2 highlights.
- Middle: key points, steps, tips, examples.
- Final: summary + CTA (e.g., 收藏/关注/评论引导).

## Step 4: Layout and Style (XHS Note Style)
- 9:16 ratio (1080x1920) with generous margins.
- Use a handwritten/note vibe: large title, bold highlights, small bullet list.
- Prefer light backgrounds, soft blocks, and colored tags.
- Use 2-3 accent colors max; avoid heavy gradients.
- Keep text readable: strong hierarchy (Title > Highlight > Body).
- Avoid overfilling; each card should have 40-65% whitespace.

See `references/xhs_style_guide.md` for concrete layout rules.

## Step 5A: Render Images
- Use the HTML/CSS template in `assets/note-card-template/`.
- Replace placeholders with the card plan content.
- Render each card to PNG at 1080x1920.
- Use `scripts/render_cards.py` to render JSON -> PNG via Playwright.

### JSON schema for rendering
```json
{
  "cards": [
    {
      "title": "标题",
      "subtitle": "一句话副标题",
      "highlight": "强调句",
      "bullets": ["要点1", "要点2", "要点3"],
      "tags": ["标签1", "标签2"],
      "theme": "note",
      "cta": "收藏备用"
    }
  ]
}
```

### Render command
```bash
python3 scripts/render_cards.py --data /path/to/cards.json --out /path/to/output
```

## Step 5B: Render Video (when user asks for video)
- Use Remotion format from the `remotion-9x16-release` skill when available.
- Keep 9:16 (`1080x1920`) and middle 2/3 content-safe area visually centered.
- Prefer one premium gradient theme for the whole video by default.
- If user wants more variation, allow scene-level theme rotation.
- Section bullet text must use mobile-friendly spacing and card-like rows.
- Avoid blank/pure-background opening frames at scene transitions.

Before full render, output still previews for confirmation:

```bash
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-cover.jpg --frame=60 --image-format=jpeg
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-section.jpg --frame=180 --image-format=jpeg
```

Then render full video:

```bash
npx remotion render src/index.ts ReleaseVideo9x16 dist/output.mp4 --codec=h264 --crf=20
```

## Output Rules
- For image mode: provide numbered files (e.g., `card-01.png`, `card-02.png`).
- For video mode: provide final `.mp4` and 1-2 preview stills used for confirmation.
- If only text output is possible, return HTML/CSS (or Remotion code) plus a clear render command.

## Resources

### references/
- `references/playwright_extraction.md` — URL extraction checklist + CDP connection snippet.
- `references/content_outline.md` — outline templates and length heuristics.
- `references/xhs_style_guide.md` — typography and layout rules.
- `references/release_video_guidelines.md` — video-specific style and QA checklist.

### assets/
- `assets/note-card-template/` — HTML/CSS 9:16 note-card templates (`note.html`, `bold.html`) + `styles.css`.
### scripts/
- `scripts/render_cards.py` — Render JSON card data to PNG via Playwright.
- `scripts/extract_via_cdp.js` — Extract webpage content via Chrome DevTools Protocol (CDP).
