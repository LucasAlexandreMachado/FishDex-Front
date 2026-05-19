import axios from 'axios'

export const catchDetailService = {
  getDetailByCatchId: async (catchId) => {
    const response = await axios.get(`/catchdetails/catch/${catchId}`)
    return response.data
  },

  getDetailById: async (id) => {
    const response = await axios.get(`/catchdetails/${id}`)
    return response.data
  },

  createDetail: async (data) => {
    const response = await axios.post('/catchdetails', data)
    return response.data
  },

  updateDetail: async (id, data) => {
    const response = await axios.put(`/catchdetails/${id}`, data)
    return response.data
  },

  deleteDetail: async (id) => {
    await axios.delete(`/catchdetails/${id}`)
  }
}
