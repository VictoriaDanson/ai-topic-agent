#!/bin/bash

echo "🔍 HMR 快速诊断"
echo "==============="
echo ""

# 检查服务
echo "1️⃣ 检查服务状态"
echo "前端 (8000):" $(lsof -i :8000 | grep LISTEN | wc -l) "个进程"
echo "后端 (3100):" $(lsof -i :3100 | grep LISTEN | wc -l) "个进程"
echo ""

# 测试后端
echo "2️⃣ 测试后端接口"
curl -s http://localhost:3100/api/test | head -3
echo ""
echo ""

# 提示
echo "3️⃣ 测试前端 HMR"
echo "👉 打开浏览器到 http://localhost:8000"
echo "👉 打开控制台（F12）"
echo "👉 修改 src/frontend/main.js"
echo "👉 查看控制台是否显示: [vite] hot updated"
echo ""

echo "4️⃣ 测试后端 HMR"  
echo "👉 修改 src/backend/routes.js"
echo "👉 查看终端是否显示: 🔥 检测到文件变化"
echo ""

echo "💡 如果没有看到更新："
echo "   - 强制刷新浏览器: Cmd+Shift+R"
echo "   - 检查终端日志是否有错误"
echo "   - 重启服务: Ctrl+C 然后 npm run dev"
