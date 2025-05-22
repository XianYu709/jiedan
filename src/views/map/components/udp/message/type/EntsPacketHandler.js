import { isEmpty } from 'lodash'
import { getEntityModelUri } from '../util'

const {
  Color
} = window.Cesium

let fly = false
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
    const { ents } = data
    if (!isEmpty(ents)) {
      ents.forEach(entInfo => {
        const {
          nID,
          name,
          transform
        } = entInfo
        if (transform.Pos.nPosType !== 2) {
          return
        }
        const options = {
          longitude: transform.Pos.dLon,
          latitude: transform.Pos.dLat,
          height: transform.Pos.fAlt,
          heading: transform.Rot.fAz,
          pitch: transform.Rot.fEl,
          roll: transform.Rot.fRoll
        }
        let model = udpServer.nIdMap[nID]
        if (!model) {
          const uri = getEntityModelUri(nID)
          if (!uri) {
            return
          }
          model = udpServer.createModelPrimitive(uri, {
            ...options,
            scale: 20,
            onReady: (primitive) => {
              if (!fly) {
                fly = true
                udpServer.flyTo(primitive, { tx: options.longitude, ty: options.latitude, tz: options.height })
              }
            }
          })
          // let num = 1
          // setInterval(() => {
          //   udpServer.updateModelMatrix(model, {
          //     tx: options.longitude + 0.002 * num,
          //     ty: options.latitude,
          //     tz: options.heading,
          //     rx: options.heading,
          //     ry: options.pitch,
          //     rz: options.roll
          //   })
          //   num++
          // }, 500)
          // console.log('model =', model)
          udpServer.nIdMap[nID] = model
        } else {
          udpServer.updateModelMatrix(model, {
            tx: options.longitude,
            ty: options.latitude,
            tz: options.heading,
            rx: options.heading,
            ry: options.pitch,
            rz: options.roll
          })
          // test: 添加连线
          // udpServer.dataSource.entities.add({
          //   polyline: {
          //     positions: []
          //   }
          // })
        }
      })
    }
  }
}
