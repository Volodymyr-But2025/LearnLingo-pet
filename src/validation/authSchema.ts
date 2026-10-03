import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export const registerSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
export type RegisterFormValues = yup.InferType<typeof registerSchema>
