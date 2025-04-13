<template>
  <div>
    <slot>
      <InputNumber
        v-model:value="scopeValue"
        placeholder="输入范围大小  ( 默认值 : 250 )"
        allow-clear
        class="mb-3"
        addon-after="米"
      />
    </slot>
    <slot name="linearExtrude" :event="linearExtrude">
      <Button @click="linearExtrude" type="primary">服务区分析</Button>
    </slot>
    <slot name="reset" :event="reset">
      <Button @click="reset" class="ml-3" type="primary" danger>清除分析</Button>
    </slot>
  </div>
</template>

<script setup>
  import { onBeforeUnmount, ref, watch } from 'vue';
  import { InputNumber, Button } from 'ant-design-vue';
  import axios from 'axios';
  import endImg from '../images/end.png';

  const props = defineProps({
    open: { type: Boolean, default: false },
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/transportationAnalyst-twin-city/rest/networkanalyst/%E8%B7%AF%E7%BD%91@data/servicearea.json',
    },
    scopeValue: {
      type: Number,
      default: 250,
    },
  });

  var scopeValue = ref(250);

  watch(
    () => props.scopeValue,
    (val) => {
      if (val) scopeValue.value = val;
    },
    {
      immediate: true,
    },
  );

  let entities = [];

  const handlerLine = ref();
  const clear = () => {};
  const linearExtrude = () => {
    handlerLine.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point, 0);
    var ids1;
    handlerLine.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = 'pointer'; //点击后鼠标箭头改为pointer
      } else {
        viewer.enableCursorStyle = true;
        viewer._element.style.cursor = ''; //点击完成后鼠标箭头改为空
      }
    });
    handlerLine.value.drawEvt.addEventListener(function (result) {
      handlerLine.value.clear();
      const cartographic = Cesium.Cartographic.fromCartesian(
        result.object.position,
        viewer.scene.globe.ellipsoid,
        new Cesium.Cartographic(),
      );
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);
      const height = cartographic.height;
      //
      const parameter = {
        resultSetting: {
          returnEdgeIDs: true,
          returnNodeIDs: true,
          returnPathGuides: true,
          returnRoutes: true,
          returnEdgeFeatures: true,
          returnEdgeGeometry: true,
          returnNodeFeatures: true,
          returnNodeGeometry: true,
        },
        weightFieldName: 'SmLength',
      };
      const isReturnComplexArea = false;
      const isCenterMutuallyExclusive = false;
      const isFromCenter = true;
      const weights = [scopeValue.value || 250];
      const centers = [{ x: lng, y: lat }];
      axios({
        url: `${
          props.serviceUrl
        }?isReturnComplexArea=${isReturnComplexArea}&isCenterMutuallyExclusive=${isCenterMutuallyExclusive}&isFromCenter=${isFromCenter}&weights=${JSON.stringify(
          weights,
        )}&parameter=${JSON.stringify(parameter)}&centers=${JSON.stringify(centers)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'GET',
      }).then((data) => {
        let path = [];
        data.data.serviceAreaList[0].serviceRegion.points.map((el) => {
          path.push(Number(el.x), Number(el.y));
          let cartesian3s = Cesium.Cartesian3.fromDegreesArray(path);
          let temp = viewer.entities.add({
            name: 'service',
            polyline: {
              positions: cartesian3s,
              width: 2,
              material: Cesium.Color.YELLOW,
              clampToGround: true,
            },
          });
          entities.push(temp);
        });
      });
    });
    handlerLine.value.activate();
  };

  const reset = () => {
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    handlerLine.value && handlerLine.value.clear();
  };
  onBeforeUnmount(() => {
    reset();
  });
</script>
