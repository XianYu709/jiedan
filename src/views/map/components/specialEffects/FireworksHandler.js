import { isEmpty } from 'lodash'

const {
  ParticleSystem,
  Color,
  Cartesian2,
  Cartesian3,
  Matrix4,
  ConeEmitter,
  Quaternion,
  HeadingPitchRoll,
  TranslationRotationScale,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Rectangle,
  Cartographic,
  Ellipsoid,
  Math: CesiumMath
} = window.Cesium
/**
 * 烟火特效
 */
export default class FireworksHandler {
  constructor(viewer) {
    this._viewer = viewer

    // this._position = Cartesian3.fromDegrees(116.39079313032, 39.9919830785419, 0)
    // this._entity = viewer.entities.add({
    //   position: this._position
    // })

    this._viewModel = {
      emissionRate: 200.0, // 数量
      gravity: 0.0, // 重力
      minimumParticleLife: 1.5, // 最小生命周期
      maximumParticleLife: 1.8, // 最大生命周期
      minimumSpeed: 7.0, // 最小速度
      maximumSpeed: 9.0, // 最大速度
      startScale: 3.0, // 初始比例
      endScale: 1.5, // 终止比例
      particleSize: 2 // 粒子大小
    }

    this._emitterModelMatrix = new Matrix4()
    this._translation = new Cartesian3()
    this._rotation = new Quaternion()
    this._hpr = new HeadingPitchRoll()
    this._trs = new TranslationRotationScale()

    // this._modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(116.3818454, 39.99270708))
    // this._emitterInitialLocation = new Cartesian3(0.0, 0.0, 300.0)
    //
    // this._minimumExplosionSize = 20.0
    // this._maximumExplosionSize = 50.0
    // this._particlePixelSize = 10.0
    // this._burstSize = 600.0
    // this._lifetime = 10.0
    // this._numberOfFireworks = 20.0
    //
    // this._emitterModelMatrixScratch = new Matrix4()
    //
    // this._xMin = -800.0
    // this._xMax = 800.0
    // this._yMin = -800.0
    // this._yMax = 800.0
    // this._zMin = -150.0
    // this._zMax = 150.0
    //
    // this._colorOptions = [
    //   {
    //     red: 0.95,
    //     green: 0.0,
    //     blue: 0.8,
    //     alpha: 1.0
    //   }, {
    //     red: 0.0,
    //     green: 0.75,
    //     blue: 0.8,
    //     alpha: 1.0
    //   }, {
    //     red: 1.0,
    //     green: 0.8,
    //     blue: 0.2,
    //     alpha: 1.0
    //   }, {
    //     red: 0.9,
    //     green: 0.9,
    //     blue: 0.0,
    //     alpha: 1.0
    //   }
    // ]

    this._particleSystems = []
    this._isActived = false
  }

  /**
   * 启动
   */
  active() {
    // if (!this.particleSystem) {
    //   this._init()
    // }
    // for (let i = 0; i < this._numberOfFireworks; ++i) {
    //   const x = CesiumMath.randomBetween(this._xMin, this._xMax)
    //   const y = CesiumMath.randomBetween(this._yMin, this._yMax)
    //   const z = CesiumMath.randomBetween(this._zMin, this._zMax)
    //   const offset = new Cartesian3(x, y, z)
    //   const color = Color.fromRandom(this._colorOptions[i % this._colorOptions.length])
    //
    //   const bursts = []
    //   for (let j = 0; j < 3; ++j) {
    //     bursts.push(new ParticleBurst({
    //       time: CesiumMath.nextRandomNumber() * this._lifetime,
    //       minimum: this._burstSize,
    //       maximum: this._burstSize
    //     }))
    //   }
    //
    //   this._createFirework(offset, color, bursts)
    // }
    // this.viewer.flyTo(this.entity)
    // this.viewer.scene.camera.flyTo({
    //   destination: this._position
    // })
    this._addEvent()
    this._isActived = true
  }

  /**
   * 关闭
   */
  deactive() {
    this._removeEvent()
    this._isActived = false
  }

  /**
   * 清空
   */
  clear() {
    this.deactive()
    if (!isEmpty(this._particleSystems)) {
      this._particleSystems.forEach(primitive => this.viewer.scene.primitives.remove(primitive))
      this._particleSystems = []
    }
  }

  _createParticleSystem(entity) {
    const viewer = this.viewer
    const viewModel = this.viewModel

    const particleSystem = new ParticleSystem({
      image: '/image/particle/fire4.png',
      startColor: new Color(1, 1, 1, 1),
      endColor: new Color(0.5, 0, 0, 0),
      startScale: viewModel.startScale,
      endScale: viewModel.endScale,
      minimumParticleLife: viewModel.minimumParticleLife,
      maximumParticleLife: viewModel.maximumParticleLife,
      minimumSpeed: viewModel.minimumSpeed,
      maximumSpeed: viewModel.maximumSpeed,
      imageSize: new Cartesian2(viewModel.particleSize, viewModel.particleSize),
      emissionRate: viewModel.emissionRate,
      lifetime: 6.0,
      // 循环是否开启
      loop: true,
      emitter: new ConeEmitter(CesiumMath.toRadians(45.0)),
      // emitterModelMatrix: computeEmitterModelMatrix(),
      // updateCallback: applyGravity,
      sizeInMeters: true
    })

    viewer.scene.preUpdate.addEventListener((scene, time) => {
      particleSystem.modelMatrix = this._computeModelMatrix(entity, time)
      // Account for any changes to the emitter model matrix.
      particleSystem.emitterModelMatrix = this._computeEmitterModelMatrix()
    })
    this._particleSystems.push(viewer.scene.primitives.add(particleSystem))
    // this._initKnockout()
    // 泛光开关
    // viewer.scene.bloomEffect.show = true
    // viewer.scene.bloomEffect.threshold = 0.5
    // viewer.scene.bloomEffect.bloomIntensity = 3
    // viewer.scene.hdrEnabled = true

    CesiumMath.setRandomNumberSeed(315)

    return particleSystem
  }

  _addEvent() {
    const viewer = this.viewer
    if (!this._clickEventHandler) {
      this._clickEventHandler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    }
    this._clickEventHandler.setInputAction((event) => {
      if (this._isActived) {
        const entity = viewer.entities.add({
          position: viewer.camera.pickEllipsoid(event.position)
        })
        this._createParticleSystem(entity)
        // viewer.scene.camera.flyTo({
        //   destination: position,
        //   orientation: {
        //     heading: CesiumMath.toRadians(175.0),
        //     pitch: CesiumMath.toRadians(-35.0),
        //     roll: 0.0
        //   }
        // })
      }
    }, ScreenSpaceEventType.LEFT_CLICK)
  }

  _removeEvent() {
    this._clickEventHandler && this._clickEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   * 控制粒子的姿态
   * @private
   */
  // _initKnockout() {
  //   const viewModel = this.viewModel
  //   const particleSystem = this.particleSystem
  //   knockout.track(viewModel)
  //   // const toolbar = document.getElementById('toolbar')
  //   // knockout.applyBindings(viewModel, toolbar)
  //
  //   knockout.getObservable(viewModel, 'emissionRate').subscribe(
  //     (newValue) => { particleSystem.emissionRate = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'particleSize').subscribe(
  //     (newValue) => {
  //       const particleSize = parseFloat(newValue)
  //       particleSystem.minimumImageSize.x = particleSize
  //       particleSystem.minimumImageSize.y = particleSize
  //       particleSystem.maximumImageSize.x = particleSize
  //       particleSystem.maximumImageSize.y = particleSize
  //     }
  //   )
  //
  //   knockout.getObservable(viewModel, 'minimumParticleLife').subscribe(
  //     (newValue) => { particleSystem.minimumParticleLife = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'maximumParticleLife').subscribe(
  //     (newValue) => { particleSystem.maximumParticleLife = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'minimumSpeed').subscribe(
  //     (newValue) => { particleSystem.minimumSpeed = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'maximumSpeed').subscribe(
  //     (newValue) => { particleSystem.maximumSpeed = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'startScale').subscribe(
  //     (newValue) => { particleSystem.startScale = parseFloat(newValue) }
  //   )
  //
  //   knockout.getObservable(viewModel, 'endScale').subscribe(
  //     (newValue) => { particleSystem.endScale = parseFloat(newValue) }
  //   )
  // }

  // _createFirework(offset, color, bursts) {
  //   const position = Cartesian3.add(this._emitterInitialLocation, offset, new Cartesian3())
  //   const emitterModelMatrix = Matrix4.fromTranslation(position, this._emitterModelMatrixScratch)
  //   const particleToWorld = Matrix4.multiply(this._modelMatrix, emitterModelMatrix, new Matrix4())
  //   const worldToParticle = Matrix4.inverseTransformation(particleToWorld, particleToWorld)
  //
  //   const size = CesiumMath.randomBetween(this._minimumExplosionSize, this._maximumExplosionSize)
  //   const particlePositionScratch = new Cartesian3()
  //   const force = (particle) => {
  //     const position = Matrix4.multiplyByPoint(worldToParticle, particle.position, particlePositionScratch)
  //     if (Cartesian3.magnitudeSquared(position) >= size * size) {
  //       Cartesian3.clone(Cartesian3.ZERO, particle.velocity)
  //     }
  //   }
  //
  //   const normalSize = (size - this._minimumExplosionSize) / (this._maximumExplosionSize - this._minimumExplosionSize)
  //   const minLife = 0.3
  //   const maxLife = 0.4
  //   const life = normalSize * (maxLife - minLife) + minLife
  //
  //   this.viewer.scene.primitives.add(new ParticleSystem({
  //     image: '/image/particle/flaretrail6.png',
  //     startColor: color,
  //     endColor: color.withAlpha(0.4),
  //     life: life,
  //     particleLife: 2.5,
  //     speed: 100.0,
  //     imageSize: new Cartesian2(this._particlePixelSize, this._particlePixelSize),
  //     rate: 0,
  //     emitter: new SphereEmitter(0.1),
  //     bursts: bursts,
  //     lifetime: this._lifetime,
  //     forces: [force],
  //     modelMatrix: this._modelMatrix,
  //     emitterModelMatrix: emitterModelMatrix,
  //     sizeInMeters: true
  //     // performance: false
  //   }))
  // }

  _computeModelMatrix(entity, time) {
    return entity.computeModelMatrix(time, new Matrix4())
  }

  // 改变粒子系统的位置
  _computeEmitterModelMatrix() {
    this._hpr = HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, this._hpr)
    this._trs.translation = Cartesian3.fromElements(0, 0, 86, this._translation)
    this._trs.rotation = Quaternion.fromHeadingPitchRoll(this._hpr, this._rotation)
    return Matrix4.fromTranslationRotationScale(this._trs, this._emitterModelMatrix)
  }

  _flyTo(primitive) {
    const boundingSphere = primitive._boundingSphere
    // 将 boundingSphere 的中心位置转换为经纬度坐标
    const centerCartographic = Cartographic.fromCartesian(boundingSphere.center)
    console.log('primitive =', primitive, boundingSphere.center, centerCartographic)
    const centerx = centerCartographic.longitude
    const centery = centerCartographic.latitude
    // 根据 boundingSphere 的半径计算覆盖范围
    const radius = boundingSphere.radius
    const dx = radius / Ellipsoid.WGS84.maximumRadius
    const dy = radius / Ellipsoid.WGS84.minimumRadius
    // 计算矩形范围
    const rectangle = new Rectangle(
      centerx - dx,
      centery - dy,
      centerx + dx,
      centery + dy
    )
    // 使用 Camera.flyTo 方法将相机飞到目标位置
    this.viewer.camera.flyTo({
      destination: rectangle
      // offset: {
      //   heading: CesiumMath.toRadians(0.0),
      //   pitch: CesiumMath.toRadians(0),
      //   roll: 0.0
      // }
    })
  }

  get viewer() {
    return this._viewer
  }

  get viewModel() {
    return this._viewModel
  }

  get particleSystem() {
    return this._particleSystem
  }

  get isActived() {
    return this._isActived
  }

  get position() {
    return this._position
  }

  get entity() {
    return this._entity
  }
}
