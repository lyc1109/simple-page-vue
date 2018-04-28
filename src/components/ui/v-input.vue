<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .mint-field{
    input, input[disabled], input[readonly]{
      color: $font-primary;
      -webkit-text-fill-color: $font-primary;
    }
  }
</style>

<template>
  <div>
    <mt-field
      class="padding-left padding-right"
      :label="label"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :state="computedState"
      :attr="computedAttrs"
      :value="value"
      v-model.trim="inputModel">
      <slot></slot>
    </mt-field>

    <div class="color-danger padding-s align-right font-s" v-show="computedError">{{ errorMsg }}</div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default{
    name: "form-field",
    props: {
      // 输入框name属性
      name: String,
      // 字段名
      label: String,
      // 字段默认值
      value: String,
      // 输入框类型
      type: String,
      // 输入框placehoder
      placeholder: String,
      // 额外属性
      attr: {
        type: Object,
        default: function () {
          return {};
        }
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 输入框行数，type为'textarea'时有效
      rows: String,
      // 校验错误提示语
      errorMsg: String
    },
    data: function () {
      return {
        inputModel: this.value
      }
    },
    computed: {
      computedAttrs: function () {
        return _.assign(this.attr, {
          'name': this.name
        })
      },

      computedState: function () {
        return this.computedError ? "error" : "";
      },

      computedError: function () {
        return typeof this.errorMsg !== "undefined" ? !(!(this.errorMsg !== null && this.errorMsg !== "")) : false;
      }
    },
    watch: {
      inputModel(val) {
        this.$emit('input', val);
      },

      value(val) {
        this.inputModel = val;
      }
    }
  }
</script>
