import { isEmpty } from 'lodash'
import { getEntityModelUri } from '../util'

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
      ents.forEach((entInfo, index) => {
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
        // let track = udpServer.getTrack(nID)
        if (!udpServer.getProperty(nID)) {
          const uri = getEntityModelUri(nID)
          if (!uri) {
            return
          }
          const track = udpServer.createModelTrack(uri, {
            ...options,
            scale: 1
          })
          udpServer.addProperty(nID, track)
          // if (index === 0) {
          //   udpServer.viewer.flyToPosition([options.longitude, options.latitude, options.height, options.heading, -90, options.roll])
          // }
          // let num = 1
          // setInterval(() => {
          //   udpServer.moveTrack(nID, {
          //     longitude: options.longitude + 0.002 * num,
          //     latitude: options.latitude,
          //     height: options.height,
          //     duration: 20
          //   })
          //   num++
          // }, 500)
        } else {
          udpServer.moveProperty(nID, {
            longitude: options.longitude,
            latitude: options.latitude,
            height: options.height
          })
        }
      })
    }
  }
}
