<template>
  <div class="all-topic-page">
    <h1>AI金融资讯内容生成器 V2.0</h1>

    <!-- 功能区 -->
    <div class="panel-row">
      <div class="panel">
        <h3>基础选题生成</h3>
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
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="handleBasicGenerate"
        >
          生成选题
        </button>
        <button
          class="btn btn-success"
          :disabled="loading"
          @click="handleHotGenerate"
        >
          基于实时热点生成
        </button>
      </div>

      <div class="panel">
        <h3>合规检查</h3>
        <textarea
          v-model="complianceInput"
          rows="3"
          class="textarea"
          placeholder="输入需要检查的选题标题"
        />
        <button
          class="btn btn-warning"
          :disabled="loading || !complianceInput.trim()"
          @click="handleComplianceCheck"
        >
          合规检查
        </button>
      </div>
    </div>

    <!-- 结果区 -->
    <div class="panel-row markdown-body">
      <!-- 生成结果面板 -->
      <div class="panel panel-result">
        <h3>生成结果</h3>
        <div class="result-content">
          <!-- 加载状态（仅生成相关） -->
          <div v-if="loading" class="loading-text">
            {{ loadingText }}
          </div>

          <!-- 错误状态（仅生成相关） -->
          <div v-else-if="genError" class="error-text">
            {{ genError }}
          </div>

          <!-- 选题表格 -->
          <div v-else-if="genTopics.length">
            <table class="topic-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>选题标题</th>
                  <th>类型</th>
                  <th>推荐发布时段</th>
                  <th>核心看点</th>
                  <th>合规性</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in genTopics" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ topic.title || '-' }}</td>
                  <td>{{ topic.type || '-' }}</td>
                  <td>{{ topic.publish_time || '-' }}</td>
                  <td>{{ topic.key_point || '-' }}</td>
                  <td>{{ topic.compliance || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 占位提示 -->
          <div v-else class="placeholder-text">暂无数据，请先生成选题</div>
        </div>
      </div>

      <!-- 合规检查结果面板 -->
      <div class="panel panel-result">
        <h3>检查结果</h3>
        <div class="result-content">
          <!-- 加载状态（仅合规相关） -->
          <div v-if="complianceLoading" class="loading-text">
            {{ complianceLoadingText }}
          </div>

          <!-- 错误状态（仅合规相关） -->
          <div v-else-if="complianceError" class="error-text">
            {{ complianceError }}
          </div>

          <!-- 合规检查结果 -->
          <div v-else-if="complianceResult" class="compliance-box">
            <h4>合规检查结果：</h4>
            <p>{{ complianceResult }}</p>
          </div>

          <!-- 占位提示 -->
          <div v-else class="placeholder-text">暂无数据，请先进行合规检查</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { structuredTopic, checkTopicCompliance } from '@/api/topic'

interface TopicItem {
  title?: string
  type?: string
  publish_time?: string
  key_point?: string
  compliance?: string
  [key: string]: unknown
}

const count = ref<number>(3)
const type = ref<string>('综合金融')

// 生成结果相关状态
const genTopics = ref<TopicItem[]>([])
const loading = ref<boolean>(false)
const loadingText = ref<string>('')
const genError = ref<string>('')

// 合规检查相关状态（仍直接走 /topic/check 接口，如需也可封装到 api/topic.ts）
const complianceInput = ref<string>('')
const complianceResult = ref<string>('')
const complianceLoading = ref<boolean>(false)
const complianceLoadingText = ref<string>('')
const complianceError = ref<string>('')

const resetGenerationState = () => {
  genTopics.value = []
  genError.value = ''
  loadingText.value = ''
}

const resetComplianceState = () => {
  complianceResult.value = ''
  complianceError.value = ''
  complianceLoadingText.value = ''
}

const handleBasicGenerate = async () => {
  resetGenerationState()
  loading.value = true
  loadingText.value = '生成中...'

  try {
    const res = await structuredTopic({
      count: count.value,
      type: type.value
    })

    if (res.code === 200 && Array.isArray(res.data)) {
      genTopics.value = res.data
    } else {
      genError.value = `生成失败：${res.message || res.error || '未知错误'}`
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    genError.value = `网络错误：${message}`
  } finally {
    loading.value = false
    loadingText.value = ''
  }
}

const handleHotGenerate = async () => {
  resetGenerationState()
  loading.value = true
  loadingText.value = '获取实时热点并生成选题中...'

  try {
    const res = await structuredTopic({
      // 这里简单复用结构化接口，若有专门热点接口再替换
      count: count.value,
      type: '热点相关'
    })

    if (res.code === 200 && Array.isArray(res.data)) {
      genTopics.value = res.data
    } else {
      genError.value = `生成失败：${res.message || res.error || '未知错误'}`
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    genError.value = `网络错误：${message}`
  } finally {
    loading.value = false
    loadingText.value = ''
  }
}

const handleComplianceCheck = async () => {
  const topic = complianceInput.value.trim()
  if (!topic) {
    // 基本防御，按钮本身已经 disabled
    alert('请输入选题标题')
    return
  }

  resetComplianceState()
  complianceLoading.value = true
  complianceLoadingText.value = '合规检查中...'

  try {
    const res = await checkTopicCompliance(topic)

    if (res.code === 200) {
      complianceResult.value = (res.data as string) || ''
    } else {
      complianceError.value = `检查失败：${res.message || res.error || '未知错误'}`
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    complianceError.value = `网络错误：${message}`
  } finally {
    complianceLoading.value = false
    complianceLoadingText.value = ''
  }
}
</script>

<style scoped>
.all-topic-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.panel-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.panel {
  flex: 1;
  min-width: 300px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel-result {
  background: #fff;
}

.field-row {
  margin: 10px 0;
}

.count-input {
  width: 60px;
}

.textarea {
  width: 100%;
  margin: 10px 0;
}

.btn {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
}

.btn-success {
  background: #28a745;
}

.btn-warning {
  background: #ffc107;
  color: #000;
}

.result-content {
  margin-top: 10px;
}

.loading-text {
  text-align: center;
  padding: 20px;
  color: #555;
}

.error-text {
  color: red;
}

.compliance-box {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.topic-table {
  width: 100%;
  border-collapse: collapse;
}

.topic-table th,
.topic-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.topic-table thead tr {
  background: #f0f0f0;
}

.placeholder-text {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>
