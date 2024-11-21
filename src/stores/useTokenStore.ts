import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Token } from '@/api/auth/types'

export const userTokenStore = defineStore("token", () => {
    const tokenInfo = ref<Token>({
        username: '',
        token: ''
    })


    const setToken = (token: Token) => {
        tokenInfo.value = token
    }

    const clearToken = () => {
        tokenInfo.value = {
            username: '',
            token: ''
        }
    }

    const getUsername = computed(() => tokenInfo.value.username)

    const getToken = computed(() => tokenInfo.value.token)

    return { tokenInfo, setToken, clearToken, getUsername, getToken }
}, {
    persist: {
        enabled: true,
        key: "tokenStore",
        // 默认是 localStorage
        storage: sessionStorage,
    }
})
