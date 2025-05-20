const {
  Cartesian3,
  Math: CesiumMath
} = window.Cesium
/**
 * 获取位置
 * @param positionInfo 位置信息
 *   @param positionInfo.nPosType 位置类型(0表示UE相对位置，1表示UE世界位置，2表示地理经纬度和高度位置，3表示ECEF位置)
 *   @param positionInfo.dLon     X轴，地理类型时表示经度
 *   @param positionInfo.Lat      Y轴，地理类型时表示纬度
 *   @param positionInfo.fAlt     Z轴，地理类型时表示海拔高度
 * @returns {Cartographic | HeadingPitchRoll | Rectangle}
 */
export function getPosition(positionInfo) {
  const { nPosType, dLon, dLat, fAlt } = positionInfo
  return nPosType === 2 ? Cartesian3.fromDegrees(dLon, dLat, fAlt) : null
}
/**
 * 获取位置及朝向
 * @param transform
 *   @param transform.Pos
 *   @param transform.Rot
 *     @param transform.Rot.RotateType 旋转顺序(0表示RPY，1表示RYP，2表示PRY，3表示PYR，4表示YRP，5表示YPR)
 *     @param transform.Rot.fAz        航向角
 *     @param transform.Rot.fEl        俯仰角
 *     @param transform.Rot.fRoll      翻滚角
 *   @param transform.Scale
 *     @param transform.Scale.bValid   启用缩放 0-不启用，1-启用
 *     @param transform.Scale.Scale_X  X轴缩放
 *     @param transform.Scale.Scale_Y  Y轴缩放
 *     @param transform.Scale.Scale_Z  Z轴缩放
 */
export function getTransform(transform = {}) {
  const {
    Pos,
    Rot: { RotateType, fAz, fEl, fRoll },
    Scale: { bValid, Scale_X, Scale_Y, Scale_Z }
  } = transform
  const position = getPosition(Pos)
  const orientation = {
    heading: CesiumMath.toRadians(Number(fAz)),
    pitch: CesiumMath.toRadians(Number(fEl)),
    roll: fRoll
  }
  return { position, orientation }
}
