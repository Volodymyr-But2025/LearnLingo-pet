import { useState } from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import type { Teacher } from '../../types/teacher'
import styles from './TeacherCard.module.css'

type TeacherCardProps = {
  teacher: Teacher
  activeLevel?: string
  onBook: (teacher: Teacher) => void
  onGuestFavorite: () => void
}

export function TeacherCard({
  teacher,
  activeLevel = '',
  onBook,
  onGuestFavorite,
}: TeacherCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [expanded, setExpanded] = useState(false)
  const favorite = isFavorite(teacher.id)

  const handleFavorite = async () => {
    const result = await toggleFavorite(teacher.id)
    if (result === 'guest') onGuestFavorite()
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={`${styles.heart} ${favorite ? styles.heartActive : ''}`}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={favorite}
        onClick={handleFavorite}
      >
        <svg viewBox="0 0 26 26" aria-hidden="true">
          <path
            d="M13 22.5s-8.5-5.2-8.5-11A4.75 4.75 0 0 1 13 7.8a4.75 4.75 0 0 1 8.5 3.7c0 5.8-8.5 11-8.5 11Z"
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.avatarWrap}>
        <div className={styles.avatarRing}>
          <img
            className={styles.avatar}
            src={teacher.avatar_url}
            alt={`${teacher.name} ${teacher.surname}`}
            width={96}
            height={96}
          />
        </div>
        <span className={styles.online} aria-label="Online" />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <p className={styles.label}>Languages</p>
            <h2 className={styles.name}>
              {teacher.name} {teacher.surname}
            </h2>
          </div>

          <ul className={styles.stats}>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2.5 3h8a1 1 0 0 1 1 1v7.2a.8.8 0 0 1-1.2.7L8 10.4l-2.3 1.5a.8.8 0 0 1-1.2-.7V4a1 1 0 0 1 1-1Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 3v8.5M8 3v6.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Lessons online
            </li>
            <li>Lessons done: {teacher.lessons_done}</li>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="m8 1.5 1.9 3.85 4.25.62-3.08 3 0.73 4.23L8 11.2l-3.8 2 0.73-4.23-3.08-3 4.25-.62L8 1.5Z"
                  fill="#FFC531"
                />
              </svg>
              Rating: {teacher.rating}
            </li>
            <li>
              Price / 1 hour:{' '}
              <strong className={styles.price}>{teacher.price_per_hour}$</strong>
            </li>
          </ul>
        </div>

        <div className={styles.meta}>
          <p>
            <span>Speaks: </span>
            <strong className={styles.speaks}>{teacher.languages.join(', ')}</strong>
          </p>
          <p>
            <span>Lesson Info: </span>
            {teacher.lesson_info}
          </p>
          <p>
            <span>Conditions: </span>
            {teacher.conditions.join(' ')}
          </p>
        </div>

        {!expanded && (
          <button type="button" className={styles.readMore} onClick={() => setExpanded(true)}>
            Read more
          </button>
        )}

        {expanded && (
          <>
            <p className={styles.experience}>{teacher.experience}</p>
            <ul className={styles.reviews}>
              {teacher.reviews.map((review) => (
                <li key={`${review.reviewer_name}-${review.comment}`}>
                  <div className={styles.reviewer}>
                    <span className={styles.reviewAvatar} aria-hidden="true">
                      {review.reviewer_name.slice(0, 1)}
                    </span>
                    <div>
                      <p className={styles.reviewName}>{review.reviewer_name}</p>
                      <p className={styles.reviewRating}>
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                          <path
                            d="m8 1.5 1.9 3.85 4.25.62-3.08 3 0.73 4.23L8 11.2l-3.8 2 0.73-4.23-3.08-3 4.25-.62L8 1.5Z"
                            fill="#FFC531"
                          />
                        </svg>
                        {review.reviewer_rating}
                      </p>
                    </div>
                  </div>
                  <p className={styles.comment}>{review.comment}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        <ul className={styles.levels}>
          {teacher.levels.map((level) => (
            <li
              key={level}
              className={`${styles.level} ${level === activeLevel ? styles.levelActive : ''}`}
            >
              #{level}
            </li>
          ))}
        </ul>

        <button type="button" className={styles.bookBtn} onClick={() => onBook(teacher)}>
          Book trial lesson
        </button>
      </div>
    </article>
  )
}
