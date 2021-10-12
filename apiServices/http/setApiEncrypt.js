

import { generateEncrypt } from '@/utils/randomEncrypt'
import { apiVerificationConfig } from '@/config'
import querystring from 'querystring'

/**
 * @description
 * 合约项目参数加密解析设计，目前只添加了get和post请求；如有需求添加其他，后面再加
 * @param {*} config 
 * @param {*} token 
 */

export function setApiEncrypt (config, token) {
    const { method, params, data } = config || {}
    if (method === 'get') {
        config.params = params ? generateEncrypt(apiVerificationConfig, token, params) : generateEncrypt(apiVerificationConfig, token)
    }

    if (method === 'post') {
        config.data = data ? querystring.stringify(generateEncrypt(apiVerificationConfig, token, data)) : querystring.stringify(generateEncrypt(apiVerificationConfig, token))
    }



}