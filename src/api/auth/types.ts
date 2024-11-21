export interface CodeResult {
    uuid: string
    codeUrl: string
}

/** 登录参数 */
export interface LoginParam {
    username: string
    password: string
    uuid: string
    code: string
}

/** 登录接口结果 */
export interface Token {
    username: string
    token: string
}