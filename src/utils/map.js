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

/**
 * 坐标是否在中国
 * @param lon
 * @param lat
 * @returns {boolean}
 */
export function outOfChina(lon, lat) {
  if (lon < 72.004 || lon > 137.8347) {
    return true
  }
  return lat < 0.8293 || lat > 55.8271
}
