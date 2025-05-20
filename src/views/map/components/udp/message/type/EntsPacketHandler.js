import { isEmpty } from 'lodash'

const {

} = window.Cesium
/**
 * 实体包
 * TDSMsgHead        stMsgHeader
 * int               nEntNum        实体数量
 * ST_EntInfo        ent[350]       实体数组
 *   int nSimTime
 *   UINT32          nID            实体唯一id
 *   UINT8           name[48];      实体名称
 *   UINT8           typeName[30]   类型名称
 *   ESpaceType      eSpaceType     空间类型
 *   ECamp           eCamp          阵营类型
 *   UINT8           country[30]    国家、地区名称
 *   EUnitType       eUnitType      实体
 *   float           DamagePercent  损毁比例0.0-1.0
 *   UINT8           isDie          0-死亡，1-正常
 *   UINT8           nStatus        状态（1: 正常；2：爆炸；3：起火）
 *   TransformInfo   transform      变化信息
 *   UINT8           spare[8]
 */
export default class EntsPacketHandler {
  static handler(udpServer, data) {
    const { ent } = data
    if (!isEmpty(ent)) {
      ent.forEach(entInfo => {
        const {
          nID,
          name,
          transform
        } = entInfo
        let model = udpServer.nIdMap[nID]
        if (!model) {
          model = udpServer.createModelPrimitive(nID, name)
        }
        model && udpServer.updateModelMatrixByTransform(model, transform)
      })
    }
  }
}
