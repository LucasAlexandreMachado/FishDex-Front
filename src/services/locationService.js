import axios from 'axios'

export const locationService = {
  getLocations: async () => {
    const response = await axios.get('/locations')
    return response.data
  },

  getLocationById: async (id) => {
    const response = await axios.get(`/locations/${id}`)
    return response.data
  },

  createLocation: async (data) => {
    const response = await axios.post('/locations', data)
    return response.data
  },

  updateLocation: async (id, data) => {
    const response = await axios.put(`/locations/${id}`, { ...data, id })
    return response.data
  },

  deleteLocation: async (id) => {
    await axios.delete(`/locations/${id}`)
  }
}
