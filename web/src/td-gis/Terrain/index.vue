<template>
  <div class="contents">
    <Modifications ref="modificationsRef" :clear-other="modificationsClears"></Modifications>
    <Excavation ref="excavationRef" :clear-other="excavationClears"></Excavation>
    <Extraction ref="extractionRef" :clear-other="extractionClears"></Extraction>
  </div>
</template>
<script>
  export default { name: 'Crop' };
</script>
<script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import Excavation from './Excavation.vue';
  import Extraction from './Extraction.vue';
  import Modifications from './Modifications.vue';

  const excavationRef = ref(null);
  const extractionRef = ref(null);
  const modificationsRef = ref(null);

  const modificationsClears = ref();
  const extractionClears = ref();
  const excavationClears = ref();

  onMounted(() => {
    modificationsClears.value = () => {
      extractionRef.value.clear();
      excavationRef.value.clear();
    };

    extractionClears.value = () => {
      modificationsRef.value.clear();
      excavationRef.value.clear();
    };

    excavationClears.value = () => {
      extractionRef.value.clear();
      modificationsRef.value.clear();
    };
  });
</script>
