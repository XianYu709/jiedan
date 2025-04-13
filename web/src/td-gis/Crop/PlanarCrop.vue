<template>
  <div>
    <slot name="planarHandler" :event="planarHandler">
      <Button type="primary" @click="planarHandler">裁剪</Button>
    </slot>
    <slot name="clear" :event="clear">
      <Button class="ml-4" @click="clear">清除</Button>
    </slot>
  </div>
</template>
<script setup>
  import { onBeforeUnmount, ref } from 'vue';
  import emitter from '../hooks/useMitt';
  import { Button } from 'ant-design-vue';

  const handlerPlanar = ref();
  const BIMLayer = ref([]);
  const emits = defineEmits(['positions', 'clear']);
  const planarHandler = () => {
    if (!handlerPlanar.value) {
      init();
    }
    handlerPlanar.value.activate();
  };
  emitter.on('layerReady', () => {
    init();
  });
  const init = () => {
    var clampMode = 0;
    handlerPlanar.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, clampMode);
    handlerPlanar.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerPlanar.value.drawEvt.addEventListener(function (result) {
      handlerPlanar.value.polygon.show = false;
      var positions = result.object.positions;
      emits('positions', positions);
      //通过多边形的顶点设置裁剪面，裁剪方向为裁剪面的法线方向
      viewer.scene.layers.layerQueue.map((el) => {
        BIMLayer.value.push(viewer.scene.layers.find(el.name));
        BIMLayer.value.map((val) => {
          val.setCustomClipPlane(positions[0], positions[1], positions[2]);
        });
      });
    });
  };
  const clear = () => {
    if (!handlerPlanar.value) {
      return;
    }
    emits('clear');
    handlerPlanar.value.clear();
    BIMLayer.value.map((val) => {
      val.clearCustomClipBox();
    });
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
