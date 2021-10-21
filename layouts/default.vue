<template>
  <section>
    <div class="title">nuxt 服务端渲染DEMO调试</div>
    <nuxt></nuxt>
  </section>
</template>

<script>
import { wsUrl } from '@/config'
import _ from 'lodash'
import { setIsMobile } from '@/utils/setIsMobile'
export default {
  name: 'd-layout',
  watch: {
    '$store.state.basic.screenSize' (val) {
      if (!val) return
      this.redirectUrl(val)
    }
  },
  methods: {
    async redirectUrl (size) {
      const { fullPath } = this.$route || {}
      if (fullPath === '/') return
      let pathArr = fullPath.split('/')
      pathArr = pathArr.slice(2)
      let pathStr = pathArr.join('/')
      console.log('重定向路由>>>', pathArr, fullPath);
      if (size === 'h5' && fullPath.indexOf('pc') > 0) {
        const url = `/h5/${pathStr}`
        if (url === fullPath) return
        this.$router.replace(url)
        return
      }
      const url = `/pc/${pathStr}`
      if (url === fullPath) return
      this.$router.replace(url)
    },
    async setIsMobile () {
      setIsMobile(this.$store)
      window.addEventListener('resize', () => {
        setIsMobile(this.$store)
      })
    }
  },
  mounted () {
    this.setIsMobile()
    this.$bus.init(wsUrl)
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>