<template>
  <slot name="slopeAnalyze" :event="slopeAnalyze">
    <Button type="primary" @click="slopeAnalyze">坡度坡向分析</Button>
  </slot>
  <slot name="clear" :event="clear">
    <Button class="ml-3" @click="clear">清除</Button>
  </slot>
  <Form :label-col="{ span: 4 }">
    <slot name="clipMode">
      <FormItem label="计算模式" class="mb-0 mt-3">
        <RadioGroup v-model:value="clipMode" button-style="solid" @change="selectClass(clipMode)">
          <RadioButton value="calModeall_plane">指定多边形区域</RadioButton>
          <RadioButton value="calModeall_any">全部区域</RadioButton>
          <RadioButton value="calModeall_none">全部区域不参与分析</RadioButton>
        </RadioGroup>
      </FormItem>
    </slot>
    <slot name="wideMinR">
      <FormItem label="坡度区间起" class="mb-0">
        <Slider type="range" v-model:value="parameter.wideMinR" :min="-9999" :max="9999" />
      </FormItem>
    </slot>
    <slot name="wideMaxR">
      <FormItem label="坡度区间终" class="mb-0">
        <Slider type="range" v-model:value="parameter.wideMaxR" :min="-9999" :max="9999" />
      </FormItem>
    </slot>
    <slot name="showStyle">
      <FormItem label="显示样式" class="mb-2">
        <RadioGroup v-model:value="parameter.style" button-style="solid">
          <RadioButton value="showColor">显示填充颜色</RadioButton>
          <RadioButton value="showArrow">显示坡向箭头</RadioButton>
          <RadioButton value="showAll">填充颜色和坡向箭头</RadioButton>
        </RadioGroup>
      </FormItem>
    </slot>

    <slot name="colorTables">
      <FormItem label="颜色条带" class="mb-2">
        <RadioGroup
          v-model:value="colorTables"
          button-style="solid"
          @change="selectColor(colorTables)"
        >
          <RadioButton value="1">颜色1</RadioButton>
          <RadioButton value="2">颜色2</RadioButton>
          <RadioButton value="3">颜色3</RadioButton>
          <RadioButton value="4">颜色4</RadioButton>
          <RadioButton value="5">颜色5</RadioButton>
        </RadioGroup>
      </FormItem>
    </slot>

    <slot name="trans">
      <FormItem label="透明调节" class="mb-0">
        <input
          type="number"
          :key="0.1"
          v-model="parameter.trans"
          :min="0"
          :max="1"
          :step="0.1"
          style="width: 100px"
        />
      </FormItem>
    </slot>
  </Form>
</template>
<script setup>
  import { reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { Slider, Button, Form, RadioGroup, RadioButton, InputNumber } from 'ant-design-vue';
  const FormItem = Form.Item;

  const props = defineProps({
    params: {
      type: Object,
      default: {
        selDate: '2024-1-1',
        startTime: '10',
        endTime: '12',
        bottomHeight: 21,
        extrudeHeight: 21,
        clipMode: 'calModeall_plane',
        wideMinR: 0,
        wideMaxR: 78,
        showStyle: 'showAll',
        colorTables: '1',
        trans: 0.5,
      },
    },
  });

  const parameter = reactive({
    wideMinR: 0,
    wideMaxR: 78,
    trans: 0.5,
    style: 'showAll',
  });
  const clipMode = ref('calModeall_plane');
  const colorTables = ref('1');
  const colorTable = ref();

  const wide = ref();
  const slope = ref();
  const handlerPolygon = ref();
  let points = [];

  watch(
    () => props.params,
    () => {
      parameter.wideMinR = props.params.wideMinR ?? parameter.wideMinR;
      parameter.wideMaxR = props.params.wideMaxR ?? parameter.wideMaxR;
      parameter.trans = props.params.trans ?? parameter.trans;
      parameter.style = props.params.showStyle ?? parameter.style;
      clipMode.value = props.params.clipMode ?? clipMode.value;
      if (clipMode.value) selectClass(clipMode.value);
      colorTables.value = props.params.colorTables ?? colorTables.value;
    },
    {
      deep: true,
    },
  );

  watch(
    () => parameter,
    (val) => {
      if (!slope.value) {
        return;
      }
      slope.value.MinVisibleValue = Number(val.wideMinR);
      slope.value.MaxVisibleValue = Number(val.wideMaxR);
      slope.value.Opacity = Number(val.trans);
      switch (val.style) {
        case 'showColor':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
          break;
        case 'showArrow':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
          break;
        case 'showAll':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
          break;
        default:
          break;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope.value,
        analysisMode: wide.value,
      };
    },
    { deep: true },
  );

  const selectColor = (v) => {
    if (!colorTable.value) return;
    colorTable.value.remove(0);
    colorTable.value.remove(20);
    colorTable.value.remove(30);
    colorTable.value.remove(50);
    colorTable.value.remove(80);
    switch (v) {
      case '1':
        colorTable.value.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
        colorTable.value.insert(20, new Cesium.Color(0, 161 / 255, 1));
        colorTable.value.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
        colorTable.value.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
        colorTable.value.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
        break;
      case '2':
        colorTable.value.insert(0, new Cesium.Color(162 / 255, 251 / 255, 194 / 255));
        colorTable.value.insert(20, new Cesium.Color(180 / 255, 200 / 255, 170 / 255));
        colorTable.value.insert(30, new Cesium.Color(200 / 255, 160 / 255, 130 / 255));
        colorTable.value.insert(50, new Cesium.Color(225 / 255, 130 / 255, 130 / 255));
        colorTable.value.insert(80, new Cesium.Color(1, 103 / 255, 103 / 255));
        break;
      case '3':
        colorTable.value.insert(0, new Cesium.Color(230 / 255, 198 / 255, 1));
        colorTable.value.insert(20, new Cesium.Color(210 / 255, 150 / 255, 1));
        colorTable.value.insert(30, new Cesium.Color(190 / 255, 100 / 255, 1));
        colorTable.value.insert(50, new Cesium.Color(165, 50 / 255, 1));
        colorTable.value.insert(80, new Cesium.Color(157 / 255, 0, 1));
        break;
      case '4':
        colorTable.value.insert(0, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.value.insert(20, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.value.insert(30, new Cesium.Color(70 / 255, 116 / 255, 200 / 255));
        colorTable.value.insert(50, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
        colorTable.value.insert(80, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
        break;
      case '5':
        colorTable.value.insert(0, new Cesium.Color(186 / 255, 1, 190 / 255));
        colorTable.value.insert(20, new Cesium.Color(186 / 255, 1, 180 / 255));
        colorTable.value.insert(30, new Cesium.Color(106 / 255, 255 / 255, 170 / 255));
        colorTable.value.insert(50, new Cesium.Color(26 / 255, 255 / 255, 160 / 255));
        colorTable.value.insert(80, new Cesium.Color(26 / 255, 255 / 255, 156 / 255));
        break;
      default:
        break;
    }
    slope.value.ColorTable = colorTable.value;
    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope.value,
      analysisMode: wide.value,
    };
  };

  const clear = () => {
    try {
      points = [];
      if (!slope.value) return;
      wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope.value,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
      };
      if (handlerPolygon.value) {
        handlerPolygon.value.polygon.show = false;
        handlerPolygon.value.polyline.show = false;
        handlerPolygon.value.clear();
        handlerPolygon.value = undefined;
      }
      slope.value = undefined;
    } catch (error) {}
  };

  const slopeAnalyze = () => {
    clear();
    if (handlerPolygon.value) {
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      handlerPolygon.value.clear();
    }
    slope.value = new Cesium.SlopeSetting();
    slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
    slope.value.MaxVisibleValue = parameter.wideMaxR;
    slope.value.MinVisibleValue = parameter.wideMinR;
    colorTable.value = new Cesium.ColorTable();
    colorTable.value.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
    colorTable.value.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
    colorTable.value.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
    colorTable.value.insert(20, new Cesium.Color(0, 161 / 255, 1));
    colorTable.value.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
    wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
    slope.value.ColorTable = colorTable.value;
    slope.value.Opacity = 0.5;
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
      var array = [].concat(result.object.positions);
      points = result.object.positions;
      var positions = [];
      for (var i = 0; i < array.length; i++) {
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
      slope.value.CoverageArea = positions;
      selectClass(clipMode.value);
      handlerPolygon.value.polygon.show = false;
      handlerPolygon.value.polyline.show = false;
      handlerPolygon.value.deactivate();
      handlerPolygon.value.activate();
    });
    handlerPolygon.value.activate();
  };

  const selectClass = (value) => {
    switch (value) {
      case 'calModeall_plane':
        wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        break;
      case 'calModeall_any':
        wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
        break;
      case 'calModeall_none':
        wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
        break;
      default:
        break;
    }
    if (value === 'calModeall_plane' && slope.value.CoverageArea.length === 0) {
      wide.value = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
    }

    console.log({
      slopeSetting: slope.value,
      analysisMode: wide.value,
    });

    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope.value,
      analysisMode: wide.value,
    };
  };

  const getParams = () => {
    return {
      ...parameter,
      clipMode: clipMode.value,
      colorTables: colorTables.value,
      points,
    };
  };

  const setParams = (e) => {
    try {
      clear();
      // Object.assign(parameter, e);
      colorTables.value = e.colorTables;
      clipMode.value = e.clipMode;
      slope.value = slope.value ?? new Cesium.SlopeSetting();
      slope.value.MaxVisibleValue = e.wideMaxR;
      slope.value.MinVisibleValue = e.wideMinR;
      colorTable.value = colorTable.value ?? new Cesium.ColorTable();
      switch (e.style) {
        case 'showColor':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
          break;
        case 'showArrow':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
          break;
        case 'showAll':
          slope.value.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
          break;
        default:
          break;
      }
      let positions = [];
      for (let i = 0; i < e.points.length; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(e.points[i]);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let h = cartographic.height;
        if (i == 0) {
          viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, h + 1588),
          });
        }
        if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }
      slope.value.CoverageArea = positions;
      selectColor(e.colorTables);

      selectClass(e.clipMode);

      slope.value.Opacity = e.trans;
      positions = [];
      colorTables.value = e.colorTables;
      clipMode.value = e.clipMode;
    } catch (error) {
      console.log('error', error);
    }
  };

  defineExpose({ getParams, setParams });

  onBeforeUnmount(() => {
    clear();
  });
</script>
