<template>
  <div class="contents">
    <slot></slot>
  </div>
  <div class="param-item mt-3">
    <slot name="shadowAnalysis" :event="shadowAnalysis">
      <Button @click="shadowAnalysis" type="primary"> 阴影分析 </Button>
    </slot>

    <slot name="sunlight" :event="sunlight">
      <Button class="ml-3" @click="sunlight" type="primary" danger> 日照效果 </Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button class="ml-3" @click="clear">清除</Button>
    </slot>

    <slot name="shadowRadio" :event="shadowRadio">
      <Button class="ml-3" @click="shadowRadio"> 获取阴影率 </Button>
    </slot>
  </div>
  <div>
    <div class="mt-4 w-[250px] -mb-3">
      <div class="h-5 bg-black mb-1 colorLine cursor-pointer"></div>
      <div class="flex items-center justify-between text-gray-5 text-sm">
        <span>暴露</span>
        <span>遮挡</span>
      </div>
    </div>
  </div>
  <Divider v-show="infoShow" />
  <div v-show="infoShow">
    <slot name="result">
      <Form :label-col="{ span: 4 }">
        <FormItem label="阴影率" class="mb-0 mt-2">
          <span>{{ ratio.shadowRadioText }}</span>
        </FormItem>
        <FormItem label="经度" class="mb-0 mt-2">
          <span>{{ ratio.longitudeText }}</span>
        </FormItem>
        <FormItem label="纬度" class="mb-0 mt-2">
          <span>{{ ratio.latitudeText }}</span>
        </FormItem>
        <FormItem label="高程" class="mb-0 mt-2">
          <span>{{ ratio.heightText }}</span>
        </FormItem>
      </Form>
    </slot>
  </div>
</template>
<script></script>
<script setup>
  import { onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { Slider, Button, Form, Input, Divider } from 'ant-design-vue';
  import getHeightByType from '../utils/getHeightByType';
  const FormItem = Form.Item;
  const emit = defineEmits(['ratio', 'data']);
  const props = defineProps({
    parameter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const ratio = reactive({
    shadowRadioText: null,
    longitudeText: null,
    latitudeText: null,
    heightText: null,
  });
  watch(
    () =>[ props.parameter.endTime, props.parameter.startTime],
    (val) => {
      if (shadowQuery.value._qureyRegion.length != 0) {
        var dateValue = props.parameter.selDate;
        var startTime = new Date(dateValue);
        startTime.setHours(Number(props.parameter.startTime));
        shadowQuery.value.startTime = Cesium.JulianDate.fromDate(startTime);

        var endTime = new Date(dateValue);
        endTime.setHours(Number(props.parameter.endTime));
        shadowQuery.value.endTime = Cesium.JulianDate.fromDate(endTime);
      }
      init();
    },
    { deep: true },
  );
  const infoShow = ref(false);
  const showHide = ref(false);
  const shadowQuery = ref();
  const points = ref([]);
  const markedPoints = ref([]);
  const sunlight = () => {
    init();
    var dateVal = props.parameter.selDate;
    var startTime = new Date(dateVal);
    var endTime = new Date(dateVal);
    var sHour = Number(props.parameter.startTime);
    var eHour = Number(props.parameter.endTime);
    if (sHour > eHour) {
      return;
    }
    var nTimer = 0.0;
    var nIntErvId = setInterval(function () {
      if (sHour < eHour) {
        startTime.setHours(sHour);
        startTime.setMinutes(nTimer);
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
        nTimer += 10.0;

        if (nTimer > 60.0) {
          sHour += 1.0;
          nTimer = 0.0;
        }
      } else {
        clearInterval(nIntErvId);
      }
    }, 20);
  };
  const timeClick = () => {
    init();
  };
  const clear = () => {
    infoShow.value = false;
    clearMarkedPoints();
    handlerPolygon.value && handlerPolygon.value.deactivate();
    if (handlerPolygon.value && handlerPolygon.value.polygon)
      handlerPolygon.value.polygon.show = false;
    if (handlerPolygon.value && handlerPolygon.value.polyline)
      handlerPolygon.value.polyline.show = false;
    shadowQuery.value && shadowQuery.value.clear();
    points.value.length = 0;
    ratio.heightText = null;
    ratio.latitudeText = null;
    ratio.longitudeText = null;
    ratio.shadowRadioText = null;
    showHide.value = false;
  };
  const shadowRadio = () => {
    infoShow.value = true;
    showHide.value = true;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (e) {
      clearMarkedPoints();
      var position1 = viewer.scene.pickPosition(e.position);
      var cartographic = Cesium.Cartographic.fromCartesian(position1);
      var shadowRadio = shadowQuery.value.getShadowRadio(cartographic);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      var height = cartographic.height;
      ratio.heightText = height;
      ratio.latitudeText = latitude;
      ratio.longitudeText = longitude;
      ratio.shadowRadioText = shadowRadio;

      emit('ratio', ratio);
      if (shadowRadio != -1) {
        var markedPoint = viewer.entities.add(
          new Cesium.Entity({
            point: new Cesium.PointGraphics({
              color: new Cesium.Color(1, 1, 0, 0.5),
              pixelSize: 15,
            }),
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
          }),
        );
        markedPoints.value.push(markedPoint);
      } else {
        ratio.heightText = null;
        ratio.latitudeText = null;
        ratio.longitudeText = null;
        ratio.shadowRadioText = null;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  const handlerPolygon = ref();
  const shadowAnalysis = () => {
    init();
    handlerPolygon.value.deactivate();
    handlerPolygon.value.activate();
  };
  const setCurrentTime = () => {
    var endTime = new Date(props.parameter.selDate);
    endTime.setHours(Number(props.parameter.endTime));
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(endTime);
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = true;
  };
  const init = async () => {
    setCurrentTime();
    handlerPolygon.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    handlerPolygon.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });

    handlerPolygon.value.drawEvt.addEventListener(async function (result) {
      points.value.length = 0;
      var polygon = result.object;
      if (!polygon) {
        return;
      }
      polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      var positions = [].concat(polygon.positions);
      positions = Cesium.arrayRemoveDuplicates(positions, Cesium.Cartesian3.equalsEpsilon);
      emit('data', positions);
      //遍历多边形，取出所有点
      for (var i = 0, len = positions.length; i < len; i++) {
        //转化为经纬度，并加入至临时数组
        var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        points.value.push(longitude);
        points.value.push(latitude);
      }
      let dep = await getHeightByType([positions[0]], 'terrain');
      //设置分析对象的开始结束时间
      var dateValue = props.parameter.selDate;
      var startTime = new Date(dateValue);
      startTime.setHours(Number(props.parameter.startTime));
      shadowQuery.value.startTime = Cesium.JulianDate.fromDate(startTime);

      var endTime = new Date(dateValue);
      endTime.setHours(Number(props.parameter.endTime));
      shadowQuery.value.endTime = Cesium.JulianDate.fromDate(endTime);

      //设置当前时间
      setCurrentTime();

      shadowQuery.value.spacing = 10;
      shadowQuery.value.timeInterval = 60;

      //设置分析区域、底部高程和拉伸高度
      var bh = Number(props.parameter.bottomHeight);
      var eh = Number(props.parameter.extrudeHeight);
      shadowQuery.value.qureyRegion({
        position: points.value,
        bottom: dep[0],
        extend: eh,
      });
      shadowQuery.value.build();
    });
  };
  const clearMarkedPoints = () => {
    for (let i = 0; i < markedPoints.value.length; i++) {
      viewer.entities.remove(markedPoints.value[i]);
    }
    markedPoints.value.length = 0;
  };

  const reload = async (e) => {
    clear();
    points.value.length = 0;
    if (e.points.length == 0) return;
    for (var i = 0; i < e.points.length; i++) {
      //转化为经纬度，并加入至临时数组
      var cartographic = Cesium.Cartographic.fromCartesian(e.points[i]);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let h = cartographic.height;

      if (i == 0) {
        viewer.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, h + 888),
        });
      }
      points.value.push(longitude);
      points.value.push(latitude);
    }
    let dep = await getHeightByType([e.points[0]], 'terrain');
    //设置分析对象的开始结束时间
    var dateValue = e.selDate;
    var startTime = new Date(dateValue);
    startTime.setHours(Number(e.startTime));
    shadowQuery.value.startTime = Cesium.JulianDate.fromDate(startTime);

    var endTime = new Date(dateValue);
    endTime.setHours(Number(e.endTime));
    shadowQuery.value.endTime = Cesium.JulianDate.fromDate(endTime);
    setCurrentTime();
    shadowQuery.value.spacing = 10;
    shadowQuery.value.timeInterval = 60;
    var bh = Number(e.bottomHeight);
    var eh = Number(e.extrudeHeight);
    shadowQuery.value.qureyRegion({
      position: points.value,
      bottom: dep[0],
      extend: eh,
    });
    shadowQuery.value.build();
  };

  onMounted(() => {
    viewer.scene.shadowMap.darkness = 0.3; //设置第二重烘焙纹理的效果（明暗程度）
    viewer.scene.skyAtmosphere.brightnessShift = 0.4; //修改大气的亮度
    viewer.scene.debugShowFramesPerSecond = true;
    viewer.scene.hdrEnabled = false;
    viewer.scene.sun.show = true;
    viewer.scene.layers.layerQueue.map((el) => {
      el.shadowType = 2;
    });
    shadowQuery.value = shadowQuery.value ?? new Cesium.ShadowQueryPoints(viewer.scene);
    shadowQuery.value.build();
  });

  defineExpose({
    init,
    reload,
  });

  onBeforeUnmount(() => {
    clear();
  });
</script>
<style scoped>
  .colorLine {
    background: linear-gradient(to right, red, yellow, green, skyblue, blue);
  }
</style>
