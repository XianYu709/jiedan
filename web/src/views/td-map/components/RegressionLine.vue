<template>
  <Dialog v-model:open="open" @cancel="handleCancel" :width="350">
    <template v-slot:title> 退线分析 </template>
    <div class="pt-3">
      <RegressionLine :layer="layerName" ref="regressionLineRef" />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch, inject } from 'vue';
  import { RegressionLine } from 'td-gis';
  import Dialog from './Dialog.vue';
  import { message } from 'ant-design-vue';

  const props = defineProps({
    open: { type: Boolean, default: false },
    layerType: { type: String, required: true },
  });
  const regressionLineRef = ref<InstanceType<typeof ImageRoller>>();
  const open = ref<Boolean>(false);
  const emits = defineEmits(['update:open']);
  const sceneUrls = inject('sceneUrls');
  const layerName = ref();

  const filterName = async (data) => {
    let temp = Object.keys(data).find((item) => item == props.layerType);
    if (!temp) {
      message.info(`没有退线所需的数据`);
      layerName.value = undefined;
      return;
    } else {
      layerName.value = data[temp][0].name;
    }
  };
  const handleCancel = () => {
    clearHandler();
    open.value = false;
    emits('update:open', false);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
      if (!open.value) {
        clearHandler();
      } else {
        filterName(sceneUrls.value);
      }
    },
    { deep: true },
  );

  const clearHandler = () => {
    regressionLineRef.value?.clear();
  };
</script>
<style lang="less" scoped></style>
