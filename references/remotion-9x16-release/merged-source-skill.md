---
name: remotion-9x16-release
description: Create or refactor Remotion videos into a reusable 9:16 release-announcement format with a centered 2/3 content-safe area. Use when users ask for "版本更新" short videos, card-based update slides, premium gradient backgrounds, or fixed vertical layout standards that should work across new projects.
---

# Remotion 9:16 Release Format

Use this skill to make Remotion videos with a stable release-announcement structure:
- 9:16 composition (`1080x1920`)
- content-safe area = middle 2/3 of the frame, vertically centered
- cover page + repeated section-card pages
- minimal and consistent motion
- premium gradient background theme (single theme or scene-rotation themes)

## Quick Start

1. Run the scaffold script:

```bash
scripts/scaffold_release_video.sh --project "<PROJECT_ROOT>"
```

2. Edit update content in:
- `src/MainVideo.tsx` (version text, section intro, and key points)

3. Keep the layout constraints unchanged:
- `src/Root.tsx`: `width=1080`, `height=1920`
- `src/scenes/ReleaseLayout.tsx`: content area uses `top: "16.6667%"` and `bottom: "16.6667%"`

4. When style/layout changes, render still previews first (before full video):

```bash
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-cover.jpg --frame=60 --image-format=jpeg
npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-section.jpg --frame=180 --image-format=jpeg
```

5. Validate:

```bash
npm run lint
npm run build
```

## Required Layout Rules

Apply these rules unless the user explicitly requests a different style:

1. Render all meaningful content inside the middle 2/3 vertical safe area, and verify it is visually centered (not low).
2. Do not use a flat background color by default; use premium gradients with subtle glow overlays.
3. Theme strategy:
   - default: one unified theme across all scenes
   - optional: rotate themes scene-by-scene when user asks for more variation
4. Use one visual grammar across scenes:
   - icon
   - title
   - intro sentence
   - short divider line
   - 1-2 key bullet items
5. Optimize section bullet typography:
   - each bullet as a rounded mini-card
   - stronger line-height and spacing for mobile readability
   - optional highlight for mixed English tokens (e.g. `Android`, `Markdown`, `Cron`)
6. Keep transitions simple (fade + slight translate), but avoid blank opening frames in each scene.
7. Keep typography large and high contrast for mobile viewing.

## Scene Pattern

Use this 5-page structure by default:

1. Cover: product name + version + 2-3 highlight cards.
2. Section A: intro + top 1-2 model/engine updates.
3. Section B: intro + top 1-2 mobile/client updates.
4. Section C: intro + top 1-2 integration/platform updates.
5. Section D: intro + top 1-2 stability/security updates.

If the user has fewer topics, keep the same visual pattern and reduce to 3-4 pages.

## QA Checklist

Before final render, always check:

1. No pure background-only scene at scene boundaries.
2. Cover + section pages are visually centered in 9:16.
3. Bullet text is readable on mobile and does not feel cramped.
4. Background theme matches user intent:
   - unified single palette, or
   - scene-level variation.

## Resources

- `scripts/scaffold_release_video.sh`
  - Copy reusable template files into a new or existing Remotion project.
- `assets/template/src/*`
  - Base implementation for the 9:16 + centered-2/3 release format.
- `references/layout-spec.md`
  - Read when you need exact visual/token rules for consistency.
