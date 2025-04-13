<template>
  <div class="pt-3">
    <span @click="starting">
      <slot name="starting">
        <Button type="primary">起点</Button>
      </slot>
    </span>
    <span class="ml-3">{{ startingList.x }}&nbsp;,&nbsp; {{ startingList.y }}</span>

    <div class="pt-3" v-for="item in midList" :key="item.id">
      <span @click="mid(item)">
        <slot name="mid">
          <Button type="dashed">中点</Button>
        </slot>
      </span>
      <span class="ml-3">{{ item.x }}&nbsp;,&nbsp;{{ item.y }}</span>

      <span @click="midClear(item)">
        <slot name="starting">
          <Button type="primary" danger class="mt-3 ml-3" size="small"> 删除 </Button>
        </slot>
      </span>
    </div>
    <div>
      <Tooltip placement="top">
        <template #title>
          <span>添加中点</span>
        </template>
        <span @click="addMidpoint">
          <slot name="addMidpoint">
            <Button shape="circle" size="middle" class="ml-4 mt-3" type="dashed">
              <template #icon>
                <PlusOutlined />
              </template>
            </Button>
          </slot>
        </span>
      </Tooltip>
    </div>
    <div class="pt-3">
      <span @click="end">
        <slot name="end">
          <Button type="primary" danger>终点</Button>
        </slot>
      </span>

      <span class="ml-3">{{ endList.x }}&nbsp;,&nbsp;{{ endList.y }}</span>
    </div>
    <span @click="Start">
      <slot name="Start">
        <Button type="primary" class="mt-3">开始分析</Button>
      </slot>
    </span>
    <span @click="clear">
      <slot name="clear">
        <Button type="primary" danger class="mt-3 ml-3">清除</Button>
      </slot>
    </span>
  </div>
</template>
<script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue';
  import { Button, Tooltip } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import passImage from '../images/pass.png';
  import startingImg from '../images/starting.png';
  import endImg from '../images/end.png';
  import axios from 'axios';

  const props = defineProps({
    open: { type: Boolean, default: false },
    serviceUrl: {
      type: String,
      default:
        'http://192.168.65.120:4090/iserver/services/transportationAnalyst-twin-city/rest/networkanalyst/%E8%B7%AF%E7%BD%91@data/path.json',
    },
  });
  const startingList = ref({
    x: 0,
    y: 0,
    z: 0,
  });
  const endList = ref({
    x: 0,
    y: 0,
    z: 0,
  });
  const midList = ref([]);
  const midHandlerPoint = ref<any>([]);
  const midClear = (item) => {
    viewer.entities.removeById(item.id);
    midHandlerPoint.value[item.id] && midHandlerPoint.value[item.id].deactivate();
    midHandlerPoint.value[item.id] && midHandlerPoint.value[item.id].clear();
    midList.value.splice(midpointLists.value.indexOf(item.id), 1);
    midpointList.value.splice(midpointLists.value.indexOf(item.id), 1);
    midpointLists.value.splice(midpointLists.value.indexOf(item.id), 1);
  };

  let entities = [];

  const mid = (item) => {
    if (midList.value[item.id].x != 0) {
      viewer.entities.removeById(item.id);
      midHandlerPoint.value[item.id].deactivate();
      midHandlerPoint.value[item.id].clear();
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
      var line = result.object;
      var scarToGraphic = Cesium.Cartographic.fromCartesian(line._position);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      let temp = viewer.entities.add({
        id: item.id,
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          parseFloat(height + 1),
        ),
        billboard: {
          image: passImage,
          width: 50,
          height: 50,
        },
      });
      entities.push(temp);

      midList.value.map((val) => {
        if (item.id == val.id) {
          val.x = Number(lng);
          val.y = Number(lat);
          val.z = Number(height);
        }
      });
    });
    midHandlerPoint.value[item.id].activate();
  };
  const startingHandlerPoint = ref();
  const starting = () => {
    if (startingHandlerPoint.value) {
      viewer.entities.removeById('starting');
      startingHandlerPoint.value.deactivate();
      startingHandlerPoint.value.clear();
    }
    startingHandlerPoint.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    startingHandlerPoint.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    startingHandlerPoint.value.movingEvt.addEventListener(function (windowPosition) {});
    startingHandlerPoint.value.drawEvt.addEventListener(function (result) {
      result.object._position.x = Number(result.object._position.x);
      result.object._position.y = Number(result.object._position.y);
      result.object._position.z = Number(result.object._position.z);
      var line = result.object;
      var scarToGraphic = Cesium.Cartographic.fromCartesian(line._position);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      let temp = viewer.entities.add({
        id: 'starting',
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          parseFloat(height + 1),
        ),
        billboard: {
          image: startingImg,
          width: 50,
          height: 50,
        },
      });
      entities.push(temp);

      startingList.value.x = Number(lng);
      startingList.value.y = Number(lat);
      startingList.value.z = Number(height);
    });
    startingHandlerPoint.value.activate();
  };
  const endHandlerPoint = ref();
  const end = () => {
    if (endHandlerPoint.value) {
      viewer.entities.removeById('end');
      endHandlerPoint.value.deactivate();
      endHandlerPoint.value.clear();
    }
    endHandlerPoint.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    endHandlerPoint.value.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    endHandlerPoint.value.movingEvt.addEventListener(function (windowPosition) {});
    endHandlerPoint.value.drawEvt.addEventListener(function (result) {
      result.object._position.x = Number(result.object._position.x);
      result.object._position.y = Number(result.object._position.y);
      result.object._position.z = Number(result.object._position.z);
      var line = result.object;
      var scarToGraphic = Cesium.Cartographic.fromCartesian(line._position);
      const lat = Cesium.Math.toDegrees(scarToGraphic.latitude);
      const lng = Cesium.Math.toDegrees(scarToGraphic.longitude);
      const height = scarToGraphic.height;
      let temp = viewer.entities.add({
        id: 'end',
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          parseFloat(height + 1),
        ),
        billboard: {
          image: endImg,
          width: 50,
          height: 50,
        },
      });
      entities.push(temp);

      endList.value.x = Number(lng);
      endList.value.y = Number(lat);
      endList.value.z = Number(height);
    });
    endHandlerPoint.value.activate();
  };
  const Start = () => {
    let hasLeastEdgeCount = false;
    let parameter = {
      resultSetting: {
        returnEdgeIDs: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true,
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
      },
      weightFieldName: 'SmLength',
    };

    let nodes = [{ x: startingList.value.x, y: startingList.value.y }];
    midList.value.map((el) => {
      nodes.push({ x: el.x, y: el.y });
    });
    nodes.push({ x: endList.value.x, y: endList.value.y });
    axios({
      url: `${props.serviceUrl}?hasLeastEdgeCount=${hasLeastEdgeCount}&parameter=${JSON.stringify(
        parameter,
      )}&nodes=${JSON.stringify(nodes)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      method: 'GET',
    }).then(function (data) {
      let path = [];
      data.data.pathList[0].route.points.map((el) => {
        path.push(Number(el.x), Number(el.y));
      });
      let cartesian3s = Cesium.Cartesian3.fromDegreesArray(path);
      let temp = viewer.entities.add({
        name: 'Red line on the surface',
        polyline: {
          positions: cartesian3s,
          width: 3,
          material: Cesium.Color.GREEN,
          zIndex: 999,
          clampToGround: true,
        },
      });
      entities.push(temp);
    });
  };
  const midpointList = ref<any>([]);
  const clear = () => {
    startingList.value = { x: 0, y: 0, z: 0 };
    endList.value = { x: 0, y: 0, z: 0 };
    midpointList.value = [];
    startingHandlerPoint.value && startingHandlerPoint.value.deactivate();
    startingHandlerPoint.value && startingHandlerPoint.value.clear();
    endHandlerPoint.value && endHandlerPoint.value.deactivate();
    endHandlerPoint.value && endHandlerPoint.value.clear();
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    midList.value.map((item) => {
      midHandlerPoint.value[item.id] && midHandlerPoint.value[item.id].deactivate();
      midHandlerPoint.value[item.id] && midHandlerPoint.value[item.id].clear();
    });
    midList.value = [];
  };
  const midpointLists = ref([]);
  const addMidpoint = () => {
    midpointList.value.push({
      id: midpointList.value.length || 0,
    });
    midList.value.push({
      id: midList.value.length || 0,
      x: 0,
      y: 0,
      z: 0,
    });
    midpointLists.value.push(midpointLists.value.length || 0);
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
<style lang="less" scoped></style>
