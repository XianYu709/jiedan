import { getPosition } from '@/utils/map'
import { isFunction } from 'lodash'

const {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Color,
  LabelStyle,
  Cartesian2,
  Cartesian3
} = window.Cesium

export const DRAW_MODE = {
  POINT: 'point',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
  BOX: 'box'
}

/**
 * 绘制点、线、面
 */
export default class Draw {
  constructor(viewer, options = { onFinish: null }) {
    this._drawHandler = null
    this._activeShapePoints = []
    this._activeShape = null
    this._floatingPoint = null
    this._drawingMode = null
    this._drawnEntities = []
    this._selectedEntity = null
    this._height = 500
    this._status = '就绪'
    this._showMode = false
    this._options = options || {}
    this._tooltip = null
    this._nodeEntities = []
    this._viewer = viewer
  }

  startDrawing(mode) {
    this.stopDrawing()
    const viewer = this.viewer

    this._drawingMode = mode
    this._showMode = false

    this._floatingPoint = this._createPoint(new Cartesian3(), true)
    // this._tooltip = createTooltip(document.body)
    const drawHandler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    drawHandler.setInputAction((movement) => {
      const cartesian = getPosition(viewer, movement.endPosition)
      if (cartesian) {
        if (this.activeShapePoints.length > 0) {
          this.floatingPoint.position = cartesian
          this._updateShape()
        }
        this._updateStatus(`正在绘制: ${mode} (左键添加点, 右键完成, ESC取消)`)
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    drawHandler.setInputAction((click) => {
      const cartesian = getPosition(viewer, click.position)
      if (cartesian) {
        this._addPointToShape(cartesian)
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    drawHandler.setInputAction((click) => {
      if (this.activeShapePoints.length >= this._getMinPoints()) {
        this.finishDrawing()
      } else {
        this._updateStatus(`需要至少 ${this._getMinPoints()} 个点来完成绘制`)
      }
    }, ScreenSpaceEventType.RIGHT_CLICK)

    // ESC键取消绘制
    // drawHandler.setInputAction(() => {
    //   this.stopDrawing()
    //   this._updateStatus('已取消绘制')
    // }, ScreenSpaceEventType.KEY_DOWN, KeyboardEventModifier.ESC)

    this._updateStatus(`开始绘制: ${mode}`)
    this._drawHandler = drawHandler
  }

  stopDrawing() {
    const viewer = this.viewer
    if (this.drawHandler) {
      this.drawHandler.destroy()
      this._drawHandler = null
    }

    if (this.floatingPoint) {
      viewer.entities.remove(this.floatingPoint)
      this._floatingPoint = null
    }

    if (this.activeShape) {
      viewer.entities.remove(this.activeShape)
      this._activeShape = null
    }

    this._activeShapePoints = []
    this._drawingMode = null
  }

  clearAll() {
    this.stopDrawing();
    // this.viewer.entities.removeAll();
    [].concat(this.drawnEntities || []).concat(this.nodeEntities || []).forEach(entity => {
      this.viewer.entities.remove(entity)
    })
    this._drawnEntities = []
    this._nodeEntities = []
    this._updateStatus('已清除所有图形')
  }

  _createPoint(position, isFloating) {
    return this.viewer.entities.add({
      position: position,
      point: {
        pixelSize: isFloating ? 8 : 10,
        color: isFloating ? Color.RED : Color.BLUE,
        outlineColor: Color.WHITE,
        outlineWidth: 1,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  }

  _getMinPoints() {
    switch (this.drawingMode) {
      case 'point': return 1
      case 'polyline': return 2
      case 'polygon': return 3
      case 'box': return 2
      default: return 0
    }
  }

  _addPointToShape(cartesian) {
    if (this.activeShapePoints.length === 0) {
      this.floatingPoint.position = cartesian
    }
    this.activeShapePoints.push(cartesian)
    // this.nodeEntities.push(this._createPoint(cartesian, false))

    // 点类型只需要一个点
    if (this.drawingMode === 'point') {
      this.finishDrawing()
    }
  }

  _updateShape() {
    if (this.activeShapePoints.length < 1) return

    const viewer = this.viewer

    if (this.activeShape) {
      viewer.entities.remove(this.activeShape)
    }

    switch (this.drawingMode) {
      case 'point': {
        this._activeShape = this._createPoint(this.activeShapePoints[0], false)
        break
      }
      case 'polyline': {
        this._activeShape = viewer.entities.add({
          polyline: {
            positions: this.activeShapePoints,
            width: 8,
            material: Color.BLUE.withAlpha(0.7),
            clampToGround: true
          }
        })
        break
      }
      case 'polygon': {
        const positions = this.activeShapePoints.slice()
        if (positions.length > 1) {
          positions.push(positions[0])
        }
        this._activeShape = viewer.entities.add({
          polygon: {
            hierarchy: positions,
            material: Color.GREEN.withAlpha(0.5),
            outline: true,
            outlineColor: Color.GREEN,
            outlineWidth: 2,
            clampToGround: true
          }
        })
        break
      }
      case 'box': {
        if (this.activeShapePoints.length === 2) {
          const minPoint = this.activeShapePoints[0]
          const maxPoint = this.activeShapePoints[1]

          const minX = Math.min(minPoint.x, maxPoint.x)
          const minY = Math.min(minPoint.y, maxPoint.y)
          const minZ = Math.min(minPoint.z, maxPoint.z)
          const maxX = Math.max(minPoint.x, maxPoint.x)
          const maxY = Math.max(minPoint.y, maxPoint.y)
          const maxZ = Math.max(minPoint.z, maxPoint.z) + this.height

          this._activeShape = viewer.entities.add({
            box: {
              dimensions: new Cartesian3(
                maxX - minX,
                maxY - minY,
                maxZ - minZ
              ),
              material: Color.RED.withAlpha(0.5),
              outline: true,
              outlineColor: Color.WHITE,
              outlineWidth: 2
            },
            position: new Cartesian3(
              (minX + maxX) / 2,
              (minY + maxY) / 2,
              (minZ + maxZ) / 2
            )
          })
        }
        break
      }
    }
  }

  finishDrawing() {
    if (this.activeShapePoints.length < this._getMinPoints()) {
      this._updateStatus(`需要至少 ${this._getMinPoints()} 个点来完成绘制`)
      return
    }

    const viewer = this.viewer
    let finalEntity, positions
    switch (this.drawingMode) {
      case 'point': {
        finalEntity = this._createPoint(this.activeShapePoints[0], false)
        break
      }
      case 'polyline': {
        finalEntity = viewer.entities.add({
          name: `Polyline ${this.drawnEntities.length + 1}`,
          polyline: {
            positions: this.activeShapePoints,
            width: 6,
            material: Color.BLUE.withAlpha(0.7),
            clampToGround: true
            // width: 3,
            // material: new window.Cesium.PolylineGlowMaterialProperty({
            //   glowPower: 0.2,
            //   color: window.Cesium.Color.BLUE
            // }),
            // clampToGround: true
          }
        })
        break
      }
      case 'polygon': {
        positions = this.activeShapePoints.slice()
        positions.push(positions[0])
        finalEntity = viewer.entities.add({
          name: `Polygon ${this.drawnEntities.length + 1}`,
          polygon: {
            hierarchy: positions,
            material: Color.GREEN.withAlpha(0.5),
            outline: true,
            outlineColor: Color.GREEN,
            outlineWidth: 2,
            clampToGround: true
          }
        })
        break
      }
      case 'box': {
        const minPoint = this.activeShapePoints[0]
        const maxPoint = this.activeShapePoints[1]

        const minX = Math.min(minPoint.x, maxPoint.x)
        const minY = Math.min(minPoint.y, maxPoint.y)
        const minZ = Math.min(minPoint.z, maxPoint.z)
        const maxX = Math.max(minPoint.x, maxPoint.x)
        const maxY = Math.max(minPoint.y, maxPoint.y)
        const maxZ = Math.max(minPoint.z, maxPoint.z) + 1000

        finalEntity = viewer.entities.add({
          box: {
            dimensions: new Cartesian3(
              maxX - minX,
              maxY - minY,
              maxZ - minZ + this.height
            ),
            material: Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Color.WHITE,
            outlineWidth: 2
          },
          position: new Cartesian3(
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2 - this.height
          )
        })

        this._showMode = true
        break
      }
    }

    if (finalEntity) {
      finalEntity.label = {
        text: finalEntity.name,
        font: '12pt sans-serif',
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 1,
        pixelOffset: new Cartesian2(0, 15),
        style: LabelStyle.FILL_AND_OUTLINE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
      this._addProperties(finalEntity)
      this.drawnEntities.push(finalEntity)
    }

    this.stopDrawing()
    this._updateStatus(`已完成绘制: ${this.drawingMode}`)
    if (isFunction(this.options.onFinish)) {
      this.options.onFinish(finalEntity, positions)
    }
  }

  _addProperties(entity) {
    entity.properties = {
      type: this.drawingMode,
      creator: '用户绘制',
      createTime: new Date().toISOString(),
      description: ''
    }
  }

  cleanup() {
    if (this.viewer) {
      this.stopDrawing()
      this.viewer.entities.removeAll()
      this.viewer.destroy()
    }
  }

  _updateStatus(message) {
    this._status = message
  }

  get viewer() {
    return this._viewer
  }

  get drawHandler() {
    return this._drawHandler
  }

  get activeShapePoints() {
    return this._activeShapePoints
  }

  get activeShape() {
    return this._activeShape
  }

  get floatingPoint() {
    return this._floatingPoint
  }

  get drawingMode() {
    return this._drawingMode
  }

  get drawnEntities() {
    return this._drawnEntities
  }

  get isEditing() {
    return this._isEditing
  }

  get selectedEntity() {
    return this._selectedEntity
  }

  get height() {
    return this._height
  }

  get status() {
    return this._status
  }

  get showMode() {
    return this._showMode
  }

  get options() {
    return this._options
  }

  get nodeEntities() {
    return this._nodeEntities
  }
}
