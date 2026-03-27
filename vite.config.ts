import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // 设置根目录为 frontend
  root: 'src/frontend',

  // 插件配置
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  
  // 开发服务器配置
  server: {
    port: 8000,
    // 自动打开浏览器
    open: true,
    // 热更新配置
    hmr: {
      overlay: true, // 显示错误覆盖层
    },
    // 代理配置，解决跨域问题
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend/src')
    }
  }
})
