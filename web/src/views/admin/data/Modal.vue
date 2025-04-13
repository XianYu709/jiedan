<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="修改数据" @ok="handleSubmit">
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
            label="数据源"
            name="dataSource"
            :rules="[{ required: true, message: '数据源不能为空!' }]"
          >
            <Input v-model:value="formState.name" />
          </FormItem>
          <FormItem
            label="数据集"
            name="dataset"
            :rules="[{ required: true, message: '数据集不能为空!' }]"
          >
            <Input v-model:value="formState.url" />
          </FormItem>
          <FormItem label="Url" name="url" :rules="[{ required: true, message: 'Url不能为空!' }]">
            <Input v-model:value="formState.url" />
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Form, Input } from 'ant-design-vue';
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
  const formState = reactive<FormState>({
    name: '',
    url: '',
    type: 'ter',
    dataset: '',
  });
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
  const handleSubmit = () => {};
</script>
