require('dotenv').config()
const { streamText, generateText } = require('ai')
const { createOpenAICompatible } = require('@ai-sdk/openai-compatible')

const customProvider = createOpenAICompatible({
  name: 'custom-provider',
  baseURL: 'https://kapi.jrj.com/v1',
  apiKey: 'sk-Osuvq0KqdSyNd0o8AQML62eClU9d0gPyi7pnSXuCihH19sDJ'
})

const llama3 = customProvider('gpt-5.1')

async function callAiAPI(prompt) {
  try {
    const result = await generateText({
      model: llama3,
      prompt
    })
    return result.text
  } catch (error) {
    console.error('AI API调用失败:', error.message)
    return 'API调用失败，请检查密钥'
  }
}
module.exports = { callAiAPI }
