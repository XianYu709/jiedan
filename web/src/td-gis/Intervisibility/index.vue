<template>
  <slot name="addViewPoint" :event="addViewPoint">
    <Button @click="addViewPoint" type="primary">添加观察点</Button>
  </slot>
  <slot name="addTargetPoint" :event="addTargetPoint">
    <Button @click="addTargetPoint" type="primary" danger class="ml-3">添加目标点</Button>
  </slot>

  <slot name="clear" :event="clear">
    <Button @click="clear" class="ml-3">清除</Button>
  </slot>
</template>
<script setup>
  import { onMounted, ref, reactive, onBeforeUnmount } from 'vue';
  import { Button } from 'ant-design-vue';

  let entities = [];

  const state = reactive({
    addViewFlag: false,
    addTargetFlag: false,
    num: 0,
    couldRemove: false,
  });
  const sightLine = ref();
  const handlerPoint = ref();
  const handler = ref();

  const addViewPoint = () => {
    clear();
    sightLine.value = new Cesium.Sightline(viewer.scene);
    sightLine.value.build();
    handlerPoint.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    let temp = handlerPoint.value.drawEvt.addEventListener(function (result) {
      //添加观察点
      if (state.addViewFlag) {
        var point = result.object;
        // point.show = false;
        var position = result.object.position;

        //将获取的点的位置转化成经纬度
        var cartographic = Cartesian2toDegrees(position);
        //设置观察点
        sightLine.value.viewPosition = cartographic;
        state.addViewFlag = false;
      }
      handlerPoint.value.deactivate();
    });
    entities.push(temp);

    handler.value = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.value.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.value.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    state.addViewFlag = true;
    if (handlerPoint.value.active) {
      return;
    }
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    if (state.couldRemove) {
      sightLine.value.removeAllTargetPoint();
    }
    handlerPoint.value.activate();

    if (state.addViewFlag || state.addTargetFlag) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
    }
  };
  let targetPoints = [];

  const addTargetPoint = () => {
    let targetPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    targetPoint.activate();
    targetPoints.push(targetPoint);
    state.addViewFlag = false;
    state.addTargetFlag = true;
    if (state.addViewFlag || state.addTargetFlag) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
    }
    //鼠标点击事件，添加点
    handler.value.setInputAction(function (e) {
      var position = viewer.scene.pickPosition(e.position);
      addTarget(position);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标移动事件，更新点
    handler.value.setInputAction(function (evt) {
      //鼠标移动，更新最后一次添加的目标点的位置
      var position = viewer.scene.pickPosition(evt.endPosition);

      if (state.num > 0) {
        sightLine.value.removeTargetPoint('point0');

        var cartographic = Cartesian2toDegrees(position);

        var flag = sightLine.value.addTargetPoint({
          position: cartographic,
          name: 'point0',
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //鼠标右键事件，结束
    handler.value.setInputAction(function () {
      viewer.enableCursorStyle = true;
      handler.value.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.value.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };
  const Cartesian2toDegrees = (position) => {
    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height;

    return [longitude, latitude, height];
  };
  const addTarget = (CartesianPosition) => {
    let targetPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
    targetPoint.activate();
    targetPoints.push(targetPoint);
    if (state.addViewFlag === false && state.addTargetFlag) {
      state.num += 1;
      //将获取的点的位置转化成经纬度
      var cartographic = Cartesian2toDegrees(CartesianPosition);
      //添加目标点
      var name = 'point' + state.num;
      var flag = sightLine.value.addTargetPoint({
        position: cartographic,
        name: name,
      });
      state.couldRemove = true;
    }
  };
  const clear = () => {
    if (!handlerPoint.value) {
      return;
    }
    state.addViewFlag = false;
    state.addTargetFlag = false;
    handlerPoint.value.clear();
    targetPoints.forEach((item) => {
      item.clear();
    });
    state.num = 0;
    entities.forEach((item) => {
      viewer.entities.remove(item);
    });
    entities = [];
    if (state.couldRemove) {
      sightLine.value.removeAllTargetPoint();
      state.couldRemove = false;
    }
    viewer.enableCursorStyle = true;
  };

  onBeforeUnmount(() => {
    clear();
  });
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
