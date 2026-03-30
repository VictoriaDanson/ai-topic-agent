require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const { streamText } = require('ai')
const { createOpenAICompatible } = require('@ai-sdk/openai-compatible')
const promptTemplates = require('../utils/promptTemplates')
const { tools, toolDescriptions } = require('../utils/tools')
const { callAiAPI } = require('../utils/aiClient')

// const customProvider = createOpenAICompatible({
//   name: 'custom-provider',
//   baseURL: 'https://kapi.jrj.com/v1',
//   apiKey: 'sk-Osuvq0KqdSyNd0o8AQML62eClU9d0gPyi7pnSXuCihH19sDJ'
// })

// const llama3 = customProvider('gpt-5.1')

// 中间件
app.use(cors())
app.use(express.json())

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')))

// // AI 生成接口 - 流式输出
// app.post('/api/ai/generate', async (req, res) => {
//   const { prompt } = req.body
//   if (!prompt) {
//     return res.json({ code: 400, message: '请输入Prompt' })
//   }
//   try {
//     // 设置 SSE 响应头，指定 UTF-8 编码
//     res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
//     res.setHeader('Cache-Control', 'no-cache')
//     res.setHeader('Connection', 'keep-alive')
//     res.setHeader('Transfer-Encoding', 'chunked')

//     // const prompt = promptTemplates.basicTopic(6, '综合金融'); // 使用Prompt模板
//     const result = await streamText({
//       model: llama3,
//       prompt
//     })

//     // 流式输出回复内容
//     for await (const chunk of result.textStream) {
//       // 发送到客户端
//       res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`, 'utf8')
//       // 同时在控制台打印
//       process.stdout.write(chunk)
//     }

//     console.log('\n模型回复完成')
//     res.write('data: [DONE]\n\n', 'utf8')
//     res.end()
//   } catch (error) {
//     console.error('调用失败：', error)

//     // 如果响应头还没发送，返回错误响应
//     if (!res.headersSent) {
//       res.status(500).json({
//         code: 500,
//         message: '模型调用失败',
//         error: error.message
//       })
//     } else {
//       res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`, 'utf8')
//       res.end()
//     }
//   }
// })
// /**
//  * 让 AI 调用自定义工具
//  */
// app.post('/api/ai/function/call', async (req, res) => {
//   try {
//     // 1. 先让AI决定调用哪个工具
//     const prompt = `
//       你需要根据用户需求决定是否调用工具，仅返回JSON格式：
//       {
//         "need_call": true/false,
//         "tool_name": "工具名称"
//       }
//       工具列表：${JSON.stringify(toolDescriptions)}
//       用户需求：${req.body.prompt}
//     `

//     // 2. 调用AI获取工具调用决策
//     const aiResponse = await callAiAPI(prompt)
//     const decision = JSON.parse(aiResponse)

//     if (decision.need_call && tools[decision.tool_name]) {
//       // 3. 调用工具
//       const toolResult = tools[decision.tool_name]()

//       // 4. 基于工具结果生成选题
//       const finalPrompt = `
//         基于以下工具返回的信息，生成3个合规的金融资讯选题：
//         工具返回：${JSON.stringify(toolResult)}
//         要求：客观、专业、有时效性，不预测涨跌、不荐股
//       `

//       const finalResult = await callAiAPI(finalPrompt)
//       res.json({ code: 200, data: finalResult })
//     } else {
//       // 不需要调用工具，直接生成
//       const result = await callAiAPI(req.body.prompt)
//       res.json({ code: 200, data: result })
//     }
//   } catch (error) {
//     res.json({ code: 500, message: error.message })
//   }
// })

// /**
//  * 结构化选题生成接口
//  */
// app.post('/api/ai/topic/structured', async (req, res) => {
//   const { count = 3, type = '综合金融' } = req.body
//   try {
//     const prompt = promptTemplates.structuredTopic(count, type)
//     const result = await callAiAPI(prompt)
//     // 解析JSON
//     const topics = JSON.parse(result)
//     res.json({ code: 200, data: topics })
//   } catch (error) {
//     console.error('结构化选题生成失败:', error)
//     res.json({ code: 500, message: '生成/解析失败：' + error.message })
//   }
// })

// 启动服务
const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
  console.log(`后端服务运行在: http://localhost:${PORT}`)
})
