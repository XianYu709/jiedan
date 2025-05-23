/**
 * @Author : Caven Chen
 */

import { Cesium } from '../namespace'

const BaseEventType = {
  ADD: 'add',
  REMOVE: 'remove',
}

const ViewerEventType = {
  ADD_LAYER: 'addLayer',
  REMOVE_LAYER: 'removeLayer',
  ADD_EFFECT: 'addEffect',
  REMOVE_EFFECT: 'removeEffect',
  LEFT_DOWN: Cesium.ScreenSpaceEventType.LEFT_DOWN,
  LEFT_UP: Cesium.ScreenSpaceEventType.LEFT_UP,
  CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  RIGHT_DOWN: Cesium.ScreenSpaceEventType.RIGHT_DOWN,
  RIGHT_UP: Cesium.ScreenSpaceEventType.RIGHT_UP,
  RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
  DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
  WHEEL: Cesium.ScreenSpaceEventType.WHEEL,
}

const SceneEventType = {
  CAMERA_MOVE_END: 'cameraMoveEnd',
  CAMERA_CHANGED: 'cameraChanged',
  PRE_UPDATE: 'preUpdate',
  POST_UPDATE: 'postUpdate',
  PRE_RENDER: 'preRender',
  POST_RENDER: 'postRender',
  MORPH_COMPLETE: 'morphComplete',
  CLOCK_TICK: 'clockTick',
  RENDER_ERROR: 'renderError',
}

const TrackEventType = {
  ...BaseEventType,
  POST_RENDER: 'postRender',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  RESET_TIME_LINE: 'restTimeLine',
}

export {
  SceneEventType,
  TrackEventType,
  ViewerEventType
}
