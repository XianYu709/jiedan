export default () => {
  const Cesium = window.Cesium;
  const viewer = window.viewer;

  let wide;
  let slope;
  let handlerPolygon;
  let points = [];

  const selectClass = (value) => {
    switch (value) {
      case "calModeall_plane":
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        break;
      case "calModeall_any":
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
        break;
      case "calModeall_none":
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
        break;
      default:
        break;
    }
    if (value === "calModeall_plane" && slope.CoverageArea.length === 0) {
      wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
    }
    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope,
      analysisMode: wide,
    };
  };

  const start = (params) => {
    clear();
    //  default  params
    let parameter = {
      wideMinR: 0,
      wideMaxR: 90,
      trans: 0.5,
      style: "showAll",
    };
    let clipMode = "calModeall_plane";
    // let colorTables = "1";
    let colorTable;
    parameter.wideMinR = params.wideMinR ?? parameter.wideMinR;
    parameter.wideMaxR = params.wideMaxR ?? parameter.wideMaxR;
    parameter.trans = params.trans ?? parameter.trans;
    parameter.style = params.style ?? parameter.style;
    clipMode = params.clipMode ?? clipMode;

    if (handlerPolygon) {
      handlerPolygon.polygon.show = false;
      handlerPolygon.polyline.show = false;
      handlerPolygon.clear();
    }
    slope = new Cesium.SlopeSetting();

    slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
    slope.MaxVisibleValue = parameter.wideMaxR;
    slope.MinVisibleValue = parameter.wideMinR;
    colorTable = new Cesium.ColorTable();
    colorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
    colorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
    colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
    colorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
    colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
    wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
    slope.ColorTable = colorTable;
    slope.Opacity = 0.5;
    handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    handlerPolygon.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerPolygon.drawEvt.addEventListener(function (result) {
      var array = [].concat(result.object.positions);
      points = result.object.positions;
      var positions = [];
      for (var i = 0; i < array.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var h = cartographic.height;
        if (
          positions.indexOf(longitude) == -1 &&
          positions.indexOf(latitude) == -1
        ) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }
      slope.CoverageArea = positions;
      selectClass(clipMode);
      handlerPolygon.polygon.show = false;
      handlerPolygon.polyline.show = false;
      handlerPolygon.deactivate();
      handlerPolygon.activate();
    });
    handlerPolygon.activate();
  };

  const clear = () => {
    try {
      points = [];
      if (!slope) return;
      wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
      };
      if (handlerPolygon) {
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.clear();
        handlerPolygon = undefined;
      }
      slope = undefined;
    } catch (error) {}
  };

  const setPrams = (val) => {
    if (!slope) {
      return;
    }
    slope.MinVisibleValue = Number(val.wideMinR);
    slope.MaxVisibleValue = Number(val.wideMaxR);
    slope.Opacity = Number(val.trans);
    switch (val.style) {
      case "showColor":
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
        break;
      case "showArrow":
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
        break;
      case "showAll":
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
        break;
      default:
        break;
    }
    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope,
      analysisMode: wide,
    };
  };

  return {
    start,
    clear,
    selectClass,
    setPrams,
  };
};
