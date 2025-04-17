<template>
  <Dialog v-model:open="open" :width="340" title="设施查询" @cancel="handleCancel">
    <Radio.Group class="mt-4 ">
      <Radio.Button value="large">医院</Radio.Button>
      <Radio.Button value="default">防空洞</Radio.Button>
      <Radio.Button value="small">避难所</Radio.Button>
      <Radio.Button value="small">消防站</Radio.Button>
    </Radio.Group>
  </Dialog>
</template>
<script lang="ts" setup>
import {inject, ref, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Radio} from "ant-design-vue";


const props = defineProps({
  open: {type: Boolean, default: false},
});
const emits = defineEmits(['update:open']);
const open = ref(false);
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
};

const clear = () => {
  mouseTool.close(true); //关闭，并清除覆盖物
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
