import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

type HeaderProps = {
  onLogin: () => void
  onRegister: () => void
}

export function Header({ onLogin, onRegister }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true" />
        LearnLingo
      </NavLink>

      <nav className={styles.nav} aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
          }
        >
          Teachers
        </NavLink>
        {user && (
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Favorites
          </NavLink>
        )}
      </nav>

      <div className={styles.actions}>
        {user ? (
          <>
            <span className={styles.user}>{user.displayName}</span>
            <button type="button" className={styles.logoutBtn} onClick={logout}>
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
            <button type="button" className={styles.loginBtn} onClick={onLogin}>
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
            <button type="button" className={styles.registerBtn} onClick={onRegister}>
              Registration
            </button>
          </>
        )}
      </div>
    </header>
  )
}
