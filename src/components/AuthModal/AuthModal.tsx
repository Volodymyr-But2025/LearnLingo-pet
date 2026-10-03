import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../../validation/authSchema'
import { Modal } from '../Modal/Modal'
import styles from './AuthModal.module.css'

type AuthModalProps = {
  mode: 'login' | 'register'
  onClose: () => void
}

export function AuthModal({ mode, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const isLogin = mode === 'login'

  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const titleId = isLogin ? 'login-title' : 'register-title'

  const onLoginSubmit = loginForm.handleSubmit(async (values) => {
    setSubmitError('')
    try {
      await login(values.email, values.password)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed')
    }
  })

  const onRegisterSubmit = registerForm.handleSubmit(async (values) => {
    setSubmitError('')
    try {
      await register(values.name, values.email, values.password)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed')
    }
  })

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <h2 id={titleId} className={styles.title}>
        {isLogin ? 'Log In' : 'Registration'}
      </h2>
      <p className={styles.text}>
        {isLogin
          ? 'Welcome back! Please enter your credentials to access your account and continue your search for a teacher.'
          : 'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.'}
      </p>

      {isLogin ? (
        <form className={styles.form} onSubmit={onLoginSubmit} noValidate>
          <label className={styles.field}>
            <span className="visually-hidden">Email</span>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...loginForm.register('email')}
            />
            {loginForm.formState.errors.email && (
              <p className={styles.error}>{loginForm.formState.errors.email.message}</p>
            )}
          </label>
          <label className={styles.field}>
            <span className="visually-hidden">Password</span>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...loginForm.register('password')}
            />
            {loginForm.formState.errors.password && (
              <p className={styles.error}>{loginForm.formState.errors.password.message}</p>
            )}
          </label>
          {submitError && <p className={styles.error}>{submitError}</p>}
          <button
            type="submit"
            className={styles.submit}
            disabled={loginForm.formState.isSubmitting}
          >
            Log In
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={onRegisterSubmit} noValidate>
          <label className={styles.field}>
            <span className="visually-hidden">Name</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              autoComplete="name"
              {...registerForm.register('name')}
            />
            {registerForm.formState.errors.name && (
              <p className={styles.error}>{registerForm.formState.errors.name.message}</p>
            )}
          </label>
          <label className={styles.field}>
            <span className="visually-hidden">Email</span>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...registerForm.register('email')}
            />
            {registerForm.formState.errors.email && (
              <p className={styles.error}>{registerForm.formState.errors.email.message}</p>
            )}
          </label>
          <label className={styles.field}>
            <span className="visually-hidden">Password</span>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...registerForm.register('password')}
            />
            {registerForm.formState.errors.password && (
              <p className={styles.error}>{registerForm.formState.errors.password.message}</p>
            )}
          </label>
          {submitError && <p className={styles.error}>{submitError}</p>}
          <button
            type="submit"
            className={styles.submit}
            disabled={registerForm.formState.isSubmitting}
          >
            Sign Up
          </button>
        </form>
      )}
    </Modal>
  )
}
