import dgram from 'dgram'
import WebSocket from 'ws'
import { Buffer } from 'buffer'

// 创建 UDP 服务器和 WebSocket 服务器
const udpServer = dgram.createSocket('udp4')
const wsServer = new WebSocket.Server({ port: 8886 })

// 存储所有连接的 WebSocket 客户端
const clients = new Set()

// 消息类型映射
const MESSAGE_TYPES = {
  30001: 'InitPacket',
  30002: 'ProcCtrlPacket',
  30003: 'HeartBeatPacket',
  30004: 'SimTimePacket',
  30005: 'EventInfoPacket',
  30006: 'CtrlInfoPacket',
  30010: 'EntsPacket',
  30012: 'ConnLinesPacket',
  30013: 'SphereWavesPacket',
  30014: 'ConeWavesPacket',
  30015: 'EffectPacket'
}

// 解析 UDP 消息
function parseUDPMessage(msg) {
  const view = new DataView(msg.buffer)

  // 读取消息头 (所有消息类型共有的头部)
  const header = {
    nPrefix: view.getInt32(0, true),
    nMsgID: view.getInt32(4, true),
    nMsgLen: view.getInt32(8, true),
    nDataTotalPack: view.getInt32(12, true),
    nCurPackNo: view.getInt32(16, true),
    nSpare: Array.from(
      new Uint8Array(
        view.buffer.slice(20, 48)
      )
    )
  }

  const messageType = MESSAGE_TYPES[header.nMsgID] || 'Unknown'

  // // 专门处理30010消息
  // if (header.nMsgID === 30010) {
  // const packet = parseEntsPacket(view, header);
  // printEntsPacket(packet);  // 打印EntsPacket内容
  // return packet;
  // }

  // 根据消息类型解析不同结构
  switch (header.nMsgID) {
    case 30001: // 初始化包
      return parseInitPacket(view, header)
    case 30002: // 过程控制包
      return parseProcCtrlPacket(view, header)
    case 30003: // 心跳包
      return parseHeartBeatPacket(view, header)
    case 30004: // 仿真时间包
      return parseSimTimePacket(view, header)
    case 30005: // 事件信息包
      return parseEventInfoPacket(view, header)
    case 30006: // 控制信息包
      return parseCtrlInfoPacket(view, header)
    case 30010: // 实体包
      return parseentspacket(view, header)
    case 30012: // 连接线包
      return parseConnLinesPacket(view, header)
    case 30013: // 球形波束包
      return parseSphereWavesPacket(view, header)
    case 30014: // 圆锥波束包
      return parseConeWavesPacket(view, header)
    case 30015: // 特效包
      return parseEffectPacket(view, header)
    default:
      return {
        type: messageType,
        rawData: Array.from(msg).join(',')
      }
  }
}

// 解析初始化包 (30001)
function parseInitPacket(view, header) {
  const packet = {
    type: 'InitPacket',
    header: header,
    stBJDateTime: {
      nYear: view.getUint16(48, true),
      nMonth: view.getUint8(50),
      nDay: view.getUint8(51),
      nHour: view.getUint8(52),
      nMin: view.getUint8(53),
      nSec: view.getUint8(54)
    },
    eWindSpeed: view.getUint8(55),
    eWindDir: view.getUint8(56),
    eWeather: view.getUint8(57),
    eSeaState: view.getUint8(58),
    nEntNum: view.getUint32(62, true),
    cameraPos: {
      Pos: {
        nPosType: view.getUint8(63),
        dLon: readDouble(view, 71),
        dLat: readDouble(view, 79),
        fAlt: view.getFloat32(83, true)
      },
      Rot: {
        RotateType: view.getUint8(84),
        fAz: view.getFloat32(88, true),
        fEl: view.getFloat32(92, true),
        fRoll: view.getFloat32(96, true)
      },
      Scale: {
        bValid: view.getInt8(97),
        Scale_X: view.getFloat32(101, true),
        Scale_Y: view.getFloat32(105, true),
        Scale_Z: view.getFloat32(109, true)
      }
    },
    originPos: {
      nPosType: view.getUint8(110), // offset + 107 (1 byte)
      dLon: readDouble(view, 118), // offset + 108 (8 bytes)
      dLat: readDouble(view, 126), // offset + 116 (8 bytes)
      fAlt: view.getFloat32(130, true) // offset + 124 (4 bytes)
    }
  }
  return packet
}

// 解析过程控制包 (30002)
function parseProcCtrlPacket(view, header) {
  const packet = {
    type: 'ProcCtrlPacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    bjtime: {
      nYear: view.getUint16(52, true),
      nMonth: view.getUint8(54),
      nDay: view.getUint8(55),
      nHour: view.getUint8(56),
      nMin: view.getUint8(57),
      nSec: view.getUint8(58)
    },
    nProcState: view.getUint8(59),
    nSimFlag: readDouble(view, 60),
    spare: Array.from(
      new Uint8Array(
        view.buffer.slice(68, 91)
      )
    )
  }
  return packet
}

// 解析心跳包 (30003)
function parseHeartBeatPacket(view, header) {
  const packet = {
    type: 'HeartBeatPacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    bjtime: {
      nYear: view.getUint16(49, true),
      nMonth: view.getUint8(51),
      nDay: view.getUint8(52),
      nHour: view.getUint8(53),
      nMin: view.getUint8(54),
      nSec: view.getUint8(55)
    },
    isSimConnected: view.getUint8(56),
    spare: Array.from(
      new Uint8Array(
        view.buffer.slice(57, 80)
      )
    )
  }
  return packet
}

// 解析仿真时间包 (30004)
function parseSimTimePacket(view, header) {
  const packet = {
    type: 'SimTimePacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    spare: Array.from(
      new Uint8Array(
        view.buffer.slice(52, 84)
      )
    )
  }
  return packet
}

// 解析事件信息包 (30005)
function parseEventInfoPacket(view, header) {
  const packet = {
    type: 'EventInfoPacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    bjtime: {
      nYear: view.getUint16(52, true),
      nMonth: view.getUint8(54),
      nDay: view.getUint8(55),
      nHour: view.getUint8(56),
      nMin: view.getUint8(57),
      nSec: view.getUint8(58)
    },
    nType: view.getUint8(59),
    content: Array.from(
      new Uint8Array(
        view.buffer.slice(60, 1084)
      )
    )
  }
  return packet
}

// 解析控制信息包 (30006)
function parseCtrlInfoPacket(view, header) {
  const packet = {
    type: 'CtrlInfoPacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    nId: view.getUint32(52, true),
    nAction: view.getUint8(56),
    nType: view.getUint8(57),
    spare: Array.from(
      new Uint8Array(
        view.buffer.slice(58, 88)
      )
    )
  }
  return packet
}

// 打印EntsPacket内容的函数
function printEntsPacket(packet) {
  console.log('======= 30010 EntsPacket 数据 =======')
  console.log(`Header:
        MsgID: ${packet.header.nMsgID}
        MsgLen: ${packet.header.nMsgLen}
        TotalPack: ${packet.header.nDataTotalPack}
        CurPackNo: ${packet.header.nCurPackNo}`)

  console.log(`实体数量: ${packet.nEntNum}`)

  // 打印前5个实体信息（避免输出太多）
  const printCount = Math.min(5, packet.ents.length)
  console.log(`==== 前${printCount}个实体 ====`)

  packet.ents.slice(0, printCount).forEach((ent, index) => {
    console.log(`SimTime ${ent.nSimTime}:`)
    console.log(`实体 ${index + 1}:`)
    console.log(`  ID: ${ent.nID}`)
    console.log(`  名称: ${ent.name}`)
    console.log(`  类型: ${ent.typeName}`)
    console.log(`  阵营: ${ent.eCamp}`)
    console.log(`  国家: ${ent.country}`)
    console.log(`  位置: (${ent.transform.Pos.dLon}, ${ent.transform.Pos.dLat}, ${ent.transform.Pos.fAlt})`)
    console.log(`  旋转: (Az: ${ent.transform.Rot.fAz}, El: ${ent.transform.Rot.fEl})`)
    console.log(`  状态: ${ent.isDie ? '死亡' : '存活'}, 损伤: ${ent.DamagePercent}%`)
    console.log('--------------------------------')
  })

  if (packet.ents.length > printCount) {
    console.log(`...还有${packet.ents.length - printCount}个实体未显示`)
  }
  console.log('===================================')
}

function parseEntsPacket(view, header) {
  const packet = {
    type: 'EntsPacket',
    header: header,
    nEntNum: view.getInt32(48, true),
    ents: []
  }

  const entSize = 183
  const offset = 52

  for (let i = 0; i < packet.nEntNum; i++) {
    const entOffset = offset + i * entSize
    packet.ents.push({
      nSimTime: view.getInt32(entOffset, true),
      nID: view.getUint32(entOffset + 4, true),
      name: readFixedString(view, entOffset + 8, 48),
      typeName: readFixedString(view, entOffset + 56, 30),
      eSpaceType: view.getUint8(entOffset + 86),
      eCamp: view.getUint8(entOffset + 87),
      country: readFixedString(view, entOffset + 88, 30),
      eUnitType: view.getUint32(entOffset + 118, true),
      DamagePercent: view.getFloat32(entOffset + 122, true),
      isDie: view.getUint8(entOffset + 126),
      nStatus: view.getUint8(entOffset + 127),
      transform: {
        Pos: {
          nPosType: view.getUint8(entOffset + 128),
          dLon: readDouble(view, entOffset + 129),
          dLat: readDouble(view, entOffset + 137),
          fAlt: view.getFloat32(entOffset + 145, true)
        },
        Rot: {
          RotateType: view.getUint8(entOffset + 149),
          fAz: view.getFloat32(entOffset + 150, true),
          fEl: view.getFloat32(entOffset + 154, true),
          fRoll: view.getFloat32(entOffset + 158, true)
        },
        Scale: {
          bValid: view.getInt8(entOffset + 162),
          Scale_X: view.getFloat32(entOffset + 163, true),
          Scale_Y: view.getFloat32(entOffset + 167, true),
          Scale_Z: view.getFloat32(entOffset + 171, true)
        }
      },
      spare: Array.from(
        new Uint8Array(
          view.buffer.slice(entOffset + 175, entOffset + 183)
        )
      )
    }) // 注意这个闭合括号
  }
  return packet
}

// 解析连接线包 (30012)
function parseConnLinesPacket(view, header) {
  const packet = {
    type: 'ConnLinesPacket',
    header: header,
    nConnLineNum: view.getUint32(48, true),
    lines: []
  }

  const lineSize = 31 // ConnLineInfo 结构体大小
  const offset = 52

  for (let i = 0; i < packet.nConnLineNum; i++) {
    const lineOffset = offset + i * lineSize
    packet.lines.push({
      nEntId: view.getUint32(lineOffset, true),
      nTgtId: view.getUint32(lineOffset + 4, true),
      nId: view.getUint32(lineOffset + 8, true),
      nType: view.getUint8(lineOffset + 12),
      nStyle: view.getUint8(lineOffset + 13),
      color: {
        R: view.getUint8(lineOffset + 14),
        G: view.getUint8(lineOffset + 15),
        B: view.getUint8(lineOffset + 16),
        A: view.getUint8(lineOffset + 17)
      },
      fLineW: view.getFloat32(lineOffset + 18, true),
      nConnType: view.getUint8(lineOffset + 22),
      nOffsetDistance: view.getUint32(lineOffset + 23, true),
      nShowTime: view.getUint32(lineOffset + 27, true)
    })
  }

  return packet
}

function parseSphereWavesPacket(view, header) {
  const packet = {
    type: 'SphereWavesPacket',
    header: header,
    SphereWaveNum: view.getUint32(48, true), // offset 44 (4 bytes)
    sphereWave: []
  }

  const waveSize = 83 // 修正为实际结构体大小
  const offset = 52 // 头部后起始位置 (44 + 4)

  for (let i = 0; i < packet.SphereWaveNum; i++) {
    const waveOffset = offset + i * waveSize

    // 边界检查
    if (waveOffset + waveSize > view.buffer.byteLength) {
      console.error(`Wave ${i} data out of bounds`)
      break
    }

    packet.sphereWave.push({
      nEntityID: view.getUint32(waveOffset, true), // offset + 0 (4 bytes)
      nId: view.getUint32(waveOffset + 4, true), // offset + 4 (4 bytes)
      Transform: {
        Pos: {
          nPosType: view.getUint8(waveOffset + 8), // offset + 8 (1 byte)
          dLon: readDouble(view, waveOffset + 9), // offset + 9 (8 bytes)
          dLat: readDouble(view, waveOffset + 17), // offset + 17 (8 bytes)
          fAlt: view.getFloat32(waveOffset + 25, true) // offset + 25 (4 bytes)
        },
        Rot: {
          RotateType: view.getUint8(waveOffset + 29), // offset + 29 (1 byte)
          fAz: view.getFloat32(waveOffset + 30, true), // offset + 30 (4 bytes)
          fEl: view.getFloat32(waveOffset + 34, true), // offset + 34 (4 bytes)
          fRoll: view.getFloat32(waveOffset + 38, true)// offset + 38 (4 bytes)
        },
        Scale: {
          bValid: view.getInt8(waveOffset + 42), // offset + 42 (1 byte)
          Scale_X: view.getFloat32(waveOffset + 43, true), // offset + 43 (4 bytes)
          Scale_Y: view.getFloat32(waveOffset + 47, true), // offset + 47 (4 bytes)
          Scale_Z: view.getFloat32(waveOffset + 51, true) // offset + 51 (4 bytes)
        }
      },
      Color: {
        R: view.getUint8(waveOffset + 55), // offset + 55 (1 byte)
        G: view.getUint8(waveOffset + 56), // offset + 56 (1 byte)
        B: view.getUint8(waveOffset + 57), // offset + 57 (1 byte)
        A: view.getUint8(waveOffset + 58) // offset + 58 (1 byte)
      },
      nRadius: view.getUint32(waveOffset + 59, true), // offset + 59 (4 bytes)
      FlickerTime: view.getUint32(waveOffset + 63, true), // offset + 63 (4 bytes)
      ScanFrequency: view.getFloat32(waveOffset + 67, true), // offset + 67 (4 bytes)
      nStyleID: view.getUint8(waveOffset + 71), // offset + 71 (1 byte)
      ScanType: view.getUint8(waveOffset + 72), // offset + 72 (1 byte)
      WaveType: view.getUint8(waveOffset + 73), // offset + 73 (1 byte)
      WavePurpose: view.getUint8(waveOffset + 74), // offset + 74 (1 byte)

      spare: Array.from(
        new Uint8Array(
          view.buffer.slice(waveOffset + 75, waveOffset + 83)
        )
      )
    })
  }
  return packet
}

function parseConeWavesPacket(view, header) {
  const packet = {
    type: 'ConeWavesPacket',
    header: header,
    ConeWaveCount: view.getUint32(48, true), // offset 44 (4 bytes)
    coneWave: []
  }

  const waveSize = 148 // 确认与C++的sizeof(ConeWaveInfo)一致
  const offset = 52 // 头部后起始位置 (44 + 4)

  for (let i = 0; i < packet.ConeWaveCount; i++) {
    const waveOffset = offset + i * waveSize

    // 边界检查
    if (waveOffset + waveSize > view.buffer.byteLength) {
      console.error(`Wave ${i} data out of bounds`)
      break
    }

    packet.coneWave.push({
      // --- 基础字段 ---
      nEntId: view.getUint32(waveOffset, true), // offset + 0 (4 bytes)
      Transform: {
        Pos: {
          nPosType: view.getUint8(waveOffset + 4), // offset + 4 (1 byte)
          dLon: readDouble(view, waveOffset + 5), // offset + 5 (8 bytes)
          dLat: readDouble(view, waveOffset + 13), // offset + 13 (8 bytes)
          fAlt: view.getFloat32(waveOffset + 21, true) // offset + 21 (4 bytes)
        },
        Rot: {
          RotateType: view.getUint8(waveOffset + 25), // offset + 25 (1 byte)
          fAz: view.getFloat32(waveOffset + 26, true), // offset + 26 (4 bytes)
          fEl: view.getFloat32(waveOffset + 30, true), // offset + 30 (4 bytes)
          fRoll: view.getFloat32(waveOffset + 34, true)// offset + 34 (4 bytes)
        },
        Scale: {
          bValid: view.getInt8(waveOffset + 38), // offset + 38 (1 byte)
          Scale_X: view.getFloat32(waveOffset + 39, true), // offset + 39 (4 bytes)
          Scale_Y: view.getFloat32(waveOffset + 43, true), // offset + 43 (4 bytes)
          Scale_Z: view.getFloat32(waveOffset + 47, true) // offset + 47 (4 bytes)
        }
      },
      nRange: view.getUint32(waveOffset + 51, true), // offset + 51 (4 bytes)
      nScopeId: view.getUint32(waveOffset + 55, true), // offset + 55 (4 bytes)
      fAzMin: view.getFloat32(waveOffset + 59, true), // offset + 59 (4 bytes)
      fAzMax: view.getFloat32(waveOffset + 63, true), // offset + 63 (4 bytes)
      fElMin: view.getFloat32(waveOffset + 67, true), // offset + 67 (4 bytes)
      fElMax: view.getFloat32(waveOffset + 71, true), // offset + 71 (4 bytes)
      scopeColor: {
        R: view.getUint8(waveOffset + 75), // offset + 75 (1 byte)
        G: view.getUint8(waveOffset + 76), // offset + 76 (1 byte)
        B: view.getUint8(waveOffset + 77), // offset + 77 (1 byte)
        A: view.getUint8(waveOffset + 78) // offset + 78 (1 byte)
      },
      nBeamId: view.getUint32(waveOffset + 79, true), // offset + 79 (4 bytes)
      nTgtId: view.getUint32(waveOffset + 83, true), // offset + 83 (4 bytes)
      beamColor: {
        R: view.getUint8(waveOffset + 87), // offset + 87 (1 byte)
        G: view.getUint8(waveOffset + 88), // offset + 88 (1 byte)
        B: view.getUint8(waveOffset + 89), // offset + 89 (1 byte)
        A: view.getUint8(waveOffset + 90) // offset + 90 (1 byte)
      },
      nInnerTaperAngle: view.getUint32(waveOffset + 91, true), // offset + 91 (4 bytes)
      nStyleId: view.getUint32(waveOffset + 95, true), // offset + 95 (4 bytes)
      nFlickerTime: view.getUint32(waveOffset + 99, true), // offset + 99 (4 bytes)
      nScanType: view.getUint8(waveOffset + 103), // offset + 103 (1 byte)
      nWavePurpose: view.getUint8(waveOffset + 104), // offset + 104 (1 byte)
      bBeamInfoValid: view.getUint8(waveOffset + 105), // offset + 105 (1 byte)
      bTgtPosValid: view.getUint8(waveOffset + 106), // offset + 106 (1 byte)
      tgtPos: {
        nPosType: view.getUint8(waveOffset + 107), // offset + 107 (1 byte)
        dLon: readDouble(view, waveOffset + 108), // offset + 108 (8 bytes)
        dLat: readDouble(view, waveOffset + 116), // offset + 116 (8 bytes)
        fAlt: view.getFloat32(waveOffset + 124, true) // offset + 124 (4 bytes)
      },
      fBeamAz: view.getFloat32(waveOffset + 128, true), // offset + 128 (4 bytes)
      fBeamEl: view.getFloat32(waveOffset + 132, true), // offset + 132 (4 bytes)

      spare: Array.from(
        new Uint8Array(
          view.buffer.slice(waveOffset + 136, waveOffset + 148)
        )
      )
    })
  }
  return packet
}

// 解析特效包 (30015)
function parseEffectPacket(view, header) {
  const packet = {
    type: 'EffectPacket',
    header: header,
    nSimTime: view.getUint32(48, true),
    nEntId: view.getUint32(52, true),
    nId: view.getUint32(56, true),
    nEffectTgt: view.getUint8(60),
    nEffectType: view.getUint8(61),
    eWindSpeed: view.getUint8(62),
    eWindDir: view.getUint8(63),
    eSeaState: view.getUint8(64),
    nDuration: view.getUint32(65, true),
    nShapeType: view.getUint8(69),
    nPosNum: view.getUint8(70),
    stPos: []
  }
  // 解析位置数组 (PositionInfo) - 从71开始
  const posOffset = 71
  for (let i = 0; i < packet.nPosNum && i < 10; i++) {
    packet.stPos.push(parsePositionInfo(view, posOffset + i * 21)) // 每个PositionInfo占21字节
  }
  // 计算nDis和Transform的偏移量
  const afterPosOffset = posOffset + packet.nPosNum * 21
  packet.nDis = view.getUint32(afterPosOffset, true) // nDis紧跟在stPos之后
  packet.Transform = parseTransformInfo(view, afterPosOffset + 4) // Transform在nDis之后
  packet.spare = Array.from(new Uint8Array(view.buffer.slice(afterPosOffset + 4 + 47, afterPosOffset + 4 + 47 + 16))) // spare在Transform之后

  return packet
}

// ========== 辅助函数 ==========

// 解析位置信息
function parsePositionInfo(view, offset) {
  return {
    nPosType: view.getUint8(offset),
    dLon: readDouble(view, offset + 1),
    dLat: readDouble(view, offset + 9),
    fAlt: view.getFloat32(offset + 17, true)
  }
}

// 解析变换信息
function parseTransformInfo(view, offset) {
  return {
    Pos: parsePositionInfo(view, offset),
    Rot: {
      RotateType: view.getUint8(offset + 21),
      fAz: view.getFloat32(offset + 22, true),
      fEl: view.getFloat32(offset + 26, true),
      fRoll: view.getFloat32(offset + 30, true)
    },
    Scale: {
      bValid: view.getInt8(offset + 34),
      Scale_X: view.getFloat32(offset + 35, true),
      Scale_Y: view.getFloat32(offset + 39, true),
      Scale_Z: view.getFloat32(offset + 43, true)
    }
  }
}

// 读取固定长度字符串
function readFixedString(view, offset, length) {
  let str = ''
  for (let i = 0; i < length; i++) {
    const char = view.getUint8(offset + i)
    if (char === 0) break
    str += String.fromCharCode(char)
  }
  return str
}

// 读取 double (使用 Buffer)
function readDouble(view, offset) {
  const buffer = Buffer.from(view.buffer.slice(offset, offset + 8))
  return buffer.readDoubleLE(0)
}

// 读取 uint64 (转换为字符串避免精度问题)
function readUint64(view, offset) {
  const low = view.getUint32(offset, true)
  const high = view.getUint32(offset + 4, true)
  return (BigInt(high) << 32n) + BigInt(low)
}

// WebSocket 连接处理
wsServer.on('connection', (ws) => {
  clients.add(ws)
  console.log('New WebSocket client connected')

  ws.on('close', () => {
    clients.delete(ws)
    console.log('WebSocket client disconnected')
  })
})

let lastSendTime = 0
// UDP 消息处理
udpServer.on('message', (msg, rinfo) => {
  console.log(`[UDP] Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`)
  try {
    const parsed = parseUDPMessage(msg)
    const now = Date.now()

    // 检查是否达到500ms间隔
    if (now - lastSendTime >= 500) {
      const jsonData = JSON.stringify(parsed)

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(jsonData)
          console.log(`[WS] Sent ${parsed.type} at ${now}`)
        }
      })

      lastSendTime = now
    }
  } catch (err) {
    console.error('Parse error:', err)
  }
})

// 启动服务器
udpServer.bind(20020, '0.0.0.0', () => {
  console.log('Server ready to receive unicast messages')
})

// console.log('WebSocket server started on port 8886');
