export default (viewer, scene, serverUrl) => {
  if (!viewer || !scene || !serverUrl) {
    console.error("Invalid parameters passed to createPlottingHelper.");
    return null;
  }
  let plottingLayer, plotting, plotEditControl, plotDrawControl;

  try {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(
      scene,
      "plottingLayer"
    );
  } catch (error) {
    plottingLayer ??= new window.SuperMap3D.PlottingLayer(
      scene,
      "plottingLayer"
    );
  }
  console.log("PlottingLayer initialized:", plottingLayer);

  plotting = window.SuperMap3D.Plotting.getInstance(serverUrl, scene);

  plotEditControl = new window.SuperMap3D.PlotEditControl(scene, plottingLayer);
  plotDrawControl = new window.SuperMap3D.PlotDrawControl(scene, plottingLayer);

  plotEditControl.activate();

  plotDrawControl.drawControlEndEvent.addEventListener(() => {
    plotEditControl.activate();
  });

  return {
    drawSymbol(libID, symbolCode) {
      console.log("drawSymbol called with:", libID, symbolCode);
      plotDrawControl.setAction(libID, symbolCode);
      plotDrawControl.activate();
      plotEditControl.deactivate();
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
