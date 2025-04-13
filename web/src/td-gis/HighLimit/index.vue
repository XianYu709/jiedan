<template>
  <div>
    <slot>
      <InputNumber
        v-model:value="inputHeight"
        placeholder="输入高度"
        allow-clear
        class="mb-3"
        addon-after="米"
      />
    </slot>
  </div>
  <slot name="draw" :event="draw">
    <Button type="primary" @click="draw">绘制</Button>
  </slot>

  <slot name="highLimit" :event="highLimit">
    <Button type="primary" @click="highLimit" class="ml-4">开始分析</Button>
  </slot>

  <slot name="reset" :event="reset">
    <Button class="ml-4" @click="reset">重置</Button>
  </slot>
</template>
<script setup>
  import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
  import { Button, message, InputNumber } from 'ant-design-vue';
  var scene;

  let entities = [];

  onMounted(() => {
    scene = viewer.scene;
  });

  const props = defineProps({
    nameLayer: {
      type: String,
      required: true,
    },
    highLimit: {
      type: Number,
      default: 50,
    },
    altitude: {
      type: Number,
      default: 335,
    },
  });

  const inputHeight = ref(props.highLimit);
  let tmpInputHeight;
  let msg;
  watch(
    () => props.highLimit,
    (val) => {
      inputHeight.value = val;
    },
    { immediate: true },
  );
  var handlerPolygon;
  const positions = ref();
  const arr = ref([]);
  const draw = () => {
    handlerPolygon = handlerPolygon
      ? handlerPolygon
      : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    handlerPolygon && handlerPolygon.activate();
    handlerPolygon.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerPolygon.drawEvt.addEventListener(function (result) {
      positions.value = result.positions;
    });
  };
  const highLimit = () => {
    if (!positions.value) {
      message.info('请先绘制后在分析!');
      return;
    }
    var entity;
    var i = 0;
    while (i < 20000) {
      arr.value.push(i);
      i++;
    }
    var original = viewer.scene.layers.find(props.nameLayer);
    original.setObjsVisible([47], false);
    var instance = new Cesium.S3MInstanceCollection(viewer.scene._context);
    viewer.scene.primitives.add(instance);
    entity = viewer.entities.add({
      id: 'polygonA',
      polygon: {
        hierarchy: positions.value,
        height: 100,
        material: new Cesium.Color(1, 1, 0.2, 0.5),
        outline: true,
        outlineColor: Cesium.Color.GREEN,
      },
    });
    entities.push(entity);

    original.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
    var height = props.altitude;
    var flag = true;
    var flagA = true;
    var heightSum = inputHeight.value + height;
    tmpInputHeight = inputHeight.value;
    window.setInterval(function () {
      if (height <= inputHeight.value + height && flagA) {
        if (flag) {
          height += 1.0;
        }
        if (height == heightSum) {
          flagA = false;
          msg = message.info({
            content: () => '建筑限高' + tmpInputHeight + '米',
            duration: 0,
            onClick: () => {
              msg();
            },
          });
        }
        entity.polygon.height = height + 2;
      }
    }, 220);
  };
  const reset = () => {
    if (msg) {
      msg();
    }
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    handlerPolygon && handlerPolygon.clear();
    handlerPolygon && handlerPolygon.deactivate();
    positions.value = null;
  };

  const clear = () => {
    viewer.scene.layers.find(props.nameLayer)?.clearCustomClipBox();
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
  };

  defineExpose({
    clear,
  });

  onBeforeUnmount(() => {
    reset();
    clear();
  });
</script>
