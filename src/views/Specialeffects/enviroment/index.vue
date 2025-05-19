<template>
  <!-- 控制框 -->
  <div class="kzk">
    <div class="top">
      <el-button type="primary" @click="opents(1)">雨</el-button>
      <el-button type="primary" @click="opents(2)">雪</el-button>
      <el-button type="primary" @click="opents(3)">雾</el-button>
      <el-button type="primary" @click="opents(4)">风</el-button>
    </div>
    <div>
      <div v-show="rainshow" class="block" >
        <span class="demonstration">雨强度</span>
        <el-slider v-model="rainvalue" @change="change(1)" />
      </div>
      <div v-show="snowshow" class="block">
        <span class="demonstration">雪强度</span>
        <el-slider v-model="snowvalue" @change="change(2)" />
      </div>
      <div v-show="fogshow" class="block">
        <span class="demonstration">雾强度</span>
        <el-slider v-model="fogvalue" @change="change(3)" />
      </div>
      <div v-show="windshow" class="block">
        <span class="demonstration">风强度</span>
        <el-slider v-model="windvalue" @change="change(4)" />
      </div>
    </div>
    <el-button @click="opents(5)">关闭所有特效</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rainshow: false,
      snowshow: false,
      fogshow: false,
      windshow: false,
      rainvalue: 1,
      snowvalue: 1,
      fogvalue: 1,
      windvalue: 1
    }
  },
  beforeDestroy() {
    // 组件即将销毁时调用
    this.closeAll()
  },
  unmounted() {
    this.closeAll()
  },
  methods: {
    snow() {
      this.snowshow = !this.snowshow
      window.viewer.scene.postProcessStages.snow.enabled = !window.viewer.scene.postProcessStages.snow.enabled
      // window.viewer.scene.postProcessStages.snow.uniforms.density = 10;
      window.viewer.scene.postProcessStages.snow.uniforms.angle = 0
      window.viewer.scene.postProcessStages.snow.uniforms.speed = 1
    },
    rain() {
      this.rainshow = !this.rainshow
      window.viewer.scene.postProcessStages.rain.enabled = !window.viewer.scene.postProcessStages.rain.enabled
      window.viewer.scene.postProcessStages.rain.uniforms.angle = 6
      window.viewer.scene.postProcessStages.rain.uniforms.speed = 1
    },
    fog() {
      this.fogshow = !this.fogshow
      // 地表雾
      window.viewer.scene.fog.enabled = !window.viewer.scene.fog.enabled// 启用雾效
      window.viewer.scene.fog.density = 0.00003// 设置雾的密度
    },
    wind() {
      this.windshow = !this.windshow
      console.log('风')
      window.viewer.scene.postProcessStages.rain.uniforms.angle = 150
      // window.viewer.scene.postProcessStages.rain.uniforms.speed = 20
      window.viewer.scene.postProcessStages.snow.uniforms.angle = 150
      // window.viewer.scene.postProcessStages.snow.uniforms.speed = 10
    },
    closeAll() {
      window.viewer.scene.postProcessStages.rain.enabled = false
      window.viewer.scene.postProcessStages.snow.enabled = false
      window.viewer.scene.fog.enabled = false// 启用雾效
      this.rainvalue = 1
      this.snowvalue = 1
      this.fogvalue = 1
      this.windvalue = 1
      this.rainshow = false
      this.snowshow = false
      this.fogshow = false
      this.windshow = false
    },
    opents(name) {
      switch (name) {
        case 1:
          this.rain()
          break
        case 2:
          this.snow()
          break
        case 3:
          this.fog()
          break
        case 4:
          this.wind()
          break
        case 5:
          this.closeAll()
          break
        default:
          break
      }
    },
    change(val) {
      switch (val) {
        case 1:
          // 雨的强度
          window.viewer.scene.postProcessStages.rain.uniforms.speed = this.rainvalue / 10
          break
        case 2:
          // 雪的强度
          window.viewer.scene.postProcessStages.snow.uniforms.speed = this.snowvalue / 10
          break
        case 3:
          // 雾的密度
          window.viewer.scene.fog.density = this.fogvalue / 100000// 设置雾的密度
          break
        case 4:
          // 风的强度
          window.viewer.scene.postProcessStages.rain.uniforms.angle = 156.9 - (this.windvalue / 100)
          window.viewer.scene.postProcessStages.snow.uniforms.angle = 158.5 - (this.windvalue / 100)
          break

        default:
          break
      }
    }
  }

}
</script>

<style scoped lang="scss">

.kzk{
  // position: absolute;
  // top: 320px;
  left: 10px;
  min-height: 160px;
  max-height: 400px;
  width: 400px;
  background: rgba(94, 94, 94, 0.781);
  padding: 10px;
  border-radius: 5px;
  color: white;
  z-index: 999;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 20px 40px;

  .top{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}

.block{
  margin: 3px 0;
}
</style>
