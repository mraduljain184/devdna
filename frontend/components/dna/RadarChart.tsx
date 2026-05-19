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
        <PolarGrid stroke="#cbd5e1" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#64748b", fontSize: 12 }}
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
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#0f172a",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
