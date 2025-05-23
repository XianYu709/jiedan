import { isEmpty } from 'lodash'
import { getEntityModelUri } from '../util'
import { ENTITY_CHILD_NAME } from '../../helper'

const {
  Cartographic,
  Matrix4,
  Color,
  Cartesian3,
  Math: CesiumMath
} = window.Cesium

// 球形波束外壳gltf路径
const sphereGltfUri = '/data/gltf/pyramidqiu.gltf'
// 球形波束gltf路径
const sphereWavesGltfUri = '/data/gltf/qiuboshu.gltf'

// // 圆锥波束外壳gltf路径
// const sphereGltfUri = '/data/gltf/pyramid.gltf'
// // 圆锥波束gltf路径
// const sphereWavesGltfUri = '/data/gltf/n-mid.gltf'

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
      sphereWave.forEach((item, index) => {
        const {
          nId,
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
        // 实体模型
        let { track, waveHuskTrack, waveTrack } = udpServer.getNId(nEntityID)
        // if (!track) {
        //   return
        // }
        if (index !== 1) {
          return
        }
        const options = {
          longitude: Transform.Pos.dLon,
          latitude: Transform.Pos.dLat,
          height: 200, // Transform.Pos.fAlt
          heading: Transform.Rot.fAz,
          pitch: Transform.Rot.fEl,
          roll: Transform.Rot.fRoll
        }
        // 加载实体
        // if (!track) {
        //   const uri = getEntityModelUri(nEntityID)
        //   track = udpServer.createModelTrack(uri, {
        //     ...options,
        //     // duration: 50,
        //     // heading: 180,
        //     // scale: 10,
        //   })
        //   udpServer.addProperty(nEntityID, track)
        // }
        // 加载波束外壳
        if (!waveHuskTrack) {
          waveHuskTrack = udpServer.createModelTrack(sphereGltfUri, {
            ...options,
            scale: nRadius / 10,
            translateX: 5,
            color: Color.RED.withAlpha(0.5)
          })
          udpServer.addProperty(nEntityID, waveHuskTrack, ENTITY_CHILD_NAME.sphereWaveHuskTrack)
        } else {
          udpServer.moveProperty(nEntityID, {
            ...options,
            translateX: 5
          }, ENTITY_CHILD_NAME.sphereWaveHuskTrack)
        }
        // 加载波束
        if (!waveTrack) {
          waveTrack = udpServer.createModelTrack(sphereWavesGltfUri, {
            ...options,
            scale: nRadius / 10,
            translateX: 5
          })
          // if (index === 1) {
          //   udpServer.viewer.flyToPosition([options.longitude, options.latitude, options.height, 0, -90, 0])
          // }
          udpServer.addProperty(nEntityID, waveTrack, ENTITY_CHILD_NAME.sphereWaveTrack)
          // 测试移动
          // let num = 1
          // setInterval(() => {
          //   udpServer.moveProperty(nEntityID, {
          //     ...options,
          //     longitude: options.longitude + 0.002 * num
          //   })
          //   udpServer.moveProperty(nEntityID, {
          //     ...options,
          //     longitude: options.longitude + 0.002 * num,
          //     // heading: 180,
          //     // scale: 10,
          //     translateX: 5
          //   }, ENTITY_CHILD_NAME.sphereWaveHuskTrack)
          //   udpServer.moveProperty(nEntityID, {
          //     ...options,
          //     longitude: options.longitude + 0.002 * num,
          //     // heading: 180,
          //     // scale: 10,
          //     translateX: 5
          //   }, ENTITY_CHILD_NAME.sphereWaveTrack)
          //   num++
          // }, 3000)
        } else {
          udpServer.moveProperty(nEntityID, {
            ...options,
            translateX: 5
          }, ENTITY_CHILD_NAME.sphereWaveTrack)
        }
      })
    }
  }
}
