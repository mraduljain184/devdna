"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("devdna_token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    setToken(token);

    // Fetch current user
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        logout();
        window.location.replace("/login");
      });
  }, [setUser, setToken, setLoading, logout]);

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
              onClick={() => {
                logout();
                window.location.replace("/login");
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
            Your DevDNA profile is being set up. Start by analyzing your
            repositories.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "DNA Score", value: "—", emoji: "🧬", color: "emerald" },
            { label: "Repositories", value: "—", emoji: "📁", color: "blue" },
            {
              label: "Personality Type",
              value: "—",
              emoji: "🧠",
              color: "purple",
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

        {/* CTA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔬</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Ready to discover your coding DNA?
          </h3>
          <p className="text-gray-400 mb-6">
            Connect your repositories and we'll analyze your unique coding
            patterns
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all">
            Analyze My Repositories →
          </button>
        </div>
      </div>
    </main>
  );
}
