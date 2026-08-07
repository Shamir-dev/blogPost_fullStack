// src/api/interactions.js
import api from './axios.js'

export const toggleLike = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/like`)
  return data
}

export const toggleBookmark = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/bookmark`)
  return data
}

export const fetchInteractionStatus = async (postId) => {
  const { data } = await api.get(`/posts/${postId}/status`)
  return data
}

export const fetchComments = async (postId) => {
  const { data } = await api.get(`/posts/${postId}/comments`)
  return data
}

export const postComment = async (postId, content) => {
  const { data } = await api.post(`/posts/${postId}/comments`, { content })
  return data
}