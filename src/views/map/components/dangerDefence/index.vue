<script>
import AirDefenceHelper from '@/views/map/components/airDefence/helper'
import EletismHelper from '@/views/map/components/eletism/helper'

let airDefenceHelper, eletismHelper

export default {
  name: 'DangerDefenceIndex',
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    airDefenceHelper = new AirDefenceHelper(window.viewer)
    // eletismHelper = new EletismHelper(window.viewer)
    this.handleRefresh()
  },
  beforeDestroy() {
    airDefenceHelper?.destroy()
    eletismHelper?.destroy()
  },
  methods: {
    handleRefresh(type) {
      this.handleClear(type);
      (type === undefined || type === 'airDefence') && airDefenceHelper?.search({ pageInfo: this.pageInfo });
      (type === undefined || type === 'eletism') && eletismHelper?.search({ pageInfo: this.pageInfo });
    },
    handleClear(type) {
      (type === undefined || type === 'airDefence') && airDefenceHelper?.clear();
      (type === undefined || type === 'eletism') && eletismHelper?.clear();
    }
  }
}
</script>

<template>
  <div class="danger-defence-container">
<!--    <el-form label-width="80px" size="small">
      <el-form-item label="防空预警">
        <el-button type="primary" @click="handleRefresh('airDefence')">刷新</el-button>
        <el-button @click="handleClear('airDefence')">清空</el-button>
      </el-form-item>
      <el-form-item label="电磁辐射威胁">
        <el-button type="primary" @click="handleRefresh('eletism')">刷新</el-button>
        <el-button @click="handleClear('eletism')">清空</el-button>
      </el-form-item>
    </el-form>-->
    <div style="text-align: center;">
      <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
