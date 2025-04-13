<template>
  <Dialog v-model:open="open" @cancel="handleCancel" :width="300">
    <template v-slot:title>
      贴线分析
    </template>
    <div class="pt-3">
      <AffixedTo ref="affixedToRef"/>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { AffixedTo } from 'td-gis';
  import Dialog from './Dialog.vue';
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const affixedToRef = ref<InstanceType<typeof ImageRoller>>();
  const open = ref < Boolean > (false);
  const emits = defineEmits(['update:open']);

  const handleCancel = () => {
    clearHandler();
    open.value = false;
    emits('update:open', false);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
      if(!open.value){
        clearHandler();
      }
    },
    { deep: true },
  );

  const clearHandler = ()=>{
    affixedToRef.value?.clear();
  }
</script>
<style lang="less" scoped>
</style>
