/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/**
 * 环境变量类型声明
 */
interface ImportMetaEnv {
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string

  // 功能开关
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_ENABLE_REQUEST_LOG: string

  // Vite 内置
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
