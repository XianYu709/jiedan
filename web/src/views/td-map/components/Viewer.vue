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
  let currentPolygon = null;
  const mouseTool = new AMap.MouseTool(map);
  mouseTool.polygon({
    strokeColor: '#FF33FF',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
  });

  mouseTool.on('draw', (e) => {
    if (currentPolygon) {
      map.remove(currentPolygon);
    }
    currentPolygon = e.obj;
    const path = e.obj.getPath();
    emit('update:modalValue', path);
  });
};

onMounted(() => {
  window._AMapSecurityConfig = {
    // securityJsCode: 'af525f50a9929aec4afc5b8ee789278c', // 客户
    // securityJsCode: 'ef5aac45b9162b133f81f92e1ebd281f',
    // securityJsCode: '3171b574f66cd716ce2d748e4bf4cf5d',
    // securityJsCode: 'dc6fd5076597b71438a21d9f5c3bbd97',
    securityJsCode: '18dabc53642a9a4caa8730d27d103c6b',
  };

  AMapLoader.load({
    // key: 'e59ccbe7bf31422ace45db6e433af68b', // 客户
    // key: 'bb8483e0c185144738dfc902380ce4e6',
    // key: 'bd2fe33c558e285994a1df9bd220e3a1',
    // key: '2ebbf3b069e8a6fd48424b0f231cd7c7',
    key: '4324564284219a0d55d79ef3e8b2f953',
    version: '2.0',
    plugins: ['AMap.MouseTool',],
    AMapUI: {
      plugins: ['overlay/SimpleMarker']
    }
  })
    .then((AMap) => {
      const map = new AMap.Map('mapContainer', {
        viewMode: '3D',
        terrain: true, //开启地形图
        // mapStyle: 'amap://styles/terrain', // ⚠️ 核心：设置地形样式
        zoom: 13
      });
      map.setCenter([117.000923, 36.675807]);
      emit('instance', {map, AMap});
      if (props.isDrawing) drawAre(map, AMap);
    })
    .catch(console.error);
});
</script>
