/**
 * @Author : Caven Chen
 */

import { Cesium } from '../namespace'
import { Util } from '../utils'

import distance from './distance'
import heading from './heading'

const { Math: CesiumMath } = Cesium

const Math = {}

Util.merge(Math, CesiumMath, {
  distance,
  heading,
})

export {
  distance,
  heading,
  Math,
}
