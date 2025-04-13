<template>
  <Dialog v-model:open="open">
    <template v-slot:title> 几何查询 </template>
    <GeometryQueries />
  </Dialog>
</template>
<script setup lang="ts">
  import { GeometryQueries } from 'td-gis';
  import Dialog from './Dialog.vue';
  import { ref } from 'vue';
  const open = ref(false);
</script>
<style lang="less" scoped></style>
