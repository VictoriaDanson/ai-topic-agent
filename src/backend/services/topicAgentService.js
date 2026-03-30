// 完整选题Agent服务
const FinanceAPIs = require('../../utils/financeApis');
const { callAiAPI } = require('../../utils/aiClient');
const promptTemplates = require('../../utils/promptTemplates');
const TopicEvaluator = require('../../utils/topicEvaluator');

class TopicAgentService {
  async run(params) {
    const { count = 5, type = '综合金融' } = params;
    
    try {
      // 1. 获取多源热点数据
      console.log('Step 1: 获取热点数据');
      const hotData = await FinanceAPIs.getAllHotTopics();
      
      // 2. 生成初始选题（数量翻倍，用于筛选）
      console.log('Step 2: 生成初始选题');
      const prompt = promptTemplates.structuredTopic(count * 2, type, hotData);
      const rawResult = await callAiAPI(prompt);
      const rawTopics = JSON.parse(rawResult);
      
      // 3. 评估和筛选
      console.log('Step 3: 评估和筛选选题');
      const evaluatedTopics = await TopicEvaluator.evaluateAndFilter(rawTopics, 7);
      
      // 4. 截取指定数量
      const finalTopics = evaluatedTopics.slice(0, count);
      
      console.log('选题Agent执行完成，生成', finalTopics.length, '个选题');
      return finalTopics;
    } catch (error) {
      console.error('选题Agent执行失败:', error);
      throw new Error('选题生成失败：' + error.message);
    }
  }
}

module.exports = new TopicAgentService();