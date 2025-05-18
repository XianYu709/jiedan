const iServerUrl = 'http://192.168.0.103:8090'
window.MAP_CONFIG = {
  iServerUrl,
  layers: [
    {
      id: 1,
      label: '场站列表',
      children: [
        {
          id: 10001,
          label: '兴宁机场',
          name: 'xingning',
          // url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/xingning@jsys/config',
          url:  "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace/datas/Config/config",
          type: 'scp',
          center: [126.62130634014461, 45.76867932023662, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10002,
          label: '武夷山机场',
          name: 'wuyishan',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/wuyishan@jsys/config',
          type: 'scp',
          center: [118.00030433, 27.70191068, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10003,
          label: '连城机场',
          name: 'lianchengjichang',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/lianchengjichang@jsys/config',
          type: 'scp',
          center: [116.74658475, 25.67729250, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10004,
          label: '惠安机场',
          name: 'HAJC_Lambert',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/HAJC_Lambert@jsys/config',
          type: 'scp',
          center: [118.80678021, 25.02716309, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10005,
          label: '龙田机场',
          name: 'LTJC_Lambert',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/LTJC_Lambert@jsys/config',
          type: 'scp',
          center: [119.45996802, 25.57365086, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10006,
          label: '漳州机场',
          name: 'ZZJC_Lambert',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/ZZJC_Lambert@jsys/config',
          type: 'scp',
          center: [117.65509978, 24.56337518, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 10007,
          label: '清泉岗机场',
          name: 'LTJC_Lambert',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/qingquangang@jsys/config',
          type: 'scp',
          center: [120.62662140, 24.26311381, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
      ]
    },
    {
      id: 2,
      label: '数据服务',
      children: [
        {
          id: 20001,
          label: '电磁数据',
          name: 'dianci',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/电磁数据',
          type: 'webp',
          flyTo: true
        },
        {
          id: 20002,
          label: '温度',
          name: 'wendu',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/温度',
          type: 'webp',
          flyTo: true
        },
        {
          id: 20003,
          label: '降水',
          name: 'jiangshui',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/降水',
          type: 'webp',
          flyTo: true
        },
        {
          id: 20004,
          label: '可见光',
          name: 'kejianguang',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/可见光',
          type: 'webp',
          flyTo: true
        },
        {
          id: 20005,
          label: '文字',
          name: 'wenzi',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/文字',
          type: 'webp',
          flyTo: true
        },
        {
          id: 20006,
          label: '航路航线',
          name: 'hangluhangxian',
          url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/航路航线',
          type: 'webp',
          flyTo: true
        },
      ]
    },
    {
      id: 3,
      label: '作战目标',
      children: [
        {
          id: 30001,
          label: '虎井屿防御工事',
          name: 'hujing',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/HJY_FYGH@jsys/config',
          type: 'scp',
          center: [119.512038883137, 23.487510442355, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30002,
          label: '烟墩山_导弹阵地',
          name: 'yandunshan',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/YDS_DDZD@jsys/config',
          type: 'scp',
          center: [119.58197867, 23.6735837, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30003,
          label: '清泉岗_导弹阵地',
          name: 'qingquangang',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/QQG_DDZD@jsys/config',
          type: 'scp',
          center: [120.642901306632, 24.257300493970, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30004,
          label: '乐山_雷达阵地',
          name: 'leshanld',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/LS_LDZD@jsys/config',
          type: 'scp',
          center: [121.070042476681, 24.498171201887, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30005,
          label: '屏东空军指挥部',
          name: 'pingdong',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/PD_HQJD@jsys/config',
          type: 'scp',
          center: [120.46646840, 22.68141384, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30006,
          label: '烟墩山激动雷达预备阵地',
          name: 'yandunshanld',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/YDS_DDZD@jsys/config',
          type: 'scp',
          center: [119.5817867,  23.67358371, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30007,
          label: '乐山综合通讯站',
          name: 'leshanzonghe',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/LS_LDZD@jsys/config',
          type: 'scp',
          center: [121.070034049422, 24.4981528237339, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30008,
          label: '三芝雷达',
          name: 'sanzhi',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/SZ_LDZD@jsys/config',
          type: 'scp',
          center: [121.539606848004, 25.2442221300953, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30009,
          label: '台湾总统府',
          name: 'zongtongfu',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/TW_ZTF@jsys/config',
          type: 'scp',
          center: [121.51203457, 25.04000851, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 30010,
          label: '金门',
          name: 'jinmen',
          url: iServerUrl + '/iserver/services/3D-model3D/rest/realspace/datas/JM_DDZD@jsys/config',
          type: 'scp',
          center: [118.34380648, 24.42341420, 2000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
      ]
    },
    {
      id:4,
      label: "地形",
      children:[
        {
          id: 40001,
          label: '福建地形',
          name: 'fujiang',
          url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/福建@jsys',
          type: 'terrain',
          center: [118.75828728, 25.54842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 40002,
          label: '广东地形',
          name: 'guangdong',
          url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/广东@jsys',
          type: 'terrain',
          center: [115.75828728, 22.64842144, 1200000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 40003,
          label: '台湾地形',
          name: 'taiwan',
          url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/台湾@jsys',
          type: 'terrain',
          center: [121.442901306632, 23.627300493970, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
        {
          id: 40004,
          label: '浙江地形',
          name: 'zhejiang',
          url: iServerUrl + '/iserver/services/3D-dem/rest/realspace/datas/浙江@jsys',
          type: 'terrain',
          center: [120.05828728, 29.44842144, 700000],
          orientation: {
            heading: 0,
            pitch: -90,
            roll: 0
          }
        },
      ]
    }
  ],
  rollerShutterLayers: [
    {
      id: 10002,
      label: '温度',
      name: 'roller-shutter-wendu',
      url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/温度',
      type: 'webp'
    },
    {
      id: 10001,
      label: '电磁数据',
      name: 'roller-shutter-dianci',
      url: iServerUrl + '/iserver/services/map-tifMap/rest/maps/电磁数据',
      type: 'webp'
    }
  ],
  bufferFiles: [
    {
      name: '泉州',
      path: '/data/泉州.json'
    },
    {
      name: '台湾海岸线',
      path: '/data/台湾海岸线.json'
    }
  ],
  drawModels: [
    {
      name: 'E2预警机',
      path: '/data/GLTF整理/E2预警机_GLTF/E2_GLTF/e2.gltf',
      imagePath: '/image/map/model/e2.png'
    },
    {
      name: 'F5E战斗机',
      path: '/data/GLTF整理/F5E战斗机_GLTF/F5E_GLTF/f5e.gltf',
      imagePath: '/image/map/model/f5e.png'
    },
    {
      name: 'F16战斗机',
      path: '/data/GLTF整理/F16战斗机_GLTF/F16_GLTF/f16.gltf',
      imagePath: '/image/map/model/f16.png'
    }
  ]
}
