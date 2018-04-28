<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .selector-popup {
    width: 100%;

    .selector-header {
      @extend %padding;
      @include border(bottom);
      background-color: $page_bg;
    }
  }

  .mint-field{
    input, input[disabled], input[readonly]{
      color: $font-primary;
      -webkit-text-fill-color: $font-primary;
    }
  }
</style>

<template>
  <div>
    <a class="mint-cell mint-field ripple padding-left padding-right" v-on:click="isShow = true">
      <div class="mint-cell-left"></div>
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title">
          <span class="mint-cell-text">{{ label }}</span>
        </div>
        <div class="mint-cell-value">
          <input :placeholder="placeholder"
                 :name="name"
                 type="text" class="mint-field-core" readonly disabled
                 :value="selectedLabel">
          <i class="fa fa-angle-down font-lighter"></i>
        </div>
      </div>
      <div class="mint-cell-right"></div>
    </a>

    <mt-popup
      class="selector-popup"
      v-model="isShow"
      position="bottom">
      <div class="selector">
        <mt-picker
          :slots="computedSlots"
          :valueKey="labelKey"
          :showToolbar="showToolbar"
          @change="onValuesChange">
          <div class="selector-header flex">
            <div class="flex-item">
              <button type="button" class="btn btn-sm" @click="isShow=false">取消</button>
            </div>
            <div class="flex-item align-right">
              <button type="button" class="btn btn-sm btn-primary" @click="onOk()">确定</button>
            </div>
          </div>
        </mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default{
    name: "v-selector",
    props: {
      // name: 输入框name属性
      name: String,
      // label: 字段文本
      label: String,
      // placeholder: 选择框默认显示内容
      placeholder: String,
      // value: 设置默认值
      value: String,
      // data: 数据列表
      data: Array,
      // labelKey: data为对象数组时，指定显示文本的key
      labelKey: {
        type: String,
        default: 0
      },
      // valKey:  data为对象数组时，获取选中数据的值key
      valKey: {
        type: String,
        default: 0
      },
      //点确定后回调函数
      callback: Function
    },
    data: function () {
      return {
        isShow: false,
        showToolbar: true,
        selectedLabel: '',
        selectedVal: ''
      };
    },
    created() {
      let that = this;
      that.$nextTick(() => {
        if(!that.selectedVal) {
          let _data = that.data;
          that.selectedLabel = _data[that.labelKey];
          that.selectedVal = _data[that.valKey];
          that.$emit('input', that.selectedVal);
        }
      })
    },
    computed: {
      computedSlots: function () {
        return [{
          flex: 1,
          values: this.data,
          defaultIndex: this.computeDefaultIndex
        }];
      },
      computeDefaultIndex: function () {
        if (this.value === "") {
          return 0;
        }

        const that = this;
        return _.findIndex(this.data, function (obj) {
          if (typeof obj === "object" && that.valKey !== "") {
            return obj[that.valKey] === that.value;
          } else {
            return obj === that.value
          }
        });
      },
    },
    methods: {
      onValuesChange: function (picker, selectedDatas) {
        const data = selectedDatas && selectedDatas[0];
        if (typeof data === "object" && this.valKey !== "") {
          this.selectedLabel = data[this.labelKey];
          this.selectedVal = data[this.valKey];
        } else {
          this.selectedLabel = data;
          this.selectedVal = data;
        }
        this.$emit('input', this.selectedVal);
      },
      onOk: function () {
        this.isShow = false;
        this.$emit('input', this.selectedVal);
        if(this.callback) {
          this.callback(this.selectedVal);
        }
      }
    }
  }
</script>
