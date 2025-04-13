import type { params, result, addLayerParam, addImageParam } from './types';

const defaultOptions = {
  contextOptions: {
    requestWebgl2: true,
  },
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
};

function addClickEvent(callBack) {
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
      callBack({ lat, lng, height, position });
      // getHeightByType([earthPosition], 'model').then((res) => {});
      // getHeightByType([earthPosition], 'terrain').then((res) => {});
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function useViewer(container: HTMLElement, options?: Object, callBack?: params): result {
  if (typeof Cesium === 'undefined') {
    throw new Error('需引入 @supermap/iclient3d-webgl/Cesium/Cesium.js');
  }

  window.Cesium = Cesium;

  if (window.viewer) {
    window.viewer.destroy();

    window.viewer = null;
  }

  window.viewer = new Cesium.Viewer(container, {
    ...defaultOptions,
    ...options,
  });

  if (callBack?.leftClick && typeof callBack.leftClick === 'function') {
    addClickEvent(callBack.leftClick);
  }

  function addLayer(item: addLayerParam) {
    viewer.scene
      .addS3MTilesLayerByScp(item.url, {
        name: item.name,
      })
      .then(function (layer) {
        layer.selectEnabled = item.selectEnabled ?? true;
        layer.shadowType = layer.shadowType ?? 2;
      });
  }

  function addImage(item: addImageParam) {
    viewer.imageryLayers.addImageryProvider(
      new Cesium.SuperMapImageryProvider({
        url: item.url,
      }),
    ).alpha = item.alpha || 1.0;
  }

  function openScene(url: String) {
    viewer.scene.open(url);
  }

  function addTerrain(url: string, isSct: boolean = true) {
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url,
      isSct,
      requestVertexNormals: true,
    });
  }

  function distory() {
    window.viewer && window.viewer.destroy();
  }

  return [window.viewer, { addLayer, addImage, addTerrain, openScene, distory }];
}

export default useViewer;
