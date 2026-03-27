import apiClient from './index'
import type {
  TopicGenerateRequest,
  FunctionCallRequest,
  StructuredTopicRequest,
  ApiResponse
} from '@/types'

/**
 * 流式生成选题
 */
export async function generateTopicStream(
  data: TopicGenerateRequest
): Promise<Response> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}

/**
 * 基于函数调用生成选题
 */
export async function functionCallTopic(
  data: FunctionCallRequest
): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>(
    '/ai/function/call',
    data
  )
  return response.data
}

/**
 * 生成结构化选题
 */
export async function structuredTopic(
  data: StructuredTopicRequest
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/ai/topic/structured',
    data
  )
  return response.data
}

/**
 * 测试接口
 */
export async function testApi(): Promise<ApiResponse> {
  const response = await apiClient.get<ApiResponse>('/test')
  return response.data
}
