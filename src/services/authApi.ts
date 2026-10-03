import { getFirebaseConfig } from './firebase'

const AUTH_STORAGE_KEY = 'learnlingo_auth'

export type AuthUser = {
  idToken: string
  refreshToken: string
  localId: string
  email: string
  displayName: string
}

type AuthResponse = {
  idToken: string
  refreshToken: string
  localId: string
  email: string
  displayName?: string
  error?: { message: string }
}

type LookupResponse = {
  users?: Array<{
    localId: string
    email: string
    displayName?: string
  }>
  error?: { message: string }
}

function authUrl(path: string) {
  const { apiKey } = getFirebaseConfig()
  return `https://identitytoolkit.googleapis.com/v1/${path}?key=${apiKey}`
}

export function readStoredAuth(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function writeStoredAuth(user: AuthUser) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(authUrl('accounts:signUp'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      displayName: name,
      returnSecureToken: true,
    }),
  })

  const data = (await response.json()) as AuthResponse
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Registration failed')
  }

  const user: AuthUser = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId,
    email: data.email,
    displayName: data.displayName || name,
  }

  writeStoredAuth(user)
  return user
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(authUrl('accounts:signInWithPassword'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  })

  const data = (await response.json()) as AuthResponse
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Login failed')
  }

  const user: AuthUser = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId,
    email: data.email,
    displayName: data.displayName || email.split('@')[0],
  }

  writeStoredAuth(user)
  return user
}

export async function lookupUser(idToken: string) {
  const response = await fetch(authUrl('accounts:lookup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  const data = (await response.json()) as LookupResponse
  if (!response.ok || !data.users?.[0]) {
    throw new Error(data.error?.message ?? 'Session expired')
  }

  const profile = data.users[0]
  const stored = readStoredAuth()

  const user: AuthUser = {
    idToken,
    refreshToken: stored?.refreshToken ?? '',
    localId: profile.localId,
    email: profile.email,
    displayName: profile.displayName || profile.email.split('@')[0],
  }

  writeStoredAuth(user)
  return user
}

export function logoutUser() {
  clearStoredAuth()
}
