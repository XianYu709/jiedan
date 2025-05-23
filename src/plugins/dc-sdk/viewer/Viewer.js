/**
 * @Author: Caven
 * @Date: 2019-12-27 17:13:24
 */

import { Cesium } from '../namespace'
import {
  ViewerEvent,
  SceneEvent,
} from '../event'
import Parse from '../parse/Parse'
import { Transform } from '../transform'

class Viewer extends Cesium.Viewer {
  constructor(container, options = {}) {
    super(container, options)
    this._viewerEvent = new ViewerEvent() // Register viewer events
    this._sceneEvent = new SceneEvent(this) // Register scene events
  }

  get viewerEvent() {
    return this._viewerEvent
  }

  get sceneEvent() {
    return this._sceneEvent
  }

  /**
   * Camera fly to a position
   * @param position
   * @param completeCallback
   * @param duration
   * @returns {Viewer}
   */
  flyToPosition(position, completeCallback, duration) {
    position = Parse.parsePosition(position)
    this.camera.flyTo({
      destination: Transform.transformWGS84ToCartesian(position),
      orientation: {
        heading: Cesium.Math.toRadians(position.heading),
        pitch: Cesium.Math.toRadians(position.pitch),
        roll: Cesium.Math.toRadians(position.roll),
      },
      complete: completeCallback,
      duration: duration,
    })
    return this
  }

  /**
   * Camera zoom to a position
   * @param position
   * @param completeCallback
   * @returns {Viewer}
   */
  zoomToPosition(position, completeCallback) {
    this.flyToPosition(position, completeCallback, 0)
    return this
  }

  /**
   *
   * @param type
   * @param callback
   * @param context
   * @returns {Viewer}
   */
  on(type, callback, context) {
    this._viewerEvent.on(type, callback, context || this)
    this._sceneEvent.on(type, callback, context || this)
    return this
  }

  /**
   *
   * @param type
   * @param callback
   * @param context
   * @returns {Viewer}
   */
  once(type, callback, context) {
    this._viewerEvent.once(type, callback, context || this)
    return this
  }

  /**
   *
   * @param type
   * @param callback
   * @param context
   * @returns {Viewer}
   */
  off(type, callback, context) {
    this._viewerEvent.off(type, callback, context || this)
    this._sceneEvent.off(type, callback, context || this)
    return this
  }
}

export default Viewer
