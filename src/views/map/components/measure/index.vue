<script>
import MeasureHelper from './helper'
import { isNumber } from 'lodash'

const {
  Cartesian3,
  Cartographic,
  Math: CesiumMath
} = window.Cesium

let helper
export default {
  name: 'MeasureIndex',
  data() {
    return {
      measureType: null,
      longitude: null,
      latitude: null,
      height: 200
    }
  },
  mounted() {
    const position = window.viewer.scene.camera.position
    const cartographic = Cartographic.fromCartesian(position)
    this.longitude = CesiumMath.toDegrees(cartographic.longitude)
    this.latitude = CesiumMath.toDegrees(cartographic.latitude)
    this.height = cartographic.height
  },
  unmounted() {
    helper?.clear()
  },
  methods: {
    handleInput() {
      if (!helper) {
        helper = new MeasureHelper(window.viewer, {
          onStop: this.handleStop
        })
      }
      helper.active(this.measureType)
    },
    handleClear() {
      helper?.clear()
    },
    handleLocation() {
      if (isNumber(Number(this.longitude)) && isNumber(Number(this.latitude))) {
        window.viewer.scene.camera.flyTo({
          destination: Cartesian3.fromDegrees(Number(this.longitude), Number(this.latitude), this.height)
        })
      }
    },
    handleStop() {
      this.measureType = null
    }
  }
}
</script>

<template>
  <el-card
    class="map-card map-measure-container"
  >
    <el-form size="small" label-width="50px">
      <el-form-item label="类型">
        <div class="flex-content">
          <el-radio-group v-model="measureType" style="width:100%;" @input="handleInput">
            <el-radio-button label="distance">测距</el-radio-button>
            <el-radio-button label="area">测面</el-radio-button>
            <el-radio-button label="height">测高</el-radio-button>
          </el-radio-group>
          <el-button @click="handleClear">清除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="定位">
        <div class="flex-content">
          <div>
            <el-input v-model="longitude" placeholder="请输入经度" style="margin-bottom: 5px;">
              <template slot="prepend">经度</template>
            </el-input>
            <el-input v-model="latitude" placeholder="请输入纬度">
              <template slot="prepend">纬度</template>
            </el-input>
          </div>
          <div>
            <el-button @click="handleLocation">确定</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.map-measure-container {
  width: 400px;
  .flex-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
  }
  .el-form {
    .el-form-item:last-child {
      margin-bottom: 0;
    }
    ::v-deep {
      .el-form-item__label {
        color: #ffffff;
      }
    }
  }
  .el-radio-group {
    display: flex;
    justify-content: space-between;
    .el-radio-button {
      flex: 1;
      ::v-deep {
        .el-radio-button__inner {
          width: 100%;
        }
      }
    }
  }
}
</style>
