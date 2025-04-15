<template>
  <div id="mapContainer" :="$attrs" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
  isDrawing: {
    type: Boolean,
    default: false,
  },
  modalValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['instance', 'update:modalValue'])

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'af525f50a9929aec4afc5b8ee789278c',
  }

  AMapLoader.load({
    key: 'e59ccbe7bf31422ace45db6e433af68b',
    version: '2.0',
    plugins: ['AMap.MouseTool'],
  }).then(AMap => {
    const map = new AMap.Map('mapContainer' )
    emit('instance', {map, AMap})

  }).catch(console.error)
})
</script>
