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
  data() {
    return {
      formInline: {
        way: 0,
        flip: 0,
        range: 0,
        level: 0,
        vertical: 0,
        vis: '#FF0000',
        invisible: '#00FF00'
      }
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
      <el-form label-position="right" label-width="130px" :model="formInline">
        <el-form-item label="方向(度): ">
          <el-slider v-model="formInline.way"/>
        </el-form-item>
        <el-form-item label="翻转(度): ">
          <el-slider v-model="formInline.flip"/>
        </el-form-item>
        <el-form-item label="距离(米): ">
          <el-slider v-model="formInline.range"/>
        </el-form-item>
        <el-form-item label="水平视场角(度): ">
          <el-slider v-model="formInline.level"/>
        </el-form-item>
        <el-form-item label="垂直视场角(度): ">
          <el-slider v-model="formInline.vertical"/>
        </el-form-item>
        <el-form-item label="可见区域颜色: ">
          <el-color-picker v-model="formInline.vis" style="margin-left: -260px;"/>
        </el-form-item>
        <el-form-item label="不可见区域颜色: ">
          <el-color-picker v-model="formInline.invisible" style="margin-left: -260px;"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="handleDraw">绘制</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">

</style>
