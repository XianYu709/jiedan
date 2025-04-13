<template>
  <div>
    <slot>
      <InputNumber
        v-model:value="inputHeight"
        placeholder="输入高度"
        allow-clear
        class="mb-3"
        addon-after="米"
      />
    </slot>
  </div>
  <div class="flex items-center justify-between">
    <slot name="type">
      <RadioGroup v-model:value="type" button-style="solid" @change="changeHandler">
        <RadioButton :value="0">绘制</RadioButton>
        <Upload
          :showUploadList="false"
          :max-count="1"
          v-model:file-list="fileList"
          :customRequest="customUpload"
        >
          <RadioButton :value="1" @click.stop="type = 1"> 上传 </RadioButton>
        </Upload>
      </RadioGroup>
    </slot>
    <div class="flex items-center justify-end self-start">
      <div @click="backLineAnalysis(type)">
        <slot name="backLineAnalysis">
          <Button v-if="type == 0" type="primary">分析</Button>
        </slot>
      </div>
      <div @click="clear(true)">
        <slot name="clear">
          <Button class="ml-2">重置</Button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, reactive, watch } from 'vue';
  import axios from 'axios';
  import { useCamera } from '../hooks/index';
  import {
    Button,
    List,
    RadioGroup,
    RadioButton,
    Upload,
    message,
    InputNumber,
  } from 'ant-design-vue';
  import * as shapefile from 'shapefile';
  import getHeightByType from '../utils/getHeightByType';

  const ListItem = List.Item;

  const props = defineProps({
    analyticalData: { type: Number, default: 9 },
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/spatialAnalysis-twin-city/restjsr/spatialanalyst/geometry/3d/buffer.json',
    },
    height: {
      type: Number,
      default: 10,
    },
    layer: {
      type: String,
      required: true,
    },
  });

  let entities = [];
  const inputHeight = ref(props.height);

  watch(
    () => props.height,
    (val) => {
      inputHeight.value = val;
    },
    { immediate: true },
  );

  const type = ref(0);
  const fileList = ref([]);
  const toolTip = ref();
  const analysisRecords = ref();
  var records = ref([]);
  const isShowRecords = ref(false);

  var scene, handlerLine;
  scene = viewer.scene;

  onMounted(() => {
    init();
  });

  const init = () => {
    handlerLine = handlerLine
      ? handlerLine
      : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line, Cesium.ClampMode.S3mModel);
    handlerLine && handlerLine.activate();
    handlerLine.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
  };

  const changeHandler = () => {
    switch (type.value) {
      case 0:
        clear();
        init();
        break;
      case 1:
        break;

      default:
        break;
    }
  };

  let uploadPoints = [];
  const customUpload = ({ file }) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = function () {
      let geojsonArr = [];
      shapefile
        .open(this.result)
        .then((source) => {
          source.read().then(function log(result) {
            if (result.done) {
              geojsonArr.forEach((item) => {
                var cartesian1 = Cesium.Cartesian3.fromDegrees(
                  item.geometry.coordinates[0][0],
                  item.geometry.coordinates[0][1],
                );

                getHeightByType([cartesian1], 'terrain').then((res) => {
                  cartesian1 = Cesium.Cartesian3.fromDegrees(
                    item.geometry.coordinates[0][0],
                    item.geometry.coordinates[0][1],
                    res[0],
                  );
                  uploadPoints.push(cartesian1);
                });

                var cartesian2 = Cesium.Cartesian3.fromDegrees(
                  item.geometry.coordinates[1][0],
                  item.geometry.coordinates[1][1],
                );

                getHeightByType([cartesian2], 'terrain').then((res) => {
                  cartesian2 = Cesium.Cartesian3.fromDegrees(
                    item.geometry.coordinates[1][0],
                    item.geometry.coordinates[1][1],
                    res[0],
                  );
                  uploadPoints.push(cartesian2);
                  backLineAnalysis(1);
                  uploadPoints = [];
                });
              });
              return;
            }

            const json = result.value;
            geojsonArr.push(json);
            return source.read().then(log);
          });
        })
        .catch((error) => {
          console.error(error.stack);
          message.error('读取shp文件失败');
        });
    };
  };

  const backLineAnalysis = (type) => {
    if (type == 0) blackLine(handlerLine.positions);
    if (type == 1) blackLine(uploadPoints, true);
  };

  let msg = null;

  const blackLine = (param, flag = false) => {
    if (flag) {
      getHeightByType([param[0]], 'terrain').then((res) => {
        let cartographic = Cesium.Cartographic.fromCartesian(param[0]);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, res[0] + inputHeight.value + 50),
          orientation: {
            heading: 2.205646,
            pitch: -0.399956,
            roll: 0.0,
          },
        });
      });
    }

    let pointsArr = pointsToDegreesObj(param);
    let paramForm = {
      geometry: {
        type: 'LINE3D',
        parts: null,
        points: null,
      },
      distance: 1,
      lonlat: true,
      resultType: 'REGION',
      joinType: 'ROUND',
    };
    paramForm.geometry.parts = [pointsArr.length];
    paramForm.geometry.points = pointsArr;

    axios({
      url: props.serviceUrl,
      async: true,
      data: JSON.stringify(paramForm),
      method: 'POST',
    }).then((data) => {
      axios({
        url: data.data.newResourceLocation + '.json',
        async: true,
        method: 'GET',
      }).then(({ data }) => {
        var point3Ds = new Cesium.Point3Ds();
        var points = new Array();
        for (var i = 0; i < data.geometry.points.length; i++) {
          points.push(data.geometry.points[i].x);
          points.push(data.geometry.points[i].y);
          points.push(data.geometry.points[i].z);
        }
        var orangePolygon1 = viewer.entities.add({
          name: 'Orange polygon with per-position heights and outline',
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(points),
            extrudedHeight: 200,
            perPositionHeight: true,
            material: Cesium.Color.ORANGE.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 10.0,
          },
        });
        entities.push(orangePolygon1);

        var datasetSpatialQuery3DPostParameter = {
          operateRegion: {
            type: 'REGION',
            points: data.geometry.points,
          },
          positionMode: 'INTERSECTSORCONTAINS',
          extendedHeight: inputHeight.value,
          sourceDatasetFilter: {
            attributeFilter: '',
          },
        };
        var queryUrl =
          'http://192.168.65.120:4090/iserver/services/spatialAnalysis-twin-city/restjsr/spatialanalyst/datasets/%E6%88%BF%E5%B1%8B%40build/spatialquery3d.json';
        axios({
          url: queryUrl,
          async: true,
          data: JSON.stringify(datasetSpatialQuery3DPostParameter),
          method: 'POST',
        }).then(({ data }) => {
          axios({
            url: data.newResourceLocation + '.json',
            async: true,
            method: 'GET',
          }).then(({ data }) => {
            var layer = scene.layers.find(props.layer);
            var color = new Cesium.Color(160 / 255, 0, 0, 1);
            layer.setObjsColor(data.ids, color);

            if (!msg) {
              msg = message.info({
                content: () => `退线不足${inputHeight.value}米`,
                duration: 0,
                onClick: () => {
                  msg();
                  msg = null;
                },
              });
            }

            var orangePolygon1 = viewer.entities.add({
              name: 'Orange polygon with per-position heights and outline',
              polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(toArray(param)),
                extrudedHeight: 0,
                perPositionHeight: true,
                material: Cesium.Color.ORANGE.withAlpha(0.0),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 5.0,
              },
            });
            entities.push(orangePolygon1);
          });
        });
      });
    });
  };

  const pointsToDegreesObj = (points) => {
    return points.map((item) => {
      let degreesObj = {};
      let scarToGraphic = Cesium.Cartographic.fromCartesian(item);
      let lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      let lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      let height = scarToGraphic.height + inputHeight.value;
      degreesObj.x = Number(lng);
      degreesObj.y = Number(lat);
      degreesObj.z = Number(height);
      return degreesObj;
    });
  };

  const toArray = (points) => {
    let degreesArray = [];
    points.map((item) => {
      var scarToGraphic = Cesium.Cartographic.fromCartesian(item);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      degreesArray.push(Number(lng));
      degreesArray.push(Number(lat));
      degreesArray.push(Number(height));
    });
    return degreesArray;
  };

  const clear = (flag = false) => {
    handlerLine && handlerLine.clear();
    handlerLine && handlerLine.deactivate();
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    uploadPoints = [];
    fileList.value = [];
    flag && type.value == 0 ? init() : '';
    msg ? msg() : '';
    msg = null;
  };

  defineExpose({
    clear,
  });
</script>
