const {
  ScreenSpaceEventHandler,
  Cartographic,
  Cartesian3,
  DrawHandler,
  DrawMode,
  ScreenSpaceEventType
} = window.Cesium

/**
 * 可视域
 */
export default class ViewshedHelper {
  constructor(viewer) {
    this._viewshed3D = new window.Cesium.ViewShed3D(viewer)
    this._viewMode = {
      direction: 1.0,
      pitch: 1.0,
      distance: 1.0,
      verticalFov: 1.0,
      horizontalFov: 1.0,
      visibleAreaColor: '#ffffffff',
      invisibleAreaColor: '#ffffffff'
    }
    this._viewPosition = null
    this._handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    const pointHandler = new DrawHandler(viewer, DrawMode.Point)
    pointHandler.drawEvt.addEventListener((result) => this._handleDrawEvent(result))
    this._pointHandler = pointHandler
    this._viewer = viewer
  }

  active() {
    if (this.pointHandler.active) {
      return
    }
    // 先清除之前的可视域分析
    // viewer.entities.removeAll();
    this.viewshed3D.distance = 0.1
    this.viewer.scene.viewFlag = true
    this.pointHandler.activate()
    // 鼠标移动时间回调
    this.handler.setInputAction((event) => this._handleMouseMove(event), ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction((event) => this._handleRightClick(event), ScreenSpaceEventType.RIGHT_CLICK)
  }

  deactivate() {
    this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK)
  }

  clear() {
    this.viewshed3D.removeAllClipRegion()

    // 清除观察点
    this.pointHandler.clear()

    // $("#wrapper").hide()
    this.viewshed3D.distance = 0.1
    this.viewer.scene.viewFlag = true
  }

  _handleDrawEvent(result) {
    // var point = result.object;
    const scene = this.viewer.scene
    const position = result.object.position
    this._viewPosition = position

    // 将获取的点的位置转化成经纬度
    const cartographic = Cartographic.fromCartesian(position)
    const longitude = Math.toDegrees(cartographic.longitude)
    const latitude = Math.toDegrees(cartographic.latitude)
    const height = cartographic.height + 1.8
    // point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);

    if (scene.viewFlag) {
      // 设置视口位置
      this.viewshed3D.viewPosition = [longitude, latitude, height]
      this.viewshed3D.build()
      // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
      scene.viewFlag = false
    }
  }

  _handleMouseMove(event) {
    const scene = this.viewer.scene
    if (!scene.viewFlag) {
      // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
      const position = event.endPosition
      const last = scene.pickPosition(position)

      // 计算该点与视口位置点坐标的距离
      const distance = Cartesian3.distance(this.viewPosition, last)

      if (distance > 0) {
        // 将鼠标当前点坐标转化成经纬度
        const cartographic = Cartographic.fromCartesian(last)
        const longitude = Math.toDegrees(cartographic.longitude)
        const latitude = Math.toDegrees(cartographic.latitude)
        const height = cartographic.height
        // 通过该点设置可视域分析对象的距离及方向
        this.viewshed3D.setDistDirByPoint([longitude, latitude, height])
      }
    }
  }

  _handleRightClick(event) {
    // 鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
    this.viewer.scene.viewFlag = true
    // $("#wrapper").show();
    this.viewModel.direction = this.viewshed3D.direction
    this.viewModel.pitch = this.viewshed3D.pitch
    this.viewModel.distance = this.viewshed3D.distance
    this.viewModel.horizontalFov = this.viewshed3D.horizontalFov
    this.viewModel.verticalFov = this.viewshed3D.verticalFov
  }

  get viewer() {
    return this._viewer
  }

  get viewshed3D() {
    return this._viewshed3D
  }

  get handler() {
    return this._handler
  }

  get viewModel() {
    return this._viewMode
  }

  get viewPosition() {
    return this._viewPosition
  }

  get pointHandler() {
    return this._pointHandler
  }
}
