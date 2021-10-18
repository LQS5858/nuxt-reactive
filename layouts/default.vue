<template>
  <section>
    <div>布局页面</div>
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
</style>