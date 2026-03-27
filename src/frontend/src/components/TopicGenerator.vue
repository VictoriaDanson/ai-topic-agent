<template>
  <div class="topic-generator">
    <textarea
      v-model="prompt"
      rows="4"
      placeholder="输入选题需求，例如：生成3个A股行情相关选题"
      :disabled="isStreaming"
    />

    <button @click="handleGenerate" :disabled="isStreaming || !prompt.trim()">
      {{ isStreaming ? '生成中...' : '生成选题' }}
    </button>

    <div class="result-box">
      <!-- 加载状态 -->
      <div v-if="isStreaming && !content" class="loading">
        正在生成中
        <span class="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">错误：{{ error }}</div>

      <!-- 内容显示（流式输出） -->
      <div v-else-if="htmlContent" class="content-wrapper">
        <div class="markdown-body streaming-content" v-html="htmlContent" />

        <!-- 流式输出时显示光标 -->
        <span v-if="isStreaming" class="streaming-cursor">▋</span>
      </div>

      <!-- 占位提示 -->
      <div v-else class="placeholder">请输入选题需求后点击"生成选题"按钮</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { generateTopicStream } from '@/api/topic'
import { useStream } from '@/composables/useStream'
import { safeParseMarkdown } from '@/utils/markdown'

// 状态
const prompt: Ref<string> = ref('')
const { content, isStreaming, error, handleStream, reset } = useStream()

// 计算属性：直接将流式内容转为 HTML
const htmlContent = computed(() => {
  return content.value ? safeParseMarkdown(content.value) : ''
})

// 自动滚动到底部
watch([content, isStreaming], () => {
  if (content.value) {
    // 使用 nextTick 确保 DOM 更新后再滚动
    setTimeout(() => {
      const container = document.querySelector('.result-box')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 0)
  }
})

// 生成选题
const handleGenerate = async (): Promise<void> => {
  if (!prompt.value.trim()) {
    alert('请输入选题需求')
    return
  }

  reset()

  try {
    const response = await generateTopicStream({ prompt: prompt.value })
    await handleStream(response)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '网络错误'
    console.error('生成失败:', err)
  }
}
</script>

<style scoped>
.topic-generator {
  margin-bottom: 40px;
}

.placeholder {
  color: #999;
  text-align: center;
  padding: 40px;
}

/* 加载动画 */
.loading {
  color: #666;
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.loading-dots {
  display: inline-block;
}

.loading-dots span {
  animation: blink 1.4s infinite;
  animation-fill-mode: both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

/* 内容容器 */
.content-wrapper {
  position: relative;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 流式内容（平滑过渡） */
.streaming-content {
  transition: all 0.1s ease;
}

/* 流式光标（流式输出时显示） */
.streaming-cursor {
  display: inline-block;
  color: #1890ff;
  font-weight: bold;
  margin-left: 2px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* 结果框优化 */
.result-box {
  max-height: 600px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* 滚动条样式 */
.result-box::-webkit-scrollbar {
  width: 8px;
}

.result-box::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.result-box::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.result-box::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
