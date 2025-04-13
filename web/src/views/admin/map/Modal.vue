<template>
  <BasicModal
    v-bind="$attrs"
    v-model:open="open"
    @register="registerModal"
    :title="isUpdate ? '修改图层' : '新增图层'"
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
          <FormItem label="类型" name="type">
            <Select v-model:value="formState.type" :options="typeOptions" @change="selectType">
            </Select>
          </FormItem>
          <FormItem label="名称" name="layerName">
            <Input v-model:value="formState.layerName" />
          </FormItem>
          <FormItem label="部门" name="deptList">
            <Select
              mode="multiple"
              v-model:value="formState.deptList"
              :options="sectionOption"
              @change="selectSection"
            >
            </Select>
          </FormItem>
          <FormItem label="Url" name="url">
            <Input v-model:value="formState.url" />
          </FormItem>
          <FormItem label="Gis Data Url" name="gisDataUrl">
            <!-- <Input v-model:value="formState.gisDataUrl" /> -->
            <Select
              show-search
              v-model:value="formState.gisDataUrl"
              :options="gisDataOptions"
              mode="multiple"
            >
            </Select>
          </FormItem>
          <FormItem label="Api Data Url" name="apiDataUrl">
            <Input v-model:value="formState.apiDataUrl" />
          </FormItem>
          <FormItem label="Gis Data Key" name="gisDataKey">
            <Input v-model:value="formState.gisDataKey" />
          </FormItem>
          <FormItem label="Fields Map" name="fieldsMap">
            <div
              class="flex items-center mb-2"
              v-for="field in formState.fieldsMap"
              :key="field.id"
            >
              <Input v-model:value="field.key" class="w-30 mr-2" />
              =>
              <div>
                <Input v-model:value="field.value" class="w-30 ml-2 mr-3" />
                <Button @click="delField(field.id)">
                  <template #icon>
                    <CloseOutlined />
                  </template>
                </Button>
              </div>
            </div>
            <Button
              type="dashed"
              class="w-80"
              style="margin: 0; margin-top: 10px"
              @click="addField"
            >
              <PlusOutlined />
            </Button>
          </FormItem>
        </Form>
      </template>
    </Comment>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Comment, Form, Input, Select, Button, message } from 'ant-design-vue';
  import type { TreeProps } from 'ant-design-vue';
  import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { unref, ref, Ref, watch } from 'vue';
  import { FormState } from './data';
  import DictApi from '@/api/system/dict';
  import dataApi from '@/api/data/data.ts';
  import { deptInfoApi } from '@/api/system/dept';
  import map from '@/api/map/index';

  const FormItem = Form.Item;
  const formRef = ref<any>(null);
  const isUpdate = ref(true);
  const formState = ref<FormState>({
    id: '',
    layerName: '',
    url: '',
    type: '',
    gisDataUrl: [],
    gisDataKey: '',
    apiDataUrl: '',
    fieldsMap: [],
    deptList: [],
  });

  const addField = () => {
    formState.value.fieldsMap.push({
      key: '',
      value: '',
      id: Date.now(),
    });
  };
  const delField = (id) => {
    formState.value.fieldsMap = formState.value.fieldsMap.filter((item) => item.id != id);
  };

  const typeOptions = ref<any>([]);
  const getType = async (key = null) => {
    let { data } = await DictApi.ValueInfoApi({ pageSize: 999 });
    typeOptions.value = data.records
      .filter((record) => record.dictType === '图层类型')
      .map((record) => ({ label: record.describe || '', value: record.dictKey || '' }));
    console.log(data.records, typeOptions.value);
  };
  getType();

  const gisDataOptions = ref<any>([]);
  const getGISDataOpt = async () => {
    let {
      data: { records },
    } = await dataApi.dataListApi({ pageSize: 999 });
    gisDataOptions.value = records.map((item) => {
      return {
        label: item.dataSet,
        value: item.url,
      };
    });
  };
  getGISDataOpt();

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
  const getDidList = (params) => {
    let list: Array<Object> = [];
    const getId = (data) => {
      data.forEach((item) => {
        list.push(JSON.stringify({ did: item.did }));
        if (data.children && data.children.length > 0) {
          getId(data.children);
        }
      });
    };
    getId(params);
    return list;
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, minHeight: 156 });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      let record = JSON.parse(JSON.stringify(data.record));
      record.fieldsMap = JSON.parse(record.fieldsMap).map((item) => {
        return {
          key: [Object.keys(item)[0]],
          value: Object.values(item)[0],
        };
      });
      record.deptList = getDidList(record.deptList);
      record.gisDataUrl = record.gisDataUrl.length > 0 ? record.gisDataUrl.split(';') : [];
      Object.assign(formState.value, record);
    }
  });

  const rules: any = {
    layerName: [{ required: true, message: '名称不能为空!', trigger: 'blur' }],
    Url: [{ required: true, message: 'Url不能为空!', trigger: 'blur' }],
    type: [
      {
        required: true,
        message: '类型不能为空!',
        trigger: 'blur',
      },
    ],
    deptList: [
      {
        required: true,
        message: '部门不能为空!',
        trigger: 'blur',
      },
    ],
  };

  const handleSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        formState.value.deptList = formState.value.deptList.map((item) => JSON.parse(item));
        formState.value.fieldsMap = formState.value.fieldsMap.map((item) => {
          return {
            [item.key]: item.value,
          };
        });
        formState.value.gisDataUrl = formState.value.gisDataUrl.join(';');
        addOrEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emits = defineEmits(['success', 'register']);

  const addOrEdit = async () => {
    if (unref(isUpdate)) {
      let resp = await map.layerEditApi(formState.value);
      if (resp.succ == true) {
        message.success('修改成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    } else {
      let resp = await map.layerAddApi(formState.value);
      if (resp.succ == true) {
        message.success('添加成功');
        emits('success');
        closeModal();
      } else {
        message.error(resp.msg as string);
      }
    }
  };

  const selectType = (e) => {
    console.log(e);
  };
  const selectSection = (e) => {
    console.log(e);
  };
  const open = ref(false);
  watch(open, () => {
    if (!open.value) {
      formRef.value.resetFields();
      Object.assign(formState.value, {
        id: '',
        layerName: '',
        url: '',
        type: '',
        gisDataUrl: [],
        gisDataKey: '',
        apiDataUrl: '',
        fieldsMap: [],
        deptList: [],
      });
    }
  });
</script>
