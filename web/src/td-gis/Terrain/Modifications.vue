<template>
  <div class="mt-3">
    <slot name="modifications" :event="modifications">
      <Button type="primary" @click="modifications">地形修改</Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button class="ml-3" @click="clear">清除</Button>
    </slot>
  </div>
</template>
<script setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import { Button } from 'ant-design-vue';

  let entities = [];

  const props = defineProps({
    clearOther: {
      type: Function,
    },
  });

  const handlerPolygon = ref();
  const modifications = () => {
    props.clearOther();
    init();
    handlerPolygon.value.activate();
  };
  const clear = () => {
    try {
      viewer.scene.globe.removeAllModifyRegion();
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      handlerPolygon.value = undefined;
    } catch (error) {}
  };
  defineExpose({ clear });
  const init = () => {
    handlerPolygon.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    let temp = handlerPolygon.value.drawEvt.addEventListener(function (result) {
      if (!result.object.positions) {
        handlerPolygon.value.polygon.show = false;
        handlerPolygon.value.polyline.show = false;
        handlerPolygon.value.deactivate();
        handlerPolygon.value.activate();
        return;
      }
      var array = [].concat(result.object.positions);
      var positions = [];
      for (var i = 0, len = array.length; i < len; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var h = cartographic.height;
        if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }
      viewer.scene.globe.removeAllModifyRegion();
      viewer.scene.globe.addModifyRegion({
        name: 'text',
        position: positions,
      });
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = true;
    });
    entities.push(temp);
  };
  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    clear();
  });
</script>
