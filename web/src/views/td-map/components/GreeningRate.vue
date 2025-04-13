<template>
  <Dialog v-model:open="open" title="绿地率分析" :width="280" @cancel="handleCancel">
    <GreeningRate class="mt-3" :greeningRate="greeningRate"> </GreeningRate>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from './Dialog.vue';
  import { GreeningRate } from 'td-gis';
  const greeningRate = ref('11.65%');
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
    },
    { deep: true },
  );
</script>
<style lang="less" scoped></style>
