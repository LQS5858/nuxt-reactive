<template>
  <div class="wrap">
    store:{{ count }}
    <div>
      <el-button @click="changeCount">
        改变store
      </el-button>
    </div>
    <div class="label pos-rel">
      国际化{{ $t('text') }}
    </div>
    <el-button @click="changeLang">
      改变语言
    </el-button>
    <div>
      <img src="~assets/images/qr-prod.png"
           alt="">
    </div>
    <div>用户信息接口调试数据:{{userInfo}}</div>
    <div>订阅调试数据:{{ticker}}</div>
    <div>tradingview调试:
      <Kline></Kline>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { fetchProfile } from '@/apiServices/accountCenter'

export default {
  name: 'Demo',
  data () {
    return {
      userInfo: {},
      ticker: []
    }
  },
  components: { Kline: () => import('@/components/kline-view.vue') },
  computed: {
    ...mapState({
      count: state => state.basic.count
    })
  },
  methods: {
    // 参考官方文档
    ...mapMutations({
      add: 'basic/ADD_COUNT'
    }),
    changeLang () {
      if (this.$i18n.locale === 'zh') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
    },
    changeCount () {
      this.add(5)
    },
    async fetchProfile () {
      const data = await fetchProfile(this, true)
      console.log('用户信息>>>', data);
      this.userInfo = data
    },
    async subQuote () {
      const cmd = { "op": "sub", "topic": "quotes" }
      this.$bus.subscribe(cmd, data => {
        this.ticker = data
      })
    }
  },
  mounted () {
    this.fetchProfile()
    this.subQuote()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .label {
    color: $color;
  }
}
</style>
