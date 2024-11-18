import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

/* 导入element-plus组件和它的css样式 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
/* 导入中文国际化文件 */
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
/* 为Vue安装ElementPlus, 并配置中文国际化 */
app.use(ElementPlus, {
locale: zhCn,
})
/* Element-Plus图标 */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
app.component(key, component)
}
app.mount('#app')
