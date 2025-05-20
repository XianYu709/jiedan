/**
 * 心跳包
 * TDSMsgHead  stMsgHeader
 * UINT32      nSimTime         仿真时间
 * BJDateTime  bjtime           北京时间
 * UINT8       isSimConnected   0-未连接，1-连接中
 * char        spare[23]        保留字段
 */
export default class HeartBeatPacketHandler {
  static handler(viewer, udpHelper, data) {
  }
}
