const {
  Matrix4,
  Cartesian3,
  Color
} = window.Cesium
/**
 * 连接线包
 * UINT32     nEntId;        挂载连接线的实体ID
 * UINT32     nTgtId;        目标实体ID
 * UINT32     nId;           线ID
 * UINT8      nType;         线类型：0-直线,1-抛物线
 * UINT8      nStyle;        线样式：0-实线、1-虚线、2-箭头线
 * ColorInfo  color;         线颜色
 * float      fLineW;        线宽
 * UINT8      nConnType;     连接类型：0默认线、1通信线、2识别线、3指挥线、4打击线、5引导线、6任务线、7探测线、8激光干扰线
 * UINT32  nOffsetDistance;  线相对于实体锚点的偏移距离(米)
 * UINT32  nShowTime;        显示时间（秒）
 */
export default class ConnLinesPacketHandler {
  static handler(udpServer, data) {
    const { nId, nEntId, nTgtId, fLineW, color: { R, G, B, A }} = data
    let line = udpServer.getModel(nId)
    const model = udpServer.getModel(nEntId)
    const targetModel = udpServer.getModel(nTgtId)
    if (!line && model && targetModel) {
      const startPosition = Matrix4.getTranslation(model.modelMatrix, new Cartesian3())
      const targetPosition = Matrix4.getTranslation(targetModel.modelMatrix, new Cartesian3())
      line = udpServer.viewer.entities.add({
        polyline: {
          positions: [startPosition, targetPosition],
          width: Number(fLineW) || 2,
          material: new Color(R, G, B, A),
        }
      })
      udpServer[nId] = line
    }
  }
}
