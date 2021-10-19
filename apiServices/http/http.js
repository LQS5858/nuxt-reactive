import axios from 'axios'

import { Notification } from 'element-ui';
import { setApiEncrypt } from './setApiEncrypt'


export default (app, store) => {
  const service = axios.create({
    baseURL: '/api',
    timeout: 30000,
    withCredentials: true
  })
  service.interceptors.request.use(config => {
    // Nprogress.start()
    /**
  * localStorage统一使用bt-tools的StorageCache，含过期时间控制，参考文档：https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/
     */
    let token = localStorage.getItem('token')
    if (token) {
      token = JSON.parse(token)
      config.headers.Authorization = `Token ${token}`
    }
    config.headers['Accept-Language'] = `${app.i18n.locale}`
    // /**
    //  * 该工具函数添加接口验签,部分接口通过传入axios配置{notEncrypt:true}不加密
    //  */
    if (!config?.notEncrypt) {
      setApiEncrypt(config, token)
    }
    // /**
    //    * 把当前请求信息添加到pendingRequest对象中
    //    * 通过接口传入配置开关{cancelRequest:true}决定是否开启axios取消重复请求
    //    * @param {Object} {cancelRequest:true} -通过接口传入配置开关{cancelRequest:true}决定是否开启axios取消重复请求
    //    * @returns 无
    //    * 参考文档(需翻墙):https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/global.html
    //    */
    // CancelRepeatRequest.addPendingRequest(config)
    // /**
    //    * 通过传入axios接口配置参数{cache:true}是否开启对api数据缓存
    //    * @param {Object} {cache:true} -通过传入axios接口配置参数{cache:true}是否开启对api数据缓存
    //    * @returns 无
    //    * 参考文档(需翻墙):https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/global.html
    //    */
    // RequestInterceptor(config, service)
    return config
  })
  service.interceptors.response.use(
    res => {
      // Nprogress.done()
      // 移除取消队列的api
      // 参考文档(需翻墙):https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/global.html
      // CancelRepeatRequest.removePendingRequest(res)
      // 接口成功，对数据进行缓存
      // 参考文档(需翻墙):https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/global.html
      // ResponseInterceptor(res)
      const { data: result, config } = res || {}
      const { url } = config || {}
      const { showError } = config || {}
      const { code, message, data } = result || {}
      if (+code === 10001 && url?.indexOf('set_lang') < 0) {
        localStorage.removeItem('token')
        store.commit('basic/SAVE_USER_INFO', {})
        // if (process.env.NODE_ENV !== 'development') {
        //   location.pathname = "/login" //登录路由
        // }
      }
      if (+code === 10000) return data
      if (showError) Notification({ type: 'warning', message: message, duration: 1500 })
      return Promise.reject(message)
    },
    error => {
      const { response } = error
      // 服务异常,移除取消列表的api
      // CancelRepeatRequest.removePendingRequest(response)
      if (error?.code === 'ECONNABORTED' || error?.message?.indexOf('timeout') !== -1) {
        if (String(warningCount) === '0' && (error?.message)) {
          Notification({ type: 'error', message: app.i18n.t('network_timeout'), duration: 1500 })
          warningCount = +warningCount + 1
        }
      }
      // // 屏蔽掉网络超时
      // // if (String(warningCount) === '0') {
      // //   warningCount = +warningCount + 1
      // //   Notification({ type: 'error', message: i18n.t('network_timeout'), duration: 1500 })
      // // }
      return Promise.reject(error)
    }
  )
  return service
}