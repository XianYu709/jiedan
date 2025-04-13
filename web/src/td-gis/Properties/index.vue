<template>
  <div>
    <Dropdown class="w-full" v-model:open="openDown" trigger="">
      <InputSearch
        v-model:value="search"
        placeholder="请输入关键词"
        enter-button
        allowClear
        @search="onSearch"
      />
      <template #overlay>
        <Menu class="overflow-auto max-h-90">
          <MenuItem v-for="(item, index) in menuItems" :key="index">
            <div class="flex justify-between items-center" @click="menuClick(item)">
              <a href="javascript:;">{{ item.fieldValues[6] }}</a>
              <span class="iconfont icon-location align-middle text-red-500" />
            </div>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>
<script setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { Dropdown, Menu, InputSearch, message } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import midImage from '../images/path.png';
  import axios from 'axios';
  import getHeightByType from '../utils/getHeightByType.js';
  const props = defineProps({
    open: { type: Boolean, default: false },
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/featureResults.json',
    },
    DataSourceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/SHP/datasets.json',
    },
    datasetNames: {
      type: String,
      default: 'SHP',
    },
  });
  const MenuItem = Menu.Item;
  let menuItems = ref([]);
  let element;

  let entities = [];

  const menuClick = (e) => {
    var positions = [Cesium.Cartographic.fromDegrees(e.geometry.center.x, e.geometry.center.y)];
    var promise = Cesium.sampleTerrainMostDetailed(viewer.scene.terrainProvider, positions);
    Cesium.when(promise, function (updatedPositions) {
      var terrainHeight = updatedPositions[0].height;
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      search.value = e.fieldValues[6];
      open.value = false;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          e.geometry.center.x,
          e.geometry.center.y,
          800.116406992883,
        ),
        orientation: {
          heading: 0.8062830061214665,
          pitch: -1.5680047587707713,
          roll: 0,
        },
      });
      let position = Cesium.Cartesian3.fromDegrees(
        e.geometry.center.x,
        e.geometry.center.y,
        terrainHeight + 15,
      );
      let temp = viewer.entities.add({
        id: e.id,
        position: position,
        billboard: {
          image: midImage,
          scale: 2.0,
          width: 10,
          height: 14,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000, 0.2),
        },
        label: {
          text: e.fieldValues[6],
          eyeOffset: new Cesium.Cartesian3(0.0, 7.0, 0.0),
          font: '18px HelVetica',
          fillColor: Cesium.Color.RED,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000, 0.2),
        },
      });
      entities.push(temp);
    });
    return;
  };
  const search = ref();
  const openDown = ref(false);

  const onSearch = () => {
    let paramForm = {
      getFeatureMode: 'SQL',
      datasetNames: element,
      maxFeatures: 1000,
      queryParameter: {
        sortClause: null,
        ids: null,
        name: null,
        attributeFilter: `NAME like '%${search.value}%'`,
        groupClause: null,
        linkItems: null,
        joinItems: null,
        fields: null,
      },
    };
    if (!search.value) {
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      return;
    }
    axios({
      url: `${props.serviceUrl}?returnContent=true`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      data: JSON.stringify(paramForm),
      method: 'POST',
    }).then(function (res) {
      menuItems.value = res.data.features;
      //

      if (res.data.features.length > 0) {
        openDown.value = true;
      } else {
        openDown.value = false;
        message.info('未查询到该信息');
      }
    });
  };

  watch(
    () => search,
    (val) => {
      if (!search.value) {
        openDown.value = false;
        menuItems.value = [];
      }
    },
    { deep: true, immediate: true },
  );
  onMounted(() => {
    axios({
      url: `${props.DataSourceUrl}`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    }).then(function (data) {
      element = data.data.datasetNames.map((mapitem) => {
        return `${props.datasetNames}:${mapitem}`;
      });
    });
  });
</script>
