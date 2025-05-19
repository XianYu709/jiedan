<script>
import RollerShutter from './plugins/RollerShutter'
import FireworksHandler from './components/specialEffects/FireworksHandler'
import BurstHandler from './components/specialEffects/BurstHandler'
import MilitaryPlottingHelper from '@/views/plotting/militaryPlotting/helper'

let rollerShutterHandler, fireworksHandler, burstHandler, militaryPlottingHelper

export default {
  name: "MapIndex",
  components: {
    Header: () => import("./header.vue"),
    BaseMap: () => import("./base-map.vue"),
    Layers: () => import("./layers.vue"),
    basePlotting: () => import("../plotting/basePlotting"),
    jsPlotting: () => import("../plotting/militaryPlotting"),
    military: () => import("../plotting/military"),
    collect: () => import("../plotting/collect"),
    hjtx: () => import("../Specialeffects/enviroment"),
    dttx: () => import("../Specialeffects/map"),
    Buffer: () => import("./components/buffer"),
    // Slopedirection: () => import('../space/Slopedirection'),
    // Cutfill: () => import('../space/CutFill')
    Measure: () => import("./components/measure"),
    ThreeDDraw: () => import("./components/3dDraw"),
    GcoordIndex: () => import("./components/gcoord"),
    BaseCard: () => import("./components/card.vue"),
    UdpIndex: () => import("./components/udp"),
    InterVisibility: () => import("./components/interVisibility"),
    Excavation: () => import("./components/excavation"),
    Slope: () => import("./components/slope"),
    ViewshedIndex: () => import("./components/viewshed"),
    Profile: () => import("./components/profile"),
  },
  data() {
    return {
      getViewer: null,
      activeMenu: null,
      activeCode: "index",
    };
  },
  methods: {
    handleComplete(viewer) {
      window.viewer = viewer;
      this.getViewer = () => viewer;
    },
    handleMenuClick(menu) {
      const viewer = window.viewer;
      if (!viewer) return false;
      switch (menu.code) {
        // 标绘
        case 'jsPlotting':
          if (!militaryPlottingHelper) {
            militaryPlottingHelper = new MilitaryPlottingHelper(viewer)
          }
          militaryPlottingHelper.isActived ? militaryPlottingHelper.deactivate() : militaryPlottingHelper.active()
          break
        // 卷帘
        case "rollerShutter":
          if (!rollerShutterHandler) {
            rollerShutterHandler = new RollerShutter(viewer);
          }
          rollerShutterHandler.isOpened
            ? rollerShutterHandler.close()
            : rollerShutterHandler.open();
          break;
        // 烟火
        case "fireworks":
          if (!fireworksHandler) {
            fireworksHandler = new FireworksHandler(viewer);
          }
          fireworksHandler.isActived
            ? fireworksHandler.clear()
            : fireworksHandler.active();
          break;
        // 爆炸
        case "burst":
          if (!burstHandler) {
            burstHandler = new BurstHandler(viewer);
          }
          burstHandler.isActived ? burstHandler.clear() : burstHandler.active();
          break;
        default:
          rollerShutterHandler?.close();
          fireworksHandler?.clear();
          burstHandler?.clear();
      }
      this.activeMenu = menu
    },
    handleCardClose() {
      this.activeMenu = null;
      this.activeCode = "index";
    },
  },
};
</script>

<template>
  <div class="map-container">
    <Header
      :active-code.sync="activeCode"
      :get-viewer="getViewer"
      @click="handleMenuClick"
    />
    <BaseMap @complete="handleComplete" />
    <Layers :get-viewer="getViewer" />
    <BaseCard
      v-if="activeMenu && activeMenu.componentName"
      :title="activeMenu.label"
      v-bind="activeMenu.cardOptions"
      show-close
      @close="handleCardClose"
    >
      <component :is="activeMenu.componentName" :get-viewer="getViewer" />
    </BaseCard>
  </div>
</template>

<style lang="scss">
@import "./map.scss";
</style>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
</style>
