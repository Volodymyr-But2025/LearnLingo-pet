import type { Teacher, TeacherFilters } from '../types/teacher'

export function filterTeachers(teachers: Teacher[], filters: TeacherFilters) {
  return teachers.filter((teacher) => {
    const byLanguage =
      !filters.language || teacher.languages.includes(filters.language)
    const byLevel = !filters.level || teacher.levels.includes(filters.level)
    const byPrice =
      !filters.price || teacher.price_per_hour === Number(filters.price)

    return byLanguage && byLevel && byPrice
  })
}
