/**
 * 可视域
 */

export default (viewModelProps) => {
  let viewer = window.viewer;
  let Cesium = window.Cesium;

  let longitude;
  let latitude;
  let height;
  let startPosition;
  let endPosition;

  let viewShed3D = {};
  let pointHandler;

  let viewModel = {
    direction: 120,
    pitch: 0,
    distance: 100.0,
    verticalFov: 50,
    horizontalFov: 60,
    visibleAreaColor: "#00ff00",
    invisibleAreaColor: "#ff0000",
  };

  const updateAll = (params) => {
    viewModel = JSON.parse(JSON.stringify(params));
    if (Object.keys(viewShed3D).length === 0) return;
    viewShed3D.direction = parseFloat(params.direction);
    viewShed3D.pitch = parseFloat(params.pitch);
    viewShed3D.distance = parseFloat(params.distance);
    viewShed3D.verticalFov = parseFloat(params.verticalFov);
    viewShed3D.horizontalFov = parseFloat(params.horizontalFov);
    var color1 = Cesium.Color.fromCssColorString(params.visibleAreaColor);
    viewShed3D.visibleAreaColor = color1;
    var color2 = Cesium.Color.fromCssColorString(params.invisibleAreaColor);
    viewShed3D.hiddenAreaColor = color2;
  };
  const updateByType = (type, val) => {
    switch (type) {
      case "direction":
      case "pitch":
      case "distance":
      case "verticalFov":
      case "horizontalFov":
        viewShed3D[type] = parseFloat(val);
        break;
      case "visibleAreaColor":
        viewShed3D.visibleAreaColor = Cesium.Color.fromCssColorString(val);
        break;
      case "invisibleAreaColor":
        viewShed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(val);
        break;
    }
  };

  viewModel = JSON.parse(JSON.stringify(viewModelProps));
  viewer.scene.viewFlag = true;
  viewShed3D = new Cesium.ViewShed3D(viewer.scene);
  updateAll(viewModel);
  pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
  Cesium.knockout.track(viewModel);

  const chooseView = () => {
    if (pointHandler.active) {
      return;
    }
    // 先清除之前的可视域分析
    // viewer.entities.removeAll()
    viewShed3D.distance = 0.1;
    viewer.scene.viewFlag = true;
    // 激活绘制点类
    pointHandler.activate();
    var viewPosition;
    pointHandler.drawEvt.addEventListener(function (result) {
      // var point = result.object
      var position = result.object.position;
      startPosition = position;
      viewPosition = position;
      // 将获取的点的位置转化成经纬度
      var cartographic = Cesium.Cartographic.fromCartesian(position);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      var height = cartographic.height;
      if (viewer.scene.viewFlag) {
        // 设置视口位置
        viewShed3D.viewPosition = [longitude, latitude, height];
        viewShed3D.build();
        // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
        viewer.scene.viewFlag = false;
      }
    });
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function (e) {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!viewer.scene.viewFlag) {
        // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        var position = e.endPosition;
        var last = viewer.scene.pickPosition(position);
        // 计算该点与视口位置点坐标的距离
        var distance = Cesium.Cartesian3.distance(viewPosition, last);
        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          var cartographic = Cesium.Cartographic.fromCartesian(last);
          longitude = Cesium.Math.toDegrees(cartographic.longitude);
          latitude = Cesium.Math.toDegrees(cartographic.latitude);
          height = cartographic.height;
          // 通过该点设置可视域分析对象的距离及方向
          viewShed3D.setDistDirByPoint([longitude, latitude, height]);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (e) {
      endPosition = e.position;
      // 鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      viewer.scene.viewFlag = true;
      viewModel.direction = viewShed3D.direction;
      viewModel.pitch = viewShed3D.pitch;
      viewModel.distance = viewShed3D.distance;
      viewModel.horizontalFov = viewShed3D.horizontalFov;
      viewModel.verticalFov = viewShed3D.verticalFov;
      // animateShow = true;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  const clear = () => {
    longitude = 0;
    latitude = 0;
    height = 0;
    startPosition = undefined;
    endPosition = undefined;
    if (viewShed3D) {
      viewShed3D.removeAllClipRegion();
      viewShed3D.distance = 0.001;
    }
    if (pointHandler) {
      pointHandler.clear();
    }
    // viewer.entities.removeAll();
    viewer.scene.viewFlag = true;
  };

  return { clear, chooseView, updateAll, updateByType };
};
