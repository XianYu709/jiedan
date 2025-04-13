<template>
  <div @click="editor" class="cursor-pointer px-1" :class="{ active: activate }">
    <Tooltip placement="bottom">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <slot>
        <span class="iconfont icon-distance align-middle" style="font-size: 22px" />
      </slot>
    </Tooltip>
  </div>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    clampMode: {
      type: Number,
      default: 0, //默认为空间量算
    },
    title: {
      type: String,
      default: '距离测量',
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

  const styles = computed(() => {
    return { width: `${props.iconSize}px`, height: `${props.iconSize}px` };
  });

  const handlerDis = ref();
  const clampMode = ref(); //空间 0   贴地 1

  const activate = ref(false);

  const editor = () => {
    if (!activate.value) {
      let pickPointEnabled = false;
      //初始化测量距离
      handlerDis.value = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, clampMode);
      handlerDis.value.lineColor = props.lineColor
        ? props.lineColor
        : new Cesium.Color(1, 0.5, 0, 1);

      //注册测距功能事件
      handlerDis.value.measureEvt.addEventListener(function (result) {
        var dis = Number(result.distance);
        var positions = result.positions;
        var distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
        handlerDis.value.disLabel.text = '距离:' + distance;
      });
      handlerDis.value.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = '';
          viewer.scene.pickPointEnabled = pickPointEnabled;
        } else {
          viewer.enableCursorStyle = true;
          viewer.scene.pickPointEnabled = false;
        }
      });
      handlerDis.value && handlerDis.value.activate();
    }
    emits('update:active', activate.value);
    emits('editor', 'distance', activate.value);
  };

  const clear = () => {
    if (!handlerDis.value) {
      return;
    }
    handlerDis.value && handlerDis.value.clear();
  };

  const deactivateHandler = () => {
    handlerDis.value && handlerDis.value.deactivate();
  };

  watch(
    () => props,
    (val) => {
      clampMode.value = val.clampMode;
      activate.value = props.active;
    },
    { deep: true, immediate: true },
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
