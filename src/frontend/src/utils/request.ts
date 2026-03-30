/**
 * Fetch 请求封装工具
 * 提供统一的请求接口、错误处理、拦截器等功能
 *
 * 功能特性：
 * - 请求/响应拦截器
 * - 超时控制
 * - 请求取消
 * - 重试机制
 * - 状态码统一处理
 * - 错误类型化
 * - 请求缓存
 * - 多环境适配
 */

import type { ApiResponse } from '@/types'
import { envConfig } from '@/config/env'

/**
 * HTTP 状态码枚举
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  ABORT_ERROR = 'ABORT_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 自定义请求错误
 */
export class RequestError extends Error {
  type: ErrorType
  status?: number
  statusText?: string
  response?: Response

  constructor(
    message: string,
    type: ErrorType,
    status?: number,
    response?: Response
  ) {
    super(message)
    this.name = 'RequestError'
    this.type = type
    this.status = status
    this.statusText = response?.statusText
    this.response = response
  }
}

/**
 * 请求配置接口
 */
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  baseURL?: string
  timeout?: number
  params?: Record<string, string | number | boolean | undefined | null>
  data?: unknown
  headers?: Record<string, string>
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
  enableCache?: boolean // 是否启用缓存
  cacheTime?: number // 缓存时间（毫秒）
  validateStatus?: (status: number) => boolean // 自定义状态码验证
}

/**
 * 拦截器接口
 */
export interface Interceptors {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  response?: (response: Response) => Response | Promise<Response>
  requestError?: (error: RequestError) => void
  responseError?: (error: RequestError) => void
}

/**
 * 缓存项接口
 */
interface CacheItem {
  data: unknown
  timestamp: number
  expiresIn: number
}

/**
 * 请求类
 */
class Request {
  private baseURL: string
  private timeout: number
  private defaultHeaders: Record<string, string>
  private interceptors: Interceptors
  private cache: Map<string, CacheItem>
  private pendingRequests: Map<string, AbortController>

  constructor(config: Partial<RequestConfig> = {}) {
    this.baseURL = config.baseURL || '/api'
    this.timeout = config.timeout || 60000
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(config.headers || {})
    }
    this.interceptors = {}
    this.cache = new Map()
    this.pendingRequests = new Map()
  }

  /**
   * 设置请求拦截器
   */
  setRequestInterceptor(
    interceptor: (
      config: RequestConfig
    ) => RequestConfig | Promise<RequestConfig>
  ): void {
    this.interceptors.request = interceptor
  }

  /**
   * 设置响应拦截器
   */
  setResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.interceptors.response = interceptor
  }

  /**
   * 设置请求错误拦截器
   */
  setRequestErrorInterceptor(interceptor: (error: RequestError) => void): void {
    this.interceptors.requestError = interceptor
  }

  /**
   * 设置响应错误拦截器
   */
  setResponseErrorInterceptor(
    interceptor: (error: RequestError) => void
  ): void {
    this.interceptors.responseError = interceptor
  }

  /**
   * 构建完整 URL（带查询参数）
   */
  private buildURL(
    url: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    if (!params || Object.keys(params).length === 0) {
      return fullURL
    }

    // 过滤掉 undefined 和 null
    const validParams = Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )

    if (validParams.length === 0) {
      return fullURL
    }

    const queryString = validParams
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&')

    return `${fullURL}?${queryString}`
  }

  /**
   * 生成缓存 key
   */
  private getCacheKey(url: string, config: RequestConfig): string {
    const method = config.method || 'GET'
    const params = JSON.stringify(config.params || {})
    const data = JSON.stringify(config.data || {})
    return `${method}:${url}:${params}:${data}`
  }

  /**
   * 获取缓存
   */
  private getCache(key: string): unknown | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.expiresIn) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, data: unknown, expiresIn: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    })
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 取消指定请求
   */
  cancelRequest(url: string): void {
    const controller = this.pendingRequests.get(url)
    if (controller) {
      controller.abort()
      this.pendingRequests.delete(url)
    }
  }

  /**
   * 取消所有请求
   */
  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => controller.abort())
    this.pendingRequests.clear()
  }

  /**
   * 默认状态码验证
   */
  private defaultValidateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }

  /**
   * 处理 HTTP 错误
   */
  private handleHttpError(response: Response): never {
    const status = response.status
    let message = `HTTP ${status} 错误`

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        message = '请求参数错误'
        break
      case HttpStatus.UNAUTHORIZED:
        message = '未授权，请重新登录'
        break
      case HttpStatus.FORBIDDEN:
        message = '没有权限访问'
        break
      case HttpStatus.NOT_FOUND:
        message = '请求的资源不存在'
        break
      case HttpStatus.REQUEST_TIMEOUT:
        message = '请求超时'
        break
      case HttpStatus.INTERNAL_SERVER_ERROR:
        message = '服务器内部错误'
        break
      case HttpStatus.BAD_GATEWAY:
        message = '网关错误'
        break
      case HttpStatus.SERVICE_UNAVAILABLE:
        message = '服务暂时不可用'
        break
      case HttpStatus.GATEWAY_TIMEOUT:
        message = '网关超时'
        break
    }

    throw new RequestError(message, ErrorType.HTTP_ERROR, status, response)
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 带重试的请求
   */
  private async requestWithRetry<T>(
    url: string,
    config: RequestConfig,
    retryCount = 0
  ): Promise<T> {
    const maxRetries = config.retry || 0
    const retryDelay = config.retryDelay || 1000

    try {
      return await this.executeRequest<T>(url, config)
    } catch (error) {
      // 判断是否需要重试
      const shouldRetry =
        retryCount < maxRetries &&
        error instanceof RequestError &&
        (error.type === ErrorType.NETWORK_ERROR ||
          error.type === ErrorType.TIMEOUT_ERROR ||
          (error.status && error.status >= 500))

      if (shouldRetry) {
        console.warn(
          `请求失败，${retryDelay}ms 后进行第 ${retryCount + 1} 次重试...`
        )
        await this.delay(retryDelay)
        return this.requestWithRetry<T>(url, config, retryCount + 1)
      }

      throw error
    }
  }

  /**
   * 执行实际请求
   */
  private async executeRequest<T>(
    url: string,
    config: RequestConfig
  ): Promise<T> {
    // 合并配置
    let requestConfig: RequestConfig = {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      }
    }

    // 执行请求拦截器
    if (this.interceptors.request) {
      try {
        requestConfig = await this.interceptors.request(requestConfig)
      } catch (error) {
        const reqError =
          error instanceof RequestError
            ? error
            : new RequestError('请求拦截器错误', ErrorType.UNKNOWN_ERROR)
        this.interceptors.requestError?.(reqError)
        throw reqError
      }
    }

    // 构建完整 URL
    const fullURL = this.buildURL(url, requestConfig.params)

    // 检查缓存
    if (requestConfig.enableCache && requestConfig.method === 'GET') {
      const cacheKey = this.getCacheKey(fullURL, requestConfig)
      const cachedData = this.getCache(cacheKey)
      if (cachedData) {
        console.log('从缓存返回:', fullURL)
        return cachedData as T
      }
    }

    // 创建 AbortController
    const controller = new AbortController()
    this.pendingRequests.set(fullURL, controller)

    // 处理请求体
    const fetchConfig: RequestInit = {
      ...requestConfig,
      headers: requestConfig.headers,
      signal: controller.signal
    }

    if (requestConfig.data && requestConfig.method !== 'GET') {
      if (requestConfig.headers?.['Content-Type'] === 'application/json') {
        fetchConfig.body = JSON.stringify(requestConfig.data)
      } else if (requestConfig.data instanceof FormData) {
        fetchConfig.body = requestConfig.data
        // FormData 会自动设置 Content-Type
        delete fetchConfig.headers
      } else {
        fetchConfig.body = requestConfig.data as BodyInit
      }
    }

    // 添加超时控制
    const timeout = requestConfig.timeout || this.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      // 发送请求
      let response = await fetch(fullURL, fetchConfig)

      clearTimeout(timeoutId)
      this.pendingRequests.delete(fullURL)

      // 执行响应拦截器
      if (this.interceptors.response) {
        response = await this.interceptors.response(response)
      }

      // 验证状态码
      const validateStatus =
        requestConfig.validateStatus || this.defaultValidateStatus
      if (!validateStatus(response.status)) {
        this.handleHttpError(response)
      }

      // 解析响应
      const contentType = response.headers.get('content-type')
      let data: T

      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as T
      } else if (contentType?.includes('application/octet-stream')) {
        data = (await response.blob()) as T
      } else {
        // 默认尝试 JSON 解析
        try {
          data = (await response.json()) as T
        } catch {
          data = (await response.text()) as T
        }
      }

      // 设置缓存
      if (requestConfig.enableCache && requestConfig.method === 'GET') {
        const cacheKey = this.getCacheKey(fullURL, requestConfig)
        const cacheTime = requestConfig.cacheTime || 5 * 60 * 1000 // 默认 5 分钟
        this.setCache(cacheKey, data, cacheTime)
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      this.pendingRequests.delete(fullURL)

      // 处理错误
      let requestError: RequestError

      if (error instanceof RequestError) {
        requestError = error
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          requestError = new RequestError(
            '请求已取消或超时',
            ErrorType.TIMEOUT_ERROR
          )
        } else if (error.message.includes('fetch')) {
          requestError = new RequestError(
            '网络连接失败',
            ErrorType.NETWORK_ERROR
          )
        } else {
          requestError = new RequestError(
            error.message,
            ErrorType.UNKNOWN_ERROR
          )
        }
      } else {
        requestError = new RequestError('未知错误', ErrorType.UNKNOWN_ERROR)
      }

      // 执行错误拦截器
      this.interceptors.responseError?.(requestError)

      throw requestError
    }
  }

  /**
   * 核心请求方法
   */
  private async request<T = unknown>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.requestWithRetry<T>(url, config)
  }

  /**
   * GET 请求
   */
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  /**
   * POST 请求
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'POST', data })
  }

  /**
   * PUT 请求
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PUT', data })
  }

  /**
   * DELETE 请求
   */
  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }

  /**
   * PATCH 请求
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PATCH', data })
  }

  /**
   * 流式请求（返回原始 Response，适用于 SSE 等场景）
   */
  async stream(url: string, config: RequestConfig = {}): Promise<Response> {
    // 合并配置
    let requestConfig: RequestConfig = {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      }
    }

    // 执行请求拦截器
    if (this.interceptors.request) {
      try {
        requestConfig = await this.interceptors.request(requestConfig)
      } catch (error) {
        const reqError =
          error instanceof RequestError
            ? error
            : new RequestError('请求拦截器错误', ErrorType.UNKNOWN_ERROR)
        this.interceptors.requestError?.(reqError)
        throw reqError
      }
    }

    // 构建完整 URL
    const fullURL = this.buildURL(url, requestConfig.params)

    // 创建 AbortController
    const controller = new AbortController()
    this.pendingRequests.set(fullURL, controller)

    // 处理请求体
    const fetchConfig: RequestInit = {
      ...requestConfig,
      headers: requestConfig.headers,
      signal: controller.signal
    }

    if (requestConfig.data && requestConfig.method !== 'GET') {
      if (requestConfig.headers?.['Content-Type'] === 'application/json') {
        fetchConfig.body = JSON.stringify(requestConfig.data)
      } else if (requestConfig.data instanceof FormData) {
        fetchConfig.body = requestConfig.data
        delete fetchConfig.headers
      } else {
        fetchConfig.body = requestConfig.data as BodyInit
      }
    }

    // 超时控制
    const timeout = requestConfig.timeout || this.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      let response = await fetch(fullURL, fetchConfig)

      clearTimeout(timeoutId)
      this.pendingRequests.delete(fullURL)

      // 执行响应拦截器
      if (this.interceptors.response) {
        response = await this.interceptors.response(response)
      }

      // 验证状态码
      const validateStatus =
        requestConfig.validateStatus || this.defaultValidateStatus
      if (!validateStatus(response.status)) {
        this.handleHttpError(response)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      this.pendingRequests.delete(fullURL)

      let requestError: RequestError

      if (error instanceof RequestError) {
        requestError = error
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          requestError = new RequestError(
            '请求已取消或超时',
            ErrorType.TIMEOUT_ERROR
          )
        } else if (error.message.includes('fetch')) {
          requestError = new RequestError(
            '网络连接失败',
            ErrorType.NETWORK_ERROR
          )
        } else {
          requestError = new RequestError(
            error.message,
            ErrorType.UNKNOWN_ERROR
          )
        }
      } else {
        requestError = new RequestError('未知错误', ErrorType.UNKNOWN_ERROR)
      }

      this.interceptors.responseError?.(requestError)
      throw requestError
    }
  }

  /**
   * HEAD 请求
   */
  async head(url: string, config?: RequestConfig): Promise<Response> {
    return fetch(this.buildURL(url, config?.params), {
      ...config,
      method: 'HEAD'
    })
  }

  /**
   * OPTIONS 请求
   */
  async options(url: string, config?: RequestConfig): Promise<Response> {
    return fetch(this.buildURL(url, config?.params), {
      ...config,
      method: 'OPTIONS'
    })
  }
}

/**
 * 创建默认请求实例
 * 配置从环境变量读取，支持多环境适配
 */
const request = new Request({
  baseURL: envConfig.apiBaseURL,
  timeout: envConfig.apiTimeout
})

// 开发环境下打印请求日志
if (envConfig.enableRequestLog) {
  console.log(
    `[Request] 初始化完成 - BaseURL: ${envConfig.apiBaseURL}, Timeout: ${envConfig.apiTimeout}ms`
  )
}

/**
 * 请求拦截器：添加 token 和日志
 */
request.setRequestInterceptor((config) => {
  // 添加认证 token
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  // 开发环境请求日志
  if (envConfig.enableRequestLog) {
    console.log(
      `[Request] ${config.method || 'GET'} ${config.baseURL || ''}`,
      config.params || config.data || ''
    )
  }

  return config
})

/**
 * 响应拦截器：统一处理和日志
 */
request.setResponseInterceptor((response) => {
  // 开发环境响应日志
  if (envConfig.enableRequestLog) {
    console.log(`[Response] ${response.status} ${response.url}`)
  }

  // 可以在这里做全局响应处理
  // 例如：刷新 token、记录日志等
  return response
})

/**
 * 错误拦截器：全局错误处理
 */
request.setResponseErrorInterceptor((error) => {
  console.error(`[请求错误] ${error.type}:`, error.message)

  // 根据错误类型做不同处理
  switch (error.status) {
    case HttpStatus.UNAUTHORIZED:
      // 未授权，跳转登录
      console.warn('用户未授权，请重新登录')
      // window.location.href = '/login'
      break
    case HttpStatus.FORBIDDEN:
      // 无权限
      console.warn('没有权限访问该资源')
      break
  }

  switch (error.type) {
    case ErrorType.TIMEOUT_ERROR:
      // 超时
      console.warn('请求超时，请检查网络连接')
      break
    case ErrorType.NETWORK_ERROR:
      // 网络错误
      console.warn('网络连接失败，请检查网络')
      break
  }
})

/**
 * 类型化的 API 请求方法
 */
export const apiRequest = {
  /**
   * GET 请求
   */
  get: <T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>
  ) => request.get<ApiResponse<T>>(url, { params }),

  /**
   * POST 请求
   */
  post: <T = unknown>(url: string, data?: unknown) => {
    return request.post<ApiResponse<T>>(url, data)
  },

  /**
   * PUT 请求
   */
  put: <T = unknown>(url: string, data?: unknown) =>
    request.put<ApiResponse<T>>(url, data),

  /**
   * DELETE 请求
   */
  delete: <T = unknown>(url: string) => request.delete<ApiResponse<T>>(url),

  /**
   * PATCH 请求
   */
  patch: <T = unknown>(url: string, data?: unknown) =>
    request.patch<ApiResponse<T>>(url, data)
}

export default request
