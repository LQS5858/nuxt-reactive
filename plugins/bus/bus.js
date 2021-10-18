import Vue from 'vue'
import _ from 'lodash'
import WsLoginEncrypt from './wsLoginEncrypt'

/**
 * @author Ricardo
 * 事件总线也包含websocket封装
 * websocket订阅,例如:this.subscribe({op:'sub',topic:""})
 */
export default () => {
  const bus = new Vue({
    data () {
      return {
        url: '',
        ws: null,
        subscribeQueue: [],
        unsubscribeQueue: [],
        countClose: 0,
        pingTime: null,
        reSubId: null,
        wsLoginData: WsLoginEncrypt(),
        wsLoginStatus: false,
      }
    },
    destoryed () {
      clearInterval(this.pingTime)
      clearInterval(this.reSubId)
    },
    methods: {
      /**
       * @description
       * ws初始化方法
       * @param {*} url -websocket链接url
       */
      init (url) {
        if (!url) return new Error('[ws的url不能为空]>>>')
        this.url = url
        // console.log('websocket链接url>>>', url);
        this.connectSocket()
      },
      wsLogin () {
        if (!this.ws || this.ws.readyState !== 1) return
        this.wsLoginData = WsLoginEncrypt()
        this.ws?.send(JSON.stringify(this.wsLoginData))
      },
      connectSocket () {
        const hoows = window.WebSocket || window.MozWebSocket;
        this.ws = new hoows(this.url)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = () => {
          // console.log('ws实例》》', this.ws);
          try {
            this.countClose = 0
            this.wsLogin()
            this.sendHeartbeat()
            this.reSubscribe()
          } catch (error) {
            console.error('[ws初始化连接出错]>>>');
          }

        }
        this.ws.onerror = () => {
          console.warn('websocket 意外错误', this.countClose)
          this.reConnect()
        }
        this.ws.onclose = () => {
          console.info('websocket 意外关闭', this.countClose)
          this.reConnect()
        }
        this.ws.onmessage = event => {
          try {
            const { data } = event || {}
            if (!data) return
            let onData = typeof data === 'string' ? JSON.parse(data) : data
            const { topic, op } = onData || {}
            if (op === 'loginws') {
              this.wsLoginStatus = true
              this.reSubscribe()
            }
            if (_.isEmpty(this.subscribeQueue)) return
            const cbList = this.subscribeQueue?.filter(item => {
              const { cmd } = item || {}
              const { topic: _topic } = cmd || {}
              return _topic === topic
            })
            // const { callback } = this.subscribeQueue?.find(item => {
            //   const { cmd } = item || {}
            //   const { topic: _topic } = cmd || {}
            //   return _topic === topic
            // }) || {}
            cbList.forEach(({ callback }) => {
              if (callback) {
                callback(onData)
              }
            })
          } catch (error) {
            console.warn('[ws-error]>>>', error)
          }

        }
      },
      sendHeartbeat () {
        if (!this.ws || this.ws.readyState !== 1) return
        // 5s发送一次心跳
        this.pingTime = setInterval(() => {
          this.ws.send(JSON.stringify({ 'op': 'sub', 'topic': 'hb' }))
        }, 5000)
      },
      reSubscribe () {
        if (_.isEmpty(this.unsubscribeQueue) || this.ws?.readyState !== 1 || !this.wsLoginStatus) return
        while (this.unsubscribeQueue?.length) {
          const item = this.unsubscribeQueue?.shift()
          const { cmd, callback } = item || {}
          // console.log('[开始重新订阅]>>>', item);
          this.subscribe(cmd, callback)
        }
      },
      reConnect () {
        if (this.countClose > 200) return
        if (this.subscribeQueue?.length) {
          this.unsubscribeQueue = [
            ...this.unsubscribeQueue,
            ...this.subscribeQueue,
          ]
          this.subscribeQueue = []
        }
        this.wsLoginStatus = false
        this.countClose = this.countClose + 1

        const id = setTimeout(() => {
          if (this.ws.readyState === 0 || this.ws.readyState === 1) {
            return
          }
          this.connectSocket(this.url)
          clearTimeout(id)
        }, 30000)
      },
      /**
       *
       * @param {*} cmd -订阅ws参数，例如：{"op":"sub", "topic": ""}
       * @param {*} callback -接收服务端数据后的回调
       * @returns 无
       * @author Ricardo
       */
      subscribe (cmd, callback) {
        // websocket 还未连接,还要ws未登录判断
        if (!this.ws || this.ws.readyState !== 1 || !this.wsLoginStatus) {
          console.warn('websocket 待初始化', cmd)
          this.unsubscribeQueue.push({
            cmd,
            callback,
          })
          // console.log('--加入未订阅行列--', this.unsubscribeQueue);
          return
        }
        // 传参不对
        if (_.isEmpty(cmd) || !callback) return new Error('[订阅传参数不对]>>>')
        if (!(cmd instanceof Object)) return new Error('参数类型错误,参数约定为数组>>>>>')
        // console.info('websocket 开始订阅>>>>>>>', cmd)
        this.ws?.send(JSON.stringify(cmd))
        this.subscribeQueue.push({ cmd, callback })
      },
      /**
       * @description
       * 取消订阅方法
       * @param {*} cmd -取消订阅参数，例如{op:'unsub',topic:""}
       */
      unsubscribe (uncmd) {
        const { topic: untopic } = uncmd || {}
        if (_.isEmpty(this.subscribeQueue)) return console.error('[ws取消订阅]>>', '没有可取消的队列');
        const unIndex = this.subscribeQueue?.findIndex(item => {
          const { cmd } = item || {}
          const { topic } = cmd || {}
          return untopic === topic
        }) || null
        if (!_.isEmpty(this.unsubscribeQueue)) {
          const id = this.unsubscribeQueue?.findIndex(item => {
            const { cmd } = item || {}
            const { topic } = cmd || {}
            return untopic === topic
          }) || null
          if (id < 0) return
          this.unsubscribeQueue.splice(id, 1)
        }
        if (unIndex < 0) return
        this.ws?.send(JSON.stringify(uncmd))
        this.subscribeQueue.splice(unIndex, 1)
      },
    },
  })
  return bus
}

