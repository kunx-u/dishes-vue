import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  /* 新增: 设置服务器端参数 */
  server: {
    hmr: true, /* 开启热加载 */
    host: 'localhost', /* 设置服务器地址名 */
    port: 8000, /* 设置端口号 */
    open: true, /* 自动打开浏览器 */
  }
})
