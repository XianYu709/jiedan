<template>
  <div class="contents">
    <PlanarCrop></PlanarCrop>
    <BoxCrop></BoxCrop>
    <CrossCrop></CrossCrop>
    <PolygonCrop></PolygonCrop>
    <CropWithSeal></CropWithSeal>
  </div>
</template>
<script>
  export default { name: 'Crop' };
</script>
<script setup>
  import { ref } from 'vue';
  import PlanarCrop from './PlanarCrop.vue';
  import BoxCrop from './BoxCrop.vue';
  import CrossCrop from './CrossCrop.vue';
  import PolygonCrop from './PolygonCrop.vue';
  import CropWithSeal from './CropWithSeal.vue';
</script>
