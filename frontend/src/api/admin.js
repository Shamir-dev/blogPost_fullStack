// src/api/admin.js
import api from './axios.js'

export const fetchStats = async () => (await api.get('/admin/stats')).data
export const fetchAllUsers = async () => (await api.get('/admin/users')).data
export const deleteUserAdmin = async (id) => (await api.delete(`/admin/users/${id}`)).data
export const fetchAllPosts = async () => (await api.get('/admin/posts')).data
export const deletePostAdmin = async (id) => (await api.delete(`/admin/posts/${id}`)).data
export const fetchPasswordResets = async () => (await api.get('/admin/password-resets')).data
export const fetchPasswordResetHistory = async () => (await api.get('/admin/password-resets/history')).data
export const resolvePasswordReset = async (id) => (await api.post(`/admin/password-resets/${id}/resolve`)).data