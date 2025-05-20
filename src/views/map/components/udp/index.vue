<script>
import UdpHelper from './helper'

let helper

const STATE = {
  WAIT: { code: 'wait', type: 'warning', message: '连接中' },
  CONNECT: { code: 'connect', type: 'success', message: '连接成功' },
  ERROR: { code: 'error', type: 'danger', message: '连接失败' },
  CLOSE: { code: 'close', type: 'info', message: '未连接' }
}

export default {
  name: 'UDPIndex',
  data() {
    return {
      state: STATE.CLOSE,
      result: null
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    helper?.close()
  },
  methods: {
    init() {
      helper = new UdpHelper(window.viewer, {
        onConnect: this.handleOnOpen,
        onMessage: this.handleOnMessage,
        onClose: this.handleOnClose,
        onError: this.handleOnError
      })
    },
    handleOpen() {
      this.state = STATE.WAIT
      helper?.open()
    },
    handleClose() {
      helper?.close()
    },
    handleReconnect() {
      this.state = STATE.WAIT
      helper?.open()
    },
    handleClear() {
      this.result = null
    },
    handleOnOpen() {
      this.state = STATE.CONNECT
    },
    handleOnMessage(data) {
      this.result = JSON.stringify(data)
      // console.log('udp result =', this.result)
    },
    handleOnError() {
      this.state = STATE.ERROR
    },
    handleOnClose() {
      this.state = STATE.CLOSE
    }
  }
}
</script>

<template>
  <div>
    <el-form label-width="80px" size="small">
      <el-form-item label="连接状态">
        <el-tag :type="state.type" :underline="false" style="margin-right: 20px;">{{ state.message }}</el-tag>
        <el-button v-show="state.code === 'wait'" type="primary" loading disabled>正在连接</el-button>
        <el-button v-show="state.code === 'close'" type="primary" @click="handleOpen">请求连接</el-button>
        <el-button v-show="state.code === 'connect'" type="primary" @click="handleClose">断开连接</el-button>
        <el-button v-show="state.code === 'error'" type="primary" @click="handleReconnect">重新连接</el-button>
      </el-form-item>
      <el-form-item label="响应结果">
        <el-input v-model="result" type="textarea" :rows="10" />
      </el-form-item>
    </el-form>
    <div style="text-align:center;">
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
