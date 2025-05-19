<script>
export default {
  name: "ProfileIndex",
  components: {
    BaseCard: () => import("../card.vue"),
  },
  watch: {
    open(val) {
      this.open = val;
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      canvasRef: null,
      open: false,
      proRef: null,
      handlerLine: null,
    };
  },
  mounted() {
    // 获取DOM引用
    this.canvasRef = this.$refs.canvasRef;
    this.proRef = this.$refs.proRef;
  },
  methods: {
    chooseView() {
      this.open = true;
      var profile = new Cesium.Profile(viewer.scene);
      this.handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);

      this.handlerLine.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
        } else {
          viewer.enableCursorStyle = true;
        }
      });

      this.handlerLine.drawEvt.addEventListener((result) => {
        var line = result.object;
        if (line.positions.length < 2) {
          return;
        }
        var startPoint = line.positions[0];
        var endPoint = line.positions[1];

        var scarToGraphic = Cesium.Cartographic.fromCartesian(startPoint);
        var sLongitude = Cesium.Math.toDegrees(scarToGraphic.longitude);
        var sLatitude = Cesium.Math.toDegrees(scarToGraphic.latitude);
        var sHeight = scarToGraphic.height;

        var eCartographic = Cesium.Cartographic.fromCartesian(endPoint);
        var eLongitude = Cesium.Math.toDegrees(eCartographic.longitude);
        var eLatitude = Cesium.Math.toDegrees(eCartographic.latitude);
        var eHeight = eCartographic.height;

        // 设置坡面分析的开始和结束位置
        profile.startPoint = [sLongitude, sLatitude, sHeight];
        profile.endPoint = [eLongitude, eLatitude, eHeight];

        profile.extendHeight = 40;
        // 分析完毕的回调函数
        profile.getBuffer((buffer) => {
          var canvas = this.$refs.proRef;
          canvas.height = profile._textureHeight;
          canvas.width = profile._textureWidth;
          var ctx = canvas.getContext("2d");
          var imgData = ctx.createImageData(
            profile._textureWidth,
            profile._textureHeight
          );
          imgData.data.set(buffer);
          // 在canvas上绘制图片
          ctx.putImageData(imgData, 0, 0);
          canvas.style.width = `${this.$refs.canvasRef.clientWidth}px`;
          canvas.style.height = `${this.$refs.canvasRef.clientHeight}px`;
        });
        profile.build();
      });
      this.handlerLine.clear();
      this.$refs.proRef.width = "0";
      this.$refs.proRef.height = "0";
      this.handlerLine.activate();
    },
    clear() {
      if (this.handlerLine) {
        this.handlerLine.clear();
      }
      this.$refs.proRef.width = "0";
      this.$refs.proRef.height = "0";
    },
  },

  beforeDestroy() {
    this.clear();
  },
};
</script>

<template>
  <div class="contents">
    <el-button @click="chooseView" type="primary">分析</el-button>
    <el-button @click="clear" class="ml-3">清除</el-button>
    <slot name="result">
      <br />
      <br />
      <div style="width: 100%; height: 400px" ref="canvasRef" class="mb-2">
        <canvas ref="proRef" style="width: 100%"></canvas>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss"></style>
