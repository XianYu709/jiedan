<template>
  <div class="pt-3 relative">
    <slot>
      <InputNumber v-model:value="scope" placeholder="输入查询范围" allow-clear addon-after="米" />
    </slot>
    <div class="pt-3" v-for="item in midpointList" :key="item.id">
      <span @click="mid(item)">
        <slot name="mid">
          <Button type="primary">选点</Button>
        </slot>
      </span>
      <span class="ml-3">{{ midList[item.id].x }}&nbsp;,&nbsp;{{ midList[item.id].y }}</span>
    </div>
    <div>
      <span @click="midClear">
        <slot name="midClear">
          <Button type="primary" danger class="mt-3">清除</Button>
        </slot>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onBeforeUnmount, ref, watch } from 'vue';
  import * as turf from '@turf/turf';
  import axios from 'axios';
  import { message, InputNumber, Button } from 'ant-design-vue';
  import midImage from '../images/mid.png';
  const props = defineProps({
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/featureResults.json',
    },
    locationUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/transportationAnalyst-twin-city/rest/networkanalyst/%E8%B7%AF%E7%BD%91@data/location.json',
    },
    scope: {
      type: Number,
      default: 500,
    },
  });
  let scope = ref(500);

  let entities = [];

  watch(
    () => scope,
    () => {},
    { deep: true },
  );
  watch(
    () => props,
    () => {
      scope.value = props.scope;
    },
    { deep: true, immediate: true },
  );

  const midList = ref([
    {
      id: 0,
      x: 0,
      y: 0,
      z: 0,
    },
  ]);
  const midClear = () => {
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    if (midList.value) {
      midList.value.map((item) => {
        midHandlerPoint.value.length > 0 && midHandlerPoint.value[item.id].deactivate();
        midHandlerPoint.value.length > 0 && midHandlerPoint.value[item.id].clear();
        item.x = item.y = 0;
      });
    }
  };
  const midHandlerPoint = ref<any>([]);
  const mid = async (item) => {
    if (midList.value[item.id].x != 0) {
      viewer.entities.removeById(item.id);
      midHandlerPoint.value[item.id].deactivate();
      midHandlerPoint.value[item.id].clear();
      midClear();
    }
    midHandlerPoint.value[item.id] = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    midHandlerPoint.value[item.id].activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    midHandlerPoint.value[item.id].movingEvt.addEventListener(function (windowPosition) {});
    midHandlerPoint.value[item.id].drawEvt.addEventListener(function (result) {
      result.object._position.x = Number(result.object._position.x);
      result.object._position.y = Number(result.object._position.y);
      result.object._position.z = Number(result.object._position.z);
      let temp = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(result.object._position.x),
          parseFloat(result.object._position.y),
          parseFloat(result.object._position.z),
        ),
        billboard: {
          image:
            'https://ts3.cn.mm.bing.net/th?id=OIP-C.a_2XJOKnYxsnGU-tYazCWwHaF7&w=279&h=223&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
          width: 30,
          height: 40,
        },
      });
      entities.push(temp);
      var line = result.object;
      var scarToGraphic = Cesium.Cartographic.fromCartesian(line._position);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      let temp2 = viewer.entities.add({
        id: item.id,
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          parseFloat(height + 5),
        ),
        billboard: {
          image: midImage,
          width: 30,
          height: 30,
        },
      });
      entities.push(temp2);
      midList.value.map(async (val) => {
        if (item.id == val.id) {
          val.x = Number(lng);
          val.y = Number(lat);
          val.z = Number(height);
          var center = [val.x, val.y];
          var radius = 300;
          var options = { units: 'miles' };
          var circle = turf.circle(center, radius, options);
          let minFeature = await getBufferData({ points: circle.geometry.coordinates[0] }, center);
          let paramForm = {
            getFeatureMode: 'SPATIAL',
            datasetNames: ['data:路网_Node'],
            geometry: {
              points: [{ y: minFeature[1], x: minFeature[0] }],
              type: 'POINT',
            },
            spatialQueryMode: 'CONTAIN',
          };
          axios({
            url: props.serviceUrl + '?returnContent=true',
            async: true,
            data: JSON.stringify(paramForm),
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          }).then((res) => {
            if (res.data.features.length > 0) {
              //暂时取第一个
              let supplyCenters = [
                {
                  nodeID: res.data.features[0].ID,
                  maxWeight: scope.value,
                  resourceValue: 100,
                  type: 'OPTIONALCENTER',
                },
              ];
              axios({
                url: `${props.locationUrl}?supplyCenters=${JSON.stringify(
                  supplyCenters,
                )}&isFromCenter=true&expectedSupplyCenterCount=1&weightName=SmLength&returnNodeFeatures=true`,
                async: true,
                method: 'GET',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
              }).then((res) => {
                res.data.demandResults.map((el) => {
                  let temp = viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(
                      parseFloat(Number(el.geometry.center.x)),
                      parseFloat(Number(el.geometry.center.y)),
                      parseFloat(339),
                    ),
                    point: {
                      pixelSize: 10,
                      material: Cesium.Color.YELLOW,
                    },
                  });
                  entities.push(temp);
                });
              });
            } else {
              message.info('暂无数据');
            }
          });
        }
      });
    });
    midHandlerPoint.value[item.id].activate();
  };
  const getBufferData = async (params, center) => {
    let paramForm = {
      datasetNames: ['SHP:POI'],
      getFeatureMode: 'SPATIAL',
      geometry: {
        id: 0,
        style: null,
        parts: null,
        points: null,
        type: 'REGION',
        prjCoordSys: { epsgCode: null },
      },
      spatialQueryMode: 'INTERSECT',
      hasGeometry: true,
    };
    paramForm.geometry.parts = [params.points.length];
    paramForm.geometry.points = params.points.map((item) => {
      return {
        id: item + '',
        bounds: null,
        SRID: null,
        x: item[0],
        y: item[1],
        tag: null,
        type: 'Point',
        geometryType: 'Point',
      };
    });
    let arrs = [];
    var min = [];
    let distances = [];
    await axios({
      url: props.serviceUrl + '?returnContent=true',
      async: true,
      data: JSON.stringify(paramForm),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    }).then((res) => {
      res.data.features.map((val) => {
        let arr = [];
        arr.push(val.geometry.center.x, val.geometry.center.y);
        arrs.push(arr);
      });
      arrs.map((item) => {
        var options1 = { units: 'miles' };
        var distance = turf.distance(turf.point(item), turf.point(center), options1);
        distances.push(distance);
      });
      min = arrs[distances.indexOf(Math.min.apply(Math, distances))];
    });
    return min;
  };
  const midpointList = ref<any>([{ id: 0 }]);
  onBeforeUnmount(() => {
    midpointList.value = [{ id: 0 }];
    midClear();
  });
</script>
