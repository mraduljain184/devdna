'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import ScoreRing from '@/components/dna/ScoreRing'
import DNARadarChart from '@/components/dna/RadarChart'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    githubUsername: string
    avatarUrl: string | null
    dnaProfile: {
      clarityScore: number
      defensivenessScore: number
      velocityScore: number
      architectureScore: number
      reliabilityScore: number
      consistencyScore: number
      collaborationScore: number
      growthScore: number
      overallScore: number
      personalityType: string | null
    } | null
  }
}

interface Team {
  id: string
  name: string
  inviteCode: string
  owner: {
    name: string | null
    githubUsername: string
    avatarUrl: string | null
  }
  members: TeamMember[]
}

interface TeamAverages {
  clarityScore: number
  defensivenessScore: number
  velocityScore: number
  architectureScore: number
  reliabilityScore: number
  consistencyScore: number
  collaborationScore: number
  growthScore: number
  overallScore: number
}

export default function TeamDNAMapPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string
  const { user, setUser, setToken, logout } = useAuthStore()
  const [team, setTeam] = useState<Team | null>(null)
  const [teamAverages, setTeamAverages] = useState<TeamAverages | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('devdna_token')
    if (!token) {
      router.push('/login')
      return
    }
    setToken(token)

    api.get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        logout()
        router.push('/login')
      })

    api.get(`/api/teams/${teamId}`)
      .then((res) => {
        setTeam(res.data.team)
        setTeamAverages(res.data.teamAverages)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load team')
        router.push('/teams')
      })
  }, [teamId, router, setUser, setToken, logout])

  const copyInviteCode = () => {
    if (team) {
      navigator.clipboard.writeText(team.inviteCode)
      toast.success('Invite code copied! 📋')
    }
  }

  const dimensionLabels = [
    { key: 'clarityScore', label: '💡 Clarity', color: '#10b981' },
    { key: 'defensivenessScore', label: '🛡️ Defense', color: '#3b82f6' },
    { key: 'velocityScore', label: '⚡ Velocity', color: '#f59e0b' },
    { key: 'architectureScore', label: '🏗️ Architecture', color: '#6366f1' },
    { key: 'reliabilityScore', label: '🧪 Reliability', color: '#ec4899' },
    { key: 'consistencyScore', label: '🔁 Consistency', color: '#14b8a6' },
    { key: 'collaborationScore', label: '🤝 Collaboration', color: '#8b5cf6' },
    { key: 'growthScore', label: '📈 Growth', color: '#f97316' },
  ]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading team DNA map...</p>
        </div>
      </main>
    )
  }

  if (!team) return null

  const membersWithDNA = team.members.filter((m) => m.user.dnaProfile)
  const membersWithoutDNA = team.members.filter((m) => !m.user.dnaProfile)

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
                alt={user.name || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => router.push('/teams')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← My Teams
            </button>
            <button
              onClick={() => { logout(); router.push('/login') }}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Team Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                👥 {team.name}
              </h2>
              <p className="text-gray-400">
                Led by @{team.owner.githubUsername} •{' '}
                {team.members.length} member
                {team.members.length !== 1 ? 's' : ''} •{' '}
                {membersWithDNA.length} with DNA profile
              </p>
            </div>
            <button
              onClick={copyInviteCode}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              📋 Copy Invite Code
            </button>
          </div>
        </div>

        {/* Team Average Radar */}
        {teamAverages && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-semibold">
                🕸️ Team DNA Radar
              </h3>
              <div className="bg-emerald-500/20 px-4 py-2 rounded-xl">
                <span className="text-emerald-400 font-bold">
                  Team Score: {Math.round(teamAverages.overallScore)}
                </span>
              </div>
            </div>
            <DNARadarChart dnaProfile={teamAverages} />
          </div>
        )}

        {/* Member DNA Cards */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            🧬 Member DNA Profiles
          </h3>

          {/* Members with DNA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {membersWithDNA.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(
                  selectedMember?.id === member.id ? null : member
                )}
                className={`bg-gray-900 border rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedMember?.id === member.id
                    ? 'border-emerald-500'
                    : 'border-gray-800 hover:border-gray-600'
                }`}
              >
                {/* Member Header */}
                <div className="flex items-center gap-4 mb-6">
                  {member.user.avatarUrl && (
                    <img
                      src={member.user.avatarUrl}
                      alt={member.user.name || ''}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">
                        {member.user.name || member.user.githubUsername}
                      </h4>
                      {member.role === 'LEAD' && (
                        <span className="text-yellow-400 text-xs">👑 Lead</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      @{member.user.githubUsername}
                    </p>
                    <p className="text-emerald-400 text-sm font-semibold">
                      {member.user.dnaProfile?.personalityType}
                    </p>
                  </div>
                  <ScoreRing
                    score={member.user.dnaProfile?.overallScore || 0}
                    size={60}
                    strokeWidth={6}
                    color="#10b981"
                  />
                </div>

                {/* Score Bars */}
                <div className="space-y-2">
                  {dimensionLabels.map((dim) => (
                    <div key={dim.key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-xs">{dim.label}</span>
                        <span className="text-xs font-semibold" style={{ color: dim.color }}>
                          {Math.round((member.user.dnaProfile as any)?.[dim.key] || 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(member.user.dnaProfile as any)?.[dim.key] || 0}%`,
                            backgroundColor: dim.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Members without DNA */}
          {membersWithoutDNA.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-gray-400 text-sm font-semibold mb-4">
                ⏳ Waiting for DNA analysis
              </h4>
              <div className="flex flex-wrap gap-3">
                {membersWithoutDNA.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2"
                  >
                    {member.user.avatarUrl && (
                      <img
                        src={member.user.avatarUrl}
                        alt={member.user.name || ''}
                        className="w-6 h-6 rounded-full opacity-50"
                      />
                    )}
                    <span className="text-gray-500 text-sm">
                      {member.user.name || member.user.githubUsername}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Blind Spots */}
        {teamAverages && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white text-xl font-semibold mb-6">
              🔍 Team Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strongest Dimension */}
              {(() => {
                const scores = dimensionLabels.map((d) => ({
                  label: d.label,
                  score: (teamAverages as any)[d.key],
                  color: d.color,
                }))
                const strongest = scores.reduce((a, b) => a.score > b.score ? a : b)
                const weakest = scores.reduce((a, b) => a.score < b.score ? a : b)

                return (
                  <>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <h4 className="text-emerald-400 font-semibold mb-2">
                        💪 Team Strength
                      </h4>
                      <p className="text-white font-bold text-lg">
                        {strongest.label}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Team scores {Math.round(strongest.score)} on average
                      </p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <h4 className="text-amber-400 font-semibold mb-2">
                        ⚠️ Team Blind Spot
                      </h4>
                      <p className="text-white font-bold text-lg">
                        {weakest.label}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Consider hiring for {Math.round(weakest.score)} avg score
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}