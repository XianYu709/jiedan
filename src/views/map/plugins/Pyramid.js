const {
  Color,
  Cartesian3,
  Cartesian4,
  Quaternion,
  Matrix3,
  Matrix4,
  PostProcessStage,
  Cartographic,
  Math: CesiumMath
} = window.Cesium

/**
 * 四棱锥
 */
export default class Pyramid {
  constructor(viewer) {
    this._viewer = viewer
    this._init()
  }

  _init() {
  }

  get viewer() {
    return this._viewer
  }
}
