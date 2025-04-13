<template>
  <Dialog v-model:open="open" @cancel="handleCancel">
    <template v-slot:title>
      天气模拟
    </template>
    <div class="pt-3"> 
      <WeatherSimulation ref="weatherSimulationRef"></WeatherSimulation>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref,watch } from 'vue';
  import { WeatherSimulation } from 'td-gis';
  import Dialog from './Dialog.vue';
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const weatherSimulationRef = ref<InstanceType<typeof ImageRoller>>();
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
    weatherSimulationRef.value?.clear();
  }
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
