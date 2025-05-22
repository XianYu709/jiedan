<script>
import AirDefenceHelper from './helper'

let helper

export default {
  name: 'AirDefence',
  data() {
    return {
      pageNum: 1,
      pageSize: 999,
      result: { items: [], totalNum: 0 },
      loading: false
    }
  },
  mounted() {
    this.handleRefresh()
  },
  methods: {
    handleRefresh() {
      this.handleClear()
      this.search(1)
    },
    // handleCurrentChange() {
    //   this.search(this.pageNum)
    // },
    handleClear() {
      this.result = { data: [], total: 0 }
      helper?.clear()
    },
    // handleFlyTo(id) {
    //   helper?.flyTo(id)
    // },
    search(pageNum) {
      this.loading = true
      this.pageNum = pageNum
      if (!helper) {
        helper = new AirDefenceHelper(window.viewer)
      }
      helper.search({ pageInfo: { pageNum, pageSize: this.pageSize }}).then(data => {
        this.result = data || { items: [], totalNum: 0 }
        this.loading = false
        console.log('result =', data)
      })
    }
  }
}
</script>

<template>
  <div class="air-defence-container">
    <div style="text-align: center;">
      <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.air-defence-container {
  .el-pagination.card-pagination {
    text-align: right;
    ::v-deep {
      .btn-prev, .btn-next, .el-pager li {
        background: none;
      }
    }
  }
}
</style>
