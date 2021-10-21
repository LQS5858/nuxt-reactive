<template>
  <div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      screenSize: state => state.basic.screenSize
    }),
  },

  created () {
    this.jumpTo()
  },
  methods: {
    // 参考官方文档
    ...mapMutations({
      add: 'basic/ADD_COUNT'
    }),
    jumpTo () {
      this.$router.push('/pc/demo')
    },
    addHandler () {
      let num = 1
      num += 1
      this.add(num)
      this.$router.push('/trade')
    }
  }
}
</script>
