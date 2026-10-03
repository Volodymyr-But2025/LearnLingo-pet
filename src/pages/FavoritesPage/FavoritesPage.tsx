import { useEffect, useMemo, useState } from 'react'
import { BookTrialModal } from '../../components/BookTrialModal/BookTrialModal'
import { TeacherCard } from '../../components/TeacherCard/TeacherCard'
import { useFavorites } from '../../context/FavoritesContext'
import { fetchAllTeachers } from '../../services/teachersApi'
import type { Teacher } from '../../types/teacher'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchAllTeachers()
      .then((items) => {
        if (!cancelled) setTeachers(items)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load favorites')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const favoriteTeachers = useMemo(
    () => teachers.filter((teacher) => favoriteIds.includes(teacher.id)),
    [teachers, favoriteIds],
  )

  const isBusy = loading || favoritesLoading

  return (
    <main>
      <h1 className="visually-hidden">Favorites</h1>

      {isBusy && <p className="status">Loading favorites...</p>}
      {error && <p className="status error">{error}</p>}

      {!isBusy && !error && favoriteTeachers.length === 0 && (
        <p className={styles.empty}>You have not added any teachers to favorites yet.</p>
      )}

      <ul className={styles.list}>
        {favoriteTeachers.map((teacher) => (
          <li key={teacher.id}>
            <TeacherCard
              teacher={teacher}
              onBook={setBookingTeacher}
              onGuestFavorite={() => undefined}
            />
          </li>
        ))}
      </ul>

      {bookingTeacher && (
        <BookTrialModal teacher={bookingTeacher} onClose={() => setBookingTeacher(null)} />
      )}
    </main>
  )
}
