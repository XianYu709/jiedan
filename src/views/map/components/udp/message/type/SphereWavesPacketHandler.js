import { isEmpty } from 'lodash'
const {
  Cartographic,
  Matrix4,
  Color,
  Cartesian3,
  Math: CesiumMath
} = window.Cesium
/**
 * 球形波束包
 * TDSMsgHead       stMsgHeader
 * UINT32           SphereWaveNum    球型波束包个数
 * SphereWaveInfo   sphereWave[350]  球型波束包数组
 *   UINT32         nEntityID        挂载波束的实体ID
 *   UINT32         nId              波束ID
 *   TransformInfo  Transform        波束相对于实体的变换信息
 *   ColorInfo      Color            波束颜色
 *   UINT32         nRadius          波束范围半径（米）
 *   UINT32         FlickerTime      闪烁间隔时间
 *   float          ScanFrequency    扫描频率
 *   UINT8          nStyleID         波束风格：0默认，1闪烁，2网格
 *   UINT8          ScanType         扫描类型：0绕航向轴扫描、1绕翻滚轴扫描、2绕俯仰轴扫描、3无扫描效果
 *   UINT8          WaveType         波束类型：0球形、1半球
 *   UINT8          WavePurpose      波束用途：0默认球、1传感器、2干扰器、3作战半径、4攻击范围
 *   char           spare[8]
 */
export default class SphereWavesPacketHandler {
  static handler(udpServer, data) {
    const { sphereWave = [] } = data
    if (!isEmpty(sphereWave)) {
      sphereWave.forEach(item => {
        const {
          nID,
          nEntityID,
          Transform,
          Color: { R, G, B, A },
          nRadius,
          FlickerTime,
          ScanFrequency,
          nStyleID,
          WaveType,
          WavePurpose,
          spare
        } = item
        // if (udpServer.nIdMap[nEntityID]) {
        // }
        let model = udpServer.nIdMap[nID]
        if (!model) {
          model = udpServer.createSphereWaveModelPrimitive()
          // model = udpServer.createSphereWaveModelEntity(Transform.Pos.dLon, Transform.Pos.dLat)
          const model2 = udpServer.createModelPrimitive(nID, null)
          udpServer.updateModelMatrixByTransform(model2, Transform)
          // udpServer.viewer.flyTo(model2)
          udpServer.flyTo(model2, { tx: Transform.Pos.dLon, ty: Transform.Pos.dLat })
        }
        if (model) {
          // model.color = new Color(R, G, B, A)
          // model.readyPromise.then(() => {
          //   model.activeAnimations.removeAll()
          //   model.activeAnimations.add({ speedup: ScanFrequency })
          // })
          // udpServer.updateModelMatrixByTransform(model, Transform)
          // const { longitude, latitude, height } = Cartographic.fromCartesian(Matrix4.getTranslation(model.modelMatrix, new Cartesian3()))
          // udpServer.flyTo(model, { tx: Transform.Pos.dLon, ty: Transform.Pos.dLat })
          // console.log('model =', model, Transform.Pos.dLon, Transform.Pos.dLat, CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude), height)
          // udpServer.flyTo(model, { tx: CesiumMath.toDegrees(longitude), ty: CesiumMath.toDegrees(latitude) })
        }
      })
    }
  }
}
