<template>
  <div class="contents">
    <slot name="setRegion" :event="setRegion">
      <Button @click="setRegion" type="primary">指定范围</Button>
    </slot>

    <slot name="execute" :event="execute">
      <Button @click="execute" type="primary" danger class="ml-3">生成立面图</Button>
    </slot>

    <slot name="clear" :event="clear">
      <Button @click="clear" class="ml-3">清除</Button>
    </slot>

    <Form :label-col="{ span: 4 }">
      <slot name="distance">
        <FormItem label="最大距离" class="mb-0 mt-3">
          <Slider :min="1" :max="1000" v-model:value="distance" />
        </FormItem>
      </slot>
      <slot name="height">
        <FormItem label="最大高度">
          <Slider :min="1" :max="200" v-model:value="height" />
        </FormItem>
      </slot>
    </Form>

    <slot name="result">
      <Divider class="flex"
        >分析结果
        <span @click="download(images)">
          <slot name="download">
            <Button type="primary" danger class="ml-3">下载</Button>
          </slot>
        </span>
      </Divider>
      <div style="width: 100%; max-height: 400px; overflow: auto" ref="canvasRef" class="mb-2">
        <Image :src="images" />
      </div>
    </slot>
  </div>
</template>
<script setup>
  import { ref, watch, onBeforeUnmount } from 'vue';
  import { Slider, Button, Form, Divider, Image, message } from 'ant-design-vue';
  const FormItem = Form.Item;
  const images = ref();
  const distance = ref(500);
  const height = ref(100);
  const facade = ref();
  const handlerLine = ref();
  const props = defineProps({
    distance: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 100,
    },
  });
  const init = () => {
    facade.value = new Cesium.Facade(viewer.scene);
    facade.value.build();
    handlerLine.value = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
    handlerLine.value.drawEvt.addEventListener(function (result) {
      result.object.show = false;
      var startPoint = result.object.positions[0];
      var endPoint = result.object.positions[1];
      facade.value.startPoint = startPoint;
      facade.value.endPoint = endPoint;
    });
  };
  watch(height, (val) => {
    facade.value.maxHeight = Number(val);
  });
  watch(
    () => props,
    () => {
      distance.value = props.distance;
      height.value = props.height;
    },
    { deep: true, immediate: true },
  );
  watch(distance, (val) => {
    facade.value.farDistance = Number(val);
  });
  const setRegion = () => {
    init();
    handlerLine.value.activate();
  };
  const execute = () => {
    facade.value.readyPromise.then(function (base64data) {
      images.value = base64data;
      // download(base64data);
    });
  };
  const clear = () => {
    facade.value && facade.value.clear();
    handlerLine.value && handlerLine.value.clear();
    images.value = '';
  };
  const convertImageToCanvas = (image) => {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas;
  };
  const download = (imgSrc) => {
    if (!imgSrc) {
      message.info('请先生成立面图');
      return;
    }
    var base64 = imgSrc.toString();
    var byteCharacters = atob(base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {
      type: undefined,
    });
    var aLink = document.createElement('a');
    aLink.download = new Date().getTime() + '.jpg'; //指定下载图片的名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  };
  onBeforeUnmount(() => {
    clear();
  });
</script>
