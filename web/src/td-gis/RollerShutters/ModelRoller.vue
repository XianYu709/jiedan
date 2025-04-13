<template>
  <div class="flex flex-col">
    <Space class="" align="start" direction="horizontal">
      <slot name="startRoller" :event="startRoller">
        <Button type="primary" :danger="isRoller" @click="startRoller">{{
          isRoller ? '关闭' : '开启'
        }}</Button>
      </slot>
      <slot name="rollerMode">
        <RadioGroup
          v-model:value="rollerMode"
          button-style="solid"
          @change="azimuthHandler($event.target.value)"
        >
          <RadioButton value="left-roller">屏蔽左侧</RadioButton>
          <RadioButton value="right-roller">屏蔽右侧</RadioButton>
          <RadioButton value="top-roller">屏蔽上侧</RadioButton>
          <RadioButton value="bottom-roller">屏蔽下侧</RadioButton>
        </RadioGroup>
      </slot>
    </Space>
    <List class="mt-4 bg-white overflow-y-auto h-60" size="small" bordered :data-source="layerList">
      <template #renderItem="{ item }">
        <ListItem
          ><Checkbox v-model:checked="item.checked" @change="layersParticipate">{{
            item.name
          }}</Checkbox></ListItem
        >
      </template>
      <template #header>
        <div>参与卷帘的图层</div>
      </template>
    </List>

  </div>
  <RollerLine ref="lineRef" :position="isRoller ? getPosition : 'none'" />
</template>

<script setup>
  import { ref, onMounted, onBeforeMount, computed, nextTick } from 'vue';
  import { Button, RadioGroup, RadioButton, Space, List, Checkbox } from 'ant-design-vue';
  import emitter from '../hooks/useMitt';

  import RollerLine from './RollerLine.vue';
  const ListItem = List.Item;
  const lineRef = ref(null);
  const isRoller = ref(false);
  const rollerMode = ref('left-roller');
  let scene;
  let rollerShutterConfig;

  const layerList = ref([]);
  let scratchSwipeRegion;
  const emit = defineEmits(['lineMode', 'isRoller']);

  const getPosition = computed(() => {
    if (rollerMode.value == 'left-roller' || rollerMode.value == 'right-roller') {
      return 'vertical';
    } else if (rollerMode.value == 'top-roller' || rollerMode.value == 'bottom-roller') {
      return 'horizontal';
    }
  });

  onMounted(() => {
    init();
  });

  // 初始化卷帘
  const init = () => {
    rollerShutterConfig = {
      // 卷帘配置参数，以对象方式实现地址传递
      startX: 0.5,
      startY: 0.5,
      endX: 0.5,
      endY: 0.5,
      index: 0.66,
      mode: 1,
    };
    scene = viewer.scene;
    scratchSwipeRegion = new Cesium.BoundingRectangle(0, 0, 1, 1);

    layerList.value = scene.layers.layerQueue.map((el, i) => {
      return {
        name: el.name,
        checked: true,
        id: i,
      };
    });


  };

  const startRoller = () => {
    isRoller.value = !isRoller.value;
    emit('isRoller', isRoller.value);
    if (isRoller.value) {
      azimuthHandler(rollerMode.value);
      setRollerShutterSplit(scene, rollerShutterConfig);
    } else {
      rollerShutterConfig.mode = -1;
      setRollerShutterSplit(scene, rollerShutterConfig);
      rollerShutterConfig.mode = 1;
    }
  };

  const layersParticipate = () => {
    setRollerShutterSplit(scene, rollerShutterConfig);
  };


  // 模型卷帘上下左右方位改变
  const azimuthHandler = (value) => {
    console.log(value);
    emit('lineMode', value);
    if (isRoller.value) {
      nextTick(() => {
        bindSliderEvt(viewer, rollerShutterConfig);
      });
      switch (value) {
        case 'left-roller':
          rollerShutterConfig.mode = 1;
          break;
        case 'right-roller':
          rollerShutterConfig.mode = 2;
          break;
        case 'top-roller':
          rollerShutterConfig.mode = 8;
          break;
        case 'bottom-roller':
          rollerShutterConfig.mode = 4;
          break;
        default:
          rollerShutterConfig.mode = -1;
          break;
      }
      setRollerShutterSplit(scene, rollerShutterConfig);
    }
  };

  // 卷帘函数
  const setRollerShutterSplit = (scene, rollerShutterConfig) => {
    let startX = rollerShutterConfig.startX;
    let startY = rollerShutterConfig.startY;
    let endX = rollerShutterConfig.endX;
    let endY = rollerShutterConfig.endY;
    let scratchSwipeRegions = scratchSwipeRegion;

    let mode = rollerShutterConfig.mode;
    // 左右卷帘使用left slider滑动，上下卷帘使用top slider滑动
    // 1:屏蔽左边 2：屏蔽右边 4：屏蔽下边 8：屏蔽上边 15：自定义卷帘
    switch (mode) {
      case 1:
        Cesium.BoundingRectangle.unpack([startX, 0, 1, 1], 0, scratchSwipeRegions);
        break;
      case 2:
        Cesium.BoundingRectangle.unpack([0, 0, startX, 1], 0, scratchSwipeRegions);
        break;
      case 4:
        Cesium.BoundingRectangle.unpack([0, 0, 1, startY], 0, scratchSwipeRegions);
        break;
      case 8:
        Cesium.BoundingRectangle.unpack([0, startY, 1, 1], 0, scratchSwipeRegions);
        break;
      default:
        Cesium.BoundingRectangle.unpack([0, 0, 1, 1], 0, scratchSwipeRegions);
        break;
    }

    // 参与卷帘的图层
    let s3mLayer = scene.layers.layerQueue;

    // 选中图层 - 展示
    for (let i = 0, j = s3mLayer.length; i < j; i++) {
      if (isRoller.value && layerList.value[i].checked) {
        s3mLayer[i].swipeEnabled = true;
        s3mLayer[i].swipeRegion = scratchSwipeRegion;
      } else {
        s3mLayer[i].swipeEnabled = false;
      }
    }


  };

  // 分割线函数
  const bindSliderEvt = (viewer, rollerShutterConfig) => {
    let verticalSlider; // 垂直分割条
    let horizontalSlider; // 水平分割条
    verticalSlider = horizontalSlider = lineRef.value.line;
    verticalSlider.addEventListener('mousedown', mouseDown, false);
    horizontalSlider.addEventListener('mousedown', mouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
    function mouseUp(e) {
      document.removeEventListener('mousemove', sliderMove, false);
    }
    function mouseDown(e) {
      document.addEventListener('mousemove', sliderMove, false);
    }

    function sliderMove(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      if (rollerShutterConfig.mode == 1 || rollerShutterConfig.mode == 2) {
        verticalSlider.style.left = e.clientX + 'px';
        rollerShutterConfig.startX = e.clientX / document.body.clientWidth;
      } else {
        horizontalSlider.style.top = e.clientY + 'px';
        rollerShutterConfig.startY = e.clientY / document.body.clientHeight;
      }
      setRollerShutterSplit(scene, rollerShutterConfig);
    }
  };

  const clear = () => {
    isRoller.value = false;
    emit('isRoller', isRoller.value);
    rollerShutterConfig.mode = -1;
    setRollerShutterSplit(scene, rollerShutterConfig);
    rollerShutterConfig.mode = 1;
  };

  defineExpose({
    clear,
  });
</script>
