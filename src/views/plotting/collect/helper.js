export default (viewer, scene, serverUrl, fetchData) => {
  if (!viewer || !scene || !serverUrl) {
    console.error("Invalid parameters passed to createPlottingHelper.");
    return null;
  }
  let plotting, plotEditControl, plotDrawControl, sitDataManager, plottingLayer;
  const cesium = window.Cesium;
  try {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, "collect");
  } catch (error) {
    plottingLayer = null;
    // 重试
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(scene, "collect");
  }
  if (!viewer) {
    return;
  }
  plottingLayer = new cesium.PlottingLayer(scene, "collect");
  scene.plotLayers.add(plottingLayer);

  plotting = cesium.Plotting.getInstance(serverUrl, scene);

  plotEditControl = new cesium.PlotEditControl(scene, plottingLayer); //编辑控件
  plotEditControl.activate();
  plotDrawControl = new cesium.PlotDrawControl(scene, plottingLayer); //绘制控件
  plotDrawControl.drawControlEndEvent.addEventListener(function (e) {
    plotEditControl.activate();
  });
  console.log(plotting);

  sitDataManager = plotting.getSitDataManager();
  console.log(sitDataManager.openSmlFileOnServer);

  sitDataManager.getSmlInfosCompleted.addEventListener(function (result) {
    // getSMLInfosSucess(result);
  });

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

  sitDataManager.saveSmlFileCompleted.addEventListener(function () {
    fetchData();
  });

  sitDataManager.saveSmlFileFailed.addEventListener(function () {
    console.log("保存态势图失败");
  });

  sitDataManager.deleteSmlFileCompleted.addEventListener(function () {
    fetchData();
  });

  return {
    clearAll() {
      plotEditControl?.deactivate();
      plotDrawControl?.deactivate();
      scene.plotLayers.remove("collect");
      plottingLayer.removeAll();
    },
    getDataManager: () => sitDataManager,
  };
};
