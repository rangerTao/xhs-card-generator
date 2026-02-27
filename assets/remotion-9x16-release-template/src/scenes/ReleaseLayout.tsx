import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type ReleaseBackgroundTheme = {
  start: string;
  end: string;
  glowA: string;
  glowB: string;
};

export const ReleaseLayout: React.FC<{
  children: React.ReactNode;
  theme?: ReleaseBackgroundTheme;
  contentYOffset?: number;
}> = ({ children, theme, contentYOffset = -320 }) => {
  const frame = useCurrentFrame();
  const activeTheme = theme ?? {
    start: "#12295A",
    end: "#080E2A",
    glowA: "#67AEFF",
    glowB: "#C5A7E8",
  };

  const spotOneX = interpolate(frame % 180, [0, 180], [-120, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spotTwoX = interpolate(frame % 220, [0, 220], [120, -140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 24%, rgba(255,255,255,0.08), transparent 38%), linear-gradient(160deg, ${activeTheme.start} 0%, ${activeTheme.end} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.5,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "12%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: activeTheme.glowA,
            filter: "blur(86px)",
            transform: `translateX(${spotOneX}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "16%",
            right: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: activeTheme.glowB,
            filter: "blur(82px)",
            transform: `translateX(${spotTwoX}px)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          top: "16.6667%",
          bottom: "16.6667%",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${contentYOffset}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
