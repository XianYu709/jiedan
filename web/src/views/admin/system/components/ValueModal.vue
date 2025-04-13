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
          <FormItem label="名称" name="dictValue">
            <Input v-model:value="formState.dictValue" />
          </FormItem>
          <FormItem label="值" name="dictKey">
            <Input v-model:value="formState.dictKey" />
          </FormItem>
          <FormItem label="类型" name="dictType">
            <Select
              @change="getKeys"
              v-model:value="formState.dictType"
              :options="keyList"
              placeholder="类型不能为空!"
            ></Select>
          </FormItem>
          <FormItem label="描述" name="describe">
            <Input v-model:value="formState.describe" />
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
  import type { FormState } from '../data/dictData';
  import dict from '@/api/system/dict';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);

  const formState = ref<FormState>({
    id: '',
    dictType: '',
    dictKey: '',
    dictValue: '',
    describe: '',
  });
  const rules: Object = {
    dictValue: [{ required: true, message: '名称不能为空!', trigger: 'blur' }],
    dictKey: [{ required: true, message: '值不能为空!', trigger: 'blur' }],
    dictType: [{ required: true, message: '类型不能为空!', trigger: 'blur' }],
  };

  const isUpdate = ref(true);

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    if (unref(isUpdate)) {
      let resp = await dict.ValueEditApi(formState.value);
      if (resp.succ == true) {
        emits('success', formState.value.dictType);
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      let resp = await dict.ValueAddApi(formState.value);
      if (resp.succ == true) {
        message.success('添加成功');
        emits('success', formState.value.dictType);
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
  const keyList = ref<Object[]>([]);

  const rName = (arr) => {
    return arr
      .map((item) => {
        return {
          label: item.paramName,
          value: item.dictType,
        };
      })
      .filter((item) => item.value != '已删除');
  };

  const getKeys = async () => {
    let { data } = await dict.keyInfoApi();
    keyList.value = rName(data.records);
  };
  getKeys();

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
        rid: '',
        rname: '',
        describe: '',
        rval: '',
        id: '',
        dictType: '',
        dictKey: '',
        dictValue: '',
      });
    }
  });
</script>
