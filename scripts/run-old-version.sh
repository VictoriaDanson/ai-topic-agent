#!/bin/bash

# 运行旧版本原生 JS 的脚本

echo "🚀 启动旧版本（原生 JavaScript）"
echo "================================"
echo ""

# 检查后端是否运行
if ! lsof -i :3100 > /dev/null 2>&1; then
    echo "⚠️  后端服务未运行在 3100 端口"
    echo "请先启动后端: npm run dev:backend"
    echo ""
    read -p "是否现在启动后端? (y/n): " start_backend
    if [ "$start_backend" = "y" ]; then
        echo "启动后端..."
        npm run dev:backend &
        sleep 2
    fi
fi

echo ""
echo "📂 使用 Python HTTP 服务器运行旧版本"
echo ""

cd src/frontend

# 检查 Python 版本
if command -v python3 &> /dev/null; then
    echo "✅ Python3 已找到"
    echo ""
    echo "启动服务器在 http://localhost:8001"
    echo "访问: http://localhost:8001/index1.html"
    echo ""
    echo "按 Ctrl+C 停止服务"
    echo ""
    python3 -m http.server 8001
else
    echo "❌ 未找到 Python3"
    echo "请安装 Python 或使用其他方法"
fi
