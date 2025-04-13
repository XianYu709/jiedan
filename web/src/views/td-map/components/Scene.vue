<template>
  <Dialog
    v-model:open="diaOpen"
    :is-drag="false"
    title="属性"
    :width="280"
    @cancel="handleCancel"
    style="position: absolute"
    :style="`top:${infoboxContainer.y}px;left:${infoboxContainer.x}px`"
  >
    <div v-for="(item, index) in features?.fieldNames" :key="index">
      {{ item }} : {{ features?.fieldValues[index] }}</div
    >
  </Dialog>
  <Scene @position="getPosition" @result="getResult" :open="open"></Scene>
</template>
<script setup>
  import { ref, watch, onMounted, inject } from 'vue';
  import Dialog from './Dialog.vue';
  import { Scene } from 'td-gis';
  import { message } from 'ant-design-vue';
  import axios from 'axios';

  let features = ref();
  const infoboxContainer = ref({ x: 0, y: 0 });

  const props = defineProps({
    open: { type: Boolean, default: false },
  });

  const emits = defineEmits(['update:open']);
  let sceneUrls = inject('sceneUrls');
  const diaOpen = ref(false);
  let layer;
  const openHandler = () => {
    let temp = Object.keys(sceneUrls.value).find((item) => item == 'simpleBuild');
    if (!temp) {
      message.info(`没有图查所需的数据`);
      return;
    } else {
      layer = viewer.scene.layers.find(sceneUrls.value[temp][0].name);
      layer.selectEnabled = true;
    }
  };

  watch(
    () => props,
    (val) => {
      if (!props.open) {
        diaOpen.value = props.open;
        if (layer) layer.selectEnabled = false;
      } else {
        openHandler();
      }
    },
    { deep: true },
  );

  const handleCancel = () => {
    diaOpen.value = false;
  };

  const getPosition = (e) => {
    infoboxContainer.value = e;
  };

  const getResult = (e) => {
    console.log(e);
    features.value = e;
    if (e && props.open) {
      diaOpen.value = true;
    } else {
      diaOpen.value = false;
    }
  };
</script>
<style lang="less" scoped></style>
