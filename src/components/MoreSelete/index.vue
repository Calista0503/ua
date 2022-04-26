<template>
  <div class="moreSelete">
    <el-input
      :placeholder="checkedLists.length?`${checkedListNames}`:$t('message.please_input')"
      v-model="inputVal"
      @input="filterVal"
      :class="checkedLists.length?`color-black`:''"
    >
      <el-popover
        slot="append"
        placement="bottom-end"
        width="200"
        trigger="click"
        v-model="visible"
      >
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
        >{{$t('message.select_all')}} （{{checkedLists.length + ` ${$t('message.selected')}`}}）</el-checkbox>
        <div class="more-select-line"></div>
        <div style="max-height: 270px;overflow: scroll" class="more-select-pup">
          <el-checkbox-group v-model="checkedLists" @change="CheckChange">
            <el-checkbox v-for="item in MoreList" :label="item" :key="item.id">{{item[showName]}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <i slot="reference" class="el-icon-arrow-down click-icon"></i>
      </el-popover>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "moresele",
  data() {
    return {
      inputVal: "",
      visible: false,
      checkAll: false,
      checkedLists: [],
      checkedListNames: [],
      inputIds: []
    };
  },
  props: {
    dataList: {
      type: Array
    },
    showName: {
      type: String
    },
    value: {}
  },
  computed: {
    MoreList() {
      return this.dataList.filter(item => {
        return item[this.showName].indexOf(this.inputVal) > -1;
      });
    }
  },
  methods: {
    clear() {
      (this.visible = false), (this.inputVal = "");
      this.inputIds = [];
      this.checkedListNames = [];
      this.checkedLists = [];
      this.checkAll = false;
    },
    handleCheckAll(val) {
      this.checkedLists = val
        ? [...new Set([...this.checkedLists, ...this.MoreList])]
        : [];
      this.checkedListNames = [];
      this.inputIds = [];
      this.checkedLists.map(item => {
        this.checkedListNames.push(item[this.showName]);
        this.inputIds.push(item.id.toString());
      });
      this.$emit("input", this.inputIds);
      this.$emit("change", this.inputIds);
    },
    CheckChange() {
      this.checkedListNames = [];
      this.inputIds = [];
      this.checkedLists.map(item => {
        this.checkedListNames.push(item[this.showName]);
        this.inputIds.push(item.id.toString());
      });
      this.$emit("input", this.inputIds);
      this.$emit("change", this.inputIds);
    },
    filterVal() {
      this.visible = true;
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.inputVal = "";
      }
    },
    value(val) {
      if (!val || (val && val.length === 0)) {
        this.clear();
      }
    }
  }
};
</script>

<style lang="scss">
.more-select-pup {
  padding-bottom: 10px;
  .el-checkbox-group {
    label.el-checkbox {
      margin-left: 0;
      width: 100%;
      line-height: 24px;
    }
  }
  .el-checkbox {
    display: block;
  }
}
.moreSelete {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0px;
  }
  .click-icon {
    padding: 7px 10px;
  }
}
.more-select-line {
  height: 1px;
  margin: 2px 0;
  background: #dcdfe6;
}
</style>
