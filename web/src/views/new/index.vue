<template>
  <LayerControl v-model:open="open" />
  <div id="testNew"></div>
  <div @click="open = !open">111</div>
</template>

<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import { useViewer } from '@/smap-hooks';
  import LayerControl from '@/views/td-map/components/LayerControl.vue';

  const open = ref(true);
  const leftClick = (e) => {
    console.log('leftClick', e);
  };

  let viewer;
  let viewerMethod;

  onMounted(() => {
    [viewer, viewerMethod] = useViewer(document.getElementById('testNew'), {}, { leftClick });
    console.log('viewer', viewer);
    console.log('viewerMethod', viewerMethod);
    // viewerMethod.addImage({
    //   url: 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World',
    // });
    // viewerMethod.addLayer({
    //   url: 'https://www.supermapol.com/realspace/services/3D-XinBaiMo-2/rest/realspace/datas/%E4%B8%80%E8%88%AC%E5%AE%B6%E5%B1%8B/config',
    //   name: 'test',
    // });
    viewerMethod.openScene('http://www.supermapol.com/realspace/services/3D-srsb/rest/realspace');
  });

  onBeforeUnmount(() => {
    viewerMethod.distory();
  });
</script>

<style scoped>
  .testNew {
    width: 100%;
    height: 500px;
  }
</style>
