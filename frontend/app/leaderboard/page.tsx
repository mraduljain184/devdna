"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ScoreRing from "@/components/dna/ScoreRing";

interface LeaderboardEntry {
  overallScore: number;
  personalityType: string | null;
  clarityScore: number;
  velocityScore: number;
  collaborationScore: number;
  user: {
    name: string | null;
    githubUsername: string;
    avatarUrl: string | null;
  };
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/public/leaderboard")
      .then((res) => {
        setLeaderboard(res.data.leaderboard);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return "border-yellow-400";
    if (index === 1) return "border-gray-400";
    if (index === 2) return "border-amber-600";
    return "border-gray-800";
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading leaderboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold text-white"
          >
            🧬 Dev<span className="text-emerald-400">DNA</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Get Your DNA →
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            🏆 DNA Leaderboard
          </h2>
          <p className="text-gray-400">
            Top developers ranked by their overall DNA score
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="text-3xl mb-2">🥈</div>
              {leaderboard[1].user.avatarUrl && (
                <img
                  src={leaderboard[1].user.avatarUrl}
                  alt={leaderboard[1].user.name || ""}
                  className="w-16 h-16 rounded-full border-4 border-gray-400 mb-3"
                />
              )}
              <p className="text-white font-semibold text-sm text-center">
                {leaderboard[1].user.name || leaderboard[1].user.githubUsername}
              </p>
              <p className="text-gray-400 text-xs mb-2">
                @{leaderboard[1].user.githubUsername}
              </p>
              <div className="bg-gray-400/20 px-3 py-1 rounded-full">
                <span className="text-gray-300 font-bold">
                  {Math.round(leaderboard[1].overallScore)}
                </span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🥇</div>
              {leaderboard[0].user.avatarUrl && (
                <img
                  src={leaderboard[0].user.avatarUrl}
                  alt={leaderboard[0].user.name || ""}
                  className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-3"
                />
              )}
              <p className="text-white font-bold text-center">
                {leaderboard[0].user.name || leaderboard[0].user.githubUsername}
              </p>
              <p className="text-gray-400 text-xs mb-2">
                @{leaderboard[0].user.githubUsername}
              </p>
              <div className="bg-yellow-400/20 px-3 py-1 rounded-full">
                <span className="text-yellow-400 font-bold">
                  {Math.round(leaderboard[0].overallScore)}
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="text-3xl mb-2">🥉</div>
              {leaderboard[2].user.avatarUrl && (
                <img
                  src={leaderboard[2].user.avatarUrl}
                  alt={leaderboard[2].user.name || ""}
                  className="w-16 h-16 rounded-full border-4 border-amber-600 mb-3"
                />
              )}
              <p className="text-white font-semibold text-sm text-center">
                {leaderboard[2].user.name || leaderboard[2].user.githubUsername}
              </p>
              <p className="text-gray-400 text-xs mb-2">
                @{leaderboard[2].user.githubUsername}
              </p>
              <div className="bg-amber-600/20 px-3 py-1 rounded-full">
                <span className="text-amber-500 font-bold">
                  {Math.round(leaderboard[2].overallScore)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-gray-400">
                No developers on the leaderboard yet.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-xl transition-all text-sm"
              >
                Be the first! →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user.githubUsername}
                  onClick={() => router.push(`/u/${entry.user.githubUsername}`)}
                  className={`flex items-center gap-4 p-5 hover:bg-gray-800 cursor-pointer transition-all border-l-4 ${getMedalColor(index)}`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center">
                    <span className="text-lg">{getMedalEmoji(index)}</span>
                  </div>

                  {/* Avatar */}
                  {entry.user.avatarUrl ? (
                    <img
                      src={entry.user.avatarUrl}
                      alt={entry.user.name || ""}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      🧬
                    </div>
                  )}

                  {/* Name & Type */}
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {entry.user.name || entry.user.githubUsername}
                    </p>
                    <p className="text-gray-400 text-sm">
                      @{entry.user.githubUsername} •{" "}
                      <span className="text-emerald-400">
                        {entry.personalityType || "The Generalist"}
                      </span>
                    </p>
                  </div>

                  {/* Score Ring */}
                  <ScoreRing
                    score={entry.overallScore}
                    size={50}
                    strokeWidth={5}
                    color="#10b981"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
