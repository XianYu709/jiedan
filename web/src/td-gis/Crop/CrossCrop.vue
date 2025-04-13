<template>
  <Form :label-col="{ span: 4 }">
    <slot name="crossTailor" :event="crossTailor">
      <Button type="primary" @click="crossTailor">裁剪</Button>
    </slot>
    <slot name="clearCross" :event="clearCross">
      <Button class="ml-4" @click="clearCross">清除</Button>
    </slot>
    <FormItem label="裁剪长度" class="mb-0 mt-3">
      <slot name="length">
        <Slider
          v-model:value="boxOption.length"
          @change="lengthChange"
          :min="1"
          :max="100"
          :step="1"
        />
      </slot>
    </FormItem>
    <FormItem label="裁剪宽度" class="mb-0">
      <slot name="width">
        <Slider
          v-model:value="boxOption.width"
          @change="widthChange"
          :min="1"
          :max="100"
          :step="1"
        />
      </slot>
    </FormItem>
    <FormItem label="绕X轴旋转" class="mb-0">
      <slot name="pitch">
        <Slider
          v-model:value="boxOption.pitch"
          @change="updateClip"
          :min="0"
          :max="360"
          :step="1"
        />
      </slot>
    </FormItem>
    <FormItem label="绕Y轴旋转" class="mb-0">
      <slot name="roll">
        <Slider v-model:value="boxOption.roll" @change="updateClip" :min="0" :max="360" :step="1" />
      </slot>
    </FormItem>
    <FormItem label="绕Z轴旋转" class="mb-0">
      <slot name="heading">
        <Slider
          v-model:value="boxOption.heading"
          @change="updateClip"
          :min="0"
          :max="360"
          :step="1"
        />
      </slot>
    </FormItem>
    <FormItem label="拉伸" class="mb-0">
      <slot name="extrudeDistance">
        <Slider
          v-model:value="boxOption.extrudeDistance"
          @change="updateClip"
          :min="0.1"
          :max="30"
          :step="0.1"
        />
      </slot>
    </FormItem>
  </Form>
</template>
<script setup>
  import { ref, reactive, watch, onBeforeUnmount } from 'vue';
  import { Slider, Button, Form } from 'ant-design-vue';
  const FormItem = Form.Item;
  const boxOption = reactive({
    length: 5,
    width: 5,
    pitch: 0,
    roll: 0,
    heading: 0,
    extrudeDistance: 1.0,
    startClip: false,
    hasClipped: false,
    isMoving: false,
    position: null,
    dim: null,
  });
  const box = ref();
  const CrossHandler = ref();
  let position;
  let entities = [];

  const props = defineProps({
    params: {
      type: Object,
      default: {
        length: 5,
        width: 5,
        pitch: 0,
        roll: 0,
        heading: 0,
        extrudeDistance: 0,
      },
    },
  });

  const lengthChange = (val) => {
    if (!box.value) {
      return;
    }
    boxOption.length = Number(val);
    if (boxOption.hasClipped) {
      box.value.box.dimensions = new Cesium.Cartesian3(boxOption.width, boxOption.length, 0.1);
      boxOption.dim = new Cesium.Cartesian3(
        boxOption.width,
        boxOption.length,
        boxOption.extrudeDistance,
      );
      updateClip();
    }
  };
  const widthChange = (val) => {
    if (!box.value) {
      return;
    }
    boxOption.width = Number(val);
    if (boxOption.hasClipped) {
      box.value.box.dimensions = new Cesium.Cartesian3(boxOption.width, boxOption.length, 0.1);
      boxOption.dim = new Cesium.Cartesian3(
        boxOption.width,
        boxOption.length,
        boxOption.extrudeDistance,
      );
      updateClip();
    }
  };
  const boxPosition = ref();
  const crossTailor = () => {
    boxOption.startClip = true;
    boxPosition.value;
    let temp = (box.value = viewer.entities.add({
      // 标识盒
      position: Cesium.Cartesian3.fromDegrees(0, 0, 0),
      show: false,
      box: {
        dimensions: new Cesium.Cartesian3(5, 5, 0.1),
        material: Cesium.Color.fromRandom({
          alpha: 0.5,
        }),
      },
    }));
    entities.push(temp);
    box.value.show = true;
    CrossHandler.value = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    CrossHandler.value.setInputAction(function (movement) {
      if (boxOption.startClip) {
        boxPosition.value = viewer.scene.pickPosition(movement.endPosition);
        if (!boxPosition.value) {
          return;
        }
        box.value.position = boxPosition.value;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    CrossHandler.value.setInputAction(function (evt) {
      if (boxOption.startClip) {
        boxOption.position = viewer.scene.pickPosition(evt.position);
        if (!boxOption.position) {
          return;
        }
        position = viewer.scene.pickPosition(evt.position);
        var hpr = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(boxOption.heading),
          Cesium.Math.toRadians(boxOption.pitch),
          Cesium.Math.toRadians(boxOption.roll),
        );
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxOption.position, hpr);
        box.value.orientation = orientation;
        boxOption.dim = new Cesium.Cartesian3(boxOption.width, boxOption.extrudeDistance);
        updateClip();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  const clearCross = () => {
    if (!box.value) {
      return;
    }
    boxPosition.value = null;
    boxOption.startClip = false;
    box.value.show = false;
    box.value = null;
    for (var i = 0, j = viewer.scene.layers.layerQueue.length; i < j; i++) {
      viewer.scene.layers.layerQueue[i].clearCustomClipBox();
    }
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
  };
  const updateClip = () => {
    if (!box.value) {
      return;
    }
    for (var i = 0, j = viewer.scene.layers.layerQueue.length; i < j; i++) {
      viewer.scene.layers.layerQueue[i].setCustomClipCross({
        position: boxOption.position,
        dimensions: boxOption.dim,
        heading: boxOption.heading,
        pitch: boxOption.pitch,
        roll: boxOption.roll,
        extrudeDistance: boxOption.extrudeDistance,
      });
    }
    boxOption.startClip = false;
    boxOption.hasClipped = true;
    box.value.show = false;
  };

  watch(
    () => props.params,
    () => {
      // if (!box.value) {
      //   return;
      // }
      boxOption.width = props.params.width ?? boxOption.width;
      widthChange(boxOption.width);
      boxOption.length = props.params.length ?? boxOption.length;
      lengthChange(boxOption.length);
      boxOption.pitch = props.params.pitch ?? boxOption.pitch;
      updateClip(boxOption.pitch);
      boxOption.roll = props.params.roll ?? boxOption.roll;
      updateClip(boxOption.roll);
      boxOption.heading = props.params.heading ?? boxOption.heading;
      updateClip(boxOption.heading);
      boxOption.extrudeDistance = props.params.extrudeDistance ?? boxOption.extrudeDistance;
      updateClip(boxOption.extrudeDistance);
    },
    { deep: true, immediate: true },
  );

  const getParams = () => {
    return {
      ...boxOption,
      position,
    };
  };
  const setParams = (e) => {
    Object.assign(boxOption, e);
    let temp = (box.value = viewer.entities.add({
      position: e.position,
      box: {
        dimensions: new Cesium.Cartesian3(5, 5, 0.1),
        fill: true,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 5.0,
      },
    }));
    entities.push(temp);
    updateClip();
    let cartographic = Cesium.Cartographic.fromCartesian(e.position);
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let h = cartographic.height;
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, h + 200),
    });
  };
  defineExpose({ getParams, setParams });

  onBeforeUnmount(() => {
    clearCross();
  });
</script>
