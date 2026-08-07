// src/api/users.js — full file
import api from './axios.js'

export const fetchUserProfile = async (userId) => (await api.get(`/users/${userId}`)).data

export const fetchMyArticles = async () => (await api.get('/users/me/articles')).data

export const fetchMyDrafts = async () => (await api.get('/users/me/drafts')).data

export const fetchMyBookmarks = async () => (await api.get('/users/me/bookmarks')).data

export const toggleFollow = async (userId) => (await api.post(`/users/${userId}/follow`)).data

export const updateMyProfile = async (payload) => (await api.patch('/users/me', payload)).data

export const changeMyPassword = async (currentPassword, newPassword) =>
  (await api.patch('/users/me/password', { current_password: currentPassword, new_password: newPassword })).data