'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Team {
  id: string
  name: string
  inviteCode: string
  owner: {
    name: string | null
    githubUsername: string
    avatarUrl: string | null
  }
  members: {
    id: string
    role: string
    user: {
      id: string
      name: string | null
      githubUsername: string
      avatarUrl: string | null
      dnaProfile: {
        overallScore: number
        personalityType: string | null
      } | null
    }
  }[]
}

export default function TeamsPage() {
  const router = useRouter()
  const { user, setUser, setToken, logout } = useAuthStore()
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    fetchTeams()
  }, [router, setUser, setToken, logout])

  const fetchTeams = () => {
    api.get('/api/teams/my')
      .then((res) => {
        setTeams(res.data.teams)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Please enter a team name')
      return
    }
    setIsSubmitting(true)
    try {
      await api.post('/api/teams/create', { name: teamName })
      toast.success('Team created successfully! 🎉')
      setShowCreateModal(false)
      setTeamName('')
      fetchTeams()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code')
      return
    }
    setIsSubmitting(true)
    try {
      await api.post('/api/teams/join', { inviteCode })
      toast.success('Joined team successfully! 🎉')
      setShowJoinModal(false)
      setInviteCode('')
      fetchTeams()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Invite code copied! 📋')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading your teams...</p>
        </div>
      </main>
    )
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
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Dashboard
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

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              👥 My Teams
            </h2>
            <p className="text-gray-400">
              Create or join a team to see your collective DNA map
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              🔗 Join Team
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              + Create Team
            </button>
          </div>
        </div>

        {/* Teams List */}
        {teams.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No teams yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create a team or join one with an invite code
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                🔗 Join with Code
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                + Create Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all"
              >
                {/* Team Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-1">
                      {team.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Led by @{team.owner.githubUsername} •{' '}
                      {team.members.length} member
                      {team.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyInviteCode(team.inviteCode)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      📋 Copy Invite Code
                    </button>
                    <button
                      onClick={() => router.push(`/teams/${team.id}`)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      View DNA Map →
                    </button>
                  </div>
                </div>

                {/* Members */}
                <div className="flex flex-wrap gap-3">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2"
                    >
                      {member.user.avatarUrl && (
                        <img
                          src={member.user.avatarUrl}
                          alt={member.user.name || ''}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-gray-300 text-sm">
                        {member.user.name || member.user.githubUsername}
                      </span>
                      {member.role === 'LEAD' && (
                        <span className="text-yellow-400 text-xs">👑</span>
                      )}
                      {member.user.dnaProfile && (
                        <span className="text-emerald-400 text-xs font-semibold">
                          {Math.round(member.user.dnaProfile.overallScore)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">
              Create a New Team
            </h3>
            <input
              type="text"
              placeholder="Team name (e.g. Frontend Squad)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCreateModal(false); setTeamName('') }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                {isSubmitting ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">
              Join a Team
            </h3>
            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinTeam()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowJoinModal(false); setInviteCode('') }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTeam}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                {isSubmitting ? 'Joining...' : 'Join Team'}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}