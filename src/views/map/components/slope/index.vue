<script>
import useSlope from "./helper";

export default {
  name: "SlopeIndex",
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
      intance: null,
      allParmas: {
        clipMode: "calModeall_plane",
        colorTables: "1",
        wideMinR: 0,
        wideMaxR: 90,
        style: "showAll",
        trans: 0.5,
      },
    };
  },
  mounted() {},
  // unmounted() {
  //   this.intance?.clear?.();
  //   this.intance = null;
  // },
  watch: {
    allParmas: {
      deep: true,
      handler(val) {
        this.intance?.setPrams?.(val);
      },
    },
  },
  methods: {
    start() {
      this.intance ??= useSlope();
      this.intance.start(this.allParmas);
    },
    selectClass(val) {
      this?.intance?.selectClass?.(val);
    },
    clear() {
      this.intance?.clear?.();
      this.intance = null;
    },
  },
};
</script>

<template>
  <div style="text-align: center">
    <div style="display: flex; align-items: center">
      <el-button type="primary" @click="start">开始分析</el-button>
      <el-button type="primary" @click="clear">清除</el-button>
    </div>
    <el-form label-width="90px" label-position="right">
      <el-form-item label="计算模式" class="mb-0 mt-3">
        <el-radio-group
          size="small"
          v-model="allParmas.clipMode"
          @change="selectClass"
        >
          <el-radio-button label="calModeall_plane"
            >指定多边形区域</el-radio-button
          >
          <el-radio-button label="calModeall_any">全部区域</el-radio-button>
          <el-radio-button label="calModeall_none"
            >全部区域不参与分析</el-radio-button
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="坡度区间起" class="mb-0">
        <el-slider
          size="small"
          v-model="allParmas.wideMinR"
          :min="0"
          :max="90"
        ></el-slider>
      </el-form-item>

      <el-form-item label="坡度区间终" class="mb-0">
        <el-slider
          size="small"
          v-model="allParmas.wideMaxR"
          :min="0"
          :max="90"
        ></el-slider>
      </el-form-item>

      <el-form-item label="显示样式" class="mb-2">
        <el-radio-group size="small" v-model="allParmas.style">
          <el-radio-button label="showColor">显示填充颜色</el-radio-button>
          <el-radio-button label="showArrow">显示坡向箭头</el-radio-button>
          <el-radio-button label="showAll">填充颜色和坡向箭头</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="透明调节" class="mb-0">
        <el-input-number
          style="width: 100%"
          size="small"
          v-model="allParmas.trans"
          :min="0"
          :max="1"
          :step="0.1"
          :precision="1"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
