import { isEmpty } from 'lodash'
import { getEntityModelUri } from '../util'

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
      coneWave.forEach(item => {
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
        // 实体模型
        let entityModel = udpServer.nIdMap[nEntId]
        if (!entityModel) {
          return
        }
        // 定义圆锥形外壳模型id
        const coneModelId = nTgtId || `${nBeamId}-cone`
        const options = {
          longitude: Transform.Pos.dLon,
          latitude: Transform.Pos.dLat,
          height: 200 // Transform.Pos.fAlt
        }
        // 外壳模型
        let coneModel = udpServer.nIdMap[coneModelId]
        // 波束模型
        let coneWaveModel = udpServer.nIdMap[nBeamId]
        if (nBeamId !== 0) {
          // 加载实体
          if (!entityModel) {
            const uri = getEntityModelUri(nEntId)
            if (!uri) {
              return
            }
            entityModel = udpServer.createModelPrimitive(uri, {
              ...options
            })
            udpServer[nEntId] = entityModel
            // udpServer.flyTo(entityModel, { tx: Transform.Pos.dLon, ty: Transform.Pos.dLat })
          }
          // 加载波束外壳
          if (!coneModel) {
            coneModel = udpServer.createModelPrimitive(coneGltfUri, {
              ...options,
              heading: 180,
              scale: 10,
              translateX: -8,
              color: Color.GREEN.withAlpha(0.3)
            })
            udpServer[coneModelId] = coneModel
          }
          // 加载波束
          if (!coneWaveModel) {
            coneWaveModel = udpServer.createModelEntity(coneWavesGltfUri, {
              ...options,
              heading: 180,
              scale: 10,
              translateX: 8
            })
            udpServer[nBeamId] = coneWaveModel
          } else {
            udpServer.updateEntityPosition(coneWaveModel, options)
          }
        }
      })
    }
  }
}
