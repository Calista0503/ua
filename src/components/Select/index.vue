<template>
  <!-- 筛选下拉框封装  -->
  <el-form-item :label="`${title}`" :rules="rules" :prop="prop">
    <el-select
      v-if="!multiple"
      @change="hanldeValueChange"
      v-model="id"
      :multiple="multiple"
      clearable
      filterable
      :placeholder="$t('message.please_input')"
      :disabled="disabled"
    >
      <el-option
        v-for="item of options"
        :key="item.id"
        :label="item.id+(item.name?` > ${item.name}`:'')"
        :value="item.id"
      ></el-option>
    </el-select>
    <!-- 多选用more-select -->
    <more-select
      v-if="multiple"
      v-model="id"
      show-name="name"
      :data-list="options"
      @change="hanldeValueChange"
    ></more-select>
  </el-form-item>
</template>

<script>
import MoreSelect from "../MoreSelete/index";

export default {
  components: {
    MoreSelect
  },
  name: "MySelect",
  props: {
    title: {
      type: String,
      required: true
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      }
    },
    prop: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 所有选项
    options: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {}
  },
  data() {
    return {
      id: null
    };
  },
  methods: {
    hanldeValueChange() {
      this.$emit("change", this.id);
    }
  },
  watch: {
    value: {
      handler: function(val,old) {
        if (val !== this.id) {
          this.id = val;
        }
      },
      immediate: true
    }
  }
};
</script>