import request from '@/utils/request'
import Socket from '@/utils/socket'
import { isEmpty, isFunction } from 'lodash'
import MessageHandler from './message'

const {
  Cartesian3,
  Model,
  Transforms,
  Matrix3,
  Matrix4,
  HeadingPitchRoll,
  ModelAnimationLoop,
  ShadowMode,
  CustomDataSource,
  Entity,
  Primitive,
  JulianDate,
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
    this._nIdMap = {}
    const dataSource = new CustomDataSource('udp-dataSource')
    viewer.dataSources.add(dataSource)
    this._dataSource = dataSource
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
    ;['/data/EntsPacket01.txt'].forEach(url => {
      request.get(url, { baseURL: '/', responseType: 'blob' }).then((response) => {
        response.text().then(text => {
          const geoJson = JSON.parse(text)
          console.log('geojson =', geoJson)
          this._onMessage(geoJson)
        })
      })
    })
  }

  clear() {
    Object.values(this.nIdMap).forEach(item => {
      if (item instanceof Entity) {
        this.dataSource.entities.remove(item)
      } else if (item instanceof Primitive) {
        this.viewer.scene.primitives.remove(item)
      }
    })
  }

  close() {
    this.clear()
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

  /**
   * 模型primitive
   * @param url
   * @param longitude
   * @param latitude
   * @param height
   * @param heading
   * @param pitch
   * @param roll
   * @param scale
   * @param color
   * @param translateX
   * @param translateY
   * @param translateZ
   * @param onReady
   * @returns {any|null}
   */
  createModelPrimitive(url, { longitude, latitude, height = 200, heading = 0, pitch = 0, roll = 0, scale = 1, color, translateX = 0, translateY = 0, translateZ = 0, onReady }) {
    if (!url) {
      return null
    }
    const position = Cartesian3.fromDegrees(longitude, latitude, height)
    const hpr = new HeadingPitchRoll(CesiumMath.toRadians(heading), CesiumMath.toRadians(pitch), CesiumMath.toRadians(roll))
    let modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr)
    if (translateX !== 0 || translateY !== 0 || translateZ !== 0) {
      const m = Matrix4.setTranslation(Matrix4.IDENTITY, new Cartesian3(translateX, translateY, translateZ), new Matrix4())
      modelMatrix = Matrix4.multiply(modelMatrix, m, modelMatrix)
    }
    const primitive = this.viewer.scene.primitives.add(Model.fromGltf({
      url,
      modelMatrix,
      scale,
      show: true,
      runAnimations: true,
      shadows: ShadowMode.DISABLED,
      // minimumPixelSize: 512,
      // maximumScale: 100
    }))
    primitive.readyPromise.then((model) => {
      if (color) {
        // primitive.colorBlendMode = ColorBlendMode.MIX
        primitive.color = color
      }
      // Play and loop all animations at half-speed
      primitive.activeAnimations.addAll({
        speedup: 1,
        loop: ModelAnimationLoop.REPEAT
      })
      isFunction(onReady) && onReady(primitive)
    })
    return primitive
  }

  /**
   * 模型entity
   * @param uri
   * @param longitude
   * @param latitude
   * @param height
   * @param scale
   * @param heading
   * @param pitch
   * @param roll
   * @param translateX
   * @param translateY
   * @param translateZ
   * @returns {*}
   */
  createModelEntity(uri, { longitude, latitude, height = 200, scale = 1, heading = 0, pitch = 0, roll = 0, translateX = 0, translateY = 0, translateZ = 0 }) {
    let position = Cartesian3.fromDegrees(longitude, latitude, height)
    const hpr = new HeadingPitchRoll(CesiumMath.toRadians(heading), CesiumMath.toRadians(pitch), CesiumMath.toRadians(roll))
    const orientation = Transforms.headingPitchRollQuaternion(position, hpr)
    if (translateX !== 0 || translateY !== 0 || translateZ !== 0) {
      // 东-北-上参考系构造出4*4的矩阵
      let transform = Transforms.eastNorthUpToFixedFrame(position)
      // 构造平移矩阵
      const m = Matrix4.setTranslation(Matrix4.IDENTITY, new Cartesian3(translateX, translateY, translateZ), new Matrix4())
      // 将当前位置矩阵乘以平移矩阵得到平移之后的位置矩阵
      transform = Matrix4.multiply(transform, m, transform)
      // 从位置矩阵中取出坐标信息
      position = Matrix4.getTranslation(transform, position)
    }
    const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr)

    return this.dataSource.entities.add({
      position,
      orientation,
      model: {
        uri,
        modelMatrix,
        scale,
        runAnimations: true,
        show: true
      }
    })
  }

  updateModelMatrixByTransform(model, transform) {
    const {
      Pos: { dLon, dLat, fAlt },
      Rot: { fAz, fEl, fRoll }
    } = transform
    this.updateModelMatrix(model, {
      tx: Number(dLon),
      ty: Number(dLat),
      // tz: Number(fAlt),
      tz: 200,
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
    // 旋转
    const mx = Matrix3.fromRotationX(CesiumMath.toRadians(rx))
    const my = Matrix3.fromRotationY(CesiumMath.toRadians(ry))
    const mz = Matrix3.fromRotationZ(CesiumMath.toRadians(rz))
    const rotationX = Matrix4.fromRotationTranslation(mx)
    const rotationY = Matrix4.fromRotationTranslation(my)
    const rotationZ = Matrix4.fromRotationTranslation(mz)
    // 平移
    const position = Cartesian3.fromDegrees(tx, ty, tz)
    const m = Transforms.eastNorthUpToFixedFrame(position)
    // 旋转、平移矩阵相乘
    Matrix4.multiply(m, rotationX, m)
    Matrix4.multiply(m, rotationY, m)
    Matrix4.multiply(m, rotationZ, m)
    // 赋值给model
    if (model.primitive) {
      model.primitive.modelMatrix = m
    }
    model.modelMatrix = m
  }

  updateEntityPosition(entity, { longitude = 0, latitude = 0, height, heading = 0, pitch = 0, roll = 0 }) {
    let position = entity.position.getValue(JulianDate.now())
    if (longitude !== 0 || latitude !== 0 || height !== undefined) {
      position = Cartesian3.fromDegrees(longitude, latitude, height)
      entity.position = position
    }
    if (heading !== 0 || pitch !== 0 || roll !== 0) {
      const hpr = new HeadingPitchRoll(CesiumMath.toRadians(heading), CesiumMath.toRadians(pitch), CesiumMath.toRadians(roll))
      entity.orientation = Transforms.headingPitchRollQuaternion(position, hpr)
    }
  }

  flyTo(model, { tx, ty, tz }) {
    model?.readyPromise?.then((model) => {
      // 定位到模型的位置，此处使用viewer.zoomTo(model)报错
      this.viewer.camera.setView({
        destination: Cartesian3.fromDegrees(tx, ty, tz),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-90),
          roll: CesiumMath.toRadians(0)
        }
      })
    })
  }

  get viewer() {
    return this._viewer
  }

  get socket() {
    return this._socket
  }

  get nIdMap() {
    return this._nIdMap
  }

  get dataSource() {
    return this._dataSource
  }
}
