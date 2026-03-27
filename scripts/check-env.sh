#!/bin/bash

# 环境配置快速检查脚本

echo "🔍 环境变量配置检查"
echo "===================="
echo ""

# 检查配置文件
echo "📁 检查配置文件:"
for file in .env .env.development .env.staging .env.production .env.example; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""

# 检查本地配置
echo "🔐 检查本地配置:"
if [ -f ".env.development.local" ]; then
    echo "  ✅ .env.development.local (存在)"
    echo "     本地配置会覆盖 .env.development"
else
    echo "  ℹ️  .env.development.local (不存在)"
    echo "     可以创建此文件存储本地配置"
    echo "     运行: cp .env.example .env.development.local"
fi

echo ""

# 显示当前环境变量
echo "🌍 当前环境变量预览 (.env.development):"
if [ -f ".env.development" ]; then
    grep "^VITE_" .env.development | while read line; do
        echo "  $line"
    done
else
    echo "  ❌ 文件不存在"
fi

echo ""

# 提示
echo "💡 使用提示:"
echo "  1. 开发环境: bun run dev"
echo "  2. 测试构建: bun run build --mode staging"
echo "  3. 生产构建: bun run build"
echo "  4. 查看文档: cat docs/ENV-CONFIG-GUIDE.md"

echo ""
echo "✅ 检查完成"
