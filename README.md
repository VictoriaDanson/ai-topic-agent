# AI Topic Agent

金融选题 AI Agent，支持流式输出、Markdown 渲染和前后端 HMR 热更新。

## ✨ 功能特性

- ✅ 流式 AI 生成
- ✅ Markdown 实时渲染
- ✅ **前后端真正的 HMR 热更新**
- ✅ 代理配置避免跨域
- ✅ 无需重启进程

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npm run dev
```

这会同时启动：
- 前端开发服务器：http://localhost:8000 (Vite HMR)
- 后端 API 服务：http://localhost:3100 (chokidar HMR)

**特点：前后端都支持真正的热更新，无需重启进程！**

### 分别启动

```bash
# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run dev:backend
```

## 🔥 HMR 热更新

### 工作原理

| 层级 | 工具 | 更新方式 | 速度 |
|------|------|---------|------|
| **前端** | Vite HMR | 模块热替换 | ⚡️ 毫秒级 |
| **后端** | chokidar HMR | 缓存清除+重载 | ⚡️ 毫秒级 |

### HMR 优势

- ✅ **不重启进程** - 保持服务器运行状态
- ✅ **保持连接** - WebSocket 等连接不断开
- ✅ **保留内存** - 缓存数据不丢失
- ✅ **极速更新** - 毫秒级响应
- ✅ **无缝体验** - 修改代码立即生效

详细说明：[HMR 文档](./docs/HMR.md)

## 📚 文档

- [🚀 快速启动指南](./docs/QUICK-START.md) - 5分钟上手
- [🔥 HMR 详细说明](./docs/HMR.md) - 实现原理和使用
- [📊 方案对比](./docs/HMR-COMPARISON.md) - HMR vs nodemon vs pm2
- [📝 项目总结](./docs/SUMMARY.md) - 完整功能概览

## Vite 热更新方案

### 内置功能
- **HMR (Hot Module Replacement)**：模块热替换，无需刷新
- **Fast Refresh**：保留组件状态
- **Error Overlay**：错误覆盖层显示

### 配置文件：vite.config.js

```javascript
{
  server: {
    port: 8000,           // 开发服务器端口
    open: true,           // 自动打开浏览器
    hmr: {
      overlay: true       // 显示错误覆盖层
    },
    proxy: {              // API 代理
      '/api': 'http://localhost:3100'
    }
  }
}
```

### 后端 HMR 实现

使用 `chokidar` 实现文件监听和模块热替换：

```javascript
// dev-server.js
const chokidar = require('chokidar');

// 监听文件变化
chokidar.watch(['src/backend/**/*.js'])
  .on('change', (file) => {
    // 清除缓存
    delete require.cache[require.resolve('./routes')];
    // 重新加载
    routeHandlers = require('./routes');
    console.log('✨ 热更新完成');
  });
```

### Vite HMR 特点

1. **极速冷启动**：按需编译，毫秒级启动
2. **即时热更新**：修改立即生效，无需重载
3. **精准更新**：只更新改动的模块
4. **保持状态**：页面状态不丢失

### 支持的文件类型

- `.js` / `.jsx` - JavaScript 模块
- `.css` - 样式表
- `.json` - JSON 数据
- `.html` - HTML 文件
- 静态资源（图片、字体等）

## 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 预览生产版本

```bash
npm run preview
```

## API 接口

### POST /api/ai/generate

流式生成 AI 内容

**请求：**
```json
{
  "prompt": "生成3个A股行情相关选题"
}
```

**响应：** SSE 流式数据
```
data: {"text": "生成"}
data: {"text": "的"}
data: {"text": "文本"}
data: [DONE]
```

## 技术栈

### 前端
- Vite - 构建工具 + 开发服务器
- Marked - Markdown 解析
- 原生 JavaScript

### 后端
- Express - Web 框架
- AI SDK - AI 调用
- chokidar - 文件监听（HMR）

## 项目结构

```
ai-topic-agent/
├── src/
│   ├── frontend/          # 前端代码
│   │   ├── index.html     # 入口 HTML
│   │   └── main.js        # 主要逻辑
│   └── backend/           # 后端代码
│       └── server.js      # Express 服务
├── vite.config.js         # Vite 配置
├── package.json           # 依赖配置
└── README.md             # 项目文档
```

## 开发建议

1. **前端开发**：修改 `src/frontend/` 文件即可看到实时效果
2. **后端开发**：修改 `src/backend/` 文件会自动重启服务
3. **API 调用**：使用相对路径 `/api/*`，Vite 会自动代理到后端
4. **样式调试**：修改 `index.html` 中的 CSS 立即生效
