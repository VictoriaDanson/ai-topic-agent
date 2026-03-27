# 🔧 Bug 修复说明

## 问题描述

访问页面时出现错误：
```
http://localhost:8000/api/ai/topic/structured 404 (Not Found)
```

## 问题原因

1. **后端路由未导入模块**：`routes.js` 中使用了 `promptTemplates` 但未导入
2. **后端路由未注册**：`server.js` 中没有注册 `/api/ai/topic/structured` 路由
3. **前端组件不完整**：缺少"结构化生成"的专用组件

---

## 修复内容

### 1. 修复后端路由导入

**文件：** `src/backend/routes.js`

**修复：** 添加 `promptTemplates` 导入

```javascript
const promptTemplates = require('../utils/promptTemplates')
```

### 2. 添加结构化选题路由

**文件：** `src/backend/server.js`

**修复：** 添加完整的路由处理

```javascript
/**
 * 结构化选题生成接口
 */
app.post('/api/ai/topic/structured', async (req, res) => {
  const { count = 3, type = '综合金融' } = req.body
  try {
    const prompt = promptTemplates.structuredTopic(count, type)
    const result = await callAiAPI(prompt)
    // 解析JSON
    const topics = JSON.parse(result)
    res.json({ code: 200, data: topics })
  } catch (error) {
    console.error('结构化选题生成失败:', error)
    res.json({ code: 500, message: '生成/解析失败：' + error.message })
  }
})
```

### 3. 创建结构化选题组件

**文件：** `src/frontend/src/components/TopicStructured.vue`

**功能：**
- 选择生成数量（1/3/5/10个）
- 选择选题类型（综合金融、政策解读、市场行情等）
- 卡片式展示结构化结果
- 显示标题、类型、发布时段、核心看点、合规性

### 4. 更新布局组件

**文件：** `src/frontend/src/layouts/LayoutSidebarModern.vue`

**修复：** 将"结构化生成" Tab 关联到新组件

```typescript
import StructuredTopic from '@/components/TopicStructured.vue'

const tabs: Tab[] = [
  // ...
  {
    id: 'structured',
    label: '结构化生成',
    desc: '高级定制选题',
    icon: '📋',
    component: StructuredTopic
  }
]
```

---

## 功能说明

### 结构化选题生成

**API 端点：** `POST /api/ai/topic/structured`

**请求参数：**
```json
{
  "count": 3,        // 生成数量: 1/3/5/10
  "type": "综合金融"  // 选题类型
}
```

**支持的类型：**
- 综合金融
- 政策解读
- 市场行情
- 资金流向
- 行业分析
- 公司动态

**响应格式：**
```json
{
  "code": 200,
  "data": [
    {
      "title": "选题标题",
      "type": "政策/行情/资金/行业",
      "publish_time": "早盘/午间/收盘/晚间",
      "key_point": "核心看点（一句话）",
      "compliance": "合规性说明"
    }
  ]
}
```

**Prompt 模板：**
```
你是资深金融资讯编辑，生成${count}个${type}方向的选题，严格按以下JSON格式输出...
要求：
1. 客观、专业、合规，不预测涨跌、不荐股
2. 标题吸引眼球但不夸大
3. 覆盖不同发布时段
```

---

## 测试方法

### 1. 启动服务

```bash
cd /Users/victoria/Downloads/test/ai-topic-agent
bun run dev
```

### 2. 访问页面

打开浏览器访问：`http://localhost:8000`

### 3. 测试结构化生成

1. 点击侧边栏的 **"📋 结构化生成"** Tab
2. 选择生成数量（如 3个）
3. 选择选题类型（如 "综合金融"）
4. 点击 **"生成结构化选题"** 按钮
5. 等待加载完成，查看卡片式结果

### 4. 预期结果

应该看到 3 个卡片，每个卡片包含：
- 编号（1/2/3）
- 标题（大字体）
- 类型标签（蓝色）
- 发布时段（灰色）
- 核心看点（段落）
- 合规性说明（绿色=合规，橙色=警告）

---

## 文件变更清单

### 修改的文件

```
src/backend/routes.js                        # 添加 promptTemplates 导入
src/backend/server.js                        # 添加 /api/ai/topic/structured 路由
src/frontend/src/layouts/LayoutSidebarModern.vue  # 更新组件引用
```

### 新增的文件

```
src/frontend/src/components/TopicStructured.vue    # 结构化选题组件
docs/BUG-FIX-404.md                               # 本文档
```

---

## 相关 API

### 1. 流式生成

- **端点：** `POST /api/ai/generate`
- **用途：** 实时流式生成选题
- **响应：** Server-Sent Events (SSE)

### 2. 热点选题

- **端点：** `POST /api/ai/function/call`
- **用途：** 基于实时热点生成选题
- **响应：** JSON

### 3. 结构化生成（新增）

- **端点：** `POST /api/ai/topic/structured`
- **用途：** 生成结构化选题（带类型、时段等）
- **响应：** JSON

---

## 常见问题

### Q1: 仍然出现 404 错误？

**解决：** 重启开发服务器

```bash
# 停止现有服务
pkill -f "node.*server.js"
pkill -f "bun.*dev"

# 重新启动
bun run dev
```

### Q2: 结构化生成失败？

**检查：**
1. 后端服务是否正常运行（端口 3100）
2. AI API 是否可用
3. 浏览器控制台是否有错误日志

### Q3: 生成的 JSON 解析失败？

**原因：** AI 返回的内容不是标准 JSON

**解决：** 优化 Prompt 模板，强调"仅输出JSON，不要其他内容"

---

## 后续优化建议

1. **错误处理增强**
   - 添加重试机制
   - 提供更友好的错误提示
   - 记录详细的错误日志

2. **功能扩展**
   - 支持自定义 Prompt 模板
   - 添加选题收藏功能
   - 支持导出为 Excel/CSV

3. **性能优化**
   - 添加请求缓存
   - 实现防抖处理
   - 优化大批量生成

4. **用户体验**
   - 添加生成进度条
   - 支持编辑生成结果
   - 添加历史记录

---

## 更新日志

### v2.0.1 (2026-03-26)

**Bug 修复：**
- ✅ 修复 404 错误（/api/ai/topic/structured）
- ✅ 添加结构化选题路由
- ✅ 创建结构化选题组件

**功能新增：**
- ✅ 结构化选题生成（支持数量和类型选择）
- ✅ 卡片式结果展示
- ✅ 合规性标识

---

**Bug 已修复！** ✅

现在可以正常使用结构化生成功能了！
