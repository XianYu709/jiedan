<template>
  <slot name="tailorWithSeal" :event="tailorWithSeal">
    <Button type="primary" @click="tailorWithSeal">裁剪</Button>
  </slot>
  <slot name="clearBox" :event="clear">
    <Button class="ml-4" @click="clear">清除</Button>
  </slot>
</template>
<script setup>
  import { onBeforeUnmount, ref } from 'vue';
  import { Button } from 'ant-design-vue';
  const props = defineProps({
    layersName: { type: String, required: true },
  });
  const handlerPolygon = ref();
  const BIMLayer = ref();
  const tailorWithSeal = () => {
    handlerPolygon.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    handlerPolygon.value.activeEvt.addEventListener(function (isActive) {});
    handlerPolygon.value.drawEvt.addEventListener(function (result) {
      handlerPolygon.value.polygon.show = false;
      var positions = result.object.positions;
      // 只用前三个点构面
      handlerPolygon.value.polyline.positions = [positions[0], positions[1], positions[2]];
      BIMLayer.value = viewer.scene.layers.find(props.layersName);
      BIMLayer.value.clipPlaneColor = new Cesium.Color(1, 0, 0, 0.6);
      //设置裁剪封边
      BIMLayer.value.setCustomClipPlane(positions[0], positions[1], positions[2], 1);
    });
    handlerPolygon.value.activate();
  };
  const clear = () => {
    handlerPolygon.value && handlerPolygon.value.clear();
    BIMLayer.value && BIMLayer.value.clearCustomClipBox();
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
