import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookTrialModal } from '../../components/BookTrialModal/BookTrialModal'
import { Modal } from '../../components/Modal/Modal'
import { TeacherCard } from '../../components/TeacherCard/TeacherCard'
import { TeacherFilters } from '../../components/TeacherFilters/TeacherFilters'
import { fetchTeachersPage, PAGE_SIZE } from '../../services/teachersApi'
import type { Teacher, TeacherFilters as Filters } from '../../types/teacher'
import { filterTeachers } from '../../utils/filterTeachers'
import styles from './TeachersPage.module.css'

const initialFilters: Filters = {
  language: '',
  level: '',
  price: '',
}

function hasActiveFilters(filters: Filters) {
  return Boolean(filters.language || filters.level || filters.price)
}

function mergeTeachers(prev: Teacher[], next: Teacher[]) {
  const existing = new Set(prev.map((item) => item.id))
  const unique = next.filter((item) => !existing.has(item.id))
  return [...prev, ...unique]
}

export function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null)
  const [guestNoticeOpen, setGuestNoticeOpen] = useState(false)

  const syncIdRef = useRef(0)
  const teachersRef = useRef(teachers)
  const cursorRef = useRef(cursor)
  const hasMoreRef = useRef(hasMore)
  const filtersRef = useRef(filters)

  teachersRef.current = teachers
  cursorRef.current = cursor
  hasMoreRef.current = hasMore
  filtersRef.current = filters

  const commitPage = (accumulated: Teacher[], nextCursor: string | null, more: boolean) => {
    teachersRef.current = accumulated
    cursorRef.current = nextCursor
    hasMoreRef.current = more
    setTeachers(accumulated)
    setCursor(nextCursor)
    setHasMore(more)
  }

  const fetchUntilMatched = useCallback(async (targetCount: number, activeFilters: Filters) => {
    let accumulated = teachersRef.current
    let nextCursor = cursorRef.current
    let more = hasMoreRef.current

    while (more && nextCursor && filterTeachers(accumulated, activeFilters).length < targetCount) {
      const page = await fetchTeachersPage(nextCursor)
      accumulated = mergeTeachers(accumulated, page.teachers)
      nextCursor = page.nextCursor
      more = page.hasMore
    }

    commitPage(accumulated, nextCursor, more)
    return filterTeachers(accumulated, activeFilters).length
  }, [])

  const fetchUntilCount = useCallback(async (targetCount: number) => {
    let accumulated = teachersRef.current
    let nextCursor = cursorRef.current
    let more = hasMoreRef.current

    while (more && nextCursor && accumulated.length < targetCount) {
      const page = await fetchTeachersPage(nextCursor)
      accumulated = mergeTeachers(accumulated, page.teachers)
      nextCursor = page.nextCursor
      more = page.hasMore
    }

    commitPage(accumulated, nextCursor, more)
  }, [])

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const page = await fetchTeachersPage()
      commitPage(page.teachers, page.nextCursor, page.hasMore)
      setDisplayLimit(PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitial()
  }, [loadInitial])

  useEffect(() => {
    setDisplayLimit(PAGE_SIZE)
  }, [filters])

  const matchedTeachers = useMemo(
    () => filterTeachers(teachers, filters),
    [teachers, filters],
  )

  const filteredMode = hasActiveFilters(filters)
  const sourceList = filteredMode ? matchedTeachers : teachers
  const visibleTeachers = sourceList.slice(0, displayLimit)
  const canLoadMore = filteredMode
    ? matchedTeachers.length > displayLimit
    : teachers.length > displayLimit || hasMore

  // Silently fill the current filtered page and probe one extra match.
  useEffect(() => {
    if (loading || loadingMore || !filteredMode) return

    const probeCount = displayLimit + 1
    const matchedCount = filterTeachers(teachersRef.current, filters).length

    if (matchedCount >= probeCount) return
    if (!hasMoreRef.current || !cursorRef.current) return

    const syncId = ++syncIdRef.current

    const syncFiltered = async () => {
      try {
        await fetchUntilMatched(probeCount, filters)
      } catch (err) {
        if (syncId === syncIdRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load teachers')
        }
      }
    }

    void syncFiltered()

    return () => {
      syncIdRef.current += 1
    }
  }, [loading, loadingMore, filters, displayLimit, filteredMode, fetchUntilMatched])

  const loadMore = async () => {
    if (loadingMore) return

    const nextLimit = displayLimit + PAGE_SIZE

    if (!filteredMode) {
      if (teachersRef.current.length >= nextLimit) {
        setDisplayLimit(nextLimit)
        return
      }

      if (!cursorRef.current) return

      setLoadingMore(true)
      setError('')

      try {
        await fetchUntilCount(nextLimit)
        setDisplayLimit(nextLimit)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load more teachers')
      } finally {
        setLoadingMore(false)
      }
      return
    }

    syncIdRef.current += 1
    setLoadingMore(true)
    setError('')

    try {
      await fetchUntilMatched(nextLimit + 1, filtersRef.current)
      setDisplayLimit(nextLimit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more teachers')
    } finally {
      setLoadingMore(false)
    }
  }

  const showEmpty =
    !loading && !error && visibleTeachers.length === 0 && !canLoadMore && !hasMore

  return (
    <main>
      <h1 className="visually-hidden">Teachers</h1>
      <TeacherFilters value={filters} onChange={setFilters} />

      {loading && <p className="status">Loading teachers...</p>}
      {error && <p className="status error">{error}</p>}

      {showEmpty && <p className={styles.empty}>No teachers match the selected filters.</p>}

      <ul className={styles.list}>
        {visibleTeachers.map((teacher) => (
          <li key={teacher.id}>
            <TeacherCard
              teacher={teacher}
              activeLevel={filters.level}
              onBook={setBookingTeacher}
              onGuestFavorite={() => setGuestNoticeOpen(true)}
            />
          </li>
        ))}
      </ul>

      {!loading && canLoadMore && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={loadMore}
          disabled={loadingMore}
        >
          Load more
        </button>
      )}

      {bookingTeacher && (
        <BookTrialModal teacher={bookingTeacher} onClose={() => setBookingTeacher(null)} />
      )}

      {guestNoticeOpen && (
        <Modal onClose={() => setGuestNoticeOpen(false)} labelledBy="guest-notice-title">
          <h2 id="guest-notice-title">Favorites</h2>
          <p className={styles.notice}>
            This feature is available only for authorized users. Please log in or register to add
            teachers to favorites.
          </p>
        </Modal>
      )}
    </main>
  )
}
