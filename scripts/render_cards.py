#!/usr/bin/env python3
"""Render XHS note cards from JSON data using Playwright."""

import argparse
import json
import os
import sys
from pathlib import Path

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "assets" / "note-card-template"


def _load_template(template_name: str):
    html_path = TEMPLATE_DIR / template_name
    css_path = TEMPLATE_DIR / "styles.css"
    if not html_path.exists() or not css_path.exists():
        raise FileNotFoundError("Template files missing under assets/note-card-template")
    html = html_path.read_text(encoding="utf-8")
    css = css_path.read_text(encoding="utf-8")
    return html, css


def _fill_template(html: str, card: dict) -> str:
    tags = card.get("tags", [])
    tag_1 = tags[0] if len(tags) > 0 else ""
    tag_2 = tags[1] if len(tags) > 1 else ""
    bullets = card.get("bullets", [])
    bullets = bullets[:4] + [""] * (4 - len(bullets))

    replacements = {
        "TAG_1": tag_1,
        "TAG_2": tag_2,
        "TITLE_HERE": card.get("title", ""),
        "SUBTITLE_OR_ONE-LINER": card.get("subtitle", ""),
        "HIGHLIGHT_TEXT_GOES_HERE": card.get("highlight", ""),
        "BULLET_ONE": bullets[0],
        "BULLET_TWO": bullets[1],
        "BULLET_THREE": bullets[2],
        "BULLET_FOUR": bullets[3],
    }

    for key, value in replacements.items():
        html = html.replace(key, value)

    cta = card.get("cta", "")
    if cta:
        html = html.replace("收藏 + 关注获取更多", cta)
    return html


def _build_html(html: str, css: str, filled: str) -> str:
    if "<link rel=\"stylesheet\"" in filled:
        filled = filled.replace("<link rel=\"stylesheet\" href=\"styles.css\" />", f"<style>{css}</style>")
    else:
        filled = filled.replace("</head>", f"<style>{css}</style></head>")
    return filled


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to cards JSON")
    parser.add_argument("--out", required=True, help="Output directory")
    parser.add_argument("--prefix", default="card", help="Output filename prefix")
    args = parser.parse_args()

    data_path = Path(args.data)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    data = json.loads(data_path.read_text(encoding="utf-8"))
    cards = data.get("cards", [])
    if not cards:
        print("No cards found in JSON. Expect { 'cards': [ ... ] }", file=sys.stderr)
        return 1

    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        print("Playwright is not available. Install with: pip install playwright && playwright install", file=sys.stderr)
        return 1

    html_template, css = _load_template("index.html")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)

        for idx, card in enumerate(cards, start=1):
            theme = card.get("theme", "note")
            template_name = "index.html"
            if theme == "bold":
                template_name = "bold.html"
            if theme == "note":
                template_name = "note.html"
            html_template, css = _load_template(template_name)
            filled = _fill_template(html_template, card)
            rendered = _build_html(html_template, css, filled)
            page.set_content(rendered, wait_until="load")
            page.wait_for_timeout(200)
            output = out_dir / f"{args.prefix}-{idx:02d}.png"
            page.screenshot(path=str(output), full_page=True)

        browser.close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
