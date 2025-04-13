import { S3mModels, ToolbarItem } from './components/types';
const s3mModels = <S3mModels[]>[
  {
    name: '椅子',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/bench.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/Chair.s3m',
    active: false,
  },
  {
    name: '垃圾箱',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/Dustbin.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/Dustbin.s3m',
    active: false,
  },
  {
    name: '垃圾箱2',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/paper-bucket.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/Dustbin2.s3m',
    active: false,
  },
  {
    name: '垃圾桶',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/dustbin1.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/GarbageCan.s3m',
    active: false,
  },
  {
    name: '报亭',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/newspaper.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/NewsStand.s3m',
    active: false,
  },
  {
    name: '邮政信箱',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/mailbox.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/PO-Box.s3m',
    active: false,
  },
  {
    name: '限速牌',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/speed-limit.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/RestrictionBoard.s3m',
    active: false,
  },
  {
    name: '路灯',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/lamp-post.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/StreetLight.s3m',
    active: false,
  },
  {
    name: '红绿灯',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/traffic-light.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/TrafficLight.s3m',
    active: false,
  },
  {
    name: '电信电话亭',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/phone-booth.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/T-TelBooth.s3m',
    active: false,
  },
  {
    name: '树1',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree1.s3m',
    active: false,
  },
  {
    name: '树2',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/pine.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree2.s3m',
    active: false,
  },
  {
    name: '树3',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree3.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree3.s3m',
    active: false,
  },
  {
    name: '树4',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree2.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/tree4.s3m',
    active: false,
  },
  {
    name: 'springTree',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/springTree.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/springTree.s3m',
    active: false,
  },
  {
    name: 'autumnTree',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/autumnTree.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/autumnTree.s3m',
    active: false,
  },
  {
    name: 'winterTree',
    thumbnail:
      'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/winterTree.png',
    path: 'http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/winterTree.s3m',
    active: false,
  },
];

const toolBarData = <ToolbarItem[]>[
  {
    icon: 'icon-layer',
    title: '图层',
    name: 'layers',
    selected: false,
  },
  {
    icon: 'icon-add-model',
    title: '添加小品',
    name: 'model',
    size: 22,
    selected: false,
  },
  {
    icon: '',
    title: '',
    name: 'division',
  },
  {
    icon: 'ant-design:zoom-in-outlined',
    title: '放大',
    name: 'zoomIn',
  },
  {
    icon: 'ant-design:zoom-out-outlined',
    title: '缩小',
    name: 'zoomOut',
  },
  {
    icon: 'ant-design:redo-outlined',
    title: '重新加载',
    name: 'reload',
  },
];

const sceneUrls = {
  ter: {
    id: '1',
    name: '地形图',
    url: 'http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace/datas/srtm_54_07@zhufeng',
  },
  img: [

      {
        id: 2,
        name: '影像2',
        url: 'http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace/datas/srtm_54_07@zhufeng',
      },
  ],
  osgb: [
    // {
    //   id: '2',
    //   name: '倾斜',
    //   url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
    // },
  ],
  simpleBuild: [
    {
      name: 'build',
      // url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
      url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/building_udb@building/config',
    },
  ],

  build: [
   // {
   //    id: 1,
   //    name: '精模',
   //    // url: 'http://www.supermapol.com/realspace/services/3D-CBDCache20200416-2/rest/realspace',
   //    gisDataUrl: '',
   //    gisDataKey: '',
   //    apiDataUrl: '',
   //    fieldsMap: {},
   //    data: [
   //      {
   //        name: '九号楼@九号楼1',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
   //      },
   //      {
   //        name: 'ground',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%9C%B0%E9%9D%A2/config',
   //      },
   //      {
   //        name: '日照窗户',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E6%8B%89%E4%BD%8E%E7%AA%97@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
   //      },
   //      {
   //        name: '日照墙',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E6%8B%89%E4%BD%8E%E5%A2%99@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
   //      },
   //      {
   //        name: 'original',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/building_udb@building/config',
   //      },
   //      {
   //        name: 'hill',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%B1%B1/config',
   //      },
   //      {
   //        name: '九号楼@九号楼',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config',
   //      },
   //      {
   //        name: 'origina白膜控制',
   //        url: 'http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%86%85%E9%83%A8%E7%BB%93%E6%9E%84@%E5%AE%A4%E5%86%85/config',
   //      },
   //    ],
   //  },
    // {
    //   id: 2,
    //   name: '新疆',
    //   url: 'http://192.168.65.120:4090/iserver/services/3D-twin-city/rest/realspace',
    //   data: [],
    //   selectEnabled: false,
    //   gisDataUrl: '',
    //   gisDataKey: '',
    //   apiDataUrl: '',
    //   fieldsMap: {},
    // },
  ],
};

export { s3mModels, sceneUrls, toolBarData };
