<template>
  <Dialog v-model:open="open" noPadding width="300px" @cancel="handleCancel" title="图层控制">
    <Tabs style="margin-left: 20px" defaultActiveKey="1" onChange={callback}>
      <TabPane v-for="(tabName,tabKey) in ['基础地图','应急资源','风险区域']" :tab="tabName"
               :key="tabKey">
        <div class="p-2">
          <list :data-source="listData" size="small">
            <template #renderItem="{ item, index }">
              <list-item v-if="item.type === tabKey+1">
                <Checkbox v-model:checked="item.checked"
                          @click="(e) => handleClick(item, e)">{{
                    item.name
                  }}
                </Checkbox>
              </list-item>
            </template>
          </list>
        </div>
      </TabPane>
      )}
    </Tabs>
  </Dialog>
</template>

<script lang="ts" setup>
import {inject, reactive, ref, watch} from 'vue';
import Dialog from './Dialog.vue';
import {Checkbox, List, ListItem, Tabs} from 'ant-design-vue'
import emergency from '@/api/emergency/emergency';
import dangerous from '@/api/emergency/dangerous';

const {TabPane} = Tabs;

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
  item.checked = e.target.checked;
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
      hanlderEmergency(item.name, "http://101.43.167.87:9900/yy.png", 20, 20);
      break;
    case '防空洞' :
      hanlderEmergency(item.name, "http://101.43.167.87:9900/fkd.png", 20, 20);
      break;
    case '避难所' :
      hanlderEmergency(item.name, "http://101.43.167.87:9900/bns.png", 20, 20);
      break;
    case '消防站' :
      hanlderEmergency(item.name, "http://101.43.167.87:9900/xfz.png", 20, 20);
      break;
    case '洪水':
      handlerEmergency(item.name, "#1791fc", "#0066cc");
      break;
    case '大风':
      handlerEmergency(item.name, "#66ff99", "#00aa55");
      break;
    case '危险区':
      handlerEmergency(item.name, "#ff6666", "#cc0000");
      break;
  }
  // console.log("选项:", item.name, "状态:", e.target.checked);
};
// 表格数据
const listData = reactive([
  {type: 1, name: "路况", checked: false},
  {type: 1, name: "卫星", checked: false},
  {type: 1, name: "路网", checked: false},
  {type: 2, name: "医院", checked: false},
  {type: 2, name: "防空洞", checked: false},
  {type: 2, name: "避难所", checked: false},
  {type: 2, name: "消防站", checked: false},
  {type: 3, name: "洪水", checked: false},
  {type: 3, name: "大风", checked: false},
  {type: 3, name: "危险区", checked: false},
]);

const instanceMap = {}

let total = ref(50);
let currentPage = ref(1);
const hanlderEmergency = (name: string, image: string, width, height) => {
  console.log(instanceMap, 111111)
  let filter = listData.filter(item => item.type === 2);
  filter.forEach(item => {
    if (item.name === name) {
      if (item.checked) {
        console.log("创建地点搜索:", item.name, item.checked);

        AMap.plugin(['AMap.PlaceSearch'], function () {
          instanceMap[name] = new AMap.PlaceSearch({
            city: '370100',
            map: null,
            pageSize: 10,
            autoFitView: false,
            showMarker: false
          });
          instanceMap[`${name}_markers`] = [];

          // searchNextPage()

          instanceMap[name].search(name, (status, result) => {
            console.log("status,result", status, result)
            if (status === "complete") {
              if (result.poiList && result.poiList.pois) {
                result.poiList.pois.forEach(poi => {
                  const marker = new AMap.Marker({
                    position: poi.location,
                    batchMode: true,
                    map: map,
                    icon: new AMap.Icon({
                      image: image,
                      size: new AMap.Size(width, height),
                      imageSize: new AMap.Size(width, height)
                    }),
                    title: poi.name,
                    extData: poi
                  });

                  marker.on("click", async () => {
                    console.log("点击标记:", poi.name);
                    const location = `[${poi.location.pos[0]},${poi.location.pos[1]}]`
                    const {data} = await emergency.dataEmergencyListApi({location: location});
                    const infoWindow = new AMap.InfoWindow({
                      content: `<div class="custom-info-window">
                                  <h3>${poi.name}</h3>
                                  <p>地址：${poi.address || '无'}</p>
                                  <p>电话：${poi.tel || '暂无'}</p>
                                  <p>容量：${data.records.length !== 0 ? data.records[0].capacity :
                        '暂无'}</p>
                                </div>`,
                      offset: new AMap.Pixel(10, 0),
                      closeWhenClickMap: true
                    });
                    infoWindow.open(map, marker.getPosition());
                  });
                  instanceMap[`${name}_markers`].push(marker);
                });
              }
            }
          });
        });
      } else {
        console.log("移除地点搜索:", name);
        if (instanceMap[name]) {
          instanceMap[name].clear();
          delete instanceMap[name];
        }
        clearAllMarkers(name);
      }
    }
  });


  function clearAllMarkers(name) {
    if (instanceMap[`${name}_markers`]) {
      instanceMap[`${name}_markers`].forEach(marker => {
        marker.setMap(null);
      });
      instanceMap[`${name}_markers`] = [];
    }
  }

  function searchNextPage() {
    if (currentPage.value > Math.ceil(total.value / 50)) return; // 终止
    instanceMap[name].setPageIndex(currentPage.value);
    instanceMap[name].search(name, (status, result) => {
      console.log("status,result", status, result)
      if (status === "complete") {
        console.log(`第${currentPage.value}页/共${Math.ceil(total.value / 50)}页`, result);

        if (currentPage.value === 1) {
          total.value = result.poiList.count;
        }


        if (result.poiList && result.poiList.pois) {
          result.poiList.pois.forEach(poi => {
            const marker = new AMap.Marker({
              position: poi.location,
              batchMode: true,
              map: map,
              icon: new AMap.Icon({
                image: image,
                size: new AMap.Size(width, height),
                imageSize: new AMap.Size(width, height)
              }),
              title: poi.name,
              extData: poi
            });

            marker.on("click", async () => {
              console.log("点击标记:", poi.name);
              const location = `[${poi.location.pos[0]},${poi.location.pos[1]}]`
              const {data} = await emergency.dataEmergencyListApi({location: location});
              const infoWindow = new AMap.InfoWindow({
                content: `<div class="custom-info-window">
                                  <h3>${poi.name}</h3>
                                  <p>地址：${poi.address || '无'}</p>
                                  <p>电话：${poi.tel || '暂无'}</p>
                                  <p>容量：${data.records.length !== 0 ? data.records[0].capacity :
                  '暂无'}</p>
                                </div>`,
                offset: new AMap.Pixel(10, 0),
                closeWhenClickMap: true
              });
              infoWindow.open(map, marker.getPosition());
            });
            instanceMap[`${name}_markers`].push(marker);
          });
        }
        setTimeout(() => {
          currentPage.value++;
          searchNextPage();
        }, 500);
      }
    });
  }

}

const emergencyMap = {};
// 危险区
const handlerEmergency = async (type, fillColor, strokeColor) => {
  let filter = listData.filter(item => item.type === 3);
  for (const item of filter) {
    if (item.name === type) {
      if (item.checked) {
        const {data} = await dangerous.riskyAreaListApi({type: type, pageSize: 999});
        data.records.forEach((item, index) => {
          // 添加覆盖物
          const polygon = new AMap.Polygon({
            path: item.area,
            fillColor: fillColor,
            fillOpacity: 0.6,
            strokeColor: strokeColor,
            strokeWeight: 2,
            zIndex: 20,
          });
          emergencyMap[`${type}${index}`] = polygon
          map.add(polygon);
        });
        console.log(data, 'data')
      } else {
        console.log("移除地点搜索:", type);
        let keys = Object.keys(emergencyMap);
        let types = keys.filter(key => key.includes(type));
        console.log(keys)
        console.log(types)
        types.forEach(key => {
          map.remove(emergencyMap[key]);
          delete emergencyMap[key];
        });
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
