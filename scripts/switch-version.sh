#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔄 前端版本切换工具"
echo "===================="
echo ""

# 检查当前版本
if [ -d "src/frontend/src" ]; then
    CURRENT="vue3"
    echo -e "${GREEN}当前版本: Vue3 + TypeScript${NC}"
else
    CURRENT="vanilla"
    echo -e "${GREEN}当前版本: 原生 JavaScript${NC}"
fi

echo ""
echo "选择操作:"
echo "1) 切换到 Vue3 + TypeScript 版本 (推荐)"
echo "2) 回滚到原生 JavaScript 版本"
echo "3) 查看版本对比"
echo "4) 退出"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        if [ "$CURRENT" = "vue3" ]; then
            echo -e "${YELLOW}已经是 Vue3 版本${NC}"
            exit 0
        fi
        
        echo ""
        echo "⚠️  警告: 此操作将备份当前文件并切换到 Vue3 版本"
        read -p "确认继续? (y/n): " confirm
        
        if [ "$confirm" != "y" ]; then
            echo "已取消"
            exit 0
        fi
        
        echo ""
        echo "📦 备份原始文件..."
        cd src/frontend
        [ -f "main.js" ] && mv main.js main.js.backup
        [ -f "index.html" ] && mv index.html index.html.backup
        
        echo -e "${GREEN}✅ 已切换到 Vue3 版本${NC}"
        echo ""
        echo "下一步:"
        echo "1. 运行: bun install"
        echo "2. 运行: bun run dev"
        echo "3. 访问: http://localhost:8000"
        ;;
        
    2)
        if [ "$CURRENT" = "vanilla" ]; then
            echo -e "${YELLOW}已经是原生 JS 版本${NC}"
            exit 0
        fi
        
        echo ""
        echo "⚠️  警告: 此操作将删除 Vue3 相关文件"
        read -p "确认继续? (y/n): " confirm
        
        if [ "$confirm" != "y" ]; then
            echo "已取消"
            exit 0
        fi
        
        echo ""
        echo "📦 恢复原始文件..."
        cd src/frontend
        
        # 删除 Vue3 目录
        [ -d "src" ] && rm -rf src
        
        # 恢复备份
        if [ -f "main.js.backup" ]; then
            mv main.js.backup main.js
            echo -e "${GREEN}✅ 已恢复 main.js${NC}"
        else
            echo -e "${RED}❌ 找不到 main.js.backup${NC}"
        fi
        
        if [ -f "index.html.backup" ]; then
            mv index.html.backup index.html
            echo -e "${GREEN}✅ 已恢复 index.html${NC}"
        else
            echo -e "${RED}❌ 找不到 index.html.backup${NC}"
        fi
        
        echo ""
        echo -e "${GREEN}✅ 已切换到原生 JS 版本${NC}"
        echo ""
        echo "下一步:"
        echo "1. 运行: bun run dev"
        echo "2. 访问: http://localhost:8000"
        ;;
        
    3)
        echo ""
        cat << 'EOF'
📊 版本对比

原生 JavaScript 版本:
  ✅ 简单直接
  ✅ 无学习成本
  ❌ 难以维护
  ❌ 无类型检查
  ❌ 无组件化

Vue3 + TypeScript 版本:
  ✅ 类型安全
  ✅ 组件化开发
  ✅ 易于维护
  ✅ 代码复用
  ✅ IDE 支持好
  ⚠️ 需要学习

详细对比请查看: docs/REFACTORING-COMPARISON.md
EOF
        ;;
        
    4)
        echo "退出"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ 无效选项${NC}"
        exit 1
        ;;
esac
