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
          <FormItem label="职位" name="rname">
            <Input v-model:value="formState.rname" />
          </FormItem>
          <FormItem label="管辖范围" name="rdesc">
            <Input v-model:value="formState.rdesc" />
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
  import type { FormState } from '../data/roleData';
  import role from '@/api/system/role';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);

  const formState = ref<FormState>({
    rid: '',
    rname: '',
    rdesc: '',
    rval: '',
  });
  const rules: Object = {
    rname: [{ required: true, message: '职位不能为空!', trigger: 'blur' }],
    rdesc: [{ required: true, message: '管辖范围不能为空!', trigger: 'blur' }],
  };

  const isUpdate = ref(true);

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    formState.value.rval = formState.value.rname;
    if (unref(isUpdate)) {
      let resp = await role.roleEditApi(formState.value);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      formState.value.rval = formState.value.rname;
      let resp = await role.roleAddApi(formState.value);
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
  const roleList = ref<Object[]>([]);
  const getRoles = async () => {
    const { data } = await role.roleListApi();
    roleList.value = data.records.map((item) => {
      return {
        label: item.rname,
        value: item.rid,
      };
    });
  };
  getRoles();

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
        rdesc: '',
        rval: '',
      });
    }
  });
</script>
