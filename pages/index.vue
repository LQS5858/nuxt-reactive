<template>
  <div>
    <Tutorial />
    <div>数量测试{{ $store.state.basic.count }}</div>
    <el-button type="primary"
               @click="addHandler">
      增加
    </el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {}
  },
  created () {
    this.$router.push('/demo')
  },
  methods: {
    // 参考官方文档
    ...mapMutations({
      add: 'basic/ADD_COUNT'
    }),
    addHandler () {
      let num = 1
      num += 1
      this.add(num)
      this.$router.push('/trade')
    }
  }
}
</script>
