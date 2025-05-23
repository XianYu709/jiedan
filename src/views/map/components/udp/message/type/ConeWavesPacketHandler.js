import { isEmpty } from 'lodash'
import { getEntityModelUri } from '../util'
import { ENTITY_CHILD_NAME } from '../../helper'

const {
  Color
} = window.Cesium

// 圆锥波束外壳gltf路径
const coneGltfUri = '/data/gltf/pyramid.gltf'
// 圆锥波束gltf路径
const coneWavesGltfUri = '/data/gltf/n-mid.gltf'

/**
 * 圆锥波束包
 * TDSMsgHead     stMsgHeader
 * UINT32         ConeWaveCount       圆锥型波束包个数
 * ConeWaveInfo   coneWave[350]       圆锥型波束包数组
 *   UINT32         nEntId            挂载波束的实体ID
 *   TransformInfo  Transform         波束相对于实体的变换信息
 *   UINT32         nRange            波束范围（米）
 *   // 范围信息
 *   UINT32         nScopeId			    扫描范围ID
 *   float          fAzMin				    方位范围最小
 *   float	        fAzMax				    方位范围最大
 *   float	        fElMin				    俯仰范围最小
 *   float	        fElMax				    俯仰范围最大
 *   ColorInfo      scopeColor		    范围的颜色
 *   // 波束信息
 *   UINT32         nBeamId			      波束ID,当等于0时，只是显示范围
 *   UINT32         nTgtId            目标实体ID，为0时，表示不指向固定目标，非0时（火控）
 *   ColorInfo      beamColor		      波束颜色
 *   UINT32         nInnerTaperAngle  波束内锥角（角度）
 *   UINT32         nStyleId          波束风格：0默认，1闪烁，2网格
 *   UINT32         nFlickerTime      闪烁间隔时间
 *   UINT8          nScanType         扫描类型：0绕翻滚轴扫描、1从起点向终点扫描、2从终点向起点扫描、3无扫描效果
 *   UINT8          nWavePurpose      波束用途：0默认圆锥、1传感器、2干扰器
 *   UINT8	        bBeamInfoValid    波束信息是否有效，0-无效，1-有效
 *   UINT8	        bTgtPosValid      标识下面的tgtPos字段是否有效,0-无效，1-无效
 *   PositionInfo   tgtPos;           目标区域经纬度，用于照射目标区域,当有值时(提示搜索)
 *   float	        fBeamAz;			    波束指向方位
 *   float	        fBeamEl           波束指向俯仰
 *   UINT	          spare[12]
 */
export default class ConeWavesPacketHandler {
  static handler(udpServer, data) {
    const { coneWave = [] } = data
    if (!isEmpty(coneWave)) {
      coneWave.forEach((item, index) => {
        const {
          nEntId,
          Transform,
          nRange,
          fAzMin,
          fAzMax,
          fElMin,
          fElMax,
          scopeColor,
          nBeamId,
          nTgtId,
          beamColor: { R, G, B, A },
          nInnerTaperAngle,
          nFlickerTime,
          tgtPos,
          fBeamAz,
          fBeamEl
        } = item
        if (index !== 1) {
          return
        }
        // 实体模型
        let { track, waveHuskTrack, waveTrack } = udpServer.getNId(nEntId)
        console.log('cone waves =', nEntId, track, waveHuskTrack, waveTrack)
        // if (!track) {
        //   return
        // }
        const options = {
          longitude: Transform.Pos.dLon,
          latitude: Transform.Pos.dLat,
          height: Transform.Pos.fAlt
        }
        if (nBeamId !== 0) {
          // 加载实体
          if (!track) {
            const uri = getEntityModelUri(nEntId)
            track = udpServer.createModelTrack(uri, {
              ...options,
              // duration: 50,
              // heading: 180,
              // scale: 10,
            })
            udpServer.addProperty(nEntId, track)
          }
          // 加载波束外壳
          if (!waveHuskTrack) {
            udpServer.createModelPrimitive(coneGltfUri, {
              ...options,
              height: 0,
              heading: 180,
              pitch: 90,
              scale: 1,
              translateX: 5,
              color: Color.GREEN.withAlpha(0.3)
            })
            waveHuskTrack = udpServer.createModelTrack(coneGltfUri, {
              ...options,
              heading: 180,
              scale: 30,
              translateX: 5,
              color: Color.GREEN.withAlpha(0.3)
            })
            udpServer.addProperty(nEntId, waveHuskTrack, ENTITY_CHILD_NAME.coneWaveHuskTrack)
          } else {
            udpServer.moveProperty(nEntId, {
              ...options,
              heading: 180,
              translateX: 5
            }, ENTITY_CHILD_NAME.coneWaveHuskTrack)
          }
          // 加载波束
          if (!waveTrack) {
            waveTrack = udpServer.createModelTrack(coneWavesGltfUri, {
              ...options,
              // duration: 50,
              heading: 180,
              scale: 30,
              translateX: 8
            })
            udpServer.addProperty(nEntId, waveTrack, ENTITY_CHILD_NAME.coneWaveTrack)
            if (index === 1) {
              udpServer.viewer.flyToPosition([options.longitude, options.latitude, options.height, 0, -90, 0])
            }
            // 测试移动
            // let num = 1
            // setInterval(() => {
            //   udpServer.moveProperty(nEntId, {
            //     ...options,
            //     longitude: options.longitude + 0.002 * num
            //   })
            //   udpServer.moveProperty(nEntId, {
            //     ...options,
            //     longitude: options.longitude + 0.002 * num,
            //     heading: 180,
            //     // scale: 10,
            //     translateX: 5
            //   }, ENTITY_CHILD_NAME.coneWaveHuskTrack)
            //   udpServer.moveProperty(nEntId, {
            //     ...options,
            //     longitude: options.longitude + 0.002 * num,
            //     heading: 180,
            //     // scale: 10,
            //     translateX: 5
            //   }, ENTITY_CHILD_NAME.coneWaveTrack)
            //   num++
            // }, 3000)
          } else {
            udpServer.moveProperty(nEntId, {
              ...options,
              heading: 180,
              translateX: 5
            }, ENTITY_CHILD_NAME.coneWaveTrack)
          }
        }
      })
    }
  }
}
