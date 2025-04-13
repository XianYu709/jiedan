<template>
  <div ref="mapRef" class="map-container">
    <slot></slot>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import emitter from '../hooks/useMitt';
  import getHeightByType from '../utils/getHeightByType.js';
  const props = defineProps({
    sceneUrls: {
      type: Object,
      default: () => {
        return {
          selDate: '2017-05-13',
          startTime: 10,
          endTime: 12,
          bottomHeight: 20,
          extrudeHeight: 20,
        };
      },
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const emits = defineEmits(['click', 'layerReady', 'instance']);
  const mapRef = ref();

  const init = () => {
    const terrainProvider =
      props.sceneUrls.hasOwnProperty('ter') && props.sceneUrls.ter.hasOwnProperty('url')
        ? new Cesium.CesiumTerrainProvider({
            url: props.sceneUrls.ter.url,
            isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
            requestVertexNormals: true,
          })
        : undefined;

    window.Cesium = Cesium;
    if (window.viewer) {
      window.viewer.destroy();
      window.viewer = undefined;
    }
    window.viewer = new Cesium.Viewer(mapRef.value, {
      contextOptions: {
        requestWebgl2: true,
      },
      terrainProvider,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geoCoder: true,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      shouldAnimate: true,
      useDefaultRenderLoop: true,
      shadows: true,
    });
    emits('instance', window.viewer);
  };

  function addClickEvent() {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((event) => {
      let ray = viewer.camera.getPickRay(event.position);
      let earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(earthPosition)) {
        const cartographic = Cesium.Cartographic.fromCartesian(
          earthPosition,
          viewer.scene.globe.ellipsoid,
          new Cesium.Cartographic(),
        );
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const height = cartographic.height;
        const position = event.position;
        emits('click', { lat, lng, height, position });
        getHeightByType([earthPosition], 'model').then((res) => {});
        getHeightByType([earthPosition], 'terrain').then((res) => {});
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  const addLayerByScp = (item, index = 0) => {
    viewer.scene
      .addS3MTilesLayerByScp(item.url, {
        name: item.name,
      })
      .then(function (layer) {
        layer.selectEnabled = item.selectEnabled ?? true;
        layer.shadowType = 2;
        if (index == 0 && !el.hasOwnProperty('url')) {
          viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3.fromDegrees(layer.lon, layer.lat, 1200.7793905027196),
            orientation: {
              heading: 0.010432891389807075,
              pitch: -1.2955863517856812,
              roll: 6.283185307179576,
            },
          });
        }
      });
  };

  const addLayers = () => {
    viewer.scene.globe.enableLighting = true;
    if (props.sceneUrls.hasOwnProperty('img') && props.sceneUrls.img.length > 0) {
      props.sceneUrls.img.forEach((el) => {
        viewer.imageryLayers.addImageryProvider(
          new Cesium.SuperMapImageryProvider({
            url: el.url,
            index: el.id,
          }),
        ).alpha = el.alpha || 1.0;
      });
    }

    if (props.sceneUrls.hasOwnProperty('osgb') && props.sceneUrls.osgb.length > 0) {
      props.sceneUrls.osgb.forEach((el) => {
        addLayerByScp(el);
      });
    }

    if (props.sceneUrls.hasOwnProperty('build') && props.sceneUrls.build.length > 0) {
      props.sceneUrls.build.forEach((el) => {
        layersUtil(el);
      });
    }
    if (props.sceneUrls.hasOwnProperty('simpleBuild') && props.sceneUrls.simpleBuild.length > 0) {
      props.sceneUrls.simpleBuild.forEach((el) => {
        addLayerByScp(el);
      });
    }
  };

  const layersUtil = (el) => {
    if (el.url) {
      Cesium.when(viewer.scene.open(el.url), function (layers) {
        layers.forEach((layer) => {
          layer.selectEnabled = el.selectEnabled ?? true;
          layer.shadowType = 2;
        });
        // （viewer.scene.layers.layerQueue;可获取全部图层viewer.scene.layers.find("")根据图层名字查找）
      });
      /* .otherwise(function () {
            //加载错误的情况下仍然触发图层加载完毕-Scene专用-勿删
            emitter.emit('layerReady');
            emits('layerReady');
            Cesium.screenSpaceCameraController.minimumZoomDistance = 10.5;
          }); */
    }

    if (el.hasOwnProperty('data')) {
      el.data.forEach((item, index) => {
        addLayerByScp(item, index);
      });
    }

    emitter.emit('layerReady');
    emits('layerReady');
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10.5;
  };
  onMounted(async () => {
    watch(
      () => props.sceneUrls,
      () => {
        init();
        addLayers();
      },
      {
        immediate: true,
        deep: true,
      },
    );
  });
</script>
<style lang="less" scoped>
  @import './index.less';

  :deep(.cesium-viewer-navigationContainer) {
    display: none;
  }
</style>
