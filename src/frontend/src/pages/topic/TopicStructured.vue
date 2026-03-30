<template>
  <div class="structured-topic">
    <h2>结构化选题生成</h2>

    <!-- 配置区 -->
    <div class="config-section">
      <div class="form-group">
        <label for="topic-count">生成数量：</label>
        <select id="topic-count" v-model.number="config.count">
          <option :value="1">1个</option>
          <option :value="3">3个</option>
          <option :value="5">5个</option>
          <option :value="10">10个</option>
        </select>
      </div>

      <div class="form-group">
        <label for="topic-type">选题类型：</label>
        <select id="topic-type" v-model="config.type">
          <option value="综合金融">综合金融</option>
          <option value="政策解读">政策解读</option>
          <option value="市场行情">市场行情</option>
          <option value="资金流向">资金流向</option>
          <option value="行业分析">行业分析</option>
          <option value="公司动态">公司动态</option>
        </select>
      </div>
    </div>

    <button @click="handleGenerate" :disabled="isLoading">
      {{ isLoading ? '生成中...' : '生成结构化选题' }}
    </button>

    <div class="result-box">
      <div v-if="isLoading" class="loading">正在生成结构化选题...</div>

      <div v-else-if="error" class="error">生成失败：{{ error }}</div>

      <div v-else-if="topics.length > 0" class="topics-list">
        <div v-for="(topic, index) in topics" :key="index" class="topic-card">
          <div class="topic-header">
            <span class="topic-number">{{ index + 1 }}</span>
            <h3 class="topic-title">{{ topic.title }}</h3>
          </div>
          <div class="topic-meta">
            <span class="topic-type">{{ topic.type }}</span>
            <span class="topic-time">{{ topic.publish_time }}</span>
          </div>
          <p class="topic-point">{{ topic.key_point }}</p>
          <div class="topic-compliance" :class="{ valid: topic.compliance.includes('合规') }">
            {{ topic.compliance }}
          </div>
        </div>
      </div>

      <div v-else class="placeholder">选择配置后点击"生成结构化选题"按钮</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { structuredTopic } from '@/api/topic'

interface TopicItem {
  title: string
  type: string
  publish_time: string
  key_point: string
  compliance: string
}

interface Config {
  count: number
  type: string
}

// 状态
const isLoading: Ref<boolean> = ref(false)
const topics: Ref<TopicItem[]> = ref([])
const error: Ref<string> = ref('')
const config: Ref<Config> = ref({
  count: 3,
  type: '综合金融'
})

// 生成选题
const handleGenerate = async (): Promise<void> => {
  isLoading.value = true
  error.value = ''
  topics.value = []

  try {
    const response = await structuredTopic(config.value)

    if (response.code === 200 && response.data) {
      topics.value = Array.isArray(response.data) ? response.data : [response.data]
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
.structured-topic {
  margin-bottom: 40px;
}

.config-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.form-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-group select:hover {
  border-color: #1890ff;
}

.form-group select:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.placeholder {
  color: #999;
  text-align: center;
  padding: 40px;
}

/* 选题列表 */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topic-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.topic-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.topic-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.topic-number {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.topic-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

.topic-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.topic-type {
  background: #e6f7ff;
  color: #1890ff;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.topic-time {
  background: #f5f5f5;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.topic-point {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
}

.topic-compliance {
  background: #fff2e8;
  color: #d46b08;
  padding: 0.5rem 0.875rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  display: inline-block;
}

.topic-compliance.valid {
  background: #f6ffed;
  color: #52c41a;
}

/* 响应式 */
@media (max-width: 768px) {
  .config-section {
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .topic-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
