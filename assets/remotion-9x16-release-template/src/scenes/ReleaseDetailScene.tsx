import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReleaseBackgroundTheme, ReleaseLayout } from "./ReleaseLayout";

type DetailItem = {
  title: string;
  detail: string;
};

type ReleaseDetailSceneProps = {
  icon: string;
  title: string;
  details: DetailItem[];
  theme?: ReleaseBackgroundTheme;
};

export const ReleaseDetailScene: React.FC<ReleaseDetailSceneProps> = ({ icon, title, details, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const normalizedDetails =
    details.length > 0
      ? details
      : [{ title: "暂无主要内容", detail: "请在 MainVideo.tsx 中补充该模块的主要讲解点。" }];
  const denseMode = normalizedDetails.length >= 4;

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const opacity = interpolate(frame, [0, 108, 120], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <ReleaseLayout theme={theme}>
        <div
          style={{
            width: "100%",
            maxWidth: 920,
            minHeight: 1160,
            backgroundColor: "#F3EEEE",
            borderRadius: 56,
            padding: denseMode ? "64px 64px 74px" : "76px 72px 82px",
            boxSizing: "border-box",
            transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 66, marginBottom: 24 }}>{icon}</div>

          <div
            style={{
              fontSize: denseMode ? 54 : 60,
              fontWeight: 900,
              color: "#A80000",
              lineHeight: 1.12,
              textAlign: "center",
            }}
          >
            {title}
          </div>

          <div
            style={{
              width: 340,
              height: 5,
              backgroundColor: "#B61A1A",
              borderRadius: 999,
              marginTop: 20,
              marginBottom: denseMode ? 28 : 36,
            }}
          />

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: denseMode ? 14 : 18 }}>
            {normalizedDetails.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 24,
                  padding: denseMode ? "16px 18px" : "20px 22px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
                  border: "2px solid rgba(182, 26, 26, 0.14)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: denseMode ? 34 : 42,
                    fontWeight: 800,
                    color: "#8F0E0E",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: denseMode ? 28 : 34,
                    fontWeight: 600,
                    color: "#2F2F2F",
                    lineHeight: denseMode ? 1.28 : 1.35,
                    marginTop: 10,
                  }}
                >
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReleaseLayout>
    </AbsoluteFill>
  );
};
