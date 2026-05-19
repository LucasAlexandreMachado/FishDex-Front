import axios from 'axios'

export const catchService = {
  getCatches: async () => {
    const response = await axios.get('/catches')
    return response.data
  },

  getCatchById: async (id) => {
    const response = await axios.get(`/catches/${id}`)
    return response.data
  },

  createCatch: async (data) => {
    // Note: Do not send catchDate - backend generates it automatically
    const { catchDate, ...payload } = data
    const response = await axios.post('/catches', payload)
    return response.data
  },

  updateCatch: async (id, data) => {
    const { catchDate, ...payload } = data
    const response = await axios.put(`/catches/${id}`, { ...payload, id })
    return response.data
  },

  deleteCatch: async (id) => {
    await axios.delete(`/catches/${id}`)
  }
}
