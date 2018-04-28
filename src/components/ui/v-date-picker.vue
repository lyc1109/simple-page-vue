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
    <a data-v-7db7761a="" class="mint-cell mint-field ripple padding-left padding-right" v-on:click="openPicker()">
      <div class="mint-cell-left"></div>
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title">
          <span class="mint-cell-text">{{ label }}</span>
        </div>
        <div class="mint-cell-value">
          <input type="text"
                 :name="name"
                 :placeholder="placeholder"
                 class="mint-field-core"
                 :value="computeDate"
                 ref="input"
                 readonly disabled>

          <i class="fa fa-angle-down font-lighter"></i>
        </div>
      </div>
      <div class="mint-cell-right"></div>
    </a>

    <mt-datetime-picker
      ref="datetimePicker"
      :type="type"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      :startDate="startDate"
      :endDate="endDate"
      :value="defaultVal"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
  import moment from "moment";

  export default{
    name: "v-date-picker",
    props: {
      // name: 输入框name属性
      name: String,
      // label: 字段文本
      label: String,
      // placeholder: 选择框默认显示内容
      placeholder: String,
      // value: 设置默认值
      defaultVal: String,
      // 用于绑定v-model
      vModel: String,

      format: {
        type: String,
        default: "YYYY-MM-DD"
      },
      // type: 日历类型，可选: 'date'，'datetime', 'time'
      type: {
        type: String,
        default: "date"
      },
      // startDate: 日期的最小可选值
      startDate: Date,
      // endDate: 日期的最大可选值
      endDate: Date,
      //点确定后的回调函数
      callback: Function
    },
    data: function () {
      return {
        date: ""
      };
    },
    computed: {
        computeDate: function () {
          if(this.date !== "") {
            return moment(this.date).format(this.format);
          }
          if(this.defaultVal !== ""){
              return moment(this.defaultVal).format(this.format);
          }
          return "";
        }
    },
    methods: {
      openPicker: function () {
        this.$refs.datetimePicker.open();
      },

      handleConfirm: function (secDate) {
        this.date = moment(secDate).format(this.format);
        this.$emit("input", this.date);
        if(this.callback) {
          this.callback(secDate);
        }
      }
    }
  }
</script>
