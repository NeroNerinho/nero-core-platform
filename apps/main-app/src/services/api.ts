import axios from 'axios'

// API Endpoint from sistema_cheking/approval-panel
const API_ENDPOINT = 'https://n8n.grupoom.com.br/webhook/CheckingCentral'

export const api = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor to handle n8n response format (sometimes it returns 200 with error inside)
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)
