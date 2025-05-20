export default (viewer, scene, serverUrl) => {
  if (!viewer || !scene || !serverUrl) {
    console.error("Invalid parameters passed to createPlottingHelper.");
    return null;
  }
  let plottingLayer, plotting, plotEditControl, plotDrawControl;
  const cesium = window.Cesium;
  try {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(
      scene,
      "plottingLayer"
    );
  } catch (error) {
    plottingLayer = null;
    // 重试
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(
      scene,
      "plottingLayer"
    );
  }
  if (!viewer) {
    return;
  }
  plottingLayer = new cesium.PlottingLayer(scene, "plottingLayer");
  scene.plotLayers.add(plottingLayer);

  plotting = cesium.Plotting.getInstance(serverUrl, scene);

  plotEditControl = new cesium.PlotEditControl(scene, plottingLayer); //编辑控件

  plotDrawControl = new cesium.PlotDrawControl(scene, plottingLayer); //绘制控件
  plotDrawControl.drawControlEndEvent.addEventListener(function () {
    plotEditControl.activate();
  });

  return {
    drawSymbol(libID, symbolCode) {
      plotDrawControl.setAction(libID, symbolCode);
      plotDrawControl.activate();
      plotEditControl.deactivate(); //绘制结束后再激活
    },
    clearAll() {
      plottingLayer.removeAll();
    },
    deleteSelected() {
      plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
    },
    plotEditControl,
    plotDrawControl,
  };
};
