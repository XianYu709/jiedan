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
import {Empty, Radio, Table} from "ant-design-vue";
import {CloseCircleOutlined} from "@ant-design/icons-vue";
import emergency from "@/api/emergency/emergency";

const drawType = ref('rectangle');
const inquiryType = ref('clear');
v

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
  const icons: any = [
    {
      name: "医院",
      url: "http://101.43.167.87:9900/yy.png",
      width: 20,
      height: 20
    },
    {
      name: "防空洞",
      url: "http://101.43.167.87:9900/fkd.png",
      width: 20,
      height: 20
    },
    {
      name: "避难所",
      url: "http://101.43.167.87:9900/bns.png",
      width: 20,
      height: 20
    },
    {
      name: "消防站",
      url: "http://101.43.167.87:9900/xfz.png",
      width: 20,
      height: 20
    },
  ]
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
          const {url, width, height} = icons.find(item => item.name === inquiryType.value)
          const marker = new AMap.Marker({
            position: item.location,
            title: item.name,
            icon: new AMap.Icon({
              image: url,
              size: new AMap.Size(width, height),
              imageSize: new AMap.Size(width, height)
            })
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


const next = async (marks) => {
  const newData: any = [];
  for (const item of marks) {
    const location = `[${item.location.pos[0]},${item.location.pos[1]}]`;
    const {data} = await emergency.dataEmergencyListApi({location});
    newData.push({
      name: item.name,
      capacity: data.records.length ? data.records[0].capacity : '暂无',
    });
  }
  dataSouce.value = newData;
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
