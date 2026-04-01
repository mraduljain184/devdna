"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import ScoreRing from "@/components/dna/ScoreRing";
import DNARadarChart from "@/components/dna/RadarChart";
import PersonalityCard from "@/components/dna/PersonalityCard";

interface DnaProfile {
  clarityScore: number;
  defensivenessScore: number;
  velocityScore: number;
  architectureScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  collaborationScore: number;
  growthScore: number;
  overallScore: number;
  personalityType: string;
  analyzedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, setToken, logout } = useAuthStore();
  const [dnaProfile, setDnaProfile] = useState<DnaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("devdna_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setToken(token);

    // Fetch user
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        logout();
        router.push("/login");
      });

    // Fetch DNA profile
    api
      .get("/api/dna/profile")
      .then((res) => {
        setDnaProfile(res.data.dnaProfile);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [router, setUser, setToken, logout]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading your DNA profile...</p>
        </div>
      </main>
    );
  }

  if (!dnaProfile) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧬</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            No DNA Profile Yet
          </h2>
          <p className="text-gray-400 mb-6">
            Analyze your repositories first to generate your DNA profile
          </p>
          <button
            onClick={() => router.push("/dashboard/repos")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Analyze My DNA
          </button>
        </div>
      </main>
    );
  }

  const scoreItems = [
    { label: "💡 Clarity", score: dnaProfile.clarityScore, color: "#10b981" },
    {
      label: "🛡️ Defensiveness",
      score: dnaProfile.defensivenessScore,
      color: "#3b82f6",
    },
    { label: "⚡ Velocity", score: dnaProfile.velocityScore, color: "#f59e0b" },
    {
      label: "🏗️ Architecture",
      score: dnaProfile.architectureScore,
      color: "#6366f1",
    },
    {
      label: "🧪 Reliability",
      score: dnaProfile.reliabilityScore,
      color: "#ec4899",
    },
    {
      label: "🔁 Consistency",
      score: dnaProfile.consistencyScore,
      color: "#14b8a6",
    },
    {
      label: "🤝 Collaboration",
      score: dnaProfile.collaborationScore,
      color: "#8b5cf6",
    },
    { label: "📈 Growth", score: dnaProfile.growthScore, color: "#f97316" },
  ];

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
              Dashboard
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
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center text-center md:text-left md:items-start">
              {user?.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name || ""}
                  className="w-24 h-24 rounded-full border-4 border-emerald-400 mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-white mb-1">
                {user?.name || user?.githubUsername}
              </h2>
              <p className="text-gray-400 mb-2">@{user?.githubUsername}</p>
              <p className="text-gray-500 text-sm">
                Last analyzed:{" "}
                {new Date(dnaProfile.analyzedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Overall Score Ring */}
            <div className="flex flex-col items-center">
              <ScoreRing
                score={dnaProfile.overallScore}
                size={160}
                strokeWidth={14}
                color="#10b981"
              />
              <p className="text-gray-400 text-sm mt-3">Overall DNA Score</p>
            </div>

            {/* Score Rings Grid */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              {scoreItems.slice(0, 4).map((item) => (
                <ScoreRing
                  key={item.label}
                  score={item.score}
                  size={80}
                  strokeWidth={8}
                  label={item.label}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Personality Card */}
        <div className="mb-8">
          <PersonalityCard
            personalityType={dnaProfile.personalityType || "The Generalist"}
          />
        </div>

        {/* Radar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-xl font-semibold mb-6">DNA Radar</h3>
          <DNARadarChart dnaProfile={dnaProfile} />
        </div>

        {/* All Score Rings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-xl font-semibold mb-8">
            🔬 Full DNA Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {scoreItems.map((item) => (
              <ScoreRing
                key={item.label}
                score={item.score}
                size={100}
                strokeWidth={10}
                label={item.label}
                color={item.color}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/dashboard/repos")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Re-Analyze DNA
          </button>
          <button
            onClick={() => router.push("/evolution")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            View Evolution
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
