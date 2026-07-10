import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, LoginResponse } from '../types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (res: LoginResponse) => {
        localStorage.setItem('refreshToken', res.refreshToken)
        set({ user: res.user, token: res.accessToken })
      },
      logout: () => {
        localStorage.removeItem('refreshToken')
        set({ user: null, token: null })
      },
    }),
    { name: 'vidyaai-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
)
