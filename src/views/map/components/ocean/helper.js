import DrawHelper, { DRAW_MODE } from '@/views/map/plugins/Draw'
import WaterPrimitive from '@/views/map/primitives/WaterPrimitive'
import { isEmpty } from 'lodash'

/**
 * 海洋
 */
export default class OceanHelper {
  constructor(viewer) {
    this._waters = []
    this._drawHelper = new DrawHelper(viewer, { onFinish: (entity, positions) => this._handleDrawFinish(entity, positions) })
    this._viewer = viewer
    this._isActived = false
  }

  active() {
    this._drawHelper.startDrawing(DRAW_MODE.POLYGON)
    this._isActived = true
  }

  deactivate() {
    this._isActived = false
    this._drawHelper?.finishDrawing()
  }

  clear() {
    this._drawHelper?.clearAll()
    if (!isEmpty(this.waters)) {
      this.waters.forEach(water => water.clear())
      this._waters = []
    }
  }

  _handleDrawFinish(entity, positions) {
    this._isActived = false
    this.waters.push(new WaterPrimitive(this.viewer, positions))
  }

  get viewer() {
    return this._viewer
  }

  get waters() {
    return this._waters
  }

  get isActived() {
    return this._isActived
  }
}
