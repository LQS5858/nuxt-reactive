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
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Demo',
  data () {
    return {
    }
  },
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
    }
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
