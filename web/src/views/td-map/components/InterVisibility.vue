<template>
  <Dialog v-model:open="open" title="通视分析" @cancel="handleCancel">
    <div class="pt-3">
      <InterVisibility></InterVisibility>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch } from 'vue';
  import { InterVisibility } from 'td-gis';

  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);
  const open = ref<Boolean>(false);
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
<style lang="less" scoped>
  .title {
    color: #3b3b3b;
    cursor: pointer;
  }

  .title :hover {
    color: #40a9ff;
  }

  .active_title {
    color: #40a9ff;
    cursor: pointer;
  }
</style>
