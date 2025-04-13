<template>
  <div class="mt-3">
    <slot name="extraction" :event="extraction">
      <Button type="primary" @click="extraction"> 地形抽出 </Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>

    <div class="mt-3">
      <Form>
        <slot name="depth">
          <FormItem label="开挖深度(米)" class="mb-0">
            <InputNumber
              type="number"
              v-model:value="depth"
              placeholder="开挖深度(米)  ( 默认值 : 20 )"
            />
          </FormItem>
        </slot>
        <slot name="moveHeight">
          <FormItem label="上移高度(米)" class="mb-0 mt-3">
            <InputNumber
              type="number"
              v-model:value="moveHeight"
              placeholder="上移高度(米)  ( 默认值 : 300 )"
            />
          </FormItem>
        </slot>
      </Form>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch, onBeforeUnmount } from 'vue';
  import { Button, Form, InputNumber } from 'ant-design-vue';
  import getHeightByType from '../utils/getHeightByType';
  const FormItem = Form.Item;

  const props = defineProps({
    height: {
      type: Number,
      default: 20,
    },
    moveHeight: {
      type: Number,
      default: 300,
    },
    clearOther: {
      type: Function,
    },
  });
  const depth = ref(props.height);
  const moveHeight = ref(props.moveHeight);
  let entities = [];

  watch(
    props,
    (val) => {
      depth.value = props.height;
      moveHeight.value = props.moveHeight;
    },
    { immediate: true, deep: true },
  );

  const handlerPolygon = ref();
  const extraction = () => {
    props.clearOther();
    handlerPolygon.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon);
    let temp1 = handlerPolygon.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    entities.push(temp1);
    let temp2 = handlerPolygon.value.drawEvt.addEventListener(function (res) {
      var positions = [].concat(res.object.positions);
      var positionsDegrees = [];
      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var lon = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var h = cartographic.height;
        positionsDegrees = positionsDegrees.concat([lon, lat, h]);
        extract(positionsDegrees);
        handlerPolygon.value.clear();
        handlerPolygon.value.deactivate();
      }
    });
    entities.push(temp2);
    handlerPolygon.value.activate();
  };

  const extract = (positions) => {
    viewer.scene.globe.removeAllExtractRegion();
    viewer.scene.globe.addExtractRegion({
      name: 'extract', //名称
      position: positions, //区域
      height: Number(depth.value), //开挖深度
      transparent: false, //封边是否透明
      extractHeight: Number(moveHeight.value), //抽出高度
      granularity: 1, //精度
    });
  };

  const clear = () => {
    try {
      handlerPolygon.value.deactivate();
      handlerPolygon.value.clear();
      viewer.scene.globe.removeAllExtractRegion();
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      handlerPolygon.value = undefined;
    } catch (error) {}
  };

  defineExpose({ clear });

  onBeforeUnmount(() => {
    clear();
  });
</script>
