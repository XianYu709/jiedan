<template>
  <div>
    <div class="scenes">
      <img
        v-for="(item, index) in s3mModels"
        :class="item.active ? 'imageStyleActive' : 'imageStyle'"
        :key="index"
        :style="styles"
        :src="item.thumbnail"
        @click="imgClick(item)"
      />
    </div>
    <slot name="pitch">
      <div class="flex mt-3">
        <label>绕X轴旋转(° ) </label>
        <Slider
          id="test"
          v-model:value="parameter.pitch"
          :min="0"
          :max="360"
          :step="1.0"
          class="w-2/3"
        />
      </div>
    </slot>
    <slot name="roll">
      <div class="flex">
        <label>绕Y轴旋转(° ) </label>
        <Slider
          id="test"
          v-model:value="parameter.roll"
          :min="0"
          :max="360"
          :step="1.0"
          class="w-2/3"
        />
      </div>
    </slot>
    <slot name="heading">
      <div class="flex">
        <label>绕Z轴旋转(° ) </label>
        <Slider
          id="test"
          v-model:value="parameter.heading"
          :min="0"
          :max="360"
          :step="1.0"
          class="w-2/3"
        />
      </div>
    </slot>

    <div>
      <slot name="positionX">
        <div class="positionAdjust flex">
          <label>X移动: </label>
          <Slider id="test" v-model:value="parameter.positionX" :min="-100" class="w-2/3" />
        </div>
      </slot>
      <slot name="positionY">
        <div class="positionAdjust flex">
          <label>Y移动: </label>
          <Slider id="test" v-model:value="parameter.positionY" :min="-100" class="w-2/3" />
        </div>
      </slot>
      <slot name="positionZ">
        <div class="positionAdjust flex">
          <label>Z移动: </label>
          <Slider id="test" v-model:value="parameter.positionZ" :min="-100" class="w-2/3" />
        </div>
      </slot>
      <slot name="scale">
        <div class="flex">
          <label>缩放: </label>
          <Slider
            id="test"
            v-model:value="parameter.scale"
            :min="1"
            :max="10"
            :step="0.1"
            class="w-2/3"
          />
        </div>
      </slot>
      <div class="flex justify-end">
        <div @click="deletes">
          <slot name="deletes">
            <Button class="ml-4">清除</Button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { Slider, Button } from 'ant-design-vue';

  const s3mModels = ref();
  const props = defineProps({
    s3mModels: {
      type: Object,
      default: () => {
        return [];
      },
    },
    iconSize: {
      type: Number,
      default: 40,
    },
    params: {
      type: Object,
      default: {
        pitch: 1,
        roll: 1,
        heading: 1,
        scale: 1,
        colorPicker: '',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
      },
    },
  });
  const styles = computed(() => {
    return { width: props.iconSize + 'px' };
  });
  const defaultUrl = [];
  const handlerPoint = ref();
  const s3mInstanceColc = ref();
  let entities = [];

  const updateEntity = () => {
    let currentObj = entities.find((item) => item.uniId == viewer.selectedEntity.primitive.id);
    let currentIns = s3mInstanceColc.value.getInstance(currentObj.modelUrl, currentObj.uniId);
    Object.assign(currentObj, {
      hpr: currentIns.hpr,
      scale: currentIns.scale,
      position: currentIns.position,
      params: { ...parameter },
    });
  };

  const parameter = reactive({
    pitch: 1,
    roll: 1,
    heading: 1,
    scale: 1,
    colorPicker: '',
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  });
  watch(
    () => props.params,
    () => {
      parameter.pitch = props.params.pitch ?? parameter.pitch;
      parameter.roll = props.params.roll ?? parameter.roll;
      parameter.heading = props.params.heading ?? parameter.heading;
      parameter.scale = props.params.scale ?? parameter.scale;
      parameter.colorPicker = props.params.colorPicker ?? parameter.colorPicker;
      parameter.positionX = props.params.positionX ?? parameter.positionX;
      parameter.positionY = props.params.positionY ?? parameter.positionY;
      parameter.positionZ = props.params.positionZ ?? parameter.positionZ;
    },
    { deep: true, immediate: true },
  );
  watch(
    () => parameter.positionX,
    () => {
      positionXClick();
    },
    { deep: true },
  );
  watch(
    () => parameter.positionY,
    () => {
      positionYClick();
    },
    { deep: true },
  );
  watch(
    () => parameter.positionZ,
    () => {
      positionZClick();
    },
    { deep: true },
  );
  watch(
    () => parameter,
    (val) => {
      if (viewer.selectedEntity) {
        var instance = viewer.selectedEntity.primitive;
        var index = viewer.selectedEntity.id;
        instance.updateRotation(
          new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(val.heading),
            Cesium.Math.toRadians(val.pitch),
            Cesium.Math.toRadians(val.roll),
          ),
          index,
        );
        instance.updateScale(
          new Cesium.Cartesian3(parseFloat(val.scale), parseFloat(val.scale), parseFloat(val.scale)),
          index,
        );
        updateEntity();
      }
    },
    { deep: true },
  );

  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction((event) => {
    let ray = viewer.scene.pick(event.position);
    if (ray && entities.length > 0) {
      let currentObj = entities.find((item) => {
        return item.uniId == `${ray.primitive.id}`;
      });
      if (currentObj) Object.assign(parameter, currentObj.params);
      currentObj = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  const positionX = ref(0);
  const positionXClick = () => {
    var instance = viewer.selectedEntity.primitive;
    var index = viewer.selectedEntity.id;
    instance.updateRotation(
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(parameter.heading),
        Cesium.Math.toRadians(parameter.pitch),
        Cesium.Math.toRadians(parameter.roll),
      ),
      index,
    );
    instance.updateScale(
      new Cesium.Cartesian3(
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
      ),
      index,
    );
    var enu = Cesium.Transforms.eastNorthUpToFixedFrame(
      instance.position,
      Cesium.Ellipsoid.WGS84,
      new Cesium.Matrix4(),
    );
    if (parameter.positionX > positionX.value) {
      var offset = new Cesium.Cartesian3(1, 0, 0);
    } else {
      var offset = new Cesium.Cartesian3(-1, 0, 0);
    }
    instance.updatePosition(Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3()));
    positionX.value = parameter.positionX;
  };
  const positionY = ref(0);
  const positionYClick = () => {
    var instance = viewer.selectedEntity.primitive;
    var index = viewer.selectedEntity.id;
    instance.updateRotation(
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(parameter.heading),
        Cesium.Math.toRadians(parameter.pitch),
        Cesium.Math.toRadians(parameter.roll),
      ),
      index,
    );
    instance.updateScale(
      new Cesium.Cartesian3(
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
      ),
      index,
    );
    var enu = Cesium.Transforms.eastNorthUpToFixedFrame(
      instance.position,
      Cesium.Ellipsoid.WGS84,
      new Cesium.Matrix4(),
    );
    if (parameter.positionY >= positionY.value) {
      var offset = new Cesium.Cartesian3(0, 1, 0);
    } else {
      var offset = new Cesium.Cartesian3(0, -1, 0);
    }
    instance.updatePosition(Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3()));
    positionY.value = parameter.positionY;
  };
  const positionZ = ref(0);
  const positionZClick = () => {
    var instance = viewer.selectedEntity.primitive;
    var index = viewer.selectedEntity.id;
    instance.updateRotation(
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(parameter.heading),
        Cesium.Math.toRadians(parameter.pitch),
        Cesium.Math.toRadians(parameter.roll),
      ),
      index,
    );
    instance.updateScale(
      new Cesium.Cartesian3(
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
        parseFloat(parameter.scale),
      ),
      index,
    );
    var enu = Cesium.Transforms.eastNorthUpToFixedFrame(
      instance.position,
      Cesium.Ellipsoid.WGS84,
      new Cesium.Matrix4(),
    );
    if (parameter.positionZ >= positionZ.value) {
      var offset = new Cesium.Cartesian3(0, 0, 1);
    } else {
      var offset = new Cesium.Cartesian3(0, 0, -1);
    }
    instance.updatePosition(Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3()));
    positionZ.value = parameter.positionZ;
  };
  const deletes = () => {
    if (viewer.selectedEntity) {
      var instance = viewer.selectedEntity.primitive;
      var index = viewer.selectedEntity.id;
      instance.updateScale(new Cesium.Cartesian3(0, 0, 0), index);
    }
  };
  const imgClick = (item) => {
    // Object.assign(parameter, {
    //   pitch: 1,
    //   roll: 1,
    //   heading: 1,
    //   scale: 1,
    //   colorPicker: '',
    //   positionX: 0,
    //   positionY: 0,
    //   positionZ: 0,
    // });
    s3mModels.value.map((el) => {
      el.active = false;
    });
    item.active = true;
    defaultUrl.value = item.path;
    handlerPoint.value && handlerPoint.value.activate();
  };

  const init = () => {
    handlerPoint.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    handlerPoint.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerPoint.value.movingEvt.addEventListener(function (windowPosition) {
      if (windowPosition.x < 210 && windowPosition.y < 120) {
        return;
      }
    });
    s3mInstanceColc.value = new Cesium.S3MInstanceCollection(viewer.scene._context);
    viewer.scene.primitives.add(s3mInstanceColc.value);
    handlerPoint.value.drawEvt.addEventListener(function (result) {
      handlerPoint.value.clear();
      var point = result.object;
      var color = Cesium.Color.WHITE;
      s3mInstanceColc.value.add(defaultUrl.value, {
        position: point.position,
        hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
        scale: new Cesium.Cartesian3(1, 1, 1),
        color: color,
        id: `${point.position.x}`,
      });

      entities.push({
        uniId: `${point.position.x}`,
        position: point.position,
        hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
        scale: new Cesium.Cartesian3(1, 1, 1),
        color: Cesium.Color.WHITE,
        modelUrl: defaultUrl.value,
        params: { ...parameter },
      });

      var colorStr = color.toCssColorString();
      viewer.selectedEntityChanged.addEventListener(function (entity) {});

      handlerPoint.value && handlerPoint.value.deactivate();
    });
  };

  s3mModels.value = props.s3mModels;
  onMounted(() => {
    init();
  });

  const getParams = () => {
    return entities;
  };

  const setParams = (e) => {
    entities = [...entities, ...e];
    e.forEach((item) => {
      s3mInstanceColc.value.add(item.modelUrl, {
        position: item.position,
        hpr: item.hpr,
        scale: item.scale,
        color: item.color,
        id: `${item.uniId}`,
      });
    });
    if (e && e.length > 0) {
      var cartographic = Cesium.Cartographic.fromCartesian(e[0].position);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var h = cartographic.height;
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, h + 20),
        orientation: {
          heading: 0,
          pitch: -1,
          roll: 0,
        },
      });
    }
  };

  defineExpose({ getParams, setParams });
</script>
<style lang="less" scoped>
  .clearButton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 43px;
    height: 22px;
    background-repeat: no-repeat;
    background-size: contain;
    color: #2cbeff;
    font-size: 14px;
  }

  .clearButton:hover {
    color: #ff932a;
  }

  .scenes {
  }

  label {
    display: block;
    width: 109px;
    padding: 8px;
    color: #4a4b4b;
  }

  .imageStyle {
    width: 40px;
    padding: 10px;
  }

  .imageStyleActive {
    width: 40px;
    padding: 10px;
    background-color: #87b7da7a;
  }

  .imageStyle:hover {
    background-color: #87b7da7a;
  }

  .title {
    background: repeating-linear-gradient(
      -45deg,
      rgb(162 187 255),
      rgb(159 229 240) 20px,
      rgb(240 253 255) 20px,
      rgb(142 178 184) 40px,
      rgb(255 255 255) 40px
    );
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
