import request, { apiRequest } from '@/utils/request'
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
  const response = await request.stream('/ai/generate', {
    method: 'POST',
    data
  })
  return response
}

/**
 * 基于函数调用生成选题
 */
export async function functionCallTopic(
  data: FunctionCallRequest
): Promise<ApiResponse<string>> {
  const res = await apiRequest.post<string>('/ai/function/call', data)
  return res
}

/**
 * 生成结构化选题
 */
export async function structuredTopic(
  data: StructuredTopicRequest
): Promise<ApiResponse> {
  // 使用后端已实现的结构化选题生成接口
  const res = await apiRequest.post('/topic/generate', data)
  return res
}

/**
 * 测试接口
 */
export async function testApi(): Promise<ApiResponse> {
  const res = await apiRequest.get('/test')
  return res
}

/**
 * 合规检查
 */
export async function checkTopicCompliance(
  topic: string
): Promise<ApiResponse<string>> {
  const res = await apiRequest.post<string>('/topic/check', { topic })
  return res
}
