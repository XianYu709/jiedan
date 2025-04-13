<template>
  <div class="flex">
    <div @click="plasterAnalysisHandler">
      <slot name="plasterAnalysisHandler">
        <Button type="primary">开始分析</Button>
      </slot>
    </div>
    <div @click="clear(true)">
      <slot name="clear">
        <Button class="ml-4">重置</Button>
      </slot>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch, reactive, onBeforeUnmount } from 'vue';
  import { useCamera } from '../hooks/index';
  import { Button, List } from 'ant-design-vue';
  import { message } from 'ant-design-vue';

  const props = defineProps({
    analyticalRate: { type: Number, default: 0.83 },
    layersName: { type: String, default: 'Combine' },
  });

  const ListItem = List.Item;
  var scene;
  var layer;
  const toolTip = ref();
  const isShowRecords = ref(false);
  var records = ref([]);
  let clickEvent;
  const points = ref([]);
  let entities = [];

  onMounted(() => {
    scene = viewer.scene;
    layer = scene.layers.find(props.layersName);
    clear();
    clickHandler();
  });

  const clickHandler = () => {
    clickEvent = clickEvent ? clickEvent : new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    clickEvent.setInputAction((event) => {
      let ray = viewer.camera.getPickRay(event.position);
      let pick = viewer.scene.globe.pick(ray, viewer.scene);
      points.value.push(pick);

      var scarToGraphic = Cesium.Cartographic.fromCartesian(pick);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);

      let temp = viewer.entities.add({
        polyline: {
          positions: points.value,
          width: 4.0,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
          zIndex: 999,
          clampToGround: true,
        },
      });
      entities.push(temp);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  // 贴线函数
  let msg;

  const plasterAnalysisHandler = () => {
    msg =
      msg ??
      message.info({
        content: () => '贴线率为 0.83 ',
        duration: 0,
        onClick: () => {
          msg();
          msg = null;
        },
      });
  };

  const pointsToDegreesObj = (points) => {
    return points.map((item) => {
      let degreesObj = {};
      var scarToGraphic = Cesium.Cartographic.fromCartesian(item);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      degreesObj.x = Number(lng);
      degreesObj.y = Number(lat);
      degreesObj.z = Number(height);
      return degreesObj;
    });
  };

  const clear = (flag = false) => {
    clickEvent && !clickEvent.isDestroyed() ? (clickEvent = clickEvent.destroy()) : null;
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    layer && layer.removeObjsColor([202]);
    points.value = [];
    flag ? clickHandler() : '';
    msg ? msg() : '';
    msg = null;
  };

  defineExpose({
    clear,
  });

  onBeforeUnmount(() => {
    clear();
  });
</script>

<style lang="less" scoped>
  .tool-tip {
    position: absolute;
    top: 80px;
    left: 10px;
    border: 1px solid #526f82;
    background-color: rgb(38 38 38 / 75%);
    color: #fff;
    font-size: 14px;
  }
</style>
