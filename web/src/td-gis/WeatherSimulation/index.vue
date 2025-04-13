<template>
  <div>
    <slot name="weatherMode">
      <RadioGroup v-model:value="weatherMode" button-style="solid" @change="modeChangeHandler">
        <RadioButton value="rain">雨天模拟</RadioButton>
        <RadioButton value="snow">雪天模拟</RadioButton>
        <RadioButton value="fog">雾天模拟</RadioButton>
        <RadioButton value="startField">风场模拟</RadioButton>
      </RadioGroup>
    </slot>

    <span @click="clear('true')">
      <slot name="clear">
        <Button type="primary" class="ml-4 mb-1">清除</Button>
      </slot>
    </span>

    <div id="toolbar" class="tool-bar param-container" v-show="weatherMode == 'startField'">
      <div class="flex items-center">
        <label>粒子大小：</label>
        <Slider
          id="test"
          v-model:value="parameter.particleSize"
          :min="0"
          :max="10"
          :step="2"
          class="w-2/3 ml-4"
        />
      </div>
      <div class="flex items-center">
        <label>生命周期：</label>
        <Slider
          id="test"
          v-model:value="parameter.particleLife"
          :min="1"
          :max="20"
          :step="1"
          class="w-2/3 ml-4"
        />
      </div>
      <div class="flex items-center">
        <label>粒子密度：</label>
        <Slider
          id="test"
          v-model:value="parameter.particleDensity"
          :min="0.1"
          :max="3"
          :step="0.1"
          class="w-2/3 ml-4"
        />
      </div>
      <div class="flex items-center">
        <label>粒子速度：</label>
        <Slider
          id="test"
          v-model:value="parameter.particleVelocityScale"
          :min="0.1"
          :max="5"
          :step="0.1"
          class="w-2/3 ml-4"
        />
      </div>
      <div class="flex items-center">
        <label>图层可见性：</label>
        <Checkbox v-model:checked="parameter.fieldLayerVisible" />
        <label class="ml-4">场景泛光：</label>
        <Checkbox v-model:checked="parameter.show" />
      </div>
      <div class="flex items-center">
        <label>亮度阈值：</label>
        <Slider
          id="test"
          v-model:value="parameter.threshold"
          :min="0"
          :max="1"
          :step="0.1"
          class="w-2/3 ml-4"
        />
      </div>
      <div class="flex items-center">
        <label>泛光强度：</label>
        <Slider
          id="test"
          v-model:value="parameter.bloomIntensity"
          :min="0"
          :max="10"
          :step="0.1"
          class="w-2/3 ml-4"
        />
      </div>
      <div @click="changeFieldData">
        <slot name="changeFieldData">
          <Button type="primary" class="w-full mt-1"> 切换数据 </Button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import { Button, RadioGroup, RadioButton, Checkbox, Slider } from 'ant-design-vue';
  import axios from 'axios';
  const weatherMode = ref(null);
  const particleWindInverseField = ref([]);
  const particleWindField = ref([]);
  const parameter = reactive({
    particleSize: 1.2,
    particleLife: 5,
    particleDensity: 1,
    particleVelocityScale: 0.4,
    fieldLayerVisible: true,
    show: true,
    threshold: 0.5,
    bloomIntensity: 2,
  });
  const fieldLayer = ref();
  const dataChanged = ref();
  const props = defineProps({
    startFieldPromise: {
      type: String,
      default: 'http://www.supermapol.com/realspace/services/3D-ShiJieGuoJiaBianJie/rest/realspace',
    },
    startFieldUrl: {
      type: String,
      default: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/winds.json',
    },
    snowGroundSetPBR: {
      type: String,
      default:
        'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/SampleData/pbr/MaterialJson/M_Brick_Clay_Old_.json',
    },
    snowBuildingSetPBR: {
      type: String,
      default:
        'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/SampleData/pbr/MaterialJson/M_Brick_Clay_Old_.json',
    },
    rainGroundSetPBR: {
      type: String,
      default:
        'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/SampleData/pbr/MaterialJson/rain_.json',
    },
    rainBuildingSetPBR: {
      type: String,
      default:
        'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/SampleData/pbr/MaterialJson/rain_.json',
    },
  });
  watch(
    () => parameter,
    (val) => {
      if (!fieldLayer.value) {
        return;
      }

      fieldLayer.value.particleVelocityFieldEffect.particleSize = parameter.particleSize;
      var lifeRange = [parameter.particleLife * 1000.0, parameter.particleLife * 1000.0 + 5000.0];
      fieldLayer.value.particleVelocityFieldEffect.particleLifeRange = lifeRange;
      fieldLayer.value.particleVelocityFieldEffect.paricleCountPerDegree =
        parameter.particleDensity;
      fieldLayer.value.particleVelocityFieldEffect.velocityScale =
        parameter.particleVelocityScale * 100.0;
      fieldLayer.value.visible = parameter.fieldLayerVisible;
      viewer.scene.bloomEffect.show = parameter.show;
      viewer.scene.bloomEffect.threshold = parameter.threshold;
      viewer.scene.bloomEffect.bloomIntensity = parameter.bloomIntensity;
    },
    { deep: true },
  );
  const changeFieldData = () => {
    if (dataChanged.value) {
      fieldLayer.value.fieldData = particleWindField.value;
    } else {
      fieldLayer.value.fieldData = particleWindInverseField.value;
    }
    dataChanged.value = !dataChanged.value;
  };
  const startField = () => {
    viewer.scene.skyBox.show = false;
    viewer.scene.sun.show = true;
    viewer.scene.bloomEffect.show = true; //启用泛光效果
    viewer.scene.bloomEffect.threshold = parameter.threshold;
    viewer.scene.bloomEffect.bloomIntensity = parameter.bloomIntensity;
    var promise = viewer.scene.open(props.startFieldPromise);

    Cesium.when.all(promise, function (layers) {
      var layer1 = viewer.scene.layers.find('Country_Label@World');
      var layerEffect1 = layer1.effect;
      layerEffect1.setValue(
        'Color',
        new Cesium.Color((255 * 1.5) / 255, (255 * 1.5) / 255, (255 * 1.5) / 255, 1),
      );
      layerEffect1.setValue('Width', 1.3);

      var layer3 = viewer.scene.layers.find('Ocean_Label@World');
      var layerEffect3 = layer3.effect;
      layerEffect3.setValue(
        'Color',
        new Cesium.Color((255 * 1.5) / 255, (255 * 1.5) / 255, (255 * 1.5) / 255, 1),
      );
      layerEffect3.setValue('Width', 1.3);
    });

    var colorTable = new Cesium.ColorTable();
    colorTable.insert(2, new Cesium.Color(254 / 255, 224 / 255, 139 / 255, 0.95));
    colorTable.insert(2, new Cesium.Color(171 / 255, 221 / 255, 164 / 255, 0.95));
    colorTable.insert(2, new Cesium.Color(104 / 255, 196 / 255, 160 / 255, 0.95));
    colorTable.insert(4, new Cesium.Color(44 / 255, 185 / 255, 156 / 255, 0.95));
    colorTable.insert(4, new Cesium.Color(25 / 255, 169 / 255, 178 / 255, 0.95));
    colorTable.insert(7, new Cesium.Color(50 / 255, 136 / 255, 189 / 255, 0.95));
    colorTable.insert(10, new Cesium.Color(31 / 255, 110 / 255, 183 / 255, 0.95));
    colorTable.insert(15, new Cesium.Color(5 / 255, 98 / 255, 184 / 255, 0.95));
    fieldLayer.value = new Cesium.FieldLayer3D(viewer.scene.context); //场数据图层
    fieldLayer.value.particleVelocityFieldEffect.velocityScale = 0.4 * 100.0; //初始化效果
    fieldLayer.value.particleVelocityFieldEffect.particleSize = 1.2;
    fieldLayer.value.particleVelocityFieldEffect.paricleCountPerDegree = 1.0;
    viewer.scene.primitives.add(fieldLayer.value); //添加场图层
    fieldLayer.value.particleVelocityFieldEffect.colorTable = colorTable;
    axios({
      url: props.startFieldUrl,
    }).then((data) => {
      var p = 0;
      for (var j = 0; j < data.data.ny; j++) {
        particleWindField.value[j] = [];
        particleWindInverseField.value[j] = [];
        for (var i = 0; i < data.data.nx; i++, p++) {
          particleWindField.value[j][i] = data.data.data[p];
          particleWindInverseField.value[j][i] = [-data.data.data[p][0], -data.data.data[p][1]];
        }
      }
      var option = {
        longitude: '84.87139138897824',
        latitude: '44.74753842252021',
        uwnd: '100',
        vwnd: '100',
      };
      fieldLayer.value.NetCDFData = option;
    });
    setTimeout(() => {
      fieldLayer.value.fieldData = particleWindField.value;
    }, 2000);
  };
  const groundLayer = ref();
  const buildingLayer = ref();
  const fog = () => {
    init();
    viewer.scene.postProcessStages.fog.enabled = true;
    viewer.scene.postProcessStages.fog.uniforms.density = 1000000;
    viewer.scene.postProcessStages.fog.uniforms.angle = 1000;
    viewer.scene.postProcessStages.fog.uniforms.speed = 3000;
  };
  const snow = () => {
    init();
    viewer.scene.postProcessStages.snow.enabled = true;
    viewer.scene.postProcessStages.snow.uniforms.density = 10;
    viewer.scene.postProcessStages.snow.uniforms.angle = 0;
    viewer.scene.postProcessStages.snow.uniforms.speed = 3;
    groundLayer.value.setPBRMaterialFromJSON(props.snowGroundSetPBR);
    buildingLayer.value.setPBRMaterialFromJSON(props.snowBuildingSetPBR);

    let intervalValue = setInterval(() => {
      if (buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.snowEffect !== undefined) {
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage += 0.0006;
        groundLayer.value._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage += 0.0006;
      }
      if (
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.snowEffect !== undefined &&
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage - 1 > 0
      )
        clearInterval(intervalValue);
    }, 30);
  };
  const rain = () => {
    init();
    viewer.scene.postProcessStages.rain.enabled = true;
    viewer.scene.postProcessStages.rain.uniforms.angle = 6;
    viewer.scene.postProcessStages.rain.uniforms.speed = 6;
    groundLayer.value.setPBRMaterialFromJSON(props.rainGroundSetPBR);
    buildingLayer.value.setPBRMaterialFromJSON(props.rainBuildingSetPBR);
    let recordRain = 0;
    let intervalValue = setInterval(() => {
      if (
        groundLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined &&
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined
      ) {
        if (recordRain === 0) {
          groundLayer.value._PBRMaterialParams.pbrMetallicRoughness.intensityScale = 1.5;
          buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.intensityScale = 1.5;
          viewer.scene.layers.layerQueue[0]._PBRMaterialParams.pbrMetallicRoughness.intensityScale = 1.5;
          recordRain = 1;
        }
        groundLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor += 0.0005;
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor += 0.0005;
      }
      if (
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined &&
        buildingLayer.value._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor -
          0.85 >
          0
      )
        clearInterval(intervalValue);
    }, 40);
  };
  const clear = (clearType) => {
    if (clearType) {
      weatherMode.value = null;
    }
    viewer.scene.postProcessStages.snow.enabled = false;
    viewer.scene.postProcessStages.rain.enabled = false;
    viewer.scene.postProcessStages.fog.enabled = false;
    if (groundLayer.value) {
      groundLayer.value.removePBRMaterial();
    }
    if (buildingLayer.value) {
      buildingLayer.value.removePBRMaterial();
    }

    if (fieldLayer.value) {
      fieldLayer.value.visible = false;
    }

    viewer.scene.bloomEffect.show = false;
  };
  const init = () => {
    Cesium.MemoryManager.setCacheSize(2024);
  };

  const modeChangeHandler = (type) => {
    clear();
    switch (type.target.value) {
      case 'rain':
        rain();
        break;
      case 'snow':
        snow();
        break;
      case 'fog':
        fog();
        break;
      case 'startField':
        startField();
        break;
      default:
        break;
    }
  };
  onMounted(() => {});

  defineExpose({
    clear,
  });
</script>
