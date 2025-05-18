import { isEmpty } from 'lodash'

/**
 * 卷帘
 */
export default class RollerShutter {
  _viewer
  _imageryLayers
  _rectangle
  _rollerShutterConfig
  _verticalSlider
  _isOpened

  constructor(viewer) {
    this._viewer = viewer
    this._imageryLayers = []
    this._isOpened = false
    this.init()
  }

  init() {
    const {
      SuperMapImageryProvider,
      ImagerySplitDirection,
      Rectangle,
      Cartesian2
    } = window.Cesium
    const viewer = this.viewer
    viewer.resolutionScale = window.devicePixelRatio
    // 参与卷帘的影像图层数组，第一个在左边
    this._imageryLayers = window.MAP_CONFIG.rollerShutterLayers.map(({ url, name }) => {
      return viewer.imageryLayers.addImageryProvider(new SuperMapImageryProvider({
        url, name
      }))
    })
    this._rectangle = Rectangle.union(this.imageryLayers[0].rectangle, this.imageryLayers[1].rectangle)
    // this._rectangle = Rectangle.center(this.imageryLayers[0].rectangle)
    const windowWidth = window.document.body.clientWidth // 窗口宽度
    const windowHeight = window.document.body.clientHeight // 窗口高度
    // 卷帘配置参数，以对象方式实现地址传递
    this._rollerShutterConfig = {
      splitDirection: new Cartesian2(ImagerySplitDirection.RIGHT, ImagerySplitDirection.NONE), // 初始时屏蔽左侧
      verticalSplitPosition: windowWidth / 2,
      horizontalSplitPosition: windowHeight / 2,
      imageryLayers: [this._imageryLayers[1]], // 参与卷帘的影像图层数组
      latestSplitDirection: null // 用于在禁用卷帘后恢复之前的卷帘方向
    }
    this._verticalSlider = document.createElement('div')
    this.verticalSlider.className = 'vertical-slider'
    viewer.container.appendChild(this.verticalSlider)
    this._initRollerShutter()
  }

  _initRollerShutter() {
    const {
      ImagerySplitDirection,
      Cartesian2
    } = window.Cesium
    this.rollerShutterConfig.splitDirection = new Cartesian2(ImagerySplitDirection.RIGHT, ImagerySplitDirection.NONE)
    this._setRollerShutterSplit()
    this._bindSliderEvt()
  }

  open() {
    this._isOpened = true
    this.verticalSlider.style.display = 'block'
    // 显示图层
    if (!isEmpty(this.imageryLayers)) {
      this.imageryLayers.forEach(layer => { layer.show = true })
      // viewer.scene.camera.flyTo({
      //   destination: this.rectangle,
      //   duration: 2
      // })
    }
    if (this.rollerShutterConfig.latestSplitDirection) {
      this.rollerShutterConfig.splitDirection = this.rollerShutterConfig.latestSplitDirection
    }
    this._setRollerShutterSplit()
  }

  close() {
    const {
      ImagerySplitDirection,
      Cartesian2
    } = window.Cesium
    // 隐藏图层
    if (!isEmpty(this.imageryLayers)) {
      this.imageryLayers.forEach(layer => { layer.show = false })
    }
    this._isOpened = false
    this.rollerShutterConfig.latestSplitDirection = this.rollerShutterConfig.splitDirection
    this.rollerShutterConfig.splitDirection = new Cartesian2(ImagerySplitDirection.NONE, ImagerySplitDirection.NONE)
    this.verticalSlider.style.display = 'none'
    this._setRollerShutterSplit()
  }

  _bindSliderEvt() {
    const sliderMove = (e) => { // 鼠标拖拽时执行
      // 解决拖拽鼠标粘滞的问题
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
      this.verticalSlider.style.left = e.clientX + 'px'
      this.rollerShutterConfig.verticalSplitPosition = e.clientX
      this._setRollerShutterSplit()
    }
    const mouseUp = (e) => document.removeEventListener('mousemove', sliderMove, false)
    const mouseDown = (e) => document.addEventListener('mousemove', sliderMove, false)
    this.verticalSlider.addEventListener('mousedown', mouseDown, false)
    document.addEventListener('mouseup', mouseUp, false)
  }

  _setRollerShutterSplit() {
    const {
      ImagerySplitDirection,
      Cartesian2
    } = window.Cesium
    let splitPosition = null
    const rollerShutterConfig = this.rollerShutterConfig
    if (rollerShutterConfig.splitDirection.equals(new Cartesian2(ImagerySplitDirection.RIGHT, ImagerySplitDirection.NONE))) {
      splitPosition = rollerShutterConfig.verticalSplitPosition
    }
    for (const imageryLayer of rollerShutterConfig.imageryLayers) {
      console.log('split direction =', rollerShutterConfig.splitDirection, rollerShutterConfig.splitDirection.equals(new Cartesian2(ImagerySplitDirection.RIGHT, ImagerySplitDirection.NONE)))
      imageryLayer.splitDirection = rollerShutterConfig.splitDirection
    }
    console.log('splitPosition =', splitPosition)
    if (splitPosition) {
      if (rollerShutterConfig.splitDirection.equals(new Cartesian2(ImagerySplitDirection.RIGHT, ImagerySplitDirection.NONE))) {
        this.viewer.scene.imagerySplitPosition.x = splitPosition / document.body.clientWidth
      }
    }
  }

  get viewer() {
    return this._viewer
  }

  get imageryLayers() {
    return this._imageryLayers
  }

  get rectangle() {
    return this._rectangle
  }

  get verticalSlider() {
    return this._verticalSlider
  }

  get rollerShutterConfig() {
    return this._rollerShutterConfig
  }

  get isOpened() {
    return this._isOpened
  }
}
