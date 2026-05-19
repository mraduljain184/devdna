"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Snapshot {
  snapshotDate: string;
  clarityScore: number;
  defensivenessScore: number;
  velocityScore: number;
  architectureScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  collaborationScore: number;
  growthScore: number;
  overallScore: number;
}

interface EvolutionChartProps {
  snapshots: Snapshot[];
}

export default function EvolutionChart({ snapshots }: EvolutionChartProps) {
  const data = snapshots.map((s) => ({
    date: new Date(s.snapshotDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Overall: Math.round(s.overallScore),
    Clarity: Math.round(s.clarityScore),
    Velocity: Math.round(s.velocityScore),
    Reliability: Math.round(s.reliabilityScore),
    Growth: Math.round(s.growthScore),
  }));

  const lines = [
    { key: "Overall", color: "#10b981" },
    { key: "Clarity", color: "#3b82f6" },
    { key: "Velocity", color: "#f59e0b" },
    { key: "Reliability", color: "#ec4899" },
    { key: "Growth", color: "#f97316" },
  ];

  if (snapshots.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="text-4xl mb-3">📈</div>
        <p className="text-slate-500 text-sm">
          Run at least 2 analyses to see your evolution timeline
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Come back after your next coding session!
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#0f172a",
          }}
        />
        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
