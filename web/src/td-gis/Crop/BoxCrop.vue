<template>
  <Form>
    <div style="display: flex; align-items: center">
      <slot name="clipMode">
        <RadioGroup v-model:value="clipMode" button-style="solid" @change="selectClass">
          <RadioButton value="clip_behind_all_plane">裁剪包围盒内</RadioButton>
          <RadioButton value="clip_behind_any_plane">裁剪包围盒外</RadioButton>
        </RadioGroup>
      </slot>
      <slot name="init" :event="init">
        <Button type="primary" class="ml-4" @click="init">裁剪</Button>
      </slot>
      <slot name="clearBox" :event="clearBox">
        <Button class="ml-4" @click="clearBox">清除</Button>
      </slot>
    </div>
    <FormItem label="长度" class="mb-0 mt-3">
      <slot name="length">
        <Slider
          id="test"
          v-model:value="boxOption.length"
          :min="1"
          :max="100"
          :step="1"
          class="w-2/3"
        />
      </slot>
    </FormItem>
    <FormItem label="宽度" class="mb-0">
      <slot name="width">
        <Slider
          id="test"
          v-model:value="boxOption.width"
          :min="1"
          :max="100"
          :step="1"
          class="w-2/3"
        />
      </slot>
    </FormItem>
    <FormItem label="高度" class="mb-0">
      <slot name="height">
        <Slider
          id="test"
          v-model:value="boxOption.height"
          :min="1"
          :max="100"
          :step="1"
          class="w-2/3"
        />
      </slot>
    </FormItem>
    <FormItem label="旋转" class="mb-0">
      <slot name="range">
        <Slider
          id="test"
          v-model:value="boxOption.range"
          :min="0"
          :max="360"
          :step="1"
          class="w-2/3"
        />
      </slot>
    </FormItem>
    <!-- <FormItem class="mb-0">
      <slot name="boxTailor" :event="boxTailor">
        <Button type="primary" @click="boxTailor">交互裁剪</Button>
      </slot>
    </FormItem> -->
  </Form>
</template>
<script setup>
  import { ref, reactive, watch, useSlots, onBeforeUnmount } from 'vue';
  import { Slider, Select, Button, RadioGroup, RadioButton, Form } from 'ant-design-vue';
  const FormItem = Form.Item;

  const clipMode = ref('clip_behind_all_plane');
  let boxOption = reactive({
    length: 5,
    width: 5,
    height: 5,
    range: 0,
  });
  const boxEntity = ref(undefined);
  const handler = ref();
  let position;
  let entities = [];

  const props = defineProps({
    params: {
      type: Object,
      default: {
        length: 5,
        width: 5,
        height: 5,
        range: 0,
        clipMode: 'clip_behind_all_plane',
      },
    },
  });

  const init = () => {
    handler.value = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let clipModes = clipMode.value;
    let boxOptions = boxOption;
    handler.value.setInputAction(function (evt) {
      clearBox();
      var clipMode = clipModes;
      var length = Number(boxOptions.length);
      var width = Number(boxOptions.width);
      var height = Number(boxOptions.height);
      var rotate = Cesium.Math.toRadians(parseFloat(boxOptions.range));
      // 获取鼠标点击的笛卡尔坐标
      var cartesian = viewer.scene.pickPosition(evt.position);
      position = cartesian;
      var boxOption = {
        dimensions: new Cesium.Cartesian3(length, width, height),
        position: cartesian,
        clipMode: clipMode,
        heading: rotate,
      };
      var hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(cartesian, hpr);
      let temp = (boxEntity.value = viewer.entities.add({
        box: {
          dimensions: new Cesium.Cartesian3(length, width, height),
          material: Cesium.Color.fromRandom({
            alpha: 0.1,
          }),
        },
        position: cartesian,
        orientation: orientation,
      }));
      entities.push(temp);
      setAllLayersClipOptions(boxOption);
      handler.value.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  const setAllLayersClipOptions = (boxOptions) => {
    for (var i = 0, j = viewer.scene.layers.layerQueue.length; i < j; i++) {
      viewer.scene.layers.layerQueue[i].setCustomClipBox(boxOptions);
    }
  };

  const setClipBox = (clipMode, boxOptions) => {
    var newDim = boxEntity.value.box.dimensions.getValue();
    var position = boxEntity.value.position.getValue(0);
    var clipMode = clipMode;
    var heading = Cesium.Math.toRadians(boxOptions.range);
    var boxOptions = {
      dimensions: newDim,
      position: position,
      clipMode: clipMode,
      heading: heading,
    };
    setAllLayersClipOptions(boxOptions);
  };

  const selectClass = () => {
    setClipBox(clipMode.value, boxOption);
  };

  const boxTailor = () => {
    if (!boxEntity.value) {
      return;
    }
    handler.value.setInputAction((movement) => {
      var cartesian = viewer.scene.pickPosition(movement.startPosition);
      boxEntity.value.position = cartesian;
      handler.value.setInputAction((evt) => {
        setClipBox(clipMode.value, boxOption);
        handler.value.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };

  const clearBox = () => {
    for (var i = 0, j = viewer.scene.layers.layerQueue.length; i < j; i++) {
      viewer.scene.layers.layerQueue[i].clearCustomClipBox();
    }
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    boxEntity.value = undefined;
  };

  watch(
    () => props.params,
    () => {
      boxOption.height = props.params.height ?? boxOption.height;
      boxOption.width = props.params.width ?? boxOption.width;
      boxOption.length = props.params.length ?? boxOption.length;
      boxOption.range = props.params.range ?? boxOption.range;
      clipMode.value = props.params.clipMode ?? clipMode.value;
    },
    { deep: true, immediate: true },
  );

  watch(
    () => [boxOption, clipMode.value],
    (val) => {
      if (!boxEntity.value) {
        return;
      }
      var length = Number(boxOption.length);
      var width = Number(boxOption.width);
      var height = Number(boxOption.height);
      boxEntity.value.box.dimensions = new Cesium.Cartesian3(length, width, height);
      var position = boxEntity.value.position.getValue(0);

      var newValue = Number(boxOption.range);
      var rotate = Cesium.Math.toRadians(newValue);
      var hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
      boxEntity.value.orientation = orientation;
      setClipBox(clipMode.value, boxOption);
    },
    { deep: true, immediate: true },
  );
  const getParams = () => {
    return {
      ...boxOption,
      clipMode: clipMode.value,
      position,
    };
  };
  const setParams = (e) => {
    clearBox();
    var length = Number(e.length);
    var width = Number(e.width);
    var height = Number(e.height);
    var rotate = Cesium.Math.toRadians(parseFloat(e.range));
    var boxOptions = {
      dimensions: new Cesium.Cartesian3(length, width, height),
      position: e.position,
      clipMode: e.clipMode,
      heading: rotate,
    };
    var hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(e.position, hpr);
    let temp = (boxEntity.value = viewer.entities.add({
      box: {
        dimensions: new Cesium.Cartesian3(length, width, height),
        material: Cesium.Color.fromRandom({
          alpha: 0.1,
        }),
      },
      position: e.position,
      orientation: orientation,
    }));
    entities.push(temp);
    setAllLayersClipOptions(boxOptions);
    Object.assign(boxOption, e);
    clipMode.value = e.clipMode;
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
    clearBox();
  });
</script>
