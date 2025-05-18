<script>
import ViewshedHelper from './helper'

let helper

export default {
  name: 'ViewshedIndex',
  components: {
    BaseCard: () => import('../card.vue')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleDraw() {
      if (!helper) {
        helper = new ViewshedHelper(window.viewer)
      }
      helper.active()
    },
    handleClear() {
      helper?.clear()
    }
  }
}
</script>

<template>
  <BaseCard
    v-if="computedVisible"
    :visible.sync="computedVisible"
    width="460px"
    title="可视域分析"
    class-name="viewshed-container"
    show-close
  >
    <div style="text-align: center;">
      <el-button type="primary" size="small" @click="handleDraw">绘制</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">

</style>
