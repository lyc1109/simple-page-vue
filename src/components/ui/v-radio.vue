<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-radio /deep/ {
    .mint-radiolist .mint-cell{
      margin-right: 5px;
    }
  }
</style>

<template>
  <div class="v-radio">
    <mt-radio :options="options" :title="title" :align="align" v-model="value"></mt-radio>
  </div>
</template>

<script>
  export default {
    name: 'v-radio',
    props: {
      // 单选框绑定值
      value: {
        type: Object,
        default: ""
      },
      // 单选框title
      title: {
        type: String,
        default: ""
      },
      // 单选框对齐方式: left | right
      align: {
        type: String,
        default: "left"
      },
      // 单选项数据数组，例：[{label: '选项一', value: 'val1'}，{label: '选项二', value: 'val2'}]
      options: {
        type: Array,
        default: []
      },
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>
