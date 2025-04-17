<template>
  <div id="mapContainer" :="$attrs" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import {onMounted} from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

const props = defineProps({
  isDrawing: {
    type: Boolean,
    default: false,
  },
  modalValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['instance', 'update:modalValue']);

const drawAre = (map, AMap) => {
  const mouseTool = new AMap.MouseTool(map);
  mouseTool.polygon({
    strokeColor: '#FF33FF',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
  });

  mouseTool.on('draw', (e) => {
    const path = e.obj.getPath();
    emit('update:modalValue', path);
  });
};

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'af525f50a9929aec4afc5b8ee789278c',
  };

  AMapLoader.load({
    key: 'e59ccbe7bf31422ace45db6e433af68b',
    version: '2.0',
    plugins: ['AMap.MouseTool',],
    AMapUI: {
      plugins: ['overlay/SimpleMarker']
    }
  })
    .then((AMap) => {
      const map = new AMap.Map('mapContainer', {
        viewMode: '3D',
        terrain: false, //开启地形图
        pitch: 60,
        zoom: 13
      });
      map.setCenter([117.000923, 36.675807]);
      emit('instance', {map, AMap});
      if (props.isDrawing) drawAre(map, AMap);
    })
    .catch(console.error);
});
</script>
