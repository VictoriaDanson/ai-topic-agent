
const { callAiAPI } = require('../utils/aiClient')
// 选题评估工具
class TopicEvaluator {
  // 相似度计算（简单版）
  static calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(''));
    const set2 = new Set(str2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
  }

  // 去重
  static deduplicateTopics(topics, threshold = 0.8) {
    const uniqueTopics = [];
    
    for (const topic of topics) {
      const isDuplicate = uniqueTopics.some(
        t => this.calculateSimilarity(t.title, topic.title) > threshold
      );
      
      if (!isDuplicate) {
        uniqueTopics.push(topic);
      }
    }
    
    return uniqueTopics;
  }

  // 打分评估
  static async evaluateTopicQuality(topic) {
    const prompt = `
      对以下金融选题进行质量打分（1-10分），并给出改进建议：
      选题：${JSON.stringify(topic)}
      
      评分维度：
      1. 时效性（1-3分）：是否结合最新热点
      2. 吸引力（1-3分）：标题是否吸引目标受众
      3. 实用性（1-2分）：是否有实际价值
      4. 合规性（1-2分）：是否符合金融内容规范
      
      输出格式：
      总分：X分
      各维度得分：时效性X分，吸引力X分，实用性X分，合规性X分
      改进建议：XXX
    `;
    
    const result = await callAiAPI(prompt);
    return result;
  }

  // 批量评估和筛选
  static async evaluateAndFilter(topics, minScore = 6) {
    // 1. 去重
    const uniqueTopics = this.deduplicateTopics(topics);
    
    // 2. 批量评估
    const evaluatedTopics = [];
    for (const topic of uniqueTopics) {
      const evaluation = await this.evaluateTopicQuality(topic);
      // 提取总分
      const scoreMatch = evaluation.match(/总分：(\d+)分/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      
      evaluatedTopics.push({
        ...topic,
        quality_score: score,
        quality_evaluation: evaluation
      });
    }
    
    // 3. 筛选高分选题
    return evaluatedTopics.filter(t => t.quality_score >= minScore);
  }
}

module.exports = TopicEvaluator;