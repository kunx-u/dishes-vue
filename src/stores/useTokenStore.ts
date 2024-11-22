import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {Token} from '@/api/auth/types'

export const useTokenStore = defineStore("token", () => {
  // state
  const tokenInfo = ref<Token>({
    username: '',
    token: ''
  })

  /* action: 设置token */
  const setToken = (token: Token) => {
    tokenInfo.value = token
  }

  /* action: 清空token */
  const clearToken = () => {
    tokenInfo.value = {
      username: '',
      token: ''
    }
  }

  /* getter */
  const getUsername = computed(() => tokenInfo.value.username)

  /* getter */
  const getToken = computed(() => tokenInfo.value.token)

  return {tokenInfo, setToken, clearToken, getUsername, getToken}

}, {
  persist: {
    key: "tokenStore",
    // 默认是 localStorage
    storage: sessionStorage,
  }
})
