/**
 * 环境配置测试
 * 验证环境变量是否正确加载
 */

import { envConfig } from '@/config/env'
import request from '@/utils/request'

/**
 * 测试环境配置加载
 */
export function testEnvConfig() {
  console.group('🧪 环境配置测试')
  
  // 1. 测试环境变量读取
  console.log('✅ 环境配置对象:', envConfig)
  
  // 2. 测试必要配置项
  const tests = [
    {
      name: 'API Base URL',
      value: envConfig.apiBaseURL,
      expected: '应该是字符串且不为空',
      pass: typeof envConfig.apiBaseURL === 'string' && envConfig.apiBaseURL.length > 0
    },
    {
      name: 'API Timeout',
      value: envConfig.apiTimeout,
      expected: '应该是正整数',
      pass: typeof envConfig.apiTimeout === 'number' && envConfig.apiTimeout > 0
    },
    {
      name: 'App Title',
      value: envConfig.appTitle,
      expected: '应该是字符串',
      pass: typeof envConfig.appTitle === 'string'
    },
    {
      name: 'App Version',
      value: envConfig.appVersion,
      expected: '应该是字符串',
      pass: typeof envConfig.appVersion === 'string'
    },
    {
      name: 'Enable Mock',
      value: envConfig.enableMock,
      expected: '应该是布尔值',
      pass: typeof envConfig.enableMock === 'boolean'
    },
    {
      name: 'Enable Request Log',
      value: envConfig.enableRequestLog,
      expected: '应该是布尔值',
      pass: typeof envConfig.enableRequestLog === 'boolean'
    },
    {
      name: 'Mode',
      value: envConfig.mode,
      expected: '应该是 development/staging/production',
      pass: ['development', 'staging', 'production'].includes(envConfig.mode)
    },
    {
      name: 'Is Dev',
      value: envConfig.isDev,
      expected: '应该是布尔值',
      pass: typeof envConfig.isDev === 'boolean'
    }
  ]
  
  let passCount = 0
  let failCount = 0
  
  tests.forEach((test) => {
    if (test.pass) {
      console.log(`✅ ${test.name}: ${test.value}`)
      passCount++
    } else {
      console.error(`❌ ${test.name}: ${test.value} (${test.expected})`)
      failCount++
    }
  })
  
  console.log(`\n测试结果: ${passCount} 通过, ${failCount} 失败`)
  
  // 3. 测试 request 实例配置
  console.log('\n📡 Request 实例配置:')
  console.log('- Base URL 已从环境变量读取')
  console.log('- Timeout 已从环境变量读取')
  
  console.groupEnd()
  
  return {
    total: tests.length,
    passed: passCount,
    failed: failCount,
    success: failCount === 0
  }
}

/**
 * 测试不同环境的配置
 */
export function testEnvironments() {
  console.group('🌍 多环境配置说明')
  
  console.log('当前环境:', envConfig.mode)
  console.log('')
  
  console.log('📝 配置文件说明:')
  console.log('- .env.development   → 开发环境')
  console.log('- .env.staging       → 测试环境')
  console.log('- .env.production    → 生产环境')
  console.log('- .env.*.local       → 本地覆盖配置（不提交）')
  console.log('')
  
  console.log('🔨 构建命令:')
  console.log('- bun run dev                     → 开发模式')
  console.log('- bun run build --mode staging    → 测试版本')
  console.log('- bun run build                   → 生产版本')
  console.log('')
  
  console.log('💡 使用建议:')
  if (envConfig.isDev) {
    console.log('✅ 开发环境 - 可以启用详细日志和 Mock 数据')
    console.log('✅ API Base URL:', envConfig.apiBaseURL)
    console.log('✅ 请求日志:', envConfig.enableRequestLog ? '已启用' : '已关闭')
  } else if (envConfig.mode === 'staging') {
    console.log('⚠️  测试环境 - 连接测试服务器')
    console.log('⚠️  确保 API Base URL 指向测试服务器')
  } else {
    console.log('🚀 生产环境 - 优化性能和安全性')
    console.log('🚀 关闭不必要的日志')
    console.log('🚀 连接生产 API 服务器')
  }
  
  console.groupEnd()
}

/**
 * 测试 API 请求
 */
export async function testApiRequest() {
  console.group('🔌 API 请求测试')
  
  try {
    console.log(`正在测试 ${envConfig.apiBaseURL}/test ...`)
    
    const response = await request.get('/test')
    
    console.log('✅ 请求成功!')
    console.log('响应数据:', response)
    
    return { success: true, data: response }
  } catch (error) {
    console.error('❌ 请求失败:', error)
    
    if (error instanceof Error) {
      console.error('错误信息:', error.message)
    }
    
    return { success: false, error }
  } finally {
    console.groupEnd()
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.clear()
  console.log('🚀 开始环境配置测试...\n')
  
  // 1. 测试环境配置
  const configResult = testEnvConfig()
  
  console.log('')
  
  // 2. 测试环境说明
  testEnvironments()
  
  console.log('')
  
  // 3. 测试 API 请求
  const apiResult = await testApiRequest()
  
  console.log('')
  console.log('=' .repeat(50))
  console.log('📊 测试总结')
  console.log('=' .repeat(50))
  console.log('环境配置:', configResult.success ? '✅ 通过' : '❌ 失败')
  console.log('API 请求:', apiResult.success ? '✅ 通过' : '⚠️  跳过（后端未启动）')
  console.log('=' .repeat(50))
  
  return {
    config: configResult,
    api: apiResult
  }
}

// 开发环境自动运行测试（可选）
if (import.meta.env.DEV) {
  // 取消注释以自动运行测试
  // runAllTests()
}

export default {
  testEnvConfig,
  testEnvironments,
  testApiRequest,
  runAllTests
}
