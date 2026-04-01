"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BenchmarkData {
  totalDevelopers: number;
  percentiles: Record<string, number>;
  averages: Record<string, number>;
  personalityDistribution: Record<string, number>;
  similarDevs: number;
  userProfile: Record<string, number>;
}

export default function BenchmarkPage() {
  const router = useRouter();
  const { user, setUser, setToken, logout } = useAuthStore();
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("devdna_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setToken(token);

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        logout();
        router.push("/login");
      });

    api
      .get("/api/benchmark")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load benchmark data",
        );
        setIsLoading(false);
      });
  }, [router, setUser, setToken, logout]);

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return "#10b981";
    if (percentile >= 60) return "#3b82f6";
    if (percentile >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 90) return "🏆 Top 10%";
    if (percentile >= 75) return "⭐ Top 25%";
    if (percentile >= 50) return "✅ Above Average";
    if (percentile >= 25) return "📈 Below Average";
    return "🔰 Just Starting";
  };

  const dimensionLabels: Record<string, string> = {
    clarityScore: "💡 Clarity",
    defensivenessScore: "🛡️ Defensiveness",
    velocityScore: "⚡ Velocity",
    architectureScore: "🏗️ Architecture",
    reliabilityScore: "🧪 Reliability",
    consistencyScore: "🔁 Consistency",
    collaborationScore: "🤝 Collaboration",
    growthScore: "📈 Growth",
    overallScore: "🧬 Overall",
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading benchmark data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧬</div>
          <h2 className="text-white text-xl font-semibold mb-2">{error}</h2>
          <button
            onClick={() => router.push("/dashboard/repos")}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            🔬 Analyze My DNA First
          </button>
        </div>
      </main>
    );
  }

  if (!data) return null;

  // Prepare chart data
  const comparisonData = Object.entries(dimensionLabels)
    .filter(([key]) => key !== "overallScore")
    .map(([key, label]) => ({
      dimension: label.split(" ")[1],
      You: Math.round(data.userProfile[key] || 0),
      Average: data.averages[key] || 0,
    }));

  // Prepare personality distribution data
  const personalityData = Object.entries(data.personalityDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type: type.replace("The ", ""),
      count,
      percentage: Math.round((count / data.totalDevelopers) * 100),
    }));

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            🧬 Dev<span className="text-emerald-400">DNA</span>
          </h1>
          <div className="flex items-center gap-4">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name || ""}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            🏆 Anonymous Benchmarking
          </h2>
          <p className="text-gray-400">
            See how you compare against{" "}
            <span className="text-emerald-400 font-semibold">
              {data.totalDevelopers} developer
              {data.totalDevelopers !== 1 ? "s" : ""}
            </span>{" "}
            on DevDNA
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🧬</div>
            <div className="text-3xl font-bold text-white mb-1">
              {data.percentiles.overallScore}%
            </div>
            <div className="text-gray-400 text-sm">Overall Percentile</div>
            <div
              className="mt-2 text-sm font-semibold"
              style={{
                color: getPercentileColor(data.percentiles.overallScore),
              }}
            >
              {getPercentileLabel(data.percentiles.overallScore)}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-white mb-1">
              {data.similarDevs}
            </div>
            <div className="text-gray-400 text-sm">Developers like you</div>
            <div className="mt-2 text-emerald-400 text-sm font-semibold">
              Similar DNA profile
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white mb-1">
              {data.totalDevelopers}
            </div>
            <div className="text-gray-400 text-sm">Total Developers</div>
            <div className="mt-2 text-emerald-400 text-sm font-semibold">
              In the DevDNA network
            </div>
          </div>
        </div>

        {/* Percentile Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            📊 Your Percentile Rankings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(dimensionLabels)
              .filter(([key]) => key !== "overallScore")
              .map(([key, label]) => {
                const percentile = data.percentiles[key] || 0;
                const color = getPercentileColor(percentile);
                return (
                  <div key={key} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>
                        Top {100 - percentile}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentile}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Your score: {Math.round(data.userProfile[key] || 0)}
                      </span>
                      <span>Avg: {data.averages[key]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* You vs Average Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            🆚 You vs Average Developer
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="dimension"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="You" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Average" fill="#374151" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Personality Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            🧠 Personality Type Distribution
          </h3>
          <div className="space-y-3">
            {personalityData.map((item) => (
              <div key={item.type} className="flex items-center gap-4">
                <div className="w-28 text-gray-400 text-sm text-right">
                  {item.type}
                </div>
                <div className="flex-1 bg-gray-800 rounded-full h-6 relative">
                  <div
                    className="bg-emerald-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-12 text-gray-400 text-sm">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
