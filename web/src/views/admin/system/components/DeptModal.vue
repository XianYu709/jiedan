<template>
  <BasicModal
    v-bind="$attrs"
    v-model:open="open"
    @register="registerModal"
    :title="isUpdate ? `修改${$attrs.titles}` : `新增${$attrs.titles}`"
    @ok="handleSubmit"
  >
    <Comment class="p-0">
      <template #content>
        <Form
          ref="formRef"
          :model="formState"
          name="basic"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <FormItem label="部门名称" name="dname">
            <Input v-model:value="formState.dname" />
          </FormItem>
          <FormItem label="部门描述" name="dnotes">
            <Input v-model:value="formState.dnotes" />
          </FormItem>
          <FormItem label="父部门" name="dparent">
            <Select
              v-model:value="formState.dparent"
              :options="deptList"
              placeholder="父部门不能为空!"
            ></Select>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Input, Form, message, Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { unref, ref, watch } from 'vue';
  import type { FormState } from '../data/deptData';
  import dept from '@/api/system/dept';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);

  const rName = (arr) => {
    return arr.map((item) => {
      return {
        label: item.dname,
        value: item.did,
        options: item.children.length > 0 ? rName(item.children) : [],
      };
    });
  };

  const flat = (data, childrenKey = 'children') => {
    let result = [];
    const flatten = (node) => {
      let flatNode = { ...node };
      delete flatNode[childrenKey];
      result.push(flatNode);
      if (node[childrenKey] && node[childrenKey].length > 0) {
        node[childrenKey].forEach((child) => flatten(child));
      }
    };
    data.forEach((node) => flatten(node));
    return result;
  };

  const deptList = ref([]);
  const getDepts = async () => {
    const { data } = await dept.deptInfoApi();
    deptList.value = flat(rName(data), 'options');
  };
  getDepts();

  const formState = ref<FormState>({
    did: '',
    dname: '',
    dnotes: '',
    dparent: '',
  });
  const rules: Object = {
    dname: [{ required: true, message: '部门名称不能为空!', trigger: 'blur' }],
    dnotes: [{ required: true, message: '部门描述不能为空!', trigger: 'blur' }],
  };

  const isUpdate = ref(true);

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    if (unref(isUpdate)) {
      let resp = await dept.deptEditApi(formState.value);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      let resp = await dept.deptAddApi(formState.value);
      if (resp.succ == true) {
        message.success('添加成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    }
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, minHeight: 10 });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      Object.assign(formState.value, data.record);
    }
  });

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

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const open = ref(false);
  watch(open, () => {
    if (!open.value) {
      formRef.value.resetFields();
      Object.assign(formState.value, {
        did: '',
        dname: '',
        dnotes: '',
        dparent: '',
      });
    }
  });
</script>
