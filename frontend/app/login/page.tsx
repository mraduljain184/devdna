"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      window.location.replace("/dashboard");
    }
  }, [user]);

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/github";
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3">
            🧬 Dev<span className="text-emerald-400">DNA</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover your unique coding identity
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white text-2xl font-semibold mb-2">
            Welcome back
          </h2>
          <p className="text-gray-400 mb-8">
            Connect your GitHub to analyze your coding DNA
          </p>

          {/* GitHub Login Button */}
          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center">
              By signing in, you agree to let DevDNA analyze your public
              repositories
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { emoji: "🔬", text: "Analyze your code patterns" },
            { emoji: "📈", text: "Track your growth over time" },
            { emoji: "🤝", text: "Match with teams" },
          ].map((feature) => (
            <div key={feature.text} className="text-center">
              <div className="text-2xl mb-2">{feature.emoji}</div>
              <p className="text-gray-500 text-xs">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
