import { create } from 'zustand'

interface User {
  id: string
  name: string | null
  email: string | null
  avatarUrl: string | null
  githubUsername: string
  role: string
  dnaProfile: any | null
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('devdna_token')
    set({ user: null, token: null })
  },
}))
