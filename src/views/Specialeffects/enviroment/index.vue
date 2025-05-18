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
      <div class="block">
        <span class="demonstration">雨强度</span>
        <el-slider v-model="rainvalue" @change="change(1)" />
      </div>
      <div class="block">
        <span class="demonstration">雪强度</span>
        <el-slider v-model="showvalue" @change="change(2)" />
      </div>
      <div class="block">
        <span class="demonstration">雾强度</span>
        <el-slider v-model="wwvalue" @change="change(3)" />
      </div>
      <div class="block">
        <span class="demonstration">风强度</span>
        <el-slider v-model="fengvalue" @change="change(4)" />
      </div>
    </div>
    <el-button @click="opents(5)">关闭所有特效</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rainvalue: 1,
      showvalue: 1,
      wwvalue: 1,
      fengvalue: 1
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
      window.viewer.scene.postProcessStages.snow.enabled = true
      // window.viewer.scene.postProcessStages.snow.uniforms.density = 10;
      window.viewer.scene.postProcessStages.snow.uniforms.angle = 0
      // window.viewer.scene.postProcessStages.snow.uniforms.speed = 3
    },
    rain() {
      window.viewer.scene.postProcessStages.rain.enabled = true
      window.viewer.scene.postProcessStages.rain.uniforms.angle = 6
      // window.viewer.scene.postProcessStages.rain.uniforms.speed = 6
    },
    ww() {
      console.log('wwww')
      // 地表雾
      window.viewer.scene.fog.enabled = true// 启用雾效
      window.viewer.scene.fog.density = 0.00003// 设置雾的密度
    },
    feng() {
      console.log('风')
      window.viewer.scene.postProcessStages.rain.uniforms.angle = 150
      window.viewer.scene.postProcessStages.rain.uniforms.speed = 20
      window.viewer.scene.postProcessStages.snow.uniforms.angle = 150
      window.viewer.scene.postProcessStages.snow.uniforms.speed = 10
    },
    closeAll() {
      window.viewer.scene.postProcessStages.rain.enabled = false
      window.viewer.scene.postProcessStages.snow.enabled = false
      window.viewer.scene.fog.enabled = false// 启用雾效
      this.rainvalue = 1
      this.showvalue = 1
      this.wwvalue = 1
      this.fengvalue = 1
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
          this.ww()
          break
        case 4:
          this.feng()
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
          window.viewer.scene.postProcessStages.rain.uniforms.speed = this.rainvalue
          break
        case 2:
          // 雪的强度
          window.viewer.scene.postProcessStages.snow.uniforms.speed = this.showvalue
          break
        case 3:
          // 雾的密度
          window.viewer.scene.fog.density = this.wwvalue / 100000// 设置雾的密度
          break
        case 4:
          // 风的强度
          window.viewer.scene.postProcessStages.rain.uniforms.angle = 156.9 - (this.fengvalue / 100)
          window.viewer.scene.postProcessStages.snow.uniforms.angle = 158.5 - (this.fengvalue / 100)
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
  position: absolute;
  top: 280px;
  left: 10px;
  height: 400px;
  width: 320px;
  background: rgba(94, 94, 94, 0.781);
  padding: 10px;
  border-radius: 5px;
  color: white;
  z-index: 999;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;

  .top{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
