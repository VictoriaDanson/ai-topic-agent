/**
 * 环境配置工具
 * 统一管理环境变量的读取和类型转换
 */

/**
 * 环境配置接口
 */
export interface EnvConfig {
  // API 配置
  apiBaseURL: string
  apiTimeout: number

  // 应用配置
  appTitle: string
  appVersion: string

  // 功能开关
  enableMock: boolean
  enableRequestLog: boolean

  // 环境信息
  mode: string
  isDev: boolean
  isProd: boolean
}

/**
 * 字符串转布尔值
 */
function parseBoolean(
  value: string | undefined,
  defaultValue = false
): boolean {
  if (!value) return defaultValue
  return value === 'true' || value === '1' || value === 'yes'
}

/**
 * 字符串转数字
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 获取环境配置
 */
export function getEnvConfig(): EnvConfig {
  const env = import.meta.env

  return {
    // API 配置
    apiBaseURL: env.VITE_API_BASE_URL || '/api',
    apiTimeout: parseNumber(env.VITE_API_TIMEOUT, 60000),

    // 应用配置
    appTitle: env.VITE_APP_TITLE || 'AI选题Agent',
    appVersion: env.VITE_APP_VERSION || '1.0.0',

    // 功能开关
    enableMock: parseBoolean(env.VITE_ENABLE_MOCK, false),
    enableRequestLog: parseBoolean(env.VITE_ENABLE_REQUEST_LOG, env.DEV),

    // 环境信息
    mode: env.MODE,
    isDev: env.DEV,
    isProd: env.PROD
  }
}

/**
 * 导出全局环境配置实例
 */
export const envConfig = getEnvConfig()

/**
 * 打印环境配置（仅开发环境）
 */
if (envConfig.isDev) {
  console.group('🔧 环境配置')
  console.log('模式:', envConfig.mode)
  console.log('API Base URL:', envConfig.apiBaseURL)
  console.log('API Timeout:', `${envConfig.apiTimeout}ms`)
  console.log('应用标题:', envConfig.appTitle)
  console.log('应用版本:', envConfig.appVersion)
  console.log('启用 Mock:', envConfig.enableMock)
  console.log('启用请求日志:', envConfig.enableRequestLog)
  console.groupEnd()
}

export default envConfig
