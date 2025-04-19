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
           :ellipsis="true"
           :pagination="{
       pageSize:5
     }"
    >
      <template #summary>
        <div class="p-1 m-2">
          总计：{{ sum }}
        </div>
      </template>
    </Table>
    <Empty v-else class="mt-6"/>
  </Dialog>
</template>
<script lang="ts" setup>
import {computed, inject, ref, shallowRef, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Empty, Radio, Table} from "ant-design-vue";
import {CloseCircleOutlined} from "@ant-design/icons-vue";
import emergency from "@/api/emergency/emergency";

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
const isNumber = (v: any) => {
  return !isNaN(Number(v))
}
const sum = computed(() => {
  return dataSouce.value.reduce((acc, cur) => acc + Number(isNumber(cur.capacity) ? cur.capacity : 0), 0)
})
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
}

const init = () => {
  AMap.plugin(['AMap.PlaceSearch'], function () {
    mouseTool = new AMap.MouseTool(map);
    placeSearch = new AMap.PlaceSearch({
      city: '370100',
      size: 99
    });
    mouseTool.on('draw', function (e: any) {
      if (isSitu(e.obj.aE)) return
      if (overlays.length > 0) {
        clear()
      }
      overlays.push(e.obj)
      drawEnd()
    })
  });
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
  placeSearch.searchInBounds(inquiryType.value, bounds, function (status, result) {
    if (status === 'complete') {
      result.poiList.pois.forEach(item => {
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
        marker.on('click', async () => {
          const location = `[${item.location.pos[0]},${item.location.pos[1]}]`
          const {data} = await emergency.dataEmergencyListApi({location: location});
          const infoWindow = new AMap.InfoWindow({
            content: `<div class="custom-info-window">
                                  <h3>${item.name}</h3>
                                  <p>地址：${item.address || '无'}</p>
                                  <p>电话：${item.tel || '暂无'}</p>
                                  <p>容量：${data.records.length !== 0 ? data.records[0].capacity :
              '暂无'}</p>
                                </div>`,
            offset: new AMap.Pixel(10, 0),
            closeWhenClickMap: true
          });
          infoWindow.open(map, marker.getPosition());
        });
        marker.setMap(map);
        marks.value.push(marker)
      })
      next(result.poiList.pois)
    }
  })
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

const isSitu = (arr: Array<Array<any>>) => {
  const oneArr = arr[0][0]
  return oneArr.every(val => val[0] === oneArr[0][0]);
}

watch(
  () => props,
  () => {
    open.value = props.open;
    if (open.value) {
      AMap = instance.value.AMap;
      map = instance.value.map;
      init()
    } else {
      clear()
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
  if (inquiryType.value === 'clear') return

  switch (drawType.value) {
    case 'rectangle': {
      mouseTool.rectangle({
        fillColor: 'rgba(151,216,248,0.42)',
        strokeColor: '#0dabf1',
      });
      break;
    }
    case 'circle': {
      mouseTool.circle({
        fillColor: 'rgba(151,216,248,0.41)',
        strokeColor: '#0dabf1',
      });
      break;
    }
  }
}

</script>
<style lang="less" scoped></style>
