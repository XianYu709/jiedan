<template>
  <BasicModal
    v-model:open="open"
    :title="isUpdate ? '修改风险区域管理' : '新增风险区域管理'"
    v-bind="$attrs"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <Comment>
      <template #content>
        <Form
          ref="formRef"
          :label-col="{ span: 6 }"
          :model="formState"
          :rules="rules"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          name="basic"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <FormItem label="名称" name="name">
            <Input v-model:value="formState.name"/>
          </FormItem>
          <FormItem label="类型" name="type">
            <Select v-model:value="formState.type" :options="typeOptions"></Select>
          </FormItem>
          <FormItem label="区域" name="area">
            <Viewer v-model:modal-value="formState.area" :is-drawing="true"
                    style="width: 100%; height: 500px" @instance="onSuccess"></Viewer>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script lang="ts" setup>
import type {TreeProps} from 'ant-design-vue';
import {Comment, Form, Input, message, Select} from 'ant-design-vue';
import {BasicModal, useModalInner} from '@/components/Modal';
import {ref, Ref, unref, watch} from 'vue';
import {deptInfoApi} from '@/api/system/dept';
import dangerous from '@/api/emergency/dangerous';
import Viewer from "@/views/td-map/components/Viewer.vue";

const FormItem = Form.Item;
const formRef = ref<any>(null);
const isUpdate = ref(true);
const formState = ref<any>({
  id: '',
  name: '',
  area: null,
  type: null,
});

const typeOptions = [
  {
    label: '洪水',
    value: '洪水',
  },
  {
    label: '大风',
    value: '大风',
  },
]

const onSuccess = ({map}) => {
  map.setCenter([117.000923, 36.675807]);
};

const getLine = (value) => {
  formState.value.location = [{
    name: value.name,
    area: value,
  }]
};

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
  setModalProps({confirmLoading: false, minHeight: 156, width: '60%',});
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
  console.log("formState", formState.value)
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
    let resp = await dangerous.riskyAreaEditApi(formState.value);
    if (resp.succ == true) {
      message.success('修改成功');
      emits('success');
      closeModal();
    } else {
      message.error(resp.msg as string);
    }
  } else {
    let resp = await dangerous.riskyAreaAddApi(formState.value);
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
