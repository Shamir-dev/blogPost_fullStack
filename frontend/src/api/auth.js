// src/api/auth.js
import api from './axios.js'

export const registerUser = async (username, email, password) => {
  const { data } = await api.post('/auth/register', { username, email, password })
  return data
}

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const fetchCurrentUser = async (token) => {
  const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  return data
}

export const requestPasswordReset = async (email) => {
  const { data } = await api.post('/auth/request-reset', { email })
  return data
}