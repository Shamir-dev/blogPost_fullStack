// src/api/categories.js
import api from './axios.js'

export const fetchCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}