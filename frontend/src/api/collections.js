// src/api/collections.js
import api from './axios.js'

export const fetchMyCollections = async () => {
  const { data } = await api.get('/collections')
  return data
}

export const createCollection = async (name) => {
  const { data } = await api.post('/collections', { name })
  return data
}

export const fetchCollection = async (id) => {
  const { data } = await api.get(`/collections/${id}`)
  return data
}

export const deleteCollection = async (id) => {
  const { data } = await api.delete(`/collections/${id}`)
  return data
}

export const addPostToCollection = async (collectionId, postId) => {
  const { data } = await api.post(`/collections/${collectionId}/posts/${postId}`)
  return data
}

export const removePostFromCollection = async (collectionId, postId) => {
  const { data } = await api.delete(`/collections/${collectionId}/posts/${postId}`)
  return data
}