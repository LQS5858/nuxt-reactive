<template>
  <section>
    <div class="title">nuxt 服务端渲染DEMO调试</div>
    <nuxt></nuxt>
  </section>
</template>

<script>
import { wsUrl } from '@/config'
export default {
  name: 'd-layout',
  mounted () {
    this.$bus.init(wsUrl)
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>