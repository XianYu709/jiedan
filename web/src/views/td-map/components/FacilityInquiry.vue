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
      <Radio.Button value="clear" @click="clear(true)">
        <CloseCircleOutlined/>
      </Radio.Button>
    </Radio.Group>
    <Table v-if="dataSouce.length>0"
           :columns="[{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },   {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
    }]"
           :data-source="dataSouce"
           :pagination="{
       pageSize:5
     }"
    >

    </Table>
    <Empty v-else class="mt-6"/>
  </Dialog>
</template>
<script lang="ts" setup>
import {inject, ref, shallowRef, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Radio, Table,Empty} from "ant-design-vue";
import {CloseCircleOutlined} from "@ant-design/icons-vue";

const drawType = ref('rectangle');
const inquiryType = ref('clear');

const props = defineProps({
  open: {type: Boolean, default: false},
});
const emits = defineEmits(['update:open']);
const open = ref(false);
const instance: any = inject('instance');

let AMap, map, mouseTool, placeSearch, overlays = []
const dataSouce = ref([])
const marks = shallowRef([])

const handleCancel = () => {
  open.value = false;
  emits('update:open', false);
};

const clear = (flag = false) => {
  map.remove(overlays)
  overlays = [];
  if (marks.value.length > 0) {
    marks.value.forEach(item => {
      item.setMap(null)
    })
    marks.value = []
  }
  dataSouce.value = []
  mouseTool && mouseTool.close();
}

const drawEnd = () => {
  const bounds = overlays[0].getBounds()
  AMap.plugin(['AMap.PlaceSearch'], function () {
    placeSearch = new AMap.PlaceSearch({
      city: '370100',
      size: 99
    });
    placeSearch.search(inquiryType.value, function (status, result) {
      if (status === 'complete') {
        const filtered = result.poiList.pois.filter((poi: any) =>
          bounds.contains([poi.location.lng, poi.location.lat])
        );
        filtered.forEach(item => {
          const marker = new AMap.Marker({
            position: item.location,
            title: item.name,
          });
          marker.on('click', () => {
          });
          marker.setMap(map);
          marks.value.push(marker)
        });
        next(filtered)
      }
    })
  });
}

const next = (marks) => {
  dataSouce.value = marks.map(item => {
    return {
      name: item.name,
      capacity: '未知',
    }
  })
}

const initDraw = () => {
  if (!AMap) return;
  mouseTool = mouseTool ? mouseTool : new AMap.MouseTool(map);
  mouseTool.on('draw', function (e: any) {
    if (overlays.length > 0) {
      clear()
    }
    overlays.push(e.obj);
    drawEnd()
  })
  draw()
}

watch(
  () => props,
  () => {
    open.value = props.open;
    if (open.value) {
      AMap = instance.value.AMap;
      map = instance.value.map;
    } else {
      mouseTool.close();
    }
  },
  {deep: true},
);

const changeHandler = () => {
  clear()
  initDraw()
  draw()
}

const draw = () => {
  switch (drawType.value) {
    case 'rectangle': {
      mouseTool.rectangle({
        fillColor: '#97d8f8',
        strokeColor: '#0dabf1',
      });
      break;
    }
    case 'circle': {
      mouseTool.circle({
        fillColor: '#97d8f8',
        strokeColor: '#0dabf1',
      });
      break;
    }
  }
}

</script>
<style lang="less" scoped></style>
