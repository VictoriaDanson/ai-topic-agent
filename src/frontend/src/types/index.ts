/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
  code: number
  message?: string
  data?: T
  error?: string
}

/**
 * 流式响应数据块
 */
export interface StreamChunk {
  text?: string
  error?: string
}

/**
 * 选题生成请求参数
 */
export interface TopicGenerateRequest {
  prompt: string
}

/**
 * 函数调用选题请求参数
 */
export interface FunctionCallRequest {
  prompt: string
}

/**
 * 结构化选题请求参数
 */
export interface StructuredTopicRequest {
  count?: number
  type?: string
}

/**
 * 选题结果
 */
export interface TopicResult {
  title: string
  description: string
  category?: string
  keywords?: string[]
}
