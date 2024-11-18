/// <reference types="vite/client" />
declare module 'element-plus/dist/locale/zh-cn.mjs'
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string
    // 更多环境变量...
}
declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv
    }
}
