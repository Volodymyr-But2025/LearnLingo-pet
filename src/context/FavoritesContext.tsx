import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { addFavorite, fetchFavoriteIds, removeFavorite } from '../services/favoritesApi'
import { useAuth } from './AuthContext'

type FavoritesContextValue = {
  favoriteIds: string[]
  loading: boolean
  isFavorite: (teacherId: string) => boolean
  toggleFavorite: (teacherId: string) => Promise<'guest' | 'ok'>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setFavoriteIds([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchFavoriteIds(user.localId, user.idToken)
      .then((ids) => {
        if (!cancelled) setFavoriteIds(ids)
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const isFavorite = useCallback(
    (teacherId: string) => favoriteIds.includes(teacherId),
    [favoriteIds],
  )

  const toggleFavorite = useCallback(
    async (teacherId: string) => {
      if (!user) return 'guest' as const

      if (favoriteIds.includes(teacherId)) {
        await removeFavorite(user.localId, user.idToken, teacherId)
        setFavoriteIds((prev) => prev.filter((id) => id !== teacherId))
      } else {
        await addFavorite(user.localId, user.idToken, teacherId)
        setFavoriteIds((prev) => [...prev, teacherId])
      }

      return 'ok' as const
    },
    [favoriteIds, user],
  )

  const value = useMemo(
    () => ({ favoriteIds, loading, isFavorite, toggleFavorite }),
    [favoriteIds, loading, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
