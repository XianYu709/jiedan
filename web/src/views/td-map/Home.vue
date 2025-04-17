<template>
  <div class="relative w-full h-full">
    <div class="cover"></div>
    <div class="header absolute w-full h-16 z-9 bg-gray-100 flex justify-around items-center px-4">
      <div class="title flex items-center">
        <img alt="" class="w-10" src="@/assets/images/logo.png"/>
        <div class="md:text-xl lg:text-3xl text-gray-8 ml-3 align-middle">{{ title }}</div>
      </div>
      <div class="w-2/3 px-6">
        <NavMenu :open="menuOpen" @deselect="handleDeSelected" @select="handleSelect"/>
      </div>
      <div class="extra flex justify-between items-center">
        <Date class="mr-4"></Date>
        <Divider class="h-8 bg-gray-400 w-0.5 opacity-60" type="vertical"/>
        <router-link class="ml-4 text-gray-8" to="/map/index">
          <Icon :size="32" icon="ant-design:setting-outlined"/>
        </router-link>
      </div>
    </div>
    <Viewer
      v-if="viewerFlag"
      ref="viewerIns"
      @click="clickHandler"
      @instance="readyHandler"
      style="width: 100vw; height: 100vh"
    />
    <BestPath v-model:open="menuOpen.bestPath" class="absolute right-70 top-100"></BestPath>
    <Measure v-model:open="menuOpen.measure" class="top-20 right-10 absolute"></Measure>
    <LayerControl v-model:open="menuOpen.layers" class="absolute right-200 top-20"></LayerControl>
    <ToolBar
      :data="toolBarData"
      :open="[menuOpen.layerControl, menuOpen.scene, menuOpen.models, menuOpen.weather]"
      class="left-1/2 top-5/6 -translate-x-1/2"
      @selectHandler="selectHandler"
    >
    </ToolBar>
  </div>
</template>

<script lang="ts" setup>
import {provide, ref, shallowRef} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {useGlobSetting} from '@/hooks/setting';
import {Divider} from 'ant-design-vue';
import Viewer from './components/Viewer.vue';
import NavMenu from './components/NavMenu/Index.vue';
import Measure from './components/Measure.vue';
import Date from './components/Date.vue';
import LayerControl from './components/LayerControl.vue';
import BestPath from './components/BestPath.vue';
import ToolBar from './components/ToolBar.vue';
import {toolBarData} from './data';

const {title} = useGlobSetting();
const menuOpen = ref<any>({
  select: false,
  measure: false,
  layers: false,
  compare: false,
  ServiceAnalysis: false,
  models: false,
  viewShed: false,
  interVisibility: false,
  skyLine: false,
  regressionLine: false,
  highLimit: false,
  affixedTo: false,
  terrain: false,
  slope: false,
  shade: false,
  bisect: false,
  facade: false,
  viewDome: false,
  layerControl: false,
  weather: false,
  bestPath: false,
  siteZoning: false,
  scene: false,
  greeningRate: false,
});

const handleSelect = ({item, key, selectedKeys}) => {
  menuOpen.value[key] = true;
  console.log(11, key, menuOpen.value[key]);
};
const handleDeSelected = ({item, key, selectedKeys}) => {
  menuOpen.value[key] = false;
};

const viewerFlag = ref(true);
const viewerIns = ref<HTMLElement | null>(null);
const selectHandler = (item) => {
  switch (item.name) {
    case 'zoomIn':
      zoomIn();
      break;
    case 'zoomOut':
      zoomOut();
      break;
    case 'reload':
      viewerFlag.value = false;
      let change = Object.entries(menuOpen.value).map(([key, value]) => {
        return [key, false];
      });
      menuOpen.value = Object.fromEntries(change);
      let timer = setTimeout(() => {
        viewerFlag.value = true;
        clearTimeout(timer);
      }, 100);
      break;
    default:
      break;
  }
};

const coord = ref();
const clickHandler = (e) => {
  if (menuOpen.value.scene) {
    coord.value = e;
  }
};

const zoomIn = () => {
  map_.value.setZoom(map_.value.getZoom() + 0.5)
};
const zoomOut = () => {
  map_.value.setZoom(map_.value.getZoom() - 0.5)
};
const addFloodRiskPolygon = (map) => {
  const floodRiskPolygon = new AMap.Polygon({
    path: [
      [117.01, 36.68],
      [117.03, 36.68],
      [117.03, 36.66],
      [117.01, 36.66],
    ],
    fillColor: '#FF0000',
    fillOpacity: 0.4,
    strokeColor: '#FF0000',
    strokeWeight: 2,
    zIndex: 10,
  });
  map.add(floodRiskPolygon);
};

const addDangerSourcePolygon = (map) => {
  const dangerSourcePolygon = new AMap.Polygon({
    path: [
      [117.02, 36.675],
      [117.025, 36.675],
      [117.025, 36.67],
      [117.02, 36.67],
    ],
    fillColor: '#FFA500',
    fillOpacity: 0.6,
    strokeColor: '#FFA500',
    strokeWeight: 2,
    zIndex: 20,
  });
  map.add(dangerSourcePolygon);
};

const mark = (map) => {
  const facilities = [
    {
      type: '医院',
      name: '济南市中心医院',
      position: [117.02, 36.675],
      capacity: 500,
      color: '#ff4d4f',
      radius: 1000, // 服务半径 1000 米
    },
    {
      type: '消防站',
      name: '历下区消防站',
      position: [117.015, 36.67],
      capacity: 100,
      color: '#fa8c16',
      radius: 800,
    },
    {
      type: '避难所',
      name: '泉城公园避难所',
      position: [117.025, 36.665],
      capacity: 1000,
      color: '#52c41a',
      radius: 1500,
    },
  ];

  facilities.forEach((item) => {
    // 创建标注
    const marker = new AMap.Marker({
      position: item.position,
      title: item.name,
      icon: new AMap.Icon({
        size: new AMap.Size(30, 30),
        image: `https://via.placeholder.com/30/${item.color.replace('#', '')}/ffffff?text=${
          item.type[0]
        }`,
        imageSize: new AMap.Size(30, 30),
      }),
    });

    // 信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
      <div style="font-size: 14px;">
        <b>${item.name}</b><br/>
        类型：${item.type}<br/>
        容量：${item.capacity} 人<br/>
        服务范围：${item.radius} 米
      </div>
    `,
      offset: new AMap.Pixel(0, -30),
    });

    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });

    map.add(marker);

    // 添加服务范围圆形覆盖物
    const circle = new AMap.Circle({
      center: item.position,
      radius: item.radius,
      strokeColor: item.color,
      strokeWeight: 2,
      fillColor: item.color,
      fillOpacity: 0.2,
      zIndex: 5,
    });

    map.add(circle);
  });
};
let map_ = shallowRef(null);
const instance = shallowRef({});
provide('instance', instance);
const readyHandler = ({map, AMap}) => {
  instance.value = {map, AMap};
  map.setCenter([117.000923, 36.675807]);
  addFloodRiskPolygon(map);
  addDangerSourcePolygon(map);
  mark(map);
  map_.value = map;
};
</script>

<style lang="less" scoped>
.cover {
  position: absolute;
  z-index: 1;
  top: 64px;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  background: url('@/assets/images/cover.png') center center no-repeat;
  background-size: cover;
  pointer-events: none;
}

.header {
  box-shadow: 0 0 15px 10px #b0b1b3, 0 0 30px 30px #fff;

  .title {
    font-family: rzzyt;
  }

  .trapezoid {
    content: '';
    position: absolute;
    top: 32px;
    right: 260px;
    width: 240px;
    height: 0;
    border-right: 24px solid transparent;
    border-bottom: 32px solid #b0b1b3;
    border-left: 24px solid transparent;
    box-shadow: inset 10px 10px 10px 10px #999;
  }
}
</style>
