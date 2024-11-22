import request from '@/util/request'
import type {CodeResult, LoginParam, Token} from '@/api/auth/types'
import qs from 'qs'

const API: string = '/auth-service'

/** 验证码接口 */
export const getCode = () => {
  return request<CodeResult, CodeResult>({
    url: API + '/code/getCode',
    method: 'get'
  })
}

/** 登录接口 */
export const login = (form: LoginParam) => {
  return request<Token, Token>({
    url: API + '/user/login',
    method: 'post',
    // data: form // axios默认将form对象转成json字符串
    data: qs.stringify(form) // 将form对象转成key=value的键值对
  })
}