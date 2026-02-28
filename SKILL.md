---
name: xhs-card-generator
description: Generate Xiaohongshu (小红书) 9:16 assets from text or URLs: note-card images and release-style short videos. Use when users need XHS-ready visuals, key-point extraction via CDP, and direct rendering outputs.
---

# XHS Card Generator

## Overview
This skill supports two deliverables:
- image cards (single or multi-card)
- release videos (Remotion 9:16)

Input can be plain text or URL. For URL input, use CDP browser extraction first, then summarize and render.

## Workflow Decision Tree
- Input is URL: extract with CDP, then continue.
- Input is plain text: normalize and continue.
- Need image output: run image-card path.
- Need video output: run release-video path.

## Step 1: Ingest Source (CDP Required for URL)
- If input is URL, connect Chrome via CDP (not plain HTTP fetch).
- Wait for content load, extract title/headings/body, strip nav/ads/comments.
- Save a short 2-4 sentence source summary for planning.
- If input is text, normalize whitespace and remove obvious noise.
- If CDP fails, guide user to configure debug port/profile and retry.

Recommended command:

```bash
node scripts/extract_via_cdp.js --url "<URL>" --out /tmp/extracted.json
```

See `references/playwright_extraction.md` for details.

## Step 2: Summarize and Outline
- Produce a short title (6-14 Chinese chars or concise bilingual).
- Produce 3-8 key points.
- Optional: 3-5 step list/checklist for procedural content.
- Identify 1-2 quotable highlights for emphasis.
- Keep each page focused on one idea; avoid dense paragraphs.
- For video modules, use a two-step narrative:
- scene 1: module title + important points list (`重要更新点1..N`)
- scene 2: top points detail (`重要更新点1详解`, `重要更新点2详解`)

See `references/content_outline.md`.

## Path A: Image Cards

### Card Plan
- Card count by density:
- short: 1-2
- medium: 3-5
- long: 6-8 (cap at 9 unless asked)
- Sequence:
- cover/title
- key points / steps / tips
- summary + CTA

### Layout and Style
- 9:16 (`1080x1920`) with generous margins.
- XHS note vibe: clear title hierarchy, highlight block, concise bullets.
- Keep 40-65% whitespace.

### Render

```bash
python3 scripts/render_cards.py --data /path/to/cards.json --out /path/to/output
```

Output example: `card-01.png`, `card-02.png`.

## Path B: Release Video (Merged from remotion-9x16-release)

Use the bundled scaffold and template in this skill directly.

### Quick Start
1. Scaffold into a Remotion project:

```bash
scripts/scaffold_release_video.sh --project "<PROJECT_ROOT>" --force
```

2. Edit content in `src/MainVideo.tsx`.
3. Keep composition as `1080x1920` and centered middle 2/3 safe area.
4. Render still previews before full render:

```bash
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-cover.jpg --frame=60 --image-format=jpeg
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-section.jpg --frame=180 --image-format=jpeg
```

5. Render final video:

```bash
npx remotion render src/index.ts ReleaseVideo9x16 dist/output.mp4 --codec=h264 --crf=20
```

### Required Layout Rules
1. Keep all meaningful content in the middle 2/3 vertical safe area and visually centered.
2. Default background: premium gradient with subtle glow (avoid flat solid colors).
3. Theme strategy:
- default: one unified theme for all scenes
- optional: rotate scene themes when user asks
4. Use consistent scene grammar:
- icon
- title
- divider line
- important points list (N items)
5. Add a follow-up detail scene for the same module:
- detail card 1: 重要更新点1详解
- detail card 2: 重要更新点2详解
6. Bullet typography should be mobile-readable:
- rounded mini-card rows
- adequate line-height and spacing
- optional highlight for mixed English tokens
7. Motion should stay simple (fade + slight translate).
8. Avoid blank background-only opening frames at scene boundaries.

### Default Scene Pattern
1. Cover: product name + version + 2-3 highlight cards
2. Section A summary: 模块标题 + 重要更新点1..N
3. Section A detail: 重要更新点1详解 + 重要更新点2详解
4. Section B summary: 模块标题 + 重要更新点1..N
5. Section B detail: 重要更新点1详解 + 重要更新点2详解

If content is shorter, keep the same "summary -> detail" pair pattern and reduce module count.

### QA Checklist
- No pure background-only scene at transitions.
- Cover and sections are vertically centered in 9:16.
- Bullet text is readable on mobile and not cramped.
- Theme selection matches user intent (single palette or scene variation).

## Output Rules
- Image mode: return numbered PNG files.
- Video mode: return final MP4 + preview stills.
- If not rendered, return runnable commands and required files.

## Resources

### references/
- `references/playwright_extraction.md` — CDP extraction + troubleshooting.
- `references/content_outline.md` — outline templates.
- `references/xhs_style_guide.md` — XHS style rules.
- `references/release_video_guidelines.md` — release video checklist.
- `references/remotion-9x16-release/layout-spec.md` — merged layout spec.
- `references/remotion-9x16-release/merged-source-skill.md` — merged source instructions snapshot.
- `references/remotion-9x16-release/openai.yaml` — merged UI metadata snapshot.

### assets/
- `assets/note-card-template/` — note-card HTML/CSS templates.
- `assets/remotion-9x16-release-template/src/` — full Remotion template (Root/Main/scenes).

### scripts/
- `scripts/extract_via_cdp.js` — webpage extraction via CDP.
- `scripts/render_cards.py` — JSON card render to PNG.
- `scripts/scaffold_release_video.sh` — scaffold release video template into Remotion project.
