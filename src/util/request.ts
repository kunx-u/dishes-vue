import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useTokenStore} from '@/stores/useTokenStore'
import router from '@/router'

const service = axios.create({
  // 网关地址
  baseURL: import.meta.env.VITE_APP_BASE_API
})

/* 请求拦截器  请求发动到服务器端前统一设置token */
service.interceptors.request.use(config => {
  const tokenStore = useTokenStore()
  config.headers['Authorization'] = tokenStore.getToken
  return config
}, e => {
  console.log(e)
  return Promise.reject(e)
})

/* 响应拦截器 */
service.interceptors.response.use(resp => {
  const {code, message, data} = resp.data
  if (code == 200) {
    // resp.data.data
    return Promise.resolve(data)
  } else if (code == 403) {
    ElMessage.error(message)
    const tokenStore = useTokenStore()
    tokenStore.clearToken()
    router.push('/login')
  } else {
    ElMessage.error(message)
    return Promise.reject(message)
  }
}, e => {
  console.log(e)
  return Promise.reject(e)
})

export default service