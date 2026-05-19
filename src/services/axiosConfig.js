import axios from 'axios'

// Configurar base URL
axios.defaults.baseURL = 'http://localhost:5238/api'

// Interceptor global para tratamento de erros
axios.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })

    // Tratamento específico de erros
    if (error.response?.status === 409) {
      // Conflict - details already exist for this catch
      error.message = 'Details already exist for this catch'
    } else if (error.response?.status === 400) {
      error.message = error.response?.data?.error || 'Bad Request'
    } else if (error.response?.status === 404) {
      // 404 é esperado para detalhes não existentes
      error.message = error.response?.data?.error || 'Not Found'
    } else if (error.response?.status === 500) {
      error.message = 'Server Error: ' + (error.response?.data?.error || 'Internal Server Error')
    } else if (!error.response) {
      // Network error
      error.message = 'Network Error: Backend não está respondendo em http://localhost:5238'
    }
    
    return Promise.reject(error)
  }
)

export default axios
