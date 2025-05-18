import DrawHelper, { DRAW_MODE } from '@/views/map/plugins/Draw'
import { isFunction, isEmpty } from 'lodash'

const {
  Color,
  LabelStyle,
  VerticalOrigin,
  HorizontalOrigin,
  HeightReference
} = window.Cesium

/**
 * 三维标绘
 */
export default class ThreeDDrawHelper {
  constructor(viewer, options = { onFinish: null }) {
    this._viewer = viewer
    this._draw = null
    this._options = options || {}
    this._drawType = null
    this._drawText = null
    this._drawModel = null
    this._drawEntities = []
  }

  active({ type, text, model }) {
    if (!this.draw) {
      this._draw = new DrawHelper(this.viewer, { onFinish: (entity) => this._onFinishDraw(entity) })
    }
    this._drawType = type
    this._drawText = text
    this._drawModel = model
    this.viewer.scene.globe.depthTestAgainstTerrain = false
    this.draw.startDrawing(DRAW_MODE.POINT)
  }

  deactivate() {
    this._drawType = null
    this._drawText = null
    this._drawModel = null
    this.draw?.deactivate()
  }

  clear() {
    this.draw?.clearAll()
    if (!isEmpty(this.drawEntities)) {
      this.drawEntities.forEach(entity => this.viewer.entities.remove(entity))
    }
  }

  _onFinishDraw(entity) {
    this.draw.clearAll()
    let finalEntity
    const position = entity.position
    if (this.drawType === 'text') {
      finalEntity = this._createLabel(position)
    } else if (this.drawType === 'model') {
      finalEntity = this._createModel(position)
    }
    this.drawEntities.push(finalEntity)
    isFunction(this.options.onFinish) && this.options.onFinish(finalEntity)
  }

  _createLabel(position) {
    return this.viewer.entities.add({
      position,
      label: {
        text: this._drawText,
        // 字体样式，以CSS语法指定字体
        font: '16pt Source Han Sans CN',
        // 字体颜色
        fillColor: Color.WHITE,
        // 背景颜色
        // backgroundColor: Color.AQUA,
        // 是否显示背景颜色
        // showBackground: true,
        // 字体边框
        outline: true,
        // 字体边框颜色
        outlineColor: Color.BLACK,
        // 字体边框尺寸
        outlineWidth: 1,
        // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        scale: 1.0,
        // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
        style: LabelStyle.FILL_AND_OUTLINE,
        // 相对于坐标的水平位置
        verticalOrigin: VerticalOrigin.CENTER,
        // 相对于坐标的水平位置
        horizontalOrigin: HorizontalOrigin.CENTER,
        // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
        // pixelOffset: new Cartesian2(10, 0),
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new DistanceDisplayCondition(0, 1500),
        distanceDisplayCondition: Number.POSITIVE_INFINITY,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        // 是否显示
        show: true
      }
    })
  }

  _createModel(position) {
    return this.viewer.entities.add({
      position,
      model: {
        // 引入模型
        uri: this.drawModel.path,
        // 模型的近似最小像素大小，而不考虑缩放。这可以用来确保即使观看者缩小也可以看到模型。如果为0.0，则不强制使用最小大小
        // minimumPixelSize: 1280,
        // 模型的颜色（与模型的渲染颜色混合的属性）
        // color: Color.WHITE.withAlpha(1),
        // 模型的最大比例大小
        // maximumScale: 20000,
        // 设置模型轮廓（边框）颜色
        // silhouetteColor: Color.BLACK,
        // 设置模型轮廓（边框）大小
        // silhouetteSize: 2,
        // 是否执行模型动画
        runAnimations: true,
        // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        scale: 1.0,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
        // 是否显示
        show: true
      }
    })
  }

  get viewer() {
    return this._viewer
  }

  get draw() {
    return this._draw
  }

  get options() {
    return this._options
  }

  get drawType() {
    return this._drawType
  }

  get drawText() {
    return this._drawText
  }

  get drawModel() {
    return this._drawModel
  }

  get drawEntities() {
    return this._drawEntities
  }
}
