<script>
import BurstHandler from './BurstHandler'

let handler

export default {
  name: 'BurstSpecialEffects',
  data() {
    return {
      active: false
    }
  },
  methods: {
    handleDraw() {
      if (!handler) {
        handler = new BurstHandler(window.viewer)
      }
      handler.isActived ? handler.deactive() : handler.active()
      this.active = true
    },
    handleStop() {
      handler?.deactive()
      this.active = false
    },
    handleClear() {
      handler?.clear()
      this.active = false
    }
  }
}
</script>

<template>
  <div>
    <el-button v-if="!active" type="primary" size="small" @click="handleDraw">绘制</el-button>
    <el-button v-if="active" type="warning" size="small" @click="handleStop">停止</el-button>
    <el-button size="small" @click="handleClear">清空</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
