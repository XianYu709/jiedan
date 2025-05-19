export default (viewer, scene, serverUrl) => {
  if (!viewer || !scene || !serverUrl) {
    return;
  }
  let plottingLayer, plotting, plotEditControl, plotDrawControl;

  plottingLayer = new window.SuperMap3D.PlottingLayer(scene, "plottingLayer");
  scene.plotLayers.add(plottingLayer);
  console.log(plottingLayer);
  
  // plotting = SuperMap3D.Plotting.getInstance(serverUrl, scene);

  // plotEditControl = new SuperMap3D.PlotEditControl(scene, plottingLayer); //编辑控件
  // plotEditControl.activate();
  // plotDrawControl = new SuperMap3D.PlotDrawControl(scene, plottingLayer); //绘制控件
  // plotDrawControl.drawControlEndEvent.addEventListener(function () {
  //   //标绘结束，激活编辑控件
  //   plotEditControl.activate(); 
  // });

  // let loadSymbolComplete = false;

  // // 初始化符号库
  // if (!symbolLibManager.isInitializeOK()) {
  //   symbolLibManager.initializecompleted.addEventListener(function () {
  //     loadSymbolComplete = true;
  //   });
  //   symbolLibManager.initializeAsync();
  // } else {
  //   loadSymbolComplete = true;
  // }

  // // 启用编辑控制
  // plotEditControl.activate();

  // // 绘制完成后重新启用编辑控制
  // plotDrawControl.drawControlEndEvent.addEventListener(() => {
  //   plotEditControl.activate();
  // });

  // // 返回工具函数集
  // return {
  //   drawSymbol(libID, symbolCode) {
  //     if (!loadSymbolComplete) {
  //       console.warn("Symbol library not initialized yet.");
  //       return;
  //     }
  //     plotDrawControl.setAction(libID, symbolCode);
  //     plotDrawControl.activate();
  //     plotEditControl.deactivate();
  //   },
  //   clearAll() {
  //     plottingLayer.removeAll();
  //   },
  //   deleteSelected() {
  //     plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
  //   },
  //   getPlottingLayer() {
  //     return plottingLayer;
  //   },
  //   getPlottingInstance() {
  //     return plotting;
  //   },
  //   getSymbolLibManager() {
  //     return symbolLibManager;
  //   },
  // };
};
