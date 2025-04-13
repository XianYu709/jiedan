<template>
  <div class="contents">
    <slot name="chooseSkyline" :event="chooseSkyline">
      <Button @click="chooseSkyline" type="primary">提取天际线</Button>
    </slot>

    <slot name="setLimitBody" :event="setLimitBody">
      <Button @click="setLimitBody" class="ml-3" type="primary" danger>绘制限高体</Button>
    </slot>

    <slot name="getSkylineArea" :event="getSkylineArea">
      <Button @click="getSkylineArea" class="ml-3">拉伸闭合体</Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>
  </div>
</template>
<script setup>
  import { ref, onBeforeUnmount } from 'vue';
  import { Button } from 'ant-design-vue';

  const skyline = ref();
  const polygonHandler = ref();
  var arr = [];
  let entities = [];

  const clear = () => {
    arr = [];
    if (skyline.value) {
      skyline.value.clear();
      skyline.value = undefined;
    }
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    if (polygonHandler.value) {
      polygonHandler.value.clear();
      polygonHandler.value = undefined;
    }
  };

  const chooseSkyline = () => {
    if (!skyline.value) skyline.value = new Cesium.Skyline(viewer.scene);
    var cartographic = viewer.scene.camera.positionCartographic;
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height;

    //天际线分析的视口位置设置成当前相机位置
    skyline.value.viewPosition = [longitude, latitude, height];
    //设置俯仰和方向
    skyline.value.pitch = Cesium.Math.toDegrees(viewer.scene.camera.pitch);
    skyline.value.direction = Cesium.Math.toDegrees(viewer.scene.camera.heading);
    skyline.value.radius = 10000; // 天际线分析半径设置为10000米
    skyline.value.build();
    if (polygonHandler.value) {
      entities.forEach((item) => {
        viewer.entities.remove(item);
      });
      entities = [];
      skyline.value.addLimitbody({
        position: arr,
        name: 'limitBody',
      });
    }
  };
  const setLimitBody = () => {
    if (!skyline.value) skyline.value = new Cesium.Skyline(viewer.scene);
    polygonHandler.value = polygonHandler.value
      ? polygonHandler.value
      : new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon);
    if (polygonHandler.value && polygonHandler.value.active) {
      return;
    } else {
      polygonHandler.value.drawEvt.addEventListener(function (result) {
        skyline.value.removeLimitbody('limitBody');
        var polygon = result.object;
        polygon.show = false;
        var pos = polygon.positions;
        var positions = [];
        // 遍历多边形，取出所有点
        for (var i = 0, len = pos.length; i < len; i++) {
          //转化为经纬度，并加入至临时数组
          var cartographic = Cesium.Cartographic.fromCartesian(pos[i]);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);

          positions.push([longitude, latitude]);
        }
        //去除重复点
        positions = unique(positions);
        //再次遍历转化为接口所需的数组格式
        for (var i = 0, len = positions.length; i < len; i++) {
          arr.push(positions[i][0]);
          arr.push(positions[i][1]);
        }
        //添加限高体对象
        skyline.value.addLimitbody({
          position: arr,
          name: 'limitBody',
        });
      });
      polygonHandler.value.activate();
    }
  };
  const getSkylineArea = () => {
    var cartographic = viewer.scene.camera.positionCartographic;
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height;
    var points = skyline.value.getSkyline3D();
    var pointArr = new Array();
    var cameraPoint = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    pointArr.push(cameraPoint);
    for (var i = 0; i < points.x.length; i++) {
      var point = Cesium.Cartesian3.fromDegrees(points.x[i], points.y[i], points.z[i]);
      pointArr.push(point);
    }
    let temp = viewer.entities.add({
      polygon: {
        extrudedHeight: 30,
        hierarchy: pointArr,
        perPositionHeight: true,
        material: Cesium.Color.ORANGE.withAlpha(1.0),
      },
    });
    entities.push(temp);
  };
  const unique = (arr) => {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  };

  onBeforeUnmount(() => {
    clear();
  });
</script>
