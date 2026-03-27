/**
 * 打字机效果 Hook
 * 实现逐字显示的打字机动画效果
 */

import { ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * 打字机配置
 */
export interface TypewriterOptions {
  speed?: number // 每个字符显示的延迟（毫秒）
  minSpeed?: number // 最小速度
  maxSpeed?: number // 最大速度
  chunkSize?: number // 每次显示的字符数
  smoothScroll?: boolean // 是否平滑滚动到底部
}

/**
 * 打字机效果 Hook
 */
export function useTypewriter(
  sourceContent: Ref<string>,
  options: TypewriterOptions = {}
) {
  const {
    speed = 30, // 默认 30ms 一个字符
    minSpeed = 10,
    maxSpeed = 100,
    chunkSize = 1, // 默认一次显示 1 个字符
    smoothScroll = true
  } = options

  // 显示的内容（逐步增加）
  const displayContent: Ref<string> = ref('')

  // 是否正在打字
  const isTyping: Ref<boolean> = ref(false)

  // 当前位置
  let currentIndex = 0

  // 定时器 ID
  let timerId: NodeJS.Timeout | null = null

  /**
   * 清除定时器
   */
  const clearTimer = (): void => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = (): void => {
    if (!smoothScroll) return

    // 使用 requestAnimationFrame 确保 DOM 更新后再滚动
    requestAnimationFrame(() => {
      const container = document.querySelector('.result-box')
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    })
  }

  /**
   * 打字动画
   */
  const type = (): void => {
    const source = sourceContent.value

    // 已经显示完所有内容
    if (currentIndex >= source.length) {
      isTyping.value = false
      clearTimer()
      return
    }

    // 获取下一段要显示的文字
    const nextChunk = source.slice(currentIndex, currentIndex + chunkSize)
    displayContent.value += nextChunk
    currentIndex += chunkSize

    // 滚动到底部
    scrollToBottom()

    // 根据字符类型动态调整速度
    const lastChar = nextChunk[nextChunk.length - 1]
    let delay = speed

    // 标点符号停顿更长
    if (lastChar && /[。！？，、；：]/.test(lastChar)) {
      delay = Math.min(speed * 3, maxSpeed)
    }
    // 英文标点
    else if (lastChar && /[.!?,;:]/.test(lastChar)) {
      delay = Math.min(speed * 2, maxSpeed)
    }
    // 换行符停顿
    else if (lastChar === '\n') {
      delay = Math.min(speed * 2, maxSpeed)
    }
    // 普通字符
    else {
      delay = Math.max(speed, minSpeed)
    }

    // 继续打字
    timerId = setTimeout(type, delay)
  }

  /**
   * 开始打字效果
   */
  const start = (): void => {
    if (isTyping.value) return

    isTyping.value = true
    currentIndex = 0
    displayContent.value = ''
    type()
  }

  /**
   * 停止打字效果
   */
  const stop = (): void => {
    clearTimer()
    isTyping.value = false
    // 立即显示所有内容
    displayContent.value = sourceContent.value
    currentIndex = sourceContent.value.length
  }

  /**
   * 重置
   */
  const reset = (): void => {
    clearTimer()
    isTyping.value = false
    displayContent.value = ''
    currentIndex = 0
  }

  /**
   * 跳过动画（立即显示所有内容）
   */
  const skip = (): void => {
    stop()
  }

  /**
   * 监听源内容变化，自动开始打字
   */
  watch(
    sourceContent,
    (newValue) => {
      if (newValue && newValue.length > 0) {
        // 如果内容增加，继续打字
        if (newValue.length > displayContent.value.length) {
          if (!isTyping.value) {
            start()
          }
        }
      } else {
        // 内容清空，重置
        reset()
      }
    },
    { immediate: true }
  )

  return {
    displayContent, // 显示的内容
    isTyping, // 是否正在打字
    start, // 开始打字
    stop, // 停止打字
    reset, // 重置
    skip // 跳过动画
  }
}

/**
 * 简化版：自动打字机效果
 * 适用于流式响应场景
 */
export function useAutoTypewriter(
  sourceContent: Ref<string>,
  options: TypewriterOptions = {}
) {
  const typewriter = useTypewriter(sourceContent, options)

  // 自动开始（当源内容有变化时）
  watch(
    sourceContent,
    (newValue) => {
      if (newValue && !typewriter.isTyping.value) {
        typewriter.start()
      }
    },
    { immediate: true }
  )

  return typewriter
}
