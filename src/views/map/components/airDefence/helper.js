import request from '@/utils/request'
import { Message } from 'element-ui'
import { outOfChina } from '@/utils/map'
import { getTgtTypes } from '@/views/plotting/targetPlotting/helper'
import { merge, isEmpty } from 'lodash'

const {
  Cartesian3,
  CustomDataSource,
  Color,
  LabelStyle,
  VerticalOrigin,
  Cartesian2,
  ColorBlendMode
} = window.Cesium

const defaultParams = {
  pageInfo: {
    pageNum: 1,
    pageSize: 10
  },
  targetName: '',
  tgtType: '' // 对空雷达
}

// 支持的类型
const includeTgtTypes = getTgtTypes(['防空导弹阵地', '对空雷达站', '对海雷达站', '防空阵地', '防空雷达阵地', '对海雷达阵地'])
// entity id前缀
const ENTITY_ID_PREFIX = 'air-defence'

/**
 * 防空预警
 */
export default class AirDefenceHelper {
  constructor(viewer) {
    this._serverUrl = window.MAP_CONFIG.airDefenceServerUrl
    this._modelUrl = '/data/gltf/pyramidqiu.gltf'
    this._dataSource = new CustomDataSource('air-defence-dataSource')
    viewer.dataSources.add(this.dataSource)
    this._viewer = viewer
  }

  async search(params) {
    params = merge({}, defaultParams, params || {})
    return new Promise((resolve, reject) => {
      request.post(this.serverUrl, params).then(data => {
        const { statusCode, items = {}, msg = '' } = data || {}
        if (statusCode === 200) {
          resolve(data)
          const entities = items
            .filter(({ posValid, tgtType, tgtLon, tgtLat }) => includeTgtTypes.includes(tgtType) && posValid === 1 && !outOfChina(tgtLon, tgtLat))
            .map(item => this._createEntity(item))
          this.viewer.flyTo(entities)
        } else {
          Message.error(`查询失败: ${msg}`)
        }
      }, err => {
        Message.error(`网络异常: ${err}`)
      }).catch(err => Message.error(`请求失败: ${err}`))
    })
  }

  clear() {
    this.dataSource.entities.removeAll()
  }

  destroy() {
    this.viewer.dataSources.remove(this.dataSource)
  }

  _createEntity(item) {
    const {
      id,
      tgtLon,
      tgtLat,
      tgtHeight,
      pwrDis,
      tgtName
    } = item
    const entityId = `${ENTITY_ID_PREFIX}-${id}`
    let entity = this.dataSource.entities.getById(entityId)
    if (!entity) {
      entity = this.dataSource.entities.add({
        id: entityId,
        position: Cartesian3.fromDegrees(tgtLon, tgtLat, 0),
        label: {
          text: tgtName,
          font: '14pt sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -10) // 垂直偏移
        },
        model: {
          uri: this._modelUrl,
          scale: pwrDis ? (pwrDis * 100) : 1,
          color: Color.RED.withAlpha(1),
          colorBlendMode: ColorBlendMode.REPLACE
        }
      })
    }
    if (!entity.model) {
      entity.point = {
        pixelSize: 10,
        color: Color.BLUE,
        outlineColor: Color.WHITE,
        outlineWidth: 1
      }
    }
    return entity
  }

  get viewer() {
    return this._viewer
  }

  get serverUrl() {
    return this._serverUrl
  }

  get dataSource() {
    return this._dataSource
  }
}
