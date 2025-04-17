<template>
  <Dialog v-model:open="open" noPadding width="300px" @cancel="handleCancel" title="图层控制">
<!--    <Tabs defaultActiveKey="1" onChange={callback}>-->
<!--      <TabPane tab="Tab 1" key="1">-->
<!--        Content of Tab Pane 1-->
<!--      </TabPane>-->
<!--      <TabPane tab="Tab 2" key="2">-->
<!--        Content of Tab Pane 2-->
<!--      </TabPane>-->
<!--      <TabPane tab="Tab 3" key="3">-->
<!--        Content of Tab Pane 3-->
<!--      </TabPane>-->
<!--    </Tabs>,-->
    <div class="p-2">
      <list :data-source="listData" size="small">
        <template #renderItem="{ item, index }">
          <list-item>
            <Checkbox v-model:checked="item.checked"
                      @click="(e) => handleClick(item, e)">{{
                item.name
              }}
            </Checkbox>
          </list-item>
        </template>
      </list>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import {inject, reactive, ref, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Checkbox, List, ListItem,Tabs} from 'ant-design-vue'
const { TabPane } = Tabs;

const props = defineProps({
  open: {type: Boolean, default: false},
});
const open = ref<Boolean>(false);
const emit = defineEmits(['lineMode', 'isRoller', 'update:open']);

const instance: any = inject('instance');
let AMap, map, trafficLayer, satelliteLayer, roadNetLayer;
const handleCancel = () => {
  open.value = false;
  emit('update:open', false);
};
watch(
  () => props,
  () => {
    open.value = props.open;
    if (open.value) {
      AMap = instance.value.AMap;
      map = instance.value.map;
      initTrafficLayer()
    }
  },
  {deep: true},
);

const initTrafficLayer = () => {
  if (!AMap) return;

  // 路况
  trafficLayer = new AMap.TileLayer.Traffic({
    autoRefresh: true,
    interval: 180,
    zIndex: 100
  });
  // 卫星
  satelliteLayer = new AMap.TileLayer.Satellite({
    visible: false
  });
  // 路网
  roadNetLayer = new AMap.TileLayer.RoadNet({
    visible: false
  });


  roadNetLayer.hide();
  trafficLayer.hide();
  trafficLayer.hide();
  map.add(satelliteLayer);
  map.add(roadNetLayer);
  map.add(trafficLayer);

};


const handleClick = (item, e) => {
  switch (item.name) {
    case '路况':
      if (e.target.checked) {
        trafficLayer.show()
      } else {
        trafficLayer.hide()
      }
      break;
    case '卫星':
      if (e.target.checked) {
        satelliteLayer.show()
      } else {
        satelliteLayer.hide()
      }
      break;
    case '路网':
      if (e.target.checked) {
        roadNetLayer.show()
      } else {
        roadNetLayer.hide()
      }
      break;
    case '医院' :
    case '防空洞' :
    case '避难所' :
      hanlderEmergency(item.name)
      break;
  }
  item.checked = e.target.checked;
  console.log("选项:", item.name, "状态:", e.target.checked);
};
// 表格数据
const listData = reactive([
  {name: "路况", checked: false},
  {name: "卫星", checked: false},
  {name: "路网", checked: false},
  {name: "医院", checked: false},
  {name: "防空洞", checked: false},
  {name: "避难所", checked: false},
]);

const instanceMap={}

const hanlderEmergency = (name: string) => {

  AMap.plugin(['AMap.PlaceSearch'], function () {
    instanceMap[name] = new AMap.PlaceSearch({
      city: '370100',
      map: map,
    });
    instanceMap[name] .search(name, function (status, result) {
      if (status === "complete") {

      }
    });
  });

}
</script>

<style lang="less" scoped></style>
