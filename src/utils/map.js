/**
 * 获取屏幕点击位置的Cartesian3
 * @param viewer
 * @param screenPosition
 * @returns {Cartesian3}
 */
export function getPosition(viewer, screenPosition) {
  const ray = viewer.camera.getPickRay(screenPosition)
  let cartesian = viewer.scene.globe.pick(ray, viewer.scene)

  // 如果没有击中地面，使用椭球体上的点
  if (!cartesian) {
    cartesian = viewer.scene.camera.pickEllipsoid(
      screenPosition,
      viewer.scene.globe.ellipsoid
    )
  }
  return cartesian
}
