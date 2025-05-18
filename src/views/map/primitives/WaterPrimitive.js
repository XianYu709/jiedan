const {
  Color,
  GeometryInstance,
  Material,
  Cartesian3,
  EllipsoidSurfaceAppearance,
  PolygonHierarchy,
  PolygonGeometry,
  GroundPrimitive
} = window.Cesium

/**
 * 四棱锥
 */
export default class WaterPrimitive {
  constructor(viewer, positions) {
    this._viewer = viewer
    this._shouldAnimate = viewer.clock.shouldAnimate
    this._debugShowFramesPerSecond = viewer.scene.debugShowFramesPerSecond
    this._positions = positions
    this._createWater(positions)
  }

  _createWater(positions) {
    const primitive = new GroundPrimitive({
      geometryInstances: new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(positions),
          vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      }),
      asynchronous: true
    })
    primitive.appearance = new EllipsoidSurfaceAppearance({
      material: Material.fromType('Water', {
        baseWaterColor: Color.CORNFLOWERBLUE.withAlpha(0.8),
        normalMap: '/image/map/waterNormalsSmall.jpg',
        frequency: 1000.0,
        animationSpeed: 0.01,
        amplitude: 10,
        specularIntensity: 10,
        blendColor: new Color(0.0, 1.0, 0.699, 1.0),
        specularMap: Material.DefaultImageId
      })
    })
    this._primitive = this.viewer.scene.primitives.add(primitive)
  }

  clear() {
    this.viewer.clock.shouldAnimate = this._shouldAnimate
    this.viewer.scene.debugShowFramesPerSecond = this._debugShowFramesPerSecond
    this.viewer.scene.primitives.remove(this._primitive)
  }

  get viewer() {
    return this._viewer
  }
}
