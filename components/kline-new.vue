<template>
  <div class="tv-wrap pos-rel">
    <div class="bg"
         :style="{background:linearBg}"></div>
    <div id="tv-widget"></div>
  </div>
</template>

<script>
import datafees from '@/utils/datafees'
import jstz from 'jstz'
// import { StorageCache } from 'bt-tools'

export default {
  name: 'kline',
  data () {
    return {
      widget: null,
      loading: false,
      MACD: null,
      eventMap: {},
      datafees: new datafees(this),
      dataTo: null
    }
  },
  head: {
    script: [
      {
        src: '/charting_library/charting_library.min.js'
      }
    ]
  },
  props: {
    //是否展示macd
    showMacd: {
      type: Boolean,
      default: false
    },
    //设置精度方法
    setPricePrecision: {
      type: Function,
      default () {
        return () => { }
      }
    },
    // 数量精度
    to_fixed: {
      type: [Number, String],
      default: '1'
    },
    // 价格精度
    frm_fixed: {
      type: [Number, String],
      default: '1'
    },
    riseFallType: {
      type: String,
      default: 'normal'
    },
    //暗黑k线渐变色
    linearBg: {
      type: String,
      default: 'linear-gradient(180.24deg,rgba(19, 40, 57, 0.6) 0.2%, rgba(9, 18, 26, 0.05) 36.51%, rgba(2, 4, 5, 0.05) 99.8%)'
    },
    /**
     * 工具栏背景色
     */
    toolbar_bg: {
      type: String,
      default: '#00143A'
    },
    /**
 * @props {Object} -studies_overrides
 */
    studies_overrides: {
      type: Object,
      require: true
    },
    /**
     * @props {Object} -overrides
     */
    overrides: {
      type: Object,
      require: true
    },
    /**
     * @props {Array} -启用的配置
     */
    enabled_features: {
      type: Array,
      default () {
        return [
          'hide_last_na_study_output', //隐藏n/a
          'keep_left_toolbar_visible_on_small_screens', // 防止左侧工具栏在小屏幕下消失
          'side_toolbar_in_fullscreen_mode', // 全屏模式启用绘图工具
          'left_toobar'
          // 'study_templates',
          // 'hide_left_toolbar_by_default' // 左边工具栏
        ]
      }
    },
    /**
     * @props {Array} -静用的配置
     */
    disabled_features: {
      type: Array,
      default () {
        return [
          'header_widget', //隐藏头部组件
          'timezone_menu',
          'use_localstorage_for_settings',
          'header_symbol_search',
          'timeframes_toolbar',
          'volume_force_overlay', // k线和柱状图分离
          'header_saveload',
          // 'header_fullscreen_button', // 开启全屏
          'header_resolutions',
          // 'header_indicators', // 指标隐藏
          'header_compare',
          'header_screenshot',
          'adaptive_logo',
          // 'show_chart_property_page', //关闭禁用属性，开启会导致无法打开设置
          'context_menus', // 隐藏右键菜单
          // 'display_market_status',
          'symbol_search_hot_key',
          'header_chart_type',
          'header_undo_redo',
          'symbol_info',
          'go_to_date',
          'source_selection_markers', // 禁用k线选择后小标记
          // 'property_pages' // 禁用所有属性页,开启会导致无法打开设置
        ]
      }
    },
    /**
   * @props {String} resolution -默认值：[1,5,15,30]
   */
    resolutionType: {
      type: String,
      default: '15'
    },
    /**@description
     * 语言 
     * @props {String} lang -语言，传入前需转化为tv的语言，Example:{zh,en,ko}
     */
    lang: {
      type: String,
      default: 'zh'
    },
    /**
     * @props {String} symbol -币对，EQ:btcusdt
     */
    symbol: {
      type: String,
      default: 'btcusdt'
    },
    /**
     * @props {String} librayPath -静态文件路径
     */
    libraryPath: {
      type: String,
      default: '/charting_library/'
    },
    /**
     * @props {String} customCssUrl
     */
    customCssUrl: {
      type: String,
      default: '/charting_library/trading_chart-2.css'
    },
    /**
     * @props {String} theme -主题
     */
    theme: {
      type: String,
      default: 'dark'
    },
    /**
     * @props {Boolean} loading -控制显示loading
     */
  },
  watch: {
    riseFallType (val) {
      if (!val) return
      this.removeWidget()
      this.initWidget()
    },
    symbol (val) {
      if (!val) return
      const _symbol = val
      this.changeSymbol(_symbol)
    },
    resolutionType: {
      handler: function (val) {
        if (val) {
          this.setResolution(val)
        }
      },
      immediate: true,
      deep: true
    },
    lang (val) {
      if (!val) return
      if (this.widget) {
        this.removeWidget()
        this.initWidget()
      }

    },
    theme (val) {
      if (val) {
        if (this.widget) {
          this.removeWidget()
          this.initWidget()
        }
      }
    },
  },
  computed: {
    resolutionFormat () {
      if (this.resolutionType === 'time') {
        return '1'
      }
      return this.resolutionType
    }
  },
  methods: {
    changeSymbol (symbol) {
      this.widget?.setSymbol(symbol, this.resolutionType)
    },
    eventEmit (emit) {
      const { Event, Data } = emit || {}
      const callback = this.eventMap[Event]
      if (callback) callback(Data)
    },
    eventOn (name, callback) {
      this.eventMap[name] = callback
    },
    openIndictor () {
      if (this.widget) {
        this.widget?.chart()?.executeActionById('insertIndicator')
      } else {
        this.eventOn('widgetReady', () => {
          this.widget?.chart()?.executeActionById('insertIndicator')
        })
      }
    },

    openCamera () {
      if (this.widget) {
        this.widget?.takeScreenshot()
      } else {
        this.eventOn('widgetReady', () => {
          this.widget?.takeScreenshot()
        })
      }
    },
    openSetting () {
      if (this.widget && this.widget._ready) {
        this.widget.chart().executeActionById('chartProperties');
      } else {
        this.eventOn('widgetReady', () => {
          this.widget.chart().executeActionById('chartProperties');
        })
      }
    },
    setResolution (v) {
      // if (v === 'time') {
      //   // eslint-disable-next-line
      //   // this.widget?.chart().setResolution('1', e => {
      //   this.widget?.chart()?.setChartType(3)
      //   // })
      // } else {
      //   if (this.widget?.chart()?.resolution() === '1' && v === '1') {
      //     this.widget?.chart()?.setChartType(1)
      //   } else {
      //     this.widget?.chart()?.setResolution(v, () => {
      //       this.widget?.chart()?.setChartType(1)
      //     })
      //   }
      // }
      if (!(this.widget && this.widget.chart)) return
      if (v === 'time') {
        if (this.widget.chart().resolution() === '1') {
          this.widget.chart().setChartType(3)
        } else {
          this.widget.chart().setResolution('1', () => {
            this.widget.chart().setChartType(3)
          })
        }
      } else {
        if (this.widget.chart().resolution() === '1' && v === '1') {
          this.widget.chart().setChartType(1)
        } else {
          console.log('resol', v)
          this.widget.chart().setResolution(v, () => {
            this.widget.chart().setChartType(1)
          })
        }
      }

    },
    // eslint-disable-next-line
    subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
      this.$emit('subscribeBars', { resolution, onRealtimeCallback })
    },
    unsubscribeBars (subscriberUID) {
      this.$emit('unsubscribeBars', subscriberUID)
    },
    // eslint-disable-next-line
    async getBars (symbolInfo, resolution, from, to, onHistoryCallback, firstDataRequest) {
      this.$emit('getBars', { resolution, from, to, onHistoryCallback, firstDataRequest })
      // const params = {
      //   size: 360,
      //   t: "15Min",
      //   ticker_id: 1
      // }
      // this.loading = true
      // const [error, list] = await getKline(params, { showError: false })
      // this.loading = false
      // if (error) return onHistoryCallback([])
      // console.log('error', error, list);
      // this.dataTo = list?.[0]?.['timestamp']
      // let historyBar = list.map(item => {
      //   const { open, high, low, close, time } = item || {}
      //   return {
      //     time: time * 1000,
      //     open: +open, high: +high, low: +low, close: +close
      //   }
      // })
      // onHistoryCallback(historyBar)
    },
    removeWidget () {
      this.widget?.remove()
      this.widget = null
    },
    initWidget () {
      if (!this.widget) {
        // eslint-disable-next-line
        this.widget = new TradingView.widget({
          fullscreen: false,
          symbol: this.symbol,
          interval: this.resolutionFormat,
          debug: false,
          drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
          loading_screen: { backgroundColor: "#778ca2" }, //加载loading背景色
          timezone: jstz.determine().name(),
          container_id: 'tv-widget', // DOM id
          datafeed: this.datafees, // 配置 声明周期
          library_path: this.libraryPath, // 静态文件路径
          locale: this.lang, // 语言
          custom_css_url: this.customCssUrl,
          disabled_features: this.disabled_features,
          enabled_features: this.enabled_features,
          charts_storage_url: '//saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user',
          // toolbar_bg: '#18222B', // 工具栏底色
          toolbar_bg: this.toolbar_bg, // 工具栏底色
          studies_overrides: this.studies_overrides,
          overrides: this.overrides,

        })
        this.widgetReady()
      }
    },

    showCacheStudy () {
      const cacheStudy = localStorage.getItem('tvStudys')
      if (!cacheStudy) return
      console.info('取出缓存study', cacheStudy)
      if (!(cacheStudy && cacheStudy.length)) return
      cacheStudy.forEach(item => {
        if (['Volume', 'Moving Average', 'MACD'].includes(item.name)) return
        this.widget.chart().createStudy(item.name, false, false)
      })
    },
    saveStudys () {
      if (!this.widget) return
      let uniqeStudy = []
      let studys = this.widget.chart && this.widget.chart().getAllStudies()
      if (!studys.length) return
      while (studys.length) {
        const item = studys.shift()
        if (!item) break
        uniqeStudy.push(item)
      }
      localStorage.getItem('tvStudys', uniqeStudy, 0)
    },
    setAverage () {
      this.widget.chart().createStudy('Moving Average', false, false, [5], null, {
        'plot.color': '#9660c4',
        'plot.linewidth': 3
      })
      this.widget.chart().createStudy('Moving Average', false, false, [10], null, {
        'plot.color': '#84aad5',
        'plot.linewidth': 3
      })
      this.widget.chart().createStudy('Moving Average', false, false, [30], null, {
        'plot.color': '#55b263',
        'plot.linewidth': 3
      })
      this.widget.chart().createStudy('Moving Average', false, false, [60], null, {
        'plot.color': 'rgb(118,32,99)',
        'plot.linewidth': 2
      })
      // this.cStudy = this.widget.chart().getAllStudies()
    },
    createMacd () {
      this.widget
        .chart()
        .createStudy('MACD', false, false)
        .then(res => {
          this.MACD = res
        })
    },
    // 设置kline精度
    _setPricePrecision () {
      return this.setPricePrecision(this.frm_fixed)
    },
    //数量精度
    setVolumePrecision () {
      return this.setPricePrecision(this.to_fixed)
    },
    widgetReady () {
      this.widget?.onChartReady(() => {
        this.setAverage()
        if (this.showMacd) {
          this.createMacd()
        }
        this.showCacheStudy()
        document.getElementById('tv-widget').childNodes[0].setAttribute('style', 'display:block;width:100%;height:100%;')
        this.eventEmit({ Event: 'widgetReady' })
        this.$emit('tvReady')
        this.setResolution(this.resolutionType)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      const id = setTimeout(() => {
        this.initWidget()
        clearTimeout(id)
      }, 500);
    })
    window.onbeforeunload = () => {
      this.saveStudys()
    }
  }
}
</script>

<style lang="scss" scoped>
.tv-wrap {
  height: 100%;
  .bg {
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  #tv-widget {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>