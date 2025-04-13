<template>
  <Dialog v-model:open="open" title="服务区分析" :width="280" @cancel="handleCancel"> 
    <ServiceAnalysis class="mt-3"> </ServiceAnalysis>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from './Dialog.vue';
  import { ServiceAnalysis } from 'td-gis';
  const open = ref(false);
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);
  const handleCancel = () => {
    open.value = false;
    emits('update:open', false);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
    },{deep:true}
  );
</script>
<style lang="less" scoped></style>
