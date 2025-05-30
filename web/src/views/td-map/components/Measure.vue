<template>
  <Dialog v-model:open="open" :width="270" noPadding title="量算" @cancel="handleCancel">
    <div class="relative bg-transparent rounded-md flex items-center justify-evenly">
      <div class="flex flex-col items-center cursor-pointer w-[60px] h-[60px]"
           :class="{ 'bg-blue-100 text-blue-600': activeTool === 'rule' }" @click="draw('rule')">
        <span class="iconfont icon-distance align-middle" style="font-size: 23px"/>
        <p class="text-[12px]">距离</p>
      </div>
      <div class="flex flex-col items-center mx-1 cursor-pointer w-[60px] h-[60px]"
           :class="{ 'bg-blue-100 text-blue-600': activeTool === 'measureArea' }"
           @click="draw('measureArea')">
        <span class="iconfont icon-area align-middle" style="font-size: 23px"/>
        <p class="text-[12px]">面积测量</p>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="clear">
        <span class="iconfont icon-clear align-middle" style="font-size: 23px"/>
        <p class="text-[12px]">清除</p>
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import {inject, ref, watch} from 'vue';
import Dialog from './Dialog.vue';

const props = defineProps({
  open: {type: Boolean, default: false},
});
const emits = defineEmits(['update:open']);
const open = ref(false);
const activeTool = ref('');
const instance: any = inject('instance');
let AMap, map, mouseTool;

const draw = (type) => {
  switch (type) {
    case 'rule': {
      mouseTool.rule({
        startMarkerOptions: {
          //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: '//webapi.amap.com/theme/v1.3/markers/b/start.png',
          }),
          offset: new AMap.Pixel(-9, -31),
        },
        endMarkerOptions: {
          //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: '//webapi.amap.com/theme/v1.3/markers/b/end.png',
          }),
          offset: new AMap.Pixel(-9, -31),
        },
        midMarkerOptions: {
          //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: '//webapi.amap.com/theme/v1.3/markers/b/mid.png',
          }),
          offset: new AMap.Pixel(-9, -31),
        },
        lineOptions: {
          //可缺省
          strokeStyle: 'solid',
          strokeColor: '#FF33FF',
          strokeOpacity: 1,
          strokeWeight: 2,
        },
        //同 RangingTool 的 自定义 设置，缺省为默认样式
      });
      break;
    }
    case 'measureArea': {
      mouseTool.measureArea({
        strokeColor: '#80d8ff',
        fillColor: '#80d8ff',
        fillOpacity: 0.3,
        //同 Polygon 的 Option 设置
      });
      break;
    }
  }
  activeTool.value = type;
};

const clear = () => {
  mouseTool.close(true); //关闭，并清除覆盖物
  activeTool.value = '';
};

const handleCancel = () => {
  open.value = false;
  emits('update:open', false);
};

watch(
  () => props,
  () => {
    open.value = props.open;
    if (open.value) {
      AMap = instance.value.AMap;
      map = instance.value.map;
      mouseTool = new AMap.MouseTool(map);
    }
  },
  {deep: true},
);
</script>
<style lang="less" scoped></style>
