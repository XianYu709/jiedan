<script>
import UdpHelper from './helper'

let helper

export default {
  name: 'UDPIndex',
  mounted() {
    helper = new UdpHelper(window.viewer)
    this.init()
  },
  methods: {
    init() {
      helper?.open()
    }
  }
}
</script>

<template>
  <div />
</template>

<style scoped lang="scss">

</style>
