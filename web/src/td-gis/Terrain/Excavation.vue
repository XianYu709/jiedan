<template>
  <div class="mt-3">
    <div class="param-item">
      <slot name="excavation" :event="excavation">
        <Button type="primary" @click="excavation"> 地形开挖 </Button>
      </slot>

      <slot name="clear" :event="clear">
        <Button @click="clear" class="ml-3">清除</Button>
      </slot>
    </div>
    <div class="mt-3">
      <slot name="depth">
        <Form>
          <FormItem label="开挖深度(米)" class="mb-0">
            <InputNumber
              type="number"
              v-model:value="depth"
              placeholder="开挖深度(米)  ( 默认值 : 500 )"
            />
          </FormItem>
        </Form>
      </slot>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch, onBeforeUnmount } from 'vue';
  import { Button, Input, Form, InputNumber } from 'ant-design-vue';
  import getHeightByType from '../utils/getHeightByType';
  const FormItem = Form.Item;

  let entities = [];

  const props = defineProps({
    height: {
      type: Number,
    },
    clearOther: {
      type: Function,
    },
  });
  const depth = ref(500);
  watch(
    () => props.height,
    () => {
      depth.value = props.height??depth.value;
    },
    { immediate: true },
  );


  const handlerPolygon = ref();
  const excavation = () => {
    props.clearOther();
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
      var dep = depth.value;

      // getHeightByType(array, 'terrain').then((res) => {
      
      // });
        viewer.scene.globe.removeAllExcavationRegion();
        viewer.scene.globe.addExcavationRegion({
          name: 'ggg',
          position: positions,
          height: dep,
          transparent: false,
        });
        handlerPolygon.value.polygon.show = false;
        handlerPolygon.value.polyline.show = false;
        handlerPolygon.value.deactivate();
        handlerPolygon.value.activate();
    });
    handlerPolygon.value.activate();
  };
  entities.push(excavation);
  const clear = () => {
    try {
      viewer.scene.globe.removeAllExcavationRegion();
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      handlerPolygon.value.clear();
      handlerPolygon.value = undefined;
    } catch (error) {}
  };

  defineExpose({ clear });

  onBeforeUnmount(() => {
    clear();
  });
</script>
