<script>
import ThreeDDrawHelper from './helper'

let helper

export default {
  name: 'ThreeDDrawIndex',
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
      drawType: 'text',
      drawText: null,
      drawModes: [...window.MAP_CONFIG.drawModels],
      drawModel: null
    }
  },
  computed: {
    imagePathList() {
      return this.drawModes.map(item => item.imagePath)
    },
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
    handleModelSelected(model) {
      this.drawModel = model
    },
    handleDraw() {
      const drawType = this.drawType
      const drawText = this.drawText
      const drawModel = this.drawModel
      if (drawType === 'text' && !drawText) {
        this.$message.error('请输入文字')
        return false
      } else if (drawType === 'model' && !drawModel) {
        this.$message.error('请选择模型')
        return false
      }
      if (!helper) {
        helper = new ThreeDDrawHelper(window.viewer)
      }
      helper.active({ type: drawType, text: drawText, model: drawModel })
    },
    handleClear() {
      this.drawModel = null
      helper?.clear()
    }
  }
}
</script>

<template>
  <div class="threed-container">
    <el-form size="small" label-width="50px" class="map-card-form">
      <el-form-item label="类型">
        <el-radio-group v-model="drawType" style="width:100%;">
          <el-radio-button label="text">文字</el-radio-button>
          <el-radio-button label="model">模型</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="drawType === 'text'" label="文本">
        <el-input v-model="drawText" clearable placeholder="请输入文字" style="width:250px;" />
      </el-form-item>
      <el-form-item v-show="drawType === 'model'" label="模型">
        <div class="model-content">
          <div
            v-for="item in drawModes"
            :key="item.name"
            :title="item.name"
            :class="['model-card', item === drawModel ? 'selected' : '']"
            @click="() => handleModelSelected(item)"
          >
            <el-image
              style="width:120px;height:80px;"
              fit="cover"
              :src="item.imagePath"
            />
            <div class="model-card__bottom">
              {{ item.name }}
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" size="small" @click="handleDraw">标绘</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.threed-container {
  .map-card-form {
    margin-bottom: 18px !important;
  }
}
.model-content {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  .model-card {
    position: relative;
    width: 120px;
    height: 80px;
    overflow: hidden;
    &.selected {
      &:after {
        bottom: 0;
        right: 0;
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 28px solid #4487f7;
        border-left: 28px solid transparent;
      }
      &:before {
        content: "";
        position: absolute;
        width: 10px;
        height: 6px;
        background: transparent;
        bottom: 8px;
        right: 3px;
        border: 2px solid white;
        border-top: none;
        border-right: none;
        transform: rotate(-55deg);
        z-index: 9;
      }
    }
    &__bottom {
      position: absolute;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      bottom: 0;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
