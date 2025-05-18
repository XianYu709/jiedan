<template>
  <router-view :key="key" />
</template>

<script>
export default {
  name: 'MapLayout',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.map-main {
  height: calc(100vh - 59px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
