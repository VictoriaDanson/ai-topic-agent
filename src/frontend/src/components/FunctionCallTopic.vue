<template>
  <div class="function-call-topic">
    <button @click="handleGenerate" :disabled="isLoading">
      {{ isLoading ? '获取热点中...' : '基于实时热点生成选题' }}
    </button>

    <div class="result-box">
      <div v-if="isLoading" class="loading">获取热点并生成选题中...</div>

      <div v-else-if="error" class="error">生成失败：{{ error }}</div>

      <div v-else-if="htmlContent" class="markdown-body" v-html="htmlContent" />

      <div v-else class="placeholder">点击按钮基于实时热点生成选题</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { functionCallTopic } from '@/api/topic'
import { safeParseMarkdown } from '@/utils/markdown'

// 状态
const isLoading: Ref<boolean> = ref(false)
const content: Ref<string> = ref('')
const error: Ref<string> = ref('')

// 计算属性
const htmlContent = computed(() => {
  return content.value ? safeParseMarkdown(content.value) : ''
})

// 生成选题
const handleGenerate = async (): Promise<void> => {
  isLoading.value = true
  error.value = ''
  content.value = ''

  try {
    const response = await functionCallTopic({
      prompt: '基于今日财经热点生成3个选题'
    })

    if (response.code === 200 && response.data) {
      content.value = response.data
    } else {
      error.value = response.message || '生成失败'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '网络错误'
    console.error('生成失败:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.function-call-topic {
  margin-top: 40px;
}

.placeholder {
  color: #999;
  text-align: center;
  padding: 40px;
}
</style>
