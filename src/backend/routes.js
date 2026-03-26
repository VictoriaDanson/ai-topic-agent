// src/backend/routes.js
// 路由配置模块
const { streamText } = require('ai');
const { createOpenAICompatible } = require('@ai-sdk/openai-compatible');
const { tools, toolDescriptions, getRealFinanceHotTopics} = require('../utils/tools');
const { callAiAPI } = require('../utils/aiClient');

// 配置 AI 模型
const customProvider = createOpenAICompatible({
  name: 'custom-provider',
  baseURL: 'https://kapi.jrj.com/v1',
  apiKey: 'sk-Osuvq0KqdSyNd0o8AQML62eClU9d0gPyi7pnSXuCihH19sDJ',
});

const llama3 = customProvider('gpt-5.1');

// 路由处理函数
const routes = {
  '/api/ai/generate': {
    post: async (req, res) => {
      const { prompt } = req.body;
      if (!prompt) {
        return res.json({ code: 400, message: '请输入Prompt' });
      }

      try {
        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked');

        const result = await streamText({
          model: llama3,
          prompt,
        });

        // 流式输出
        for await (const chunk of result.textStream) {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`, 'utf8');
          process.stdout.write(chunk);
        }

        console.log('\n✅ 生成完成');
        res.write('data: [DONE]\n\n', 'utf8');
        res.end();
      } catch (error) {
        console.error('❌ 生成失败:', error);

        if (!res.headersSent) {
          res.status(500).json({
            code: 500,
            message: '模型调用失败',
            error: error.message,
          });
        } else {
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`, 'utf8');
          res.end();
        }
      }
    },
  },
  '/api/test': {
    get: async (req, res) => {
      res.json({
        code: 200,
        message: 'HMR 测试接口 - 修改此消息测试热更新',
        timestamp: new Date().toISOString(),
      });
    },
  },
  '/api/ai/function/call': {
    post: async (req, res) => {
      try {
        // 1. 先让AI决定调用哪个工具
        const prompt = `
          你需要根据用户需求决定是否调用工具，仅返回JSON格式：
          {
            "need_call": true/false,
            "tool_name": "工具名称"
          }
          工具列表：${JSON.stringify(toolDescriptions)}
          用户需求：${req.body.prompt}
        `;
        
        // 2. 调用AI获取工具调用决策
        const aiResponse = await callAiAPI(prompt);
        const decision = JSON.parse(aiResponse);
        console.log("decision===", decision)
        
        if (decision.need_call && tools[decision.tool_name]) {
          // 3. 调用工具
          const toolResult = await tools[decision.tool_name]();
          // 4. 基于工具结果生成选题
          const finalPrompt = `
            基于以下工具返回的信息，生成5个合规的金融资讯选题：
            工具返回：${JSON.stringify(toolResult)}
            要求：客观、专业、有时效性，不预测涨跌、不荐股
          `;
          console.log("finalPrompt===", finalPrompt)
          const finalResult = await callAiAPI(finalPrompt);
          res.json({ code: 200, data: finalResult });
        } else {
          // 不需要调用工具，直接生成
          const result = await callAiAPI(req.body.prompt);
          res.json({ code: 200, data: result });
        }
      } catch (error) {
        console.error('❌ Function call 失败:', error);
        res.json({ code: 500, message: error.message });
      }
    },
  },
};

module.exports = routes;
