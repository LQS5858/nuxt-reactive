<template>
  <section class="wrap">
    <Kline :studies_overrides="studies_overrides"
           @getBars="getBarsHandler"
           :overrides="overrides"></Kline>
  </section>
</template>

<script>
import {
  enabled_features,
  disabled_features,
  h5_disabled_features,
  candleStyleNormal,
  candleStyleReverse,
  darkOverrides,
  lightOverrides,
  getStudies_overrides, getOverrides,
  darkStudies_overrides_normal,
  darkStudies_overrides_reverse,
} from '@/config/kline'
export default {
  name: 'kline-view',
  data () {
    return {
      riseFallType: 'normal'
    }
  },
  components: {
    Kline: () => import('./kline-new.vue')
  },
  computed: {
    overrides () {
      const type = this.riseFallType
      const candleStyle = type === 'normal' ? candleStyleNormal : candleStyleReverse
      if (this.theme === 'dark') {
        const obj = getOverrides(darkOverrides)
        return {
          ...obj,
          ...candleStyle
        }
      }
      const obj = getOverrides(lightOverrides)
      return {
        ...obj,
        ...candleStyle
      }
    },
    studies_overrides () {
      if (this.riseFallType === 'normal') {
        return getStudies_overrides(darkStudies_overrides_normal)
      }
      return getStudies_overrides(darkStudies_overrides_reverse)
    },
  },
  methods: {
    getBarsHandler (obj) {
      let { onHistoryCallback, resolution, firstDataRequest } = obj || {}
      return onHistoryCallback([], { noData: true })
    }

  }
}
</script>

<style lang="scss" scoped>
.wrap {
  height: 300px;
}
</style>