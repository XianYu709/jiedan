const {
  Cartesian3,
  Math: CesiumMath
} = window.Cesium

const ENTITY_GLTF_URI = {
  '1': '/data/gltf/J6_GLTF/j6w.gltf', // J6W
  '2': '/data/gltf/WZ10_GLTF/wz10.gltf', // WZ10
  '3': '/data/gltf/GJ11_GLTF/gj11.gltf', // 攻11
  '4': '/data/gltf/YL2_GLTF/yl2d.gltf', // 翼龙2D
  '6': '/data/gltf/J20_GLTF/j20.gltf', // J20
  '7': '/data/gltf/C350A_GLTF/cs350a.gltf', // CS350A
  '8': '/data/gltf/YL6_GLTF/yl6a.gltf', // 翼龙6A
  '9': '/data/gltf/WZ7A_GLTF/wz7.gltf', // WZ7
  '10002': '/data/gltf/HM_FTJ_GLTF/acford.gltf', // 福特级航空母舰，CVN-78
  '10003': '/data/gltf/HM_NMZJ_GLTF/acnimitz.gltf', // 尼米兹航空母舰，CVN-68
  '10200': '/data/gltf/LQGJJ_GLTF/aasamerica.gltf', // 两栖攻击舰
  '20001': '/data/gltf/E2_GLTF/awacse2k.gltf', // E2-K预警机
  '21001': '/data/gltf/CH130_GLTF/ewc130h.gltf', // C130H电子干扰机
  '30001': '/data/gltf/XHH_DLJ_GLTF/lcharmon.gltf', // 中和级登陆艇（现有旭海号）
  '101001': '/data/gltf/CGJ_HWJ_GLTF/frigatecgc.gltf', // 成功级护卫舰
  '101002': '/data/gltf/JYJ_HWJ_GLTF/frigatekangding.gltf', // 康定级护卫舰（现有济阳级）
  '102000': '/data/gltf/SLT_GLTF/msyongfeng.gltf', // 扫雷艇
  '104001': '/data/gltf/GYJ_BJJ_GLTF/sswuyi.gltf', // 武夷号补给舰（现有供应级补给舰）
  '105002': '/data/gltf/TKDLJ_XYJ_GLTF/cruiserticonderoga.gltf' // 提康德罗加巡洋舰
}

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
    Rot: { fAz, fEl, fRoll },
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

/**
 * 获取实体模型路径
 * @param entityId
 * @param entityName
 * @returns {*}
 */
export function getEntityModelUri(entityId, entityName) {
  return ENTITY_GLTF_URI[entityId]
}
