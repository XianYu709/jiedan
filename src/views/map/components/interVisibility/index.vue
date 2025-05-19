<script>
import useInterVisibility from "./helper";

export default {
  name: "InterVisibilityIndex",
  components: {
    BaseCard: () => import("../card.vue"),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      intance: {},
    };
  },
  mounted() {
    this.intance = useInterVisibility();
  },
  unmounted() {
    this?.intance?.clear?.();
  },
  methods: {
    addViewPoint() {
      this.intance.addViewPoint();
    },
    addTargetPoint() {
      this.intance.addTargetPoint();
    },
    handleClear() {
      this?.intance?.clear?.();
    },
  },
};
</script>

<template>
  <div style="text-align: center">
    <el-button plain type="primary" size="small" @click="addViewPoint"
      >添加观察点</el-button
    >
    <el-button type="primary" size="small" @click="addTargetPoint"
      >添加目标点</el-button
    >
    <el-button size="small" @click="handleClear">清空</el-button>
  </div>
</template>

<style scoped lang="scss"></style>
