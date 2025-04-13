<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="isUpdate ? '修改书签' : '新增书签'"
    @ok="handleSubmit"
  >
    <Comment>
      <template #content>
        <Form
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <FormItem
            label="名称"
            name="name"
            :rules="[{ required: true, message: '名称不能为空!' }]"
          >
            <Input v-model:value="formState.name" />
          </FormItem>

          <FormItem
            label="日期时间"
            name="dateTime"
            :rules="[{ required: true, message: '日期时间不能为空!' }]"
          >
            <Input v-model:value="formState.url" />
          </FormItem>

          <FormItem
            label="类型"
            name="type"
            :rules="[{ required: true, message: '类型不能为空!' }]"
          >
            <Select v-model:value="formState.type" :options="startTimeOption" @change="selectType">
            </Select>
          </FormItem>

          <FormItem
            label="JSON"
            name="json"
            v-if="formState.type != 'ter'"
            :rules="[{ required: true, message: 'JSON不能为空!' }]"
          >
            <Input v-model:value="formState.gisDataUrl" />
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Form, Input, Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { reactive, unref, ref } from 'vue';
  const FormItem = Form.Item;

  const isUpdate = ref(true);
  interface FormState {
    name: string;
    url: string;
    type: string;
    gisDataUrl: string;
    gisDataKey: string;
    apiDataUrl: string;
    fieldsMap: string;
    domains: Object;
  }
  interface Domain {
    value: string;
    key: number;
  }
  interface Domains {
    value: string;
    key: number;
  }
  const formState = reactive<FormState>({
    name: '',
    url: '',
    type: 'ter',
    gisDataUrl: '1',
    gisDataKey: '1',
    apiDataUrl: '1',
    fieldsMap: '',
    domains: [{}],
  });
  const startTimeOption = [
    { label: '可视域', value: 'ter' },
    { label: '小品', value: 'img' },
    { label: '通视', value: 'osgb' },
    { label: '天际线', value: 'build' },
    { label: '开敞度', value: 'simpleBuild' },
  ];
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, minHeight: 156 });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
    }
  });
  const selectType = (e) => {
    console.log(e);
  };
  const addDomain = () => {
    formState.domains.push({
      value: '',
      key: Date.now(),
    });
  };

  const handleSubmit = () => {};
</script>
