import axios from 'axios'

export const speciesService = {
  getSpecies: async () => {
    const response = await axios.get('/species')
    return response.data
  },

  getSpeciesById: async (id) => {
    const response = await axios.get(`/species/${id}`)
    return response.data
  },

  createSpecies: async (data) => {
    const response = await axios.post('/species', data)
    return response.data
  },

  updateSpecies: async (id, data) => {
    const response = await axios.put(`/species/${id}`, { ...data, id })
    return response.data
  },

  deleteSpecies: async (id) => {
    await axios.delete(`/species/${id}`)
  }
}
