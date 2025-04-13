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
          <FormItem label="键名" name="paramName">
            <Input v-model:value="formState.paramName" />
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Input, Form, message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { unref, ref, watch } from 'vue';
  import type { FormState } from '../data/dictData';
  import dict from '@/api/system/dict';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);

  const formState = ref<FormState>({
    paramId: '',
    paramName: '',
    dictType: '',
  });
  const rules: Object = {
    paramName: [{ required: true, message: '键名不能为空!', trigger: 'blur' }],
  };

  const isUpdate = ref(true);

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    formState.value.dictType = formState.value.paramName as string;
    if (unref(isUpdate)) {
      let resp = await dict.keyEditApi(formState.value);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success',formState.value.dictType);
        closeModal();
      } else {
        message.error(resp.msg as string as string);
      }
    } else {
      formState.value.dictType = formState.value.paramName as string;
      let resp = await dict.keyAddApi(formState.value);
      if (resp.succ == true) {
        message.success('添加成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string as string);
      }
    }
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, minHeight: 10 });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      Object.assign(formState.value, data.record);
      formState.value.orlDictType = data.record.dictType;
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
  const dictList = ref<Object[]>([]);
  const getDicts = async () => {
    const { data } = await dict.keyInfoApi();
    dictList.value = data.records.map((item) => {
      return {
        label: item.paramName,
        value: item.paramId,
      };
    });
  };
  getDicts();

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
        paramId: '',
        paramName: '',
        dictType: '',
        orlDictType: '',
      });
    }
  });
</script>
