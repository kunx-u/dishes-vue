import axios, { type AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'

const service: AxiosInstance = axios.create({
    // 网关地址
    baseURL: import.meta.env.VITE_APP_BASE_API
})

/* 响应拦截器 */
service.interceptors.response.use(resp => {
    const {code,message,data} = resp.data
    if(code === 200) {
        return Promise.resolve(data)
    } else {
        ElMessage.error(message)
        return Promise.reject(message)
    }

},e=>{
    console.log(e)
    return Promise.reject(e)
})

export default service