<script>
import RollerShutter from "./plugins/RollerShutter";
import Pyramid from "./plugins/Pyramid";
import FireworksHandler from "./components/specialEffects/FireworksHandler";
import BurstHandler from "./components/specialEffects/BurstHandler";

let rollerShutter, fireworksHandler, burstHandler;

export default {
  name: "MapIndex",
  components: {
    Header: () => import("./header.vue"),
    BaseMap: () => import("./base-map.vue"),
    Layers: () => import("./layers.vue"),
    basePlotting: () => import("../plotting/basePlotting"),
    jsPlotting: () => import("../plotting/militaryPlotting"),
    hjtx: () => import("../Specialeffects/enviroment"),
    dttx: () => import("../Specialeffects/map"),
    Buffer: () => import("./components/buffer"),
    // Slopedirection: () => import('../space/Slopedirection'),
    // Cutfill: () => import('../space/CutFill')
    Measure: () => import("./components/measure"),
    InterVisibility: () => import("./components/interVisibility"),
    Excavation: () => import("./components/excavation"),
    Slope: () => import("./components/slope"),
    ThreeDDraw: () => import("./components/3dDraw"),
    ViewshedIndex: () => import("./components/viewshed"),
    GcoordIndex: () => import("./components/gcoord"),
    UdpIndex: () => import("./components/udp"),
    Profile: () => import("./components/profile"),
  },
  data() {
    return {
      getViewer: null,
      showbasePlotting: false,
      showjsPlotting: false,
      showhjtx: false,
      showdttx: false,
      bufferVisible: false,
      measureVisible: false,
      threeDrawVisible: false,
      viewshedVisible: false,
      gcoordVisible: false,
      interVisibility: false,
      pdpxVisible: false,
      udpVisible: false,
      twfVisible: false,
      profileVisible: false,
    };
  },
  methods: {
    handleComplete(viewer) {
      window.viewer = viewer;
      this.getViewer = () => viewer;
    },
    handleMenuClick(name) {
      console.log(8888);
      const viewer = window.viewer;
      if (!viewer) return false;
      switch (name) {
        case "jcbh":
          this.showbasePlotting = !this.showbasePlotting;
          break;
        case "jsbh":
          this.showjsPlotting = !this.showjsPlotting;
          break;
        case "hjtx":
          this.showhjtx = !this.showhjtx;
          break;
        case "ddtx":
          this.showdttx = !this.showdttx;
          break;
        case "rollerShutter":
          if (!rollerShutter) {
            rollerShutter = new RollerShutter(viewer);
          }
          rollerShutter.isOpened ? rollerShutter.close() : rollerShutter.open();
          break;
        case "buffer":
          this.bufferVisible = !this.bufferVisible;
          break;
        case "measure":
          this.measureVisible = !this.measureVisible;
          break;
        case "fireworks":
          if (!fireworksHandler) {
            fireworksHandler = new FireworksHandler(viewer);
          }
          fireworksHandler.isActived
            ? fireworksHandler.clear()
            : fireworksHandler.active();
          break;
        case "burst":
          if (!burstHandler) {
            burstHandler = new BurstHandler(viewer);
          }
          burstHandler.isActived ? burstHandler.clear() : burstHandler.active();
          break;
        case "pyramid":
          new Pyramid(viewer);
          break;
        case "test":
          this.udpVisible = !this.udpVisible;
          break;
        case "3dDraw":
          this.threeDrawVisible = !this.threeDrawVisible;
          break;
        case "viewshed":
          this.viewshedVisible = !this.viewshedVisible;
          break;
        case "gcoord":
          this.gcoordVisible = !this.gcoordVisible;
          break;
        case "interVisibility":
          this.interVisibility = !this.interVisibility;
          break;
        case "pdpx":
          this.pdpxVisible = !this.pdpxVisible;
          break;
        case "profile":
          this.profileVisible = !this.profileVisible;
          break;
        case "twf":
          this.twfVisible = !this.twfVisible;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<template>
  <div class="map-container">
    <Header :get-viewer="getViewer" @click="handleMenuClick" />
    <BaseMap @complete="handleComplete" />
    <Layers :get-viewer="getViewer" />
    <basePlotting v-if="showbasePlotting" />
    <jsPlotting v-if="showjsPlotting" />
    <hjtx v-if="showhjtx" />
    <dttx v-if="showdttx" />
    <Buffer v-if="bufferVisible" />
    <Measure v-if="measureVisible" />
    <UdpIndex v-if="udpVisible" />
    <!-- <Slopedirection v-if="showdtwf" />
    <Cutfill v-if="showpdpx" /> -->
    <ThreeDDraw :visible.sync="threeDrawVisible" />
    <ViewshedIndex :visible.sync="viewshedVisible" />
    <InterVisibility :visible.sync="interVisibility" />
    <Excavation :visible.sync="twfVisible" />
    <Slope :visible.sync="pdpxVisible" />
    <Profile :visible.sync="profileVisible" />
    <GcoordIndex :visible.sync="gcoordVisible" />
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
