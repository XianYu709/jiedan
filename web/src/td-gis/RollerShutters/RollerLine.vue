<template>
  <teleport to="body">
    <div ref="line" class="horizontal-slider" v-if="position == 'horizontal'"></div>
    <div
      ref="line"
      id="vertical-slider"
      class="vertical-slider"
      v-if="position == 'vertical'"
    ></div>
  </teleport>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    position: {
      type: String,
      default: 'none',
    },
  });

  const line = ref(null);

  defineExpose({
    line,
  });
</script>

<style lang="less" scoped>
  .vertical-slider {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 50%;
    width: 5px;
    height: 100vh;
    background-color: #d3d3d3;
  }

  .horizontal-slider {
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 0;
    width: 100vw;
    height: 5px;
    background-color: #d3d3d3;
  }

  .vertical-slider:hover {
    cursor: ew-resize;
  }

  .horizontal-slider:hover {
    cursor: ns-resize;
  }
</style>
