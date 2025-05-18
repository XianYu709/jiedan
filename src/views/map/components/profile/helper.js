import request from '@/utils/request'
import {isEmpty} from 'lodash'

const {
  Cartesian3,
  Model,
  JulianDate,
  Transforms,
} = window.Cesium
/**
 * Profile接收
 */
export default class UdpHelper {
  constructor(viewer) {
    this._viewer = viewer
  }

  open() {
    request.get('/data/0516Test.txt', {baseURL: '/', responseType: 'blob'}).then(response => {
      response.text().then(text => {
        console.log(`代码行🚀: text ~ -> `, text)
        const geoJson = JSON.parse(text)
        console.log('geojson =', geoJson)
        if (!isEmpty(geoJson.sphereWave)) {
          const viewer = window.viewer
          const position = Cartesian3.fromDegrees(117.57892008979036, 25.232480214590284, 200)
          // viewer.scene.primitives.add(Model.fromGltf({
          //   url: '/data/gltf/c350a.gltf', // GLTF文件的URL
          //   modelMatrix: Transforms.eastNorthUpToFixedFrame(position), // 将模型放置于特定位置
          //   scale: 10.0, // 调整模型的大小
          //   maximumScale: 20.0, // 最大缩放比例
          //   minimumPixelSize: 50 // 模型最小像素大小,
          // }))
          viewer.camera.flyTo({
            destination: position
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
