<template>
  <Dialog v-model:open="open" title="选址分区分析" @cancel="handleCancel" :width="450">
    <SiteZoning></SiteZoning>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from './Dialog.vue';
  import { SiteZoning } from 'td-gis';

  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const open = ref<Boolean>(false);
  const emits = defineEmits(['update:open']);

  const handleCancel = () => {
    console.log(open.value);
    open.value = false;
    emits('update:open', false);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
    },
    { deep: true },
  );
</script>
<style lang="less" scoped></style>
