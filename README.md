# xhs-card-generator

小红书（XHS）9:16 内容生成技能，支持：
- 图文卡片（1-N 张）
- 版本更新短视频（Remotion 风格）
- URL 内容提取（通过 Chrome DevTools Protocol, CDP）

## 能力概览

- 输入文本或网址，提炼重点后生成可发布素材
- 9:16 画幅，移动端可读排版
- 支持“小红书笔记风格”图片模板渲染
- 支持“版本更新播报”短视频流程（封面 + 分节卡片）

## 目录结构

- `SKILL.md`：技能入口说明
- `references/`：提取、排版、视频规范
- `assets/note-card-template/`：卡片 HTML/CSS 模板
- `scripts/render_cards.py`：JSON -> PNG 渲染
- `scripts/extract_via_cdp.js`：CDP 网页内容提取

## 快速使用

### 1) CDP 提取网页内容

先启动 Chrome 的调试端口：

```bash
open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-cdp-profile
```

然后提取页面：

```bash
node scripts/extract_via_cdp.js --url "https://example.com" --out /tmp/extracted.json
```

### 2) 渲染图文卡片

```bash
python3 scripts/render_cards.py --data /path/to/cards.json --out /path/to/output
```

输出示例：`card-01.png`, `card-02.png`

### 3) 渲染短视频

视频流程规范见：
- `references/release_video_guidelines.md`
- `SKILL.md` 中 “Step 5B: Render Video”

## 说明

本仓库为技能定义与模板仓库，主要用于在代理工作流中复用，不是完整的 Web 产品项目。
