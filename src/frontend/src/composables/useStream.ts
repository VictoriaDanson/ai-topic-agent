import { ref } from 'vue'
import type { Ref } from 'vue'
import type { StreamChunk } from '@/types'

/**
 * SSE 流式响应处理 Hook
 */
export function useStream() {
  const content: Ref<string> = ref('')
  const isStreaming: Ref<boolean> = ref(false)
  const error: Ref<string> = ref('')

  /**
   * 处理流式响应
   */
  const handleStream = async (
    response: Response,
    onChunk?: (chunk: string) => void
  ): Promise<void> => {
    isStreaming.value = true
    error.value = ''
    content.value = ''

    try {
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应流')
      }

      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('流式传输完成')
          break
        }

        // 解码数据块
        buffer += decoder.decode(value, { stream: true })

        // 处理 SSE 格式的数据
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? '' // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6) // 移除 "data: " 前缀

            if (data === '[DONE]') {
              console.log('接收完成')
              continue
            }

            try {
              const json: StreamChunk = JSON.parse(data)
              if (json.text) {
                content.value += json.text
                onChunk?.(json.text)
              } else if (json.error) {
                error.value = json.error
              }
            } catch (e) {
              console.warn('解析JSON失败:', data, e)
            }
          }
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      console.error('流式处理错误:', err)
    } finally {
      isStreaming.value = false
    }
  }

  /**
   * 重置状态
   */
  const reset = (): void => {
    content.value = ''
    error.value = ''
    isStreaming.value = false
  }

  return {
    content,
    isStreaming,
    error,
    handleStream,
    reset
  }
}
