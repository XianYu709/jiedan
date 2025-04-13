<template>
  <Form :label-col="{ span: 4 }">
    <slot name="start" :event="active">
      <Button type="primary" @click="active">分析</Button>
    </slot>
    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>

    <slot name="longitude">
      <FormItem label="X" class="mb-0 mt-3">
        <input
          :disabled="!parameter.longitude"
          v-model="parameter.longitude"
          step="0.0001"
          class="w-full"
          type="number"
        />
      </FormItem>
    </slot>
    <slot name="latitude">
      <FormItem label="Y" class="mb-0 mt-3">
        <input
          :disabled="!parameter.latitude"
          v-model="parameter.latitude"
          step="0.0001"
          class="w-full"
          type="number"
        />
      </FormItem>
    </slot>
    <slot name="height">
      <FormItem label="Z" class="mb-0 mt-3">
        <input
          :disabled="!parameter.longitude"
          v-model="parameter.height"
          min="0"
          step="0.00001"
          class="w-full"
          type="number"
        />
      </FormItem>
    </slot>

    <slot name="obServer">
      <FormItem label="观察半径" class="mb-0">
        <Slider v-model:value="parameter.obServer" :max="1000" :min="1" :step="1" />
      </FormItem>
    </slot>
    <slot name="StartingAngle">
      <FormItem label="起始角度" class="mb-0 mt-3">
        <Slider v-model:value="parameter.StartingAngle" :max="360" :min="0" :step="5" />
      </FormItem>
    </slot>
    <slot name="EndAngle">
      <FormItem label="终止角度" class="mb-0 mt-3">
        <Slider v-model:value="parameter.EndAngle" :max="360" :min="0" :step="1" />
      </FormItem>
    </slot>

    <slot name="VisibleColor">
      <FormItem label="可视部分颜色" class="mb-0 mt-3">
        <input v-model="parameter.VisibleColor" type="color" />
      </FormItem>
    </slot>
    <slot name="HiddenColor">
      <FormItem label="隐藏部分颜色" class="mb-0 mt-3">
        <input v-model="parameter.HiddenColor" type="color" />
      </FormItem>
    </slot>
    <slot name="calMode1">
      <FormItem label="显示类型" class="mb-0 mt-3">
        <RadioGroup v-model:value="parameter.calMode1" button-style="solid">
          <RadioButton value="0">可视部分</RadioButton>
          <RadioButton value="1">隐藏部分</RadioButton>
          <RadioButton value="2">全部显示</RadioButton>
        </RadioGroup>
      </FormItem>
    </slot>
    <slot name="isClosed">
      <FormItem label="是否封口" class="mb-0 mt-3">
        <Checkbox v-model="parameter.isClosed" />
        <span style="margin-left: 5px; font-size: 10px">(当为360度闭合半球时设置无效)</span>
      </FormItem>
    </slot>
  </Form>
</template>
<script setup>
  import { onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { Slider, Button, Form, RadioGroup, RadioButton, Checkbox } from 'ant-design-vue';

  const FormItem = Form.Item;
  const props = defineProps({
    params: {
      type: Object,
      default: {
        longitude: 0,
        latitude: 0,
        height: 0,
        obServer: 100,
        StartingAngle: 0,
        EndAngle: 360,
        VisibleColor: '#00B7EF',
        HiddenColor: '#E36C09',
        calMode1: '2',
        isClosed: false,
      },
    },
  });
  const parameter = reactive({
    longitude: 0,
    latitude: 0,
    height: 0,
    obServer: 100,
    StartingAngle: 0,
    EndAngle: 360,
    VisibleColor: '#00B7EF',
    HiddenColor: '#E36C09',
    calMode1: '2',
    isClosed: false,
  });
  const viewDome = ref();
  const handler = ref();
  const iTime = ref();
  const Time = ref();
  let entities = [];

  const active = () => {
    init();
    handler.value = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.value.setInputAction(function (e) {
      viewer.enableCursorStyle = true;
      //获取点击位置笛卡尔坐标
      var position = viewer.scene.pickPosition(e.position);
      //将笛卡尔坐标转化为经纬度坐标
      var cartographic = Cesium.Cartographic.fromCartesian(position);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;
      if (height < 0) {
        height = 0;
      }
      //点击位置同步到显示框
      parameter.longitude = longitude;
      parameter.latitude = latitude;
      parameter.height = height;
      addPoint();
      viewDome.value.viewPosition = position;
      viewDome.value.build();
      handler.value.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  const clear = () => {
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    viewDome.value && viewDome.value.destroy();
    viewDome.value = undefined;
    handler.value && handler.value.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  const init = () => {
    viewDome.value = viewDome.value ?? new Cesium.ViewDome(viewer.scene); //构造新的开敞度分析对象
    viewDome.value.distance = Number(parameter.obServer);
    viewDome.value.domeType = parameter.calMode1;
    let VisibleColor = Cesium.Color.fromCssColorString(parameter.VisibleColor);
    let HiddenColor = Cesium.Color.fromCssColorString(parameter.HiddenColor);
    viewDome.value.visibleAreaColor = Cesium.Color.fromAlpha(VisibleColor, 0.5); //可视部颜色
    viewDome.value.hiddenAreaColor = Cesium.Color.fromAlpha(HiddenColor, 0.5); //隐藏部分颜色
    viewDome.value.startAngle = Number(parameter.StartingAngle);
    viewDome.value.endAngle = Number(parameter.EndAngle);
    viewDome.value.isClosed = parameter.isClosed;
  };

  const move = () => {
    //改变经纬度动态移动
    if (!viewDome.value) {
      return;
    }
    if (parameter.longitude && parameter.latitude && parameter.height) {
      viewDome.value.viewPosition = [parameter.longitude, parameter.latitude, parameter.height];
    }
    clearTimeout(Time.value); //防止点击多次，执行一次
    Time.value = setTimeout(function () {
      viewDome.value.startAngle = Number(parameter.StartingAngle); //加这个才起作用
    }, 500);
  };

  const addPoint = () => {
    //添加点
    if (
      parameter.longitude == undefined ||
      parameter.latitude == undefined ||
      parameter.height == undefined
    ) {
      return;
    }
    //首先移除之前添加的点
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];

    //在位置添加对应点
    let temp = new Cesium.Entity({
      point: new Cesium.PointGraphics({
        color: new Cesium.Color(1, 0, 0),
        pixelSize: 6,
        outlineColor: new Cesium.Color(0, 1, 1),
      }),
      position: Cesium.Cartesian3.fromDegrees(
        parameter.longitude,
        parameter.latitude,
        parameter.height + 0.5,
      ),
    });
    viewer.entities.add(temp);
    entities.push(temp);
  };

  onMounted(() => {});

  watch(
    () => props.params,
    () => {
      parameter.longitude = props.params.longitude ?? parameter.longitude;
      parameter.latitude = props.params.latitude ?? parameter.latitude;
      parameter.height = props.params.height ?? parameter.height;
      parameter.obServer = props.params.obServer ?? parameter.obServer;
      parameter.StartingAngle = props.params.StartingAngle ?? parameter.StartingAngle;
      parameter.EndAngle = props.params.EndAngle ?? parameter.EndAngle;
      parameter.VisibleColor = props.params.VisibleColor ?? parameter.VisibleColor;
      parameter.HiddenColor = props.params.HiddenColor ?? parameter.HiddenColor;
      parameter.calMode1 = props.params.calMode1 ?? parameter.calMode1;
      parameter.isClosed = props.params.isClosed ?? parameter.isClosed;
    },
    { immediate: true, deep: true },
  );
  watch(
    parameter,
    (val) => {
      if(!viewDome.value){
        return
      }
      move();
      viewDome.value.visibleAreaColor = Cesium.Color.fromAlpha(
        Cesium.Color.fromCssColorString(parameter.VisibleColor),
        0.5,
      );
      viewDome.value.distance = Number(parameter.obServer);
      viewDome.value.startAngle = Number(parameter.StartingAngle);
      viewDome.value.endAngle = Number(parameter.EndAngle);
      viewDome.value.hiddenAreaColor = Cesium.Color.fromAlpha(
        Cesium.Color.fromCssColorString(parameter.HiddenColor),
        0.5,
      );
      viewDome.value.isClosed = parameter.isClosed;
      var ViewDomeType;
      switch (val.calMode1) {
        case '0':
          ViewDomeType = Cesium.ViewDomeType.VISIBLEDOME;
          break;
        case '1':
          ViewDomeType = Cesium.ViewDomeType.HIDDENDOME;
          break;
        case '2':
          ViewDomeType = Cesium.ViewDomeType.ALLDOME;
          break;
        default:
          break;
      }
      viewDome.value.domeType = ViewDomeType;
    },
    { deep: true },
  );

  const getParams = () => {
    return {
      longitude: parameter.longitude,
      latitude: parameter.latitude,
      height: parameter.height,
      obServer: parameter.obServer,
      StartingAngle: parameter.StartingAngle,
      EndAngle: parameter.EndAngle,
      VisibleColor: parameter.VisibleColor,
      HiddenColor: parameter.HiddenColor,
      calMode1: parameter.calMode1,
      isClosed: parameter.isClosed,
    };
  };

  const setParams = (e) => {
    try {
      Object.assign(parameter, e);
      init();
      if (e.longitude && e.latitude && e.height) {
        viewer.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height + 888),
        });
      }
      viewDome.value.build();
    } catch (error) {
      console.log(error);
    }
  };

  defineExpose({ getParams, setParams });

  onBeforeUnmount(() => {
    clear();
  });
</script>
