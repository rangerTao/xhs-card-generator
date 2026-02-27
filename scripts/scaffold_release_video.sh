#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$SKILL_DIR/assets/remotion-9x16-release-template/src"

PROJECT=""
FORCE="false"

usage() {
  cat <<'EOF'
Usage:
  scaffold_release_video.sh --project <path> [--force]

Description:
  Copy the Remotion 9:16 release template into a project.
  Files are copied to <project>/src.

Options:
  --project <path>   Target Remotion project root (required)
  --force            Overwrite existing target files
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      PROJECT="${2:-}"
      shift 2
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$PROJECT" ]]; then
  echo "--project is required" >&2
  usage
  exit 1
fi

if [[ ! -d "$PROJECT" ]]; then
  echo "Project not found: $PROJECT" >&2
  exit 1
fi

if [[ ! -d "$PROJECT/src" ]]; then
  echo "Missing src directory: $PROJECT/src" >&2
  exit 1
fi

copy_file() {
  local src="$1"
  local dst="$2"
  local dst_dir
  dst_dir="$(dirname "$dst")"
  mkdir -p "$dst_dir"

  if [[ -f "$dst" && "$FORCE" != "true" ]]; then
    echo "Skip existing file (use --force to overwrite): $dst"
    return
  fi

  cp "$src" "$dst"
  echo "Copied: $dst"
}

copy_file "$TEMPLATE_DIR/Root.tsx" "$PROJECT/src/Root.tsx"
copy_file "$TEMPLATE_DIR/MainVideo.tsx" "$PROJECT/src/MainVideo.tsx"
copy_file "$TEMPLATE_DIR/scenes/ReleaseLayout.tsx" "$PROJECT/src/scenes/ReleaseLayout.tsx"
copy_file "$TEMPLATE_DIR/scenes/ReleaseCoverScene.tsx" "$PROJECT/src/scenes/ReleaseCoverScene.tsx"
copy_file "$TEMPLATE_DIR/scenes/ReleaseSectionScene.tsx" "$PROJECT/src/scenes/ReleaseSectionScene.tsx"

echo ""
echo "Template applied."
echo "Next steps:"
echo "1) Customize version and text in src/MainVideo.tsx"
echo "2) Ensure src/index.ts exports RemotionRoot from ./Root"
echo "3) Preview key frames:"
echo "   npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-cover.jpg --frame=60 --image-format=jpeg"
echo "   npx remotion still src/index.ts ReleaseVideo9x16 dist/preview-section.jpg --frame=180 --image-format=jpeg"
echo "4) Run: npm run lint && npm run build"
