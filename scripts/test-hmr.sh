#!/bin/bash

echo "🧪 测试后端 HMR 热更新"
echo "======================="
echo ""

# 检查服务是否运行
if ! curl -s http://localhost:3100/api/test > /dev/null; then
    echo "❌ 服务未运行，请先执行: npm run dev"
    exit 1
fi

echo "✅ 服务已运行"
echo ""

# 测试初始响应
echo "📋 初始响应："
curl -s http://localhost:3100/api/test | jq .
echo ""

echo "⏳ 请修改 src/backend/routes.js 中的 /api/test 路由消息..."
echo "   修改完成后按回车键继续测试"
read

# 等待 HMR 完成
sleep 1

# 测试更新后的响应
echo "📋 更新后响应："
curl -s http://localhost:3100/api/test | jq .
echo ""

echo "✨ HMR 测试完成！"
echo ""
echo "💡 提示："
echo "  - 如果消息已更新，说明 HMR 成功"
echo "  - 进程 PID 没有变化，证明没有重启"
echo "  - 查看终端日志确认热更新过程"
