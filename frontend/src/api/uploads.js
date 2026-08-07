// src/api/uploads.js
import api from './axios.js'

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}