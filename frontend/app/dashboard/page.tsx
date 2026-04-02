"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("devdna_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setToken(token);

    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        logout();
        router.push("/login");
      });
  }, [router, setUser, setToken, setLoading, logout]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading your DNA...</p>
        </div>
      </main>
    );
  }

  const dnaProfile = user.dnaProfile;

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            🧬 Dev<span className="text-emerald-400">DNA</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name || ""}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-300 text-sm">
                {user.name || user.githubUsername}
              </span>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={() => router.push("/evolution")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Evolution
            </button>
            <button
              onClick={() => router.push("/benchmark")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Benchmark
            </button>
            <button
              onClick={() => router.push("/teams")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Teams
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Leaderboard
            </button>
            <button
              onClick={() => router.push(`/u/${user.githubUsername}`)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Public Profile
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.name || user.githubUsername}! 👋
          </h2>
          <p className="text-gray-400">
            {dnaProfile
              ? "Your DevDNA profile is ready. Here are your results."
              : "Your DevDNA profile is being set up. Start by analyzing your repositories."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Overall DNA Score",
              value: dnaProfile
                ? `${Math.round(dnaProfile.overallScore)}`
                : "—",
              emoji: "🧬",
            },
            {
              label: "Personality Type",
              value: dnaProfile ? dnaProfile.personalityType : "—",
              emoji: "🧠",
            },
            {
              label: "Clarity Score",
              value: dnaProfile
                ? `${Math.round(dnaProfile.clarityScore)}`
                : "—",
              emoji: "💡",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{stat.emoji}</div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* DNA Scores */}
        {dnaProfile && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-white text-xl font-semibold mb-6">
              🔬 Your DNA Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "💡 Clarity", score: dnaProfile.clarityScore },
                {
                  label: "🛡️ Defensiveness",
                  score: dnaProfile.defensivenessScore,
                },
                { label: "⚡ Velocity", score: dnaProfile.velocityScore },
                {
                  label: "🏗️ Architecture",
                  score: dnaProfile.architectureScore,
                },
                { label: "🧪 Reliability", score: dnaProfile.reliabilityScore },
                { label: "🔁 Consistency", score: dnaProfile.consistencyScore },
                {
                  label: "🤝 Collaboration",
                  score: dnaProfile.collaborationScore,
                },
                { label: "📈 Growth", score: dnaProfile.growthScore },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <span className="text-emerald-400 text-sm font-semibold">
                      {Math.round(item.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔬</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {dnaProfile
              ? "Re-analyze your repositories"
              : "Ready to discover your coding DNA?"}
          </h3>
          <p className="text-gray-400 mb-6">
            {dnaProfile
              ? "Run a fresh analysis to update your DNA scores"
              : "Connect your repositories and we'll analyze your unique coding patterns"}
          </p>
          <button
            onClick={() => router.push("/dashboard/repos")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            {dnaProfile
              ? "🔄 Re-Analyze My DNA"
              : "🔬 Analyze My Repositories →"}
          </button>
        </div>
      </div>
    </main>
  );
}
