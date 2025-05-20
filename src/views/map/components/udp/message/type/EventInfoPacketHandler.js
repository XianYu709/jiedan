/**
 * 事件信息包
 * TDSMsgHead  stMsgHeader
 * UINT32      nSimTime       仿真时间
 * BJDateTime  bjtime         北京时间
 * UINT8       nType          事件类型：0普通事件、1攻击事件、2死亡事件
 * char        content[1024]  事件内容
 */
export default class EventInfoPacketHandler {
  static handler(udpServer, data) {
  }
}
