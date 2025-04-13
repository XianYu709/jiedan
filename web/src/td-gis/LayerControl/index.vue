<template>
  <Tabs v-model:activeKey="activeKey">
    <TabPane key="1" tab="S3M图层">
      <List class="bg-white overflow-y-auto h-60" size="small" bordered :data-source="layerList">
        <template #renderItem="{ item }">
          <ListItem class="flex items-center justify-between w-full">
            <Checkbox v-model:checked="item.checked" @change="layersParticipate">
              <span>{{ item.name }} </span>
            </Checkbox>
            <Button type="link" size="small" @click="flyTo(item.ins)">link</Button>
          </ListItem>
        </template>
      </List>
    </TabPane>
    <TabPane key="2" tab="影像图层">
      <List
        class="bg-white overflow-y-auto h-60"
        size="small"
        bordered
        :data-source="imageryLayerList"
      >
        <template #renderItem="{ item }">
          <ListItem>
            <Checkbox v-model:checked="item.checked" @change="videoLayersParticipate">
              <span>{{ item.name }} </span>
            </Checkbox>
            <!-- <Button type="link" size="small" @click="logHandler">link</Button> -->
          </ListItem>
        </template>
      </List>
    </TabPane>
    <TabPane key="3" tab="DEM图层">
      <List class="bg-white overflow-y-auto h-60" size="small" bordered :data-source="DEMList">
        <template #renderItem="{ item }">
          <ListItem
          >
            <Checkbox v-model:checked="item.checked" @change="DEMParticipate">{{
                item.name
              }}
            </Checkbox>
             <Button type="link" size="small" @click="terrPosition(item.ins)">link</Button>
          </ListItem>
        </template>
      </List>
    </TabPane>
  </Tabs>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { List, Checkbox, Tabs, TabPane, Button } from "ant-design-vue";

const props = defineProps({
  open: { type: Boolean, default: false }
});
const activeKey = ref("1");
const open = ref(false);
const ListItem = List.Item;
let scene;
var imageryLayerList = ref([]);
var layerList = ref([]);
const DEMList = ref([]);
const emit = defineEmits(["lineMode", "isRoller", "update:open"]);

watch(
  () => props,
  () => {
    open.value = props.open;
  },
  { deep: true }
);

onMounted(() => {
  init();
});

const init = () => {
  scene = viewer.scene;
  layerList.value = scene.layers.layerQueue.map((el, i) => {
    return {
      name: el.name,
      checked: el.visible,
      id: i,
      ins: el
    };
  });

  imageryLayerList.value = viewer.imageryLayers._layers.map((el, i) => {
    return {
      name: `影像图层${i}`,
      checked: el.show,
      id: i,
      ins: el
    };
  });


  let terr = viewer.scene.terrainProvider;
  if(terr._baseUrl){
    DEMList.value.push(
      terr ? { name: terr.tablename, checked: terr.visible, id: 0, ins: terr } : {}
    );
  }
};

const DEMParticipate = () => {
  if (DEMList.value[0].checked) {
    var terrain = new Cesium.CesiumTerrainProvider({
      url: DEMList.value[0].ins._baseUrl,
      isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
      requestVertexNormals: true
    });
  } else {
    var terrain = new Cesium.EllipsoidTerrainProvider({});
  }
  viewer.scene.terrainProvider = terrain;
};

const layersParticipate = () => {
  layerList.value.map((el, i) => {
    el.ins.visible = el.checked;
    return {
      name: el.name,
      checked: el.visible,
      id: i,
      ins: el
    };
  });
};

const videoLayersParticipate = () => {
  imageryLayerList.value.map((el, i) => {
    el.ins.show = el.checked;
    return {
      name: `影像图层${i}`,
      checked: el.show,
      id: i,
      ins: el
    };
  });
};

const terrPosition = (e) => {
  const {west,east,south,north}=e._bounds;
  let lon = (west + east) / 2;
  let lat = (south + north) / 2;
  flyTo({lon,lat,h:8000})
};

const flyTo = ({ lon, lat,h=800 }) => {
  const scarToGraphic = Cesium.Cartesian3.fromDegrees(lon, lat, h);
  viewer.scene.camera.setView({
    destination: scarToGraphic,
    orientation: {
      heading: 0.010432891389807075,
      pitch: -1.2955863517856812,
      roll: 6.283185307179576
    }
  });
};
</script>
