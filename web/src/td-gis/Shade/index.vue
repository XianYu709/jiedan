<template>
  <Shade ref="shadeRef" :parameter="parameter" @ratio="ratioEvent" @data="getData">
    <div id="toolbar">
      <Form :label-col="{ span: 4 }">
        <slot name="selDate">
          <FormItem label="日期选择" class="mb-0 mt-3">
            <DatePicker
              v-model:value="parameter.selDate"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="w-full"
            /> </FormItem
        ></slot>
        <slot name="startTime">
          <FormItem label="开始时间" class="mb-0 mt-2">
            <Select v-model:value="parameter.startTime" :options="startTimeOption">
            </Select> </FormItem
        ></slot>
        <slot name="endTime">
          <FormItem label="结束时间" class="mb-0 mt-2">
            <Select v-model:value="parameter.endTime" class="form-control" :options="endTimeOption">
            </Select> </FormItem
        ></slot>
        <slot name="bottomHeight">
          <FormItem label="底部高程" class="mb-0 mt-2">
            <InputNumber v-model:value="parameter.bottomHeight" /> </FormItem
        ></slot>
        <slot name="extrudeHeight">
          <FormItem label="拉伸高度" class="mb-0 mt-2">
            <InputNumber v-model:value="parameter.extrudeHeight" /> </FormItem
        ></slot>
      </Form>
    </div>
  </Shade>
</template>
<script setup>
  import Shade from './Shade.vue';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { Slider, Button, Form, Input, Select, DatePicker, InputNumber } from 'ant-design-vue';

  const FormItem = Form.Item;
  const emit = defineEmits(['ratio']);
  const ratioEvent = (e) => {
    emit('ratio', e);
  };
  const startTimeOption = [
    { label: '0:00', value: '0' },
    { label: '2:00', value: '2' },
    { label: '4:00', value: '4' },
    { label: '6:00', value: '6' },
    { label: '8:00', value: '8' },
    { label: '10:00', value: '10' },
    { label: '12:00', value: '12' },
    { label: '14:00', value: '14' },
    { label: '16:00', value: '16' },
    { label: '18:00', value: '18' },
    { label: '20:00', value: '20' },
    { label: '22:00', value: '22' },
  ];
  const endTimeOption = [
    { label: '2:00', value: '2' },
    { label: '4:00', value: '4' },
    { label: '6:00', value: '6' },
    { label: '8:00', value: '8' },
    { label: '10:00', value: '10' },
    { label: '12:00', value: '12' },
    { label: '14:00', value: '14' },
    { label: '16:00', value: '16' },
    { label: '18:00', value: '18' },
    { label: '20:00', value: '20' },
    { label: '22:00', value: '22' },
    { label: '24:00', value: '24' },
  ];

  const props = defineProps({
    params: {
      type: Object,
      default: {
        selDate: '2024-1-1',
        startTime: '10',
        endTime: '12',
        bottomHeight: 21,
        extrudeHeight: 21,
      },
    },
  });

  const parameter = ref({
    selDate: '2024-1-1',
    startTime: '10',
    endTime: '12',
    bottomHeight: 21,
    extrudeHeight: 21,
  });

  watch(
    () => props.params,
    () => {
      parameter.value.selDate = props.params.selDate ?? parameter.value.selDate;
      parameter.value.startTime = props.params.startTime ?? parameter.value.startTime;
      parameter.value.endTime = props.params.endTime ?? parameter.value.endTime;
      parameter.value.bottomHeight = props.params.bottomHeight ?? parameter.value.bottomHeight;
      parameter.value.extrudeHeight = props.params.extrudeHeight ?? parameter.value.extrudeHeight;
    },
    {
      immediate: true,
      deep: true,
    },
  );

  //获取当天日期
  function getDate() {
    Date.prototype.format = function (fmt) {
      var o = {
        'y+': this.getFullYear,
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
          );
      return fmt;
    };
    return new Date();
  }
  //日期格式转换
  const date = ref();
  const initTime = () => {
    const dateTime = new getDate();
    date.value = dateTime.format('yyyy-MM-dd');
  };
  onMounted(() => {
    initTime();
    parameter.value.selDate = date.value;
  });

  const getData = (e) => {
    parameter.value.points = e;
  };

  const getParams = () => {
    return parameter.value;
  };
  const shadeRef = ref(null);
  const setParams = (e) => {
    shadeRef.value.reload(e);
  };

  defineExpose({ getParams, setParams });
</script>
