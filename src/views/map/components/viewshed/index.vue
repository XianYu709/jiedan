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
        direction: 120,
        pitch: 0,
        distance: 100.0,
        verticalFov: 50,
        horizontalFov: 60,
        visibleAreaColor: "#00ff00",
        invisibleAreaColor: "#ff0000",
      },
    };
  },
  mounted() {
    this.intance = useViewShed(this.formInline);
  },
  unmounted() {
    this.intance?.clear?.();
  },
  methods: {
    handleDraw() {
      this.intance.chooseView();
    },
    changeHandler(value, type) {
      // this?.intance?.updateAll?.(newVal);
      this?.intance?.updateByType?.(type, value);
    },
    handleClear() {
      this.intance?.clear?.();
    },
  },
};
</script>

<template>
  <div style="text-align: center">
    <el-form label-position="right" label-width="120px" :model="formInline">
      <el-form-item label="方向(度): ">
        <el-slider
          v-model="formInline.direction"
          :min="0"
          :max="360"
          :step="1.0"
          @change="(val) => changeHandler(val, 'direction')"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="翻转(度): ">
        <el-slider
          v-model="formInline.pitch"
          :min="-90"
          :max="90"
          :step="1.0"
          @change="(val) => changeHandler(val, 'pitch')"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="距离(米): ">
        <el-slider
          v-model="formInline.distance"
          :min="1"
          :max="100000"
          :step="1.0"
          @change="(val) => changeHandler(val, 'distance')"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="水平视场角(度): ">
        <el-slider
          v-model="formInline.horizontalFov"
          @change="(val) => changeHandler(val, 'horizontalFov')"
          :min="1"
          :max="120"
          :step="1.0"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="垂直视场角(度): ">
        <el-slider
          v-model="formInline.verticalFov"
          @change="(val) => changeHandler(val, 'verticalFov')"
          :min="1"
          :max="90"
          :step="1.0"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="可见区域颜色: ">
        <el-color-picker
          v-model="formInline.visibleAreaColor"
          style="margin-left: -260px"
          @change="(val) => changeHandler(val, 'visibleAreaColor')"
        />
      </el-form-item>
      <el-form-item label="不可见区域颜色: ">
        <el-color-picker
          v-model="formInline.invisibleAreaColor"
          @change="(val) => changeHandler(val, 'invisibleAreaColor')"
          style="margin-left: -260px"
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="handleDraw">绘制</el-button>
    <el-button size="small" @click="handleClear">清空</el-button>
  </div>
</template>

<style scoped lang="scss"></style>
