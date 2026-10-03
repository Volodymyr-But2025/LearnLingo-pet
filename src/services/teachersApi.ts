import type { Teacher } from '../types/teacher'
import { getFirebaseConfig } from './firebase'

type TeacherData = Omit<Teacher, 'id'>
type TeachersResponse = Record<string, TeacherData | null> | Array<TeacherData | null> | null

export type TeachersPage = {
  teachers: Teacher[]
  nextCursor: string | null
  hasMore: boolean
}

export const PAGE_SIZE = 4

function toTeacher(id: string, teacher: TeacherData): Teacher {
  return {
    id,
    ...teacher,
    reviews: teacher.reviews ?? [],
    languages: teacher.languages ?? [],
    levels: teacher.levels ?? [],
    conditions: teacher.conditions ?? [],
  }
}

function mapTeachers(data: TeachersResponse): Teacher[] {
  if (!data) return []

  // Sequential numeric keys come back as a sparse JSON array with null holes.
  if (Array.isArray(data)) {
    return data.flatMap((teacher, index) =>
      teacher ? [toTeacher(String(index), teacher)] : [],
    )
  }

  return Object.entries(data).flatMap(([id, teacher]) =>
    teacher ? [toTeacher(id, teacher)] : [],
  )
}

export async function fetchTeachersPage(startAt?: string | null): Promise<TeachersPage> {
  const { databaseURL } = getFirebaseConfig()
  const params = new URLSearchParams({
    orderBy: '"$key"',
    limitToFirst: String(startAt ? PAGE_SIZE + 1 : PAGE_SIZE),
  })

  if (startAt) {
    params.set('startAt', `"${startAt}"`)
  }

  const response = await fetch(`${databaseURL}/teachers.json?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to load teachers')
  }

  const data = (await response.json()) as TeachersResponse
  let teachers = mapTeachers(data)

  if (startAt && teachers[0]?.id === startAt) {
    teachers = teachers.slice(1)
  }

  const lastId = teachers.at(-1)?.id ?? null
  const hasMore = teachers.length === PAGE_SIZE

  return {
    teachers,
    nextCursor: hasMore ? lastId : null,
    hasMore,
  }
}

export async function fetchAllTeachers(): Promise<Teacher[]> {
  const { databaseURL } = getFirebaseConfig()
  const response = await fetch(`${databaseURL}/teachers.json`)

  if (!response.ok) {
    throw new Error('Failed to load teachers')
  }

  const data = (await response.json()) as TeachersResponse
  return mapTeachers(data)
}
