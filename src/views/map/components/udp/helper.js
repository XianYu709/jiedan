import request from '@/utils/request'
import { isEmpty } from 'lodash'

const {
  Cartesian3,
  Model,
  JulianDate,
  Transforms,
} = window.Cesium
/**
 * UDP接收
 */
export default class UdpHelper {
  constructor(viewer) {
    this._viewer = viewer
  }

  open() {
    request.get('/data/0516Test.txt', { baseURL: '/', responseType: 'blob' }).then(response => {
      response.text().then(text => {
        const geoJson = JSON.parse(text)
        console.log('geojson =', geoJson)
        if (!isEmpty(geoJson.sphereWave)) {
          const viewer = window.viewer
          geoJson.sphereWave.forEach(ent => {
            const {
              nID,
              nEntityID,
              Transform: {
                Pos: { nPosType, dLon, dLat, fAlt },
                Rot: { RotateType, fAz, fEl, fRoll },
                Scale: { bValid, Scale_X, Scale_Y, Scale_Z}
              },
              Color: { R, G, B, A },
              nRadius, // 波束范围半径（米）
              FlickerTime, // 闪烁间隔时间
              ScanFrequency, // 扫描频率
              nStyleID, // 波束风格：0默认，1闪烁，2网格
              WaveType, // 波束类型：0球形、1半球
              WavePurpose, // 波束用途：0默认球、1传感器、2干扰器、3作战半径、4攻击范围
            } = ent
            const index = viewer.entities.values.findIndex(entity => {
              return entity.properties && entity.properties.getValue(JulianDate.now())['_nID'] === nID
            })
            if (index === -1) {
              const position = Cartesian3.fromDegrees(117.57892008979036, 25.232480214590284, 200)
              viewer.scene.primitives.add(Model.fromGltf({
                url: '/data/gltf/c350a.gltf', // GLTF文件的URL
                modelMatrix: Transforms.eastNorthUpToFixedFrame(position), // 将模型放置于特定位置
                scale: 10.0, // 调整模型的大小
                maximumScale: 20.0, // 最大缩放比例
                minimumPixelSize: 50 // 模型最小像素大小,
              }))
              viewer.camera.flyTo({
                destination: position
              })
              // const entity = viewer.entities.add(new Entity({
              //   position: Cartesian3.fromDegrees(117.57892008979036, 25.232480214590284, 200),
              //   model: {
              //     uri: '/data/gltf/c350a.gltf',
              //     minimumPixelSize: 16,
              //     maximumScale: 16
              //   }
              // }))
              // viewer.flyTo(entity)
            }
          })
        }
      })
    })
  }

  close() {

  }

  get viewer() {
    return this._viewer
  }
}
