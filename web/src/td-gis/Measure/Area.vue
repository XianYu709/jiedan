<template>
  <div @click="editor" class="cursor-pointer px-1" :class="{ active: activate }">
    <Tooltip placement="bottom">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <slot>
        <span class="iconfont icon-area align-middle" style="font-size: 22px" />
      </slot>
    </Tooltip>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    clampMode: {
      type: Number,
      default: 0, //默认为空间量算
    },
    title: {
      type: String,
      default: '面积测量',
    },
    active: {
      type: Boolean,
      default: false,
    },
    lineColor: {
      type: Object,
    },
    fillColor: {
      type: Object,
    },
  });
  const emits = defineEmits(['update:active', 'editor']);

  const handlerArea = ref();
  const clampMode = ref(); //空间 0   贴地 1

  const activate = ref(false);

  const editor = () => {
    if (!activate.value) {
      let pickPointEnabled = false;
      //初始化测量面积
      handlerArea.value = handlerArea.value
        ? handlerArea.value
        : new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, clampMode);
      handlerArea.value.lineColor = props.lineColor
        ? props.lineColor
        : new Cesium.Color(1, 0.5, 0, 1);
      handlerArea.value.fillColor = props.fillColor
        ? props.fillColor
        : new Cesium.Color(1, 0.5, 0.5, 0.5);

      //注册测量面积功能事件
      handlerArea.value.measureEvt.addEventListener(function (result) {
        var mj = Number(result.area);
        var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡';
        handlerArea.value.areaLabel.text = '面积:' + area;
      });
      handlerArea.value.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = '';
          viewer.scene.pickPointEnabled = pickPointEnabled;
        } else {
          viewer.enableCursorStyle = true;
          viewer.scene.pickPointEnabled = false;
        }
      });
      handlerArea.value && handlerArea.value.activate();
    }
    emits('update:active', activate.value);
    emits('editor', 'area', activate.value);
  };

  const clear = () => {
    if (!handlerArea.value) {
      return;
    }
    handlerArea.value && handlerArea.value.clear();
  };

  const deactivateHandler = () => {
    handlerArea.value && handlerArea.value.deactivate();
  };

  watch(
    () => props,
    (val) => {
      clampMode.value = val.clampMode;
      activate.value = props.active;
    },
    { deep: true },
  );

  // 暴露方法给父组件
  defineExpose({
    clear,
    deactivateHandler,
  });
  onMounted(() => {});
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
