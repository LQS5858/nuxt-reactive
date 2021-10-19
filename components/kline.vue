<template>
  <div class="wrap">
    <div class="tv"
         id="tv-widget"></div>
  </div>
</template>

<script>
import datafees from '@/utils/datafees'
import jstz from 'jstz'

export default {
  name: 'tv-widget',
  head: {
    script: [
      {
        src: '/charting_library/charting_library.min.js'
      }
    ]
  },
  data () {
    return {
      datafees: new datafees(this),
    }
  },
  props: {
    /**
* @props {Object} -studies_overrides
*/
    studies_overrides: {
      type: Object,
      require: true
    },
    /**
     * 工具栏背景色
     */
    toolbar_bg: {
      type: String,
      default: '#00143A'
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
    /**@description
     * 语言 
     * @props {String} lang -语言，传入前需转化为tv的语言，Example:{zh,en,ko}
     */
    lang: {
      type: String,
      default: 'zh'
    },
    /**
    * @props {String} librayPath -静态文件路径
    */
    libraryPath: {
      type: String,
      default: '/charting_library/'
    },
    /**
    * @props {String} symbol -币对，EQ:btcusdt
    */
    symbol: {
      type: String,
      default: 'btcusdt'
    },
    /**
  * @props {String} resolution -默认值：[1,5,15,30]
  */
    resolutionType: {
      type: String,
      default: '15'
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
          // custom_css_url: this.customCssUrl,
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
    widgetReady () {
      console.log('widget 已准备好');
      this.widget?.onChartReady(() => {
        // this.setAverage()
        // if (this.showMacd) {
        //   this.createMacd()
        // }
        // this.showCacheStudy()
        console.log('widget 已准备好22');
        document.getElementById('tv-widget').childNodes[0].setAttribute('style', 'display:block;width:100%;height:100%;')
        this.eventEmit({ Event: 'widgetReady' })
        this.$emit('tvReady')
        // this.setResolution(this.resolutionType)
      })
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
    subscribeBars () { }
  },
  mounted () {
    this.initWidget()
  }
}
</script>

<style lang="scss">
.wrap {
  height: 300px;
  .tv {
    height: 100%;
  }
}
</style>