<template>
  <div>
    <div>绿地率 : {{ props.greeningRate }}</div>
  </div>
</template>
<script setup>
  const props = defineProps({
    greeningRate: {
      type: String,
      default: 0,
    },
  });
</script>
