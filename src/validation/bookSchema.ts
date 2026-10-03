import * as yup from 'yup'
import { BOOK_REASONS } from '../constants/filters'

export const bookSchema = yup.object({
  reason: yup
    .string()
    .oneOf([...BOOK_REASONS], 'Select a reason')
    .required('Select a reason'),
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .trim()
    .matches(/^\+?[\d\s()-]{7,20}$/, 'Enter a valid phone number')
    .required('Phone is required'),
})

export type BookFormValues = yup.InferType<typeof bookSchema>
