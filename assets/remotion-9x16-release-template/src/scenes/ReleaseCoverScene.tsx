import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReleaseBackgroundTheme, ReleaseLayout } from "./ReleaseLayout";

type Highlight = {
  label: string;
  title: string;
  subtitle: string;
};

type ReleaseCoverSceneProps = {
  product: string;
  version: string;
  highlights: Highlight[];
  theme?: ReleaseBackgroundTheme;
};

export const ReleaseCoverScene: React.FC<ReleaseCoverSceneProps> = ({
  product,
  version,
  highlights,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const opacity = interpolate(frame, [0, 108, 120], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <ReleaseLayout theme={theme}>
        <div style={{ width: "100%", maxWidth: 950, textAlign: "center", padding: "0 22px" }}>
          <div
            style={{
              transform: `scale(${titleScale})`,
              marginBottom: 34,
            }}
          >
            <div
              style={{
                fontSize: 88,
                lineHeight: 1.06,
                fontWeight: 900,
                color: "#FFD84A",
                textShadow: "0 0 24px rgba(255, 220, 90, 0.35)",
              }}
            >
              {product}
            </div>
            <div style={{ fontSize: 54, color: "#FFFFFF", fontWeight: 700, marginTop: 14 }}>
              v{version} 发布
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {highlights.map((item, index) => {
              const cardIn = spring({
                frame: frame - 10 - index * 8,
                fps,
                config: { damping: 15, mass: 0.8 },
              });
              return (
                <div
                  key={item.title}
                  style={{
                    transform: `translateY(${interpolate(cardIn, [0, 1], [22, 0])}px)`,
                    opacity: interpolate(cardIn, [0, 1], [0, 1]),
                    border: "4px solid #F4CF4D",
                    borderRadius: 34,
                    padding: "22px 30px",
                    background: "linear-gradient(140deg, rgba(18, 18, 25, 0.64), rgba(18, 18, 25, 0.38))",
                    boxShadow: "0 16px 28px rgba(0, 0, 0, 0.28)",
                    backdropFilter: "blur(3px)",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 42, lineHeight: 1.2, fontWeight: 700, color: "#FFFFFF" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 56, lineHeight: 1.12, fontWeight: 800, color: "#FFD84A", marginTop: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 38, lineHeight: 1.2, fontWeight: 600, color: "#F8F8F8", marginTop: 6 }}>
                    {item.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ReleaseLayout>
    </AbsoluteFill>
  );
};
