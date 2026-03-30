const { callAiAPI } = require('./aiClient');

// 完善Agent类，实现完整工作流
class TopicAgent {
  constructor() {
    this.workflow = [
      {
        name: '需求分析',
        execute: async (context) => {
          const prompt = `分析以下用户需求，提取选题数量、类型、场景：${context.userInput}
          输出JSON：{"count":数字,"type":"字符串","scene":"字符串"}`;
          const result = await callAiAPI(prompt);
          return JSON.parse(result);
        }
      },
      {
        name: '热点获取',
        execute: async (context) => {
          return await tools.getFinanceHotTopics();
        }
      },
      {
        name: '选题生成',
        execute: async (context) => {
          const prompt = promptTemplates.structuredTopic(
            context.需求分析.count,
            context.需求分析.type
          );
          const result = await callAiAPI(prompt);
          return JSON.parse(result);
        }
      },
      {
        name: '合规检查',
        execute: async (context) => {
          const checkedTopics = [];
          for (const topic of context.选题生成) {
            const prompt = promptTemplates.complianceCheck(topic.title);
            const checkResult = await callAiAPI(prompt);
            checkedTopics.push({
              ...topic,
              compliance: checkResult.includes('合规') ? '合规' : '不合规',
              compliance_note: checkResult
            });
          }
          return checkedTopics;
        }
      },
      {
        name: '选题筛选',
        execute: async (context) => {
          return context.合规检查.filter(t => t.compliance === '合规');
        }
      }
    ];
  }

  async run(userInput) {
    const context = { userInput };
    
    // 执行工作流
    for (const step of this.workflow) {
      console.log(`执行：${step.name}`);
      context[step.name] = await step.execute(context);
    }
    
    return context.选题筛选;
  }
}