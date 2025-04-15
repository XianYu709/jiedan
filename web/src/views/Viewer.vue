<template>
  <div id="mapContainer" style="width: 100vw; height: 100vh"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader';

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'dc6fd5076597b71438a21d9f5c3bbd97',
  }
  AMapLoader.load({
    key: '2ebbf3b069e8a6fd48424b0f231cd7c7',
    version: '2.0',
  })
    .then(AMap => {
      // 地图初始化需要设置基本的地图图层，本例展示北京以天安门为中心的11级地图视野。
      const map = new AMap.Map('mapContainer')
      const marker = new AMap.Marker({
        position: [116.39, 39.9], //位置
      })
      map.add(marker) //添加到地图
    })
    .catch(e => {
      console.error(e) //加载错误提示
    })
})
</script>
