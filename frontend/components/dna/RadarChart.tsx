"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarChartProps {
  dnaProfile: {
    clarityScore: number;
    defensivenessScore: number;
    velocityScore: number;
    architectureScore: number;
    reliabilityScore: number;
    consistencyScore: number;
    collaborationScore: number;
    growthScore: number;
  };
}

export default function DNARadarChart({ dnaProfile }: RadarChartProps) {
  const data = [
    { dimension: "Clarity", score: Math.round(dnaProfile.clarityScore) },
    { dimension: "Defense", score: Math.round(dnaProfile.defensivenessScore) },
    { dimension: "Velocity", score: Math.round(dnaProfile.velocityScore) },
    {
      dimension: "Architecture",
      score: Math.round(dnaProfile.architectureScore),
    },
    {
      dimension: "Reliability",
      score: Math.round(dnaProfile.reliabilityScore),
    },
    {
      dimension: "Consistency",
      score: Math.round(dnaProfile.consistencyScore),
    },
    {
      dimension: "Collaboration",
      score: Math.round(dnaProfile.collaborationScore),
    },
    { dimension: "Growth", score: Math.round(dnaProfile.growthScore) },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />
        <Radar
          name="DNA"
          dataKey="score"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
