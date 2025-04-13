<template>
  <div class="max-h-55 overflow-auto"> </div>
</template>
<script setup>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  import getHeight from '../utils/getHeightByType.js';

  let features = ref();
  const props = defineProps({
    open: { type: Boolean },
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/featureResults.json?returnContent=true',
    },
    datasetNames: {
      type: Array,
      default: ['data:建筑底面'],
    },
  });
  const emits = defineEmits(['position', 'result']);

  const open = ref(false);

  let entities = [];

  const infoboxContainer = ref({ x: 0, y: 0 });

  const position = () => {
    var windowPosition = new Cesium.Cartesian2();
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((event) => {
      const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
      viewer.scene.postRender.addEventListener(function () {
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, earthPosition, windowPosition);
        infoboxContainer.value.y = windowPosition.y;
        infoboxContainer.value.x = windowPosition.x;
        emits('position', infoboxContainer.value);
      });

      let ray = viewer.camera.getPickRay(event.position);
      let pick = viewer.scene.globe.pick(ray, viewer.scene);
      if (!open.value) {
        return;
      }
      queryByPoint(pointsToDegreesObj([pick]));
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  const queryByPoint = (queryPoint) => {
    getHeight(queryPoint);
    let paramForm = {
      getFeatureMode: 'SPATIAL',
      spatialQueryMode: 'INTERSECT',
      datasetNames: props.datasetNames,
      geometry: {
        id: 0,
        parts: null,
        points: null,
        type: 'POINT',
      },
    };
    paramForm.geometry.parts = [queryPoint.length];
    paramForm.geometry.points = queryPoint;

    axios({
      url: props.serviceUrl,
      async: true,
      data: JSON.stringify(paramForm),
      method: 'POST',
    }).then((data) => {
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      if (data.data.features.length > 0) {
        features.value = data.data.features[0];
        addClapFeature(data.data.features[0]);
        emits('result', data.data.features[0]);
      } else {
        emits('result', data.data.features[0]);
      }
    });
  };
  const pointsToDegreesObj = (points) => {
    return points.map((item) => {
      let degreesObj = {};
      var scarToGraphic = Cesium.Cartographic.fromCartesian(item);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      degreesObj.x = Number(lng);
      degreesObj.y = Number(lat);
      degreesObj.z = Number(height);
      return degreesObj;
    });
  };
  // 将数据服务查询到的要素添加到场景中高亮显示，表示选中效果。
  const addClapFeature = (feature) => {
    var lonLatArr = getLonLatArray(feature.geometry.points);
    let temp = viewer.entities.add({
      id: 'identify-area',
      name: '单体化标识面',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
        material: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
        classificationType: Cesium.ClassificationType.S3M_TILE, // 贴在S3M模型表面
      },
    });
    entities.push(temp);
  };
  // 得到[经度,纬度,经度,纬度...]形式的数组，用于构造面。
  const getLonLatArray = (points) => {
    var point3D = [];
    points.forEach(function (point) {
      point3D.push(point.x);
      point3D.push(point.y);
    });
    return point3D;
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
      if (open.value) {
        position();
      }
    },
    {
      deep: true,
    },
  );
</script>
