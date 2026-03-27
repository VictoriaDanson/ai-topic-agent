import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * 选题状态管理
 */
export const useTopicStore = defineStore('topic', () => {
  // 状态
  const currentPrompt: Ref<string> = ref('')
  const generatedContent: Ref<string> = ref('')
  const isGenerating: Ref<boolean> = ref(false)
  const lastError: Ref<string> = ref('')

  // Actions
  function setPrompt(prompt: string): void {
    currentPrompt.value = prompt
  }

  function setContent(content: string): void {
    generatedContent.value = content
  }

  function setGenerating(status: boolean): void {
    isGenerating.value = status
  }

  function setError(error: string): void {
    lastError.value = error
  }

  function reset(): void {
    currentPrompt.value = ''
    generatedContent.value = ''
    isGenerating.value = false
    lastError.value = ''
  }

  return {
    // State
    currentPrompt,
    generatedContent,
    isGenerating,
    lastError,
    // Actions
    setPrompt,
    setContent,
    setGenerating,
    setError,
    reset
  }
})
