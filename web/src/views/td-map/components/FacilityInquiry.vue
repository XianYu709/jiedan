<template>
  <Dialog v-model:open="open" :width="380" title="设施查询" @cancel="handleCancel">
    <template #extra>
      <Radio.Group v-model:value="drawType" button-style="solid" size="small"
                   @change="changeHandler">
        <Radio.Button value="rectangle">矩形</Radio.Button>
        <Radio.Button value="circle">圆形</Radio.Button>
      </Radio.Group>
    </template>
    <Radio.Group v-model:value="inquiryType" class="mt-4" @change="changeHandler">
      <Radio.Button value="医院">医院</Radio.Button>
      <Radio.Button value="防空洞">防空洞</Radio.Button>
      <Radio.Button value="避难所">避难所</Radio.Button>
      <Radio.Button value="消防站">消防站</Radio.Button>
      <Radio.Button value="clear" @click="clear(true)"><span
        class="iconfont icon-clear" style="font-size: 15px"/>
      </Radio.Button>
    </Radio.Group>
  </Dialog>
</template>
<script lang="ts" setup>
import {inject, ref, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Radio} from "ant-design-vue";

const drawType = ref('rectangle');
const inquiryType = ref('医院');

const props = defineProps({
  open: {type: Boolean, default: false},
});
const emits = defineEmits(['update:open']);
const open = ref(false);
const instance: any = inject('instance');

let AMap, map, mouseTool, overlays = [];

const handleCancel = () => {
  open.value = false;
  emits('update:open', false);
};

const clear = (flag = false) => {
  map.remove(overlays)
  overlays = [];
  if (flag) {
    setTimeout(() => {
      inquiryType.value = '医院';
      draw()
    })
  }
}

watch(
  () => props,
  () => {
    open.value = props.open;
    if (open.value) {
      AMap = instance.value.AMap;
      map = instance.value.map;
      mouseTool = new AMap.MouseTool(map);
      mouseTool.on('draw', function (e:any) {
        console.log(overlays.length)
        console.log(e)
        if (overlays.length > 0) {
          clear()
        }
        overlays.push(e.obj);
      })
      draw()
    } else {
      mouseTool.close();
    }
  },
  {deep: true},
);

const changeHandler = () => {
  clear()
  draw()
}

const draw = () => {
  switch (drawType.value) {
    case 'rectangle': {
      mouseTool.rectangle({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff',
      });
      break;
    }
    case 'circle': {
      mouseTool.circle({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff',
      });
      break;
    }
  }
}

</script>
<style lang="less" scoped></style>
