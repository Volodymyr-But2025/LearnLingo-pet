import { useEffect, useId, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

type HeaderProps = {
  onLogin: () => void
  onRegister: () => void
}

export function Header({ onLogin, onRegister }: HeaderProps) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => {
    const closeOnResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleLogin = () => {
    closeMenu()
    onLogin()
  }

  const handleRegister = () => {
    closeMenu()
    onRegister()
  }

  const handleLogout = () => {
    closeMenu()
    void logout()
  }

  return (
    <header className={`${styles.header}${menuOpen ? ` ${styles.headerOpen}` : ''}`}>
      <NavLink to="/" className={styles.logo} onClick={closeMenu}>
        <span className={styles.logoMark} aria-hidden="true" />
        LearnLingo
      </NavLink>

      <button
        type="button"
        className={styles.menuBtn}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div id={menuId} className={`${styles.panel}${menuOpen ? ` ${styles.panelOpen}` : ''}`}>
        <nav className={styles.nav} aria-label="Main">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
            onClick={closeMenu}
          >
            Teachers
          </NavLink>
          {user && (
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
              onClick={closeMenu}
            >
              Favorites
            </NavLink>
          )}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.user}>{user.displayName}</span>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M12.5 3.5H15a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 15 16.5h-2.5M8.5 13.5 12 10 8.5 6.5M12 10H3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Log out
              </button>
            </>
          ) : (
            <>
              <button type="button" className={styles.loginBtn} onClick={handleLogin}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M7.5 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h2.5M11.5 13.5 15 10l-3.5-3.5M15 10H6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Log in
              </button>
              <button type="button" className={styles.registerBtn} onClick={handleRegister}>
                Registration
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
