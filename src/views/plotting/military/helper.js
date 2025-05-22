export default (viewer, scene, serverUrl, select) => {
  if (!viewer || !scene || !serverUrl) {
    console.error("Invalid parameters passed to createPlottingHelper.");
    return null;
  }
  let plottingLayer,
    plotting,
    plotEditControl,
    plotDrawControl,
    animationManager;
  const cesium = window.Cesium;
  try {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, "military");
  } catch (error) {
    plottingLayer = null;
    // 重试
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, "military");
  }
  if (!viewer) {
    return;
  }
  plottingLayer = new cesium.PlottingLayer(scene, "military");
  scene.plotLayers.add(plottingLayer);

  plotting = cesium.Plotting.getInstance(serverUrl, scene);
  animationManager = plotting.getGOAnimationManager();
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
    select(feature);
  });
  plotEditControl.UnSelectedEvent.addEventListener(function (feature) {
    select(null);
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
      scene.plotLayers.remove("military");
      plottingLayer.removeAll();
    },
    deleteSelected() {
      plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
    },
    plotEditControl,
    plotDrawControl,
    getPlottingLayer() {
      return plottingLayer;
    },
    getAniMationManager() {
      return animationManager;
    },
  };
};
