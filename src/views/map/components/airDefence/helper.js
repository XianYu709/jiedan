import request from '@/utils/request'
import { Message } from 'element-ui'
import { merge, isEmpty } from 'lodash'

const {
  Cartesian3
} = window.Cesium

const defaultParams = {
  pageNum: 1,
  pageSize: 10,
  targetName: '',
  targetType: ''
}
/**
 * 防空预警
 */
export default class AirDefenceHelper {
  constructor(viewer) {
    this._serverUrl = window.MAP_CONFIG.airDefenceServerUrl
    this._modelEntities = []
    this._viewer = viewer
  }

  async search(params) {
    params = merge({}, defaultParams, params || {})
    return new Promise((resolve, reject) => {
      request.post(this.serverUrl, JSON.stringify(params), {
        'Content-Type': 'application/json'
      }).then(response => {
        console.log('response =', response)
        if (!response.ok) {
          Message.error(`网络响应不正常: ${response}`)
          return false
        }
        const { code, data = {}, message = '' } = response.data || {}
        if (code === 200) {
          resolve(data)
          this.clear()
          this._createModel(data.data)
        } else {
          Message.error(`查询失败: ${message}`)
        }
      }, err => {
        Message.error(`网络异常: ${err}`)
      }).catch(err => Message.error(`请求失败: ${err}`))
    })
  }

  clear() {
    if (!isEmpty(this.modelEntities)) {
      this.modelEntities.forEach(entity => this.viewer.entities.remove(entity))
    }
    this._modelEntities = []
  }

  _createModel(data) {
    return data.filter(item => item.posValid === '1').map((item) => {
      const { tgtLon, tgtLat, tgtHeight } = item
      return this.viewer.entities.add({
        position: Cartesian3.fromDegrees(tgtLon, tgtLat, tgtHeight),
        model: {
          url: ''
        }
      })
    })
  }

  get viewer() {
    return this._viewer
  }

  get serverUrl() {
    return this._serverUrl
  }

  get modelEntities() {
    return this._modelEntities
  }
}
