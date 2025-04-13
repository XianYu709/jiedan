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
          <FormItem label="用户名" name="nick">
            <Input v-model:value="formState.nick" />
          </FormItem>
          <FormItem label="账号" name="uname">
            <Input v-model:value="formState.uname" />
          </FormItem>
          <FormItem label="密码" name="pwd">
            <InputPassword v-model:value="formState.pwd" />
          </FormItem>
          <FormItem label="所属角色" name="roleId">
            <Select
              v-model:value="formState.roleId"
              :options="roleList"
              placeholder="所属角色不能为空!"
            ></Select>
          </FormItem>

          <FormItem label="所属部门" name="deptId">
            <Select
              v-model:value="formState.deptId"
              :options="deptList"
              placeholder="所属部门不能为空!"
            ></Select>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Input, Select, Form, message } from 'ant-design-vue';
  import type { TreeProps } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { unref, Ref, ref, watch } from 'vue';
  import type { FormState } from '../data/accountData';
  import role from '@/api/system/role';
  import { deptInfoApi } from '@/api/system/dept';
  import account from '@/api/system/account';
  const InputPassword = Input.Password;
  const FormItem = Form.Item;
  const formRef = ref<any>(null);

  const formState = ref<FormState>({
    uid: '',
    uname: '',
    nick: '',
    pwd: '',
    avatar: '',
    roleId: '',
    deptId: '',
  });
  const rules: Object = {
    uname: [{ required: true, message: '用户名不能为空!', trigger: 'blur' }],
    nick: [{ required: true, message: '账号不能为空!', trigger: 'blur' }],
    pwd: [{ required: true, message: '密码不能为空!', trigger: 'blur' }],
    roleId: [{ required: true, message: '角色不能为空!', trigger: 'blur' }],
    deptId: [
      {
        required: true,
        message: '部门不能为空!',
        trigger: 'blur',
      },
    ],
  };

  const isUpdate = ref(true);

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    if (unref(isUpdate)) {
      let param = { ...formState.value };
      param.pwd = btoa(formState.value.pwd);
      let resp = await account.accountEditApi(param);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      let param = { ...formState.value };
      param.pwd = btoa(formState.value.pwd);
      let resp = await account.accountAddApi(param);
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
      formState.value.pwd = atob(formState.value.pwd);
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

  const deptList: Ref<TreeProps['treeData']> = ref([]);
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

  const rName = (arr) => {
    return arr.map((item) => {
      return {
        label: item.dname,
        value: item.did,
        options: item.children.length > 0 ? rName(item.children) : [],
      };
    });
  };

  const getDepts = async () => {
    const { data } = await deptInfoApi();
    deptList.value = rName(data);
    console.log(deptList);
  };
  getDepts();

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
        uid: '',
        uname: '',
        nick: '',
        pwd: '',
        avatar: '',
        roleId: '',
        deptId: '',
        roles: [],
        perms: [],
      });
    }
  });
</script>
