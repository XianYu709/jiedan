<template>
  <Dialog v-model:open="open" @cancel="handleCancel">
    <template v-slot:title>图层控制</template>
    <LayerControl></LayerControl>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { LayerControl } from 'td-gis';
  import Dialog from './Dialog.vue';
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const open = ref<Boolean>(false);
  const emit = defineEmits(['lineMode', 'isRoller', 'update:open']);
  const handleCancel = () => {
    open.value = false;
    emit('update:open', false);
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
