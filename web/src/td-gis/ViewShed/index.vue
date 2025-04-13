<template>
  <div>
    <slot name="chooseView" :event="chooseView">
      <Button type="primary" @click="chooseView">绘制可视域</Button>
    </slot>
    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>
    <Form :label-col="{ span: 6 }">
      <FormItem label="X" class="mb-0 mt-3">
        <slot name="longitude">
          <input
            :disabled="!longitude"
            v-model="longitude"
            @input="longitudeClick"
            step="0.0001"
            class="w-full"
            type="number"
          />
        </slot>
      </FormItem>
      <FormItem label="Y" class="mb-0 mt-3">
        <slot name="latitude">
          <input
            :disabled="!latitude"
            v-model="latitude"
            class="w-full"
            @input="longitudeClick"
            step="0.0001"
            type="number"
          />
        </slot>
      </FormItem>
      <FormItem label="Z" class="mb-0 mt-3">
        <slot name="height">
          <input
            :disabled="!longitude"
            v-model="height"
            class="w-full"
            @input="longitudeClick"
            step="0.0001"
            type="number"
          />
        </slot>
      </FormItem>
      <FormItem label="方向(度)" class="mb-0 mt-3">
        <slot name="direction">
          <Slider
            :min="0"
            :max="360"
            :step="1.0"
            title="方向"
            v-model:value="viewModel.direction"
          />
        </slot>
      </FormItem>
      <FormItem label="翻转(度)" class="mb-0">
        <slot name="pitch">
          <Slider :min="-90" :max="90" :step="1.0" title="翻转" v-model:value="viewModel.pitch" />
        </slot>
      </FormItem>
      <FormItem label="距离(米)" class="mb-0">
        <slot name="distance">
          <Slider :min="1" :max="500" :step="1.0" title="距离" v-model:value="viewModel.distance" />
        </slot>
      </FormItem>
      <FormItem label="水平视场角(度)" class="mb-0">
        <slot name="horizontalFov">
          <Slider
            :min="1"
            :max="120"
            :step="1"
            title="水平视场角"
            v-model:value="viewModel.horizontalFov"
          />
        </slot>
      </FormItem>
      <FormItem label="垂直视场角(度)" class="mb-0">
        <slot name="verticalFov">
          <Slider
            :min="1"
            :max="90"
            :step="1.0"
            title="垂直视场角"
            v-model:value="viewModel.verticalFov"
          />
        </slot>
      </FormItem>
      <FormItem label="可见区域颜色" class="mb-0">
        <slot name="visibleAreaColor">
          <input size="1" type="color" v-model="viewModel.visibleAreaColor" />
        </slot>
      </FormItem>
      <FormItem label="不可见区域颜色" class="mb-0">
        <slot name="invisibleAreaColor">
          <input size="1" type="color" v-model="viewModel.invisibleAreaColor" />
        </slot>
      </FormItem>
    </Form>
  </div>
</template>
<script setup>
  import { onMounted, reactive, ref, watch, onUnmounted, onBeforeUnmount } from 'vue';
  import { Button, Slider, Form } from 'ant-design-vue';
  import { merge } from 'lodash-es';

  const FormItem = Form.Item;

  const clipMode = ref('keep-inside');
  const animateShow = ref(false);

  const props = defineProps({
    params: {
      type: Object,
      default: {
        direction: 1.0,
        pitch: 1.0,
        distance: 1.0,
        verticalFov: 1.0,
        horizontalFov: 1.0,
        visibleAreaColor: '#00FF00',
        invisibleAreaColor: '#FF0000',
        longitude: 0,
        latitude: 0,
        height: 0,
      },
    },
  });

  const viewModel = reactive({
    direction: 1.0,
    pitch: 1.0,
    distance: 1.0,
    verticalFov: 1.0,
    horizontalFov: 1.0,
    visibleAreaColor: '#00ff00',
    invisibleAreaColor: '#ff0000',
  });
  const longitude = ref(0);
  const latitude = ref(0);
  const height = ref(0);

  const viewShed3D = ref();
  const pointHandler = ref();
  let startPosition;
  let endPosition;

  watch(
    () => props.params,
    () => {
      viewModel.direction = props.params.direction ?? viewModel.direction;
      viewModel.pitch = props.params.pitch ?? viewModel.pitch;
      viewModel.distance = props.params.distance ?? viewModel.distance;
      viewModel.verticalFov = props.params.verticalFov ?? viewModel.verticalFov;
      viewModel.horizontalFov = props.params.horizontalFov ?? viewModel.horizontalFov;
      viewModel.visibleAreaColor = props.params.visibleAreaColor ?? viewModel.visibleAreaColor;
      viewModel.invisibleAreaColor =
        props.params.invisibleAreaColor ?? viewModel.invisibleAreaColor;
      longitude.value = props.params.longitude ?? longitude.value;
      latitude.value = props.params.latitude ?? latitude.value;
      height.value = props.params.height ?? height.value;
    },
    {
      immediate: true,
      deep: true,
    },
  );

  watch(
    viewModel,
    (val) => {
      viewShed3D.value.direction = parseFloat(val.direction);
      viewShed3D.value.pitch = parseFloat(val.pitch);
      viewShed3D.value.distance = parseFloat(val.distance);
      viewShed3D.value.verticalFov = parseFloat(val.verticalFov);
      viewShed3D.value.horizontalFov = parseFloat(val.horizontalFov);
      var color1 = Cesium.Color.fromCssColorString(val.visibleAreaColor);
      viewShed3D.value.visibleAreaColor = color1;
      var color2 = Cesium.Color.fromCssColorString(val.invisibleAreaColor);
      viewShed3D.value.hiddenAreaColor = color2;
    },
    { deep: true },
  );

  watch(
    () => [props.params.longitude, props.params.latitude, props.params.height],
    () => {
      longitudeClick();
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          props.params.longitude,
          props.params.latitude,
          props.params.height + 1000,
        ),
      });
    },
    {
      deep: true,
    },
  );

  const getParams = () => {
    return {
      direction: viewModel.direction,
      pitch: viewModel.pitch,
      distance: viewModel.distance,
      verticalFov: viewModel.verticalFov,
      horizontalFov: viewModel.horizontalFov,
      visibleAreaColor: viewModel.visibleAreaColor,
      invisibleAreaColor: viewModel.invisibleAreaColor,
      startPosition: startPosition,
      endPosition: endPosition,
    };
  };

  const longitudeClick = () => {
    pointHandler.value.clear();
    viewShed3D.value.viewPosition = [longitude.value, latitude.value, height.value];
  };
  const chooseView = () => {
    if (pointHandler.value.active) {
      return;
    }
    //先清除之前的可视域分析
    // viewer.entities.removeAll();
    viewShed3D.value.distance = 0.1;
    viewer.scene.viewFlag = true;
    //激活绘制点类
    pointHandler.value.activate();
    var viewPosition;
    pointHandler.value.drawEvt.addEventListener(function (result) {
      // var point = result.object;
      var position = result.object.position;
      startPosition = position;
      viewPosition = position;
      // 将获取的点的位置转化成经纬度
      var cartographic = Cesium.Cartographic.fromCartesian(position);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      var height = cartographic.height;
      if (viewer.scene.viewFlag) {
        // 设置视口位置
        viewShed3D.value.viewPosition = [longitude, latitude, height];
        viewShed3D.value.build();
        // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
        viewer.scene.viewFlag = false;
      }
    });
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function (e) {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!viewer.scene.viewFlag) {
        //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        var position = e.endPosition;
        var last = viewer.scene.pickPosition(position);
        //计算该点与视口位置点坐标的距离
        var distance = Cesium.Cartesian3.distance(viewPosition, last);
        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          var cartographic = Cesium.Cartographic.fromCartesian(last);
          longitude.value = Cesium.Math.toDegrees(cartographic.longitude);
          latitude.value = Cesium.Math.toDegrees(cartographic.latitude);
          height.value = cartographic.height;
          // 通过该点设置可视域分析对象的距离及方向
          viewShed3D.value.setDistDirByPoint([longitude.value, latitude.value, height.value]);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (e) {
      endPosition = e.position;
      //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      viewer.scene.viewFlag = true;
      viewModel.direction = viewShed3D.value.direction;
      viewModel.pitch = viewShed3D.value.pitch;
      viewModel.distance = viewShed3D.value.distance;
      viewModel.horizontalFov = viewShed3D.value.horizontalFov;
      viewModel.verticalFov = viewShed3D.value.verticalFov;
      animateShow.value = true;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };
  const init = () => {
    viewer.scene.viewFlag = true;
    viewShed3D.value = new Cesium.ViewShed3D(viewer.scene);
    pointHandler.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    Cesium.knockout.track(viewModel);
  };

  const setParams = (e) => {
    try {
      var startCartographic = Cesium.Cartographic.fromCartesian(e.startPosition);
      var StartLongitude = Cesium.Math.toDegrees(startCartographic.longitude);
      var StartLatitude = Cesium.Math.toDegrees(startCartographic.latitude);
      var StartHeight = startCartographic.height;
      viewShed3D.value.viewPosition = [StartLongitude, StartLatitude, StartHeight];
      // var endCartographic = Cesium.Cartographic.fromCartesian(e.endPosition);
      // var endLongitude = Cesium.Math.toDegrees(endCartographic.longitude);
      // var endLatitude = Cesium.Math.toDegrees(endCartographic.latitude);
      // var endHeight = endCartographic.height;
      // viewShed3D.value.setDistDirByPoint([endLongitude, endLatitude, endHeight]);
      viewShed3D.value.direction = parseFloat(e.direction);
      viewShed3D.value.pitch = parseFloat(e.pitch);
      viewShed3D.value.distance = parseFloat(e.distance);
      viewShed3D.value.verticalFov = parseFloat(e.verticalFov);
      viewShed3D.value.horizontalFov = parseFloat(e.horizontalFov);
      var color1 = Cesium.Color.fromCssColorString(e.visibleAreaColor);
      viewShed3D.value.visibleAreaColor = color1;
      var color2 = Cesium.Color.fromCssColorString(e.invisibleAreaColor);
      viewShed3D.value.hiddenAreaColor = color2;
      viewShed3D.value.build();
      Object.assign(viewModel, e);
      longitude.value = StartLongitude;
      latitude.value = StartLatitude;
      height.value = StartHeight;
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          StartLongitude,
          StartLatitude,
          StartHeight + 888,
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  defineExpose({ getParams, setParams });

  const clear = () => {
    longitude.value = 0;
    latitude.value = 0;
    height.value = 0;
    startPosition = undefined;
    endPosition = undefined;
    animateShow.value = false;
    if (viewShed3D.value) {
      viewShed3D.value.removeAllClipRegion();
      viewShed3D.value.distance = 0.001;
    }
    if (pointHandler.value) {
      pointHandler.value.clear();
    }
    // viewer.entities.removeAll();
    viewer.scene.viewFlag = true;
  };
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    clear();
    viewShed3D.value = '';
  });
  onBeforeUnmount(() => {
    clear();
  });
</script>
