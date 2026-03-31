<template>
  <div class="all-topic-page">
    <div class="panel-row">
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
          :disabled="!complianceInput.trim()"
          @click="handleComplianceCheck"
        >
          合规检查
        </button>
      </div>
    </div>
    <div class="panel-row markdown-body">
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
import { checkTopicCompliance } from '@/api/topic'

const complianceInput = ref<string>('')
const complianceResult = ref<string>('')
const complianceLoading = ref<boolean>(false)
const complianceLoadingText = ref<string>('')
const complianceError = ref<string>('')

const resetComplianceState = () => {
  complianceResult.value = ''
  complianceError.value = ''
  complianceLoadingText.value = ''
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
