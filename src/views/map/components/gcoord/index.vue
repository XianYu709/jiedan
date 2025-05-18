<script>
import gcoord from 'gcoord'

export default {
  name: 'GcoordIndex',
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
      source: null,
      sourceCoord: gcoord.WGS84,
      targetCoord: gcoord.WGS84,
      targetResult: null,
      coords: [
        { label: 'EPSG4326 WGS84', value: gcoord.WGS84 },
        { label: 'EPSG3857 Web墨卡托', value: gcoord.WebMercator },
        { label: 'CGCS2000', value: gcoord.EPSG4326 },
        { label: 'GCJ02', value: gcoord.GCJ02 }
      ]
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
          const result = this.source.split(';').map(item => {
            const arr = item.split(',')
            // return [Number(arr[0]), Number(arr[1])]
            const coordinates = gcoord.transform([Number(arr[0]), Number(arr[1])], this.sourceCoord, this.targetCoord)
            return coordinates.join(',')
          }).join(';')
          // const result = gcoord.transform(coordinates, this.sourceCoord, this.targetCoord)
          // let str = ''
          // result.forEach((item, index) => {
          //   str += item + (index < result.length - 1 ? (index % 2 === 0 ? ',' : ';') : '')
          // })
          this.targetResult = result
          console.log('coordinates1 =', result)
          // console.log('coordinates2 =', gcoord.transform([105.00000000000001,29.8,105.00000000000001,29.8]))
        } catch (e) {
          this.$message.error('格式有误')
        }
      }
    }
  }
}
</script>

<template>
  <BaseCard
    v-if="computedVisible"
    :visible.sync="computedVisible"
    width="460px"
    title="坐标系转换"
    class-name="gcoord-container"
    show-close
  >
    <div>
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
  </BaseCard>
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
