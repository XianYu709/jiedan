import request from '@/utils/request'
import Socket from '@/utils/socket'
import { isEmpty, isFunction } from 'lodash'
import MessageHandler from './message'

const {
  Cartesian3,
  Model,
  JulianDate,
  Transforms,
  Matrix3,
  Matrix4,
  Cartographic,
  Math: CesiumMath
} = window.Cesium
/**
 * UDP接收
 */
export default class UdpHelper {
  constructor(viewer, options = { onMessage: null, onConnect: null, onError: null, onClose: null }) {
    viewer.clock.shouldAnimate = true
    this._options = options || {}
    this._socket = null
    this._entityModels = {}
    this._entityBeamModels = {}
    this._nIdMap = {}
    this._viewer = viewer
  }

  open() {
    console.log('open =', this.socket)
    // if (!this.socket) {
    //   this._socket = Socket.create(window.MAP_CONFIG.udpSocketServerUrl, {
    //     onMessage: (data) => this._onMessage(data),
    //     onOpen: () => this._onConnect(),
    //     onClose: () => this._onClose(),
    //     onError: (error) => this._onError(error)
    //   })
    // }
    // this.socket?.connect()
    request.get('/data/0516Test.txt', { baseURL: '/', responseType: 'blob' }).then(response => {
      response.text().then(text => {
        const geoJson = JSON.parse(text)
        console.log('geojson =', geoJson)
        this._onMessage(geoJson)
      })
    })
  }

  close() {
    this.socket?.close()
  }

  _onMessage(data) {
    MessageHandler.handler(this, data)
    isFunction(this._options?.onMessage) && this._options.onMessage(data)
  }

  _onConnect() {
    isFunction(this._options?.onConnect) && this._options.onConnect()
  }

  _onClose() {
    isFunction(this._options?.onClose) && this._options.onClose()
  }

  _onError(error) {
    isFunction(this._options?.onError) && this._options.onError(error)
  }

  createModelPrimitive(nId, name) {
    const url = this.getModelUrl(nId, name)
    if (!url) {
      return null
    }
    return this.viewer.scene.primitives.add(Model.fromGltf({
      // id: `udp-model-${entityId}`,
      // url: '/data/GLTF整理/C350A_GLTF/C350A_GLTF/c350a.gltf',
      url,
      show: true
    }))
  }

  /**
   * 球形波束模型
   */
  createSphereWaveModelPrimitive() {
    return this.viewer.scene.primitives.add(Model.fromGltf({
      url: '/data/gltf/n-mid.gltf',
      scale: 100,
      runAnimations: true,
      minimumPixelSize: 512,
      maximumScale: 200000,
      show: true
    }))
  }

  /**
   * 球形波束模型
   */
  createSphereWaveModelEntity(longitude, latitude) {
    return this.viewer.entities.add({
      position: Cartesian3.fromDegrees(longitude, latitude, 200),
      model: {
        uri: '/data/gltf/n-mid.gltf',
        scale: 100,
        runAnimations: true,
        show: true
      }
    })
  }

  /**
   * 圆锥形波束模型
   */
  createConeWaveModelPrimitive() {
    return this.viewer.scene.primitives.add(Model.fromGltf({
      url: '/data/gltf/n-mid.gltf',
      show: true
    }))
  }

  _createBeamModelPrimitive() {

  }

  updateModelMatrixByTransform(model, transform) {
    const {
      Pos: { dLon, dLat, fAlt },
      Rot: { fAz, fEl, fRoll }
    } = transform
    this.updateModelMatrix(model, {
      tx: Number(dLon),
      ty: Number(dLat),
      tz: Number(fAlt),
      rx: Number(fAz),
      ry: Number(fEl),
      rz: Number(fRoll)
    })
  }

  /**
   * 模型旋转矩阵变换
   * @param model 模型
   * @param tx 经度
   * @param ty 纬度
   * @param tz 高度
   * @param rx 航向
   * @param ry 俯仰角
   * @param rz 翻滚角
   * @private
   */
  updateModelMatrix(model, { tx, ty, tz, rx, ry, rz }) {
    debugger
    // 旋转
    const mx = Matrix3.fromRotationX(CesiumMath.toRadians(rx))
    const my = Matrix3.fromRotationY(CesiumMath.toRadians(ry))
    const mz = Matrix3.fromRotationZ(CesiumMath.toRadians(rz))
    const rotationX = Matrix4.fromRotationTranslation(mx)
    const rotationY = Matrix4.fromRotationTranslation(my)
    const rotationZ = Matrix4.fromRotationTranslation(mz)
    // 平移
    const position = Cartesian3.fromDegrees(tx, ty, 200)
    const m = Transforms.eastNorthUpToFixedFrame(position)
    // 旋转、平移矩阵相乘
    Matrix4.multiply(m, rotationX, m)
    Matrix4.multiply(m, rotationY, m)
    Matrix4.multiply(m, rotationZ, m)
    // 赋值给model
    if (model.primitive) {
      model.primitive.modelMatrix = m
    }
    // const { longitude, latitude } = Cartographic.fromCartesian(Matrix4.getTranslation(m.clone(), new Cartesian3()))
    // console.log('updateModelMatrix =', model.modelMatrix.clone(), m.clone(), CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude))
    model.modelMatrix = m
  }

  flyTo(model, { tx, ty }) {
    model.readyPromise.then((model) => {
      // 定位到模型的位置，此处使用viewer.zoomTo(model)报错
      this.viewer.camera.setView({
        destination: Cartesian3.fromDegrees(tx, ty, 150.0),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-90),
          roll: CesiumMath.toRadians(0)
        }
      })
    })
  }

  getModelUrl(nId, name) {
    return '/data/GLTF整理/C350A_GLTF/C350A_GLTF/c350a.gltf'
  }

  _createModelEntity(entityId, { position, orientation }) {
    return this.viewer.entities.add({
      name: `entityModel-${entityId}`,
      position,
      orientation,
      model: {
        // uri: '/data/gltf/cube.gltf'
        uri: '/data/GLTF整理/C350A_GLTF/C350A_GLTF/c350a.gltf'
      }
    })
  }

  _createBeamModelEntity(entityId, { position, orientation }) {
    return this.viewer.entities.add({
      name: `beamModel-${entityId}`,
      position,
      model: {
        // uri: '/data/gltf/cube.gltf'
        uri: '/data/gltf/n-mid.gltf'
      }
    })
  }

  get viewer() {
    return this._viewer
  }

  get socket() {
    return this._socket
  }

  get entityModels() {
    return this._entityModels
  }

  get entityBeamModels() {
    return this._entityBeamModels
  }

  get nIdMap() {
    return this._nIdMap
  }
}
