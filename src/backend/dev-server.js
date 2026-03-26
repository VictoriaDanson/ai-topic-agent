// src/backend/dev-server.js
// 使用 chokidar 实现后端 HMR（不重启进程）
require('dotenv').config();
const express = require('express');
const chokidar = require('chokidar');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100;

console.log('🚀 启动开发服务器（HMR 模式）...');

// 基础中间件
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 存储路由处理函数
let routeHandlers = {};

// 动态加载路由模块
function loadRoutes() {
  // 清除 require 缓存
  const serverPath = path.join(__dirname, 'server.js');
  delete require.cache[require.resolve(serverPath)];
  
  // 清除相关依赖的缓存
  Object.keys(require.cache).forEach((key) => {
    if (key.includes('src/backend') || key.includes('src/utils')) {
      delete require.cache[key];
    }
  });

  try {
    // 重新加载模块
    const routes = require('./routes');
    routeHandlers = routes;
    console.log('✅ 路由模块已加载');
    return true;
  } catch (error) {
    console.error('❌ 路由加载失败:', error.message);
    return false;
  }
}

// 动态路由处理器
app.use((req, res, next) => {
  const handler = routeHandlers[req.path];
  if (handler && handler[req.method.toLowerCase()]) {
    handler[req.method.toLowerCase()](req, res, next);
  } else {
    next();
  }
});

// 初始加载路由
loadRoutes();

// 监听文件变化
const watcher = chokidar.watch(['src/backend/**/*.js', 'src/utils/**/*.js'], {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('change', (filePath) => {
    console.log(`\n🔥 检测到文件变化: ${filePath}`);
    console.log('🔄 热更新中...');
    
    const success = loadRoutes();
    if (success) {
      console.log('✨ 热更新完成！无需重启服务\n');
    }
  })
  .on('error', (error) => {
    console.error('❌ 文件监听错误:', error);
  });

// 启动服务
const server = app.listen(PORT, () => {
  console.log(`\n✅ 后端服务运行在: http://localhost:${PORT}`);
  console.log('🔥 HMR 已启用 - 修改代码自动热更新');
  console.log('📁 监听目录: src/backend/, src/utils/\n');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n👋 关闭服务器...');
  watcher.close();
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});
