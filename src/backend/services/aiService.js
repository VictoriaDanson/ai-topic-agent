// AI服务封装
const { callAiAPI } = require('../../utils/aiClient')
const promptTemplates = require('../../utils/promptTemplates')
const { tools } = require('../../utils/tools')
const FinanceAPIs = require('../../utils/financeApis')

class AIService {
  // 生成结构化选题
  async generateStructuredTopics(count, type) {
    // 1. 获取热点数据
    const hotData = await FinanceAPIs.getAllHotTopics()
    // 2. 生成选题
    const prompt = promptTemplates.structuredTopic(count, type, hotData)
    const result = await callAiAPI(prompt)
    // 3. 验证JSON格式
    try {
      return JSON.parse(result)
    } catch (e) {
      console.error('JSON解析失败，原始结果:', result)
      // 降级处理
      return [
        {
          title: '默认选题：' + type + '热点解读',
          type,
          publish_time: '午间',
          key_point: '结合最新市场动态解读' + type + '热点',
          compliance: '合规',
          compliance_note: '无违规内容',
          audience: '普通投资者',
          difficulty: '中'
        }
      ]
    }
  }

  // 基于热点生成选题
  async generateHotTopics() {
    // 1. 获取热点
    const hotTopics = await tools.getFinanceHotTopics()
    // 2. 生成选题
    const prompt = promptTemplates.structuredTopic(3, '热点相关')
    const result = await callAiAPI(
      prompt.replace('{hotTopics}', JSON.stringify(hotTopics))
    )
    return JSON.parse(result)
  }

  // 合规检查
  async checkCompliance(topic) {
    const prompt = promptTemplates.complianceCheck(topic)
    return await callAiAPI(prompt)
  }
}

module.exports = new AIService()
