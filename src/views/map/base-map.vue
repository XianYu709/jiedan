<script>
export default {
  name: 'BaseMap',
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    this.url = 'http://192.168.0.100:8088/freexserver/dataserver/htc/service/wmts'
    this.initMap()
  },
  methods: {
    initMap() {
      const BING_MAP_KEY = 'AkNh5OpOWgi_CnmMMlh1pCEv7OGqHKnsK4XU1mxPbUSVq21ncmnZm4kf-lBh2hxw'
      const viewer = new window.Cesium.Viewer(this.$refs.cesiumContainer, {
        // imageryProvider: new window.Cesium.BingMapsImageryProvider({
        //   url: 'https://dev.virtualearth.net',
        //   mapStyle: window.Cesium.BingMapsStyle.AERIAL,
        //   key: BING_MAP_KEY
        // }),
        navigation: false,
        sceneModePicker: true
      })

      // viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
      //   url: this.url,
      //   layer: '福建省影像透明', // 必需参数
      //   style: 'default', // 必需参数，通常设为'default'
      //   format: 'image/png',
      //   tileMatrixSetID: 'EPSG:3857',
      //   maximumLevel: 18
      // }))

      // viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
      //   url: this.url,
      //   layer: '台湾省影像透明', // 必需参数
      //   style: 'default', // 必需参数，通常设为'default'
      //   format: 'image/png',
      //   tileMatrixSetID: 'EPSG:3857',
      //   maximumLevel: 18
      // }))

      // viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
      //   url: this.url,
      //   layer: '浙江省影像透明', // 必需参数
      //   style: 'default', // 必需参数，通常设为'default'
      //   format: 'image/png',
      //   tileMatrixSetID: 'EPSG:3857',
      //   maximumLevel: 18
      // }))

      // viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
      //     url: this.url,
      //     layer: '广东省_影像',      // 必需参数
      //     style: 'default',    // 必需参数，通常设为'default'
      //     format: 'image/png',
      //     tileMatrixSetID: "EPSG:3857",
      //     maximumLevel: 18
      // }));

      // 星空默认关闭
      viewer.scene.skyBox.show = false
      window.viewer = viewer
      this.$emit('complete', viewer)
    }
  }
}
</script>

<template>
  <div ref="cesiumContainer" class="map-container" />
</template>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: calc(100vh - 60px);
  position: relative;
  ::v-deep {
    .cesium-viewer-toolbar {
      top: 60px;
    }
  }
}
.cesium-viewer-bottom {
        display: none;
    }
</style>
