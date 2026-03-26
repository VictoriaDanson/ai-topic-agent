// src/frontend/main.js
import { marked } from 'marked'

const app = document.getElementById('app')

// 构建界面
app.innerHTML = `
  <div style="max-width: 900px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333;">AI金融选题生成器</h2>
    <textarea id="promptInput" rows="4" style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" placeholder="输入选题需求，例如：生成3个A股行情相关选题"></textarea>
    <br>
    <button id="generateBtn" style="padding: 10px 30px; margin: 10px 0; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">生成选题</button>
    <div id="result" style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 200px; background: #fff; font-size: 14px; line-height: 1.8;"></div>
    <button id="funcCallBtn" style="padding: 10px 30px; margin: 10px 0; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">基于实时热点生成选题</button>
    <div id="resultFun" style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 200px; background: #fff; font-size: 14px; line-height: 1.8;"></div>
  </div>
`

// 绑定事件
const generateBtn = document.getElementById('generateBtn')
const promptInput = document.getElementById('promptInput')
const result = document.getElementById('result')
const funcCallBtn = document.getElementById('funcCallBtn')
const resultFun = document.getElementById('resultFun')

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim()
  if (!prompt) {
    alert('请输入选题需求')
    return
  }

  // 清空结果区域并显示提示
  result.innerHTML = '<div style="color: #666;">正在生成中...</div>'

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 清空"生成中"提示
    result.innerHTML = ''

    // 创建文本容器
    const textContainer = document.createElement('div')
    textContainer.className = 'markdown-body'
    result.appendChild(textContainer)

    // 读取流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let markdownText = '' // 累积完整的 Markdown 文本

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
      buffer = lines.pop() // 保留最后一个不完整的行

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6) // 移除 "data: " 前缀

          if (data === '[DONE]') {
            console.log('接收完成')
            continue
          }

          try {
            const json = JSON.parse(data)
            if (json.text) {
              // 累积 Markdown 文本
              markdownText += json.text

              // 实时转换并显示 HTML
              textContainer.innerHTML = marked.parse(markdownText)
            } else if (json.error) {
              result.innerHTML = `<div style="color: red;">错误：${json.error}</div>`
            }
          } catch (e) {
            console.warn('解析JSON失败:', data, e)
          }
        }
      }
    }
  } catch (error) {
    result.innerHTML = `<div style="color: red;">网络错误：${error.message}</div>`
    console.error('请求失败:', error)
  }
})

funcCallBtn.addEventListener('click', async () => {
  resultFun.textContent = '获取热点并生成选题中...'

  try {
    const response = await fetch('/api/ai/function/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '基于今日财经热点生成3个选题' })
    })

    const data = await response.json()
    if (data.code === 200) {
      resultFun.innerHTML = marked.parse(data.data)
    } else {
      resultFun.textContent = '生成失败：' + data.message
    }
  } catch (error) {
    resultFun.textContent = '网络错误：' + error.message
  }
})
