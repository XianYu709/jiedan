/**
 * 过程控制包<br>
 * stMsgHeader <br>
 * snSimTime    仿真时间<br>
 * bjtime       北京时间<br>
 * nProcState   0-初始化,1-开始运行，2-暂停，3-继续运行，4-结束<br>
 * nSimFlag     仿真标识，如果接收到的数据和上次的不同，就要刷新当前显示的数据，比如开始另一套数据，就要重新显示位置<br>
 * spare[23]    保留字段
 */
export default class ProcCtrlPacketHandler {
  static _lastNSimFlag

  static handler(udpHelper, data) {
    const { nProcState, nSimFlag } = data
    if ([1, 3].includes(nProcState)) {
      udpHelper.viewer.clock.shouldAnimate = true
    } else if ([0, 2, 4].includes(nProcState)) {
      udpHelper.viewer.clock.shouldAnimate = false
    }
    if (ProcCtrlPacketHandler._lastNSimFlag !== nSimFlag) {
      // TODO 清空数据
      ProcCtrlPacketHandler._lastNSimFlag = nSimFlag
    }
  }
}
