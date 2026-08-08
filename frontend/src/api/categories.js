// // src/api/categories.js
// import api from './axios.js'

// export const fetchCategories = async () => {
//   const { data } = await api.get('/categories')
//   return data
// }


// src/api/categories.js
import api from './axios.js'

export const fetchCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}

export const createCategory = async (name, icon = '') => {
  const { data } = await api.post('/categories', { name, icon })
  return data
}

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`)
  return data
}