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
      labelPosition: "right",
      clipMode: "",
      colorTables: "",
      wideMinR: 0,
      wideMaxR: 0,
      style: "",
      trans: 0.5,
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
  mounted() {},
  methods: {
    start() {
      this.intance ??= useSlope();
      const { intance, ...other } = this;
      console.log(intance);
      this.intance.start(other);
    },
    clear() {
    },
  },
};
</script>

<template>
  <BaseCard
    v-if="computedVisible"
    :visible.sync="computedVisible"
    title="坡度分析"
    class-name="interVisibility-container"
    top="350px"
    width="510px"
    left="65%"
    show-close
  >
    <div style="text-align: center">
      <div>
        <el-button type="primary" @click="start">开始分析</el-button>
        <el-button type="primary" @click="clear">清除</el-button>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="90px"
        label-position="right"
      >
        <slot name="clipMode">
          <el-form-item label="计算模式" class="mb-0 mt-3">
            <el-radio-group
              size="small"
              v-model="clipMode"
              @change="selectClass(clipMode)"
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
        </slot>

        <slot name="wideMinR">
          <el-form-item label="坡度区间起" class="mb-0">
            <el-slider
              size="small"
              v-model="wideMinR"
              :min="-9999"
              :max="9999"
            ></el-slider>
          </el-form-item>
        </slot>

        <slot name="wideMaxR">
          <el-form-item label="坡度区间终" class="mb-0">
            <el-slider
              size="small"
              v-model="wideMaxR"
              :min="-9999"
              :max="9999"
            ></el-slider>
          </el-form-item>
        </slot>

        <slot name="showStyle">
          <el-form-item label="显示样式" class="mb-2">
            <el-radio-group size="small" v-model="style">
              <el-radio-button label="showColor">显示填充颜色</el-radio-button>
              <el-radio-button label="showArrow">显示坡向箭头</el-radio-button>
              <el-radio-button label="showAll"
                >填充颜色和坡向箭头</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </slot>

        <slot name="colorTables">
          <el-form-item label="颜色条带" class="mb-2">
            <el-radio-group
              size="small"
              v-model="colorTables"
              @change="selectColor(colorTables)"
            >
              <el-radio-button label="1">颜色1</el-radio-button>
              <el-radio-button label="2">颜色2</el-radio-button>
              <el-radio-button label="3">颜色3</el-radio-button>
              <el-radio-button label="4">颜色4</el-radio-button>
              <el-radio-button label="5">颜色5</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </slot>

        <slot name="trans">
          <el-form-item label="透明调节" class="mb-0">
            <el-input-number
              style="width: 100%"
              size="small"
              v-model="trans"
              :min="0"
              :max="1"
              :step="0.1"
              :precision="1"
            ></el-input-number>
          </el-form-item>
        </slot>
      </el-form>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss"></style>
