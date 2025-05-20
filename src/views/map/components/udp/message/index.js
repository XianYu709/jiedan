import InitPacketHandler from './type/InitPacketHandler'
import ProcCtrlPacketHandler from './type/ProcCtrlPacketHandler'
import HeartBeatPacketHandler from './type/HeartBeatPacketHandler'
import SimTimePacketHandler from './type/SimTimePacketHandler'
import EventInfoPacketHandler from './type/EventInfoPacketHandler'
import CtrlInfoPacketHandler from './type/CtrlInfoPacketHandler'
import EntsPacketHandler from './type/EntsPacketHandler'
import ConnLinesPacketHandler from './type/ConnLinesPacketHandler'
import SphereWavesPacketHandler from './type/SphereWavesPacketHandler'
import ConeWavesPacketHandler from './type/ConeWavesPacketHandler'
import EffectPacketHandler from './type/EffectPacketHandler'

const MESSAGE_HANDLERS = {
  InitPacket: InitPacketHandler,
  ProcCtrlPacket: ProcCtrlPacketHandler,
  HeartBeatPacket: HeartBeatPacketHandler,
  SimTimePacket: SimTimePacketHandler,
  EventInfoPacket: EventInfoPacketHandler,
  CtrlInfoPacket: CtrlInfoPacketHandler,
  EntsPacket: EntsPacketHandler,
  ConnLinesPacket: ConnLinesPacketHandler,
  SphereWavesPacket: SphereWavesPacketHandler,
  ConeWavesPacket: ConeWavesPacketHandler,
  EffectPacket: EffectPacketHandler
}

/**
 * 消息处理
 */
export default class MessageHandler {
  static handler(udpServer, data) {
    console.log(`${data.type} =`, data)
    return MESSAGE_HANDLERS[data.type]?.handler(udpServer, data)
  }
}
