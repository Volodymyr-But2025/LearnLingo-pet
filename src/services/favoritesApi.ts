import { getFirebaseConfig } from './firebase'

export async function fetchFavoriteIds(uid: string, idToken: string) {
  const { databaseURL } = getFirebaseConfig()
  const response = await fetch(
    `${databaseURL}/users/${uid}/favorites.json?auth=${encodeURIComponent(idToken)}`,
  )

  if (!response.ok) {
    throw new Error('Failed to load favorites')
  }

  const data = (await response.json()) as Record<string, boolean> | null
  if (!data) return [] as string[]

  return Object.keys(data).filter((id) => data[id])
}

export async function addFavorite(uid: string, idToken: string, teacherId: string) {
  const { databaseURL } = getFirebaseConfig()
  const response = await fetch(
    `${databaseURL}/users/${uid}/favorites/${teacherId}.json?auth=${encodeURIComponent(idToken)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(true),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to add favorite')
  }
}

export async function removeFavorite(uid: string, idToken: string, teacherId: string) {
  const { databaseURL } = getFirebaseConfig()
  const response = await fetch(
    `${databaseURL}/users/${uid}/favorites/${teacherId}.json?auth=${encodeURIComponent(idToken)}`,
    { method: 'DELETE' },
  )

  if (!response.ok) {
    throw new Error('Failed to remove favorite')
  }
}
