<template>
  <div class="agent-topic-warp">
    <textarea
      v-model="prompt"
      rows="4"
      placeholder="输入选题需求，例如：生成3个金融资讯相关选题"
    />
    <button @click="handleClick()" style="margin-left: 10px; padding: 8px 20px">
      智能Agent生成选题
    </button>
    <div id="result" class="markdown-body"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
const prompt: Ref<string> = ref('')

const handleClick = async () => {
  let result: any = document.getElementById('result')!
  const prompt = '3个金融资讯相关选题'
  result.textContent = '智能Agent正在分析并生成选题...'
  try {
    const response = await fetch('http://localhost:3100/api/ai/agent/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })

    const data: any = await response.json()
    if (data.code === 200) {
      // 结构化展示
      let html =
        '<table border="1" cellpadding="8" cellspacing="0" style="width: 100%; margin-top: 10px;">'
      html += `<tr><th>标题</th><th>类型</th><th>发布时段</th><th>核心看点</th><th>合规性</th></tr>`
      data.data.forEach((topic: any) => {
        html += `<tr>
          <td>${topic.title}</td>
          <td>${topic.type}</td>
          <td>${topic.publish_time}</td>
          <td>${topic.key_point}</td>
          <td>${topic.compliance}</td>
        </tr>`
      })
      html += '</table>'
      result.innerHTML = html
    } else {
      result.textContent = '生成失败：' + data.message
    }
  } catch (error: any) {
    result.textContent = '网络错误：' + error.message
  }
}
</script>
