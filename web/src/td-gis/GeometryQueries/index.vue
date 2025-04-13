<template>
  <Space class="flex justify-between items-center pt-3">
    <slot name="inquireMode">
      <RadioGroup
        v-model:value="inquireMode"
        button-style="solid"
        @change="changeModeHandler(inquireMode)"
      >
        <RadioButton value="buffer">缓冲区查询</RadioButton>
        <RadioButton value="polygon">多边形查询</RadioButton>
        <RadioButton value="cable">拉线查询</RadioButton>
      </RadioGroup>
    </slot>

    <div>
      <slot name="clear" :event="clear">
        <Button type="primary" @click="clear">清空</Button>
      </slot>
      <slot name="Confirm" :event="Confirm">
        <Button class="ml-3" type="primary" @click="Confirm">查询</Button>
      </slot>
    </div>
  </Space>
  <Form class="mt-3 w-full -mb-5" v-show="inquireMode == 'buffer'">
    <slot name="radius">
      <FormItem label="查询半径：">
        <InputNumber
          :keyboard="true"
          id="inputNumber"
          style="width: 250px"
          v-model:value="radius"
          :min="0"
        />
      </FormItem>
    </slot>
  </Form>
</template>
<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import * as turf from '@turf/turf';
  import {
    Button,
    RadioGroup,
    RadioButton,
    Space,
    Select,
    InputNumber,
    Form,
    message,
  } from 'ant-design-vue';
  import midImage from '../images/path.png';
  import axios from 'axios';
  import getHeightByType from '../utils/getHeightByType';
  import { isatty } from 'tty';

  const FormItem = Form.Item;
  const props = defineProps({
    open: { type: Boolean, default: false },
    coord: {},
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/featureResults.json',
    },
    layersParticipate: {
      type: Array,
      default: ['Combine'],
    },
    inquireMode: {
      type: String,
    },
    radius: {
      type: Number,
      default: 40,
    },
  });
  const inquireMode = ref();
  const radius = ref(props.radius);
  const result = ref(false);
  const open = ref<Boolean>(false);
  const layersParticipate = ref(props.layersParticipate);
  const emits = defineEmits(['update:open']);
  const layerList = ref([]);

  let entities = [];
  onMounted(() => {
    layerList.value = viewer.scene.layers.layerQueue.map((el, i) => {
      return {
        label: el.name,
        disabled: false,
        value: el.name,
      };
    });
  });

  var handlerPoint, handlerLine, handlerPolygon, handlerCircle, bufferLine;
  var bufferClickHandler;

  const changeModeHandler = (value) => {
    console.log('fucl', value);

    switch (value) {
      case 'cable':
        clear();
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
        break;
      case 'polygon':
        clear();
        handlerPolygon = handlerPolygon
          ? handlerPolygon
          : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        handlerPolygon && handlerPolygon.activate();
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
          } else {
            viewer.enableCursorStyle = true;
          }
        });
        break;
      case 'buffer':
        clear();
        handlerPoint = handlerPoint
          ? handlerPoint
          : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
        bufferLine = bufferLine ? bufferLine : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        bufferLine.activate();
        handlerPoint.activate();

        bufferClick();
        break;
      default:
        break;
    }
  };

  const points = ref([]);
  const type = ref('point');

  const bufferClick = () => {
    bufferClickHandler = bufferClickHandler
      ? bufferClickHandler
      : new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    bufferClickHandler.setInputAction((event) => {
      type.value = 'line';
      if (result.value) return;
      let ray = viewer.camera.getPickRay(event.position);
      let pick = viewer.scene.globe.pick(ray, viewer.scene);
      points.value.push(pick);
      console.log(points.value);

      if (points.value.length == 1) {
        type.value = 'point';
      } else {
        handlerPoint.clear();
        handlerPoint.deactivate();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  const buffer = () => {
    if (points.value.length == 0) return;
    if (type.value == 'point') {
      var scarToGraphic = Cesium.Cartographic.fromCartesian(points.value[0]);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = Cesium.Math.toDegrees(scarToGraphic.height);

      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      return [];

      let buff = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        name: '圆形',
        ellipse: {
          semiMinorAxis: radius.value,
          semiMajorAxis: radius.value,
          material: Cesium.Color.ORANGE.withAlpha(0.3),
          outline: true,
        },
      });

      let circle = turf.circle([lng, lat], radius.value, { units: 'meters' });
      getData({ points: circle.geometry.coordinates[0] });
    } else {
      let polylineF = turf.lineString(pointsToDegreesArray(points.value));
      let buffered = turf.buffer(polylineF, radius.value, { units: 'meters' });
      let coordinates = buffered.geometry.coordinates;
      points.value = coordinates[0];
      addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(toArray(points.value)));

      getData({ points: points.value });
    }
  };

  const Confirm = () => {
    switch (inquireMode.value) {
      case 'cable':
        if (handlerLine.positions.length < 3) {
          message.info('至少选择三个点');
          return;
        }
        getData({ points: pointsToDegreesArray(handlerLine.positions) });
        break;
      case 'polygon':
        getData({ points: pointsToDegreesArray(handlerPolygon.positions) });
        break;
      case 'buffer':
        buffer();

        break;
      default:
        break;
    }
  };
  const getData = (params) => {
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

    axios({
      url: props.serviceUrl + '?returnContent=true',
      async: true,
      data: JSON.stringify(paramForm),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    }).then((res) => {
      if (res.status != 201) return;

      if (res.data.features.length == 0) message.info('未查到数据');

      result.value = true;

      res.data.features.map((item) => {
        getHeightByType(
          [
            Cesium.Cartesian3.fromDegrees(
              parseFloat(Number(item.geometry.center.x)),
              parseFloat(Number(item.geometry.center.y)),
              parseFloat(0),
            ),
          ],
          'model',
        ).then((res) => {
          let position = Cesium.Cartesian3.fromDegrees(
            item.geometry.center.x,
            item.geometry.center.y,
            res[0] + 10,
          );
          let buff = viewer.entities.add({
            position: position,
            billboard: {
              image: midImage,
              eyeOffset: new Cesium.Cartesian3(0.0, -3.0, 0.0),
              scale: 2.0,
              width: 10,
              height: 14,
              scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000, 0.2),
            },
            label: {
              text: item.fieldValues[6],
              font: '16px HelVetica',
              fillColor: Cesium.Color.RED,
              scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000, 0.2),
            },
          });
          entities.push(buff);
        });
      });
    });
  };

  const toArray = (points) => {
    let degreesArray = [];
    points.map((item) => {
      degreesArray.push(item[0]);
      degreesArray.push(item[1]);
    });
    return degreesArray;
  };

  const pointsToDegreesArray = (points) => {
    return points.map((item) => {
      let degreesArray = [];
      var scarToGraphic = Cesium.Cartographic.fromCartesian(item);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      degreesArray.push(Number(lng), Number(lat));
      return degreesArray;
    });
  };

  const addBufferPolyogn = (positions) => {
    let buff = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positions),
        material: Cesium.Color.ORANGE.withAlpha(0.3),
        classificationType: Cesium.ClassificationType.BOTH,
      },
    });
    entities.push(buff);
  };

  const coord = ref();
  watch(
    () => props,
    () => {
      open.value = props.open;
      coord.value = props.coord;
    },
    { deep: true },
  );
  watch(
    () => props.inquireMode,
    () => {
      console.log(props.inquireMode);
      inquireMode.value = props.inquireMode ?? inquireMode.value;
      changeModeHandler(inquireMode.value);
    },
    { deep: true },
  );

  watch(
    () => props.radius,
    () => {
      radius.value = props.radius;
    },
    { deep: true, immediate: true },
  );

  const clear = (flag = false) => {
    result.value = false;
    points.value = [];
    handlerPoint && handlerPoint.clear();
    handlerPoint && flag && handlerPoint.deactivate();
    handlerPolygon && handlerPolygon.clear();
    handlerPolygon && flag && handlerPolygon.deactivate();
    handlerLine && handlerLine.clear();
    bufferLine && bufferLine.clear();
    handlerLine && flag && handlerLine.deactivate();
    bufferClickHandler && !bufferClickHandler.isDestroyed()
      ? (bufferClickHandler = bufferClickHandler.destroy())
      : null;
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    return [];
    if (flag) changeModeHandler(inquireMode.value);
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
