<template>
  <Dialog v-model:open="open" @cancel="handleCancel" noPadding>
    <template #extra v-if="CropId == 'crossCrop' || CropId == 'boxCrop'">
      <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
        <span class="iconfont icon-shuqian align-middle" />
      </div>
    </template>
    <template v-slot:title>
      <div class="flex">
        <div
          v-for="item in titles"
          :key="item.id"
          @click="selected(item.id)"
          class="pr-4"
          :class="item.active ? 'active_title' : 'title'"
        >
          {{ item.title }}
        </div>
      </div>
    </template>
    <div class="text-gray-600 px-5 py-5" v-if="CropId == 'planarCrop'">
      <!-- <div class="max-h-60 overflow-auto">
        <div v-for="item in latLongs" :key="item.id" class="py-2">
          <div class="full flex justify-between">
            第{{ item.id + 1 }}点：精度（°） 维度（°） 高程（米）
          </div>
          <div class="w-full border h-5 mt-1 border-coolgray flex items-center pl-2">
            {{ item.lat }}, {{ item.long }}, {{ item.height }}
          </div>
        </div>
      </div> -->
      <PlanarCrop @positions="getPositions" @clear="clear"></PlanarCrop>
    </div>
    <div class="relative overflow-hidden px-5 py-5" v-if="CropId == 'boxCrop'">
      <BoxCrop ref="CropRef" :params="prams">
        <!-- 插槽实例
        <template #clipMode>
          <RadioGroup v-model:value="prams.clipMode" button-style="solid" @change="selectClass">
            <RadioButton value="clip_behind_all_plane">裁剪包围盒内</RadioButton>
            <RadioButton value="clip_behind_any_plane">裁剪包围盒外</RadioButton>
          </RadioGroup>
        </template>
        <template #length>
          <Slider v-model:value="prams.length" :min="1" :max="100" :step="1" class="w-2/3"/>
        </template> -->
      </BoxCrop>
      <Button @click="openBookMark" class="mt-2" style="">保存至书签</Button>
      <BookMark ref="bmRef" v-model:open="drawerOpen" @params="getParams" type="boxCrop"></BookMark>
    </div>
    <div v-if="CropId == 'crossCrop'" class="relative overflow-hidden px-5 py-5">
      <CrossCrop :params="markParams" ref="CropRef"> </CrossCrop>
      <Button @click="openBookMark" class="mt-2" style="">保存至书签</Button>
      <BookMark
        ref="bmRef"
        v-model:open="drawerOpen"
        @params="getParams"
        type="crossCrop"
      ></BookMark>
    </div>
    <div v-if="CropId == 'polygonCrop'" class="px-5 py-5">
      <PolygonCrop> </PolygonCrop>
    </div>
    <div v-if="CropId == 'CropWithSeal' && layerName_1" class="px-5 py-5">
      <CropWithSeal :layersName="layerName_1"></CropWithSeal>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch, provide, inject } from 'vue';
  import { CropWithSeal, PolygonCrop, CrossCrop, BoxCrop, PlanarCrop } from 'td-gis';
  import Dialog from './Dialog.vue';
  import { Slider, Select, Button, RadioGroup, RadioButton, Form, message } from 'ant-design-vue';
  import BookMark from './BookMark.vue';

  const prams = ref({
    clipMode: 'clip_behind_all_plane',
    length: 100,
  });

  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);
  const titles = ref([
    {
      id: 'planarCrop',
      title: '平面裁剪',
      active: true,
    },
    {
      id: 'boxCrop',
      title: 'Box裁剪',
      active: false,
    },
    {
      id: 'crossCrop',
      title: 'Cross裁剪',
      active: false,
    },
    {
      id: 'polygonCrop',
      title: '多边形裁剪',
      active: false,
    },
    {
      id: 'CropWithSeal',
      title: '裁剪封边',
      active: false,
    },
  ]);
  const latLongs = ref([
    {
      id: 0,
      lat: 0,
      long: 0,
      height: 0,
    },
    {
      id: 1,
      lat: 0,
      long: 0,
      height: 0,
    },
    {
      id: 2,
      lat: 0,
      long: 0,
      height: 0,
    },
  ]);
  const CropId = ref('planarCrop');
  const getPositions = (val) => {
    latLongs.value = val.map((el, index) => {
      return {
        id: index,
        lat: Math.round(el.x * 1000) / 1000,
        long: Math.round(el.y * 1000) / 1000,
        height: Math.round(el.z * 1000) / 1000,
      };
    });
  };
  const clear = () => {
    latLongs.value = [
      {
        id: 1,
        lat: 0,
        long: 0,
        height: 0,
      },
      {
        id: 2,
        lat: 0,
        long: 0,
        height: 0,
      },
      {
        id: 3,
        lat: 0,
        long: 0,
        height: 0,
      },
    ];
  };
  const selected = (id) => {
    titles.value.map((el) => {
      el.active = false;
      if (el.id == id) {
        el.active = true;
      }
    });
    CropId.value = id;
  };

  const open = ref<Boolean>(false);
  const handleCancel = () => {
    open.value = false;
    emits('update:open', false);
  };

  watch(
    () => props,
    () => {
      open.value = props.open;
    },
    { deep: true },
  );
  //书签
  const drawerOpen = ref(false);

  const CropRef = ref(null);

  const bmRef = ref(null);

  const openBookMark = () => {
    let params = CropRef.value.getParams();
    bmRef.value.set(params);
  };
  const markParams = ref({});
  const getParams = (e) => {
    // markParams.value = e;
    CropRef.value.setParams(e);
  };

  const layerName_1 = ref();

  const sceneUrls = inject('sceneUrls');

  const filterName_1 = async (data) => {
    let temp = Object.keys(data).find((item) => item == 'simpleBuild');
    if (!temp) {
      message.info(`没有裁剪封边所需的数据`);
      layerName_1.value = undefined;
      return;
    } else {
      layerName_1.value = data[temp][0].name;
    }
  };
  watch(CropId, () => {
    if (CropId.value == 'CropWithSeal') filterName_1(sceneUrls.value);
  });
</script>
<style lang="less" scoped>
  .title {
    color: #3b3b3b;
    cursor: pointer;
  }

  .title :hover {
    color: #40a9ff;
  }

  .active_title {
    color: #40a9ff;
    cursor: pointer;
  }
</style>
