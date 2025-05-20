import {
  getTransform,
  getPosition,
} from '../util'

/**
 * 初始化包
 * TDSMsgHead      stMsgHeader;
 * BJDateTime      stBJDateTime;
 * E_WindSpeed     eWindSpeed;
 * E_WindDir       eWindDir;
 * EWeather        eWeather;
 * ESeaState       eSeaState;
 * UINT32          nEntNum;    //实体数量
 * TransformInfo   cameraPos;  //初始相机位置及朝向
 * PositionInfo    originPos;  //三维态势地理位置原点
 */
export default class InitPacketHandler {
  static handler(udpHelper, data) {
    const { nEntNum, cameraPos = {}, originPos = {}} = data
    const { position: cameraPosition, orientation: cameraOrientation } = getTransform(cameraPos)
    const position = getPosition(originPos)
    udpHelper.viewer.scene.camera.flyTo({
      destination: cameraPosition,
      orientation: cameraOrientation,
      duration: 300
    })
    return { cameraPosition, cameraOrientation, originPosition: position }
  }
}
