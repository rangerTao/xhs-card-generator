import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReleaseBackgroundTheme, ReleaseLayout } from "./ReleaseLayout";

type ReleaseSectionSceneProps = {
  icon: string;
  title: string;
  intro?: string;
  items: string[];
  theme?: ReleaseBackgroundTheme;
};

const highlightMixedText = (text: string) => {
  const tokenRegex = /([A-Za-z][A-Za-z0-9+./-]*(?:\s+[A-Za-z][A-Za-z0-9+./-]*)*)/g;
  return text.split(tokenRegex).filter(Boolean).map((part, idx) => {
    const isLatinToken = /^[A-Za-z][A-Za-z0-9+./-]*(?:\s+[A-Za-z][A-Za-z0-9+./-]*)*$/.test(part);
    if (!isLatinToken) {
      return <span key={`${part}-${idx}`}>{part}</span>;
    }
    return (
      <span key={`${part}-${idx}`} style={{ color: "#A90D0D", fontWeight: 800 }}>
        {part}
      </span>
    );
  });
};

export const ReleaseSectionScene: React.FC<ReleaseSectionSceneProps> = ({
  icon,
  title,
  intro,
  items,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const majorItems = items.slice(0, 2);

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
            padding: "76px 72px 82px",
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
              fontSize: 64,
              fontWeight: 900,
              color: "#A80000",
              lineHeight: 1.1,
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
              marginBottom: 44,
            }}
          />

          {intro ? (
            <div
              style={{
                width: "100%",
                fontSize: 36,
                lineHeight: 1.4,
                color: "#5A1E1E",
                fontWeight: 600,
                marginBottom: 24,
                padding: "16px 20px",
                borderRadius: 20,
                background: "rgba(182, 26, 26, 0.08)",
                border: "1px solid rgba(182, 26, 26, 0.2)",
              }}
            >
              {intro}
            </div>
          ) : null}

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
            {majorItems.map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 46,
                  lineHeight: 1.28,
                  color: "#2A2A2A",
                  fontWeight: 650,
                  display: "flex",
                  alignItems: "center",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
                  border: "2px solid rgba(182, 26, 26, 0.12)",
                  borderRadius: 24,
                  padding: "18px 22px",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    minWidth: 14,
                    borderRadius: "50%",
                    backgroundColor: "#B61A1A",
                    boxShadow: "0 0 0 5px rgba(182, 26, 26, 0.14)",
                    marginRight: 18,
                  }}
                />
                <span>{highlightMixedText(item)}</span>
              </div>
            ))}
          </div>
        </div>
      </ReleaseLayout>
    </AbsoluteFill>
  );
};
