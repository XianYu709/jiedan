<template>
  <div class="contents">
    <slot name="chooseView" :event="chooseView">
      <Button @click="chooseView" type="primary"> 剖面分析 </Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>

    <slot name="result">
      <Divider>分析结果</Divider>
      <div style="width: 100%; height: 400px" ref="canvasRef" class="mb-2">
        <canvas ref="proRef"></canvas>
      </div>
    </slot>
  </div>
</template>
<script setup>
  import { ref, watch, onBeforeUnmount } from 'vue';
  import { Button, Divider } from 'ant-design-vue';
  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
  });
  const canvasRef = ref();
  const open = ref(true);
  const proRef = ref();
  const handlerLine = ref();
  watch(
    () => props,
    (val) => {
      open.value = val.open;
    },
    { deep: true },
  );
  const handleCancel = () => {
    open.value = false;
  };
  const chooseView = () => {
    open.value = true;
    var profile = new Cesium.Profile(viewer.scene);
    handlerLine.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
    handlerLine.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerLine.value.drawEvt.addEventListener(function (result) {
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

      //设置坡面分析的开始和结束位置
      profile.startPoint = [sLongitude, sLatitude, sHeight];
      profile.endPoint = [eLongitude, eLatitude, eHeight];

      profile.extendHeight = 40;
      //分析完毕的回调函数
      profile.getBuffer(function (buffer) {
        // open.value = true;
        var canvas = proRef.value;
        canvas.height = profile._textureHeight;
        canvas.width = profile._textureWidth;
        var ctx = canvas.getContext('2d');
        var imgData = ctx.createImageData(profile._textureWidth, profile._textureHeight);
        imgData.data.set(buffer);
        //在canvas上绘制图片
        ctx.putImageData(imgData, 0, 0);
        canvas.style.width = `${canvasRef.value.clientWidth}px`;
        canvas.style.height = `${canvasRef.value.clientHeight}px`;
      });
      profile.build();
    });
    handlerLine.value.clear();
    proRef.value.width = '0';
    proRef.value.height = '0';
    handlerLine.value.activate();
  };
  const clear = () => {
    handlerLine.value && handlerLine.value.clear();
    proRef.value.width = '0';
    proRef.value.height = '0';
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
<style lang="less" scoped>
  @import './index.less';
</style>
