// 金融选题专用Prompt模板
const promptTemplates = {
  // 基础选题生成
  basicTopic: (count, type) => `
    你是资深金融资讯编辑，严格遵守以下规则生成选题：
    1. 类型：${type || '综合金融资讯'}
    2. 数量：${count || 3}个
    3. 风格：客观、专业、合规，不预测涨跌、不荐股
    4. 格式：每条选题单独一行，开头标序号
    5. 覆盖：政策/行情/资金/行业至少1个方向
  `,
  
  // 合规校验
  complianceCheck: (topic) => `
    检查以下金融选题是否合规：
    选题：${topic}
    检查项：
    1. 是否预测具体点位/涨跌
    2. 是否荐股/指导买卖
    3. 是否夸大/煽动情绪
    输出：合规/不合规 + 原因 + 修改建议
  `
};

module.exports = promptTemplates;