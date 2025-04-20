<template>
  <div>
    <div class="text-[14px] mt-3 mb-1">目标位置：</div>
    <Row>
      <Radio.Group v-model:value="status">
        <Radio.Button v-for="item in list" :key="item" :value="item" @click="clickHandler(item)">
          {{ item }}
        </Radio.Button>
      </Radio.Group>
    </Row>

    <Table
      class="mt-1"
      row-key="id"
      :row-selection="rowSelection"
      :data-source="dataSource"
      :columns="columns"
      :pagination="{ pageSize: 5 }"
    />

    <div class="text-[14px] mt-3 mb-1 flex items-center justify-between">
      避让风险区域：
      <Select
        :disabled="!rowSelect"
        class="w-[160px]"
        v-model:value="avoid"
        :options="avoidOptions"
        @change="avoidHandler"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Row, Radio, Table, Select } from 'ant-design-vue';
  import emergency from '@/api/emergency/emergency';
  import riskyArea from '@/api/emergency/dangerous';
  const props = defineProps<{
    params: Record<string, any>;
  }>();

  const emit = defineEmits<{
    (e: 'select', val: any): void;
    (e: 'avoid', val: any): void;
  }>();

  const status = ref('');
  const dataSource = ref<any[]>([]);
  const list = ['医院', '防空洞', '避难所', '消防站'];

  const clickHandler = async (v: string) => {
    status.value = v;
    const { data } = await emergency.dataEmergencyListApi({ pageSize: 999, type: v });
    dataSource.value = data.records || [];
  };

  const rowSelect = ref('');
  const rowSelection = {
    type: 'radio',
    onChange: (v: any, it: any) => {
      rowSelect.value = v;
      emit('select', it);
    },
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const avoid = ref(null);
  const avoidOptions = ref<any[]>([]);

  const avoidData = async () => {
    const { data } = await riskyArea.riskyAreaListApi();
    avoidOptions.value = data.records
      ?.map((item: any) => ({ label: item.name, value: JSON.stringify(item.area) }))
      .filter((item: any) => item.label !== props.params.name);
  };

  watch(() => props.params, avoidData, { immediate: true, deep: true });

  const avoidHandler = (v: any) => {
    emit('avoid', v);
    avoid.value = v;
  };
</script>
