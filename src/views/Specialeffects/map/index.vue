<template>
  <!-- 控制框 -->
  <div class="kzk">
    <div>
      <el-button type="primary" @click="opents(1)">光照</el-button>
      <el-button type="primary" @click="opents(3)">云层</el-button>
      <el-button type="primary" @click="opents(4)">海洋</el-button>
      <el-button type="primary" @click="opents(5)">星空</el-button>
    </div>
    <div style="margin-top: 10px; display: flex; justify-content: space-evenly; align-items: center; flex-direction: column;">
      <div v-if="gzblshow" class="block">
        <span class="demonstration" style="margin-top: 5px;">光照比率：</span>
        <el-slider v-model="sunvalue" :max="24" style=" margin: 0 10px; " @change="change" />
        <!-- <span class="demonstration" style="margin-top: 5px;">光照</span> -->
      </div>
      <el-button style="width: 150px;" @click="opents(6)">关闭所有特效</el-button>
    </div>
  </div>
</template>

<script>
import OceanHelper from '@/views/map/components/ocean/helper'

let oceanHelper

export default {
  data() {
    return {
      sunvalue: 1,
      gzblshow: false
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
    yc() {
      if (window.viewer.scene.cloudBox) {
        window.viewer.scene.cloudBox = null
      } else {
        var cloudBox = new window.Cesium.CloudBox({
          url: '/image/clouds.png'
        })
        window.viewer.scene.cloudBox = cloudBox
      }

      // scene.cloudBox = null;
    },
    qygz() {
      if (window.viewer.scene.globe.enableLighting) {
        window.viewer.scene.globe.enableLighting = false// 启用全局光照
        window.viewer.scene.sun.show = false
        this.gzblshow = false
        this.sunvalue = 0
      } else {
        window.viewer.scene.globe.enableLighting = true// 启用全局光照
        window.viewer.scene.sun.show = true
        window.viewer.scene.shadowMap.enabled = true
        this.gzblshow = true
      }

      // var scene = window.viewer.scene
      // var Cesium = window.Cesium
      // // 01设置环境光的强度-新处理CBD场景
      // scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1)
      // // 添加光源
      // var position1 = new Cesium.Cartesian3.fromDegrees(99.261209157595, 39.3042238956531, 480)
      // // 光源方向点
      // var targetPosition1 = new Cesium.Cartesian3.fromDegrees(99.261209157595, 39.3042238956531, 430)
      // var dirLightOptions = {
      //   targetPosition: targetPosition1,
      //   color: new Cesium.Color(1.0, 0, 1.0, 1),
      //   intensity: 1.5
      // }
      // var directionalLight_1 = new window.Cesium.DirectionalLight(position1, dirLightOptions)
      // scene.addLightSource(directionalLight_1)
    },
    qyshadow() {
      // 切换到2D模式
      // viewer.scene.mode = Cesium.SceneMode.SCENE2D;
      console.log(123123, window.viewer.scene)
      // 切换到3D模式
      window.viewer.scene.mode = window.Cesium.SceneMode.SCENE3D
      // 平滑过渡到3D模式
      window.viewer.scene.morphTo3D(1.5)
      // 启用阴影
      // viewer.shadows = true;
      window.viewer.scene.shadowMap.enabled = true
      // 使地形接收阴影
      // viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
      // // 动态大气光照(增强阴影效果)
      // viewer.scene.globe.dynamicAtmosphereLighting = true;
    },
    skyBox() {
      // 关闭星空
      window.viewer.scene.skyBox.show = !window.viewer.scene.skyBox.show
    },
    closeAll() {
      oceanHelper?.clear()
      window.viewer.scene.skyBox.show = false
      window.viewer.scene.globe.enableLighting = false// 启用全局光照
      window.viewer.scene.sun.show = false
      window.viewer.scene.cloudBox = null
      this.gzblshow = false
      this.sunvalue = 0
    },
    opents(name) {
      switch (name) {
        case 1:
          this.qygz()
          break
        case 2:
          this.qyshadow()
          break
        case 3:
          this.yc()
          break
        case 4:
          if (!oceanHelper) {
            oceanHelper = new OceanHelper(window.viewer)
          }
          oceanHelper.isActived ? oceanHelper.deactivate() : oceanHelper.active()
          break
        case 5:
          this.skyBox()
          break
        case 6:
          this.closeAll()
          break
        default:
          break
      }
    },
    change() {
      console.log('光值', this.sunvalue)

      // window.viewer.scene.light = parseFloat(this.sunvalue / 100)
      // window.viewer.scene.sun.glowFactor = this.sunvalue / 100
      // window.viewer.scene.light.intensity = this.sunvalue / 100
      var num = ''
      if (this.sunvalue < 10) {
        num = '0' + this.sunvalue
      } else {
        num = '' + this.sunvalue
      }
      var time = '2023-05-17T' + num + ':00:00Z'
      var newTime = window.Cesium.JulianDate.fromIso8601(time)
      window.viewer.clock.currentTime = newTime
      // window.viewer.scene.globe.lightingFadeInDistance = 80000 + this.sunvalue * 80000
      // window.viewer.scene.globe.lightingFadeOutDistance = 100000 + this.sunvalue * 150000

      // if(this.sunvalue>50){
      //   window.viewer.scene.globe.lightingFadeInDistance = 15000000
      // }else {
      //   window.viewer.scene.globe.lightingFadeInDistance = 0
      // }
    }
  }

}
</script>

<style scoped lang="scss">
.kzk{
  // position: absolute;
  top: 80px;
  left: 10px;
  min-height: 150px;
  width: 400px;
  background: rgba(94, 94, 94, 0.781);
  padding: 10px;
  border-radius: 5px;
  color: white;
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;

  >div{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-evenly;
  }
}

.block{
  width: 100%;
  // display: flex;
  // align-content: center;
  // justify-content: space-evenly;
  // flex-direction: row;
  margin: 10px 0;
}
</style>
