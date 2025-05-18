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
  computed: {
    computedVisible: {
      get() {
        if (this.visible) {
          this.intance = useInterVisibility();
        } else {
          this?.intance?.clear?.();
        }
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  mounted() {},
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
  <BaseCard
    v-if="computedVisible"
    :visible.sync="computedVisible"
    title="通视分析"
    class-name="interVisibility-container"
    top="350px"
    show-close
  >
    <div style="text-align: center">
      <el-button plain type="primary" size="small" @click="addViewPoint"
        >添加观察点</el-button
      >
      <el-button type="primary" size="small" @click="addTargetPoint"
        >添加目标点</el-button
      >
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss"></style>
