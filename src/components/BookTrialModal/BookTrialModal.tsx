import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { BOOK_REASONS } from '../../constants/filters'
import type { Teacher } from '../../types/teacher'
import { bookSchema, type BookFormValues } from '../../validation/bookSchema'
import { Modal } from '../Modal/Modal'
import styles from './BookTrialModal.module.css'

type BookTrialModalProps = {
  teacher: Teacher
  onClose: () => void
}

export function BookTrialModal({ teacher, onClose }: BookTrialModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      reason: BOOK_REASONS[0],
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = handleSubmit(async () => {
    onClose()
  })

  return (
    <Modal onClose={onClose} labelledBy="book-title">
      <h2 id="book-title" className={styles.title}>
        Book trial lesson
      </h2>
      <p className={styles.description}>
        Our experienced tutor will help you overcome your fears and master a conversational
        language.
      </p>

      <div className={styles.teacher}>
        <img
          className={styles.avatar}
          src={teacher.avatar_url}
          alt={`${teacher.name} ${teacher.surname}`}
          width={44}
          height={44}
        />
        <div>
          <p className={styles.caption}>Your teacher</p>
          <p className={styles.name}>
            {teacher.name} {teacher.surname}
          </p>
        </div>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <fieldset className={styles.reasons}>
          <legend className={styles.reasonsTitle}>
            What is your main reason for learning English?
          </legend>
          {BOOK_REASONS.map((reason) => (
            <label key={reason} className={styles.reason}>
              <input type="radio" value={reason} {...register('reason')} />
              <span>{reason}</span>
            </label>
          ))}
          {errors.reason && <p className={styles.error}>{errors.reason.message}</p>}
        </fieldset>

        <label className={styles.field}>
          <span className="visually-hidden">Name</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            {...register('name')}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </label>

        <label className={styles.field}>
          <span className="visually-hidden">Email</span>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </label>

        <label className={styles.field}>
          <span className="visually-hidden">Phone number</span>
          <input
            className={styles.input}
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            {...register('phone')}
          />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        </label>

        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          Book
        </button>
      </form>
    </Modal>
  )
}
