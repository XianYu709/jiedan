<template>
  <div @click="editor" class="cursor-pointer px-1" :class="{ active: activate }">
    <Tooltip placement="bottom">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <slot>
        <span class="iconfont icon-height align-middle" style="font-size: 22px" />
      </slot>
    </Tooltip>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    title: {
      type: String,
      default: '高度测量',
    },
    active: {
      type: Boolean,
      default: false,
    },
    lineColor: {
      //线颜色
      type: Object,
    },
  });
  const emits = defineEmits(['update:active', 'editor']);

  const activate = ref(false);
  const handlerHeight = ref();

  const editor = () => {
    if (!activate.value) {
      let pickPointEnabled = false;
      //初始化测量高度
      handlerHeight.value = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
      handlerHeight.value.lineColor = props.lineColor
        ? props.lineColor
        : new Cesium.Color(1, 0.5, 0, 1);

      //注册测量高度功能事件
      handlerHeight.value.measureEvt.addEventListener(function (result) {
        var distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + 'km'
            : result.distance + 'm';
        var vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + 'km'
            : result.verticalHeight + 'm';
        var hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + 'km'
            : result.horizontalDistance + 'm';
        handlerHeight.value.disLabel.text = '空间距离:' + distance;
        handlerHeight.value.vLabel.text = '垂直高度:' + vHeight;
        handlerHeight.value.hLabel.text = '水平距离:' + hDistance;
      });

      handlerHeight.value.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = '';
          viewer.scene.pickPointEnabled = pickPointEnabled;
        } else {
          viewer.enableCursorStyle = true;
          viewer.scene.pickPointEnabled = false;
        }
      });
      handlerHeight.value && handlerHeight.value.activate();
    }
    emits('update:active', activate.value);
    emits('editor', 'area', activate.value);
  };

  const clear = () => {
    if (!handlerHeight.value) {
      return;
    }
    handlerHeight.value && handlerHeight.value.clear();
  };

  const deactivateHandler = () => {
    handlerHeight.value && handlerHeight.value.deactivate();
  };

  watch(
    () => props,
    (val) => {
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
