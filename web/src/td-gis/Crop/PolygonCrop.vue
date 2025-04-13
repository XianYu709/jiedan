<template>
  <slot name="polygonHandler" :event="polygonHandler">
    <Button type="primary" @click="polygonHandler">裁剪</Button>
  </slot>
  <slot name="clipMode">
    <RadioGroup class="ml-4" v-model:value="clipMode" button-style="solid" @change="selectClass">
      <RadioButton value="clip-outside">开挖外部</RadioButton>
      <RadioButton value="clip-inside">开挖内部</RadioButton>
    </RadioGroup>
  </slot>
  <slot name="clear" :event="clear">
    <Button class="ml-4" @click="clear">清除</Button>
  </slot>
</template>
<script setup>
  import { onBeforeUnmount, ref, watch } from 'vue';
  import { Select, Button, RadioGroup, RadioButton } from 'ant-design-vue';

  const props = defineProps({
    clipMode: {
      type: String,
      default: 'clip-inside',
    },
  });

  const clipMode = ref('clip-inside');
  const regions = ref();
  const handlerPolygon = ref();
  const positions = ref();
  const polygonHandler = () => {
    var clipModeEnum =
      clipMode.value == 'clip-inside'
        ? Cesium.ModifyRegionMode.CLIP_INSIDE
        : Cesium.ModifyRegionMode.CLIP_OUTSIDE;
    handlerPolygon.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);

    handlerPolygon.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerPolygon.value.drawEvt.addEventListener(function (result) {
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      positions.value = [];
      for (var pt of result.object.positions) {
        var cartographic = Cesium.Cartographic.fromCartesian(pt);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;
        positions.value.push(longitude, latitude, height);
      }
      regions.value = [];
      regions.value.push(positions.value);
      for (var layer of viewer.scene.layers.layerQueue) {
        layer.setModifyRegions(regions.value, clipModeEnum);
      }
    });
    handlerPolygon.value.activate();
  };

  const selectClass = () => {
    var clipModeEnum =
      clipMode.value === 'clip-inside'
        ? Cesium.ModifyRegionMode.CLIP_INSIDE
        : Cesium.ModifyRegionMode.CLIP_OUTSIDE;
    for (var layer of viewer.scene.layers.layerQueue) {
      layer.setModifyRegions(regions.value, clipModeEnum);
    }
  };

  watch(
    () => props.clipMode,
    () => {
      clipMode.value = props.clipMode ?? clipMode.value;
      selectClass();
    },
    {
      deep: true,
    },
  );

  const clear = () => {
    handlerPolygon.value && handlerPolygon.value.clear();
    for (var layer of viewer.scene.layers.layerQueue) {
      layer.clearModifyRegions();
    }
    positions.value = [];
    regions.value = [];
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
