<template>
  <div>
    <div
      v-show="isShowUp == 'HORIZONTAL' || isShowUp == 'TRIPLE' || isShowUp == 'QUAD'"
      class="split-up"
    ></div>
    <div v-show="isShowBottom == 'HORIZONTAL' || isShowBottom == 'QUAD'" class="split-bottom"></div>
    <div
      v-show="isShowLeft == 'VERTICAL' || isShowLeft == 'TRIPLE' || isShowLeft == 'QUAD'"
      class="split-left"
    ></div>
    <div
      v-show="isShowRight == 'VERTICAL' || isShowLeft == 'TRIPLE' || isShowLeft == 'QUAD'"
      class="split-right"
    ></div>
    <div
      v-show="
        isShowVerticalTrisectionLeft == 'VerticalTrisection' ||
        isShowVerticalTrisectionLeft == 'Trisection'
      "
      class="split-vertical-trisection-left"
      style="display: none"
    ></div>
    <div
      v-show="isShowVerticalTrisectionRight == 'VerticalTrisection'"
      class="split-vertical-trisection-right"
      style="display: none"
    ></div>

    <Dialog v-model:open="open" @cancel="handleCancel">
      <template v-slot:title>
        <div class="flex">
          <div
            v-for="item in titles"
            :key="item.id"
            @click="selected(item.id)"
            class="pr-4"
            :class="item.active ? 'active_title' : 'title'"
          >
            {{ item.title }}
          </div>
        </div>
      </template>
      <div class="pt-3">
        <ImageRoller ref="imageRollerRef" v-if="titles[0].active"></ImageRoller>
        <ModelRoller ref="modelRollerRef" v-else-if="titles[1].active"></ModelRoller>
        <MultiScreen
          ref="multiScreenRef"
          v-else
          @dividingLineMode="dividingLineHandle"
        ></MultiScreen>
      </div>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from './Dialog.vue';
  import { MultiScreen, ImageRoller, ModelRoller, RollerLine } from 'td-gis';
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const isShowUp = ref(false);
  const isShowBottom = ref(false);
  const isShowLeft = ref(false);
  const isShowRight = ref(false);
  const isShowVerticalTrisectionLeft = ref(false);
  const isShowVerticalTrisectionRight = ref(false);

  const imageRollerRef = ref<InstanceType<typeof ImageRoller>>();
  const modelRollerRef = ref<InstanceType<typeof ImageRoller>>();
  const multiScreenRef = ref<InstanceType<typeof ImageRoller>>();
  const titles = ref([
    {
      id: 1,
      title: '影像卷帘',
      active: true,
    },
    {
      id: 2,
      title: '模型卷帘',
      active: false,
    },
    {
      id: 3,
      title: '多屏对比',
      active: false,
    },
  ]);
  const selected = (id) => {
    titles.value.map((el) => {
      clearHandler();
      el.active = false;
      if (el.id == id) {
        el.active = true;
      }
    });
  };

  // 分割线函数
  const dividingLineHandle = (value) => {
    isShowUp.value = value;
    isShowBottom.value = value;
    isShowLeft.value = value;
    isShowRight.value = value;
    isShowVerticalTrisectionLeft.value = value;
    isShowVerticalTrisectionRight.value = value;
  };

  const clearHandler = () => {
    imageRollerRef.value?.clear();
    modelRollerRef.value?.clear();
    multiScreenRef.value?.clear();
  };

  const open = ref<Boolean>(false);
  const emits = defineEmits(['update:open']);
  const handleCancel = () => {
    clearHandler();
    open.value = false;
    emits('update:open', false);
  };

  watch(
    () => props,
    () => {
      open.value = props.open;
      if (!open.value) {
        clearHandler();
      }
    },
    { deep: true },
  );
</script>
<style lang="less" scoped>
  .title {
    color: #3b3b3b;
    cursor: pointer;
  }

  .title :hover {
    color: #40a9ff;
  }

  .active_title {
    color: #40a9ff;
    cursor: pointer;
  }

  // 分割线
  .split-up {
    position: absolute;
    bottom: 50%;
    left: 50%;
    width: 2px;
    height: 50%;
    transform: translate(-50%, 0);
    background-color: white;
  }

  .split-bottom {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 50%;
    transform: translate(-50%, 0);
    background-color: white;
  }

  .split-left {
    position: absolute;
    right: 50%;
    bottom: 50%;
    width: 50%;
    height: 2px;
    transform: translate(0, -50%);
    background-color: white;
  }

  .split-right {
    position: absolute;
    bottom: 50%;
    left: 50%;
    width: 50%;
    height: 2px;
    transform: translate(0, -50%);
    background-color: white;
  }

  .split-vertical-trisection-left {
    position: absolute;
    top: 0;
    left: 33.33%;
    width: 2px;
    height: 100%;
    background-color: white;
  }

  .split-vertical-trisection-right {
    position: absolute;
    top: 0;
    right: 33.33%;
    width: 2px;
    height: 100%;
    background-color: white;
  }

  .vertical-slider-image {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 50%;
    width: 5px;
    height: 100vh;
    background-color: #d3d3d3;
  }

  .horizontal-slider-image {
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 0;
    width: 100vw;
    height: 5px;
    background-color: #d3d3d3;
  }

  .vertical-slider-image:hover {
    cursor: ew-resize;
  }

  .horizontal-slider-image:hover {
    cursor: ns-resize;
  }

  .vertical-slider-model {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 50%;
    width: 5px;
    height: 100vh;
    background-color: #d3d3d3;
  }

  .horizontal-slider-model {
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 0;
    width: 100vw;
    height: 5px;
    background-color: #d3d3d3;
  }

  .vertical-slider-model:hover {
    cursor: ew-resize;
  }

  .horizontal-slider-model:hover {
    cursor: ns-resize;
  }
</style>
