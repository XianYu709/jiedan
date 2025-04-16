<template>
  <BasicModal
    v-bind="$attrs"
    v-model:open="open"
    @register="registerModal"
    :title="isUpdate ? '修改应急数据' : '新增应急数据'"
    @ok="handleSubmit"
    distoryOnClose
  >
    <Comment class="px-4">
      <template #content>
        <Form
          :rules="rules"
          ref="formRef"
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <FormItem label="类型" name="type">
            <Select
              v-model:value="formState.type"
              :options="typeOptions"
              @change="typeChange"
              placeholder="请选择类型"
            ></Select>
          </FormItem>
          <FormItem label="名称" name="name">
            <Input v-model:value="formState.name" disabled placeholder="请在地图选点" />
          </FormItem>
          <FormItem label="容量" name="capacity">
            <Input v-model:value="formState.capacity" placeholder="请输入容量" />
          </FormItem>
          <FormItem label="位置" name="location">
            <Input
              v-model:value="formState.location"
              disabled
              class="mb-2"
              placeholder="请在地图选点"
            />
            <Viewer style="width: 100%; height: 500px" @instance="onSuccess"></Viewer>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import type { TreeProps } from 'ant-design-vue';
  import { Comment, Form, Input, message, Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Viewer from '@/views/td-map/components/Viewer.vue';
  import { ref, Ref, unref, watch } from 'vue';
  import { FormState } from './data';
  import { deptInfoApi } from '@/api/system/dept';
  import emergency from '@/api/emergency/emergency';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);
  const isUpdate = ref(true);
  const formState = ref<FormState>({
    id: '',
    name: null,
    capacity: '',
    location: '',
    type: null,
  });

  const typeOptions = [
    {
      label: '医院',
      value: '医院',
    },
    {
      label: '防空洞',
      value: '防空洞',
    },
    {
      label: '避难所',
      value: '避难所',
    },
    {
      label: '消防站',
      value: '消防站',
    },
  ];

  const deptValue = (arr) => {
    return arr.map((item) => {
      return {
        label: item.dname,
        value: JSON.stringify({ did: item.did }),
        options: item.children.length > 0 ? deptValue(item.children) : [],
      };
    });
  };

  const sectionOption: Ref<TreeProps['treeData']> = ref([]);
  const getDepts = async () => {
    const { data } = await deptInfoApi();
    sectionOption.value = deptValue(data);
  };
  getDepts();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, minHeight: 156, width: '60%' });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      let record = JSON.parse(JSON.stringify(data.record));
      Object.assign(formState.value, record);
    }
  });

  const rules: any = {
    name: [{ required: true, message: '名称不能为空!', trigger: 'blur' }],
    capacity: [{ required: true, message: '容量不能为空!', trigger: 'blur' }],
    location: [{ required: true, message: '位置不能为空!', trigger: 'blur' }],
    type: [{ required: true, message: '类型不能为空!', trigger: 'blur' }],
  };

  const handleSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        addOrEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    const temp = JSON.parse(JSON.stringify(formState.value));
    temp.location = JSON.stringify(temp.location);
    if (unref(isUpdate)) {
      let resp = await emergency.dataEmergencyEditApi(temp);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      let resp = await emergency.dataEmergencyAddApi(temp);
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

  let placeSearch;
  const onSuccess = ({ map, AMap }) => {
    map.setFitView();
    AMap.plugin(['AMap.PlaceSearch'], function () {
      placeSearch = new AMap.PlaceSearch({
        city: '370100',
        citylimit: true,
        map: map,
        autoFitView: true,
      });
    });
  };

  const typeChange = (v) => {
    formState.value.location = null;
    formState.value.name = null;
    formState.value.capacity = null;
    placeSearch.search(v);
    placeSearch.on('markerClick', function ({ data }) {
      formState.value.name = data.name;
      formState.value.location = data.location.pos;
    });
  };

  watch(open, () => {
    if (!open.value) {
      formRef.value.resetFields();
      Object.assign(formState.value, {
        id: '',
        name: '',
        capacity: '',
        location: null,
        type: null,
      });
    }
  });
</script>
