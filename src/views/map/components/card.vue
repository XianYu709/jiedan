<script>
export default {
  name: 'MapCard',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: null
    },
    top: {
      type: String,
      default: '80px'
    },
    left: {
      type: String,
      default: '15px'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: 'auto'
    },
    title: {
      type: String,
      default: null
    },
    showClose: {
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
    },
    computedStyle() {
      return `top: ${this.top};left:${this.left};width:${this.width};height:${this.height};`
    }
  },
  methods: {
    handleClose() {
      this.computedVisible = false
      this.$emit('close')
    }
  }
}
</script>

<template>
  <el-card
    :style="computedStyle"
    :class="['map-card-container', className]"
  >
    <div v-if="title || showClose" slot="header" class="header">
      <span v-if="title">{{ title }}</span>
      <i v-if="showClose" style="cursor:pointer;" class="el-icon-close" @click="handleClose" />
    </div>
    <slot />
  </el-card>
</template>

<style scoped lang="scss">
.map-card-container {
  position: absolute;
  top: 80px;
  left: 15px;
  width: 300px;
  max-height: 760px;
  border: 1px solid #444;
  background-color: rgba(38, 38, 38, 0.75);
  color: white;
  overflow: auto;
  ::v-deep {
    .el-card__header,
    .el-card__body {
      padding: 15px;
      color: #a5a5a5;
    }
    .el-card__header {
      border-bottom: 1px solid #a5a5a5;
    }
    .map-card-form {
      margin-bottom: -18px;
      .el-form-item__label {
        color: #a5a5a5;
      }
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
