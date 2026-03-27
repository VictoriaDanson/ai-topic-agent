#!/bin/bash

# AI 选题 Agent - 快速启动脚本
# 用于快速启动开发服务器

set -e

echo "🚀 AI 选题 Agent - 启动中..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 Bun
if ! command -v bun &> /dev/null; then
    echo "❌ 错误：未检测到 Bun，请先安装 Bun"
    echo "   安装命令：curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")/.."

echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "   正在安装依赖..."
    bun install
else
    echo "   ✅ 依赖已安装"
fi

echo ""
echo "🎨 当前布局：侧边栏布局（Ant Design 蓝主题）"
echo "📑 Tab 标签页："
echo "   ✨ 流式生成 - 实时生成选题"
echo "   🔥 热点选题 - 基于实时热点"
echo "   📋 结构化生成 - 高级定制选题"
echo ""

# 启动服务
echo "🌐 启动开发服务器..."
echo "   前端地址：http://localhost:8000"
echo "   后端地址：http://localhost:3100"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止服务"
echo "   - 查看文档：docs/LAYOUT-OPTIMIZATION-SUMMARY.md"
echo ""

# 启动开发服务器
bun run dev
