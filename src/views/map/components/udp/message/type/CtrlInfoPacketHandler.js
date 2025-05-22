/**
 * 控制信息包
 * TDSMsgHead    stMsgHeader
 * UINT32        nSimTime     仿真时间
 * UINT32        nId          要控制的id
 * UINT8         nAction      0-默认，1删除、2隐藏、3显示
 * UINT8         nType        要控制的类型：0实体、1连接线、2球形波束、3圆锥型波束、4四棱锥型波束、5球抛扇面型波束、6全向天线图、7圆柱型波束、8纺锤体波束、9自定义标签、10特效、11航迹
 * char          spare[30]
 */
export default class CtrlInfoPacketHandler {
  static handler(udpServer, data) {
    const { nId, nAction, nType } = data
    const obj = udpServer.nIdMap[nId]
    if (!obj) {
      return false
    }
    // TODO
    if (nAction === 1) {
      if ([0, 4, 5, 7, 8].includes(nType)) {
        udpServer.viewer.scene.primitives.remove(obj)
      } else if ([2, 3].includes(nType)) {
        // 删除波束
        udpServer.dataSource.entities.remove(obj)
        // 删除波束外壳
        const id2 = `${nId}-${nType === 2 ? 'sphere' : 'cone'}`
        udpServer.viewer.scene.primitives.remove(udpServer.nIdMap[id2])
      }
    } else if (nAction === 2) {
      if ([0, 2, 3, 4, 5, 7, 8].includes(nType)) {
        obj.show = false
      }
    } else if (nAction === 3) {
      if ([0, 2, 3, 4, 5, 7, 8].includes(nType)) {
        obj.show = true
      }
    }
  }
}
