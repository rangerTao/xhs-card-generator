import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ReleaseCoverScene } from "./scenes/ReleaseCoverScene";
import { ReleaseBackgroundTheme } from "./scenes/ReleaseLayout";
import { ReleaseSectionScene } from "./scenes/ReleaseSectionScene";

export const MainVideo: React.FC = () => {
  const sceneDuration = 120;

  // Use one theme for all scenes by default.
  const useUnifiedTheme = true;
  const themePresets: ReleaseBackgroundTheme[] = [
    { start: "#8E1010", end: "#420506", glowA: "#F1B74A", glowB: "#DC5A76" },
    { start: "#12295A", end: "#080E2A", glowA: "#67AEFF", glowB: "#C5A7E8" },
    { start: "#133E35", end: "#071F1A", glowA: "#5FC8A8", glowB: "#D8BB73" },
    { start: "#2B1E52", end: "#130B2A", glowA: "#7E99FF", glowB: "#F09A70" },
  ];
  const unifiedTheme = themePresets[1];
  const pickTheme = (sceneIndex: number) =>
    useUnifiedTheme ? unifiedTheme : themePresets[sceneIndex % themePresets.length];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0E1117",
        fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      }}
    >
      <Sequence durationInFrames={sceneDuration}>
        <ReleaseCoverScene
          theme={pickTheme(0)}
          product="YourProduct"
          version="2026.2.XX"
          highlights={[
            { label: "🤖 模块一", title: "核心更新 A", subtitle: "一句话价值点" },
            { label: "📱 模块二", title: "核心更新 B", subtitle: "一句话价值点" },
            { label: "⚙️ 模块三", title: "核心更新 C", subtitle: "一句话价值点" },
          ]}
        />
      </Sequence>

      <Sequence from={sceneDuration} durationInFrames={sceneDuration}>
        <ReleaseSectionScene
          theme={pickTheme(1)}
          icon="🤖"
          title="模块标题 A"
          items={["要点1", "要点2", "要点3", "要点4"]}
        />
      </Sequence>

      <Sequence from={sceneDuration * 2} durationInFrames={sceneDuration}>
        <ReleaseSectionScene
          theme={pickTheme(2)}
          icon="📱"
          title="模块标题 B"
          items={["要点1", "要点2", "要点3", "要点4"]}
        />
      </Sequence>

      <Sequence from={sceneDuration * 3} durationInFrames={sceneDuration}>
        <ReleaseSectionScene
          theme={pickTheme(3)}
          icon="🔗"
          title="模块标题 C"
          items={["要点1", "要点2", "要点3", "要点4"]}
        />
      </Sequence>

      <Sequence from={sceneDuration * 4} durationInFrames={sceneDuration}>
        <ReleaseSectionScene
          theme={pickTheme(4)}
          icon="⚙️"
          title="模块标题 D"
          items={["要点1", "要点2", "要点3", "要点4"]}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
