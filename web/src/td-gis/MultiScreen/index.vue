<template>
  <div class="m-2 text-zinc-600 font-semibold h-8 flex justify-between items-center">
    <div @click="viewportTypeHandler('NONE')" class="text-center">
      <slot name="NONE">
        <span
          class="iconfont icon-one-screen align-middle cursor-pointer"
          :class="[mode == 'NONE' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>无</div>
    </div>
    <div @click="viewportTypeHandler('VERTICAL')" class="text-center">
      <slot name="twoScreenTwo">
        <span
          class="iconfont icon-two-screen align-middle cursor-pointer"
          :class="[mode == 'VERTICAL' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>横双屏</div>
    </div>
    <div @click="viewportTypeHandler('HORIZONTAL')" class="text-center">
      <slot name="twoScreen">
        <span
          class="iconfont icon-two-screen-v align-middle cursor-pointer"
          :class="[mode == 'HORIZONTAL' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>竖双屏</div>
    </div>
    <div @click="viewportTypeHandler('VerticalTrisection')" class="text-center">
      <slot name="threeScreen">
        <span
          class="iconfont icon-three-screen-v align-middle cursor-pointer"
          :class="[mode == 'VerticalTrisection' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>竖三屏</div>
    </div>
    <div @click="viewportTypeHandler('TRIPLE')" class="text-center">
      <slot name="threeScreenTwo">
        <span
          class="iconfont icon-three-screen align-middle cursor-pointer"
          :class="[mode == 'TRIPLE' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>三分屏</div>
    </div>
    <div @click="viewportTypeHandler('QUAD')" class="text-center">
      <slot name="fourScreen">
        <span
          class="iconfont icon-four-screen align-middle cursor-pointer"
          :class="[mode == 'QUAD' ? 'text-cyan-400' : '']"
          :style="{ fontSize: `${iconSize}px` }"
        />
      </slot>
      <div>四分屏</div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, nextTick } from 'vue';
  var mode = ref();
  const props = defineProps({
    iconSize: {
      type: Number,
      default: 28,
    },
  });
  const emit = defineEmits(['dividingLineMode']);
  const viewportTypeHandler = (value) => {
    emit('dividingLineMode', value);
    mode.value = value;
    viewer.scene.multiViewportMode = Cesium.MultiViewportMode[value];
  };

  const clear = () => {
    viewportTypeHandler('NONE');
  };

  defineExpose({
    clear,
  });
</script>
