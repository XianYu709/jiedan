import { isEmpty } from 'lodash'

const {
  ParticleSystem,
  Color,
  Cartesian2,
  Cartesian3,
  Matrix4,
  CircleEmitter,
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
export default class BurstHandler {
  constructor(viewer) {
    this._viewer = viewer

    this._viewModel = {
      emissionRate: 5, // 数量
      gravity: 0.0, // 设置重力参数
      minimumParticleLife: 1,
      maximumParticleLife: 6,
      minimumSpeed: 1.0, // 粒子发射的最小速度
      maximumSpeed: 4.0, // 粒子发射的最大速度
      startScale: 0.0,
      endScale: 10.0,
      particleSize: 25.0
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
    this._addEvent()
    this.viewer.clock.shouldAnimate = true
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
      image: '/image/particle/burst2.png',
      startColor: Color.RED.withAlpha(0.7),
      endColor: Color.YELLOW.withAlpha(0.3),
      startScale: viewModel.startScale,
      endScale: viewModel.endScale,
      minimumParticleLife: viewModel.minimumParticleLife,
      maximumParticleLife: viewModel.maximumParticleLife,
      // 粒子质量的最小界限
      minimumSpeed: viewModel.minimumSpeed,
      // 粒子质量的最大界限
      maximumSpeed: viewModel.maximumSpeed,
      imageSize: new Cartesian2(viewModel.particleSize, viewModel.particleSize),
      // 每秒发射的粒子数
      emissionRate: viewModel.emissionRate,
      // 粒子系统发射粒子的时间（秒）
      lifetime: 16.0,
      // 循环是否开启
      loop: true,
      // BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
      emitter: new CircleEmitter(5.0),
      // emitterModelMatrix: computeEmitterModelMatrix(),
      // updateCallback: applyGravity,
      // 设置粒子的大小是否以米或像素为单位
      sizeInMeters: true,
      // 回调函数，实现各种喷泉、烟雾效果
      // updateCallback: (p, dt) => this._applyGravity(p, dt)
    })

    viewer.scene.preUpdate.addEventListener((scene, time) => {
      particleSystem.modelMatrix = this._computeModelMatrix(entity, time)
      // Account for any changes to the emitter model matrix.
      particleSystem.emitterModelMatrix = this._computeEmitterModelMatrix()
      // 将发射器旋转
      if (this.viewModel.spin) {
        this.viewModel.heading += 1.0
        this.viewModel.pitch += 1.0
        this.viewModel.roll += 1.0
      }
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
        const particleSystem = this._createParticleSystem(entity)
        console.log('particleSystem =', particleSystem)
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
    this._trs.translation = Cartesian3.fromElements(-4.0, 0, 1.4, this._translation)
    this._trs.rotation = Quaternion.fromHeadingPitchRoll(this._hpr, this._rotation)
    return Matrix4.fromTranslationRotationScale(this._trs, this._emitterModelMatrix)
  }

  _applyGravity(p, dt) {
    const gravityScratch = new Cartesian3()
    const position = p.position
    Cartesian3.normalize(position, gravityScratch)
    Cartesian3.fromElements(
      20 * dt,
      gravityScratch.y * dt,
      -30 * dt,
      gravityScratch
    )
    p.velocity = Cartesian3.add(p.velocity, gravityScratch, p.velocity)
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

  get isActived() {
    return this._isActived
  }
}
