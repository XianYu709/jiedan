<script>
import gcoord from 'gcoord'

export default {
  name: 'GcoordIndex',
  data() {
    return {
      visible: true,
      source: null,
      sourceCoord: gcoord.WGS84,
      targetCoord: gcoord.WGS84,
      targetResult: null,
      coords: [
        { label: 'EPSG4326 WGS84', value: 'WGS84' },
        { label: 'EPSG3857 Web墨卡托', value: 'WebMercator' },
        { label: 'CGCS2000', value: 'EPSG4326' },
        { label: 'GCJ02', value: 'GCJ02' }
      ]
    }
  },
  mounted() {
    const {
      Cartographic,
      Math: CesiumMath
    } = window.Cesium
    const position = window.viewer.scene.camera.position
    const cartographic = Cartographic.fromCartesian(position)
    const longitude = CesiumMath.toDegrees(cartographic.longitude)
    const latitude = CesiumMath.toDegrees(cartographic.latitude)
    this.source = `${longitude},${latitude}`
  },
  methods: {
    handleTransform() {
      if (!this.sourceCoord) {
        this.$message.warning('请选择原坐标系')
        return false
      }
      if (!this.targetCoord) {
        this.$message.warning('请选择目标坐标系')
        return false
      }
      this.targetResult = null
      if (this.source) {
        try {
          const sourceCoord = gcoord[this.sourceCoord]
          const targetCoord = gcoord[this.targetCoord]
          const result = this.source.split(';').map(item => {
            const arr = item.split(',')
            const coordinates = gcoord.transform([Number(arr[0]), Number(arr[1])], sourceCoord, targetCoord)
            return coordinates.join(',')
          }).join(';')
          this.targetResult = result
        } catch (e) {
          this.$message.error('格式有误')
        }
      }
    }
  }
}
</script>

<template>
<!--  <BaseCard
    :visible.sync="visible"
    width="460px"
    title="坐标系转换"
    class-name="gcoord-container"
    show-close
  >
  </BaseCard>-->
  <div class="gcoord-container">
    <div class="row-item">
      <el-input
        v-model="source"
        type="textarea"
        :rows="3"
        size="small"
        placeholder="请输入浮点数经纬度坐标，经度在前，纬度在后，使用英文逗号分隔。批量转换时坐标间使用英文分号分隔。"
      />
    </div>
    <div class="row-item toolbar">
      <el-select v-model="sourceCoord" size="small" placeholder="请选择原坐标系">
        <el-option v-for="item in coords" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <span class="span">转为</span>
      <el-select v-model="targetCoord" size="small" placeholder="请选择目标标系">
        <el-option v-for="item in coords" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" size="small" @click="handleTransform">开始转换</el-button>
    </div>
    <div class="row-item">
      <el-input
        v-model="targetResult"
        type="textarea"
        :rows="3"
        size="small"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gcoord-container {
  .row-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    .span {
      font-size: 14px;
      width: 45px;
    }
  }
}
</style>
