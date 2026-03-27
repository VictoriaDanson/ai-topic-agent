import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/frontend',
  server: {
    port: 8001,  // 使用不同端口
    open: '/index1.html',  // 自动打开 index1.html
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
      }
    }
  }
})
