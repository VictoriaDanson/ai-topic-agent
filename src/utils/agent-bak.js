const { callAiAPI } = require('./aiClient');

// 选题Agent：任务拆解→执行→整合
class TopicAgent {
  constructor() {
    this.steps = [
      '分析用户需求，确定选题方向和数量',
      '获取相关财经热点数据',
      '生成初步选题列表',
      '合规性检查和筛选',
      '优化标题和核心看点'
    ];
  }

  // 执行Agent
  async run(prompt) {
    console.log('选题Agent开始执行...');
    let context = `用户需求：${prompt}`;
    
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      console.log(`执行步骤 ${i+1}: ${step}`);
      
      // 调用AI执行当前步骤
      const stepPrompt = `
        当前执行步骤：${step}
        上下文：${context}
        请执行该步骤，输出执行结果（简洁明了）
        如果你需要调用工具，请说明需要调用的工具名称和原因
      `;
      
      const stepResult = await callAiAPI(stepPrompt);
      context += `\n步骤${i+1}结果：${stepResult}`;
    }
    
    // 生成最终结果
    const finalPrompt = `
      基于以下执行过程，生成结构化的金融选题列表（JSON格式）：
      ${context}
      格式要求：[{"title":"","type":"","publish_time":"","key_point":"","compliance":""}]
      数量：3个，合规、专业、有热点相关性
    `;
    
    const finalResult = await callAiAPI(finalPrompt);
    return JSON.parse(finalResult);
  }
}

module.exports = TopicAgent;