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


      labelPosition: 'right',
      clipMode: '',
      colorTables: '',
      parameter: {
        wideMinR: 0,
        wideMaxR: 0,
        style: '',
        trans: 0.5
      }
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
      this.intance = useViewShed(this.formInline)
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


      <el-form :label-position="labelPosition" label-width="80px">
        <slot name="clipMode">
          <el-form-item label="计算模式" class="mb-0 mt-3">
            <el-radio-group size="small" v-model="clipMode" @change="selectClass(clipMode)">
              <el-radio-button label="calModeall_plane">指定多边形区域</el-radio-button>
              <el-radio-button label="calModeall_any">全部区域</el-radio-button>
              <el-radio-button label="calModeall_none">全部区域不参与分析</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </slot>

        <slot name="wideMinR">
          <el-form-item label="坡度区间起" class="mb-0">
            <el-slider
              size="small"
              v-model="parameter.wideMinR"
              :min="-9999"
              :max="9999"
            ></el-slider>
          </el-form-item>
        </slot>

        <slot name="wideMaxR">
          <el-form-item label="坡度区间终" class="mb-0">
            <el-slider
              size="small"
              v-model="parameter.wideMaxR"
              :min="-9999"
              :max="9999"
            ></el-slider>
          </el-form-item>
        </slot>

        <slot name="showStyle">
          <el-form-item label="显示样式" class="mb-2">
            <el-radio-group size="small" v-model="parameter.style">
              <el-radio-button label="showColor">显示填充颜色</el-radio-button>
              <el-radio-button label="showArrow">显示坡向箭头</el-radio-button>
              <el-radio-button label="showAll">填充颜色和坡向箭头</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </slot>

        <slot name="colorTables">
          <el-form-item label="颜色条带" class="mb-2">
            <el-radio-group size="small" v-model="colorTables" @change="selectColor(colorTables)">
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
              v-model="parameter.trans"
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
