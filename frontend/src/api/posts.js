// src/api/posts.js
import api from './axios.js'

// src/api/posts.js — UPDATE fetchPosts 
export const fetchPosts = async (sort = 'recent', category = null, page = 1) => {
  const params = { sort, page }
  if (category) params.category = category
  const { data } = await api.get('/posts', { params })
  return data
}
export const fetchPostById = async (id) => {
  const { data } = await api.get(`/posts/${id}`)
  return data
}

export const createPost = async (postData) => {
  const { data } = await api.post('/posts', postData)
  return data
}

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData)
  return data
}

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`)
  return data
}

// src/api/posts.js  — ADD this function
export const searchPosts = async (query) => {
  const { data } = await api.get('/posts/search', { params: { q: query } })
  return data
}