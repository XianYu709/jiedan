export default (name, viewer, scene, serverUrl, select) => {
  if (!viewer || !scene || !serverUrl) {
    console.error("Invalid parameters passed to createPlottingHelper.");
    return null;
  }
  let plottingLayer,
    plotting,
    plotEditControl,
    plotDrawControl,
    sitDataManager,
    animationManager;
  const cesium = window.Cesium;
  let uniName = name + Date.now();
  try {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, uniName);
  } catch (error) {
    plottingLayer = null;
    // 重试
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, uniName);
  }
  if (!viewer) {
    return;
  }
  scene.plotLayers.add(plottingLayer);

  plotting = cesium.Plotting.getInstance(serverUrl, scene);
  animationManager = plotting.getGOAnimationManager();

  sitDataManager = plotting.getSitDataManager();

  sitDataManager.openSmlFileCompleted.addEventListener(function (result) {
    var layers = sitDataManager.getPlottingLayers();
    if (0 !== layers.length) {
      var layer = layers[0];
      plottingLayer = layer;
      plotEditControl.setPlottingLayer(layer);
      plotDrawControl.setPlottingLayer(layer);
    }
    plotEditControl.activate();
  });

  function animate() {
    animationManager.execute();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  plotEditControl = new cesium.PlotEditControl(scene, plottingLayer); //编辑控件
  plotEditControl.activate();
  plotDrawControl = new cesium.PlotDrawControl(scene, plottingLayer); //绘制控件
  plotDrawControl.drawControlEndEvent.addEventListener(function (e) {
    plotEditControl.activate();
  });

  plotEditControl.FeatureSelectedEvent.addEventListener(function (feature) {
    select && select(feature);
  });
  plotEditControl.UnSelectedEvent.addEventListener(function (feature) {
    select && select(null);
  });

  return {
    drawSymbol(libID, symbolCode) {
      plotDrawControl.setAction(libID, symbolCode);
      plotDrawControl.activate();
      plotEditControl.deactivate(); //绘制结束后再激活
    },
    clearAll() {
      plotEditControl?.deactivate();
      plotDrawControl?.deactivate();
      scene.plotLayers.remove(uniName);
      plottingLayer.removeAll();
      // scene.plotLayers.remove(plottingLayer);
    },
    destroy() {
      plottingLayer.removeAll();
      plottingLayer.destroy();
    },
    deleteSelected() {
      plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
    },
    plotEditControl,
    plotDrawControl,
    getDataManager: () => sitDataManager,
    getPlottingLayer: () => plottingLayer,
    getAniMationManager: () => animationManager,
  };
};
