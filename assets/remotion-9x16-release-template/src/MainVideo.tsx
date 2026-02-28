import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ReleaseCoverScene } from "./scenes/ReleaseCoverScene";
import { ReleaseDetailScene } from "./scenes/ReleaseDetailScene";
import { ReleaseBackgroundTheme } from "./scenes/ReleaseLayout";
import { ReleaseSectionScene } from "./scenes/ReleaseSectionScene";

type ModuleData = {
  icon: string;
  title: string;
  points: string[];
  details: { title: string; detail: string }[];
};

export const SCENE_DURATION = 120;

const modules: ModuleData[] = [
  {
    icon: "🤖",
    title: "模块标题 A",
    points: ["重要更新点1", "重要更新点2", "重要更新点3"],
    details: [
      { title: "重要更新点1详解", detail: "这里写变更背景、核心能力和用户收益。" },
      { title: "重要更新点2详解", detail: "这里写适用场景、使用方式或性能提升幅度。" },
    ],
  },
  {
    icon: "📱",
    title: "模块标题 B",
    points: ["重要更新点1", "重要更新点2", "重要更新点3"],
    details: [
      { title: "重要更新点1详解", detail: "这里写本次修复或优化解决了什么问题。" },
      { title: "重要更新点2详解", detail: "这里写对稳定性、体验或效率的具体影响。" },
    ],
  },
];

export const TOTAL_FRAMES = SCENE_DURATION * (1 + modules.length * 2);

export const MainVideo: React.FC = () => {
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
      <Sequence durationInFrames={SCENE_DURATION}>
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

      {modules.map((module, index) => {
        const summaryFrom = SCENE_DURATION * (1 + index * 2);
        const detailFrom = SCENE_DURATION * (2 + index * 2);
        return (
          <React.Fragment key={module.title}>
            <Sequence from={summaryFrom} durationInFrames={SCENE_DURATION}>
              <ReleaseSectionScene
                theme={pickTheme(index + 1)}
                icon={module.icon}
                title={module.title}
                items={module.points}
              />
            </Sequence>
            <Sequence from={detailFrom} durationInFrames={SCENE_DURATION}>
              <ReleaseDetailScene
                theme={pickTheme(index + 1)}
                icon={module.icon}
                title={`${module.title} · 重点详解`}
                details={module.details}
              />
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
