import { isFunction } from 'lodash'

const {
  MeasureHandler,
  MeasureMode,
  ClampMode
} = window.Cesium

export default class MeasureHelper {
  _viewer
  _distanceHandler
  _areaHandler
  _heightHandler
  _clampMode
  _options

  constructor(viewer, options = { onStop: Function }) {
    this._viewer = viewer
    this._options = options || {}
    this.clampMode = ClampMode.Space
  }

  active(type) {
    if (type === 'distance') {
      this._activeDistance()
    } else if (type === 'area') {
      this._activeArea()
    } else if (type === 'height') {
      this._activeHeight()
    }
  }

  _activeDistance() {
    if (!this.distanceHandler) {
      this._initDistanceHandler()
    }
    this.distanceHandler.activate()
  }

  _activeArea() {
    if (!this.areaHandler) {
      this._initAreaHandler()
    }
    this.areaHandler.activate()
  }

  _activeHeight() {
    if (!this.heightHandler) {
      this._initHeightHandler()
    }
    this.heightHandler.activate()
  }

  deactiveAll() {
    this.distanceHandler?.deactivate()
    this.areaHandler?.deactivate()
    this.heightHandler?.deactivate()
  }

  clear() {
    this.deactiveAll()
    this.distanceHandler?.clear()
    this.areaHandler?.clear()
    this.heightHandler?.clear()
  }

  // 初始化测距工具
  _initDistanceHandler() {
    const viewer = this._viewer
    // 初始化测量距离
    const distanceHandler = new MeasureHandler(viewer, MeasureMode.Distance, this.clampMode)
    // 注册测距功能事件
    distanceHandler.measureEvt.addEventListener((result) => {
      const dis = Number(result.distance)
      const distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm'
      distanceHandler.disLabel.text = '距离:' + distance
    })
    distanceHandler.activeEvt.addEventListener((isActive) => {
      if (isActive) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('measureCur').addClass('measureCur')
        // viewer.scene.pickPointEnabled = pickPointEnabled
      } else {
        viewer.enableCursorStyle = true
        isFunction(this.options.onStop) && this.options.onStop()
        // $('body').removeClass('measureCur')
        // viewer.scene.pickPointEnabled = false
      }
    })
    this._distanceHandler = distanceHandler
  }

  // 初始化测面工具
  _initAreaHandler() {
    const viewer = this.viewer
    const areaHandler = new MeasureHandler(viewer, MeasureMode.Area, this.clampMode)
    areaHandler.measureEvt.addEventListener((result) => {
      const mj = Number(result.area)
      const area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
      areaHandler.areaLabel.text = '面积:' + area
    })
    areaHandler.activeEvt.addEventListener((isActive) => {
      if (isActive) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('measureCur').addClass('measureCur')
        // viewer.scene.pickPointEnabled = pickPointEnabled
      } else {
        viewer.enableCursorStyle = true
        isFunction(this.options.onStop) && this.options.onStop()
        // $('body').removeClass('measureCur')
        // viewer.scene.pickPointEnabled = false
      }
    })
    this._areaHandler = areaHandler
  }

  _initHeightHandler() {
    const viewer = this.viewer
    const heightHandler = new MeasureHandler(viewer, MeasureMode.DVH)
    heightHandler.measureEvt.addEventListener((result) => {
      const distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm'
      const vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm'
      const hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm'
      heightHandler.disLabel.text = '空间距离:' + distance
      heightHandler.vLabel.text = '垂直高度:' + vHeight
      heightHandler.hLabel.text = '水平距离:' + hDistance
      // 实时等高线显示
      // lineHeight = Number(result.endHeight)
      // if (isShowLine) updateContourLine(lineHeight)
    })

    heightHandler.activeEvt.addEventListener((isActive) => {
      if (isActive) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('measureCur').addClass('measureCur')
        // viewer.scene.pickPointEnabled = pickPointEnabled
      } else {
        viewer.enableCursorStyle = true
        isFunction(this.options.onStop) && this.options.onStop()
        // $('body').removeClass('measureCur')
        // viewer.scene.pickPointEnabled = false
      }
    })
    this._heightHandler = heightHandler
  }

  get viewer() {
    return this._viewer
  }

  get distanceHandler() {
    return this._distanceHandler
  }

  get areaHandler() {
    return this._areaHandler
  }

  get heightHandler() {
    return this._heightHandler
  }

  set clampMode(val) {
    this._clampMode = val
  }

  get clampMode() {
    return this._clampMode
  }

  get options() {
    return this._options
  }
}
