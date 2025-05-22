import request from '@/utils/request'
import { Message } from 'element-ui'
import { merge } from 'lodash'
import { outOfChina } from '@/utils/map'

const {
  Cartesian3,
  CustomDataSource,
  Color,
  LabelStyle,
  VerticalOrigin,
  Cartesian2
} = window.Cesium

// 目标类型
export const TGT_TYPE_MAP = {
  '防空导弹阵地': 'sys_tgt_group_1',
  '港口': 'sys_tgt_group_2',
  '火炮阵地': 'sys_tgt_group_3',
  '兵营': 'sys_tgt_group_4',
  '军用仓库': 'sys_tgt_group_5',
  '指挥机构': 'sys_tgt_group_6',
  '军事通信设施': 'sys_tgt_group_7',
  '技术侦察阵地': 'sys_tgt_group_8',
  '对空雷达站': 'sys_tgt_group_9',
  '对海雷达站': 'sys_tgt_group_10',
  '电力设施': 'sys_tgt_group_11',
  '后装保障设施': 'sys_tgt_group_12',
  '机场': 'sys_tgt_group_13',
  '防空阵地': 'sys_tgt_group_14',
  '防空雷达阵地': 'sys_tgt_group_15',
  '对海雷达阵地': 'sys_tgt_group_16',
  '技术侦察基地': 'sys_tgt_group_17',
  '卫星接收站': 'sys_tgt_group_18',
  '巡航导弹阵地': 'sys_tgt_group_19',
  '岸防导弹阵地': 'sys_tgt_group_20',
  '兵工厂': 'sys_tgt_group_21',
  '炼油厂': 'sys_tgt_group_22',
  '交通枢纽': 'sys_tgt_group_23',
  '电视台': 'sys_tgt_group_24',
  '防御工事': 'sys_tgt_group_25',
}

export function getTgtTypes(keys) {
  return Object.keys(TGT_TYPE_MAP)
    .filter(key => keys.includes(key))
    .map(key => TGT_TYPE_MAP[key])
}

// 默认查询条件
const defaultParams = {
  pageInfo: {
    pageNum: 1,
    pageSize: 10
  },
  targetName: '',
  targetType: ''
}

const ENTITY_ID_PREFIX = 'target-plotting'

/**
 * 目标标绘
 */
export default class TargetPlottingHelper {
  constructor(viewer) {
    // 数据接口地址
    this._serverUrl = window.MAP_CONFIG.targetPlottingServerUrl
    // 模型接口地址
    this._modelDownloadServerUrl = window.MAP_CONFIG.targetModelDownloadServerUrl
    // 模型预览图片接口地址（未用到）
    this._modelImageServerUrl = window.MAP_CONFIG.targetModelImageServerUrl
    this._dataSource = new CustomDataSource('target-plotting-dataSource')
    viewer.dataSources.add(this.dataSource)
    this._viewer = viewer
  }

  /**
   * 搜索
   * @param params
   * @returns {Promise<unknown>}
   */
  async search(params) {
    params = merge({}, defaultParams, params || {})
    return new Promise((resolve, reject) => {
      request.post(this.serverUrl, params).then(data => {
        const { statusCode, items = {}, msg = '' } = data || {}
        if (statusCode === 200) {
          resolve(data)
          items.filter(({ posValid, tgtLon, tgtLat }) => posValid === 1 && !outOfChina(tgtLon, tgtLat))
            .map(item => this._createEntity(item))
        } else {
          Message.error(`查询失败: ${msg}`)
        }
      }, err => {
        Message.error(`网络异常: ${err}`)
      }).catch(err => Message.error(`请求失败: ${err}`))
    })
  }

  /**
   * 清空
   */
  clear() {
    this.dataSource.entities.removeAll()
  }

  /**
   * 销毁
   */
  destroy() {
    this.viewer.dataSources.remove(this.dataSource)
  }

  /**
   * 居中指定id的数据
   * @param id
   */
  flyTo(id) {
    const entity = this.dataSource.entities.getById(`${ENTITY_ID_PREFIX}-${id}`)
    console.log('fly =', `${ENTITY_ID_PREFIX}-${id}`, entity, this.dataSource.entities)
    if (entity) {
      this.viewer.flyTo(entity)
    }
  }

  /**
   * 根据数据创建实体
   * @param item
   * @returns {*}
   * @private
   */
  _createEntity(item) {
    const {
      id,
      tgtLon,
      tgtLat,
      tgtHeight,
      tgtName,
      modelName
    } = item
    const entityId = `${ENTITY_ID_PREFIX}-${id}`
    let entity = this.dataSource.entities.getById(entityId)
    if (!entity) {
      entity = this.dataSource.entities.add({
        id: entityId,
        position: Cartesian3.fromDegrees(tgtLon, tgtLat, tgtHeight),
        label: {
          text: tgtName,
          font: '14pt sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -10)// 垂直偏移
        },
        description: this._createDescription(item)
      })
    }
    if (modelName) {
      entity.model = {
        uri: `${this._modelDownloadServerUrl}/${id}`,
        scale: 5
      }
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

  /**
   * 创建描述
   * @param item
   * @returns {string}
   * @private
   */
  _createDescription(item) {
    const {
      id,
      tgtLon,
      tgtLat,
      tgtHeight,
      tgtName,
      pwrDis,
      pwrAz,
      pwrEl,
      converArea,
      criticalPart,
      positionFunction,
      tgtType,
      tgtFirmType,
      tgtFormStr,
      tgtRoundCase,
    } = item
    return `
        <div style='padding:10px;font-family:Arial;max-height:400px;'>
          <h3 style='color:#1976d2;margin-top:0'>${tgtName}</h3>
          <img src='${this._modelImageServerUrl}/${id}' style='height:120px; width:200px;' />
          <p>${tgtName}</p>
          <table style='width:100%;border-collapse:collapse'>
            <tr style='border-bottom:1px solid #eee'>
              <td style='padding:5px 0'>经度</td>
              <td style='text-align:right'>${tgtLon.toFixed(4)}°E</td>
            </tr>
            <tr style='border-bottom:1px solid #eee'>
              <td style='padding:5px 0'>纬度</td>
              <td style='text-align:right'>${tgtLat.toFixed(4)}°N</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>高度</td>
              <td style='text-align:right'>${tgtHeight}米</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>威力距离（Km）</td>
              <td style='text-align:right'>${pwrDis}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>威力范围-方位（度）</td>
              <td style='text-align:right'>${pwrAz}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>威力范围-俯仰（度）</td>
              <td style='text-align:right'>${pwrEl}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>占地面积（平方米）</td>
              <td style='text-align:right'>${converArea}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>关键部位</td>
              <td style='text-align:right'>${criticalPart}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>地位作用</td>
              <td style='text-align:right'>${positionFunction}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>目标类型</td>
              <td style='text-align:right'>${tgtType}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>坚固类型</td>
              <td style='text-align:right'>${tgtFirmType}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>组成结构</td>
              <td style='text-align:right'>${tgtFormStr}</td>
            </tr>
            <tr>
              <td style='padding:5px 0'>周围情况</td>
              <td style='text-align:right'>${tgtRoundCase}</td>
            </tr>
          </table>
        </div>
      `
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
