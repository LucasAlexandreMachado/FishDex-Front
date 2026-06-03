import axios from 'axios'

export const uploadService = {
  uploadFile: async (file) => {
    const form = new FormData()
    form.append('file', file)

    const response = await axios.post('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  }
}
