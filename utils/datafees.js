
/**
 * JS API
 */
class datafeeds {
  /**
   * JS API
   * @param {*Object} vue vue实例
   */
  constructor(vue) {
    this.self = vue
  }

  /**
   * @param {*Function} callback  回调函数
   * `onReady` should return result asynchronously.
   */
  onReady (callback) {
    return new Promise((resolve, reject) => {
      console.log(reject);
      let configuration = this.defaultConfiguration()
      if (this.self.getConfig) {
        configuration = Object.assign(this.defaultConfiguration(), this.self.getConfig())
      }
      resolve(configuration)
    }).then(data => callback(data))
  }

  /**
   * @param {*String} symbolName  商品名称或ticker
   * @param {*Function} onSymbolResolvedCallback 成功回调
   * @param {*Function} onResolveErrorCallback   失败回调
   * `resolveSymbol` should return result asynchronously.
   */
  resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    return new Promise((resolve, reject) => {
      console.log('获取币对信息>>>', reject, symbolName);
      let symbolInfo = this.defaultSymbol(symbolName)
      if (this.self.getSymbol) {
        symbolInfo = Object.assign(this.defaultSymbol(symbolName), this.self.getSymbol())
      }
      resolve(symbolInfo)
    }).then(data => onSymbolResolvedCallback(data)).catch(err => onResolveErrorCallback(err))
  }

  /**
   * @param {*Object} symbolInfo  商品信息对象
   * @param {*String} resolution  分辨率
   * @param {*Number} rangeStartDate  时间戳、最左边请求的K线时间
   * @param {*Number} rangeEndDate  时间戳、最右边请求的K线时间
   * @param {*Function} onDataCallback  回调函数
   * @param {*Function} onErrorCallback  回调函数
   */
  getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
    const onLoadedCallback = data => {
      data && data.length ? onDataCallback(data, { 'noData': false }) : onDataCallback([], { 'noData': true })
    }
    this.self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback, firstDataRequest)
  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object} symbolInfo 商品信息
   * @param {*String} resolution 分辨率
   * @param {*Function} onRealtimeCallback 回调函数
   * @param {*String} subscriberUID 监听的唯一标识符
   * @param {*Function} onResetCacheNeededCallback (从1.7开始): 将在bars数据发生变化时执行
   */
  subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    this.self.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
  }

  /**
   * 取消订阅K线数据
   * @param {*String} subscriberUID 监听的唯一标识符
   */
  unsubscribeBars (subscriberUID) {
    this.self.unsubscribeBars(subscriberUID)
  }

  /**
   * 默认配置
   */
  defaultConfiguration () {
    return {
      'supported_resolutions': ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1440', '10080'],
      'supports_group_request': false,
      'supports_marks': true,
      'supports_search': false,
      'supports_timescale_marks': false
    }
  }

  /**
   * 默认商品信息
   */
  defaultSymbol (symbolName) {
    let _symbolName = symbolName?.replace('-', '')
    _symbolName = `${_symbolName} ${this.self.$t('perpetual')}`
    return {
      'name': 'btcusdt',
      'exchange-traded': '',
      'exchange-listed': 'Hoo',
      // 'timezone': jstz.jstz.determine().name(),
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': 1,
      'session': '0000-2400:1234567',
      'has_intraday': true,
      'has_no_volume': false,
      'volume_precision': 10000,
      'description': _symbolName.toUpperCase(),
      'type': 'bitcoin',
      'supported_resolutions': ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1440', '10080'],
      'pricescale': 10000,
      'ticker': _symbolName.toUpperCase()
    }
  }
}

export default datafeeds
