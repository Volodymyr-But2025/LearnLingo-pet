const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim() ?? ''
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim().replace(/\/$/, '') ?? ''

export function getFirebaseConfig() {
  if (!apiKey || !databaseURL) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env and set VITE_FIREBASE_API_KEY and VITE_FIREBASE_DATABASE_URL.',
    )
  }

  return { apiKey, databaseURL }
}
