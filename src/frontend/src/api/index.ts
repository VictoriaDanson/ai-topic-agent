import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

/**
 * 创建 Axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 */
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    console.error('API 请求错误:', error)
    return Promise.reject(error)
  }
)

export default apiClient
