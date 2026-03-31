<template>
  <div class="topic-evaluator">
    <div class="field-row">
      <label>数量：</label>
      <input
        type="number"
        v-model.number="count"
        min="1"
        max="10"
        class="count-input"
      />
    </div>
    <div class="field-row">
      <label>类型：</label>
      <select v-model="type">
        <option value="综合金融">综合金融</option>
        <option value="A股行情">A股行情</option>
        <option value="央行政策">央行政策</option>
        <option value="理财资讯">理财资讯</option>
        <option value="海外市场">海外市场</option>
      </select>
    </div>
    <button class="btn-agent" :disabled="isLoading" @click="handleAgentRun">
      {{ isLoading ? '正在生成...' : '一键生成高质量选题' }}
    </button>

    <div class="result-box markdown-body">
      <div v-if="isLoading" class="loading">
        智能 Agent 正在分析热点、生成并筛选选题...<br />
        请稍候（约30秒）
      </div>

      <div v-else-if="error" class="error">生成失败：{{ error }}</div>

      <div v-else-if="topics.length" class="topics-table-wrapper">
        <table class="topic-table">
          <thead>
            <tr>
              <th align="center">序号</th>
              <th>选题标题</th>
              <th align="center">类型</th>
              <th width="110">推荐发布时段</th>
              <th>核心看点</th>
              <th width="74">合规性</th>
              <th>分数</th>
              <!-- <th>改进建议：</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(topic, index) in topics" :key="index">
              <td align="center">{{ index + 1 }}</td>
              <td>{{ topic.title || '-' }}</td>
              <td align="center">{{ topic.type || '-' }}</td>
              <td align="center">{{ topic.publish_time || '-' }}</td>
              <td>{{ topic.key_point || '-' }}</td>
              <td align="center">{{ topic.compliance || '-' }}</td>
              <td style="word-break: break-all">
                {{ topic.quality_evaluation?.split('改进建议：')[0] || '-' }}
              </td>
              <!-- <td style="word-break: break-all; white-space: pre-wrap">
                {{ topic.quality_evaluation?.split('改进建议：')[1] || '-' }}
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="placeholder">
        点击上方按钮，让智能 Agent 自动完成热点分析和选题生成
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { agentTopicRun } from '@/api/topic'

interface TopicItem {
  title?: string
  type?: string
  publish_time?: string
  key_point?: string
  compliance?: string
  quality_evaluation: string
  [key: string]: unknown
}

const count = ref<number>(3)
const type = ref<string>('综合金融')
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string> = ref('')
const topics: Ref<TopicItem[]> = ref([])

const handleAgentRun = async (): Promise<void> => {
  isLoading.value = true
  error.value = ''
  topics.value = []

  try {
    // 通过统一的 request 封装调用后端 Agent 选题接口
    const res = await agentTopicRun({
      count: count.value,
      type: type.value
    })

    // 后端返回格式约定为 { code, message?, data? }
    if (res && res.code === 200 && Array.isArray(res.data)) {
      topics.value = res.data as TopicItem[]
    } else {
      const msg = (res && (res.message || res.error)) || '未知错误'
      throw new Error(msg)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    error.value = message
    console.error('智能 Agent 生成失败:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.field-row {
  margin: 10px 0;
}

.count-input {
  width: 60px;
}

.btn-agent {
  display: inline-block;
  padding: 10px 30px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 20px 0;
}

.btn-agent:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-box {
  margin-top: 10px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #555;
}

.error {
  color: red;
  padding: 20px;
}

.placeholder {
  color: #999;
  text-align: center;
  padding: 20px;
}

.topics-table-wrapper {
  overflow-x: auto;
}

.topic-table {
  width: 100%;
  border-collapse: collapse;
}

.topic-table th,
.topic-table td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  min-width: 60px;
}

.topic-table thead tr {
  background: #f0f0f0;
}

.count-input {
  width: 60px;
}
</style>
