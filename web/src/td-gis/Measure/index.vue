<template>
  <div class="flex justify-between items-center">
    <!-- 测距 -->
    <Distance
      ref="distanceRef"
      v-model:active="actives.distance"
      :clampMode="props.clampMode"
      :lineColor="props.lineColor"
      @editor="editorDistance"
      ><slot name="distance"></slot
    ></Distance>

    <!-- 测面 -->
    <Area
      ref="areaRef"
      v-model:active="actives.area"
      :clampMode="props.clampMode"
      :lineColor="props.lineColor"
      :fillColor="props.fillColor"
      @editor="editorArea"
      ><slot name="area"></slot
    ></Area>

    <!-- 测高 -->
    <Height
      ref="heightRef"
      v-model:active="actives.height"
      @editor="editorHeight"
      :lineColor="props.lineColor"
      ><slot name="height"></slot
    ></Height>

    <Tooltip placement="bottom">
      <!-- 清除 -->
      <template #title>
        <span>{{ title }}</span>
      </template>
      <div @click="clearHandler">
        <slot name="clear">
          <span
            class="align-middle cursor-pointer px-1 iconfont icon-clear"
            :style="{ fontSize: `${iconSize}px` }"
          /> </slot
      ></div>
    </Tooltip>

    <Tooltip v-if="useParas" placement="bottom">
      <template #title>
        <span> 保存至书签 </span>
      </template>
      <div @click="getParams">
        <slot name="param">
          <span
            class="align-middle cursor-pointer px-1 iconfont icon-save"
            :style="{ fontSize: `${iconSize}px` }"
          /> </slot
      ></div>
    </Tooltip>
  </div>
</template>

<script setup>
  import { ref, useSlots, onBeforeUnmount } from 'vue';
  import Distance from './Distance.vue';
  import Area from './Area.vue';
  import Height from './Height.vue';
  import { Tooltip } from 'ant-design-vue';
  const props = defineProps({
    iconSize: {
      type: Number,
      default: 22,
    },
    clampMode: {
      type: Number,
      default: 0, //空间 0   贴地 1,
      validator: (val) => {
        return [0, 1].includes(val);
      },
    },
    title: {
      type: String,
      default: '清除',
    },
    lineColor: {
      type: Object,
    },
    fillColor: {
      type: Object,
    },
  });

  // 获取子组件方法变量
  const distanceRef = ref();
  const areaRef = ref();
  const heightRef = ref();

  const actives = ref({
    area: false,
    distance: false,
    height: false,
  });

  const emits = defineEmits(['actives', 'params']);

  const editorArea = (value, active) => {
    distanceRef.value && distanceRef.value.deactivateHandler();
    heightRef.value && heightRef.value.deactivateHandler();
    actives.value.height = actives.value.distance = false;
    if (active) {
      areaRef.value.clear();
    }
    actives.value.area = !active;
    let temp = Object.entries(actives.value).filter(([key, value]) => {
      return value;
    });
    emits('actives', (temp.length > 0 && temp[0][0]) ?? false);
  };
  const editorDistance = (value, active) => {
    areaRef.value && areaRef.value.deactivateHandler();
    heightRef.value && heightRef.value.deactivateHandler();
    actives.value.height = actives.value.area = false;
    if (active) {
      distanceRef.value.clear();
    }
    actives.value.distance = !active;
    let temp = Object.entries(actives.value).filter(([key, value]) => {
      return value;
    });
    emits('actives', (temp.length > 0 && temp[0][0]) ?? false);
  };
  const editorHeight = (value, active) => {
    distanceRef.value && distanceRef.value.deactivateHandler();
    areaRef.value && areaRef.value.deactivateHandler();
    actives.value.distance = actives.value.area = false;
    if (active) {
      heightRef.value.clear();
    }
    actives.value.height = !active;
    let temp = Object.entries(actives.value).filter(([key, value]) => {
      return value;
    });
    emits('actives', (temp.length > 0 && temp[0][0]) ?? false);
  };
  const clearHandler = () => {
    // 调用子组件的方法或者变量，通过value
    distanceRef.value.clear();
    areaRef.value.clear();
    heightRef.value.clear();
    actives.value.height = actives.value.distance = actives.value.area = false;
    emits('actives', false);
  };

  const useParas = !!useSlots().param;

  const getParams = () => {
    emits('params', {
      a: '123123123',
    });
  };

  onBeforeUnmount(() => {
    distanceRef.value.clear();
    areaRef.value.clear();
    heightRef.value.clear();
  });
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
