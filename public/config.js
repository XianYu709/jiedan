const iServerUrl = "http://192.168.0.103:8090";
const freexServerUrl = "http://192.168.0.100:8088/freexserver";
const wmtsUrl = `${freexServerUrl}/dataserver/htc/service/wmts`;

// window.plotHost = "http://www.startyoung.top:4091";
// window.plotSymbolLibPath = "/iserver/services/plot-JY/rest/plot/symbolLibs.json";
// window.plotSuffix = "/iserver/services/plot-JY/rest/plot";

window.plotHost = "http://www.supermapol.com";
window.plotSymbolLibPath = "/realspace/services/plot-TY/rest/plot/symbolLibs.json";
window.plotSuffix = '/realspace/services/plot-TY/rest/plot';
 
window.MAP_CONFIG = {
  iServerUrl,
  /**
   * {
   *   id: id，必填，唯一
   *   label: 必填，显示名称
   *   name: 必填，编码，唯一
   *   url: 必填，地址
   *   type: 必填，类型
   *   center: 可选中心点
   *   orientation: 可选，视角
   *   checked: 是否默认选中加载，可选，默认否
   *   flyTo: 加载时是否居中，可选，默认是
   * }
   */
  layers: [
    {
      id: 1,
      label: "场站列表",
      children: [
        {
          id: 10001,
          label: "兴宁机场",
          name: "xingning",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/xingning@jsys/config",
          type: "scp",
          center: [115.75828728, 24.14842144, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10002,
          label: "武夷山机场",
          name: "wuyishan",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/wuyishan@jsys/config",
          type: "scp",
          center: [118.00030433, 27.70191068, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10003,
          label: "连城机场",
          name: "lianchengjichang",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/lianchengjichang@jsys/config",
          type: "scp",
          center: [116.74658475, 25.6772925, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10004,
          label: "惠安机场",
          name: "HAJC_Lambert",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/HAJC_Lambert@jsys/config",
          type: "scp",
          center: [118.80678021, 25.02716309, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10005,
          label: "龙田机场",
          name: "LTJC_Lambert",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/LTJC_Lambert@jsys/config",
          type: "scp",
          center: [119.45996802, 25.57365086, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10006,
          label: "漳州机场",
          name: "ZZJC_Lambert",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/ZZJC_Lambert@jsys/config",
          type: "scp",
          center: [117.65509978, 24.56337518, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 10007,
          label: "清泉岗机场",
          name: "LTJC_Lambert",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/qingquangang@jsys/config",
          type: "scp",
          center: [120.6266214, 24.26311381, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
      ],
    },
    {
      id: 2,
      label: "数据服务",
      children: [
        {
          id: 20001,
          label: "电磁数据",
          name: "dianci",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/电磁数据",
          type: "webp",
          flyTo: true,
        },
        {
          id: 20002,
          label: "温度",
          name: "wendu",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/温度",
          type: "webp",
          flyTo: true,
        },
        {
          id: 20003,
          label: "降水",
          name: "jiangshui",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/降水",
          type: "webp",
          flyTo: true,
        },
        {
          id: 20004,
          label: "可见光",
          name: "kejianguang",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/可见光",
          type: "webp",
          flyTo: true,
        },
        {
          id: 20005,
          label: "文字",
          name: "wenzi",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/文字",
          type: "webp",
          flyTo: true,
        },
        {
          id: 20006,
          label: "航路航线",
          name: "hangluhangxian",
          url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/航路航线",
          type: "webp",
          flyTo: true,
        },
      ],
    },
    {
      id: 3,
      label: "作战目标",
      children: [
        {
          id: 30001,
          label: "虎井屿防御工事",
          name: "hujing",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/HJY_FYGH@jsys/config",
          type: "scp",
          center: [119.512038883137, 23.487510442355, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30002,
          label: "烟墩山_导弹阵地",
          name: "yandunshan",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/YDS_DDZD@jsys/config",
          type: "scp",
          center: [119.58197867, 23.6735837, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30003,
          label: "清泉岗_导弹阵地",
          name: "qingquangang",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/QQG_DDZD@jsys/config",
          type: "scp",
          center: [120.642901306632, 24.25730049397, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30004,
          label: "乐山_雷达阵地",
          name: "leshanld",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/LS_LDZD@jsys/config",
          type: "scp",
          center: [121.070042476681, 24.498171201887, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30005,
          label: "屏东空军指挥部",
          name: "pingdong",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/PD_HQJD@jsys/config",
          type: "scp",
          center: [120.4664684, 22.68141384, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30006,
          label: "烟墩山激动雷达预备阵地",
          name: "yandunshanld",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/YDS_DDZD@jsys/config",
          type: "scp",
          center: [119.5817867, 23.67358371, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30007,
          label: "乐山综合通讯站",
          name: "leshanzonghe",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/LS_LDZD@jsys/config",
          type: "scp",
          center: [121.070034049422, 24.4981528237339, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30008,
          label: "三芝雷达",
          name: "sanzhi",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/SZ_LDZD@jsys/config",
          type: "scp",
          center: [121.539606848004, 25.2442221300953, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30009,
          label: "台湾总统府",
          name: "zongtongfu",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/TW_ZTF@jsys/config",
          type: "scp",
          center: [121.51203457, 25.04000851, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 30010,
          label: "金门",
          name: "jinmen",
          url:
            iServerUrl +
            "/iserver/services/3D-model3D/rest/realspace/datas/JM_DDZD@jsys/config",
          type: "scp",
          center: [118.34380648, 24.4234142, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
      ],
    },
    {
      id: 4,
      label: "地形",
      children: [
        {
          id: 40001,
          label: "四省地形",
          name: "fourterrain",
          url: iServerUrl + "/iserver/services/3D-dem/rest/realspace/datas/dem",
          type: "terrain",
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        // {
        //   id: 40001,
        //   label: '福建地形',
        //   name: 'fujiang',
        //   url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/福建@jsys',
        //   type: 'terrain',
        //   center: [118.75828728, 25.54842144, 700000],
        //   checked: true,
        //   orientation: {
        //     heading: 0,
        //     pitch: -90,
        //     roll: 0
        //   }
        // },
        // {
        //   id: 40002,
        //   label: '广东地形',
        //   name: 'guangdong',
        //   url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/广东@jsys',
        //   type: 'terrain',
        //   center: [115.75828728, 22.64842144, 1200000],
        //   orientation: {
        //     heading: 0,
        //     pitch: -90,
        //     roll: 0
        //   }
        // },
        // {
        //   id: 40003,
        //   label: '台湾地形',
        //   name: 'taiwan',
        //   url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/台湾@jsys',
        //   type: 'terrain',
        //   center: [121.442901306632, 23.627300493970, 700000],
        //   orientation: {
        //     heading: 0,
        //     pitch: -90,
        //     roll: 0
        //   }
        // },
        // {
        //   id: 40004,
        //   label: '浙江地形',
        //   name: 'zhejiang',
        //   url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/浙江@jsys',
        //   type: 'terrain',
        //   center: [120.05828728, 29.44842144, 700000],
        //   orientation: {
        //     heading: 0,
        //     pitch: -90,
        //     roll: 0
        //   }
        // },
      ],
    },
    {
      id: 5,
      label: "影像",
      children: [
        {
          id: 50001,
          label: "福建省影像透明",
          name: "福建省影像透明",
          url: wmtsUrl,
          type: "wmts",
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 50002,
          label: "台湾省影像透明",
          name: "台湾省影像透明",
          url: wmtsUrl,
          type: "wmts",
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 50003,
          label: "浙江省影像透明",
          name: "浙江省影像透明",
          url: wmtsUrl,
          type: "wmts",
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
        {
          id: 50004,
          label: "广东省_影像",
          name: "广东省_影像",
          url: wmtsUrl,
          type: "wmts",
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0,
          },
        },
      ],
    },
  ],
  /**
   * 卷帘对比的图层，只能配置两个，第一个在左边
   */
  rollerShutterLayers: [
    {
      id: 10002,
      label: "温度",
      name: "roller-shutter-wendu",
      url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/温度",
      type: "webp",
    },
    {
      id: 10001,
      label: "电磁数据",
      name: "roller-shutter-dianci",
      url: iServerUrl + "/iserver/services/map-tifMap/rest/maps/电磁数据",
      type: "webp",
    },
  ],
  /**
   * 缓冲区分析中可选图层，name唯一
   */
  bufferFiles: [
    {
      name: "泉州",
      path: "/data/泉州.json",
    },
    {
      name: "台湾海岸线",
      path: "/data/台湾海岸线.json",
    },
  ],
  /**
   * 三维绘制中可绘制模型
   */
  drawModels: [
    {
      name: "E2预警机",
      path: "/data/gltf/E2_GLTF/awacse2k.gltf",
      imagePath: "/image/map/model/e2.png",
    },
    {
      name: "F5E战斗机",
      path: "/data/gltf/F5E_GLTF/f5e.gltf",
      imagePath: "/image/map/model/f5e.png",
    },
    {
      name: "F16战斗机",
      path: "/data/gltf/F16_GLTF/f16.gltf",
      imagePath: "/image/map/model/f16.png",
    },
  ],
  airDefenceServerUrl: `${freexServerUrl}/datamanager/target/queryTargetPage`,
  targetPlottingServerUrl: `${freexServerUrl}/datamanager/target/queryTargetPage`,
  targetModelDownloadServerUrl: `${freexServerUrl}/datamanager/target/download`,
  targetModelImageServerUrl: `${freexServerUrl}/datamanager/target/img`,
  udpSocketServerUrl: "ws://192.168.100.103:8886",
};
