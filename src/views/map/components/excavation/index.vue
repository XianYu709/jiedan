<script>
import { useKW, useCC } from "./helper";

export default {
  name: "ExcavationIndex",
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
      intanceCC: null,
      intanceKW: null,
      type: null,
      depth: 100,
      moveHeight: 700,
    };
  },
  mounted() {},
  beforeMount() {
    this?.intanceCC?.clear?.();
    this?.intanceKW?.clear?.();
  },
  methods: {
    typeChange() {
      this?.intanceCC?.clear?.();
      this?.intanceKW?.clear?.();
      this.intanceKW ??= useKW();
      this.intanceCC ??= useCC();
    },
    start() {
      if (this.type == "地形抽出") {
        this.intanceCC.start(this.depth, this.moveHeight);
      }
      if (this.type == "地形开挖") {
        this.intanceKW.start(this.depth);
      }
    },
    clear() {
      if (this.type == "地形抽出") {
        this.intanceCC.clear();
      }
      if (this.type == "地形开挖") {
        this.intanceKW.clear();
      }
    },
  },
};
</script>

<template>
  <div style="text-align: center">
    <div class="flex-between mb-16">
      <el-radio-group v-model="type" @change="typeChange">
        <el-radio-button type="primary" label="地形抽出" />
        <el-radio-button type="primary" label="地形开挖" />
      </el-radio-group>
      <div>
        <el-button type="primary" plain @click="start">开始</el-button>
        <el-button type="error" @click="clear">清除</el-button>
      </div>
    </div>
    <template v-if="type">
      <div class="flex-between mb-10">
        开挖深度(米)：
        <el-input
          v-model="depth"
          style="width: 70%"
          type="number"
          size="small"
        />
      </div>
      <div v-if="type === '地形抽出'" class="flex-between">
        上移高度(米)：
        <el-input
          v-model="moveHeight"
          style="width: 70%"
          type="number"
          size="small"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-16 {
  margin-bottom: 16px;
}
</style>
