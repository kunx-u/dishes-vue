import request from '@/util/request'
import type { CodeResult,LoginParam,Token } from './types'
import qs from 'qs'


const API: string = '/auth-service'


/** 验证码接口 */

export const getCode = () => {
    return request<CodeResult,CodeResult>({
        url: API + '/code/getCode',
        method: 'get'
    })
}


/** 登录接口 */
export const login = (form: LoginParam) => {
    return request<Token,Token>({
        url: API + '/user/login',
        method: 'post',

        data: qs.stringify(form) // 将form对象转成key=value的键值对
    })
}