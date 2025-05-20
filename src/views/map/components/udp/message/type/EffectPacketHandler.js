/**
 * 特效包
 * TDSMsgHead       stMsgHeader
 * UINT32	          nSimTime	  仿真时间
 * UINT32           nEntId      挂载该特效的实体ID（当特效目标为0时可不提供该值）
 * UINT32           nId         特效ID
 * UINT8            nEffectTgt  特效目标：0加载在场景中、1加载在实体上(nEntId需不为0)
 * // 特性类型：
 * // 0-无特效、1-火焰、2-冒烟、3-爆炸、4-爆炸弹坑、5-风、6-雨、7-雪、8-云层、
 * // 9-阴影、10-光照、11-海洋、12-星空、13-海况、14-风雨、15-风雪、16-风雨雪
 * UINT8            nEffectType
 * E_WindSpeed      eWindSpeed  当nType=5时，有效
 *   NoWind = 0,         //无风
 *   MildWind = 1,       //软风
 *   GentlyWind = 2,     //轻风
 *   TinyWind = 3,       //微风
 *   GentleWind = 4,     //和风
 *   PowerfulWind = 5,   //劲风
 *   ForceWind = 6,      //强风
 *   StrongWind = 7,     //疾风
 *   MaxWind = 8,        //大风
 *   ViolentWind = 9,    //烈风
 *   FierceWind = 10,    //狂风
 *   SquallWind = 11,    //暴风
 *   TyphoonWind = 12    //飓风
 * E_WindDir        eWindDir    当nType=5时，有效
 *   Northward = 0,  //北
 *   NorthwardEastNorthward = 1,//北东北
 *   EastNorthward = 2,//东北
 *   EastEastNorthward = 3,//东东北
 *   East = 4,//东
 *   EastEastSouth = 5,//东东南
 *   EastSouth = 6,//东南
 *   SouthEastSouth = 7,//南东南
 *   South = 8,//南
 *   SouthWesternSouth = 9,//南西南
 *   WesternSouth = 10,//西南
 *   WesternWesternSouth = 11,//西西南
 *   Western = 12,//西
 *   WesternWesternNorthward = 13,//西西北
 *   WesternNorthward = 14,//西北
 *   NorthwardWesternNorthward = 15//北西北
 * ESeaState        eSeaState   当nType=13时，有效
 *   NoSeaWave = 0,      //无浪
 *   TinySeaWave = 1,    //微浪
 *   MinSeaWave = 2,     //小浪
 *   GentlySeaWave = 3,  //轻浪
 *   MiddleSeaWave = 4,  //中浪
 *   MaxSeaWave = 5,     //大浪
 *   GiantSeaWave = 6,   //巨浪
 *   InsaneSeaWave = 7,  //狂浪
 *   WildSea = 8,        //狂涛
 *   MountainousSea = 9  //怒涛
 * UINT32           nDuration   持续时间，单位：秒
 * // 0-自定义形状（nPosNum和stPos描述的形状）、1-正方形(nDis标识正方形对角线1/2)、
 * // 2-圆形（nDis表示半径）、3-等边三角形（nDis表示三角形中心到各顶点的距离）
 * UINT8	          nShapeType
 * UINT8	          nPosNum     >=3时，才有意义
 * PositionInfo    	stPos[10]   自定义多边形，最多十边形
 * UINT32	          nDis        单位：米
 * // 变换信息（当特效目标为0时，变换中的位置信息应提供经纬度高度，
 * // 当特效目标为1时，变换中的位置应提供X\Y\Z相对于要挂载的实体锚点偏移数据）
 * TransformInfo    Transform
 * UINT8	          spare[16]
 */
export default class EffectPacketHandler {
  static handler(udpServer, data) {
  }
}
