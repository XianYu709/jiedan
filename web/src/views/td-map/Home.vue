<template>
  <div class="relative w-full h-full">
    <div class="cover"></div>
    <div class="header absolute w-full h-16 z-9 bg-gray-100 flex justify-around items-center px-4">
      <div class="title flex items-center">
        <img class="w-10" src="@/assets/images/logo.png" alt="" />
        <div class="md:text-xl lg:text-3xl text-gray-8 ml-3 align-middle">{{ title }}</div>
      </div>
      <div class="w-2/3 px-6">
        <NavMenu @select="handleSelect" @deselect="handleDeSelected" :open="menuOpen" />
      </div>
      <div class="extra flex justify-between items-center">
        <Date class="mr-4"></Date>
        <Divider type="vertical" class="h-8 bg-gray-400 w-0.5 opacity-60" />
        <router-link to="/map/index" class="ml-4 text-gray-8">
          <Icon icon="ant-design:setting-outlined" :size="32" />
        </router-link>
      </div>
      <!-- <div class="trapezoid"></div> -->
    </div>
    <Viewer
      v-if="viewerFlag"
      ref="viewerIns"
      :sceneUrls="sceneUrls"
      @click="clickHandler"
      @instance="readyHandler"
    />
    <div class="top-19 left-6 absolute z-10 w-64">
      <Properties> </Properties>
    </div>
    <GreeningRate v-model:open="menuOpen.greeningRate"></GreeningRate>
    <Scene v-model:open="menuOpen.scene"></Scene>
    <Measure v-model:open="menuOpen.measure" class="top-20 right-10 absolute"></Measure>
    <ServiceAnalysis
      v-model:open="menuOpen.ServiceAnalysis"
      class="top-20 right-90 absolute"
    ></ServiceAnalysis>
    <Comparison v-model:open="menuOpen.compare"></Comparison>
    <Crop v-model:open="menuOpen.crop" class="left-10 top-150 absolute"></Crop>
    <Models
      v-model:open="menuOpen.models"
      :iconSize="40"
      :s3mModels="s3mModels"
      class="left-10 top-25 absolute"
    ></Models>
    <ViewShed v-model:open="menuOpen.viewShed" class="right-174 top-60 absolute"></ViewShed>
    <InterVisibility
      v-model:open="menuOpen.interVisibility"
      class="right-174 top-60 absolute"
    ></InterVisibility>
    <SkyLine v-model:open="menuOpen.skyLine" class="right-174 top-60 absolute"></SkyLine>
    <Terrain v-model:open="menuOpen.terrain" class="right-174 top-90 absolute"></Terrain>
    <Slope v-model:open="menuOpen.slope" class="right-174 top-90 absolute"></Slope>
    <Shade v-model:open="menuOpen.shade" class="right-100 top-100 absolute"></Shade>
    <Bisect v-model:open="menuOpen.bisect" class="right-100 top-100 absolute"></Bisect>
    <Facade v-model:open="menuOpen.facade" class="right-100 top-100 absolute"></Facade>
    <ViewDome v-model:open="menuOpen.viewDome" class="right-100 top-100 absolute"></ViewDome>
    <Weather v-model:open="menuOpen.weather" class="absolute right-70 top-100"></Weather>
    <BestPath v-model:open="menuOpen.bestPath" class="absolute right-70 top-100"></BestPath>
    <SiteZoning v-model:open="menuOpen.siteZoning" class="absolute right-70 top-100"></SiteZoning>

    <GeometryQueries
      v-model:open="menuOpen.select"
      class="left-200 top-60 absolute"
      :coord="coord"
    ></GeometryQueries>
    <LayerControl
      v-model:open="menuOpen.layerControl"
      class="absolute right-200 top-20"
    ></LayerControl>
    <RegressionLine
      layerType="simpleBuild"
      v-model:open="menuOpen.regressionLine"
      class="absolute left-3/5 top-2/6"
    ></RegressionLine>
    <AffixedTo v-model:open="menuOpen.affixedTo" class="absolute left-1/5 top-2/6"></AffixedTo>
    <HighLimit
      v-model:open="menuOpen.highLimit"
      layerType="simpleBuild"
      class="absolute left-1/5 top-4/6"
    ></HighLimit>
    <ToolBar
      :data="toolBarData"
      :open="[menuOpen.layerControl, menuOpen.scene, menuOpen.models, menuOpen.weather]"
      @selectHandler="selectHandler"
      class="left-1/2 top-5/6 -translate-x-1/2"
    >
    </ToolBar>
  </div>
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { Divider } from 'ant-design-vue';
  import { Viewer, Properties } from 'td-gis';
  import emitter from '@/td-gis/hooks/useMitt';
  import NavMenu from './components/NavMenu/Index.vue';
  import Crop from './components/Crop.vue';
  import Measure from './components/Measure.vue';
  import Comparison from './components/Comparison.vue';
  import ToolBar from './components/ToolBar.vue';
  import ViewShed from './components/ViewShed.vue';
  import InterVisibility from './components/InterVisibility.vue';
  import SkyLine from './components/SkyLine.vue';
  import Terrain from './components/Terrain.vue';
  import Slope from './components/Slope.vue';
  import Shade from './components/Shade.vue';
  import Bisect from './components/Bisect.vue';
  import Facade from './components/Facade.vue';
  import ViewDome from './components/ViewDome.vue';
  import Models from './components/Models.vue';
  import Date from './components/Date.vue';
  import RegressionLine from './components/RegressionLine.vue';
  import AffixedTo from './components/AffixedTo.vue';
  import HighLimit from './components/HighLimit.vue';
  import Weather from './components/Weather.vue';
  import GeometryQueries from './components/GeometryQueries.vue';
  import LayerControl from './components/LayerControl.vue';
  import ServiceAnalysis from './components/ServiceAnalysis.vue';
  import BestPath from './components/BestPath.vue';
  import SiteZoning from './components/SiteZoning.vue';
  import Scene from './components/Scene.vue';
  // import Properties from './components/Properties.vue';
  import GreeningRate from './components/GreeningRate.vue';
  import { toolBarData, sceneUrls as staticSceneUrl, s3mModels } from './data';
  import { useUserStore } from '@/store/modules/user';
  import map from '@/api/map/index';

  const sceneUrls = ref<any>({});
  const { userInfo } = useUserStore();

  initLayerUrl({ useLocalUrl: false });
  provide('sceneUrls', sceneUrls);

  const { title } = useGlobSetting();
  const layerQueue = ref<any[]>([]);
  const menuOpen = ref<any>({
    select: false,
    measure: false,
    crop: false,
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
  const handleCancel = () => {
    coord.value = null;
  };
  const handleSelect = ({ item, key, selectedKeys }) => {
    menuOpen.value[key] = true;
    console.log(11, key, menuOpen.value[key]);
    switch (selectedKeys[0]) {
      case 'terrain':
        // viewer.scene.camera.setView({
        //   destination: Cesium.Cartesian3.fromDegrees(87.5, 26.5, 200000.9562139995),
        //   orientation: {
        //     heading: 6.10547067016156,
        //     pitch: -0.8475077031996778,
        //     roll: 6.2831853016686185,
        //   },
        // });
        break;
      case 'slope':
        // viewer.scene.camera.setView({
        //   destination: Cesium.Cartesian3.fromDegrees(87.5, 26.5, 200000.9562139995),
        //   orientation: {
        //     heading: 6.10547067016156,
        //     pitch: -0.8475077031996778,
        //     roll: 6.2831853016686185,
        //   },
        // });
        break;
      case 'regressionLine':
        /*  viewer.scene.camera.setView({
                  destination: new Cesium.Cartesian3.fromDegrees(
                    115.00022575830863,
                    39.009956534844858,
                    500,
                  ),
                  orientation: {
                    heading: 1.705646,
                    pitch: -0.499956,
                    roll: 0.0,
                  },
                }); */
        break;
      case 'affixedTo':
        // viewer.scene.camera.setView({
        //   destination: new Cesium.Cartesian3(
        //     -2095120.8195698452,
        //     4492050.236234234,
        //     4014691.2770372364,
        //   ),
        //   orientation: {
        //     heading: 1.0525528821913364,
        //     pitch: -0.5403802934874635,
        //     roll: 1.616484723854228e-12,
        //   },
        // });
        break;
      case 'highLimit':
        // viewer.scene.camera.setView({
        //   destination: new Cesium.Cartesian3.fromDegrees(
        //     115.00366140297365,
        //     39.01073839434967,
        //     331.116406992883,
        //   ),
        //   orientation: {
        //     heading: 1.92451,
        //     pitch: -0.403816,
        //     roll: 0.0,
        //   },
        // });
        break;
      default:
        // viewer.scene.camera.setView({
        //   destination: new Cesium.Cartesian3(
        //     -2178902.2367440006,
        //     4382118.713475999,
        //     4091632.9562139995,
        //   ),
        //   orientation: {
        //     heading: 0.8080477218012438,
        //     pitch: -0.46704202047501653,
        //     roll: 6.283185307179586,
        //   },
        // });
        break;
    }
  };
  const handleDeSelected = ({ item, key, selectedKeys }) => {
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
      case 'layers':
        menuOpen.value.layerControl = !menuOpen.value.layerControl;
        break;
      case 'weather':
        menuOpen.value.weather = !menuOpen.value.weather;
        break;
      case 'model':
        menuOpen.value.models = !menuOpen.value.models;
        break;
      case 'scene':
        menuOpen.value.scene = !menuOpen.value.scene;
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
    viewer.camera.zoomIn(
      (viewer.camera.positionCartographic.height / Math.abs(Math.sin(viewer.camera.pitch))) * 0.2,
    );
  };
  const zoomOut = () => {
    viewer.camera.zoomOut(
      (viewer.camera.positionCartographic.height / Math.abs(Math.sin(viewer.camera.pitch))) * 0.2,
    );
  };
  emitter.on('layerReady', () => {
    viewer.scene.layers.layerQueue.map((el: any) => {
      layerQueue.value.push(el.name);
    });
  });

  const readyHandler = (e) => {
    // viewer.scene.camera.setView({
    //   destination: new Cesium.Cartesian3(408954.15386263025, 4515299.850823052, 4488630.253084286),
    //   orientation: {
    //     heading: 0.010432891389807075,
    //     pitch: -1.2955863517856812,
    //     roll: 6.283185307179576,
    //   },
    // });
  };

  async function initLayerUrl({ useLocalUrl = true }) {
    if (useLocalUrl) {
      sceneUrls.value = staticSceneUrl;
      return;
    }
    const {
      data: { records },
    } = await map.layerListApi({ pageSize: 999, deptId: userInfo?.deptId });

    let temp = {};
    records.forEach((item) => {
      if (item.type == 'build') {
        temp[item.type] = temp[item.type]
          ? [
              ...temp[item.type],
              {
                ...item,
                id: item.id,
                name: item.layerName,
                url: item.url,
                selectEnabled: false,
              },
            ]
          : [
              {
                ...item,
                id: item.id,
                name: item.layerName,
                url: item.url,
                selectEnabled: false,
              },
            ];
      } else if (item.type == 'ter') {
        temp[item.type] = {
          id: item.id,
          name: item.layerName,
          url: item.url,
        };
      } else {
        temp[item.type] = temp[item.type]
          ? [
              ...temp[item.type],
              {
                id: item.id,
                name: item.layerName,
                url: item.url,
                selectEnabled: false,
              },
            ]
          : [
              {
                id: item.id,
                name: item.layerName,
                url: item.url,
                selectEnabled: false,
              },
            ];
      }
    });
    sceneUrls.value = temp;
  }
</script>

<style scoped lang="less">
  .cover {
    position: absolute;
    z-index: 1;
    top: 64px;
    width: 100%;
    height: 100%;
    background: url('@/assets/images/cover.png') center center no-repeat;
    opacity: 0.7;
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
