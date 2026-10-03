import {
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
  PRICE_OPTIONS,
} from '../../constants/filters'
import type { TeacherFilters as Filters } from '../../types/teacher'
import styles from './TeacherFilters.module.css'

type TeacherFiltersProps = {
  value: Filters
  onChange: (next: Filters) => void
}

export function TeacherFilters({ value, onChange }: TeacherFiltersProps) {
  return (
    <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
      <label className={styles.field}>
        <span className={styles.label}>Languages</span>
        <select
          className={styles.select}
          value={value.language}
          onChange={(event) => onChange({ ...value, language: event.target.value })}
        >
          <option value="">All languages</option>
          {LANGUAGE_OPTIONS.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Level of knowledge</span>
        <select
          className={styles.select}
          value={value.level}
          onChange={(event) => onChange({ ...value, level: event.target.value })}
        >
          <option value="">All levels</option>
          {LEVEL_OPTIONS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Price</span>
        <select
          className={styles.select}
          value={value.price}
          onChange={(event) => onChange({ ...value, price: event.target.value })}
        >
          <option value="">All prices</option>
          {PRICE_OPTIONS.map((price) => (
            <option key={price} value={String(price)}>
              {price} $
            </option>
          ))}
        </select>
      </label>
    </form>
  )
}
