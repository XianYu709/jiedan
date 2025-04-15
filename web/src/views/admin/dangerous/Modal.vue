<template>
  <BasicModal
    v-bind="$attrs"
    v-model:open="open"
    @register="registerModal"
    :title="isUpdate ? '修改应急数据' : '新增应急数据'"
    @ok="handleSubmit"
  >
    <Comment>
      <template #content>
        <Form
          :rules="rules"
          ref="formRef"
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <FormItem label="名称" name="name">
            <Input v-model:value="formState.name"/>
          </FormItem>
          <FormItem label="容量" name="capacity">
            <Input v-model:value="formState.capacity"/>
          </FormItem>
          <FormItem label="位置" name="location">
            <Input v-model:value="formState.location"/>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
import type {TreeProps} from 'ant-design-vue';
import {Comment, Form, Input, message} from 'ant-design-vue';
import {BasicModal, useModalInner} from '@/components/Modal';
import {ref, Ref, unref, watch} from 'vue';
import {FormState} from './data';
import {deptInfoApi} from '@/api/system/dept';
import emergency from '@/api/emergency/emergency';

const FormItem = Form.Item;
const formRef = ref<any>(null);
const isUpdate = ref(true);
const formState = ref<FormState>({
  id: '',
  name: '',
  capacity: '',
  location: '',
});

const deptValue = (arr) => {
  return arr.map((item) => {
    return {
      label: item.dname,
      value: JSON.stringify({did: item.did}),
      options: item.children.length > 0 ? deptValue(item.children) : [],
    };
  });
};

const sectionOption: Ref<TreeProps['treeData']> = ref([]);
const getDepts = async () => {
  const {data} = await deptInfoApi();
  sectionOption.value = deptValue(data);
};
getDepts();

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
  setModalProps({confirmLoading: false, minHeight: 156});
  isUpdate.value = !!data?.isUpdate;
  if (unref(isUpdate)) {
    let record = JSON.parse(JSON.stringify(data.record));
    Object.assign(formState.value, record);
  }
});

const rules: any = {
  name: [{required: true, message: '名称不能为空!', trigger: 'blur'}],
  capacity: [{required: true, message: '容量不能为空!', trigger: 'blur'}],
  location: [{required: true, message: '位置不能为空!', trigger: 'blur'}],
};

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      addOrEdit();
    }).catch((error) => {
    console.log(error);
  });

};

const emits = defineEmits(['success', 'register']);

const addOrEdit = async () => {
  if (unref(isUpdate)) {
    let resp = await emergency.dataEmergencyEditApi(formState.value);
    if (resp.succ == true) {
      message.success('修改成功');
      emits('success');
      closeModal();
    } else {
      message.error(resp.msg as string);
    }
  } else {
    let resp = await emergency.dataEmergencyAddApi(formState.value);
    if (resp.succ == true) {
      message.success('添加成功');
      emits('success');
      closeModal();
    } else {
      message.error(resp.msg as string);
    }
  }
};

const open = ref(false);
watch(open, () => {
  if (!open.value) {
    formRef.value.resetFields();
    Object.assign(formState.value, {
      id: '',
      name: '',
      capacity: '',
      location: '',
    });
  }
});
</script>
