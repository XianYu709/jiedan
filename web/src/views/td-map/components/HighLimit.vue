<template>
  <Dialog v-model:open="open" @cancel="handleCancel" :width="300">
    <template v-slot:title> 限高分析 </template>
    <div class="pt-3">
      <HighLimit ref="highLimitRef" :nameLayer="layerName" />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch, inject } from 'vue';
  import { HighLimit } from 'td-gis';
  import Dialog from './Dialog.vue';

  import { message } from 'ant-design-vue';

  const props = defineProps({
    open: { type: Boolean, default: false },
    layerType: { type: String, required: true },
  });
  const sceneUrls = inject('sceneUrls');
  const layerName = ref();

  const filterName = async (data) => {
    let temp = Object.keys(data).find((item) => item == props.layerType);
    if (!temp) {
      message.info(`没有限高所需的数据`);
      layerName.value = undefined;
      return;
    } else {
      layerName.value = data[temp][0].name;
    }
  };

  const highLimitRef = ref<InstanceType<typeof ImageRoller>>();
  const open = ref<Boolean>(false);
  const emits = defineEmits(['update:open']);

  const nameLayer = [
    { name: '九号楼@九号楼', titles: 'building' },
    { name: '九号楼@九号楼1', titles: 'building1' },
    { name: 'original', titles: 'original' },
    { name: 'origina白膜控制', titles: 'origina白膜控制l' },
  ];

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
    highLimitRef.value?.clear();
  };
</script>
<style lang="less" scoped></style>
