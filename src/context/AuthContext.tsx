import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginUser,
  lookupUser,
  logoutUser,
  readStoredAuth,
  registerUser,
  type AuthUser,
} from '../services/authApi'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = readStoredAuth()
    if (!stored?.idToken) {
      setLoading(false)
      return
    }

    lookupUser(stored.idToken)
      .then((restored) => setUser(restored))
      .catch(() => {
        logoutUser()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const nextUser = await loginUser(email, password)
    setUser(nextUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const nextUser = await registerUser(name, email, password)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
