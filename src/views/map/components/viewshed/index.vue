<script>
import useViewShed from "./helper";

export default {
  name: "ViewshedIndex",
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
      formInline: {
        direction: 1.0,
        pitch: 1.0,
        distance: 1.0,
        verticalFov: 1.0,
        horizontalFov: 1.0,
        visibleAreaColor: "#00ff00",
        invisibleAreaColor: "#ff0000",
      },
    };
  },
  computed: {
    computedVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  mounted() {
  },
  methods: {
    handleDraw() {
      this.intance = useViewShed(this.formInline);
      this.intance.chooseView();
    },
    handleClear() {
      this.intance?.clear?.();
    },
  },
};
</script>

<template>
  <BaseCard
    v-if="computedVisible"
    :visible.sync="computedVisible"
    width="460px"
    title="可视域分析"
    class-name="viewshed-container"
    show-close
  >
    <div style="text-align: center">
      <el-form label-position="right" label-width="120px" :model="formInline">
        <el-form-item label="方向(度): ">
          <el-slider v-model="formInline.direction" :min="0" :max="360" :step="1.0" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="翻转(度): ">
          <el-slider v-model="formInline.pitch" :min="-90" :max="90" :step="1.0" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="距离(米): ">
          <el-slider :min="1" :max="500" :step="1.0" v-model="formInline.distance" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="水平视场角(度): ">
          <el-slider :min="1" :max="120" :step="1.0" v-model="formInline.horizontalFov" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="垂直视场角(度): ">
          <el-slider :min="1" :max="90" :step="1.0" v-model="formInline.verticalFov" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="可见区域颜色: ">
          <el-color-picker
            v-model="formInline.visibleAreaColor"
            style="margin-left: -260px"/>
        </el-form-item>
        <el-form-item label="不可见区域颜色: ">
          <el-color-picker
            v-model="formInline.invisibleAreaColor"
            style="margin-left: -260px"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="handleDraw">绘制
      </el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss"></style>
