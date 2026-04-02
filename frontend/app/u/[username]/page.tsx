"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import ScoreRing from "@/components/dna/ScoreRing";
import DNARadarChart from "@/components/dna/RadarChart";
import PersonalityCard from "@/components/dna/PersonalityCard";

interface PublicUser {
  id: string;
  name: string | null;
  githubUsername: string;
  avatarUrl: string | null;
  bio: string | null;
  dnaProfile: {
    clarityScore: number;
    defensivenessScore: number;
    velocityScore: number;
    architectureScore: number;
    reliabilityScore: number;
    consistencyScore: number;
    collaborationScore: number;
    growthScore: number;
    overallScore: number;
    personalityType: string | null;
    analyzedAt: string;
  } | null;
  repositories: {
    id: string;
    name: string;
    fullName: string;
    language: string | null;
    starCount: number;
  }[];
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/api/public/profile/${username}`)
      .then((res) => {
        setPublicUser(res.data.user);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Profile not found");
        setIsLoading(false);
      });
  }, [username]);

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreItems = publicUser?.dnaProfile
    ? [
        {
          label: "Clarity",
          score: publicUser.dnaProfile.clarityScore,
          color: "#10b981",
        },
        {
          label: "Defense",
          score: publicUser.dnaProfile.defensivenessScore,
          color: "#3b82f6",
        },
        {
          label: "Velocity",
          score: publicUser.dnaProfile.velocityScore,
          color: "#f59e0b",
        },
        {
          label: "Architecture",
          score: publicUser.dnaProfile.architectureScore,
          color: "#6366f1",
        },
        {
          label: "Reliability",
          score: publicUser.dnaProfile.reliabilityScore,
          color: "#ec4899",
        },
        {
          label: "Consistency",
          score: publicUser.dnaProfile.consistencyScore,
          color: "#14b8a6",
        },
        {
          label: "Collaboration",
          score: publicUser.dnaProfile.collaborationScore,
          color: "#8b5cf6",
        },
        {
          label: "Growth",
          score: publicUser.dnaProfile.growthScore,
          color: "#f97316",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error || !publicUser) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧬</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            {error || "Profile not found"}
          </h2>
          <p className="text-gray-400 mb-6">
            This developer hasn't joined DevDNA yet
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Join DevDNA →
          </button>
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
          <button
            onClick={shareProfile}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            {copied ? "Copied!" : "Share Profile"}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center text-center md:text-left md:items-start">
              {publicUser.avatarUrl ? (
                <img
                  src={publicUser.avatarUrl}
                  alt={publicUser.name || ""}
                  className="w-24 h-24 rounded-full border-4 border-emerald-400 mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-emerald-400 mb-4 bg-gray-800 flex items-center justify-center text-3xl">
                  🧬
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-1">
                {publicUser.name || publicUser.githubUsername}
              </h2>
              <p className="text-gray-400 mb-2">@{publicUser.githubUsername}</p>
              {publicUser.bio && (
                <p className="text-gray-300 text-sm max-w-xs">
                  {publicUser.bio}
                </p>
              )}
              {publicUser.dnaProfile && (
                <p className="text-gray-500 text-xs mt-2">
                  Last analyzed:{" "}
                  {new Date(
                    publicUser.dnaProfile.analyzedAt,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Overall Score */}
            {publicUser.dnaProfile && (
              <div className="flex flex-col items-center">
                <ScoreRing
                  score={publicUser.dnaProfile.overallScore}
                  size={160}
                  strokeWidth={14}
                  color="#10b981"
                />
                <p className="text-gray-400 text-sm mt-3">Overall DNA Score</p>
              </div>
            )}

            {/* Score Rings */}
            {publicUser.dnaProfile && (
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
            )}

            {/* No DNA yet */}
            {!publicUser.dnaProfile && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔬</div>
                  <p className="text-gray-400">DNA analysis not run yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {publicUser.dnaProfile && (
          <>
            {/* Personality Card */}
            <div className="mb-8">
              <PersonalityCard
                personalityType={
                  publicUser.dnaProfile.personalityType || "The Generalist"
                }
              />
            </div>

            {/* Radar Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h3 className="text-white text-xl font-semibold mb-6">
                🕸️ DNA Radar
              </h3>
              <DNARadarChart dnaProfile={publicUser.dnaProfile} />
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
          </>
        )}

        {/* Repositories */}
        {publicUser.repositories && publicUser.repositories.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-white text-xl font-semibold mb-6">
              Top Repositories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicUser.repositories.map((repo) => (
                <a
                  key={repo.id}
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all"
                >
                  <h4 className="text-white font-semibold text-sm mb-2">
                    {repo.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="text-gray-400 text-xs">
                        {repo.language}
                      </span>
                    )}
                    {repo.starCount > 0 && (
                      <span className="text-yellow-400 text-xs">
                        ★ {repo.starCount}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gray-900 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🧬</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Want to discover your coding DNA?
          </h3>
          <p className="text-gray-400 mb-6">
            Join DevDNA and find out what makes you unique as a developer
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Get Your DevDNA →
          </button>
        </div>
      </div>
    </main>
  );
}
